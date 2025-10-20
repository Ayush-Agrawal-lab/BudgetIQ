from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .main import api_router
from config import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION
    )

    # Configure CORS
    origins = settings.CORS_ORIGINS.split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"]
    )

    # Add routes
    app.include_router(api_router, prefix="/api")

    return app

app = create_app()
