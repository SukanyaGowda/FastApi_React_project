from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import backend.database as database
import backend.database_models as db_models
import backend.schemas as schemas
import backend.auth as auth
from backend.utils import get_user_by_username

# create DB and session
database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Products API with Auth")

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency to get DB session
def get_db():
    db = database.session()
    try:
        yield db
    finally:
        db.close()


# Authenticate user
def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not auth.verify_password(password, user.hashed_password):
        return False
    return user


# Dependency: get current user from token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from jose import JWTError
    try:
        payload = auth.decode_access_token(token)
        username: str | None = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = get_user_by_username(db, token_data.username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


# Route: Register new user
@app.post("/register", response_model=schemas.Token)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_username(db, user_in.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed = auth.get_password_hash(user_in.password)
    user = db_models.User(username=user_in.username, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    access_token = auth.create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


# Route: Login (token)
@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


# ✅ Create product
@app.post("/products", response_model=schemas.ProductOut)
def create_product(
    product_in: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    product = db_models.Product(
        name=product_in.name,
        description=product_in.description,
        price=product_in.price,
        quantity=product_in.quantity,
        image_url=product_in.image_url,  # ✅ Added
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# ✅ Read all products
@app.get("/products", response_model=List[schemas.ProductOut])
def read_products(
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    products = db.query(db_models.Product).all()
    for i in products:
        print(f"products: {i.image_url}")
    return products


# ✅ Read single product
@app.get("/products/{product_id}", response_model=schemas.ProductOut)
def read_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    product = db.query(db_models.Product).filter(db_models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ✅ Update product
@app.put("/products/{product_id}", response_model=schemas.ProductOut)
def update_product(
    product_id: int,
    product_in: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    product = db.query(db_models.Product).filter(db_models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.name = product_in.name
    product.description = product_in.description
    product.price = product_in.price
    product.quantity = product_in.quantity
    product.image_url = product_in.image_url  # ✅ Added
    db.commit()
    db.refresh(product)
    return product


# ✅ Delete product
@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    product = db.query(db_models.Product).filter(db_models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"detail": "Product deleted"}


# Optional root
@app.get("/")
def root():
    return {"message": "API running. Use /docs to register/login and test endpoints."}
