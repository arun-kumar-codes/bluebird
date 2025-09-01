from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    database_url: str = "mysql+pymysql://root:Java_123@localhost/threatnoteDB"
    secret_key: str = "bulebird-super-secret-key-change-in-production-2024"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    host: str = "0.0.0.0"
    port: int = 8002
    environment: str = "development"
    
    class Config:
        env_file = ["config.env", ".env"]
        env_file_encoding = 'utf-8'


settings = Settings()
