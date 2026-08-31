from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models import Base
from routers.items import router as items_router

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TCC Food API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items_router)


@app.get("/")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "message": "API funcionando"}
