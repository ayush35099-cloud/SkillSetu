import os
import secrets
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("SkillSetu.Config")

def _resolve_secret_key() -> str:
    env_mode = os.getenv("FLASK_ENV", "development").lower()
    is_prod = env_mode == "production" or os.getenv("RENDER") == "true"
    key = os.getenv("SECRET_KEY", "").strip()

    if is_prod:
        # In production, never use an insecure hardcoded fallback
        if not key or key == "dev-skillsetu-secret-key-change-in-prod":
            key = secrets.token_hex(32)
            logger.warning("SECRET_KEY was missing in production; generated a secure 256-bit key.")
        return key

    # Convenient and safe fallback for local development
    return key or "dev-skillsetu-secret-key-change-in-prod"

class Config:
    SECRET_KEY = _resolve_secret_key()
    
    # Handle Render postgres:// format which SQLAlchemy requires to be postgresql://
    raw_db_url = os.getenv("DATABASE_URL")
    if raw_db_url and raw_db_url.startswith("postgres://"):
        raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_DATABASE_URI = raw_db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # CORS allowed origins
    cors_env = os.getenv("CORS_ORIGINS", "*")
    if cors_env == "*":
        CORS_ORIGINS = "*"
    else:
        CORS_ORIGINS = [origin.strip() for origin in cors_env.split(",") if origin.strip()]
