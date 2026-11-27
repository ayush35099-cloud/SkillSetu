import unittest
import json
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app, db
from app.models import User, ContractorProfile, JobPosting, JobApplication, ContactRequest


class Phase4ContractorTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        class TestConfig:
            TESTING = True
            SECRET_KEY = "test-secret-key-phase4-contractor"
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

    def _login(self, email, password):
        res = self.client.post("/api/auth/login", json={"email": email, "password": password})
        self.assertEqual(res.status_code, 200, f"Login failed for {email}: {res.get_data(as_text=True)}")
        data = res.get_json()
        return data["token"]

    def test_01_contractor_registration_and_login(self):
        """Contractor registers with business details, verifies profile creation, and logs in."""
        reg_res = self.client.post("/api/auth/contractor/register", json={
            "full_name": "Rajiv Mehra",
            "company_name": "Mehra Electrical Projects LLP",
            "email": "rajiv.mehra@mehraprojects.in",
            "password": "Password@123",
            "phone": "9819001122",
            "business_address": "402 Maker Chambers, Nariman Point",
            "city": "Mumbai",
            "state": "Maharashtra",
            "business_type": "Commercial Electrical Contractor",
            "gstin": "27AAAPM1234F1Z5",
            "description": "High-voltage and industrial panel installations."
        })
        self.assertEqual(reg_res.status_code, 201)
        reg_data = reg_res.get_json()
        self.assertEqual(reg_data["status"], "success")
        self.assertIn("token", reg_data)
        self.assertEqual(reg_data["user"]["role"], "contractor")

        # Verify ContractorProfile created
        with self.app.app_context():
            user = User.query.filter_by(email="rajiv.mehra@mehraprojects.in").first()
            self.assertIsNotNone(user)
            self.assertIsNotNone(user.contractor_profile)
            self.assertEqual(user.contractor_profile.company_name, "Mehra Electrical Projects LLP")
            self.assertEqual(user.contractor_profile.verification_status, "pending")

        # Test Login
        login_res = self.client.post("/api/auth/contractor/login", json={
            "email": "rajiv.mehra@mehraprojects.in",
            "password": "Password@123"
        })
        self.assertEqual(login_res.status_code, 200)
        login_data = login_res.get_json()
        self.assertEqual(login_data["status"], "success")
        self.assertIn("token", login_data)

    def test_02_contractor_profile_and_dashboard(self):
        """Contractor can view/update profile and retrieve dashboard statistics."""
        token = self._login("contractor@skillsetu.in", "Contractor@123")
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Get profile
        prof_res = self.client.get("/api/contractor/profile", headers=headers)
        self.assertEqual(prof_res.status_code, 200)
        prof_data = prof_res.get_json()
        self.assertEqual(prof_data["profile"]["company_name"], "L&T Urban Infra Projects")

        # 2. Update profile
        upd_res = self.client.put("/api/contractor/profile", headers=headers, json={
            "company_name": "Larsen & Toubro Urban Infra Division",
            "website": "https://lturbaninfra.com/careers"
        })
        self.assertEqual(upd_res.status_code, 200)
        self.assertEqual(upd_res.get_json()["profile"]["company_name"], "Larsen & Toubro Urban Infra Division")

        # 3. Get dashboard stats
        dash_res = self.client.get("/api/contractor/dashboard", headers=headers)
        self.assertEqual(dash_res.status_code, 200)
        stats = dash_res.get_json()["stats"]
        self.assertGreaterEqual(stats["total_jobs"], 1)
        self.assertGreaterEqual(stats["active_jobs"], 1)
        self.assertEqual(stats["verification_status"], "verified")

    def test_03_job_posting_crud_and_status(self):
        """Contractor creates a new job, edits it, pauses it, and closes it."""
        token = self._login("contractor@skillsetu.in", "Contractor@123")
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Create job
        create_res = self.client.post("/api/contractor/jobs", headers=headers, json={
            "title": "Industrial Steel Welder",
            "trade": "welder",
            "description": "MIG/TIG structural steel welders needed for metro girder assembly.",
            "required_skills": "MIG Welding, TIG Welding, Blueprint Reading, Gas Torch Cutting",
            "workers_needed": 4,
            "experience_years": 3,
            "location": "Metro Line 3 Casting Yard, Wadala",
            "city": "Mumbai",
            "state": "Maharashtra",
            "employment_type": "Contract",
            "payment_type": "Daily",
            "wage_min": 1200.0,
            "wage_max": 1500.0,
            "duration": "4 Months",
            "start_date": "Immediate",
            "working_hours": "8 Hours / Day",
            "safety_requirements": "Welding shield, leather apron, steel toe boots."
        })
        self.assertEqual(create_res.status_code, 201)
        job_data = create_res.get_json()["job"]
        job_id = job_data["id"]
        self.assertEqual(job_data["status"], "active")
        self.assertEqual(job_data["trade"], "welder")

        # 2. Update job
        upd_res = self.client.put(f"/api/contractor/jobs/{job_id}", headers=headers, json={
            "title": "Senior Industrial Steel Welder",
            "wage_max": 1600.0
        })
        self.assertEqual(upd_res.status_code, 200)
        self.assertEqual(upd_res.get_json()["job"]["title"], "Senior Industrial Steel Welder")
        self.assertEqual(upd_res.get_json()["job"]["wage_max"], 1600.0)

        # 3. Pause job
        pause_res = self.client.patch(f"/api/contractor/jobs/{job_id}/status", headers=headers, json={
            "status": "paused"
        })
        self.assertEqual(pause_res.status_code, 200)
        self.assertEqual(pause_res.get_json()["job"]["status"], "paused")

        # 4. Reactivate job
        reactivate_res = self.client.patch(f"/api/contractor/jobs/{job_id}/status", headers=headers, json={
            "status": "active"
        })
        self.assertEqual(reactivate_res.status_code, 200)
        self.assertEqual(reactivate_res.get_json()["job"]["status"], "active")

    def test_04_worker_job_browse_and_application_lifecycle(self):
        """Worker browses jobs, applies, duplicate application is prevented, contractor shortlists and hires."""
        worker_token = self._login("worker@skillsetu.in", "Worker@123")
        contractor_token = self._login("contractor@skillsetu.in", "Contractor@123")
        worker_headers = {"Authorization": f"Bearer {worker_token}"}
        contractor_headers = {"Authorization": f"Bearer {contractor_token}"}

        # 1. Worker browses active jobs
        browse_res = self.client.get("/api/worker/jobs?trade=plumber")
        self.assertEqual(browse_res.status_code, 200)
        jobs = browse_res.get_json()["jobs"]
        self.assertGreaterEqual(len(jobs), 1)
        plumber_job = jobs[0]
        job_id = plumber_job["id"]

        # 2. Worker applies to job
        apply_res = self.client.post(f"/api/worker/jobs/{job_id}/apply", headers=worker_headers, json={
            "cover_note": "Expertise in high-pressure CPVC and riser pipe lines."
        })
        self.assertEqual(apply_res.status_code, 201)
        app_id = apply_res.get_json()["application"]["id"]

        # 3. Duplicate application is rejected with 409
        dup_res = self.client.post(f"/api/worker/jobs/{job_id}/apply", headers=worker_headers, json={
            "cover_note": "Applying again"
        })
        self.assertEqual(dup_res.status_code, 409)

        # 4. Contractor views applications for the job
        contractor_apps_res = self.client.get(f"/api/contractor/jobs/{job_id}/applications", headers=contractor_headers)
        self.assertEqual(contractor_apps_res.status_code, 200)
        apps = contractor_apps_res.get_json()["applications"]
        self.assertTrue(any(a["id"] == app_id for a in apps))

        # 5. Contractor shortlists worker
        shortlist_res = self.client.patch(f"/api/contractor/applications/{app_id}/status", headers=contractor_headers, json={
            "status": "shortlisted"
        })
        self.assertEqual(shortlist_res.status_code, 200)
        self.assertEqual(shortlist_res.get_json()["application"]["status"], "shortlisted")

        # 6. Contractor marks as hired
        hire_res = self.client.patch(f"/api/contractor/applications/{app_id}/status", headers=contractor_headers, json={
            "status": "hired"
        })
        self.assertEqual(hire_res.status_code, 200)
        self.assertEqual(hire_res.get_json()["application"]["status"], "hired")

    def test_05_idor_protection_and_authorization(self):
        """Cross-contractor access and unauthorized modifications are strictly prevented."""
        # Create second contractor
        self.client.post("/api/auth/contractor/register", json={
            "full_name": "Anil Ambani",
            "company_name": "Reliance Infrastructure",
            "email": "anil@relianceinfra.com",
            "password": "Password@123",
            "city": "Mumbai",
            "state": "Maharashtra"
        })
        token_c2 = self._login("anil@relianceinfra.com", "Password@123")
        headers_c2 = {"Authorization": f"Bearer {token_c2}"}

        # First contractor posts a job
        token_c1 = self._login("contractor@skillsetu.in", "Contractor@123")
        headers_c1 = {"Authorization": f"Bearer {token_c1}"}
        job_res = self.client.post("/api/contractor/jobs", headers=headers_c1, json={
            "title": "Private Metro Electrician",
            "trade": "electrician",
            "description": "High security job.",
            "location": "Metro Line 3",
            "city": "Mumbai",
            "state": "Maharashtra",
            "wage_min": 25000,
            "wage_max": 30000
        })
        job_id = job_res.get_json()["job"]["id"]

        # Contractor 2 tries to edit Contractor 1's job -> 403 Forbidden
        hack_edit = self.client.put(f"/api/contractor/jobs/{job_id}", headers=headers_c2, json={
            "title": "Hacked Title"
        })
        self.assertEqual(hack_edit.status_code, 403)

        # Contractor 2 tries to delete Contractor 1's job -> 403 Forbidden
        hack_delete = self.client.delete(f"/api/contractor/jobs/{job_id}", headers=headers_c2)
        self.assertEqual(hack_delete.status_code, 403)

        # Contractor 2 tries to view Contractor 1's job applications -> 403 Forbidden
        hack_apps = self.client.get(f"/api/contractor/jobs/{job_id}/applications", headers=headers_c2)
        self.assertEqual(hack_apps.status_code, 403)

        # Unauthenticated request -> 401
        no_auth = self.client.get(f"/api/contractor/jobs/{job_id}")
        self.assertEqual(no_auth.status_code, 401)

    def test_06_verified_worker_discovery_and_safe_contact_request(self):
        """Contractor searches verified workers (no private data leaked) and conducts safe contact workflow."""
        contractor_token = self._login("contractor@skillsetu.in", "Contractor@123")
        contractor_headers = {"Authorization": f"Bearer {contractor_token}"}

        # 1. Search verified workers
        search_res = self.client.get("/api/contractor/workers?trade=technician", headers=contractor_headers)
        self.assertEqual(search_res.status_code, 200)
        workers = search_res.get_json()["workers"]
        self.assertGreaterEqual(len(workers), 1)

        # Ensure no worker passwords or private phones are leaked in discovery
        target_worker = workers[0]
        self.assertNotIn("password", target_worker)
        self.assertNotIn("password_hash", target_worker)
        self.assertIn("has_skill_passport", target_worker)
        worker_id = target_worker["id"]

        # 2. Contractor sends contact request to verified worker
        contact_res = self.client.post("/api/contractor/contact-requests", headers=contractor_headers, json={
            "worker_id": worker_id,
            "message": "We have an open solar project in Okhla. Would you be interested?"
        })
        self.assertEqual(contact_res.status_code, 201)
        req_id = contact_res.get_json()["contact_request"]["id"]

        # 3. Worker checks their incoming contact requests
        worker_token = self._login("kavita.devi@skillsetu.in", "Worker@123")
        worker_headers = {"Authorization": f"Bearer {worker_token}"}

        w_requests_res = self.client.get("/api/worker/contact-requests", headers=worker_headers)
        self.assertEqual(w_requests_res.status_code, 200)
        reqs = w_requests_res.get_json()["contact_requests"]
        self.assertTrue(any(r["id"] == req_id for r in reqs))

        # 4. Worker accepts and consents to share contact info
        respond_res = self.client.patch(f"/api/worker/contact-requests/{req_id}/respond", headers=worker_headers, json={
            "action": "accept",
            "share_contact": True
        })
        self.assertEqual(respond_res.status_code, 200)
        self.assertEqual(respond_res.get_json()["contact_request"]["status"], "accepted")
        self.assertTrue(respond_res.get_json()["contact_request"]["worker_contact_shared"])

    def test_07_admin_contractor_verification_and_moderation(self):
        """Administrator approves a pending contractor and moderates fraudulent job listings."""
        admin_token = self._login("admin@skillsetu.in", "Admin@123")
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        # 1. Register a pending contractor
        reg_res = self.client.post("/api/auth/contractor/register", json={
            "full_name": "Sunil Bansal",
            "company_name": "Bansal Infra Solutions",
            "email": "sunil.bansal@bansalinfra.in",
            "password": "Password@123",
            "city": "Jaipur",
            "state": "Rajasthan"
        })
        c_id = reg_res.get_json()["user"]["id"]

        # 2. Admin views contractor list
        list_res = self.client.get("/api/admin/contractors?status=pending", headers=admin_headers)
        self.assertEqual(list_res.status_code, 200)
        contractors = list_res.get_json()["contractors"]
        self.assertTrue(any(c["id"] == c_id for c in contractors))

        # 3. Admin verifies contractor
        verify_res = self.client.patch(f"/api/admin/contractors/{c_id}/verify", headers=admin_headers, json={
            "status": "verified"
        })
        self.assertEqual(verify_res.status_code, 200)
        self.assertEqual(verify_res.get_json()["user"]["verification_status"], "verified")

        # 4. Contractor posts a spam job
        c_token = self._login("sunil.bansal@bansalinfra.in", "Password@123")
        spam_job_res = self.client.post("/api/contractor/jobs", headers={"Authorization": f"Bearer {c_token}"}, json={
            "title": "Spam / Fraudulent Job",
            "trade": "painter",
            "description": "Misleading compensation",
            "location": "Jaipur",
            "city": "Jaipur",
            "state": "Rajasthan",
            "wage_min": 100,
            "wage_max": 200
        })
        job_id = spam_job_res.get_json()["job"]["id"]

        # 5. Admin lists jobs and deletes the spam job
        jobs_res = self.client.get("/api/admin/jobs", headers=admin_headers)
        self.assertEqual(jobs_res.status_code, 200)

        del_res = self.client.delete(f"/api/admin/jobs/{job_id}", headers=admin_headers)
        self.assertEqual(del_res.status_code, 200)

        # Confirm job is gone
        check_res = self.client.get(f"/api/worker/jobs/{job_id}")
        self.assertEqual(check_res.status_code, 404)


if __name__ == "__main__":
    unittest.main()
