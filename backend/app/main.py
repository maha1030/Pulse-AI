from fastapi import FastAPI

from app.database import engine, Base
from app import models
from app.routers import projects, services, endpoints, metrics


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="PulseAI",
    description="AI-powered API observability platform",
    version="0.1.0"
)


app.include_router(projects.router)
app.include_router(services.router)
app.include_router(endpoints.router)
app.include_router(metrics.router)


@app.get("/")
def root():
    return {
        "message": "PulseAI API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }