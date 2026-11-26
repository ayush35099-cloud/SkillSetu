import unittest
import sqlite3
import tempfile
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from werkzeug.security import generate_password_hash
from app import create_app, db
from app.migrations import run_migrations, verify_schema, sanitize_db_error
from app.models import User, AssessmentSubmission, SkillCredential


class MigrationTestCase(unittest.TestCase):
    def setUp(self):
        self.app = None
        self.tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
        self.tmp.close()
        self.db_path = self.tmp.name

    def tearDown(self):
        if self.app is not None:
            with self.app.app_context():
                db.session.remove()
                db.engine.dispose()
        try:
            if os.path.exists(self.db_path):
                os.remove(self.db_path)
        except OSError:
            pass

    def _create_legacy_phase3_db(self):
        """Populate SQLite DB with exact Phase 3 (commit b382a77) schema & existing rows."""
        conn = sqlite3.connect(self.db_path)
        conn.executescript(
            """
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                full_name VARCHAR(150) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                professional_qualification VARCHAR(255),
                years_of_experience INTEGER,
                specialisation VARCHAR(150),
                verification_status VARCHAR(50),
                created_at DATETIME,
                updated_at DATETIME
            );
            CREATE TABLE assessment_tasks (
                id INTEGER PRIMARY KEY,
                trade VARCHAR(50) NOT NULL,
                task_title VARCHAR(255) NOT NULL,
                task_description TEXT NOT NULL,
                difficulty_level VARCHAR(50),
                safety_instructions TEXT,
                required_tools TEXT,
                is_active BOOLEAN,
                created_at DATETIME
            );
            CREATE TABLE assessment_rubrics (
                id INTEGER PRIMARY KEY,
                task_id INTEGER NOT NULL,
                criterion_name VARCHAR(200) NOT NULL,
                criterion_description TEXT,
                max_score INTEGER NOT NULL,
                weight FLOAT NOT NULL,
                display_order INTEGER NOT NULL
            );
            CREATE TABLE assessment_submissions (
                id INTEGER PRIMARY KEY,
                worker_id INTEGER NOT NULL,
                worker_name VARCHAR(150),
                worker_phone VARCHAR(50),
                worker_trade VARCHAR(50),
                worker_experience INTEGER,
                worker_location VARCHAR(150),
                task_id INTEGER NOT NULL,
                evidence_url VARCHAR(500) NOT NULL,
                evidence_type VARCHAR(50),
                submission_notes TEXT,
                status VARCHAR(50),
                submitted_at DATETIME,
                updated_at DATETIME
            );
            CREATE TABLE assessment_reviews (
                id INTEGER PRIMARY KEY,
                submission_id INTEGER NOT NULL,
                assessor_id INTEGER NOT NULL,
                total_score FLOAT NOT NULL,
                maximum_score FLOAT NOT NULL,
                overall_feedback TEXT NOT NULL,
                decision VARCHAR(50) NOT NULL,
                reviewed_at DATETIME
            );
            CREATE TABLE assessment_criterion_results (
                id INTEGER PRIMARY KEY,
                review_id INTEGER NOT NULL,
                rubric_id INTEGER NOT NULL,
                score FLOAT NOT NULL,
                assessor_comment TEXT
            );
            """
        )

        pw_assessor = generate_password_hash("Assessor@123")
        pw_admin = generate_password_hash("Admin@123")
        conn.execute(
            """
            INSERT INTO users (id, full_name, email, password_hash, role, professional_qualification, years_of_experience, specialisation, verification_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (1, "Rajesh Sharma (Master Assessor)", "assessor@skillsetu.in", pw_assessor, "assessor", "NSDC Master Assessor", 14, "electrician", "approved"),
        )
        conn.execute(
            """
            INSERT INTO users (id, full_name, email, password_hash, role, professional_qualification, years_of_experience, specialisation, verification_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (2, "Vikram Patel (Vocational Evaluator)", "vikram.assessor@skillsetu.in", pw_assessor, "assessor", "Civil Diploma", 6, "mason", "pending"),
        )
        conn.execute(
            """
            INSERT INTO users (id, full_name, email, password_hash, role, professional_qualification, years_of_experience, specialisation, verification_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (3, "SkillSetu System Administrator", "admin@skillsetu.in", pw_admin, "admin", "Governance Lead", 10, "administration", "approved"),
        )
        conn.execute(
            "INSERT INTO assessment_tasks (id, trade, task_title, task_description, difficulty_level, is_active) VALUES (1, 'technician', 'Solar UPS', 'Test', 'Intermediate', 1)"
        )
        conn.execute(
            "INSERT INTO assessment_submissions (id, worker_id, worker_name, worker_trade, task_id, evidence_url, status) VALUES (1, 104, 'Kavita Devi', 'technician', 1, 'https://example.com/kavita.jpg', 'approved')"
        )
        conn.execute(
            "INSERT INTO assessment_reviews (id, submission_id, assessor_id, total_score, maximum_score, overall_feedback, decision) VALUES (1, 1, 1, 94.0, 100.0, 'Great job!', 'approved')"
        )
        conn.commit()
        conn.close()

    def test_legacy_schema_upgrades_without_data_loss_and_is_idempotent(self):
        self._create_legacy_phase3_db()

        class LegacyUpgradeConfig:
            TESTING = True
            SECRET_KEY = "test-migration-secret"
            SQLALCHEMY_DATABASE_URI = f"sqlite:///{self.db_path}"
            SQLALCHEMY_TRACK_MODIFICATIONS = False
            CORS_ORIGINS = "*"

        app = create_app(LegacyUpgradeConfig)
        self.app = app
        client = app.test_client()

        with app.app_context():
            # Existing users preserved
            assessor = User.query.filter_by(email="assessor@skillsetu.in").first()
            self.assertIsNotNone(assessor)
            self.assertEqual(assessor.id, 1)

            # Existing submission preserved with safe defaults for new columns
            sub = db.session.get(AssessmentSubmission, 1)
            self.assertIsNotNone(sub)
            self.assertEqual(sub.worker_name, "Kavita Devi")
            self.assertEqual(sub.attempt_count, 1)
            self.assertEqual(sub.history, [])

            # Seeded credential created cleanly even on pre-existing submissions DB
            cred = SkillCredential.query.filter_by(verification_token="verify-kavita-devi-solarpv-2026").first()
            self.assertIsNotNone(cred)
            self.assertEqual(cred.worker_id, 104)

            # Re-running migrations must be a clean no-op
            second_run = run_migrations(app, db)
            self.assertEqual(second_run, [])
            verify_schema(db)

        # Assessor login must succeed (no more HTTP 500)
        res = client.post("/api/auth/assessor/login", json={
            "email": "assessor@skillsetu.in",
            "password": "Assessor@123",
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("token", res.get_json())

        # Invalid password returns 401 (never 500)
        bad_res = client.post("/api/auth/assessor/login", json={
            "email": "assessor@skillsetu.in",
            "password": "WrongPassword",
        })
        self.assertEqual(bad_res.status_code, 401)

        # Admin & Worker login succeed
        admin_res = client.post("/api/auth/admin/login", json={
            "email": "admin@skillsetu.in",
            "password": "Admin@123",
        })
        self.assertEqual(admin_res.status_code, 200)

        worker_res = client.post("/api/auth/worker/login", json={
            "email": "worker@skillsetu.in",
            "password": "Worker@123",
        })
        self.assertEqual(worker_res.status_code, 200)

        # Health endpoints report healthy & initialized
        self.assertEqual(client.get("/api/health").status_code, 200)
        self.assertEqual(client.get("/api/health/db").status_code, 200)

    def test_sanitize_db_error_scrubs_secrets(self):
        err = Exception("connection failed for postgresql+psycopg://admin:SuperSecretPass99@db.render.internal:5432/skillsetu")
        cleaned = sanitize_db_error(err)
        self.assertNotIn("SuperSecretPass99", cleaned)
        self.assertNotIn("admin:SuperSecretPass99", cleaned)
        self.assertIn("***:***", cleaned)

    def test_verify_schema_fails_on_missing_column(self):
        """Schema verifier must reject tables missing expected SQLAlchemy columns."""
        from sqlalchemy import create_engine, text as sql_text
        temp_engine = create_engine(f"sqlite:///{self.db_path}")
        with temp_engine.begin() as conn:
            conn.execute(sql_text("CREATE TABLE users (id INTEGER PRIMARY KEY, email VARCHAR(150));"))

        class DummyDB:
            engine = temp_engine
            Model = db.Model

        try:
            with self.assertRaises(RuntimeError) as ctx:
                verify_schema(DummyDB)
            self.assertIn("Schema drift detected", str(ctx.exception))
        finally:
            temp_engine.dispose()


if __name__ == "__main__":
    unittest.main()
