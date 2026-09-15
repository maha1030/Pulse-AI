
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Service, Endpoint, Project
from app.schemas.service import ServiceCreate, ServiceResponse


router = APIRouter(
    prefix="/services",
    tags=["Services"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_services(
    db: Session = Depends(get_db)
):
    services = db.query(Service).all()

    return services


@router.post("/", response_model=ServiceResponse)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db)
):
    project = (
        db.query(Project)
        .filter(Project.id == service.project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    new_service = Service(
        name=service.name,
        base_url=service.base_url,
        project_id=service.project_id
    )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return new_service


@router.get("/{service_id}")
def get_service(
    service_id: int,
    db: Session = Depends(get_db)
):
    service = (
        db.query(Service)
        .filter(Service.id == service_id)
        .first()
    )

    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    endpoints = (
        db.query(Endpoint)
        .filter(
            Endpoint.service_id == service_id
        )
        .all()
    )

    return {
        "id": service.id,
        "name": service.name,
        "base_url": service.base_url,
        "project_id": service.project_id,
        "endpoints": [
            {
                "id": endpoint.id,
                "path": endpoint.path,
                "method": endpoint.method
            }
            for endpoint in endpoints
        ]
    }

