from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import uuid
import jwt
from passlib.context import CryptContext
from collections import defaultdict
import numpy as np
from services.supabase_service import (
    supabase,
    get_user_by_email,
    create_user,
    get_user_accounts,
    get_account_by_id,
    create_account,
    delete_account
)

# ---------------- ROUTER ----------------
api_router = APIRouter(tags=["BudgetIQ"])

# ---------------- SECURITY ----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "replace_with_env_secret"  # override from settings in server.py
ALGORITHM = "HS256"

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

class Transaction(TransactionCreate):
    id: str
    user_id: str
    created_at: str

class GoalCreate(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0
    deadline: str

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

async def get_current_user(token: str = Depends(lambda: None)) -> TokenData:
    # For demo/testing: replace with real oauth2_scheme dependency in production
    return TokenData(user_id="test_user")

# ---------------- AUTH ----------------
@api_router.post("/auth/signup", response_model=Token)
async def signup(user: UserSignup):
    existing = await get_user_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_data = {
        "id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await create_user(user.email, user_data["password"])
    token = create_access_token(user_data["id"])
    return {"access_token": token}

@api_router.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(db_user["id"])
    return {"access_token": token}

# ---------------- ACCOUNTS ----------------
@api_router.post("/accounts", response_model=Account)
async def create_account_endpoint(account: AccountCreate, current_user: TokenData = Depends(get_current_user)):
    data = account.dict()
    data.update({"id": str(uuid.uuid4()), "user_id": current_user.user_id, "created_at": datetime.now(timezone.utc).isoformat()})
    await create_account(data)
    return data

@api_router.get("/accounts", response_model=List[Account])
async def get_accounts_endpoint(current_user: TokenData = Depends(get_current_user)):
    return await get_user_accounts(current_user.user_id)

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

# ---------------- AI INSIGHTS ----------------
@api_router.get("/insights/prediction")
async def get_prediction(current_user: TokenData = Depends(get_current_user)):
    transactions = supabase.table("transactions").select("*").eq("user_id", current_user.user_id).execute().data
    if len(transactions) < 3:
        return {"predicted_amount": 0, "confidence": "low", "trend": "insufficient_data"}
    monthly_expenses = defaultdict(float)
    for t in transactions:
        if t["type"] == "expense":
            date = datetime.fromisoformat(t["date"])
            month_key = f"{date.year}-{date.month:02d}"
            monthly_expenses[month_key] += t["amount"]
    sorted_months = sorted(monthly_expenses.items())
    expenses = [expense for _, expense in sorted_months]
    x = np.arange(len(expenses))
    y = np.array(expenses)
    slope = np.sum((x - np.mean(x)) * (y - np.mean(y))) / np.sum((x - np.mean(x)) ** 2)
    intercept = np.mean(y) - slope * np.mean(x)
    predicted = max(0, slope * len(expenses) + intercept)
    trend = "increasing" if slope > 50 else "decreasing" if slope < -50 else "stable"
    confidence = "high" if len(expenses) >= 6 else "medium" if len(expenses) >= 4 else "low"
    return {"predicted_amount": round(predicted,2), "confidence": confidence, "trend": trend, "historical_average": round(np.mean(y),2)}

@api_router.get("/insights/score")
async def get_score(current_user: TokenData = Depends(get_current_user)):
    # Example: simple financial score
    accounts = supabase.table("accounts").select("*").eq("user_id", current_user.user_id).execute().data
    balance_total = sum([a["balance"] for a in accounts])
    score = min(max(int(balance_total/1000 * 10),0),100)
    return {"financial_score": score}
