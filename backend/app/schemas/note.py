from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NoteBase(BaseModel):
    title: str
    content: Optional[str] = None


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class Note(NoteBase):
    id: int
    organization_id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
