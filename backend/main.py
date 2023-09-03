import os
from databases import Database
from fastapi import FastAPI
from sqlalchemy import Table, Column, Integer, String, DateTime, func, MetaData, create_engine

app = FastAPI()

DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL environment variable is not set.")
DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")

metadata = MetaData()

notes = Table(
    "notes",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("title", String(50)),
    Column("content", String(200)),
    Column("created_date", DateTime, default=func.now(), nullable=False)
)


items = Table(
    "items",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(30)),
    Column("description", String(100)),
)

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)


@app.post("/notes/")
async def create_note(title: str, content: str):
    query = notes.insert().values(title=title, content=content)
    last_record_id = await database.execute(query)
    return {"id": last_record_id, "title": title, "content": content}

@app.on_event("startup")
async def startup():
    await database.connect()
    metadata.create_all(engine)


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/hello/{name}")
def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}


fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 10):
    return fake_items_db[skip: skip + limit]

# http://127.0.0.1:8000/items/?skip=0&limit=10 example


@app.get("/items/{item_id}")
async def read_item(item_id: str, q: str | None = None):
    if q:
        return {"item_id": item_id, "q": q}
    return {"item_id": item_id}
