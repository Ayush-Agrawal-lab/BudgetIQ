# app/routers.py
# In app/routers.py or app/main.py
from .services import supabase_service
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import uuid
import jwt
import numpy as np
from passlib.context import CryptContext
from app.services.supabase_service import supabase
from config import settings
from fastapi.security import OAuth2PasswordBearer

# ---------------- Security ----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = settings.JWT_ALGORITHM
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: str):
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    payload = {"user_id": user_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if not user_id:
            raise credentials_exception
        return {"user_id": user_id}
    except jwt.JWTError:
        raise credentials_exception

# ---------------- Models ----------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AccountBase(BaseModel):
    name: str
    type: str
    balance: float

class AccountUpdate(BaseModel):
    name: Optional[str]
    type: Optional[str]
    balance: Optional[float]

class Account(AccountBase):
    id: str
    user_id: str
    created_at: str

class TransactionBase(BaseModel):
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

class Transaction(TransactionBase):
    id: str
    user_id: str
    created_at: str

class GoalBase(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0
    deadline: str

class GoalUpdate(BaseModel):
    name: Optional[str]
    target_amount: Optional[float]
    current_amount: Optional[float]
    deadline: Optional[str]

class Goal(GoalBase):
    id: str
    user_id: str
    created_at: str

# ---------------- Router ----------------
api_router = APIRouter(tags=["BudgetIQ"])

# ---------------- Auth Endpoints ----------------
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
async def me(current_user: dict = Depends(get_current_user)):
    result = supabase.table("users").select("id,name,email,created_at").eq("id", current_user["user_id"]).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data[0]

# ---------------- Accounts ----------------
@api_router.post("/accounts", response_model=Account)
async def create_account(account: AccountBase, current_user: dict = Depends(get_current_user)):
    data = account.dict()
    data.update({"id": str(uuid.uuid4()), "user_id": current_user["user_id"], "created_at": datetime.now(timezone.utc).isoformat()})
    supabase.table("accounts").insert(data).execute()
    return data

@api_router.get("/accounts", response_model=List[Account])
async def get_accounts(current_user: dict = Depends(get_current_user)):
    result = supabase.table("accounts").select("*").eq("user_id", current_user["user_id"]).execute()
    return result.data

@api_router.put("/accounts/{account_id}", response_model=Account)
async def update_account(account_id: str, account: AccountUpdate, current_user: dict = Depends(get_current_user)):
    existing = supabase.table("accounts").select("*").eq("id", account_id).eq("user_id", current_user["user_id"]).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    updated_data = {k:v for k,v in account.dict().items() if v is not None}
    supabase.table("accounts").update(updated_data).eq("id", account_id).execute()
    return {**existing.data[0], **updated_data}

@api_router.delete("/accounts/{account_id}")
async def delete_account(account_id: str, current_user: dict = Depends(get_current_user)):
    supabase.table("accounts").delete().eq("id", account_id).eq("user_id", current_user["user_id"]).execute()
    return {"detail": "Account deleted"}

# ---------------- Transactions ----------------
@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction: TransactionBase, current_user: dict = Depends(get_current_user)):
    data = transaction.dict()
    data.update({"id": str(uuid.uuid4()), "user_id": current_user["user_id"], "created_at": datetime.now(timezone.utc).isoformat()})
    supabase.table("transactions").insert(data).execute()
    return data

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(current_user: dict = Depends(get_current_user)):
    result = supabase.table("transactions").select("*").eq("user_id", current_user["user_id"]).execute()
    return result.data

@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(transaction_id: str, transaction: TransactionUpdate, current_user: dict = Depends(get_current_user)):
    existing = supabase.table("transactions").select("*").eq("id", transaction_id).eq("user_id", current_user["user_id"]).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    updated_data = {k:v for k,v in transaction.dict().items() if v is not None}
    supabase.table("transactions").update(updated_data).eq("id", transaction_id).execute()
    return {**existing.data[0], **updated_data}

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str, current_user: dict = Depends(get_current_user)):
    supabase.table("transactions").delete().eq("id", transaction_id).eq("user_id", current_user["user_id"]).execute()
    return {"detail": "Transaction deleted"}

# ---------------- Goals ----------------
@api_router.post("/goals", response_model=Goal)
async def create_goal(goal: GoalBase, current_user: dict = Depends(get_current_user)):
    data = goal.dict()
    data.update({"id": str(uuid.uuid4()), "user_id": current_user["user_id"], "created_at": datetime.now(timezone.utc).isoformat()})
    supabase.table("goals").insert(data).execute()
    return data

@api_router.get("/goals", response_model=List[Goal])
async def get_goals(current_user: dict = Depends(get_current_user)):
    result = supabase.table("goals").select("*").eq("user_id", current_user["user_id"]).execute()
    return result.data

@api_router.put("/goals/{goal_id}", response_model=Goal)
async def update_goal(goal_id: str, goal: GoalUpdate, current_user: dict = Depends(get_current_user)):
    existing = supabase.table("goals").select("*").eq("id", goal_id).eq("user_id", current_user["user_id"]).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    updated_data = {k:v for k,v in goal.dict().items() if v is not None}
    supabase.table("goals").update(updated_data).eq("id", goal_id).execute()
    return {**existing.data[0], **updated_data}

@api_router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str, current_user: dict = Depends(get_current_user)):
    supabase.table("goals").delete().eq("id", goal_id).eq("user_id", current_user["user_id"]).execute()
    return {"detail": "Goal deleted"}

# ---------------- AI Insights ----------------
@api_router.get("/insights/prediction")
async def get_prediction(current_user: dict = Depends(get_current_user)):
    # Dummy prediction logic
    return {"prediction": np.random.rand() * 1000}

@api_router.get("/insights/score")
async def get_financial_score(current_user: dict = Depends(get_current_user)):
    # Dummy scoring logic
    return {"score": np.random.randint(0, 100)}

# ---------------- Dashboard ----------------
@api_router.get("/dashboard/summary")
async def dashboard_summary(current_user: dict = Depends(get_current_user)):
    accounts = supabase.table("accounts").select("*").eq("user_id", current_user["user_id"]).execute().data
    transactions = supabase.table("transactions").select("*").eq("user_id", current_user["user_id"]).execute().data
    goals = supabase.table("goals").select("*").eq("user_id", current_user["user_id"]).execute().data
    return {
        "accounts_count": len(accounts) if accounts else 0,
        "transactions_count": len(transactions) if transactions else 0,
        "goals_count": len(goals) if goals else 0
    }
