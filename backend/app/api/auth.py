from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..core.auth import get_current_active_user
from ..core.config import settings
from ..core.database import get_db
from ..core.security import create_access_token
from ..crud.user import user
from ..schemas.user import User, UserCreate, Token

router = APIRouter()


@router.post("/signup", response_model=User)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    """Create new user account."""
    # Check if user already exists
    db_user = user.get_by_username(db, username=user_in.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    db_user = user.get_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    db_user = user.create(db=db, obj_in=user_in)
    return db_user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login and get access token."""
    db_user = user.authenticate(
        db, username=form_data.username, password=form_data.password
    )
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active(db_user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user info."""
    return current_user
