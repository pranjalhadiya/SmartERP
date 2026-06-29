from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import Base, engine
from models.models import * 
from routes import (
    auth_routes,
    company_routes,
    ledger_routes,
    item_routes,
    voucher_routes,
    dashboard_routes,
    group_routes,
    report_routes
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartERP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(company_routes.router)
app.include_router(ledger_routes.router)
app.include_router(item_routes.router)
app.include_router(voucher_routes.router)
app.include_router(dashboard_routes.router)
app.include_router(group_routes.router)
app.include_router(report_routes.router)


@app.get("/")
def home():
    return {"message": "SmartERP Backend Running"}