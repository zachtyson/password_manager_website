from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.models import Note
from db.session import SessionLocal

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/notes/")
def get_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()
