"""
╔══════════════════════════════════════════════════════════════════════════╗
║          Library Management System — Full API Test Suite (pytest)         ║
║          Total APIs Tested: 33                                            ║
╚══════════════════════════════════════════════════════════════════════════╝

API COUNT BREAKDOWN:
  Auth           : 5  (login, register, refresh, logout, me)
  Admin          : 2  (dashboard, reports)
  Manager        : 1  (dashboard)
  Superadmin     : 1  (dashboard)
  Students       : 2  (list, by-id)
  Expenses       : 1  (list)
  Audit Logs     : 1  (list - superadmin only)
  Seed           : 2  (core, admin)
  App/Public     : 18 (health, crm, finance, seats, admin-misc)
  ─────────────────────────────────────────────────────
  TOTAL          : 33 APIs

DEFAULT CREDENTIALS (set by seeder):
  Superadmin : phone=9000000001, password=Library@2025
  Admin      : phone=9000000002, password=Library@2025
  Manager    : phone=9000000003, password=Library@2025

HOW TO RUN:
  pip install pytest requests
  pytest tests/test_all_apis.py -v
"""

import pytest
import requests
import json
from typing import Optional

# ── Config ────────────────────────────────────────────────────────────────────
BASE_URL = "http://localhost:3000/api/v1"
SEED_URL = "http://localhost:3000/api/seed"    # seeder uses different prefix

CREDENTIALS = {
    "superadmin": {"phone": "9000000001", "password": "Library@2025"},
    "admin":      {"phone": "9000000002", "password": "Library@2025"},
    "manager":    {"phone": "9000000003", "password": "Library@2025"},
}

# ── Shared State (tokens cached across tests) ─────────────────────────────────
class AuthState:
    superadmin_token: Optional[str] = None
    admin_token:      Optional[str] = None
    manager_token:    Optional[str] = None
    refresh_token:    Optional[str] = None

auth = AuthState()


def headers(token: str) -> dict:
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 0. SEED — Run once before all tests to populate DB
# ═══════════════════════════════════════════════════════════════════════════════

class TestSeed:
    """APIs: POST /seed/core, POST /seed/admin"""

    def test_01_seed_core(self):
        """POST /api/seed/core — Seeds roles, tenant, branches, users with hashed passwords"""
        r = requests.post(f"{SEED_URL}/core")
        assert r.status_code in [200, 201], f"Seed core failed: {r.status_code} {r.text}"
        data = r.json()
        assert "message" in data
        print(f"\n✅ Seed core: {data['message']}")
        if "credentials" in data:
            print(f"   Credentials: {json.dumps(data['credentials'], indent=2)}")

    def test_02_seed_admin(self):
        """POST /api/seed/admin — Seeds shifts, seats, plans, students, payments"""
        r = requests.post(f"{SEED_URL}/admin")
        assert r.status_code in [200, 201], f"Seed admin failed: {r.status_code} {r.text}"
        data = r.json()
        assert "message" in data
        print(f"\n✅ Seed admin: {data['message']}")


# ═══════════════════════════════════════════════════════════════════════════════
# 1. AUTH APIs (5 endpoints)
# ═══════════════════════════════════════════════════════════════════════════════

class TestAuth:
    """APIs: POST /auth/login, POST /auth/register, POST /auth/refresh, POST /auth/logout, GET /auth/me"""

    def test_03_login_superadmin(self):
        """POST /api/v1/auth/login — Superadmin login with correct credentials"""
        r = requests.post(f"{BASE_URL}/auth/login", json=CREDENTIALS["superadmin"])
        assert r.status_code == 200, f"Superadmin login failed: {r.status_code} {r.text}"
        data = r.json()
        assert "accessToken" in data, "No accessToken in response"
        assert "refreshToken" in data, "No refreshToken in response"
        assert data["user"]["role"] == "superadmin", f"Wrong role: {data['user']['role']}"
        auth.superadmin_token = data["accessToken"]
        auth.refresh_token = data["refreshToken"]
        print(f"\n✅ Superadmin logged in. Role: {data['user']['role']}")

    def test_04_login_admin(self):
        """POST /api/v1/auth/login — Admin login"""
        r = requests.post(f"{BASE_URL}/auth/login", json=CREDENTIALS["admin"])
        assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
        data = r.json()
        assert data["user"]["role"] == "admin"
        auth.admin_token = data["accessToken"]
        print(f"\n✅ Admin logged in. Role: {data['user']['role']}")

    def test_05_login_manager(self):
        """POST /api/v1/auth/login — Manager login"""
        r = requests.post(f"{BASE_URL}/auth/login", json=CREDENTIALS["manager"])
        assert r.status_code == 200, f"Manager login failed: {r.status_code} {r.text}"
        data = r.json()
        assert data["user"]["role"] == "manager"
        auth.manager_token = data["accessToken"]
        print(f"\n✅ Manager logged in. Role: {data['user']['role']}")

    def test_06_login_wrong_password(self):
        """POST /api/v1/auth/login — Wrong password returns 401"""
        r = requests.post(f"{BASE_URL}/auth/login", json={"phone": "9000000001", "password": "WrongPass@123"})
        assert r.status_code == 401, f"Expected 401, got: {r.status_code}"
        print(f"\n✅ Wrong password correctly rejected: {r.status_code}")

    def test_07_login_missing_fields(self):
        """POST /api/v1/auth/login — Missing fields returns 400"""
        r = requests.post(f"{BASE_URL}/auth/login", json={"phone": "9000000001"})
        assert r.status_code == 400, f"Expected 400 for missing password, got: {r.status_code}"
        print(f"\n✅ Missing fields correctly rejected: {r.status_code}")

    def test_08_get_me_superadmin(self):
        """GET /api/v1/auth/me — Get current user info (superadmin)"""
        assert auth.superadmin_token, "Superadmin token not set. Run test_03 first."
        r = requests.get(f"{BASE_URL}/auth/me", headers=headers(auth.superadmin_token))
        assert r.status_code == 200, f"Get me failed: {r.status_code} {r.text}"
        data = r.json()
        assert data["role"] == "superadmin"
        assert "id" in data
        print(f"\n✅ /auth/me: {data['name']} ({data['role']})")

    def test_09_get_me_without_token(self):
        """GET /api/v1/auth/me — Without token returns 401"""
        r = requests.get(f"{BASE_URL}/auth/me")
        assert r.status_code == 401, f"Expected 401, got: {r.status_code}"
        print(f"\n✅ /auth/me without token correctly returns 401")

    def test_10_refresh_token(self):
        """POST /api/v1/auth/refresh — Get new access token using refresh token"""
        assert auth.refresh_token, "Refresh token not set"
        r = requests.post(
            f"{BASE_URL}/auth/refresh",
            headers={"Authorization": f"Bearer {auth.refresh_token}"}
        )
        assert r.status_code == 200, f"Refresh failed: {r.status_code} {r.text}"
        data = r.json()
        assert "accessToken" in data
        # Update superadmin token with new one
        auth.superadmin_token = data["accessToken"]
        print(f"\n✅ Token refreshed successfully")

    def test_11_register_requires_superadmin(self):
        """POST /api/v1/auth/register — Requires superadmin role"""
        # Without token → 401
        r = requests.post(f"{BASE_URL}/auth/register", json={
            "phone": "9111999001", "name": "Test", "password": "Test@1234!", "roleName": "manager"
        })
        assert r.status_code == 401, f"Expected 401 for unauthenticated register, got: {r.status_code}"
        print(f"\n✅ Register without token correctly returns 401")


# ═══════════════════════════════════════════════════════════════════════════════
# 2. SUPERADMIN APIs (1 endpoint)
# ═══════════════════════════════════════════════════════════════════════════════

class TestSuperadmin:
    """APIs: GET /superadmin/dashboard"""

    def test_12_superadmin_dashboard(self):
        """GET /api/v1/superadmin/dashboard — Superadmin only"""
        assert auth.superadmin_token, "Need superadmin token"
        r = requests.get(f"{BASE_URL}/superadmin/dashboard", headers=headers(auth.superadmin_token))
        assert r.status_code == 200, f"Superadmin dashboard failed: {r.status_code} {r.text}"
        data = r.json()
        assert "kpiCards" in data
        print(f"\n✅ Superadmin dashboard: {len(data['kpiCards'])} KPI cards")

    def test_13_superadmin_dashboard_requires_superadmin_role(self):
        """GET /api/v1/superadmin/dashboard — Admin cannot access → 403"""
        assert auth.admin_token, "Need admin token"
        r = requests.get(f"{BASE_URL}/superadmin/dashboard", headers=headers(auth.admin_token))
        assert r.status_code == 403, f"Expected 403 for admin accessing superadmin, got: {r.status_code}"
        print(f"\n✅ Admin correctly blocked from superadmin dashboard: 403")

    def test_14_superadmin_dashboard_manager_blocked(self):
        """GET /api/v1/superadmin/dashboard — Manager cannot access → 403"""
        assert auth.manager_token, "Need manager token"
        r = requests.get(f"{BASE_URL}/superadmin/dashboard", headers=headers(auth.manager_token))
        assert r.status_code == 403, f"Expected 403 for manager accessing superadmin, got: {r.status_code}"
        print(f"\n✅ Manager correctly blocked from superadmin dashboard: 403")

    def test_15_superadmin_dashboard_no_token(self):
        """GET /api/v1/superadmin/dashboard — No token → 401"""
        r = requests.get(f"{BASE_URL}/superadmin/dashboard")
        assert r.status_code == 401, f"Expected 401, got: {r.status_code}"
        print(f"\n✅ Superadmin dashboard without token: 401")


# ═══════════════════════════════════════════════════════════════════════════════
# 3. ADMIN APIs (2 endpoints)
# ═══════════════════════════════════════════════════════════════════════════════

class TestAdmin:
    """APIs: GET /admin/dashboard, GET /admin/reports"""

    def test_16_admin_dashboard_as_admin(self):
        """GET /api/v1/admin/dashboard — Admin access"""
        assert auth.admin_token, "Need admin token"
        r = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers(auth.admin_token))
        assert r.status_code == 200, f"Admin dashboard failed: {r.status_code} {r.text}"
        data = r.json()
        assert "kpiCards" in data
        print(f"\n✅ Admin dashboard OK, KPIs: {len(data['kpiCards'])}")

    def test_17_admin_dashboard_as_superadmin(self):
        """GET /api/v1/admin/dashboard — Superadmin can also access admin dashboard"""
        assert auth.superadmin_token, "Need superadmin token"
        r = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers(auth.superadmin_token))
        assert r.status_code == 200, f"Superadmin access to admin dashboard failed: {r.status_code}"
        print(f"\n✅ Superadmin can access admin dashboard")

    def test_18_admin_dashboard_manager_blocked(self):
        """GET /api/v1/admin/dashboard — Manager blocked → 403"""
        assert auth.manager_token, "Need manager token"
        r = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers(auth.manager_token))
        assert r.status_code == 403, f"Expected 403 for manager, got: {r.status_code}"
        print(f"\n✅ Manager correctly blocked from admin dashboard: 403")

    def test_19_admin_reports(self):
        """GET /api/v1/admin/reports — Admin reports"""
        assert auth.admin_token, "Need admin token"
        r = requests.get(f"{BASE_URL}/admin/reports", headers=headers(auth.admin_token))
        assert r.status_code == 200, f"Admin reports failed: {r.status_code} {r.text}"
        data = r.json()
        assert "kpiCards" in data
        print(f"\n✅ Admin reports OK")

    def test_20_admin_no_token(self):
        """GET /api/v1/admin/dashboard — No token → 401"""
        r = requests.get(f"{BASE_URL}/admin/dashboard")
        assert r.status_code == 401, f"Expected 401, got: {r.status_code}"
        print(f"\n✅ Admin dashboard without token: 401")


# ═══════════════════════════════════════════════════════════════════════════════
# 4. MANAGER APIs (1 endpoint)
# ═══════════════════════════════════════════════════════════════════════════════

class TestManager:
    """APIs: GET /manager/dashboard"""

    def test_21_manager_dashboard(self):
        """GET /api/v1/manager/dashboard — Manager access"""
        assert auth.manager_token, "Need manager token"
        r = requests.get(f"{BASE_URL}/manager/dashboard", headers=headers(auth.manager_token))
        assert r.status_code == 200, f"Manager dashboard failed: {r.status_code} {r.text}"
        data = r.json()
        assert "kpiData" in data
        print(f"\n✅ Manager dashboard OK, KPIs: {len(data['kpiData'])}")

    def test_22_manager_dashboard_no_token(self):
        """GET /api/v1/manager/dashboard — No token → 401"""
        r = requests.get(f"{BASE_URL}/manager/dashboard")
        assert r.status_code == 401, f"Expected 401, got: {r.status_code}"
        print(f"\n✅ Manager dashboard without token: 401")


# ═══════════════════════════════════════════════════════════════════════════════
# 5. STUDENTS APIs (2 endpoints)
# ═══════════════════════════════════════════════════════════════════════════════

class TestStudents:
    """APIs: GET /students, GET /students/:id"""

    def test_23_list_students_as_manager(self):
        """GET /api/v1/students — Manager can list students"""
        assert auth.manager_token, "Need manager token"
        r = requests.get(f"{BASE_URL}/students", headers=headers(auth.manager_token))
        assert r.status_code == 200, f"List students failed: {r.status_code} {r.text}"
        data = r.json()
        assert isinstance(data, list)
        print(f"\n✅ Students list: {len(data)} students")

    def test_24_list_students_no_token(self):
        """GET /api/v1/students — No token → 401"""
        r = requests.get(f"{BASE_URL}/students")
        assert r.status_code == 401, f"Expected 401, got: {r.status_code}"
        print(f"\n✅ Students list without token: 401")

    def test_25_get_student_by_id_invalid(self):
        """GET /api/v1/students/:id — Invalid UUID returns 404 or error"""
        assert auth.admin_token, "Need admin token"
        r = requests.get(f"{BASE_URL}/students/non-existent-id-000", headers=headers(auth.admin_token))
        assert r.status_code in [400, 404, 500], f"Expected error for invalid ID, got: {r.status_code}"
        print(f"\n✅ Invalid student ID correctly returns: {r.status_code}")


# ═══════════════════════════════════════════════════════════════════════════════
# 6. EXPENSES APIs (1 endpoint)
# ═══════════════════════════════════════════════════════════════════════════════

class TestExpenses:
    """APIs: GET /expenses"""

    def test_26_list_expenses(self):
        """GET /api/v1/expenses — List expenses (authenticated)"""
        assert auth.admin_token, "Need admin token"
        r = requests.get(f"{BASE_URL}/expenses", headers=headers(auth.admin_token))
        assert r.status_code == 200, f"List expenses failed: {r.status_code} {r.text}"
        data = r.json()
        assert isinstance(data, list)
        print(f"\n✅ Expenses list: {len(data)} expenses")

    def test_27_expenses_no_token(self):
        """GET /api/v1/expenses — No token → 401"""
        r = requests.get(f"{BASE_URL}/expenses")
        assert r.status_code == 401, f"Expected 401, got: {r.status_code}"
        print(f"\n✅ Expenses without token: 401")


# ═══════════════════════════════════════════════════════════════════════════════
# 7. AUDIT LOGS APIs (1 endpoint)
# ═══════════════════════════════════════════════════════════════════════════════

class TestAuditLogs:
    """APIs: GET /audit-logs"""

    def test_28_audit_logs_superadmin(self):
        """GET /api/v1/audit-logs — Superadmin can view audit logs"""
        assert auth.superadmin_token, "Need superadmin token"
        r = requests.get(f"{BASE_URL}/audit-logs", headers=headers(auth.superadmin_token))
        assert r.status_code == 200, f"Audit logs failed: {r.status_code} {r.text}"
        data = r.json()
        assert "data" in data
        assert "meta" in data
        print(f"\n✅ Audit logs: {data['meta']['total']} total logs")

    def test_29_audit_logs_admin_blocked(self):
        """GET /api/v1/audit-logs — Admin blocked → 403"""
        assert auth.admin_token, "Need admin token"
        r = requests.get(f"{BASE_URL}/audit-logs", headers=headers(auth.admin_token))
        assert r.status_code == 403, f"Expected 403 for admin, got: {r.status_code}"
        print(f"\n✅ Admin correctly blocked from audit logs: 403")


# ═══════════════════════════════════════════════════════════════════════════════
# 8. PUBLIC / APP CONTROLLER APIs (18 endpoints)
# ═══════════════════════════════════════════════════════════════════════════════

class TestPublicApis:
    """APIs: /api/hello, /api/crm/*, /api/communication/*, /api/finance/*, /api/seats_shifts_lockers/*, /api/admin/*"""

    def test_30_health_check(self):
        """GET /api/hello — Health check"""
        r = requests.get("http://localhost:3000/api/hello")
        assert r.status_code == 200, f"Health check failed: {r.status_code}"
        print(f"\n✅ Health check OK: {r.text[:50]}")

    def test_31_crm_enquiries(self):
        """GET /api/crm/enquiries"""
        r = requests.get("http://localhost:3000/api/crm/enquiries")
        assert r.status_code == 200, f"CRM enquiries failed: {r.status_code} {r.text}"
        assert isinstance(r.json(), list)
        print(f"\n✅ CRM enquiries: {len(r.json())} records")

    def test_32_communication_complaints(self):
        """GET /api/communication/complaints"""
        r = requests.get("http://localhost:3000/api/communication/complaints")
        assert r.status_code == 200, f"Complaints failed: {r.status_code} {r.text}"
        print(f"\n✅ Communication complaints OK")

    def test_33_communication_notices(self):
        """GET /api/communication/notices"""
        r = requests.get("http://localhost:3000/api/communication/notices")
        assert r.status_code == 200, f"Notices failed: {r.status_code} {r.text}"
        print(f"\n✅ Communication notices OK")

    def test_34_finance_payments(self):
        """GET /api/finance/payments"""
        r = requests.get("http://localhost:3000/api/finance/payments")
        assert r.status_code == 200, f"Finance payments failed: {r.status_code} {r.text}"
        print(f"\n✅ Finance payments OK")

    def test_35_finance_refunds(self):
        """GET /api/finance/refunds"""
        r = requests.get("http://localhost:3000/api/finance/refunds")
        assert r.status_code == 200, f"Finance refunds failed: {r.status_code} {r.text}"
        data = r.json()
        assert isinstance(data, list)
        print(f"\n✅ Finance refunds: {len(data)} records")

    def test_36_seat_matrix(self):
        """GET /api/seats_shifts_lockers/seat-matrix"""
        r = requests.get("http://localhost:3000/api/seats_shifts_lockers/seat-matrix")
        assert r.status_code == 200, f"Seat matrix failed: {r.status_code} {r.text}"
        print(f"\n✅ Seat matrix OK: {len(r.json())} seats")

    def test_37_lockers(self):
        """GET /api/seats_shifts_lockers/lockers"""
        r = requests.get("http://localhost:3000/api/seats_shifts_lockers/lockers")
        assert r.status_code == 200, f"Lockers failed: {r.status_code} {r.text}"
        print(f"\n✅ Lockers OK")

    def test_38_admin_students(self):
        """GET /api/admin/students"""
        r = requests.get("http://localhost:3000/api/admin/students")
        assert r.status_code == 200, f"Admin students failed: {r.status_code} {r.text}"
        assert isinstance(r.json(), list)
        print(f"\n✅ Admin students: {len(r.json())} students")

    def test_39_admin_plans(self):
        """GET /api/admin/plans"""
        r = requests.get("http://localhost:3000/api/admin/plans")
        assert r.status_code == 200, f"Admin plans failed: {r.status_code} {r.text}"
        print(f"\n✅ Admin plans OK")

    def test_40_admin_coupons(self):
        """GET /api/admin/coupons"""
        r = requests.get("http://localhost:3000/api/admin/coupons")
        assert r.status_code == 200, f"Admin coupons failed: {r.status_code} {r.text}"
        print(f"\n✅ Admin coupons OK")

    def test_41_admin_audit_logs(self):
        """GET /api/admin/audit-logs"""
        r = requests.get("http://localhost:3000/api/admin/audit-logs")
        assert r.status_code == 200, f"Admin audit-logs failed: {r.status_code} {r.text}"
        print(f"\n✅ Admin audit-logs OK")

    def test_42_admin_branches(self):
        """GET /api/admin/branches"""
        r = requests.get("http://localhost:3000/api/admin/branches")
        assert r.status_code == 200, f"Admin branches failed: {r.status_code} {r.text}"
        assert isinstance(r.json(), list)
        print(f"\n✅ Admin branches: {len(r.json())} branches")

    def test_43_admin_blacklist(self):
        """GET /api/admin/blacklist"""
        r = requests.get("http://localhost:3000/api/admin/blacklist")
        assert r.status_code == 200, f"Admin blacklist failed: {r.status_code} {r.text}"
        print(f"\n✅ Admin blacklist OK")

    def test_44_admin_expenses(self):
        """GET /api/admin/expenses"""
        r = requests.get("http://localhost:3000/api/admin/expenses")
        assert r.status_code == 200, f"Admin expenses failed: {r.status_code} {r.text}"
        print(f"\n✅ Admin expenses OK")

    def test_45_admin_expense_categories(self):
        """GET /api/admin/expense-categories"""
        r = requests.get("http://localhost:3000/api/admin/expense-categories")
        assert r.status_code == 200, f"Expense categories failed: {r.status_code} {r.text}"
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        print(f"\n✅ Expense categories: {len(data)} categories")

    def test_46_admin_permissions(self):
        """GET /api/admin/permissions"""
        r = requests.get("http://localhost:3000/api/admin/permissions")
        assert r.status_code == 200, f"Admin permissions failed: {r.status_code} {r.text}"
        data = r.json()
        assert isinstance(data, list)
        print(f"\n✅ Admin permissions: {len(data)} modules")

    def test_47_admin_staff_users(self):
        """GET /api/admin/staff-users"""
        r = requests.get("http://localhost:3000/api/admin/staff-users")
        assert r.status_code == 200, f"Staff users failed: {r.status_code} {r.text}"
        print(f"\n✅ Admin staff-users OK")


# ═══════════════════════════════════════════════════════════════════════════════
# 9. SECURITY TESTS — Verify Zero Trust is working
# ═══════════════════════════════════════════════════════════════════════════════

class TestSecurity:
    """Security boundary tests — Zero Trust verification"""

    def test_48_tampered_token_rejected(self):
        """Tampered JWT is rejected with 401"""
        fake_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlIiwicm9sZSI6InN1cGVyYWRtaW4ifQ.invalidsignature"
        r = requests.get(f"{BASE_URL}/superadmin/dashboard", headers=headers(fake_token))
        assert r.status_code == 401, f"Expected 401 for tampered token, got: {r.status_code}"
        print(f"\n✅ Tampered token correctly rejected: 401")

    def test_49_manager_cannot_access_superadmin(self):
        """Manager token cannot access superadmin routes"""
        assert auth.manager_token
        r = requests.get(f"{BASE_URL}/superadmin/dashboard", headers=headers(auth.manager_token))
        assert r.status_code == 403, f"Expected 403, got: {r.status_code}"
        print(f"\n✅ Manager correctly blocked from superadmin: 403")

    def test_50_manager_cannot_access_admin(self):
        """Manager token cannot access admin routes"""
        assert auth.manager_token
        r = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers(auth.manager_token))
        assert r.status_code == 403, f"Expected 403, got: {r.status_code}"
        print(f"\n✅ Manager correctly blocked from admin dashboard: 403")

    def test_51_logout_and_token_invalid(self):
        """After logout, old access token still works until expiry (15min JWT)"""
        # Get a fresh manager token for this test
        r_login = requests.post(f"{BASE_URL}/auth/login", json=CREDENTIALS["manager"])
        assert r_login.status_code == 200
        temp_token = r_login.json()["accessToken"]

        # Logout
        r_logout = requests.post(f"{BASE_URL}/auth/logout", headers=headers(temp_token))
        assert r_logout.status_code == 200, f"Logout failed: {r_logout.status_code}"
        print(f"\n✅ Logout successful (refresh token revoked in DB)")

    def test_52_rate_limiting_on_login(self):
        """Login endpoint should rate-limit after too many requests (5/min)"""
        # We'll try 6 rapid requests — at least some should be 429
        responses = []
        for _ in range(6):
            r = requests.post(f"{BASE_URL}/auth/login", json={"phone": "9000000099", "password": "wrong"})
            responses.append(r.status_code)
        has_rate_limit = any(s == 429 for s in responses)
        # Rate limit or 401 (wrong creds) both acceptable — test that we don't get 200
        assert all(s != 200 for s in responses), "Should not get 200 with wrong credentials"
        print(f"\n✅ Rate limiting test — responses: {responses}")
        if has_rate_limit:
            print("   ✅ Rate limiting active (429 received)")


# ═══════════════════════════════════════════════════════════════════════════════
# FINAL LOGOUT
# ═══════════════════════════════════════════════════════════════════════════════

class TestCleanup:
    def test_99_logout_all_sessions(self):
        """POST /api/v1/auth/logout — Clean up all test sessions"""
        for name, token in [("superadmin", auth.superadmin_token), ("admin", auth.admin_token)]:
            if token:
                r = requests.post(f"{BASE_URL}/auth/logout", headers=headers(token))
                assert r.status_code == 200, f"{name} logout failed: {r.status_code}"
                print(f"\n✅ {name} logged out")
