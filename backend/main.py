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

# @app.post("/notes/")
# async def create_note(title: str, content: str):
#     query = notes.insert().values(title=title, content=content)
#     last_record_id = await database.execute(query)
#     return {"id": last_record_id, "title": title, "content": content}
#
# @app.on_event("startup")
# async def startup():
#     await database.connect()
#     metadata.create_all(engine)
#
#
# @app.on_event("shutdown")
# async def shutdown():
#     await database.disconnect()
#
#
# @app.get("/")
# def read_root():
#     return {"Hello": "World"}
#
#
# @app.get("/hello/{name}")
# def say_hello(name: str):
#     return {"message": f"Hello {name}"}
#
#
# @app.get("/files/{file_path:path}")
# async def read_file(file_path: str):
#     return {"file_path": file_path}
#
#
# fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]
#
#
# @app.get("/items/")
# async def read_item(skip: int = 0, limit: int = 10):
#     return fake_items_db[skip: skip + limit]
#
# # http://127.0.0.1:8000/items/?skip=0&limit=10 example
#
#
# @app.get("/items/{item_id}")
# async def read_item(item_id: str, q: str | None = None):
#     if q:
#         return {"item_id": item_id, "q": q}
#     return {"item_id": item_id}
