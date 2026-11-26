import unittest
import json
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app, db
from app.models import User, SkillCredential, AssessmentSubmission, AssessmentReview, AssessmentTask

class SkillCredentialTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        class TestConfig:
            TESTING = True
            SECRET_KEY = "test-secret-key-credentials"
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

    def _get_admin_token(self):
        login_res = self.client.post("/api/auth/admin/login", json={
            "email": "admin@skillsetu.in",
            "password": "Admin@123"
        })
        self.assertEqual(login_res.status_code, 200)
        return login_res.get_json()["token"]

    def _get_assessor_token(self):
        login_res = self.client.post("/api/auth/assessor/login", json={
            "email": "assessor@skillsetu.in",
            "password": "Assessor@123"
        })
        self.assertEqual(login_res.status_code, 200)
        return login_res.get_json()["token"]

    def test_verify_seeded_valid_token(self):
        """Public endpoint should return sanitized data without leaking worker personal data."""
        res = self.client.get("/api/credentials/verify/verify-kavita-devi-solarpv-2026")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "valid")
        self.assertTrue(data["valid"])
        cred = data["credential"]
        self.assertEqual(cred["credential_id"], "SKILLSETU-2026-8842")
        self.assertEqual(cred["worker_name"], "Kavita Devi")
        self.assertEqual(cred["trade"], "technician")
        # Ensure zero private worker data is leaked
        self.assertNotIn("phone", cred)
        self.assertNotIn("worker_phone", cred)
        self.assertNotIn("email", cred)
        self.assertNotIn("password_hash", cred)

    def test_verify_invalid_token(self):
        """Unknown or corrupted token returns 404 with status invalid."""
        res = self.client.get("/api/credentials/verify/non-existent-token-xyz")
        self.assertEqual(res.status_code, 404)
        data = res.get_json()
        self.assertEqual(data["status"], "invalid")
        self.assertFalse(data["valid"])

    def test_worker_credentials_endpoint(self):
        """Worker credentials query should return credentials for specified worker_id."""
        with self.app.app_context():
            kavita = User.query.filter_by(email="kavita.devi@skillsetu.in").first()
            kavita_id = kavita.id if kavita else 104
        res = self.client.get(f"/api/worker/credentials?worker_id={kavita_id}")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "success")
        self.assertGreaterEqual(len(data["credentials"]), 1)
        self.assertEqual(data["credentials"][0]["worker_name"], "Kavita Devi")

    def test_issue_credential_requires_admin_role(self):
        """Non-admin (e.g. assessor or unauthenticated) cannot issue a credential."""
        # Unauthenticated
        res = self.client.post("/api/admin/credentials/issue", json={"submission_id": 1})
        self.assertEqual(res.status_code, 401)

        # Assessor token
        assessor_token = self._get_assessor_token()
        res_assessor = self.client.post(
            "/api/admin/credentials/issue",
            headers={"Authorization": f"Bearer {assessor_token}"},
            json={"submission_id": 1}
        )
        self.assertEqual(res_assessor.status_code, 403)

    def test_issue_credential_requires_approved_submission(self):
        """Admin cannot issue a credential if submission is pending or unreviewed."""
        admin_token = self._get_admin_token()

        # Create a pending submission without review
        with self.app.app_context():
            task = AssessmentTask.query.first()
            pending_sub = AssessmentSubmission(
                task_id=task.id,
                worker_id=101,
                worker_name="Ramesh Kumar",
                worker_phone="9876543210",
                worker_trade="Electrician",
                evidence_url="https://youtube.com/watch?v=sample-pending",
                evidence_type="video",
                status="pending"
            )
            db.session.add(pending_sub)
            db.session.commit()
            sub_id = pending_sub.id

        # Try to issue credential for this unapproved submission
        res = self.client.post(
            "/api/admin/credentials/issue",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"submission_id": sub_id}
        )
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn("must be evaluated and approved", data["message"])

    def test_issue_and_revoke_credential_flow(self):
        """Complete issuance -> verification -> revocation lifecycle."""
        admin_token = self._get_admin_token()

        # Seeded submission #1 is approved in seeds
        with self.app.app_context():
            sub = AssessmentSubmission.query.filter_by(status="approved").first()
            self.assertIsNotNone(sub)
            target_sub_id = sub.id

        # Issue credential as Admin
        issue_res = self.client.post(
            "/api/admin/credentials/issue",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"submission_id": target_sub_id}
        )
        self.assertIn(issue_res.status_code, [200, 201])
        issue_data = issue_res.get_json()
        cred = issue_data["credential"]
        cred_id = cred["id"]
        token = cred["verification_token"]

        # Verify credential via public endpoint
        verify_res = self.client.get(f"/api/credentials/verify/{token}")
        self.assertEqual(verify_res.status_code, 200)
        self.assertEqual(verify_res.get_json()["status"], "valid")

        # Admin revokes credential with reason
        revoke_res = self.client.patch(
            f"/api/admin/credentials/{cred_id}/revoke",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"reason": "Safety protocol discrepancy during audit."}
        )
        self.assertEqual(revoke_res.status_code, 200)

        # Public verification now reflects revoked status with reason
        verify_revoked = self.client.get(f"/api/credentials/verify/{token}")
        self.assertEqual(verify_revoked.status_code, 200)
        revoked_data = verify_revoked.get_json()
        self.assertEqual(revoked_data["status"], "revoked")
        self.assertFalse(revoked_data["valid"])
        self.assertEqual(revoked_data["credential"]["revocation_reason"], "Safety protocol discrepancy during audit.")

if __name__ == "__main__":
    unittest.main()
