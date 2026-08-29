
from datetime import datetime

from pydantic import BaseModel


class MetricCreate(BaseModel):
    endpoint_id: int
    latency_ms: int
    status_code: int
    response_size_bytes: int | None = None
    request_size_bytes: int | None = None


class MetricResponse(BaseModel):
    id: int
    endpoint_id: int
    timestamp: datetime
    latency_ms: int
    status_code: int
    response_size_bytes: int | None
    request_size_bytes: int | None

    class Config:
        from_attributes = True

