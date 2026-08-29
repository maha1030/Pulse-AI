from pydantic import BaseModel


class EndpointCreate(BaseModel):
    path: str
    method: str
    service_id: int


class EndpointResponse(BaseModel):
    id: int
    path: str
    method: str
    service_id: int

    class Config:
        from_attributes = True