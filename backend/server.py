from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from app.routers import api_router
from datetime import datetime, timezone
import logging
from contextlib import asynccontextmanager
from services.supabase_service import supabase

# ---------------- LOGGING ----------------
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------------- LIFESPAN ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        logger.info("✅ BudgetIQ API starting...")
        yield
    finally:
        logger.info("👋 BudgetIQ API shutdown")

# ---------------- FASTAPI APP ----------------
app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION, lifespan=lifespan)

# ---------------- CORS ----------------
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o]
if "https://ayush-agrawal-lab.github.io" not in origins:
    origins.append("https://ayush-agrawal-lab.github.io")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------------- ROUTER ----------------
app.include_router(api_router, prefix="/api")

# ---------------- ROOT & HEALTH ----------------
@app.get("/")
async def root():
    return {"message": "Welcome to BudgetIQ API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": settings.APP_VERSION
    }

# ---------------- MAIN ----------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
