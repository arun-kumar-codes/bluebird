from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from .base import CRUDBase
from ..models.note import Note
from ..schemas.note import NoteCreate, NoteUpdate


class CRUDNote(CRUDBase[Note, NoteCreate, NoteUpdate]):
    def get_by_organization(self, db: Session, *, organization_id: int, skip: int = 0, limit: int = 100) -> List[Note]:
        return (
            db.query(Note)
            .filter(Note.organization_id == organization_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_owner(self, db: Session, *, obj_in: NoteCreate, created_by: int, organization_id: int) -> Note:
        db_obj = Note(
            title=obj_in.title,
            content=obj_in.content,
            created_by=created_by,
            organization_id=organization_id,
            created_at=datetime.utcnow(),
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


note = CRUDNote(Note)
