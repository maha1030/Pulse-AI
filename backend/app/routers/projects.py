from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Project, Service, Endpoint, RequestMetric
from app.schemas.project import ProjectCreate, ProjectResponse


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    new_project = Project(
        name=project.name,
        description=project.description
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project

@router.get("/", response_model=list[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db)
):
    projects = db.query(Project).all()
    return projects

@router.get("/{project_id}/stats")
def get_project_stats(
    project_id: int,
    minutes: int = Query(
        60,
        ge=1,
        le=10080
    ),
    db: Session = Depends(get_db)
):
    # Check whether project exists
    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Calculate start time
    start_time = datetime.now(timezone.utc) - timedelta(
        minutes=minutes
    )

    # Get metrics belonging to this project
    metrics = (
        db.query(RequestMetric)
        .join(Endpoint)
        .join(Service)
        .filter(
            Service.project_id == project_id,
            RequestMetric.timestamp >= start_time
        )
    )

    # Total requests
    total_requests = metrics.with_entities(
        func.count(RequestMetric.id)
    ).scalar()

    # Average latency
    average_latency = metrics.with_entities(
        func.avg(RequestMetric.latency_ms)
    ).scalar()

    # Error count
    error_count = metrics.filter(
        RequestMetric.status_code >= 400
    ).count()

    # Error rate
    if total_requests > 0:
        error_rate = (
            error_count / total_requests
        ) * 100
    else:
        error_rate = 0

    # Number of services
    service_count = db.query(Service).filter(
        Service.project_id == project_id
    ).count()

    # Number of endpoints
    endpoint_count = (
        db.query(Endpoint)
        .join(Service)
        .filter(
            Service.project_id == project_id
        )
        .count()
    )

    return {
        "project_id": project_id,
        "time_window_minutes": minutes,
        "service_count": service_count,
        "endpoint_count": endpoint_count,
        "total_requests": total_requests,
        "average_latency_ms": round(
            average_latency or 0,
            2
        ),
        "error_count": error_count,
        "error_rate": round(
            error_rate,
            2
        )
    }