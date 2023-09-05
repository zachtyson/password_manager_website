from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models.user import StoredCredential, User
from db.session import SessionLocal
from schemas.stored_credential import CredCreate, CredResponse
from typing import Annotated
from core.security import oauth2_scheme, secret_key, algorithm, TokenData
from jose import JWTError, jwt

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/stored_credentials/add", response_model=CredResponse)
async def add_credential(token: Annotated[str, Depends(oauth2_scheme)], stored_credential: CredCreate,
                         db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        jwt_username: str = payload.get("sub")
        if jwt_username is None:
            raise credentials_exception
        token_data = TokenData(username=jwt_username)
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == token_data.username).first()

    db_cred = StoredCredential(owner_id=user.id, nickname=stored_credential.nickname,
                               username=stored_credential.username, email=stored_credential.email,
                               encrypted_password=stored_credential.password)
    db.add(db_cred)
    db.commit()
    db.refresh(db_cred)
    return db_cred


@router.put("/stored_credentials/share/{username}/{credid}", response_model=CredResponse)
async def share_credential(token: Annotated[str, Depends(oauth2_scheme)],
                           username: str, credid: int, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        jwt_username: str = payload.get("sub")
        if jwt_username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Username not found")
    credential = db.query(StoredCredential).filter(StoredCredential.id == credid).first()
    if not credential:
        raise HTTPException(status_code=404, detail="Credential id not found")
    credential.user.append(user)
    db.commit()
    return credential


@router.put("/stored_credentials/unshare/{username}/{credid}", response_model=CredResponse)
async def unshare_credential(token: Annotated[str, Depends(oauth2_scheme)],
                             username: str, credid: int, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        jwt_username: str = payload.get("sub")
        if jwt_username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Username not found")
    credential = db.query(StoredCredential).filter(StoredCredential.id == credid).first()
    if not credential:
        raise HTTPException(status_code=404, detail="Credential id not found")
    credential.user.remove(user)
    db.commit()
    return credential
