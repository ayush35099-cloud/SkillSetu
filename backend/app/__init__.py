from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import Config

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configure CORS
    CORS(app, resources={r"/*": {"origins": app.config.get("CORS_ORIGINS", "*")}})

    # Initialize SQLAlchemy only if URI is configured
    if app.config.get("SQLALCHEMY_DATABASE_URI"):
        db.init_app(app)
        with app.app_context():
            from . import models
            try:
                db.create_all()
                from .seeds import seed_database
                seed_database(app)
            except Exception as e:
                app.logger.warning(f"Database initialization note: {e}")

    # Register blueprints
    from .routes import (
        main_bp,
        api_bp,
        auth_bp,
        task_bp,
        assessor_bp,
        worker_bp,
        admin_bp
    )
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(assessor_bp)
    app.register_blueprint(worker_bp)
    app.register_blueprint(admin_bp)

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "status": "error",
            "message": "Resource not found"
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            "status": "error",
            "message": "Internal server error"
        }), 500

    return app
