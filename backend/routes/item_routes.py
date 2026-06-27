from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from auth.dependencies import get_current_user
from models.models import User, StockItem
from schemas.schemas import StockItemCreate, StockItemUpdate

router = APIRouter(
    prefix="/items",
    tags=["Items"]
)


@router.post("/")
def create_item(
    item: StockItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    if user.current_company_id is None:
        raise HTTPException(
            status_code=400,
            detail="Please select company first"
        )

    new_item = StockItem(
        name=item.name,
        sku=item.sku,
        hsn_code=item.hsn_code,
        quantity=item.quantity,
        purchase_price=item.purchase_price,
        selling_price=item.selling_price,
        gst_percent=item.gst_percent,
        company_id=user.current_company_id
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {
        "message": "Item created successfully",
        "item": new_item
    }


@router.get("/")
def get_items(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    if user.current_company_id is None:
        raise HTTPException(
            status_code=400,
            detail="Please select company first"
        )

    items = db.query(StockItem).filter(
        StockItem.company_id == user.current_company_id
    ).all()

    return items


@router.get("/{item_id}")
def get_single_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    item = db.query(StockItem).filter(
        StockItem.id == item_id,
        StockItem.company_id == user.current_company_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    return item


@router.put("/{item_id}")
def update_item(
    item_id: int,
    updated_item: StockItemUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    item = db.query(StockItem).filter(
        StockItem.id == item_id,
        StockItem.company_id == user.current_company_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    item.name = updated_item.name
    item.sku = updated_item.sku
    item.hsn_code = updated_item.hsn_code
    item.quantity = updated_item.quantity
    item.purchase_price = updated_item.purchase_price
    item.selling_price = updated_item.selling_price
    item.gst_percent = updated_item.gst_percent

    db.commit()
    db.refresh(item)

    return {
        "message": "Item updated successfully",
        "item": item
    }


@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == current_user["user_id"]
    ).first()

    item = db.query(StockItem).filter(
        StockItem.id == item_id,
        StockItem.company_id == user.current_company_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    db.delete(item)
    db.commit()

    return {"message": "Item deleted successfully"}