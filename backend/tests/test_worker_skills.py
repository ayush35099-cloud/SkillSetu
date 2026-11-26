import unittest
import json
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app, db
from app.models import User, AssessmentTask, AssessmentSubmission, AssessmentReview

class WorkerSkillsTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        class TestConfig:
            TESTING = True
            SECRET_KEY = "test-secret-key-worker-skills"
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

    def test_worker_registration_and_login(self):
        """Worker can register with trade & experience, and log in to obtain auth token."""
        # 1. Registration
        reg_res = self.client.post("/api/auth/worker/register", json={
            "full_name": "Arun Verma",
            "email": "arun.verma@example.com",
            "password": "Password@123",
            "phone": "9811223344",
            "trade": "electrician",
            "years_of_experience": 5,
            "location": "Bengaluru, Karnataka"
        })
        self.assertEqual(reg_res.status_code, 201)
        reg_data = reg_res.get_json()
        self.assertEqual(reg_data["status"], "success")
        self.assertIn("token", reg_data)
        self.assertEqual(reg_data["user"]["role"], "worker")
        self.assertEqual(reg_data["user"]["trade"], "electrician")

        # 2. Login
        login_res = self.client.post("/api/auth/worker/login", json={
            "email": "arun.verma@example.com",
            "password": "Password@123"
        })
        self.assertEqual(login_res.status_code, 200)
        login_data = login_res.get_json()
        self.assertIn("token", login_data)
        self.assertEqual(login_data["user"]["full_name"], "Arun Verma")

    def test_unauthenticated_requests_rejected(self):
        """Unauthenticated requests to worker endpoints must return HTTP 401."""
        # 1. View assessments without token
        res_view = self.client.get("/api/worker/assessments")
        self.assertEqual(res_view.status_code, 401)

        # 2. Submit without token
        res_submit = self.client.post("/api/worker/assessments/submit", json={
            "task_id": 1,
            "evidence_url": "https://youtube.com/watch?v=test"
        })
        self.assertEqual(res_submit.status_code, 401)

        # 3. Resubmit without token
        res_resubmit = self.client.post("/api/worker/assessments/1/resubmit", json={
            "evidence_url": "https://youtube.com/watch?v=test2"
        })
        self.assertEqual(res_resubmit.status_code, 401)

    def test_worker_isolation_and_security(self):
        """Worker A cannot view or modify Worker B's assessments."""
        # 1. Register Worker A
        res_a = self.client.post("/api/auth/worker/register", json={
            "full_name": "Worker Alpha",
            "email": "alpha@example.com",
            "password": "Password@123",
            "trade": "electrician"
        })
        token_a = res_a.get_json()["token"]

        # 2. Register Worker B
        res_b = self.client.post("/api/auth/worker/register", json={
            "full_name": "Worker Beta",
            "email": "beta@example.com",
            "password": "Password@123",
            "trade": "plumber"
        })
        token_b = res_b.get_json()["token"]

        # 3. Worker A submits demonstration
        sub_a_res = self.client.post(
            "/api/worker/assessments/submit",
            headers={"Authorization": f"Bearer {token_a}"},
            json={
                "task_id": 1,
                "evidence_url": "https://youtube.com/watch?v=alpha-demo",
                "submission_notes": "Alpha electrical panel wiring"
            }
        )
        self.assertEqual(sub_a_res.status_code, 201)
        sub_a_id = sub_a_res.get_json()["submission"]["id"]

        # 4. Worker B fetches assessments -> Worker A's submission MUST NOT appear
        b_list_res = self.client.get(
            "/api/worker/assessments",
            headers={"Authorization": f"Bearer {token_b}"}
        )
        self.assertEqual(b_list_res.status_code, 200)
        b_assessments = b_list_res.get_json()["assessments"]
        self.assertEqual(len(b_assessments), 0)

        # 5. Worker B attempts to access Worker A's submission directly -> 403 Forbidden
        b_direct_res = self.client.get(
            f"/api/worker/assessments/{sub_a_id}",
            headers={"Authorization": f"Bearer {token_b}"}
        )
        self.assertEqual(b_direct_res.status_code, 403)

        # 6. Worker B attempts to resubmit Worker A's submission -> 403 Forbidden
        b_resubmit_res = self.client.post(
            f"/api/worker/assessments/{sub_a_id}/resubmit",
            headers={"Authorization": f"Bearer {token_b}"},
            json={"evidence_url": "https://youtube.com/watch?v=tampered"}
        )
        self.assertEqual(b_resubmit_res.status_code, 403)

    def test_invalid_task_and_evidence_url_validation(self):
        """Invalid task IDs or malformed evidence URLs must be rejected."""
        login_res = self.client.post("/api/auth/worker/login", json={
            "email": "worker@skillsetu.in",
            "password": "Worker@123"
        })
        token = login_res.get_json()["token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Non-existent task ID -> 404
        bad_task = self.client.post(
            "/api/worker/assessments/submit",
            headers=headers,
            json={"task_id": 999999, "evidence_url": "https://youtube.com/watch?v=test"}
        )
        self.assertEqual(bad_task.status_code, 404)

        # 2. Empty evidence URL -> 400
        empty_url = self.client.post(
            "/api/worker/assessments/submit",
            headers=headers,
            json={"task_id": 1, "evidence_url": ""}
        )
        self.assertEqual(empty_url.status_code, 400)

        # 3. Invalid format URL (not http/https) -> 400
        invalid_format = self.client.post(
            "/api/worker/assessments/submit",
            headers=headers,
            json={"task_id": 1, "evidence_url": "javascript:alert(1)"}
        )
        self.assertEqual(invalid_format.status_code, 400)

    def test_complete_resubmission_and_history_lifecycle(self):
        """Worker submits -> Assessor requests resubmission -> Worker resubmits -> History is preserved."""
        # 1. Worker logs in and submits demonstration
        w_login = self.client.post("/api/auth/worker/login", json={
            "email": "worker@skillsetu.in",
            "password": "Worker@123"
        })
        w_token = w_login.get_json()["token"]
        w_headers = {"Authorization": f"Bearer {w_token}"}

        sub_res = self.client.post(
            "/api/worker/assessments/submit",
            headers=w_headers,
            json={
                "task_id": 1,
                "evidence_url": "https://youtube.com/watch?v=original-attempt",
                "submission_notes": "First attempt at conduit bending and DB wiring"
            }
        )
        self.assertEqual(sub_res.status_code, 201)
        sub_id = sub_res.get_json()["submission"]["id"]
        self.assertEqual(sub_res.get_json()["submission"]["attempt_count"], 1)

        # 2. Assessor logs in and reviews submission
        a_login = self.client.post("/api/auth/assessor/login", json={
            "email": "assessor@skillsetu.in",
            "password": "Assessor@123"
        })
        a_token = a_login.get_json()["token"]
        a_headers = {"Authorization": f"Bearer {a_token}"}

        sub_detail = self.client.get(f"/api/assessor/submissions/{sub_id}", headers=a_headers).get_json()
        rubrics = sub_detail["task"]["rubrics"]
        criteria_scores = [
            {"rubric_id": r["id"], "score": 12.0 if idx == 1 else 22.0, "comment": "Conduit offset radius is uneven. Needs re-bend." if idx == 1 else "Good execution"}
            for idx, r in enumerate(rubrics)
        ]

        review_res = self.client.post(
            f"/api/assessor/submissions/{sub_id}/review",
            headers=a_headers,
            json={
                "decision": "resubmission_requested",
                "overall_feedback": "Please re-bend the 90-degree offset with uniform radius without crimping the pipe.",
                "criteria_scores": criteria_scores
            }
        )
        self.assertEqual(review_res.status_code, 200)

        # 3. Worker inspects feedback
        worker_view = self.client.get(f"/api/worker/assessments/{sub_id}", headers=w_headers)
        self.assertEqual(worker_view.status_code, 200)
        sub_data = worker_view.get_json()["assessment"]
        self.assertEqual(sub_data["status"], "resubmission_requested")
        self.assertEqual(sub_data["latest_review"]["decision"], "resubmission_requested")
        self.assertIn("Please re-bend", sub_data["latest_review"]["overall_feedback"])

        # 4. Worker resubmits revised evidence
        resubmit_res = self.client.post(
            f"/api/worker/assessments/{sub_id}/resubmit",
            headers=w_headers,
            json={
                "evidence_url": "https://youtube.com/watch?v=corrected-attempt-2",
                "submission_notes": "Re-bent conduit with standard radius spring; no crimping."
            }
        )
        self.assertEqual(resubmit_res.status_code, 200)
        resub_data = resubmit_res.get_json()["submission"]
        self.assertEqual(resub_data["status"], "pending")
        self.assertEqual(resub_data["attempt_count"], 2)
        # Verify history preserved
        self.assertEqual(len(resub_data["history"]), 1)
        self.assertEqual(resub_data["history"][0]["evidence_url"], "https://youtube.com/watch?v=original-attempt")

        # 5. Assessor approves attempt #2
        approve_scores = [
            {"rubric_id": r["id"], "score": 24.0, "comment": "Excellent correction and flawless termination."}
            for r in rubrics
        ]
        approve_res = self.client.post(
            f"/api/assessor/submissions/{sub_id}/review",
            headers=a_headers,
            json={
                "decision": "approved",
                "overall_feedback": "Excellent correction! Conduit bend is smooth and MCB termination is clean.",
                "criteria_scores": approve_scores
            }
        )
        self.assertEqual(approve_res.status_code, 200)

        # 6. Worker cannot resubmit an approved assessment -> 400
        bad_resubmit = self.client.post(
            f"/api/worker/assessments/{sub_id}/resubmit",
            headers=w_headers,
            json={"evidence_url": "https://youtube.com/watch?v=should-fail"}
        )
        self.assertEqual(bad_resubmit.status_code, 400)

if __name__ == "__main__":
    unittest.main()
