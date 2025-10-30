from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
import bcrypt  # ✅ ensures bcrypt backend works properly

# SECRET - change this to a secure random value for production
SECRET_KEY = "replace_this_with_a_strong_random_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

# ✅ explicitly force bcrypt backend to load safely
try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b")
    # force bcrypt backend initialization
    bcrypt.hashpw(b"test", bcrypt.gensalt())
except Exception as e:
    print("⚠️ Bcrypt backend initialization failed:", e)
    raise e


def get_password_hash(password: str):
    # bcrypt only supports up to 72 bytes
    password = password[:72]
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password[:72], hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise
