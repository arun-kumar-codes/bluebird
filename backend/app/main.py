from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, organizations, notes, todos

app = FastAPI(title="Bulebird API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "http://116.202.210.102:3003",  # Your remote frontend
        "http://116.202.210.102:8002",  # Your remote backend
        "http://116.202.210.102:8080"   # Alternative backend port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
app.include_router(notes.router, prefix="/notes", tags=["notes"])
app.include_router(todos.router, prefix="/todos", tags=["todos"])


@app.get("/")
def root():
    return {"message": "Welcome to Bulebird API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
