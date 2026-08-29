from pydantic import BaseModel


class ServiceCreate(BaseModel):
    name: str
    base_url: str
    project_id: int


class ServiceResponse(BaseModel):
    id: int
    name: str
    base_url: str
    project_id: int

    class Config:
        from_attributes = True