from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from api.routes.user_login_routes import authenticate_user_username
from models.user import StoredCredential, User
from db.session import SessionLocal
from schemas.stored_credential import CredCreate, CredResponse, CredInDB, CredInDBShared, CredUpdate
from typing import Annotated, List
from core.security import oauth2_scheme, secret_key, algorithm, TokenData, generate_salt, verify_password
from jose import JWTError, jwt

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/stored_credentials/get_salt", response_model=str)
async def get_salt(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
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
    # makes sure user is real (we use the username in the jwt to find them so this should never actually be raised
    # realistically)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    salt = generate_salt()
    return salt


@router.get("/stored_credentials/get_salt_multiple", response_model=List[str])
async def get_salt(token: Annotated[str, Depends(oauth2_scheme)], num: int = Query(...), db: Session = Depends(get_db)):
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
    # makes sure user is real (we use the username in the jwt to find them so this should never actually be raised
    # realistically)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    salts = [generate_salt() for _ in range(num)]
    return salts


# adds a new stored credential to the database associated with the user's account
@router.post("/stored_credentials/add", status_code=201)
async def add_credential(token: Annotated[str, Depends(oauth2_scheme)], stored_credential: CredCreate,
                         db: Session = Depends(get_db)):
    # jwt authorization
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
    # makes sure user is real (we use the username in the jwt to find them so this should never actually be raised
    # realistically)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # generate salt for password encryption
    # create new credential with user's id as owner
    db_cred = StoredCredential(owner_id=user.id, nickname=stored_credential.nickname,
                               username=stored_credential.username, email=stored_credential.email,
                               encrypted_password=stored_credential.password, url=stored_credential.url,
                               salt=stored_credential.salt, last_accessed_user_id=user.id)
    # add credential to database
    db.add(db_cred)
    db.commit()
    db.refresh(db_cred)


@router.post("/stored_credentials/addBulk", status_code=201)
async def add_credential(token: Annotated[str, Depends(oauth2_scheme)],
                         stored_credentials: List[CredCreate],
                         db: Session = Depends(get_db)):
    # jwt authorization
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

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    last_db_cred = None
    for stored_credential in stored_credentials:
        db_cred = StoredCredential(owner_id=user.id, nickname=stored_credential.nickname,
                                   username=stored_credential.username, email=stored_credential.email,
                                   encrypted_password=stored_credential.password, url=stored_credential.url,
                                   salt=stored_credential.salt, last_accessed_user_id=user.id)
        # add credential to database
        db.add(db_cred)
        last_db_cred = db_cred
    db.commit()
    if last_db_cred:
        db.refresh(last_db_cred)


# shares a user's saved credential with another user
@router.put("/stored_credentials/share/{username}/{credid}", status_code=200)
async def share_credential(token: Annotated[str, Depends(oauth2_scheme)],
                           username: str, credid: int, db: Session = Depends(get_db)):
    # jwt authorization
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
    user_to_share_with = db.query(User).filter(User.username == username).first()
    # makes sure user the credential is being shared with exists
    if not user_to_share_with:
        raise HTTPException(status_code=404, detail="Username not found")
    credential_to_be_shared = db.query(StoredCredential).filter(StoredCredential.id == credid).first()
    # make sure the credential requested to be shared exists
    if not credential_to_be_shared:
        raise HTTPException(status_code=404, detail="Credential id not found")
    owner = db.query(User).filter(User.username == token_data.username).first()
    # make sure the api caller (user) exists and is the owner of the credential
    if not owner:
        raise HTTPException(status_code=404, detail="User (credential owner) not found")
    if owner.id != credential_to_be_shared.owner_id:
        raise HTTPException(status_code=401, detail="Unauthorized. User making request does not match user request "
                                                    "does not own credential to be shared")
    # add user to credential's list of users it is shared with
    credential_to_be_shared.user.append(user_to_share_with)
    db.commit()
    return credential_to_be_shared


# unshares a user's saved credential from another user
@router.put("/stored_credentials/unshare/{username}/{credid}", status_code=200)
async def unshare_credential(token: Annotated[str, Depends(oauth2_scheme)],
                             username: str, credid: int, db: Session = Depends(get_db)):
    # jwt authorization
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
    user_to_unshare_with = db.query(User).filter(User.username == username).first()
    # makes sure user the credential is being shared with exists
    if not user_to_unshare_with:
        raise HTTPException(status_code=404, detail="Username not found")
    credential_to_be_unshared = db.query(StoredCredential).filter(StoredCredential.id == credid).first()
    # make sure the credential requested to be unshared exists
    if not credential_to_be_unshared:
        raise HTTPException(status_code=404, detail="Credential id not found")
    owner = db.query(User).filter(User.username == token_data.username).first()
    # make sure the api caller (user) exists and is the owner of the credential
    if not owner:
        raise HTTPException(status_code=404, detail="User (credential owner) not found")
    if owner.id != credential_to_be_unshared.owner_id:
        raise HTTPException(status_code=401, detail="Unauthorized. User making request does not match user request "
                                                    "does not own credential to be shared")
    # remove user from credential's list of users it is shared with
    credential_to_be_unshared.user.remove(user_to_unshare_with)
    db.commit()
    return credential_to_be_unshared


# gets all of a user's stored credentials
@router.get("/stored_credentials/{username}", response_model=List[CredInDB])
async def get_credentials(token: Annotated[str, Depends(oauth2_scheme)],
                          username: str, db: Session = Depends(get_db)):
    # jwt authorization
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
    # make sure the user calling the api matches the user the information is about
    if token_data.username != username:
        raise HTTPException(status_code=401, detail="Unauthorized. User making request does not match user request is "
                                                    "for")
    # check if the user actually exists
    user = db.query(User).filter(User.username == token_data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Username not found")
    # retrieve the user's stored credentials
    users_stored_credentials = db.query(StoredCredential).filter(user.id == StoredCredential.owner_id).all()
    return users_stored_credentials


# gets all credentials that have been shared with a user
@router.get("/stored_credentials/shared_with/{username}", response_model=List[CredInDBShared])
async def get_credentials_shared_with(token: Annotated[str, Depends(oauth2_scheme)],
                                      username: str, db: Session = Depends(get_db)):
    # jwt authorization
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
    # make sure the user calling the api matches the user the information is about
    if token_data.username != username:
        raise HTTPException(status_code=401, detail="Unauthorized. User making request does not match user request is "
                                                    "for")
    # check if the user actually exists

    user = db.query(User).filter(User.username == token_data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Username not found")
    # retrieve credentials that have been shared with the user
    shared_credentials = db.query(StoredCredential).join(User, StoredCredential.shared_users).filter(
        User.username == user.username)
    return shared_credentials


# updates a user's stored credential
@router.put("/stored_credentials/update/{credid}", status_code=200)
async def get_credentials_shared_with(token: Annotated[str, Depends(oauth2_scheme)],
                                      credid: int, updated_credential: CredUpdate, db: Session = Depends(get_db)):
    # jwt authorization
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
    credential = db.query(StoredCredential).filter(StoredCredential.id == credid).first()
    # check if credential actually exists
    if not credential:
        raise HTTPException(status_code=404, detail="Credential not found")
    # check if the user actually exists
    user = db.query(User).filter(User.id == credential.owner_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Username of caller not found")
    # make sure the user calling the api matches the user who owns the credential
    if token_data.username != user.username:
        raise HTTPException(status_code=401, detail="Unauthorized. User making request does not match user request is "
                                                    "for")
    # update credential with updated information
    setattr(credential, 'nickname', updated_credential.nickname)
    setattr(credential, 'username', updated_credential.username)
    setattr(credential, 'email', updated_credential.email)
    setattr(credential, 'encrypted_password', updated_credential.password)
    setattr(credential, 'url', updated_credential.url)
    db.commit()


# updates the last accessed date and user for a credential
@router.put("/stored_credentials/access/{credid}", status_code=200)
async def get_credentials_shared_with(token: Annotated[str, Depends(oauth2_scheme)],
                                      credid: int, db: Session = Depends(get_db)):
    # jwt authorization
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
    credential = db.query(StoredCredential).filter(StoredCredential.id == credid).first()
    # check if credential actually exists (this realistically should never be false)
    if not credential:
        raise HTTPException(status_code=404, detail="Credential not found")
    # check if the user actually exists (this realistically should never be false)
    user = db.query(User).filter(User.username == token_data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Username of caller not found")
    # update credential with updated access information
    setattr(credential, 'last_accessed_date', func.now())
    setattr(credential, 'last_accessed_user_id', user.id)
    db.commit()


class MasterPasswordRequest(BaseModel):
    master_password: str


@router.post("/stored_credentials/verify_master_password/{credid}", response_model=bool)
async def verify_master_password(
        token: Annotated[str, Depends(oauth2_scheme)],
        credid: int,
        body: MasterPasswordRequest,
        db: Session = Depends(get_db)
):
    master_password = body.master_password

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

    credential = db.query(StoredCredential).filter(StoredCredential.id == credid).first()
    # make sure the credential requested to be shared exists
    if not credential:
        raise HTTPException(status_code=404, detail="Credential id not found")
    owner = db.query(User).filter(User.username == token_data.username).first()
    # make sure the api caller (user) exists and is the owner of the credential
    if not owner:
        raise HTTPException(status_code=404, detail="User (credential owner) not found")
    if owner.id != credential.owner_id:
        raise HTTPException(status_code=401, detail="Unauthorized. User making request does not match user request "
                                                    "does not own credential to be shared")
    # add user to credential's list of users it is shared with

    # encrypted_master_password = verify_password(master_password, master_password)
    auth = authenticate_user_username(owner.username, master_password, db)
    return True if auth else False


@router.post("/stored_credentials/verify_master_password/", response_model=bool)
async def verify_master_password(
        token: Annotated[str, Depends(oauth2_scheme)],
        body: MasterPasswordRequest,
        db: Session = Depends(get_db)
):
    master_password = body.master_password

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

    owner = db.query(User).filter(User.username == token_data.username).first()
    # make sure the api caller (user) exists and is the owner of the credential
    if not owner:
        raise HTTPException(status_code=404, detail="User (credential owner) not found")

    # encrypted_master_password = verify_password(master_password, master_password)
    auth = authenticate_user_username(owner.username, master_password, db)
    return True if auth else False
