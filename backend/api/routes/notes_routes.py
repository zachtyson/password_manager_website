from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.models import Note
from db.session import SessionLocal
from db.schemas import NoteCreate, NoteInDB, NoteBase, ItemBase, ItemCreate, ItemInDB, NoteUpdate
from typing import List

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/notes/", response_model=List[NoteInDB])
def get_notes(db: Session = Depends(get_db)):
    notes = db.query(Note).all()
    return notes


@router.post("/notes/", response_model=NoteCreate)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    new_note = Note(title=note.title, content=note.content)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


@router.delete("/notes/{note_id}", response_model=NoteInDB)
def delete_note_by_id(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return note


@router.put("/notes/{note_id}", response_model=NoteInDB)
def update_note(note_id: int, note_data: NoteUpdate, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    # Update the fields
    if note_data.title:
        note.title = note_data.title
    if note_data.content:
        note.content = note_data.content

    db.commit()
    db.refresh(note)

    return note
