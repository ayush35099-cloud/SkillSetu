from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import Config

db = SQLAlchemy()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.config["DB_INITIALIZED"] = False
    app.config["DB_INIT_ERROR"] = None

    # Configure CORS
    CORS(app, resources={r"/*": {"origins": app.config.get("CORS_ORIGINS", "*")}})

    # Initialize SQLAlchemy and fail fast if schema migration/verification fails
    if app.config.get("SQLALCHEMY_DATABASE_URI"):
        db.init_app(app)
        with app.app_context():
            from . import models  # noqa: F401
            from .migrations import (
                migration_lock,
                run_migrations,
                verify_schema,
                sanitize_db_error,
            )
            from .seeds import seed_database

            try:
                with migration_lock(db.engine):
                    db.create_all()
                    run_migrations(app, db)
                    verify_schema(db)
                    seed_database(app)
                app.config["DB_INITIALIZED"] = True
            except Exception as exc:
                safe_msg = sanitize_db_error(exc)
                app.config["DB_INITIALIZED"] = False
                app.config["DB_INIT_ERROR"] = safe_msg
                app.logger.error(f"Database initialization/migration failed: {safe_msg}")
                raise RuntimeError(f"Database initialization failed: {safe_msg}") from exc

    # Register blueprints
    from .routes import (
        main_bp,
        api_bp,
        auth_bp,
        task_bp,
        assessor_bp,
        worker_bp,
        contractor_bp,
        admin_bp,
    )
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(assessor_bp)
    app.register_blueprint(worker_bp)
    app.register_blueprint(contractor_bp)
    app.register_blueprint(admin_bp)

    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        msg = getattr(error, "description", None) or "Bad request."
        return jsonify({
            "status": "error",
            "message": str(msg)
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "status": "error",
            "message": "Resource not found"
        }), 404

    @app.errorhandler(415)
    def unsupported_media_type(error):
        return jsonify({
            "status": "error",
            "message": "Unsupported Media Type. Request Content-Type must be 'application/json'."
        }), 415

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            "status": "error",
            "message": "Internal server error"
        }), 500

    return app
