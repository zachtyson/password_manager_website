from fastapi import FastAPI
from db.session import database, engine
from db.models import Base
from api.routes import notes_routes

app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


app.include_router(notes_routes.router)
