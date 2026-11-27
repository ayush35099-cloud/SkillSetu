import re
import secrets
from datetime import datetime
from flask import Blueprint, jsonify, request, current_app, g
from sqlalchemy import text, desc
from sqlalchemy.exc import SQLAlchemyError
from . import db
from .migrations import sanitize_db_error
from .models import (
    User,
    AssessmentTask,
    AssessmentRubric,
    AssessmentSubmission,
    AssessmentReview,
    AssessmentCriterionResult,
    SkillCredential,
    ContractorProfile,
    JobPosting,
    JobApplication,
    ContactRequest
)
from .auth import generate_token, require_auth

# Blueprints
main_bp = Blueprint("main", __name__)
api_bp = Blueprint("api", __name__, url_prefix="/api")
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
task_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")
assessor_bp = Blueprint("assessor", __name__, url_prefix="/api/assessor")
worker_bp = Blueprint("worker", __name__, url_prefix="/api/worker")
contractor_bp = Blueprint("contractor", __name__, url_prefix="/api/contractor")
admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


# ============================================================================
# Root & Health Endpoints
# ============================================================================

@main_bp.route("/", methods=["GET"])
def root():
    return jsonify({
        "message": "Welcome to SkillSetu API",
        "service": "SkillSetu Backend",
        "version": "1.2.0 (Phase 4: Contractor Hub & Direct Hiring Marketplace)",
        "endpoints": {
            "root": "/",
            "health": "/api/health",
            "db_health": "/api/health/db",
            "auth": "/api/auth/*",
            "tasks": "/api/tasks",
            "assessor": "/api/assessor/*",
            "worker": "/api/worker/*",
            "contractor": "/api/contractor/*",
            "admin": "/api/admin/*"
        }
    }), 200

@api_bp.route("/health", methods=["GET"])
def health():
    db_uri = current_app.config.get("SQLALCHEMY_DATABASE_URI")
    if db_uri and not current_app.config.get("DB_INITIALIZED", False):
        return jsonify({
            "status": "unhealthy",
            "service": "SkillSetu Backend",
            "message": "Database initialization incomplete",
            "timestamp": datetime.utcnow().isoformat()
        }), 503

    return jsonify({
        "status": "healthy",
        "service": "SkillSetu Backend",
        "phase": "Phase 4 – Contractor Hub & Direct Hiring Marketplace",
        "timestamp": datetime.utcnow().isoformat()
    }), 200


@api_bp.route("/health/db", methods=["GET"])
def health_db():
    db_uri = current_app.config.get("SQLALCHEMY_DATABASE_URI")
    
    if not db_uri:
        return jsonify({
            "status": "unconfigured",
            "database": "PostgreSQL",
            "message": "DATABASE_URL is not configured"
        }), 200

    db_label = "PostgreSQL" if "postgresql" in (db_uri or "") else "SQLite"
    try:
        with db.engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        if not current_app.config.get("DB_INITIALIZED", False):
            return jsonify({
                "status": "error",
                "database": db_label,
                "message": "Database schema initialization failed"
            }), 503

        return jsonify({
            "status": "connected",
            "database": db_label,
            "message": "Database connection successful",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        current_app.logger.error(f"Database health check failed: {sanitize_db_error(e)}")
        return jsonify({
            "status": "error",
            "database": db_label,
            "message": "Database connection failed"
        }), 503


# ============================================================================
# Authentication Endpoints
# ============================================================================

@auth_bp.route("/assessor/register", methods=["POST"])
def assessor_register():
    data = request.get_json() or {}
    
    full_name = data.get("full_name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    qualification = data.get("professional_qualification", "").strip()
    specialisation = data.get("specialisation", "electrician").strip()
    experience = data.get("years_of_experience", 0)

    if not full_name or not email or not password:
        return jsonify({
            "status": "error",
            "message": "Full name, email address, and password are required."
        }), 400

    if len(password) < 6:
        return jsonify({
            "status": "error",
            "message": "Password must be at least 6 characters long."
        }), 400

    # Basic email format validation
    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
        return jsonify({
            "status": "error",
            "message": "Invalid email address format."
        }), 400

    # Check for existing user
    if User.query.filter_by(email=email).first():
        return jsonify({
            "status": "error",
            "message": "An account with this email address already exists."
        }), 409

    try:
        experience_val = int(experience)
    except (ValueError, TypeError):
        experience_val = 0

    user = User(
        full_name=full_name,
        email=email,
        role="assessor",
        professional_qualification=qualification or "Certified Vocational Assessor",
        years_of_experience=experience_val,
        specialisation=specialisation,
        verification_status="pending"  # Requires admin approval
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id, user.role)

    return jsonify({
        "status": "success",
        "message": "Assessor account registered successfully. Your account is pending administrative verification before final evaluations can be submitted.",
        "token": token,
        "user": user.to_dict()
    }), 201


def _authenticate_login(allowed_roles, invalid_msg, role_error_fn, success_msg):
    """Shared credential verification flow with safe SQLAlchemy error handling."""
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email and password are required."
        }), 400

    try:
        user = User.query.filter_by(email=email).first()
    except SQLAlchemyError as exc:
        current_app.logger.error(f"Authentication query failed: {sanitize_db_error(exc)}")
        return jsonify({
            "status": "error",
            "message": "Authentication service temporarily unavailable. Please try again shortly."
        }), 503

    if not user or not user.check_password(password):
        return jsonify({
            "status": "error",
            "message": invalid_msg
        }), 401

    if allowed_roles and user.role not in allowed_roles:
        return jsonify({
            "status": "error",
            "message": role_error_fn(user.role)
        }), 403

    token = generate_token(user.id, user.role)
    return jsonify({
        "status": "success",
        "message": success_msg,
        "token": token,
        "user": user.to_dict()
    }), 200


@auth_bp.route("/assessor/login", methods=["POST"])
def assessor_login():
    return _authenticate_login(
        allowed_roles=["assessor", "admin"],
        invalid_msg="Invalid email address or password.",
        role_error_fn=lambda r: f"Account with role '{r}' cannot log into the Assessor Portal.",
        success_msg="Login successful.",
    )


@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    return _authenticate_login(
        allowed_roles=["admin"],
        invalid_msg="Invalid administrator credentials.",
        role_error_fn=lambda _r: "Access restricted. Administrator privileges required.",
        success_msg="Admin login successful.",
    )


@auth_bp.route("/worker/register", methods=["POST"])
def worker_register():
    data = request.get_json() or {}

    full_name = data.get("full_name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    phone = data.get("phone", "").strip()
    trade = data.get("trade", "").strip() or data.get("specialisation", "electrician").strip()
    experience = data.get("years_of_experience", 0)
    location = data.get("location", "").strip() or "India"

    if not full_name or not email or not password:
        return jsonify({
            "status": "error",
            "message": "Full name, email address, and password are required."
        }), 400

    if len(password) < 6:
        return jsonify({
            "status": "error",
            "message": "Password must be at least 6 characters long."
        }), 400

    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
        return jsonify({
            "status": "error",
            "message": "Invalid email address format."
        }), 400

    if User.query.filter_by(email=email).first():
        return jsonify({
            "status": "error",
            "message": "An account with this email address already exists."
        }), 409

    try:
        experience_val = int(experience)
    except (ValueError, TypeError):
        experience_val = 0

    user = User(
        full_name=full_name,
        email=email,
        phone=phone,
        location=location,
        role="worker",
        specialisation=trade,
        years_of_experience=experience_val,
        verification_status="approved"
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id, user.role)

    return jsonify({
        "status": "success",
        "message": f"Worker account created successfully for {full_name}!",
        "token": token,
        "user": user.to_dict()
    }), 201


@auth_bp.route("/worker/login", methods=["POST"])
def worker_login():
    return _authenticate_login(
        allowed_roles=["worker", "admin"],
        invalid_msg="Invalid email address or password.",
        role_error_fn=lambda r: f"Account with role '{r}' cannot log into the Worker Portal.",
        success_msg="Worker login successful.",
    )


@auth_bp.route("/login", methods=["POST"])
def universal_login():
    """Universal login endpoint supporting workers, assessors, and admins."""
    return _authenticate_login(
        allowed_roles=None,
        invalid_msg="Invalid email address or password.",
        role_error_fn=lambda r: f"Role '{r}' is not permitted.",
        success_msg="Login successful.",
    )


@auth_bp.route("/me", methods=["GET"])
@require_auth()
def auth_me():
    return jsonify({
        "status": "success",
        "user": g.current_user.to_dict()
    }), 200


@auth_bp.route("/contractor/register", methods=["POST"])
def contractor_register():
    data = request.get_json() or {}

    full_name = data.get("full_name", "").strip()
    company_name = data.get("company_name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    phone = data.get("phone", "").strip()
    business_address = data.get("business_address", "").strip()
    city = data.get("city", "").strip()
    state = data.get("state", "").strip()
    business_type = data.get("business_type", "General Contractor").strip()
    gstin = data.get("gstin", "").strip()
    description = data.get("description", "").strip()
    website = data.get("website", "").strip()

    if not full_name or not company_name or not email or not password or not city or not state:
        return jsonify({
            "status": "error",
            "message": "Full name, company name, email address, password, city, and state are required."
        }), 400

    if len(password) < 6:
        return jsonify({
            "status": "error",
            "message": "Password must be at least 6 characters long."
        }), 400

    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
        return jsonify({
            "status": "error",
            "message": "Invalid email address format."
        }), 400

    if User.query.filter_by(email=email).first():
        return jsonify({
            "status": "error",
            "message": "An account with this email address already exists."
        }), 409

    location_str = f"{city}, {state}" if city and state else city or state or "India"

    user = User(
        full_name=full_name,
        email=email,
        phone=phone,
        location=location_str,
        role="contractor",
        specialisation="contractor",
        verification_status="pending"
    )
    user.set_password(password)

    db.session.add(user)
    db.session.flush()

    profile = ContractorProfile(
        user_id=user.id,
        company_name=company_name,
        business_type=business_type,
        gstin=gstin if gstin else None,
        business_address=business_address if business_address else None,
        city=city,
        state=state,
        verification_status="pending",
        contact_email=email,
        contact_phone=phone,
        website=website if website else None,
        description=description if description else None
    )
    db.session.add(profile)
    db.session.commit()

    token = generate_token(user.id, user.role)

    return jsonify({
        "status": "success",
        "message": "Contractor account registered successfully. Your business verification is currently pending review.",
        "token": token,
        "user": user.to_dict()
    }), 201


@auth_bp.route("/contractor/login", methods=["POST"])
def contractor_login():
    return _authenticate_login(
        allowed_roles=["contractor", "admin"],
        invalid_msg="Invalid contractor email address or password.",
        role_error_fn=lambda r: f"Account with role '{r}' cannot log into the Contractor Portal.",
        success_msg="Contractor login successful.",
    )


# ============================================================================
# Assessment Tasks & Rubrics Endpoints
# ============================================================================

@task_bp.route("", methods=["GET"])
def list_tasks():
    trade = request.args.get("trade", "").strip().lower()
    
    query = AssessmentTask.query.filter_by(is_active=True)
    if trade and trade != "all":
        query = query.filter_by(trade=trade)

    tasks = query.order_by(AssessmentTask.id).all()
    return jsonify({
        "status": "success",
        "count": len(tasks),
        "tasks": [t.to_dict(include_rubrics=True) for t in tasks]
    }), 200


@task_bp.route("/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = db.session.get(AssessmentTask, task_id)
    if not task:
        return jsonify({
            "status": "error",
            "message": f"Task with ID {task_id} not found."
        }), 404

    return jsonify({
        "status": "success",
        "task": task.to_dict(include_rubrics=True)
    }), 200


# ============================================================================
# Assessor Portal Endpoints (Role Protected)
# ============================================================================

@assessor_bp.route("/dashboard", methods=["GET"])
@require_auth(allowed_roles=["assessor", "admin"])
def assessor_dashboard():
    pending_count = AssessmentSubmission.query.filter_by(status="pending").count()
    under_review_count = AssessmentSubmission.query.filter_by(status="under_review").count()
    approved_count = AssessmentSubmission.query.filter_by(status="approved").count()
    rejected_count = AssessmentSubmission.query.filter_by(status="rejected").count()
    resubmission_count = AssessmentSubmission.query.filter_by(status="resubmission_requested").count()
    total_completed = approved_count + rejected_count

    recent_submissions = AssessmentSubmission.query.order_by(
        desc(AssessmentSubmission.submitted_at)
    ).limit(6).all()

    my_reviews_count = AssessmentReview.query.filter_by(assessor_id=g.current_user.id).count()

    return jsonify({
        "status": "success",
        "stats": {
            "pending_count": pending_count,
            "under_review_count": under_review_count,
            "approved_count": approved_count,
            "rejected_count": rejected_count,
            "resubmission_count": resubmission_count,
            "total_completed": total_completed,
            "my_reviews_count": my_reviews_count
        },
        "recent_submissions": [s.to_dict(include_reviews=False) for s in recent_submissions],
        "assessor": g.current_user.to_dict()
    }), 200


@assessor_bp.route("/submissions", methods=["GET"])
@require_auth(allowed_roles=["assessor", "admin"])
def assessor_submissions():
    trade = request.args.get("trade", "").strip().lower()
    status_filter = request.args.get("status", "").strip().lower()
    search = request.args.get("search", "").strip().lower()

    query = AssessmentSubmission.query

    if trade and trade != "all":
        query = query.filter_by(worker_trade=trade)

    if status_filter and status_filter != "all":
        query = query.filter_by(status=status_filter)

    if search:
        query = query.filter(
            (AssessmentSubmission.worker_name.ilike(f"%{search}%")) |
            (AssessmentSubmission.submission_notes.ilike(f"%{search}%"))
        )

    submissions = query.order_by(desc(AssessmentSubmission.submitted_at)).all()

    return jsonify({
        "status": "success",
        "count": len(submissions),
        "submissions": [s.to_dict(include_reviews=True) for s in submissions]
    }), 200


@assessor_bp.route("/submissions/<int:submission_id>", methods=["GET"])
@require_auth(allowed_roles=["assessor", "admin"])
def assessor_submission_detail(submission_id):
    submission = db.session.get(AssessmentSubmission, submission_id)
    if not submission:
        return jsonify({
            "status": "error",
            "message": f"Submission with ID {submission_id} not found."
        }), 404

    # Auto-mark as under_review if currently pending
    if submission.status == "pending":
        submission.status = "under_review"
        db.session.commit()

    task_data = submission.task.to_dict(include_rubrics=True) if submission.task else None

    return jsonify({
        "status": "success",
        "submission": submission.to_dict(include_reviews=True),
        "task": task_data
    }), 200


@assessor_bp.route("/submissions/<int:submission_id>/review", methods=["POST"])
@require_auth(allowed_roles=["assessor", "admin"], require_approved=True)
def submit_review(submission_id):
    submission = db.session.get(AssessmentSubmission, submission_id)
    if not submission:
        return jsonify({
            "status": "error",
            "message": f"Submission with ID {submission_id} not found."
        }), 404

    data = request.get_json() or {}
    decision = data.get("decision", "").strip().lower()
    overall_feedback = data.get("overall_feedback", "").strip()
    criteria_scores = data.get("criteria_scores", [])

    valid_decisions = ["approved", "rejected", "resubmission_requested"]
    if decision not in valid_decisions:
        return jsonify({
            "status": "error",
            "message": f"Invalid decision '{decision}'. Must be one of: {', '.join(valid_decisions)}."
        }), 400

    if not overall_feedback or len(overall_feedback) < 8:
        return jsonify({
            "status": "error",
            "message": "Please provide meaningful overall feedback (minimum 8 characters) explaining your assessment decision."
        }), 400

    task_rubrics = {r.id: r for r in submission.task.rubrics}
    if not task_rubrics:
        return jsonify({
            "status": "error",
            "message": "Task does not have associated rubric criteria."
        }), 500

    total_score = 0.0
    maximum_score = sum(r.max_score for r in task_rubrics.values())
    criterion_results_to_add = []

    scored_rubric_ids = set()
    for item in criteria_scores:
        rubric_id = item.get("rubric_id")
        raw_score = item.get("score")
        comment = item.get("comment", "")

        if rubric_id not in task_rubrics:
            return jsonify({
                "status": "error",
                "message": f"Rubric criterion ID {rubric_id} does not belong to this assessment task."
            }), 400

        rubric = task_rubrics[rubric_id]

        try:
            score = float(raw_score)
        except (ValueError, TypeError):
            return jsonify({
                "status": "error",
                "message": f"Invalid numeric score for criterion '{rubric.criterion_name}'."
            }), 400

        if score < 0 or score > rubric.max_score:
            return jsonify({
                "status": "error",
                "message": f"Score for '{rubric.criterion_name}' must be between 0 and {rubric.max_score}. Received: {score}."
            }), 400

        total_score += score
        scored_rubric_ids.add(rubric_id)
        criterion_results_to_add.append({
            "rubric_id": rubric_id,
            "score": score,
            "assessor_comment": comment
        })

    missing_rubrics = set(task_rubrics.keys()) - scored_rubric_ids
    if missing_rubrics:
        missing_names = [task_rubrics[rid].criterion_name for rid in missing_rubrics]
        return jsonify({
            "status": "error",
            "message": f"All rubric criteria must be scored. Missing: {', '.join(missing_names)}"
        }), 400

    review = AssessmentReview(
        submission_id=submission.id,
        assessor_id=g.current_user.id,
        total_score=total_score,
        maximum_score=maximum_score,
        overall_feedback=overall_feedback,
        decision=decision,
        reviewed_at=datetime.utcnow()
    )
    db.session.add(review)
    db.session.flush()

    for item in criterion_results_to_add:
        c_res = AssessmentCriterionResult(
            review_id=review.id,
            rubric_id=item["rubric_id"],
            score=item["score"],
            assessor_comment=item["assessor_comment"]
        )
        db.session.add(c_res)

    submission.status = decision
    submission.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Assessment review saved successfully. Final decision: {decision.upper()}.",
        "review": review.to_dict(include_criteria=True),
        "submission_status": submission.status
    }), 200


@assessor_bp.route("/history", methods=["GET"])
@require_auth(allowed_roles=["assessor", "admin"])
def assessor_history():
    if g.current_user.role == "admin":
        reviews = AssessmentReview.query.order_by(desc(AssessmentReview.reviewed_at)).all()
    else:
        reviews = AssessmentReview.query.filter_by(
            assessor_id=g.current_user.id
        ).order_by(desc(AssessmentReview.reviewed_at)).all()

    result = []
    for r in reviews:
        item = r.to_dict(include_criteria=True)
        if r.submission:
            item["worker_name"] = r.submission.worker_name
            item["worker_trade"] = r.submission.worker_trade
            item["task_title"] = r.submission.task.task_title if r.submission.task else None
            item["evidence_url"] = r.submission.evidence_url
        result.append(item)

    return jsonify({
        "status": "success",
        "count": len(result),
        "history": result
    }), 200


@assessor_bp.route("/profile", methods=["GET"])
@require_auth(allowed_roles=["assessor", "admin"])
def assessor_profile():
    return jsonify({
        "status": "success",
        "profile": g.current_user.to_dict()
    }), 200


@assessor_bp.route("/profile", methods=["PUT"])
@require_auth(allowed_roles=["assessor", "admin"])
def update_assessor_profile():
    data = request.get_json() or {}
    user = g.current_user

    if "full_name" in data and data["full_name"].strip():
        user.full_name = data["full_name"].strip()
    if "professional_qualification" in data:
        user.professional_qualification = data["professional_qualification"].strip()
    if "specialisation" in data:
        user.specialisation = data["specialisation"].strip()
    if "years_of_experience" in data:
        try:
            user.years_of_experience = int(data["years_of_experience"])
        except (ValueError, TypeError):
            pass

    user.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Assessor profile updated successfully.",
        "profile": user.to_dict()
    }), 200


# ============================================================================
# Worker Assessment Endpoints (Authenticated & Token-Gated)
# ============================================================================

@worker_bp.route("/profile", methods=["GET"])
@require_auth(allowed_roles=["worker", "admin"])
def worker_profile():
    """Returns the authenticated worker's persistent profile."""
    return jsonify({
        "status": "success",
        "worker": g.current_user.to_dict()
    }), 200


@worker_bp.route("/assessments", methods=["GET"])
@require_auth(allowed_roles=["worker", "admin"])
def worker_assessments():
    """
    Returns assessments strictly for the authenticated worker.
    Worker A cannot view Worker B's assessments.
    Administrators may optionally filter by worker_id.
    """
    if g.current_user.role == "admin":
        target_id = request.args.get("worker_id", type=int)
        if target_id:
            submissions = AssessmentSubmission.query.filter_by(
                worker_id=target_id
            ).order_by(desc(AssessmentSubmission.submitted_at)).all()
        else:
            submissions = AssessmentSubmission.query.order_by(
                desc(AssessmentSubmission.submitted_at)
            ).all()
        active_worker_id = target_id or g.current_user.id
    else:
        # Strictly worker's own submissions derived from auth session
        active_worker_id = g.current_user.id
        submissions = AssessmentSubmission.query.filter_by(
            worker_id=active_worker_id
        ).order_by(desc(AssessmentSubmission.submitted_at)).all()

    return jsonify({
        "status": "success",
        "worker_id": active_worker_id,
        "count": len(submissions),
        "assessments": [s.to_dict(include_reviews=True) for s in submissions]
    }), 200


@worker_bp.route("/assessments/<int:submission_id>", methods=["GET"])
@require_auth(allowed_roles=["worker", "admin", "assessor"])
def worker_assessment_detail(submission_id):
    submission = db.session.get(AssessmentSubmission, submission_id)
    if not submission:
        return jsonify({
            "status": "error",
            "message": f"Assessment submission with ID {submission_id} not found."
        }), 404

    # Security check: workers can only view their own submissions
    if g.current_user.role == "worker" and submission.worker_id != g.current_user.id:
        return jsonify({
            "status": "error",
            "message": "Access denied: you can only view your own assessment submissions."
        }), 403

    return jsonify({
        "status": "success",
        "assessment": submission.to_dict(include_reviews=True),
        "task": submission.task.to_dict(include_rubrics=True) if submission.task else None
    }), 200


@worker_bp.route("/assessments/submit", methods=["POST"])
@require_auth(allowed_roles=["worker", "admin"])
def worker_submit_assessment():
    """
    Submits a demonstration evidence using authenticated worker identity.
    Client-supplied worker IDs are strictly ignored in favor of the verified session.
    """
    data = request.get_json() or {}

    task_id = data.get("task_id")
    evidence_url = data.get("evidence_url", "").strip()
    submission_notes = data.get("submission_notes", "").strip()

    if not task_id:
        return jsonify({
            "status": "error",
            "message": "task_id is required."
        }), 400

    task = db.session.get(AssessmentTask, task_id)
    if not task:
        return jsonify({
            "status": "error",
            "message": f"Assessment task with ID {task_id} does not exist."
        }), 404

    if not evidence_url:
        return jsonify({
            "status": "error",
            "message": "Evidence URL (video or photo link) is required for practical evaluation."
        }), 400

    # Validate URL structure
    if not re.match(r"^https?://[^\s/$.?#].[^\s]*$", evidence_url, re.IGNORECASE):
        return jsonify({
            "status": "error",
            "message": "Invalid evidence URL format. Please provide a valid HTTP/HTTPS link."
        }), 400

    # Derive worker identity from authenticated session (never trust client payload worker_id)
    worker = g.current_user
    worker_id = worker.id
    worker_name = worker.full_name
    worker_phone = worker.phone or data.get("worker_phone") or "9876543210"
    worker_trade = data.get("worker_trade") or worker.specialisation or task.trade
    worker_experience = worker.years_of_experience or data.get("worker_experience") or 0
    worker_location = worker.location or data.get("worker_location") or "India"

    # Evidence type detection
    evidence_type = data.get("evidence_type")
    if not evidence_type:
        low = evidence_url.lower()
        evidence_type = "video" if ("video" in low or "youtu" in low or "loom" in low or "vimeo" in low or ".mp4" in low) else "image"

    submission = AssessmentSubmission(
        worker_id=worker_id,
        worker_name=worker_name,
        worker_phone=worker_phone,
        worker_trade=worker_trade,
        worker_experience=worker_experience,
        worker_location=worker_location,
        task_id=task.id,
        evidence_url=evidence_url,
        evidence_type=evidence_type,
        submission_notes=submission_notes,
        status="pending",
        attempt_count=1,
        history=[],
        submitted_at=datetime.utcnow()
    )

    db.session.add(submission)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Practical skill demonstration submitted successfully! It is now in the queue for evaluation by certified assessors.",
        "submission": submission.to_dict(include_reviews=False)
    }), 201


@worker_bp.route("/assessments/<int:submission_id>/resubmit", methods=["POST"])
@require_auth(allowed_roles=["worker", "admin"])
def worker_resubmit_assessment(submission_id):
    """
    Resubmits evidence for an assessment where resubmission was requested or rejected.
    Preserves historical submission attempts and prior assessor reviews.
    """
    submission = db.session.get(AssessmentSubmission, submission_id)
    if not submission:
        return jsonify({
            "status": "error",
            "message": f"Assessment submission with ID {submission_id} not found."
        }), 404

    # Security check: workers can only resubmit their own submissions
    if g.current_user.role == "worker" and submission.worker_id != g.current_user.id:
        return jsonify({
            "status": "error",
            "message": "Access denied: you can only resubmit your own assessment submissions."
        }), 403

    if submission.status == "approved":
        return jsonify({
            "status": "error",
            "message": "Cannot resubmit: this practical demonstration is already approved."
        }), 400

    data = request.get_json() or {}
    evidence_url = data.get("evidence_url", "").strip()
    submission_notes = data.get("submission_notes", "").strip()

    if not evidence_url:
        return jsonify({
            "status": "error",
            "message": "New evidence URL is required for resubmission."
        }), 400

    if not re.match(r"^https?://[^\s/$.?#].[^\s]*$", evidence_url, re.IGNORECASE):
        return jsonify({
            "status": "error",
            "message": "Invalid evidence URL format. Please provide a valid HTTP/HTTPS link."
        }), 400

    # Preserve historical attempt record
    history_record = {
        "attempt": submission.attempt_count or 1,
        "evidence_url": submission.evidence_url,
        "evidence_type": submission.evidence_type,
        "submission_notes": submission.submission_notes,
        "archived_at": datetime.utcnow().isoformat()
    }
    history_list = list(submission.history or [])
    history_list.append(history_record)

    submission.history = history_list
    submission.attempt_count = (submission.attempt_count or 1) + 1
    submission.evidence_url = evidence_url
    if submission_notes:
        submission.submission_notes = submission_notes
    submission.status = "pending"  # Reset status for assessor re-evaluation
    submission.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Demonstration evidence resubmitted successfully (Attempt #{submission.attempt_count}). It has been re-queued for assessor evaluation.",
        "submission": submission.to_dict(include_reviews=True)
    }), 200


# ============================================================================
# Admin Endpoints (Assessor Approval & Governance)
# ============================================================================

@admin_bp.route("/assessors", methods=["GET"])
@require_auth(allowed_roles=["admin"])
def list_assessors():
    status_filter = request.args.get("status", "").strip().lower()
    query = User.query.filter_by(role="assessor")

    if status_filter and status_filter != "all":
        query = query.filter_by(verification_status=status_filter)

    assessors = query.order_by(desc(User.created_at)).all()
    return jsonify({
        "status": "success",
        "count": len(assessors),
        "assessors": [u.to_dict() for u in assessors]
    }), 200


@admin_bp.route("/assessors/<int:user_id>/approve", methods=["PATCH"])
@require_auth(allowed_roles=["admin"])
def approve_assessor(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({
            "status": "error",
            "message": f"User with ID {user_id} not found."
        }), 404

    if user.role != "assessor":
        return jsonify({
            "status": "error",
            "message": f"User is not an assessor (current role: {user.role})."
        }), 400

    user.verification_status = "approved"
    user.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Assessor '{user.full_name}' has been verified and approved to evaluate practical assessments.",
        "user": user.to_dict()
    }), 200


@admin_bp.route("/assessors/<int:user_id>/reject", methods=["PATCH"])
@require_auth(allowed_roles=["admin"])
def reject_assessor(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({
            "status": "error",
            "message": f"User with ID {user_id} not found."
        }), 404

    if user.role != "assessor":
        return jsonify({
            "status": "error",
            "message": f"User is not an assessor."
        }), 400

    user.verification_status = "rejected"
    user.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Assessor '{user.full_name}' verification has been rejected.",
        "user": user.to_dict()
    }), 200


# ============================================================================
# Digital Skill Passport Credential Verification & Issuance Endpoints
# ============================================================================

@main_bp.route("/api/credentials/verify/<string:token>", methods=["GET"])
@api_bp.route("/credentials/verify/<string:token>", methods=["GET"])
def verify_credential(token):
    """
    Public verification endpoint for Digital Skill Passport QR scanning.
    Exposes only public verification fields; zero private worker data is leaked.
    """
    clean_token = token.strip()
    credential = SkillCredential.query.filter_by(verification_token=clean_token).first()
    if not credential:
        return jsonify({
            "status": "invalid",
            "valid": False,
            "message": "Credential not found or invalid verification token."
        }), 404

    if credential.status == "revoked":
        return jsonify({
            "status": "revoked",
            "valid": False,
            "message": "This credential was revoked by the platform administration.",
            "credential": credential.to_public_dict()
        }), 200

    if credential.status == "expired":
        return jsonify({
            "status": "expired",
            "valid": False,
            "message": "This credential has expired.",
            "credential": credential.to_public_dict()
        }), 200

    return jsonify({
        "status": "valid",
        "valid": True,
        "message": "Valid SkillSetu verified practical credential.",
        "credential": credential.to_public_dict()
    }), 200


@worker_bp.route("/credentials", methods=["GET"])
def worker_credentials():
    """Returns verified digital credentials issued for a given worker."""
    worker_id = request.args.get("worker_id", 101, type=int)
    credentials = SkillCredential.query.filter_by(
        worker_id=worker_id
    ).order_by(desc(SkillCredential.issue_date)).all()

    return jsonify({
        "status": "success",
        "worker_id": worker_id,
        "count": len(credentials),
        "credentials": [c.to_admin_dict() for c in credentials]
    }), 200


@admin_bp.route("/credentials", methods=["GET"])
@require_auth(allowed_roles=["admin"])
def list_credentials():
    """Lists all credentials issued across the platform for administrative audit."""
    credentials = SkillCredential.query.order_by(desc(SkillCredential.created_at)).all()
    return jsonify({
        "status": "success",
        "count": len(credentials),
        "credentials": [c.to_admin_dict() for c in credentials]
    }), 200


@admin_bp.route("/credentials/issue", methods=["POST"])
@require_auth(allowed_roles=["admin"])
def issue_credential():
    """
    Admin-only operation: Issues an official Digital Skill Passport credential.
    Strict Gate: Worker demonstration submission MUST be approved by an accredited assessor!
    """
    data = request.get_json() or {}
    submission_id = data.get("submission_id")
    if not submission_id:
        return jsonify({
            "status": "error",
            "message": "submission_id is required to issue a Skill Passport."
        }), 400

    submission = db.session.get(AssessmentSubmission, submission_id)
    if not submission:
        return jsonify({
            "status": "error",
            "message": f"Assessment submission #{submission_id} not found."
        }), 404

    # Crucial security rule: Submission MUST be approved by an assessor!
    if submission.status != "approved" or not submission.reviews:
        return jsonify({
            "status": "error",
            "message": "Cannot issue credential: worker demonstration must be evaluated and approved by an accredited assessor first."
        }), 400

    # Check if an active credential already exists for this submission
    existing = SkillCredential.query.filter_by(submission_id=submission.id, status="active").first()
    if existing:
        return jsonify({
            "status": "success",
            "message": "An active credential already exists for this assessment.",
            "credential": existing.to_admin_dict()
        }), 200

    latest_review = submission.reviews[0]
    percentage = round((latest_review.total_score / latest_review.maximum_score * 100), 1) if (latest_review and latest_review.maximum_score) else 0

    if percentage >= 90:
        skill_tier = f"Master Craftsman ({percentage}%)"
    elif percentage >= 75:
        skill_tier = f"Skilled Artisan ({percentage}%)"
    elif percentage >= 60:
        skill_tier = f"Semi-Skilled Practitioner ({percentage}%)"
    else:
        skill_tier = f"Apprentice ({percentage}%)"

    token = secrets.token_urlsafe(32)
    cred_id = f"SKILLSETU-2026-{1000 + submission.id:04d}"

    credential = SkillCredential(
        credential_id=cred_id,
        verification_token=token,
        worker_id=submission.worker_id,
        worker_name=submission.worker_name,
        trade=(submission.task.trade if submission.task else None) or submission.worker_trade or "general",
        skill_level=data.get("skill_level") or skill_tier,
        submission_id=submission.id,
        review_id=latest_review.id,
        issued_by_admin_id=g.current_user.id if hasattr(g, 'current_user') and g.current_user else None,
        status="active"
    )

    db.session.add(credential)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Skill Passport #{cred_id} successfully issued for {submission.worker_name}.",
        "credential": credential.to_admin_dict()
    }), 201


@admin_bp.route("/credentials/<int:credential_id>/revoke", methods=["PATCH"])
@require_auth(allowed_roles=["admin"])
def revoke_credential(credential_id):
    """
    Admin-only operation: Revokes a credential with an explicit reason for platform audit logs.
    """
    credential = db.session.get(SkillCredential, credential_id)
    if not credential:
        return jsonify({
            "status": "error",
            "message": f"Credential with ID {credential_id} not found."
        }), 404

    data = request.get_json() or {}
    reason = data.get("reason", "").strip()
    if not reason:
        return jsonify({
            "status": "error",
            "message": "A specific revocation reason is required for administrative audit logs."
        }), 400

    credential.status = "revoked"
    credential.revocation_reason = reason
    credential.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Credential #{credential.credential_id} has been revoked.",
        "credential": credential.to_admin_dict()
    }), 200


# ============================================================================
# PHASE 4: CONTRACTOR HUB & DIRECT HIRING MARKETPLACE ENDPOINTS
# ============================================================================

VALID_TRADES = [
    "electrician",
    "plumber",
    "mason",
    "carpenter",
    "welder",
    "painter",
    "mechanic",
    "technician"
]


# ----------------------------------------------------------------------------
# Contractor Profile & Dashboard
# ----------------------------------------------------------------------------

@contractor_bp.route("/profile", methods=["GET"])
@require_auth(allowed_roles=["contractor", "admin"])
def get_contractor_profile():
    profile = getattr(g.current_user, "contractor_profile", None)
    if not profile:
        profile = ContractorProfile.query.filter_by(user_id=g.current_user.id).first()

    return jsonify({
        "status": "success",
        "user": g.current_user.to_dict(),
        "profile": profile.to_dict() if profile else None
    }), 200


@contractor_bp.route("/profile", methods=["PUT"])
@require_auth(allowed_roles=["contractor", "admin"])
def update_contractor_profile():
    data = request.get_json() or {}
    profile = getattr(g.current_user, "contractor_profile", None)
    if not profile:
        profile = ContractorProfile.query.filter_by(user_id=g.current_user.id).first()
        if not profile:
            profile = ContractorProfile(
                user_id=g.current_user.id,
                company_name=data.get("company_name", g.current_user.full_name),
                city=data.get("city", "Mumbai"),
                state=data.get("state", "Maharashtra")
            )
            db.session.add(profile)

    # Editable fields
    if "company_name" in data and data["company_name"].strip():
        profile.company_name = data["company_name"].strip()
    if "business_type" in data:
        profile.business_type = data["business_type"].strip()
    if "gstin" in data:
        profile.gstin = data["gstin"].strip() or None
    if "business_address" in data:
        profile.business_address = data["business_address"].strip() or None
    if "city" in data and data["city"].strip():
        profile.city = data["city"].strip()
    if "state" in data and data["state"].strip():
        profile.state = data["state"].strip()
    if "contact_email" in data:
        profile.contact_email = data["contact_email"].strip() or None
    if "contact_phone" in data:
        profile.contact_phone = data["contact_phone"].strip() or None
    if "website" in data:
        profile.website = data["website"].strip() or None
    if "description" in data:
        profile.description = data["description"].strip() or None

    # Update base user fields
    if "full_name" in data and data["full_name"].strip():
        g.current_user.full_name = data["full_name"].strip()
    if "phone" in data:
        g.current_user.phone = data["phone"].strip() or None
    if profile.city and profile.state:
        g.current_user.location = f"{profile.city}, {profile.state}"

    profile.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Company profile updated successfully.",
        "profile": profile.to_dict(),
        "user": g.current_user.to_dict()
    }), 200


@contractor_bp.route("/dashboard", methods=["GET"])
@require_auth(allowed_roles=["contractor", "admin"])
def get_contractor_dashboard():
    contractor_id = g.current_user.id
    profile = getattr(g.current_user, "contractor_profile", None)

    jobs = JobPosting.query.filter_by(contractor_id=contractor_id).order_by(JobPosting.created_at.desc()).all()
    job_ids = [j.id for j in jobs]

    total_jobs = len(jobs)
    active_jobs = sum(1 for j in jobs if j.status == "active")
    closed_jobs = sum(1 for j in jobs if j.status in ("closed", "paused"))

    applications = []
    if job_ids:
        applications = JobApplication.query.filter(JobApplication.job_id.in_(job_ids)).order_by(JobApplication.applied_at.desc()).all()

    total_applications = len(applications)
    shortlisted_count = sum(1 for a in applications if a.status == "shortlisted")
    hired_count = sum(1 for a in applications if a.status == "hired")

    # Recent 5 applications with worker details
    recent_apps = [a.to_dict(include_job=True, include_worker=True) for a in applications[:5]]
    # Recent 5 jobs
    recent_jobs = [j.to_dict(include_contractor=False, include_counts=True) for j in jobs[:5]]

    return jsonify({
        "status": "success",
        "stats": {
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "closed_jobs": closed_jobs,
            "total_applications": total_applications,
            "shortlisted_workers": shortlisted_count,
            "hired_workers": hired_count,
            "verification_status": profile.verification_status if profile else "pending",
            "company_name": profile.company_name if profile else g.current_user.full_name
        },
        "recent_applications": recent_apps,
        "recent_jobs": recent_jobs
    }), 200


# ----------------------------------------------------------------------------
# Contractor Job Management
# ----------------------------------------------------------------------------

@contractor_bp.route("/jobs", methods=["GET"])
@require_auth(allowed_roles=["contractor", "admin"])
def list_contractor_jobs():
    status = request.args.get("status", "").strip().lower()
    query = JobPosting.query.filter_by(contractor_id=g.current_user.id)
    if status and status != "all":
        query = query.filter_by(status=status)

    jobs = query.order_by(JobPosting.created_at.desc()).all()
    return jsonify({
        "status": "success",
        "count": len(jobs),
        "jobs": [j.to_dict(include_contractor=True, include_counts=True) for j in jobs]
    }), 200


@contractor_bp.route("/jobs", methods=["POST"])
@require_auth(allowed_roles=["contractor", "admin"])
def create_job():
    data = request.get_json() or {}

    title = data.get("title", "").strip()
    trade = data.get("trade", "").strip().lower()
    description = data.get("description", "").strip()
    required_skills = data.get("required_skills", "").strip()
    workers_needed = data.get("workers_needed", 1)
    experience_years = data.get("experience_years", 0)
    location = data.get("location", "").strip()
    city = data.get("city", "").strip()
    state = data.get("state", "").strip()
    employment_type = data.get("employment_type", "Full-time").strip()
    payment_type = data.get("payment_type", "Monthly").strip()
    wage_min = data.get("wage_min")
    wage_max = data.get("wage_max")
    duration = data.get("duration", "").strip()
    start_date = data.get("start_date", "").strip()
    working_hours = data.get("working_hours", "").strip()
    safety_requirements = data.get("safety_requirements", "").strip()
    contact_details = data.get("contact_details", "").strip()

    if not title or not trade or not description or not location or not city or not state:
        return jsonify({
            "status": "error",
            "message": "Title, trade, description, location, city, and state are required."
        }), 400

    if trade not in VALID_TRADES:
        return jsonify({
            "status": "error",
            "message": f"Invalid trade '{trade}'. Supported trades: {', '.join(VALID_TRADES)}."
        }), 400

    try:
        wage_min_val = float(wage_min)
        wage_max_val = float(wage_max)
        if wage_min_val < 0 or wage_max_val < 0 or wage_min_val > wage_max_val:
            return jsonify({
                "status": "error",
                "message": "Wage min must be non-negative and less than or equal to wage max."
            }), 400
    except (ValueError, TypeError):
        return jsonify({
            "status": "error",
            "message": "Wage min and wage max must be valid numbers."
        }), 400

    try:
        workers_needed_val = max(1, int(workers_needed))
        experience_years_val = max(0, int(experience_years))
    except (ValueError, TypeError):
        workers_needed_val = 1
        experience_years_val = 0

    job = JobPosting(
        contractor_id=g.current_user.id,
        title=title,
        trade=trade,
        description=description,
        required_skills=required_skills or None,
        workers_needed=workers_needed_val,
        experience_years=experience_years_val,
        location=location,
        city=city,
        state=state,
        employment_type=employment_type or "Full-time",
        payment_type=payment_type or "Monthly",
        wage_min=wage_min_val,
        wage_max=wage_max_val,
        duration=duration or None,
        start_date=start_date or None,
        working_hours=working_hours or None,
        safety_requirements=safety_requirements or None,
        contact_details=contact_details or None,
        status="active"
    )

    db.session.add(job)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Job posting published successfully.",
        "job": job.to_dict(include_contractor=True, include_counts=True)
    }), 201


@contractor_bp.route("/jobs/<int:job_id>", methods=["GET"])
@require_auth(allowed_roles=["contractor", "admin"])
def get_contractor_job(job_id):
    job = db.session.get(JobPosting, job_id)
    if not job:
        return jsonify({"status": "error", "message": "Job posting not found."}), 404

    # IDOR check
    if job.contractor_id != g.current_user.id and not g.current_user.is_admin():
        return jsonify({"status": "error", "message": "Access restricted. You do not own this job posting."}), 403

    return jsonify({
        "status": "success",
        "job": job.to_dict(include_contractor=True, include_counts=True)
    }), 200


@contractor_bp.route("/jobs/<int:job_id>", methods=["PUT"])
@require_auth(allowed_roles=["contractor", "admin"])
def update_job(job_id):
    job = db.session.get(JobPosting, job_id)
    if not job:
        return jsonify({"status": "error", "message": "Job posting not found."}), 404

    # IDOR check
    if job.contractor_id != g.current_user.id and not g.current_user.is_admin():
        return jsonify({"status": "error", "message": "Access restricted. You cannot modify another contractor's job posting."}), 403

    data = request.get_json() or {}

    if "title" in data and data["title"].strip():
        job.title = data["title"].strip()
    if "trade" in data:
        t = data["trade"].strip().lower()
        if t in VALID_TRADES:
            job.trade = t
    if "description" in data and data["description"].strip():
        job.description = data["description"].strip()
    if "required_skills" in data:
        job.required_skills = data["required_skills"].strip() or None
    if "workers_needed" in data:
        try:
            job.workers_needed = max(1, int(data["workers_needed"]))
        except (ValueError, TypeError):
            pass
    if "experience_years" in data:
        try:
            job.experience_years = max(0, int(data["experience_years"]))
        except (ValueError, TypeError):
            pass
    if "location" in data and data["location"].strip():
        job.location = data["location"].strip()
    if "city" in data and data["city"].strip():
        job.city = data["city"].strip()
    if "state" in data and data["state"].strip():
        job.state = data["state"].strip()
    if "employment_type" in data:
        job.employment_type = data["employment_type"].strip() or "Full-time"
    if "payment_type" in data:
        job.payment_type = data["payment_type"].strip() or "Monthly"
    if "wage_min" in data or "wage_max" in data:
        try:
            wmin = float(data["wage_min"]) if "wage_min" in data else job.wage_min
            wmax = float(data["wage_max"]) if "wage_max" in data else job.wage_max
            if 0 <= wmin <= wmax:
                job.wage_min = wmin
                job.wage_max = wmax
        except (ValueError, TypeError):
            pass
    if "duration" in data:
        job.duration = data["duration"].strip() or None
    if "start_date" in data:
        job.start_date = data["start_date"].strip() or None
    if "working_hours" in data:
        job.working_hours = data["working_hours"].strip() or None
    if "safety_requirements" in data:
        job.safety_requirements = data["safety_requirements"].strip() or None
    if "contact_details" in data:
        job.contact_details = data["contact_details"].strip() or None

    job.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Job posting updated successfully.",
        "job": job.to_dict(include_contractor=True, include_counts=True)
    }), 200


@contractor_bp.route("/jobs/<int:job_id>/status", methods=["PATCH"])
@require_auth(allowed_roles=["contractor", "admin"])
def set_job_status(job_id):
    job = db.session.get(JobPosting, job_id)
    if not job:
        return jsonify({"status": "error", "message": "Job posting not found."}), 404

    # IDOR check
    if job.contractor_id != g.current_user.id and not g.current_user.is_admin():
        return jsonify({"status": "error", "message": "Access restricted."}), 403

    data = request.get_json() or {}
    new_status = data.get("status", "").strip().lower()
    if new_status not in ("active", "paused", "closed"):
        return jsonify({
            "status": "error",
            "message": "Invalid status. Allowed values: active, paused, closed."
        }), 400

    job.status = new_status
    job.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Job status updated to '{new_status}'.",
        "job": job.to_dict(include_contractor=True, include_counts=True)
    }), 200


@contractor_bp.route("/jobs/<int:job_id>", methods=["DELETE"])
@require_auth(allowed_roles=["contractor", "admin"])
def delete_job(job_id):
    job = db.session.get(JobPosting, job_id)
    if not job:
        return jsonify({"status": "error", "message": "Job posting not found."}), 404

    # IDOR check
    if job.contractor_id != g.current_user.id and not g.current_user.is_admin():
        return jsonify({"status": "error", "message": "Access restricted."}), 403

    db.session.delete(job)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Job posting deleted successfully."
    }), 200


# ----------------------------------------------------------------------------
# Contractor Applications Management
# ----------------------------------------------------------------------------

@contractor_bp.route("/jobs/<int:job_id>/applications", methods=["GET"])
@require_auth(allowed_roles=["contractor", "admin"])
def get_job_applications(job_id):
    job = db.session.get(JobPosting, job_id)
    if not job:
        return jsonify({"status": "error", "message": "Job posting not found."}), 404

    # IDOR check
    if job.contractor_id != g.current_user.id and not g.current_user.is_admin():
        return jsonify({"status": "error", "message": "Access restricted."}), 403

    applications = JobApplication.query.filter_by(job_id=job_id).order_by(JobApplication.applied_at.desc()).all()
    return jsonify({
        "status": "success",
        "job_title": job.title,
        "count": len(applications),
        "applications": [a.to_dict(include_job=False, include_worker=True) for a in applications]
    }), 200


@contractor_bp.route("/applications", methods=["GET"])
@require_auth(allowed_roles=["contractor", "admin"])
def list_all_contractor_applications():
    job_ids = [j.id for j in JobPosting.query.filter_by(contractor_id=g.current_user.id).all()]
    if not job_ids:
        return jsonify({"status": "success", "count": 0, "applications": []}), 200

    status = request.args.get("status", "").strip().lower()
    query = JobApplication.query.filter(JobApplication.job_id.in_(job_ids))
    if status and status != "all":
        query = query.filter_by(status=status)

    applications = query.order_by(JobApplication.applied_at.desc()).all()
    return jsonify({
        "status": "success",
        "count": len(applications),
        "applications": [a.to_dict(include_job=True, include_worker=True) for a in applications]
    }), 200


@contractor_bp.route("/applications/<int:app_id>/status", methods=["PATCH"])
@require_auth(allowed_roles=["contractor", "admin"])
def update_application_status(app_id):
    application = db.session.get(JobApplication, app_id)
    if not application:
        return jsonify({"status": "error", "message": "Application not found."}), 404

    # IDOR check: ensure the contractor owns the job this application is for
    if application.job.contractor_id != g.current_user.id and not g.current_user.is_admin():
        return jsonify({"status": "error", "message": "Access restricted. You do not own the job posting for this application."}), 403

    data = request.get_json() or {}
    new_status = data.get("status", "").strip().lower()
    allowed_statuses = ("applied", "under_review", "shortlisted", "rejected", "hired")
    if new_status not in allowed_statuses:
        return jsonify({
            "status": "error",
            "message": f"Invalid status. Allowed values: {', '.join(allowed_statuses)}."
        }), 400

    application.status = new_status
    application.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Application status updated to '{new_status}'.",
        "application": application.to_dict(include_job=True, include_worker=True)
    }), 200


# ----------------------------------------------------------------------------
# Verified Worker Discovery Marketplace
# ----------------------------------------------------------------------------

@contractor_bp.route("/workers", methods=["GET"])
@require_auth(allowed_roles=["contractor", "admin"])
def discover_verified_workers():
    trade = request.args.get("trade", "").strip().lower()
    city = request.args.get("city", "").strip().lower()
    state = request.args.get("state", "").strip().lower()
    query_str = request.args.get("q", "").strip().lower()
    min_exp = request.args.get("min_experience", "")

    # Query workers from User table
    workers_query = User.query.filter_by(role="worker")

    if trade and trade != "all":
        workers_query = workers_query.filter(User.specialisation.ilike(f"%{trade}%"))

    if city:
        workers_query = workers_query.filter(User.location.ilike(f"%{city}%"))

    if state:
        workers_query = workers_query.filter(User.location.ilike(f"%{state}%"))

    if min_exp:
        try:
            exp_val = int(min_exp)
            workers_query = workers_query.filter(User.years_of_experience >= exp_val)
        except (ValueError, TypeError):
            pass

    workers = workers_query.order_by(User.years_of_experience.desc()).all()

    results = []
    for w in workers:
        # Match text query if provided
        if query_str:
            target_text = f"{w.full_name} {w.specialisation or ''} {w.location or ''} {w.professional_qualification or ''}".lower()
            if query_str not in target_text:
                continue

        # Check for active verified Digital Skill Passport credential
        cred = SkillCredential.query.filter_by(worker_id=w.id, status="active").first()

        # Check latest approved submission review score if exists
        submission = AssessmentSubmission.query.filter_by(worker_id=w.id, status="approved").order_by(AssessmentSubmission.id.desc()).first()
        score_info = None
        if submission and submission.reviews:
            rev = submission.reviews[0]
            score_info = {
                "score": rev.total_score,
                "max_score": rev.maximum_score,
                "percentage": round((rev.total_score / rev.maximum_score * 100), 1) if rev.maximum_score else None
            }

        worker_entry = {
            "id": w.id,
            "full_name": w.full_name,
            "trade": w.specialisation or "electrician",
            "years_of_experience": w.years_of_experience or 0,
            "location": w.location or "India",
            "professional_qualification": w.professional_qualification,
            "is_verified": cred is not None or (w.verification_status in ("approved", "verified")),
            "has_skill_passport": cred is not None,
            "credential_id": cred.credential_id if cred else None,
            "verification_token": cred.verification_token if cred else None,
            "verification_url": f"https://ayush35099-cloud.github.io/SkillSetu/verify/{cred.verification_token}" if cred else None,
            "skill_level": cred.skill_level if cred else ("Verified Candidate" if (submission and submission.status == "approved") else "Candidate"),
            "assessment_score": score_info
        }
        results.append(worker_entry)

    return jsonify({
        "status": "success",
        "count": len(results),
        "workers": results
    }), 200


# ----------------------------------------------------------------------------
# Worker-Contractor Safe Contact Requests
# ----------------------------------------------------------------------------

@contractor_bp.route("/contact-requests", methods=["POST"])
@require_auth(allowed_roles=["contractor", "admin"])
def send_contact_request():
    data = request.get_json() or {}
    worker_id = data.get("worker_id")
    job_id = data.get("job_id")
    message = data.get("message", "").strip()

    if not worker_id or not message:
        return jsonify({
            "status": "error",
            "message": "Worker ID and message are required."
        }), 400

    worker = db.session.get(User, worker_id)
    if not worker or worker.role != "worker":
        return jsonify({
            "status": "error",
            "message": "Target worker account not found."
        }), 404

    # Optional job validation
    if job_id:
        job = db.session.get(JobPosting, job_id)
        if not job or (job.contractor_id != g.current_user.id and not g.current_user.is_admin()):
            job_id = None

    # Check if duplicate pending request exists
    existing = ContactRequest.query.filter_by(
        contractor_id=g.current_user.id,
        worker_id=worker_id,
        status="pending"
    ).first()
    if existing:
        return jsonify({
            "status": "error",
            "message": "A pending contact request has already been sent to this worker."
        }), 409

    contact_req = ContactRequest(
        contractor_id=g.current_user.id,
        worker_id=worker_id,
        job_id=job_id,
        message=message,
        status="pending"
    )
    db.session.add(contact_req)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Interview request sent to {worker.full_name}.",
        "contact_request": contact_req.to_dict()
    }), 201


@contractor_bp.route("/contact-requests", methods=["GET"])
@require_auth(allowed_roles=["contractor", "admin"])
def list_contractor_contact_requests():
    requests = ContactRequest.query.filter_by(contractor_id=g.current_user.id).order_by(ContactRequest.created_at.desc()).all()
    return jsonify({
        "status": "success",
        "count": len(requests),
        "contact_requests": [cr.to_dict() for cr in requests]
    }), 200


# ============================================================================
# WORKER JOBS & APPLICATIONS ENDPOINTS
# ============================================================================

@worker_bp.route("/jobs", methods=["GET"])
def browse_active_jobs():
    """Public / Worker endpoint to search active verified contractor job postings."""
    trade = request.args.get("trade", "").strip().lower()
    city = request.args.get("city", "").strip().lower()
    state = request.args.get("state", "").strip().lower()
    employment_type = request.args.get("employment_type", "").strip()
    query_str = request.args.get("q", "").strip().lower()

    query = JobPosting.query.filter_by(status="active")

    if trade and trade != "all":
        query = query.filter_by(trade=trade)
    if city:
        query = query.filter(JobPosting.city.ilike(f"%{city}%"))
    if state:
        query = query.filter(JobPosting.state.ilike(f"%{state}%"))
    if employment_type and employment_type != "all":
        query = query.filter(JobPosting.employment_type.ilike(f"%{employment_type}%"))

    jobs = query.order_by(JobPosting.created_at.desc()).all()

    if query_str:
        filtered = []
        for j in jobs:
            haystack = f"{j.title} {j.description} {j.required_skills or ''} {j.city} {j.state} {j.trade}".lower()
            if query_str in haystack:
                filtered.append(j)
        jobs = filtered

    return jsonify({
        "status": "success",
        "count": len(jobs),
        "jobs": [j.to_dict(include_contractor=True, include_counts=True) for j in jobs]
    }), 200


@worker_bp.route("/jobs/<int:job_id>", methods=["GET"])
def get_job_detail(job_id):
    job = db.session.get(JobPosting, job_id)
    if not job:
        return jsonify({"status": "error", "message": "Job posting not found."}), 404

    return jsonify({
        "status": "success",
        "job": job.to_dict(include_contractor=True, include_counts=True)
    }), 200


@worker_bp.route("/jobs/<int:job_id>/apply", methods=["POST"])
@require_auth(allowed_roles=["worker", "admin"])
def apply_to_job(job_id):
    job = db.session.get(JobPosting, job_id)
    if not job:
        return jsonify({"status": "error", "message": "Job posting not found."}), 404

    if job.status != "active":
        return jsonify({
            "status": "error",
            "message": f"This job posting is currently {job.status} and is no longer accepting applications."
        }), 400

    # Prevent duplicate applications
    existing = JobApplication.query.filter_by(job_id=job_id, worker_id=g.current_user.id).first()
    if existing:
        return jsonify({
            "status": "error",
            "message": "You have already applied for this job posting.",
            "application": existing.to_dict(include_job=True, include_worker=False)
        }), 409

    data = request.get_json() or {}
    cover_note = data.get("cover_note", "").strip()

    application = JobApplication(
        job_id=job_id,
        worker_id=g.current_user.id,
        cover_note=cover_note or None,
        status="applied"
    )
    db.session.add(application)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Application submitted successfully for '{job.title}'.",
        "application": application.to_dict(include_job=True, include_worker=True)
    }), 201


@worker_bp.route("/applications", methods=["GET"])
@require_auth(allowed_roles=["worker", "admin"])
def get_my_job_applications():
    applications = JobApplication.query.filter_by(worker_id=g.current_user.id).order_by(JobApplication.applied_at.desc()).all()
    return jsonify({
        "status": "success",
        "count": len(applications),
        "applications": [a.to_dict(include_job=True, include_worker=False) for a in applications]
    }), 200


@worker_bp.route("/applications/<int:app_id>/withdraw", methods=["PATCH"])
@require_auth(allowed_roles=["worker", "admin"])
def withdraw_application(app_id):
    application = db.session.get(JobApplication, app_id)
    if not application:
        return jsonify({"status": "error", "message": "Application not found."}), 404

    if application.worker_id != g.current_user.id and not g.current_user.is_admin():
        return jsonify({"status": "error", "message": "Access restricted. You can only withdraw your own applications."}), 403

    if application.status == "withdrawn":
        return jsonify({"status": "error", "message": "Application has already been withdrawn."}), 400

    application.status = "withdrawn"
    application.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Application withdrawn successfully.",
        "application": application.to_dict(include_job=True, include_worker=False)
    }), 200


@worker_bp.route("/contact-requests", methods=["GET"])
@require_auth(allowed_roles=["worker", "admin"])
def get_worker_contact_requests():
    requests = ContactRequest.query.filter_by(worker_id=g.current_user.id).order_by(ContactRequest.created_at.desc()).all()
    return jsonify({
        "status": "success",
        "count": len(requests),
        "contact_requests": [cr.to_dict() for cr in requests]
    }), 200


@worker_bp.route("/contact-requests/<int:request_id>/respond", methods=["PATCH"])
@require_auth(allowed_roles=["worker", "admin"])
def respond_to_contact_request(request_id):
    contact_req = db.session.get(ContactRequest, request_id)
    if not contact_req:
        return jsonify({"status": "error", "message": "Contact request not found."}), 404

    if contact_req.worker_id != g.current_user.id and not g.current_user.is_admin():
        return jsonify({"status": "error", "message": "Access restricted."}), 403

    data = request.get_json() or {}
    action = data.get("action", "").strip().lower()
    share_contact = data.get("share_contact", True)

    if action not in ("accept", "decline"):
        return jsonify({
            "status": "error",
            "message": "Action must be either 'accept' or 'decline'."
        }), 400

    if action == "accept":
        contact_req.status = "accepted"
        contact_req.worker_contact_shared = bool(share_contact)
    else:
        contact_req.status = "declined"
        contact_req.worker_contact_shared = False

    contact_req.responded_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Contact request has been {contact_req.status}.",
        "contact_request": contact_req.to_dict()
    }), 200


# ============================================================================
# ADMIN CONTRACTOR GOVERNANCE & MODERATION
# ============================================================================

@admin_bp.route("/contractors", methods=["GET"])
@require_auth(allowed_roles=["admin"])
def admin_list_contractors():
    status = request.args.get("status", "").strip().lower()

    contractor_users = User.query.filter_by(role="contractor").order_by(User.created_at.desc()).all()

    results = []
    for u in contractor_users:
        prof = u.contractor_profile
        v_status = prof.verification_status if prof else u.verification_status

        if status and status != "all" and v_status != status:
            continue

        job_count = JobPosting.query.filter_by(contractor_id=u.id).count()

        results.append({
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "phone": u.phone,
            "location": u.location,
            "verification_status": v_status,
            "company_name": prof.company_name if prof else u.full_name,
            "business_type": prof.business_type if prof else "General Contractor",
            "gstin": prof.gstin if prof else None,
            "city": prof.city if prof else "",
            "state": prof.state if prof else "",
            "website": prof.website if prof else None,
            "description": prof.description if prof else None,
            "total_jobs": job_count,
            "created_at": u.created_at.isoformat() if u.created_at else None
        })

    return jsonify({
        "status": "success",
        "count": len(results),
        "contractors": results
    }), 200


@admin_bp.route("/contractors/<int:contractor_id>/verify", methods=["PATCH"])
@require_auth(allowed_roles=["admin"])
def admin_verify_contractor(contractor_id):
    user = db.session.get(User, contractor_id)
    if not user or user.role != "contractor":
        return jsonify({"status": "error", "message": "Contractor account not found."}), 404

    data = request.get_json() or {}
    new_status = data.get("status", "").strip().lower()
    reason = data.get("reason", "").strip()

    if new_status not in ("verified", "rejected", "pending"):
        return jsonify({
            "status": "error",
            "message": "Status must be 'verified', 'rejected', or 'pending'."
        }), 400

    user.verification_status = new_status
    prof = user.contractor_profile
    if prof:
        prof.verification_status = new_status
        if new_status == "verified":
            prof.verified_at = datetime.utcnow()
            prof.rejection_reason = None
        elif new_status == "rejected":
            prof.rejection_reason = reason or "Verification criteria not met"
        else:
            prof.verified_at = None
            prof.rejection_reason = None

    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Contractor '{prof.company_name if prof else user.full_name}' verification set to '{new_status}'.",
        "user": user.to_dict()
    }), 200


@admin_bp.route("/jobs", methods=["GET"])
@require_auth(allowed_roles=["admin"])
def admin_list_jobs():
    trade = request.args.get("trade", "").strip().lower()
    status = request.args.get("status", "").strip().lower()

    query = JobPosting.query
    if trade and trade != "all":
        query = query.filter_by(trade=trade)
    if status and status != "all":
        query = query.filter_by(status=status)

    jobs = query.order_by(JobPosting.created_at.desc()).all()

    return jsonify({
        "status": "success",
        "count": len(jobs),
        "jobs": [j.to_dict(include_contractor=True, include_counts=True) for j in jobs]
    }), 200


@admin_bp.route("/jobs/<int:job_id>", methods=["DELETE"])
@require_auth(allowed_roles=["admin"])
def admin_moderate_job(job_id):
    job = db.session.get(JobPosting, job_id)
    if not job:
        return jsonify({"status": "error", "message": "Job posting not found."}), 404

    job_title = job.title
    db.session.delete(job)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": f"Job posting '{job_title}' successfully removed by administrator."
    }), 200
