# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from config import settings
from services.ingset_service import setup_background_tasks

# Initialize FastAPI
app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ayush-agrawal-lab.github.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Include routers
from routes import auth, accounts, transactions, goals, insights, dashboard
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(accounts.router, prefix="/api/accounts", tags=["accounts"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(goals.router, prefix="/api/goals", tags=["goals"])
app.include_router(insights.router, prefix="/api/insights", tags=["insights"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

@app.on_event("startup")
async def startup_event():
    # Start background tasks scheduler
    import asyncio
    loop = asyncio.get_event_loop()
    setup_background_tasks(loop)

@app.get("/")
async def root():
    return {"message": "Welcome to BudgetIQ API"}
