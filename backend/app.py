from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import Base, engine
from models.models import *

from routes import (
    auth_routes,
    company_routes,
    dashboard_routes,
    group_routes,
    item_routes,
    ledger_routes,
    report_routes,
    voucher_routes,
)

# Create database tables if they do not already exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartERP API")

# Allow frontend React app to communicate with FastAPI backend
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

# Register application routes
app.include_router(auth_routes.router)
app.include_router(company_routes.router)
app.include_router(dashboard_routes.router)
app.include_router(group_routes.router)
app.include_router(item_routes.router)
app.include_router(ledger_routes.router)
app.include_router(report_routes.router)
app.include_router(voucher_routes.router)


@app.get("/")
def home():
    return {"message": "SmartERP Backend Running"}