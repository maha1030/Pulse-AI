from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    services = relationship(
        "Service",
        back_populates="project"
    )


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    base_url = Column(String, nullable=False)

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    project = relationship(
        "Project",
        back_populates="services"
    )

    endpoints = relationship(
        "Endpoint",
        back_populates="service"
    )


class Endpoint(Base):
    __tablename__ = "endpoints"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, nullable=False)
    method = Column(String, nullable=False)

    service_id = Column(
        Integer,
        ForeignKey("services.id"),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    service = relationship(
        "Service",
        back_populates="endpoints"
    )

    metrics = relationship(
        "RequestMetric",
        back_populates="endpoint"
    )


class RequestMetric(Base):
    __tablename__ = "request_metrics"

    id = Column(Integer, primary_key=True, index=True)

    endpoint_id = Column(
        Integer,
        ForeignKey("endpoints.id"),
        nullable=False
    )

    timestamp = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True
    )

    latency_ms = Column(Integer, nullable=False)
    status_code = Column(Integer, nullable=False)

    response_size_bytes = Column(Integer, nullable=True)
    request_size_bytes = Column(Integer, nullable=True)

    endpoint = relationship(
        "Endpoint",
        back_populates="metrics"
    )