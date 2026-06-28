from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    current_company_id = Column(Integer, nullable=True)

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    address = Column(String)
    gst_number = Column(String)
    state = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

class Ledger(Base):
    __tablename__ = "ledgers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    ledger_type = Column(String)  # customer, supplier, cash, bank
    phone = Column(String)
    address = Column(String)
    opening_balance = Column(Float, default=0)
    company_id = Column(Integer, ForeignKey("companies.id"))

class StockItem(Base):
    __tablename__ = "stock_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    sku = Column(String)
    hsn_code = Column(String)
    quantity = Column(Float, default=0)
    purchase_price = Column(Float)
    selling_price = Column(Float)
    gst_percent = Column(Float, default=0)
    company_id = Column(Integer, ForeignKey("companies.id"))

class Voucher(Base):
    __tablename__ = "vouchers"

    id = Column(Integer, primary_key=True, index=True)
    voucher_type = Column(String)  # purchase, sales, receipt, payment
    party_id = Column(Integer, ForeignKey("ledgers.id"))
    item_id = Column(Integer, ForeignKey("stock_items.id"), nullable=True)
    quantity = Column(Float, default=0)
    rate = Column(Float, default=0)
    gst_percent = Column(Float, default=0)
    total_amount = Column(Float, default=0)
    date = Column(DateTime, default=datetime.utcnow)
    company_id = Column(Integer, ForeignKey("companies.id"))

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    group_type = Column(String)
    company_id = Column(Integer, ForeignKey("companies.id"))