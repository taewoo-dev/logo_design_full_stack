from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse

from app.api.v1.auth_router import router as auth_router
from app.api.v1.health_router import router as health_router
from app.api.v1.portfolio_router import router as portfolio_router
from app.api.v1.review_router import router as review_router
from app.core.configs.settings import settings
from app.log import initialize_log

app = FastAPI(
    title="Logo Design API",
    description="Logo Design Website Backend API",
    version="1.0.0",
    default_response_class=ORJSONResponse,
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

initialize_log()

# Health check
app.include_router(health_router)

# API routes
app.include_router(auth_router)
app.include_router(portfolio_router)
app.include_router(review_router)
