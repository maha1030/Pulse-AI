from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Endpoint, Service
from app.schemas.endpoint import EndpointCreate, EndpointResponse


router = APIRouter(
    prefix="/endpoints",
    tags=["Endpoints"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=EndpointResponse)
def create_endpoint(
    endpoint: EndpointCreate,
    db: Session = Depends(get_db)
):
    service = db.query(Service).filter(
        Service.id == endpoint.service_id
    ).first()

    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service not found"
        )

    new_endpoint = Endpoint(
        path=endpoint.path,
        method=endpoint.method.upper(),
        service_id=endpoint.service_id
    )

    db.add(new_endpoint)
    db.commit()
    db.refresh(new_endpoint)

    return new_endpoint