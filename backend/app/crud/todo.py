from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from .base import CRUDBase
from ..models.todo import Todo
from ..schemas.todo import TodoCreate, TodoUpdate


class CRUDTodo(CRUDBase[Todo, TodoCreate, TodoUpdate]):
    def get_by_organization(self, db: Session, *, organization_id: int, skip: int = 0, limit: int = 100) -> List[Todo]:
        return (
            db.query(Todo)
            .filter(Todo.organization_id == organization_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_owner(self, db: Session, *, obj_in: TodoCreate, created_by: int, organization_id: int) -> Todo:
        db_obj = Todo(
            title=obj_in.title,
            description=obj_in.description,
            completed=obj_in.completed,
            created_by=created_by,
            organization_id=organization_id,
            created_at=datetime.utcnow(),
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


todo = CRUDTodo(Todo)
