from flask import Blueprint, jsonify, current_app
from sqlalchemy import text
from . import db

main_bp = Blueprint("main", __name__)
api_bp = Blueprint("api", __name__, url_prefix="/api")

@main_bp.route("/", methods=["GET"])
def root():
    return jsonify({
        "message": "Welcome to SkillSetu API",
        "service": "SkillSetu Backend",
        "version": "1.0.0",
        "endpoints": {
            "root": "/",
            "health": "/api/health",
            "db_health": "/api/health/db"
        }
    }), 200

@api_bp.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "SkillSetu Backend"
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
        # Check connection using simple SELECT 1
        with db.engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            
        return jsonify({
            "status": "connected",
            "database": "PostgreSQL",
            "message": "Database connection successful"
        }), 200
    except Exception:
        # Never expose sensitive connection details or internal stack trace
        return jsonify({
            "status": "error",
            "database": "PostgreSQL",
            "message": "Database connection failed"
        }), 503
