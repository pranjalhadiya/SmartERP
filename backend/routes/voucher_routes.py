from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from fastapi.responses import FileResponse
from reportlab.pdfgen import canvas
import os

from database.db import get_db
from auth.dependencies import get_current_user
from models.models import User, Voucher, StockItem, Ledger, Company
from schemas.schemas import PurchaseVoucherCreate, SalesVoucherCreate

router = APIRouter(
    prefix="/vouchers",
    tags=["Vouchers"]
)


@router.post("/purchase")
def create_purchase_voucher(
    voucher: PurchaseVoucherCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if user.current_company_id is None:
        raise HTTPException(status_code=400, detail="Please select company first")

    supplier = db.query(Ledger).filter(
        Ledger.id == voucher.party_id,
        Ledger.company_id == user.current_company_id,
        Ledger.ledger_type == "supplier"
    ).first()

    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    item = db.query(StockItem).filter(
        StockItem.id == voucher.item_id,
        StockItem.company_id == user.current_company_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    amount = voucher.quantity * voucher.rate
    gst_amount = amount * voucher.gst_percent / 100
    total = amount + gst_amount

    item.quantity = item.quantity + voucher.quantity
    supplier.opening_balance = supplier.opening_balance + total

    new_voucher = Voucher(
        voucher_type="purchase",
        party_id=voucher.party_id,
        item_id=voucher.item_id,
        quantity=voucher.quantity,
        rate=voucher.rate,
        gst_percent=voucher.gst_percent,
        total_amount=total,
        company_id=user.current_company_id
    )

    db.add(new_voucher)
    db.commit()
    db.refresh(new_voucher)

    return {
        "message": "Purchase voucher created successfully",
        "voucher": new_voucher,
        "stock_updated": item.quantity,
        "supplier_balance": supplier.opening_balance
    }


@router.get("/purchase")
def get_purchase_vouchers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    purchases = db.query(Voucher).filter(
        Voucher.company_id == user.current_company_id,
        Voucher.voucher_type == "purchase"
    ).all()

    return purchases

@router.post("/sales")
def create_sales_voucher(
    voucher: SalesVoucherCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if user.current_company_id is None:
        raise HTTPException(status_code=400, detail="Please select company first")

    customer = db.query(Ledger).filter(
        Ledger.id == voucher.party_id,
        Ledger.company_id == user.current_company_id,
        Ledger.ledger_type == "customer"
    ).first()

    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    item = db.query(StockItem).filter(
        StockItem.id == voucher.item_id,
        StockItem.company_id == user.current_company_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.quantity < voucher.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    amount = voucher.quantity * voucher.rate
    gst_amount = amount * voucher.gst_percent / 100
    total = amount + gst_amount

    item.quantity = item.quantity - voucher.quantity
    customer.opening_balance = customer.opening_balance + total

    new_voucher = Voucher(
        voucher_type="sales",
        party_id=voucher.party_id,
        item_id=voucher.item_id,
        quantity=voucher.quantity,
        rate=voucher.rate,
        gst_percent=voucher.gst_percent,
        total_amount=total,
        company_id=user.current_company_id
    )

    db.add(new_voucher)
    db.commit()
    db.refresh(new_voucher)

    return {
        "message": "Sales voucher created successfully",
        "voucher": new_voucher,
        "stock_remaining": item.quantity,
        "customer_balance": customer.opening_balance
    }


@router.get("/sales")
def get_sales_vouchers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    sales = db.query(Voucher).filter(
        Voucher.company_id == user.current_company_id,
        Voucher.voucher_type == "sales"
    ).all()

    return sales


@router.get("/invoice/{voucher_id}")
def get_invoice(
    voucher_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    voucher = db.query(Voucher).filter(
        Voucher.id == voucher_id,
        Voucher.company_id == user.current_company_id,
        Voucher.voucher_type == "sales"
    ).first()

    if not voucher:
        raise HTTPException(status_code=404, detail="Invoice not found")

    company = db.query(Company).filter(
        Company.id == user.current_company_id
    ).first()

    customer = db.query(Ledger).filter(
        Ledger.id == voucher.party_id
    ).first()

    item = db.query(StockItem).filter(
        StockItem.id == voucher.item_id
    ).first()

    amount = voucher.quantity * voucher.rate
    gst_amount = amount * voucher.gst_percent / 100

    return {
        "invoice_no": voucher.id,
        "company": {
            "name": company.name,
            "address": company.address,
            "gst_number": company.gst_number,
            "state": company.state
        },
        "customer": {
            "name": customer.name,
            "address": customer.address,
            "phone": customer.phone
        },
        "item": item.name,
        "hsn_code": item.hsn_code,
        "quantity": voucher.quantity,
        "rate": voucher.rate,
        "amount": amount,
        "gst_percent": voucher.gst_percent,
        "gst_amount": gst_amount,
        "total": voucher.total_amount
    }


@router.get("/invoice/{voucher_id}/pdf")
def download_invoice_pdf(
    voucher_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    voucher = db.query(Voucher).filter(
        Voucher.id == voucher_id,
        Voucher.company_id == user.current_company_id,
        Voucher.voucher_type == "sales"
    ).first()

    if not voucher:
        raise HTTPException(status_code=404, detail="Invoice not found")

    company = db.query(Company).filter(
        Company.id == user.current_company_id
    ).first()

    customer = db.query(Ledger).filter(
        Ledger.id == voucher.party_id
    ).first()

    item = db.query(StockItem).filter(
        StockItem.id == voucher.item_id
    ).first()

    os.makedirs("invoices", exist_ok=True)

    file_path = f"invoices/invoice_{voucher.id}.pdf"

    c = canvas.Canvas(file_path)

    amount = voucher.quantity * voucher.rate
    gst_amount = amount * voucher.gst_percent / 100

    c.setFont("Helvetica-Bold", 18)
    c.drawString(220, 800, "TAX INVOICE")

    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, 760, company.name)

    c.setFont("Helvetica", 10)
    c.drawString(50, 740, company.address)
    c.drawString(50, 725, f"GSTIN: {company.gst_number}")
    c.drawString(50, 710, f"State: {company.state}")

    c.drawString(400, 740, f"Invoice No: {voucher.id}")
    c.drawString(400, 725, f"Date: {voucher.date.strftime('%d-%m-%Y')}")

    c.line(50, 690, 550, 690)

    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 665, "Bill To:")

    c.setFont("Helvetica", 10)
    c.drawString(50, 645, customer.name)
    c.drawString(50, 630, customer.address or "")
    c.drawString(50, 615, f"Phone: {customer.phone or ''}")

    c.line(50, 590, 550, 590)

    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 565, "Item")
    c.drawString(180, 565, "HSN")
    c.drawString(260, 565, "Qty")
    c.drawString(320, 565, "Rate")
    c.drawString(390, 565, "GST")
    c.drawString(470, 565, "Total")

    c.setFont("Helvetica", 10)
    c.drawString(50, 540, item.name)
    c.drawString(180, 540, item.hsn_code or "")
    c.drawString(260, 540, str(voucher.quantity))
    c.drawString(320, 540, f"Rs. {voucher.rate}")
    c.drawString(390, 540, f"{voucher.gst_percent}%")
    c.drawString(470, 540, f"Rs. {voucher.total_amount}")

    c.line(50, 515, 550, 515)

    c.drawString(380, 490, f"Amount: Rs. {amount}")
    c.drawString(380, 470, f"GST: Rs. {gst_amount}")

    c.setFont("Helvetica-Bold", 12)
    c.drawString(380, 445, f"Grand Total: Rs. {voucher.total_amount}")

    c.setFont("Helvetica", 9)
    c.drawString(50, 100, "Thank you for your business.")

    c.save()

    return FileResponse(
        path=file_path,
        filename=f"invoice_{voucher.id}.pdf",
        media_type="application/pdf"
    )