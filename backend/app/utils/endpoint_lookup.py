from sqlalchemy.orm import Session

from app.models import Endpoint


def find_endpoint(
    db: Session,
    method: str,
    path: str
):
    return db.query(Endpoint).filter(
        Endpoint.method == method.upper(),
        Endpoint.path == path
    ).first()