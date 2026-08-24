import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api.routes import router as api_router
from app.seed.seed_data import seed_database

# Create tables
Base.metadata.create_all(bind=engine)

# Seed initial demo database if not present
with SessionLocal() as db_session:
    seed_database(db_session)

app = FastAPI(
    title="EntitlementIQ API",
    description="Construction Claims Intelligence & Deterministic Weather Entitlement Platform",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all local origins during hackathon / demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root_check():
    return {
        "app": "EntitlementIQ Backend",
        "status": "Operational",
        "mode": "Deterministic Construction Claims Engine",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
