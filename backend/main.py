from fastapi import FastAPI
from db.session import database, engine
from models.user import Base
from fastapi.middleware.cors import CORSMiddleware
from api.routes import user_registration_routes, stored_credential_management_routes, user_login_routes

app = FastAPI()

origins = [
    "http://localhost:4200",
    "https://localhost:4200",
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "PUT", "DELETE"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


app.include_router(user_registration_routes.router)
app.include_router(stored_credential_management_routes.router)
app.include_router(user_login_routes.router)

