from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class User(db.Model):
    """User / Assessor Model"""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, index=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default="assessor")  # assessor | admin | worker | contractor
    professional_qualification = db.Column(db.String(255), nullable=True)
    years_of_experience = db.Column(db.Integer, default=0)
    specialisation = db.Column(db.String(150), nullable=True)  # trade specialty
    verification_status = db.Column(db.String(50), default="pending")  # pending | approved | rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def is_approved_assessor(self) -> bool:
        return self.role == "assessor" and self.verification_status == "approved"

    def is_admin(self) -> bool:
        return self.role == "admin"

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role,
            "professional_qualification": self.professional_qualification,
            "years_of_experience": self.years_of_experience,
            "specialisation": self.specialisation,
            "verification_status": self.verification_status,
            "is_approved": self.is_approved_assessor(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class AssessmentTask(db.Model):
    """Practical Assessment Task Model"""
    __tablename__ = "assessment_tasks"

    id = db.Column(db.Integer, primary_key=True)
    trade = db.Column(db.String(50), index=True, nullable=False)  # electrician, plumber, etc.
    task_title = db.Column(db.String(255), nullable=False)
    task_description = db.Column(db.Text, nullable=False)
    difficulty_level = db.Column(db.String(50), default="Intermediate")  # Apprentice, Intermediate, Advanced, Master
    safety_instructions = db.Column(db.Text, nullable=True)
    required_tools = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    rubrics = db.relationship(
        "AssessmentRubric",
        backref="task",
        cascade="all, delete-orphan",
        order_by="AssessmentRubric.display_order"
    )
    submissions = db.relationship(
        "AssessmentSubmission",
        backref="task",
        cascade="all, delete-orphan"
    )

    def to_dict(self, include_rubrics=False):
        data = {
            "id": self.id,
            "trade": self.trade,
            "task_title": self.task_title,
            "task_description": self.task_description,
            "difficulty_level": self.difficulty_level,
            "safety_instructions": self.safety_instructions,
            "required_tools": self.required_tools,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_rubrics:
            data["rubrics"] = [r.to_dict() for r in self.rubrics]
            data["max_possible_score"] = sum(r.max_score for r in self.rubrics)
        return data


class AssessmentRubric(db.Model):
    """Rubric Criterion for an Assessment Task"""
    __tablename__ = "assessment_rubrics"

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey("assessment_tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    criterion_name = db.Column(db.String(200), nullable=False)
    criterion_description = db.Column(db.Text, nullable=True)
    max_score = db.Column(db.Integer, nullable=False, default=25)
    weight = db.Column(db.Float, nullable=False, default=1.0)
    display_order = db.Column(db.Integer, nullable=False, default=1)

    def to_dict(self):
        return {
            "id": self.id,
            "task_id": self.task_id,
            "criterion_name": self.criterion_name,
            "criterion_description": self.criterion_description,
            "max_score": self.max_score,
            "weight": self.weight,
            "display_order": self.display_order,
        }


class AssessmentSubmission(db.Model):
    """Worker Demonstration Evidence Submission"""
    __tablename__ = "assessment_submissions"

    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, nullable=False, index=True)
    worker_name = db.Column(db.String(150), nullable=True)
    worker_phone = db.Column(db.String(50), nullable=True)
    worker_trade = db.Column(db.String(50), nullable=True)
    worker_experience = db.Column(db.Integer, nullable=True)
    worker_location = db.Column(db.String(150), nullable=True)
    task_id = db.Column(db.Integer, db.ForeignKey("assessment_tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    evidence_url = db.Column(db.String(500), nullable=False)
    evidence_type = db.Column(db.String(50), default="video")  # video | image
    submission_notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default="pending", index=True)
    # Statuses: pending | under_review | approved | rejected | resubmission_requested
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reviews = db.relationship(
        "AssessmentReview",
        backref="submission",
        cascade="all, delete-orphan",
        order_by="AssessmentReview.reviewed_at.desc()"
    )

    def to_dict(self, include_reviews=False):
        data = {
            "id": self.id,
            "worker_id": self.worker_id,
            "worker_name": self.worker_name,
            "worker_phone": self.worker_phone,
            "worker_trade": self.worker_trade,
            "worker_experience": self.worker_experience,
            "worker_location": self.worker_location,
            "task_id": self.task_id,
            "task_title": self.task.task_title if self.task else None,
            "trade": self.task.trade if self.task else self.worker_trade,
            "evidence_url": self.evidence_url,
            "evidence_type": self.evidence_type,
            "submission_notes": self.submission_notes,
            "status": self.status,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_reviews and self.reviews:
            data["latest_review"] = self.reviews[0].to_dict(include_criteria=True)
            data["reviews_count"] = len(self.reviews)
        elif self.reviews:
            data["latest_review"] = {
                "id": self.reviews[0].id,
                "decision": self.reviews[0].decision,
                "total_score": self.reviews[0].total_score,
                "maximum_score": self.reviews[0].maximum_score,
                "overall_feedback": self.reviews[0].overall_feedback,
                "reviewed_at": self.reviews[0].reviewed_at.isoformat() if self.reviews[0].reviewed_at else None,
            }
        return data


class AssessmentReview(db.Model):
    """Final Evaluation Decision & Review by an Assessor"""
    __tablename__ = "assessment_reviews"

    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Integer, db.ForeignKey("assessment_submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    assessor_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    total_score = db.Column(db.Float, nullable=False)
    maximum_score = db.Column(db.Float, nullable=False)
    overall_feedback = db.Column(db.Text, nullable=False)
    decision = db.Column(db.String(50), nullable=False)  # approved | rejected | resubmission_requested
    reviewed_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    assessor = db.relationship("User", backref="reviews")
    criterion_results = db.relationship(
        "AssessmentCriterionResult",
        backref="review",
        cascade="all, delete-orphan",
        order_by="AssessmentCriterionResult.id"
    )

    def to_dict(self, include_criteria=True):
        data = {
            "id": self.id,
            "submission_id": self.submission_id,
            "assessor_id": self.assessor_id,
            "assessor_name": self.assessor.full_name if self.assessor else "Assessor",
            "assessor_qualification": self.assessor.professional_qualification if self.assessor else None,
            "total_score": self.total_score,
            "maximum_score": self.maximum_score,
            "score_percentage": round((self.total_score / self.maximum_score * 100), 1) if self.maximum_score > 0 else 0,
            "overall_feedback": self.overall_feedback,
            "decision": self.decision,
            "reviewed_at": self.reviewed_at.isoformat() if self.reviewed_at else None,
        }
        if include_criteria:
            data["criterion_results"] = [c.to_dict() for c in self.criterion_results]
        return data


class AssessmentCriterionResult(db.Model):
    """Score and Comment for a Specific Rubric Criterion"""
    __tablename__ = "assessment_criterion_results"

    id = db.Column(db.Integer, primary_key=True)
    review_id = db.Column(db.Integer, db.ForeignKey("assessment_reviews.id", ondelete="CASCADE"), nullable=False, index=True)
    rubric_id = db.Column(db.Integer, db.ForeignKey("assessment_rubrics.id", ondelete="CASCADE"), nullable=False, index=True)
    score = db.Column(db.Float, nullable=False)
    assessor_comment = db.Column(db.Text, nullable=True)

    # Relationships
    rubric = db.relationship("AssessmentRubric")

    def to_dict(self):
        return {
            "id": self.id,
            "review_id": self.review_id,
            "rubric_id": self.rubric_id,
            "criterion_name": self.rubric.criterion_name if self.rubric else f"Criterion #{self.rubric_id}",
            "max_score": self.rubric.max_score if self.rubric else 25,
            "score": self.score,
            "assessor_comment": self.assessor_comment,
        }


class SkillCredential(db.Model):
    """Verifiable Digital Skill Passport Credential Model"""
    __tablename__ = "skill_credentials"

    id = db.Column(db.Integer, primary_key=True)
    credential_id = db.Column(db.String(64), unique=True, nullable=False, index=True)
    verification_token = db.Column(db.String(128), unique=True, nullable=False, index=True)
    worker_id = db.Column(db.Integer, nullable=False, index=True)
    worker_name = db.Column(db.String(150), nullable=False)
    trade = db.Column(db.String(50), nullable=False)
    skill_level = db.Column(db.String(50), default="Certified Practitioner", nullable=False)
    submission_id = db.Column(db.Integer, db.ForeignKey("assessment_submissions.id", ondelete="SET NULL"), nullable=True)
    review_id = db.Column(db.Integer, db.ForeignKey("assessment_reviews.id", ondelete="SET NULL"), nullable=True)
    issued_by_admin_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    issuing_authority = db.Column(db.String(100), default="SkillSetu (Track 4 – UnlockED)", nullable=False)
    status = db.Column(db.String(20), default="active", nullable=False, index=True)  # active | revoked | expired
    revocation_reason = db.Column(db.Text, nullable=True)
    issue_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    submission = db.relationship("AssessmentSubmission")
    review = db.relationship("AssessmentReview")
    issuer = db.relationship("User", foreign_keys=[issued_by_admin_id])

    def to_public_dict(self):
        """Sanitized public verification payload with zero private worker data."""
        return {
            "credential_id": self.credential_id,
            "verification_token": self.verification_token,
            "worker_name": self.worker_name,
            "trade": self.trade,
            "skill_level": self.skill_level,
            "status": self.status,
            "is_valid": self.status == "active",
            "revocation_reason": self.revocation_reason if self.status == "revoked" else None,
            "issue_date": self.issue_date.isoformat() if self.issue_date else None,
            "issuing_authority": self.issuing_authority,
            "verification_url": f"https://ayush35099-cloud.github.io/SkillSetu/verify/{self.verification_token}",
            "assessment_summary": {
                "score": self.review.total_score if self.review else None,
                "maximum_score": self.review.maximum_score if self.review else None,
                "score_percentage": round((self.review.total_score / self.review.maximum_score * 100), 1) if (self.review and self.review.maximum_score) else None,
                "assessed_at": self.review.reviewed_at.isoformat() if (self.review and self.review.reviewed_at) else None
            } if self.review else None
        }

    def to_admin_dict(self):
        """Extended dictionary for admin operations and worker passport."""
        data = self.to_public_dict()
        data.update({
            "id": self.id,
            "worker_id": self.worker_id,
            "submission_id": self.submission_id,
            "review_id": self.review_id,
            "issued_by_admin_id": self.issued_by_admin_id,
            "issuer_name": self.issuer.full_name if self.issuer else "Platform Administrator",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        })
        return data
