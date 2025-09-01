#!/usr/bin/env python3
"""
Server startup script.
"""
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print(f"🚀 Starting Bulebird API server on {settings.host}:{settings.port}")
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
        log_level="info"
    )
