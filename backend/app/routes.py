import re
import secrets
from datetime import datetime
from flask import Blueprint, jsonify, request, current_app, g
from sqlalchemy import text, desc
from . import db
from .models import (
    User,
    AssessmentTask,
    AssessmentRubric,
    AssessmentSubmission,
    AssessmentReview,
    AssessmentCriterionResult,
    SkillCredential
)
from .auth import generate_token, require_auth

# Blueprints
main_bp = Blueprint("main", __name__)
api_bp = Blueprint("api", __name__, url_prefix="/api")
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
task_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")
assessor_bp = Blueprint("assessor", __name__, url_prefix="/api/assessor")
worker_bp = Blueprint("worker", __name__, url_prefix="/api/worker")
admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


# ============================================================================
# Root & Health Endpoints
# ============================================================================

@main_bp.route("/", methods=["GET"])
def root():
    return jsonify({
        "message": "Welcome to SkillSetu API",
        "service": "SkillSetu Backend",
        "version": "1.1.0 (Phase 3: Assessor Portal & Practical Evaluation Engine)",
        "endpoints": {
            "root": "/",
            "health": "/api/health",
            "db_health": "/api/health/db",
            "auth": "/api/auth/*",
            "tasks": "/api/tasks",
            "assessor": "/api/assessor/*",
            "worker": "/api/worker/*",
            "admin": "/api/admin/*"
        }
    }), 200

@api_bp.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "SkillSetu Backend",
        "phase": "Phase 3 – Assessor Portal & Evaluation Engine",
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

    try:
        with db.engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            
        db_type = "PostgreSQL" if "postgresql" in (db_uri or "") else "SQLite (Local Dev)"
        return jsonify({
            "status": "connected",
            "database": "PostgreSQL" if "postgresql" in (db_uri or "") else "SQLite",
            "message": "Database connection successful",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        current_app.logger.error(f"Database health check failed: {e}")
        return jsonify({
            "status": "error",
            "database": "PostgreSQL" if "postgresql" in (db_uri or "") else "SQLite",
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


@auth_bp.route("/assessor/login", methods=["POST"])
def assessor_login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "status": "error",
            "message": "Invalid email address or password."
        }), 401

    if user.role not in ["assessor", "admin"]:
        return jsonify({
            "status": "error",
            "message": f"Account with role '{user.role}' cannot log into the Assessor Portal."
        }), 403

    token = generate_token(user.id, user.role)

    return jsonify({
        "status": "success",
        "message": "Login successful.",
        "token": token,
        "user": user.to_dict()
    }), 200


@auth_bp.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "status": "error",
            "message": "Invalid administrator credentials."
        }), 401

    if user.role != "admin":
        return jsonify({
            "status": "error",
            "message": "Access restricted. Administrator privileges required."
        }), 403

    token = generate_token(user.id, user.role)

    return jsonify({
        "status": "success",
        "message": "Admin login successful.",
        "token": token,
        "user": user.to_dict()
    }), 200


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
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "status": "error",
            "message": "Invalid email address or password."
        }), 401

    if user.role not in ["worker", "admin"]:
        return jsonify({
            "status": "error",
            "message": f"Account with role '{user.role}' cannot log into the Worker Portal."
        }), 403

    token = generate_token(user.id, user.role)

    return jsonify({
        "status": "success",
        "message": "Worker login successful.",
        "token": token,
        "user": user.to_dict()
    }), 200


@auth_bp.route("/login", methods=["POST"])
def universal_login():
    """Universal login endpoint supporting workers, assessors, and admins."""
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "status": "error",
            "message": "Invalid email address or password."
        }), 401

    token = generate_token(user.id, user.role)

    return jsonify({
        "status": "success",
        "message": "Login successful.",
        "token": token,
        "user": user.to_dict()
    }), 200


@auth_bp.route("/me", methods=["GET"])
@require_auth()
def auth_me():
    return jsonify({
        "status": "success",
        "user": g.current_user.to_dict()
    }), 200


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
        trade=submission.trade or submission.worker_trade,
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
