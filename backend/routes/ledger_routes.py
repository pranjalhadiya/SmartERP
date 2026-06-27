from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from auth.dependencies import get_current_user
from models.models import User, Ledger
from schemas.schemas import LedgerCreate, LedgerUpdate

router = APIRouter(
    prefix="/ledgers",
    tags=["Ledgers"]
)

@router.post("/")
def create_ledger(
    ledger: LedgerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    if not user.current_company_id:
        raise HTTPException(
            status_code=400,
            detail="Please select company first"
        )

    new_ledger = Ledger(
        name=ledger.name,
        ledger_type=ledger.ledger_type,
        phone=ledger.phone,
        address=ledger.address,
        opening_balance=ledger.opening_balance,
        company_id=user.current_company_id
    )

    db.add(new_ledger)
    db.commit()
    db.refresh(new_ledger)

    return {
        "message": "Ledger created successfully",
        "ledger": new_ledger
    }


@router.get("/")
def get_ledgers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    if not user.current_company_id:
        raise HTTPException(
            status_code=400,
            detail="Please select company first"
        )

    ledgers = db.query(Ledger).filter(
        Ledger.company_id == user.current_company_id
    ).all()

    return ledgers


@router.get("/{ledger_id}")
def get_single_ledger(
    ledger_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    ledger = db.query(Ledger).filter(
        Ledger.id == ledger_id,
        Ledger.company_id == user.current_company_id
    ).first()

    if not ledger:
        raise HTTPException(
            status_code=404,
            detail="Ledger not found"
        )

    return ledger

@router.put("/{ledger_id}")
def update_ledger(
    ledger_id: int,
    updated_ledger: LedgerUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    ledger = db.query(Ledger).filter(
        Ledger.id == ledger_id,
        Ledger.company_id == user.current_company_id
    ).first()

    if not ledger:
        raise HTTPException(
            status_code=404,
            detail="Ledger not found"
        )

    ledger.name = updated_ledger.name
    ledger.ledger_type = updated_ledger.ledger_type
    ledger.phone = updated_ledger.phone
    ledger.address = updated_ledger.address
    ledger.opening_balance = updated_ledger.opening_balance

    db.commit()
    db.refresh(ledger)

    return {
        "message": "Ledger updated successfully",
        "ledger": ledger
    }

@router.delete("/{ledger_id}")
def delete_ledger(
    ledger_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    ledger = db.query(Ledger).filter(
        Ledger.id == ledger_id,
        Ledger.company_id == user.current_company_id
    ).first()

    if not ledger:
        raise HTTPException(
            status_code=404,
            detail="Ledger not found"
        )

    db.delete(ledger)
    db.commit()

    return {"message": "Ledger deleted successfully"}