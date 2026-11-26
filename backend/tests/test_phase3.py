import unittest
import json
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app, db
from app.models import User, AssessmentTask, AssessmentRubric, AssessmentSubmission, AssessmentReview

class Phase3TestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Configure test app with in-memory sqlite
        class TestConfig:
            TESTING = True
            SECRET_KEY = "test-secret-key-phase-3"
            SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
            SQLALCHEMY_TRACK_MODIFICATIONS = False
            CORS_ORIGINS = "*"

        cls.app = create_app(TestConfig)
        cls.client = cls.app.test_client()

    def setUp(self):
        with self.app.app_context():
            db.create_all()
            from app.seeds import seed_database
            seed_database(self.app)

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_health_endpoints(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "healthy")

        res_db = self.client.get("/api/health/db")
        self.assertEqual(res_db.status_code, 200)
        db_data = res_db.get_json()
        self.assertEqual(db_data["status"], "connected")

    def test_tasks_and_rubrics_seeded(self):
        res = self.client.get("/api/tasks")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "success")
        self.assertGreaterEqual(data["count"], 16)  # 8 trades * 2 tasks each

        # Check electrician trade specifically
        elec_res = self.client.get("/api/tasks?trade=electrician")
        elec_data = elec_res.get_json()
        self.assertEqual(len(elec_data["tasks"]), 2)
        task = elec_data["tasks"][0]
        self.assertIn("rubrics", task)
        self.assertGreaterEqual(len(task["rubrics"]), 3)

    def test_assessor_registration_and_pending_status(self):
        payload = {
            "full_name": "Karan Verma",
            "email": "karan.verma@example.com",
            "password": "Password123!",
            "professional_qualification": "ITI Certified Electrician",
            "years_of_experience": 7,
            "specialisation": "electrician"
        }
        res = self.client.post("/api/auth/assessor/register", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertEqual(data["status"], "success")
        self.assertIn("token", data)
        self.assertEqual(data["user"]["verification_status"], "pending")
        self.assertFalse(data["user"]["is_approved"])

    def test_assessor_login_and_unapproved_restriction(self):
        # 1. Login with pending assessor (vikram.assessor@skillsetu.in)
        login_res = self.client.post("/api/auth/assessor/login", json={
            "email": "vikram.assessor@skillsetu.in",
            "password": "Assessor@123"
        })
        self.assertEqual(login_res.status_code, 200)
        token = login_res.get_json()["token"]

        # 2. Can access dashboard
        dash_res = self.client.get("/api/assessor/dashboard", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(dash_res.status_code, 200)

        # 3. CANNOT submit final review while unapproved (HTTP 403)
        review_payload = {
            "decision": "approved",
            "overall_feedback": "Looks acceptable.",
            "criteria_scores": [{"rubric_id": 1, "score": 20}]
        }
        review_res = self.client.post(
            "/api/assessor/submissions/1/review",
            json=review_payload,
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(review_res.status_code, 403)
        self.assertIn("pending administrative verification", review_res.get_json()["message"])

    def test_admin_approves_assessor(self):
        # 1. Admin login
        admin_login = self.client.post("/api/auth/admin/login", json={
            "email": "admin@skillsetu.in",
            "password": "Admin@123"
        })
        self.assertEqual(admin_login.status_code, 200)
        admin_token = admin_login.get_json()["token"]

        # 2. Get pending assessor ID
        with self.app.app_context():
            user = User.query.filter_by(email="vikram.assessor@skillsetu.in").first()
            user_id = user.id

        # 3. Admin approves assessor
        approve_res = self.client.patch(
            f"/api/admin/assessors/{user_id}/approve",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        self.assertEqual(approve_res.status_code, 200)
        self.assertEqual(approve_res.get_json()["user"]["verification_status"], "approved")

    def test_approved_assessor_can_review_and_score(self):
        # 1. Login with approved assessor (assessor@skillsetu.in)
        login_res = self.client.post("/api/auth/assessor/login", json={
            "email": "assessor@skillsetu.in",
            "password": "Assessor@123"
        })
        self.assertEqual(login_res.status_code, 200)
        token = login_res.get_json()["token"]

        # 2. Get submission detail (Submission 1 is task 1 for Electrician)
        sub_res = self.client.get(
            "/api/assessor/submissions/1",
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(sub_res.status_code, 200)
        sub_data = sub_res.get_json()
        rubrics = sub_data["task"]["rubrics"]

        # 3. Submit complete rubric review with scores
        scores = [{"rubric_id": r["id"], "score": 22.0, "comment": "Good execution"} for r in rubrics]
        review_payload = {
            "decision": "approved",
            "overall_feedback": "Demonstration adheres strictly to IS standards with proper safety shoe check and continuity verification.",
            "criteria_scores": scores
        }

        review_res = self.client.post(
            "/api/assessor/submissions/1/review",
            json=review_payload,
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(review_res.status_code, 200)
        data = review_res.get_json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["submission_status"], "approved")
        self.assertEqual(data["review"]["decision"], "approved")
        self.assertEqual(data["review"]["total_score"], 22.0 * len(rubrics))

    def test_score_validation_exceeding_max_score(self):
        login_res = self.client.post("/api/auth/assessor/login", json={
            "email": "assessor@skillsetu.in",
            "password": "Assessor@123"
        })
        token = login_res.get_json()["token"]

        sub_res = self.client.get("/api/assessor/submissions/2", headers={"Authorization": f"Bearer {token}"})
        rubrics = sub_res.get_json()["task"]["rubrics"]

        # Assign an invalid score of 999 where max_score is 25
        scores = [{"rubric_id": rubrics[0]["id"], "score": 999.0, "comment": "Invalid score"}]
        for r in rubrics[1:]:
            scores.append({"rubric_id": r["id"], "score": 20.0, "comment": "OK"})

        res = self.client.post(
            "/api/assessor/submissions/2/review",
            json={
                "decision": "approved",
                "overall_feedback": "Validating score boundaries.",
                "criteria_scores": scores
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("must be between 0 and", res.get_json()["message"])

    def test_worker_submit_and_view_workflow(self):
        # 1. Worker submits demonstration
        submit_payload = {
            "worker_id": 205,
            "worker_name": "Deepak Sharma",
            "worker_phone": "9988776655",
            "worker_trade": "welder",
            "worker_experience": 6,
            "worker_location": "Jaipur, Rajasthan",
            "task_id": 9,  # Welder task
            "evidence_url": "https://www.youtube.com/watch?v=sample-welder-vid",
            "evidence_type": "video",
            "submission_notes": "Fillet weld completed in 2F horizontal position using E6013 electrodes."
        }
        res = self.client.post("/api/worker/assessments/submit", json=submit_payload)
        self.assertEqual(res.status_code, 201)
        sub_id = res.get_json()["submission"]["id"]

        # 2. Worker views assessments
        view_res = self.client.get(f"/api/worker/assessments?worker_id=205")
        self.assertEqual(view_res.status_code, 200)
        self.assertEqual(len(view_res.get_json()["assessments"]), 1)
        self.assertEqual(view_res.get_json()["assessments"][0]["status"], "pending")

        # 3. Assessor requests resubmission
        login_res = self.client.post("/api/auth/assessor/login", json={
            "email": "assessor@skillsetu.in",
            "password": "Assessor@123"
        })
        token = login_res.get_json()["token"]

        sub_res = self.client.get(f"/api/assessor/submissions/{sub_id}", headers={"Authorization": f"Bearer {token}"})
        rubrics = sub_res.get_json()["task"]["rubrics"]
        scores = [{"rubric_id": r["id"], "score": 15.0, "comment": "Need closer camera angle on weld crater"} for r in rubrics]

        review_res = self.client.post(
            f"/api/assessor/submissions/{sub_id}/review",
            json={
                "decision": "resubmission_requested",
                "overall_feedback": "Please re-record with proper lighting on the root pass and crater fill.",
                "criteria_scores": scores
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(review_res.status_code, 200)

        # 4. Worker resubmits
        resubmit_res = self.client.post(
            f"/api/worker/assessments/{sub_id}/resubmit",
            json={
                "evidence_url": "https://www.youtube.com/watch?v=sample-welder-vid-v2",
                "submission_notes": "Re-recorded with closer macro camera on root pass and chipped slag as requested."
            }
        )
        self.assertEqual(resubmit_res.status_code, 200)
        self.assertEqual(resubmit_res.get_json()["submission"]["status"], "pending")

if __name__ == "__main__":
    unittest.main()
