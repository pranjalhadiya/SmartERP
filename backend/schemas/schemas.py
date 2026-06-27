from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class CompanyCreate(BaseModel):
    name: str
    address: str
    gst_number: str
    state: str


class CompanyUpdate(BaseModel):
    name: str
    address: str
    gst_number: str
    state: str


class LedgerCreate(BaseModel):
    name: str
    ledger_type: str
    phone: str | None = None
    address: str | None = None
    opening_balance: float = 0


class LedgerUpdate(BaseModel):
    name: str
    ledger_type: str
    phone: str | None = None
    address: str | None = None
    opening_balance: float = 0


class GroupCreate(BaseModel):
    name: str
    group_type: str


class GroupUpdate(BaseModel):
    name: str
    group_type: str


class StockItemCreate(BaseModel):
    name: str
    sku: str
    hsn_code: str
    quantity: float
    purchase_price: float
    selling_price: float
    gst_percent: float = 0


class VoucherCreate(BaseModel):
    voucher_type: str
    party_id: int
    item_id: int | None = None
    quantity: float = 0
    rate: float = 0
    company_id: int