import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-skillsetu-secret-key-change-in-prod")
    
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
