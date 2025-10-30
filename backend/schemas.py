from pydantic import BaseModel

# product schemas
class ProductBase(BaseModel):
    name:str
    description:str | None=None
    price:float
    quantity:int


class ProductCreate(ProductBase):
    pass


class ProductOrder(ProductBase):
    id:int

    class Config:
      from_attributes = True
# User schemas
class UserCreate(BaseModel):
    username:str
    password:str

class Token(BaseModel):
    access_token:str
    token_type:str='bearer'

class TokenData(BaseModel):
    username:str|None=None


# ✅ For reading product data (includes ID)
class ProductOut(ProductBase):
    id: int

    class Config:
        from_attributes = True  # replaces orm_mode = True (Pydantic v2)