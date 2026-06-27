from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from auth.dependencies import get_current_user
from models.models import User, Group
from schemas.schemas import GroupCreate, GroupUpdate

router = APIRouter(
    prefix="/groups",
    tags=["Groups"]
)

@router.post("/")
def create_group(
    group: GroupCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if user.current_company_id is None:
        raise HTTPException(status_code=400, detail="Please select company first")

    new_group = Group(
        name=group.name,
        group_type=group.group_type,
        company_id=user.current_company_id
    )

    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    return {
        "message": "Group created successfully",
        "group": new_group
    }


@router.get("/")
def get_groups(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if user.current_company_id is None:
        raise HTTPException(status_code=400, detail="Please select company first")

    groups = db.query(Group).filter(
        Group.company_id == user.current_company_id
    ).all()

    return groups


@router.put("/{group_id}")
def update_group(
    group_id: int,
    updated_group: GroupUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    group = db.query(Group).filter(
        Group.id == group_id,
        Group.company_id == user.current_company_id
    ).first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    group.name = updated_group.name
    group.group_type = updated_group.group_type

    db.commit()
    db.refresh(group)

    return {
        "message": "Group updated successfully",
        "group": group
    }


@router.delete("/{group_id}")
def delete_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    group = db.query(Group).filter(
        Group.id == group_id,
        Group.company_id == user.current_company_id
    ).first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    db.delete(group)
    db.commit()

    return {"message": "Group deleted successfully"}