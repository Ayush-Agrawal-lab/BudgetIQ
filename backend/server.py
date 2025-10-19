# server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from app import api_router, init_database
from datetime import datetime, timezone
import logging
from contextlib import asynccontextmanager

# ---------------- LOGGING ----------------
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------------- LIFESPAN ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_database()
    logger.info("✅ BudgetIQ API started with Supabase")
    logger.info(f"CORS Origins: {settings.CORS_ORIGINS}")
    logger.info(f"Supabase URL: {settings.SUPABASE_URL}")
    yield
    logger.info("👋 BudgetIQ API shutdown")

# ---------------- FASTAPI APP ----------------
app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION, lifespan=lifespan)

# ---------------- CORS ----------------
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------------- ROUTER ----------------
app.include_router(api_router)

# ---------------- HEALTH CHECK ----------------
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": settings.APP_VERSION
    }

# ---------------- MAIN ENTRY ----------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
