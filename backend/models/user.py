from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()
metadata = Base.metadata

users_stored_credentials = Table('users_stored_credentials',
                                 Base.metadata,
                                 Column('users_id', Integer, ForeignKey('users.id'), primary_key=True),
                                 Column('stored_credentials_id', Integer, ForeignKey('stored_credentials.id'),
                                        primary_key=True)
                                 )


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)  # Use a larger integer data type if needed
    username = Column(String(30), index=True, unique=True)
    email = Column(String(100), index=True, unique=True)
    hashed_password = Column(String(100))
    created_date = Column(DateTime, default=func.now(), nullable=False)
    stored_credentials = relationship('StoredCredential', secondary=users_stored_credentials,
                                      backref='user')


class StoredCredential(Base):
    __tablename__ = "stored_credentials"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey('users.id'))
    nickname = Column(String(100), nullable=False)
    username = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    encrypted_password = Column(String(100))
    added_date = Column(DateTime, default=func.now(), nullable=False)
    last_accessed_date = Column(DateTime, default=func.now(), nullable=False)
    last_accessed_user_id = Column(Integer, ForeignKey('users.id'))
    shared_users = relationship('User', secondary=users_stored_credentials, backref='credential')
    folder = Column(String(100), nullable=True)
    url = Column(String(255), nullable=True)
    salt = Column(String(100), nullable=True)

