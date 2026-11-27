from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class User(db.Model):
    """User / Assessor Model"""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, index=True, nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(150), nullable=True)
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

    def is_verified_contractor(self) -> bool:
        if self.role != "contractor":
            return False
        if hasattr(self, "contractor_profile") and self.contractor_profile:
            return self.contractor_profile.verification_status == "verified"
        return self.verification_status in ("approved", "verified")

    def is_admin(self) -> bool:
        return self.role == "admin"

    def to_dict(self):
        data = {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "location": self.location,
            "role": self.role,
            "professional_qualification": self.professional_qualification,
            "years_of_experience": self.years_of_experience,
            "trade": self.specialisation,
            "specialisation": self.specialisation,
            "verification_status": self.verification_status,
            "is_approved": self.is_approved_assessor(),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if hasattr(self, "contractor_profile") and self.contractor_profile:
            data["contractor_profile"] = self.contractor_profile.to_dict()
            data["is_contractor_verified"] = self.contractor_profile.verification_status == "verified"
        return data


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
    attempt_count = db.Column(db.Integer, default=1)
    history = db.Column(db.JSON, default=list)
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
            "attempt_count": self.attempt_count or 1,
            "history": self.history or [],
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


class ContractorProfile(db.Model):
    """Contractor / Employer Business Profile"""
    __tablename__ = "contractor_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    company_name = db.Column(db.String(200), nullable=False)
    business_type = db.Column(db.String(100), default="General Contractor")  # General Contractor, Subcontractor, etc.
    gstin = db.Column(db.String(30), nullable=True)
    business_address = db.Column(db.String(300), nullable=True)
    city = db.Column(db.String(100), nullable=False, index=True)
    state = db.Column(db.String(100), nullable=False, index=True)
    verification_status = db.Column(db.String(50), default="pending", index=True)  # pending | verified | rejected
    verified_at = db.Column(db.DateTime, nullable=True)
    rejection_reason = db.Column(db.Text, nullable=True)
    contact_email = db.Column(db.String(150), nullable=True)
    contact_phone = db.Column(db.String(50), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("contractor_profile", uselist=False, cascade="all, delete-orphan"))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "company_name": self.company_name,
            "business_type": self.business_type,
            "gstin": self.gstin,
            "business_address": self.business_address,
            "city": self.city,
            "state": self.state,
            "verification_status": self.verification_status,
            "is_verified": self.verification_status == "verified",
            "verified_at": self.verified_at.isoformat() if self.verified_at else None,
            "rejection_reason": self.rejection_reason,
            "contact_email": self.contact_email,
            "contact_phone": self.contact_phone,
            "website": self.website,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class JobPosting(db.Model):
    """Job Opportunity posted by a Contractor"""
    __tablename__ = "job_postings"

    id = db.Column(db.Integer, primary_key=True)
    contractor_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    trade = db.Column(db.String(50), nullable=False, index=True)  # electrician, plumber, mason, etc.
    description = db.Column(db.Text, nullable=False)
    required_skills = db.Column(db.Text, nullable=True)
    workers_needed = db.Column(db.Integer, default=1)
    experience_years = db.Column(db.Integer, default=0)
    location = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False, index=True)
    state = db.Column(db.String(100), nullable=False, index=True)
    employment_type = db.Column(db.String(50), default="Full-time")  # Full-time | Contract | Part-time | Day-wage
    payment_type = db.Column(db.String(50), default="Monthly")  # Daily | Monthly | Project-based
    wage_min = db.Column(db.Float, nullable=False)
    wage_max = db.Column(db.Float, nullable=False)
    duration = db.Column(db.String(100), nullable=True)  # e.g. "6 Months", "Immediate / Ongoing"
    start_date = db.Column(db.String(100), nullable=True)  # e.g. "Immediate", "Within 1 Week"
    working_hours = db.Column(db.String(100), nullable=True)  # e.g. "8 hrs / day, 9am - 5pm"
    safety_requirements = db.Column(db.Text, nullable=True)
    contact_details = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(30), default="active", index=True)  # active | paused | closed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    contractor = db.relationship("User", foreign_keys=[contractor_id], backref=db.backref("job_postings", cascade="all, delete-orphan"))
    applications = db.relationship("JobApplication", backref="job", cascade="all, delete-orphan", order_by="JobApplication.applied_at.desc()")

    def to_dict(self, include_contractor=True, include_counts=True):
        data = {
            "id": self.id,
            "contractor_id": self.contractor_id,
            "title": self.title,
            "trade": self.trade,
            "description": self.description,
            "required_skills": self.required_skills,
            "workers_needed": self.workers_needed,
            "experience_years": self.experience_years,
            "location": self.location,
            "city": self.city,
            "state": self.state,
            "employment_type": self.employment_type,
            "payment_type": self.payment_type,
            "wage_min": self.wage_min,
            "wage_max": self.wage_max,
            "duration": self.duration,
            "start_date": self.start_date,
            "working_hours": self.working_hours,
            "safety_requirements": self.safety_requirements,
            "contact_details": self.contact_details,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_contractor and self.contractor:
            prof = getattr(self.contractor, "contractor_profile", None)
            data["company_name"] = prof.company_name if prof else self.contractor.full_name
            data["contractor_name"] = self.contractor.full_name
            data["contractor_verified"] = prof.verification_status == "verified" if prof else False
        if include_counts:
            data["applications_count"] = len(self.applications) if self.applications else 0
        return data


class JobApplication(db.Model):
    """Worker Application for a Contractor Job Posting"""
    __tablename__ = "job_applications"
    __table_args__ = (
        db.UniqueConstraint("job_id", "worker_id", name="uq_job_worker_application"),
    )

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey("job_postings.id", ondelete="CASCADE"), nullable=False, index=True)
    worker_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status = db.Column(db.String(30), default="applied", index=True)  # applied | under_review | shortlisted | rejected | hired | withdrawn
    cover_note = db.Column(db.Text, nullable=True)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    worker = db.relationship("User", foreign_keys=[worker_id], backref=db.backref("job_applications", cascade="all, delete-orphan"))

    def to_dict(self, include_job=True, include_worker=True):
        data = {
            "id": self.id,
            "job_id": self.job_id,
            "worker_id": self.worker_id,
            "status": self.status,
            "cover_note": self.cover_note,
            "applied_at": self.applied_at.isoformat() if self.applied_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_job and self.job:
            data["job_title"] = self.job.title
            data["trade"] = self.job.trade
            prof = getattr(self.job.contractor, "contractor_profile", None) if self.job.contractor else None
            data["company_name"] = prof.company_name if prof else (self.job.contractor.full_name if self.job.contractor else "Contractor")
            data["city"] = self.job.city
            data["state"] = self.job.state
            data["wage_min"] = self.job.wage_min
            data["wage_max"] = self.job.wage_max
            data["payment_type"] = self.job.payment_type
            data["job_status"] = self.job.status
        if include_worker and self.worker:
            data["worker_name"] = self.worker.full_name
            data["worker_location"] = self.worker.location
            data["worker_trade"] = self.worker.specialisation
            data["worker_experience"] = self.worker.years_of_experience
            data["worker_qualification"] = self.worker.professional_qualification
            # Look up verified skill credential
            cred = SkillCredential.query.filter_by(worker_id=self.worker_id, status="active").first()
            if cred:
                data["has_verified_passport"] = True
                data["credential_id"] = cred.credential_id
                data["verification_token"] = cred.verification_token
                data["verification_url"] = f"https://ayush35099-cloud.github.io/SkillSetu/verify/{cred.verification_token}"
                data["skill_level"] = cred.skill_level
            else:
                data["has_verified_passport"] = False
        return data


class ContactRequest(db.Model):
    """Direct Contact / Interview Request between Contractor and Worker"""
    __tablename__ = "contact_requests"

    id = db.Column(db.Integer, primary_key=True)
    contractor_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    worker_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = db.Column(db.Integer, db.ForeignKey("job_postings.id", ondelete="SET NULL"), nullable=True, index=True)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default="pending", index=True)  # pending | accepted | declined
    worker_contact_shared = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    responded_at = db.Column(db.DateTime, nullable=True)

    contractor = db.relationship("User", foreign_keys=[contractor_id])
    worker = db.relationship("User", foreign_keys=[worker_id])
    job = db.relationship("JobPosting", foreign_keys=[job_id])

    def to_dict(self):
        data = {
            "id": self.id,
            "contractor_id": self.contractor_id,
            "worker_id": self.worker_id,
            "job_id": self.job_id,
            "message": self.message,
            "status": self.status,
            "worker_contact_shared": self.worker_contact_shared,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "responded_at": self.responded_at.isoformat() if self.responded_at else None,
        }
        if self.contractor:
            prof = getattr(self.contractor, "contractor_profile", None)
            data["company_name"] = prof.company_name if prof else self.contractor.full_name
            data["contractor_name"] = self.contractor.full_name
            data["contractor_phone"] = self.contractor.phone
            data["contractor_email"] = self.contractor.email
        if self.worker:
            data["worker_name"] = self.worker.full_name
            data["worker_trade"] = self.worker.specialisation
            data["worker_location"] = self.worker.location
            if self.worker_contact_shared and self.status == "accepted":
                data["worker_phone"] = self.worker.phone
                data["worker_email"] = self.worker.email
            else:
                data["worker_phone"] = None
                data["worker_email"] = None
        if self.job:
            data["job_title"] = self.job.title
        return data
