from typing import Optional
from sqlalchemy.orm import Session
from .base import CRUDBase
from ..models.user import User
from ..schemas.user import UserCreate, UserInDB
from ..core.security import get_password_hash, verify_password


class CRUDUser(CRUDBase[User, UserCreate, UserInDB]):
    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            username=obj_in.username,
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            role=obj_in.role,
            organization_id=obj_in.organization_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(self, db: Session, *, username: str, password: str) -> Optional[User]:
        user = self.get_by_username(db, username=username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active

    def get_users_by_organization(self, db: Session, *, organization_id: int):
        return db.query(User).filter(User.organization_id == organization_id).all()


user = CRUDUser(User)
