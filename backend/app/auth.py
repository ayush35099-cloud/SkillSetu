from functools import wraps
from flask import request, jsonify, current_app, g
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from .models import User

TOKEN_SALT = "skillsetu-auth-token-salt"
DEFAULT_EXPIRATION = 86400 * 7  # 7 days

def get_serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"])

def generate_token(user_id: int, role: str) -> str:
    serializer = get_serializer()
    return serializer.dumps({"user_id": user_id, "role": role}, salt=TOKEN_SALT)

def verify_token(token: str, max_age: int = DEFAULT_EXPIRATION):
    serializer = get_serializer()
    try:
        data = serializer.loads(token, salt=TOKEN_SALT, max_age=max_age)
        return data
    except (SignatureExpired, BadSignature, Exception):
        return None

def require_auth(allowed_roles=None, require_approved=False):
    """
    Decorator to protect routes with token authentication and role checking.
    - allowed_roles: list of allowed roles (e.g. ['assessor', 'admin'])
    - require_approved: if True, assessor must have verification_status == 'approved'
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get("Authorization", "")
            token = None

            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ", 1)[1].strip()
            elif request.headers.get("X-Auth-Token"):
                token = request.headers.get("X-Auth-Token").strip()

            if not token:
                return jsonify({
                    "status": "error",
                    "message": "Authentication token is missing. Please log in."
                }), 401

            payload = verify_token(token)
            if not payload or "user_id" not in payload:
                return jsonify({
                    "status": "error",
                    "message": "Invalid or expired authentication session. Please log in again."
                }), 401

            from . import db
            user = db.session.get(User, payload["user_id"])
            if not user:
                return jsonify({
                    "status": "error",
                    "message": "User account no longer exists."
                }), 401

            # Check role permissions
            if allowed_roles:
                if user.role not in allowed_roles:
                    return jsonify({
                        "status": "error",
                        "message": f"Access restricted. Role '{user.role}' is not authorized for this resource."
                    }), 403

            # Check assessor approval status if required
            if require_approved and user.role == "assessor":
                if user.verification_status != "approved":
                    return jsonify({
                        "status": "error",
                        "code": "ASSESSOR_NOT_APPROVED",
                        "message": "Your assessor account is currently pending administrative verification. You may view tasks and submissions, but final assessment reviews require an approved account.",
                        "verification_status": user.verification_status
                    }), 403

            g.current_user = user
            return f(*args, **kwargs)
        return decorated_function
    return decorator
