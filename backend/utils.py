from sqlalchemy.orm import Session
import backend.database_models as db_models

def get_user_by_username(db: Session, username: str):
    return db.query(db_models.User).filter(db_models.User.username == username).first()
