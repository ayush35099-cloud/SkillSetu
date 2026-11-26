"""Standalone idempotent database migration script for SkillSetu."""

import sys
from app import create_app


def main() -> int:
    app = create_app()
    with app.app_context():
        if not app.config.get("SQLALCHEMY_DATABASE_URI"):
            print("No SQLALCHEMY_DATABASE_URI configured.")
            return 1
        if not app.config.get("DB_INITIALIZED"):
            print(f"Database initialization failed: {app.config.get('DB_INIT_ERROR')}")
            return 1
        print("Database schema is up to date and verified.")
        return 0


if __name__ == "__main__":
    sys.exit(main())
