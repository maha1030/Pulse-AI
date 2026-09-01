
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Endpoint, RequestMetric
from app.schemas.metric import MetricCreate, MetricResponse


router = APIRouter(
    prefix="/metrics",
    tags=["Metrics"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=MetricResponse)
def create_metric(
    metric: MetricCreate,
    db: Session = Depends(get_db)
):
    endpoint = db.query(Endpoint).filter(
        Endpoint.id == metric.endpoint_id
    ).first()

    if not endpoint:
        raise HTTPException(
            status_code=404,
            detail="Endpoint not found"
        )

    new_metric = RequestMetric(
        endpoint_id=metric.endpoint_id,
        latency_ms=metric.latency_ms,
        status_code=metric.status_code,
        response_size_bytes=metric.response_size_bytes,
        request_size_bytes=metric.request_size_bytes
    )

    db.add(new_metric)
    db.commit()
    db.refresh(new_metric)

    return new_metric

@router.get("/{endpoint_id}", response_model=list[MetricResponse])
def get_endpoint_metrics(
    endpoint_id: int,
    minutes: int = Query(
        60,
        ge=1,
        le=10080
    ),
    db: Session = Depends(get_db)
):
    # Check whether endpoint exists
    endpoint = db.query(Endpoint).filter(
        Endpoint.id == endpoint_id
    ).first()

    if not endpoint:
        raise HTTPException(
            status_code=404,
            detail="Endpoint not found"
        )

    # Calculate start time
    start_time = datetime.now(timezone.utc) - timedelta(
        minutes=minutes
    )

    # Get metrics for this endpoint
    metrics = (
        db.query(RequestMetric)
        .filter(
            RequestMetric.endpoint_id == endpoint_id,
            RequestMetric.timestamp >= start_time
        )
        .order_by(RequestMetric.timestamp.asc())
        .all()
    )

    return metrics


@router.get("/{endpoint_id}/stats")
def get_endpoint_stats(
    endpoint_id: int,
    minutes: int = Query(
        60,
        ge=1,
        le=10080
    ),
    db: Session = Depends(get_db)
):
    # Check endpoint
    endpoint = db.query(Endpoint).filter(
        Endpoint.id == endpoint_id
    ).first()

    if not endpoint:
        raise HTTPException(
            status_code=404,
            detail="Endpoint not found"
        )

    # Calculate start time
    start_time = datetime.now(timezone.utc) - timedelta(
        minutes=minutes
    )

    # Base filter
    metrics = db.query(RequestMetric).filter(
        RequestMetric.endpoint_id == endpoint_id,
        RequestMetric.timestamp >= start_time
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

    return {
        "endpoint_id": endpoint_id,
        "time_window_minutes": minutes,
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

