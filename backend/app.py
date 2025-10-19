# main.py (full BudgetIQ backend with auth + full CRUD)

from fastapi import FastAPI, APIRouter, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, timedelta, timezone
import uuid
import jwt
from passlib.context import CryptContext
from collections import defaultdict
from contextlib import asynccontextmanager
import numpy as np
from supabase import create_client, Client
from config import settings

# ---------------- SUPABASE CLIENT ----------------
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# ---------------- SECURITY ----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = settings.JWT_ALGORITHM
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ---------------- ROUTER ----------------
api_router = APIRouter(prefix="/api", tags=["BudgetIQ"])

# ---------------- MODELS ----------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: str

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AccountCreate(BaseModel):
    name: str
    type: str
    balance: float

class AccountUpdate(BaseModel):
    name: Optional[str]
    type: Optional[str]
    balance: Optional[float]

class Account(AccountCreate):
    id: str
    user_id: str
    created_at: str

class TransactionCreate(BaseModel):
    account_id: str
    type: str
    amount: float
    category: str
    description: str
    date: str

class TransactionUpdate(BaseModel):
    account_id: Optional[str]
    type: Optional[str]
    amount: Optional[float]
    category: Optional[str]
    description: Optional[str]
    date: Optional[str]

class Transaction(TransactionCreate):
    id: str
    user_id: str
    created_at: str

class GoalCreate(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0
    deadline: str

class GoalUpdate(BaseModel):
    name: Optional[str]
    target_amount: Optional[float]
    current_amount: Optional[float]
    deadline: Optional[str]

class Goal(GoalCreate):
    id: str
    user_id: str
    created_at: str

# ---------------- AUTH HELPERS ----------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user_id: str):
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    payload = {"user_id": user_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if not user_id:
            raise credentials_exception
        return TokenData(user_id=user_id)
    except jwt.JWTError:
        raise credentials_exception

# ---------------- AUTH ENDPOINTS ----------------
@api_router.post("/auth/signup", response_model=Token)
async def signup(user: UserSignup):
    existing = supabase.table("users").select("*").eq("email", user.email).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_data = {
        "id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    supabase.table("users").insert(user_data).execute()
    token = create_access_token(user_data["id"])
    return {"access_token": token}

@api_router.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    result = supabase.table("users").select("*").eq("email", user.email).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    db_user = result.data[0]
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(db_user["id"])
    return {"access_token": token}

@api_router.get("/auth/me")
async def me(current_user: TokenData = Depends(get_current_user)):
    result = supabase.table("users").select("id,name,email,created_at").eq("id", current_user.user_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data[0]

# ---------------- ACCOUNTS ----------------
@api_router.post("/accounts", response_model=Account)
async def create_account(account: AccountCreate, current_user: TokenData = Depends(get_current_user)):
    data = account.dict()
    data.update({"id": str(uuid.uuid4()), "user_id": current_user.user_id, "created_at": datetime.now(timezone.utc).isoformat()})
    supabase.table("accounts").insert(data).execute()
    return data

@api_router.get("/accounts", response_model=List[Account])
async def get_accounts(current_user: TokenData = Depends(get_current_user)):
    result = supabase.table("accounts").select("*").eq("user_id", current_user.user_id).execute()
    return result.data

@api_router.put("/accounts/{account_id}", response_model=Account)
async def update_account(account_id: str, account: AccountUpdate, current_user: TokenData = Depends(get_current_user)):
    result = supabase.table("accounts").select("*").eq("id", account_id).eq("user_id", current_user.user_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    updated_data = {k:v for k,v in account.dict().items() if v is not None}
    supabase.table("accounts").update(updated_data).eq("id", account_id).execute()
    return {**result.data[0], **updated_data}

@api_router.delete("/accounts/{account_id}")
async def delete_account(account_id: str, current_user: TokenData = Depends(get_current_user)):
    supabase.table("accounts").delete().eq("id", account_id).eq("user_id", current_user.user_id).execute()
    return {"detail": "Account deleted"}

# ---------------- TRANSACTIONS ----------------
@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate, current_user: TokenData = Depends(get_current_user)):
    data = transaction.dict()
    data.update({"id": str(uuid.uuid4()), "user_id": current_user.user_id, "created_at": datetime.now(timezone.utc).isoformat()})
    supabase.table("transactions").insert(data).execute()
    return data

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(current_user: TokenData = Depends(get_current_user)):
    result = supabase.table("transactions").select("*").eq("user_id", current_user.user_id).execute()
    return result.data

@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(transaction_id: str, transaction: TransactionUpdate, current_user: TokenData = Depends(get_current_user)):
    result = supabase.table("transactions").select("*").eq("id", transaction_id).eq("user_id", current_user.user_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    updated_data = {k:v for k,v in transaction.dict().items() if v is not None}
    supabase.table("transactions").update(updated_data).eq("id", transaction_id).execute()
    return {**result.data[0], **updated_data}

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str, current_user: TokenData = Depends(get_current_user)):
    supabase.table("transactions").delete().eq("id", transaction_id).eq("user_id", current_user.user_id).execute()
    return {"detail": "Transaction deleted"}

# ---------------- GOALS ----------------
@api_router.post("/goals", response_model=Goal)
async def create_goal(goal: GoalCreate, current_user: TokenData = Depends(get_current_user)):
    data = goal.dict()
    data.update({"id": str(uuid.uuid4()), "user_id": current_user.user_id, "created_at": datetime.now(timezone.utc).isoformat()})
    supabase.table("goals").insert(data).execute()
    return data

@api_router.get("/goals", response_model=List[Goal])
async def get_goals(current_user: TokenData = Depends(get_current_user)):
    result = supabase.table("goals").select("*").eq("user_id", current_user.user_id).execute()
    return result.data

@api_router.put("/goals/{goal_id}", response_model=Goal)
async def update_goal(goal_id: str, goal: GoalUpdate, current_user: TokenData = Depends(get_current_user)):
    result = supabase.table("goals").select("*").eq("id", goal_id).eq("user_id", current_user.user_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    updated_data = {k:v for k,v in goal.dict().items() if v is not None}
    supabase.table("goals").update(updated_data).eq("id", goal_id).execute()
    return {**result.data[0], **updated_data}

@api_router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str, current_user: TokenData = Depends(get_current_user)):
    supabase.table("goals").delete().eq("id", goal_id).eq("user_id", current_user.user_id).execute()
    return {"detail": "Goal deleted"}

# ---------------- AI & INSIGHTS ----------------
def predict_next_month_expense(transactions: List[dict]) -> dict:
    if len(transactions) < 3:
        return {"predicted_amount": 0, "confidence": "low", "trend": "insufficient_data"}
    monthly_expenses = defaultdict(float)
    for t in transactions:
        if t["type"] == "expense":
            date = datetime.fromisoformat(t["date"])
            month_key = f"{date.year}-{date.month:02d}"
            monthly_expenses[month_key] += t["amount"]
    if len(monthly_expenses) < 2:
        return {"predicted_amount": 0, "confidence": "low", "trend": "insufficient_data"}
    sorted_months = sorted(monthly_expenses.items())
    expenses = [expense for _, expense in sorted_months]
    n = len(expenses)
    x = np.arange(n)
    y = np.array(expenses)
    slope = np.sum((x - np.mean(x)) * (y - np.mean(y))) / np.sum((x - np.mean(x)) ** 2)
    intercept = np.mean(y) - slope * np.mean(x)
    predicted = max(0, slope * n + intercept)
    trend = "increasing" if slope > 50 else "decreasing" if slope < -50 else "stable"
    confidence = "high" if n >= 6 else "medium" if n >= 4 else "low"
    return {"predicted_amount": round(predicted,2), "confidence": confidence, "trend": trend, "historical_average": round(np.mean(y),2)}

# ---------------- DATABASE INIT ----------------
async def init_database():
    return True

# ---------------- FASTAPI APP ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_database()
    yield

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION, lifespan=lifespan)

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(api_router)

@app.get("/health")
async def health_check():
    return {"status":"healthy","timestamp":datetime.now(timezone.utc).isoformat(),"version":settings.APP_VERSION}
