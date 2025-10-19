from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.main import api_router, init_database
from config import settings
from datetime import datetime, timezone
from contextlib import asynccontextmanager
import logging

# Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_database()
    logger.info("✅ BudgetIQ API started with Supabase")
    yield
    logger.info("👋 BudgetIQ API shutdown")

# FastAPI App
app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION, lifespan=lifespan)

# CORS
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

# Include router
app.include_router(api_router, prefix="/api")

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat(), "version": settings.APP_VERSION}

# Uvicorn entry
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
