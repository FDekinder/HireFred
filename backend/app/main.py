from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from app.core.config import settings
    from app.db import create_db_and_tables
    from app.routers import auth, releases, public, portfolio
except Exception as e:
    import sys
    print(f"Import error: {e}", file=sys.stderr)
    raise

app = FastAPI(
    title="Frederick De Kinder - Portfolio API",
    description="Backend API powering my job application for Volume7. Yes, I built a backend for my resume. Because why not? 🚀",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://hire-fred.vercel.app",
        "https://hire-fred-git-main-fdekinders-projects.vercel.app",
        "https://hire-fred-fdekinders-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(releases.router)
app.include_router(public.router)
app.include_router(portfolio.router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}
