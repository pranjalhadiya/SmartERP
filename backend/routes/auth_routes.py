from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from jose import jwt, JWTError
import os
from dotenv import load_dotenv
from schemas.schemas import RefreshTokenRequest

from database.db import get_db
from models.models import User
from schemas.schemas import UserCreate, UserLogin
from auth.auth_handler import hash_password, verify_password, create_access_token, create_refresh_token

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "email": new_user.email
    }

@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(user.password, existing_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(
        data={"sub": existing_user.email, "user_id": existing_user.id}
    )

    refresh_token = create_refresh_token(
    data={"sub": existing_user.email, "user_id": existing_user.id}
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
def refresh_access_token(data: RefreshTokenRequest):
    try:
        payload = jwt.decode(
            data.refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get("token_type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        new_access_token = create_access_token(
            data={
                "sub": payload.get("sub"),
                "user_id": payload.get("user_id")
            }
        )

        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")