from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.region import router as region_router
from api.education import router as education_router
from api.healthcare import router as healthcare_router
from api.economy import router as economy_router
from api.migration import router as migration_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

app.include_router(region_router, prefix="/api/region")
app.include_router(education_router, prefix="/api/education")
app.include_router(healthcare_router, prefix="/api/healthcare")
app.include_router(economy_router, prefix="/api/economy")
app.include_router(migration_router, prefix="/api/migration") 