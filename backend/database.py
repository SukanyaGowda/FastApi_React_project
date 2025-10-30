# ✅ database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ✅ PostgreSQL connection URL
db_url = "postgresql://postgres:8151@localhost:5432/mydb"

# ✅ Create engine
engine = create_engine(db_url)

# ✅ Create sessionmaker (bound to engine)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Base class for ORM models
Base = declarative_base()
