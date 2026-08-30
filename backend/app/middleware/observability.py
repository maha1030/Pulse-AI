import time

from fastapi import Request

from app.database import SessionLocal
from app.models import Endpoint, RequestMetric


async def observability_middleware(
    request: Request,
    call_next
):
    start_time = time.perf_counter()

    response = await call_next(request)

    latency = (
        time.perf_counter() - start_time
    ) * 1000

    route = request.scope.get("route")

    if route:
        route_path = route.path
    else:
        route_path = request.url.path

    method = request.method.upper()

    print(
        f"{method} "
        f"{route_path} "
        f"{response.status_code} "
        f"{latency:.2f} ms"
    )

    db = SessionLocal()

    try:
        endpoint = db.query(Endpoint).filter(
            Endpoint.method == method,
            Endpoint.path == route_path
        ).first()

        if endpoint:
            metric = RequestMetric(
                endpoint_id=endpoint.id,
                latency_ms=round(latency),
                status_code=response.status_code
            )

            db.add(metric)
            db.commit()

    finally:
        db.close()

    return response