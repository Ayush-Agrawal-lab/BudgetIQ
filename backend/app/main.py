from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta, timezone
from typing import List, Optional
import uuid
import jwt
from passlib.context import CryptContext
from services import supabase_service as supabase
from config import settings
from fastapi.security import OAuth2PasswordBearer
from collections import defaultdict
import numpy as np

# ---------------- SECURITY ----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = settings.JWT_ALGORITHM

# ---------------- ROUTER ----------------
api_router = APIRouter(tags=["BudgetIQ"])

# ---------------- AUTH MODELS ----------------
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

# ---------------- ACCOUNT MODELS ----------------
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

# ---------------- TRANSACTION MODELS ----------------
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

# ---------------- GOAL MODELS ----------------
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

# ---------------- PASSWORD HELPERS ----------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: str):
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    payload = {"user_id": user_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# ---------------- AUTH DEPENDENCY ----------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
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
    existing = supabase.supabase.table("users").select("*").eq("email", user.email).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_data = {
        "id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    supabase.supabase.table("users").insert(user_data).execute()
    token = create_access_token(user_data["id"])
    return {"access_token": token}

@api_router.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    result = supabase.supabase.table("users").select("*").eq("email", user.email).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    db_user = result.data[0]
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(db_user["id"])
    return {"access_token": token}

@api_router.get("/auth/me")
async def get_current_user_profile(current_user: TokenData = Depends(get_current_user)):
    result = supabase.supabase.table("users").select("id,name,email,created_at").eq("id", current_user.user_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return result.data[0]

# ---------------- ACCOUNTS ----------------
@api_router.post("/accounts", response_model=Account)
async def create_account(account: AccountCreate, current_user: TokenData = Depends(get_current_user)):
    data = account.dict()
    data.update({"id": str(uuid.uuid4()), "user_id": current_user.user_id, "created_at": datetime.now(timezone.utc).isoformat()})
    supabase.supabase.table("accounts").insert(data).execute()
    return data

@api_router.get("/accounts", response_model=List[Account])
async def get_accounts(current_user: TokenData = Depends(get_current_user)):
    result = supabase.supabase.table("accounts").select("*").eq("user_id", current_user.user_id).execute()
    return result.data

@api_router.put("/accounts/{account_id}", response_model=Account)
async def update_account(account_id: str, account: AccountUpdate, current_user: TokenData = Depends(get_current_user)):
    result = supabase.supabase.table("accounts").select("*").eq("id", account_id).eq("user_id", current_user.user_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    updated_data = {k:v for k,v in account.dict().items() if v is not None}
    supabase.supabase.table("accounts").update(updated_data).eq("id", account_id).execute()
    return {**result.data[0], **updated_data}

@api_router.delete("/accounts/{account_id}")
async def delete_account(account_id: str, current_user: TokenData = Depends(get_current_user)):
    supabase.supabase.table("accounts").delete().eq("id", account_id).eq("user_id", current_user.user_id).execute()
    return {"detail": "Account deleted"}

# ---------------- TRANSACTIONS ----------------
@api_router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate, current_user: TokenData = Depends(get_current_user)):
    data = transaction.dict()
    data.update({"id": str(uuid.uuid4()), "user_id": current_user.user_id, "created_at": datetime.now(timezone.utc).isoformat()})
    supabase.supabase.table("transactions").insert(data).execute()
    return data

@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(current_user: TokenData = Depends(get_current_user)):
    result = supabase.supabase.table("transactions").select("*").eq("user_id", current_user.user_id).execute()
    return result.data

@api_router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(transaction_id: str, transaction: TransactionUpdate, current_user: TokenData = Depends(get_current_user)):
    result = supabase.supabase.table("transactions").select("*").eq("id", transaction_id).eq("user_id", current_user.user_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    updated_data = {k:v for k,v in transaction.dict().items() if v is not None}
    supabase.supabase.table("transactions").update(updated_data).eq("id", transaction_id).execute()
    return {**result.data[0], **updated_data}

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str, current_user: TokenData = Depends(get_current_user)):
    supabase.supabase.table("transactions").delete().eq("id", transaction_id).eq("user_id", current_user.user_id).execute()
    return {"detail": "Transaction deleted"}

# ---------------- GOALS ----------------
@api_router.post("/goals", response_model=Goal)
async def create_goal(goal: GoalCreate, current_user: TokenData = Depends(get_current_user)):
    data = goal.dict()
    data.update({"id": str(uuid.uuid4()), "user_id": current_user.user_id, "created_at": datetime.now(timezone.utc).isoformat()})
    supabase.supabase.table("goals").insert(data).execute()
    return data

@api_router.get("/goals", response_model=List[Goal])
async def get_goals(current_user: TokenData = Depends(get_current_user)):
    result = supabase.supabase.table("goals").select("*").eq("user_id", current_user.user_id).execute()
    return result.data

@api_router.put("/goals/{goal_id}", response_model=Goal)
async def update_goal(goal_id: str, goal: GoalUpdate, current_user: TokenData = Depends(get_current_user)):
    result = supabase.supabase.table("goals").select("*").eq("id", goal_id).eq("user_id", current_user.user_id).execute()
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Goal not found")
    updated_data = {k:v for k,v in goal.dict().items() if v is not None}
    supabase.supabase.table("goals").update(updated_data).eq("id", goal_id).execute()
    return {**result.data[0], **updated_data}

@api_router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str, current_user: TokenData = Depends(get_current_user)):
    supabase.supabase.table("goals").delete().eq("id", goal_id).eq("user_id", current_user.user_id).execute()
    return {"detail": "Goal deleted"}

# ---------------- AI / INSIGHTS ----------------
@api_router.get("/insights/prediction")
async def prediction(current_user: TokenData = Depends(get_current_user)):
    result = supabase.supabase.table("transactions").select("*").eq("user_id", current_user.user_id).execute()
    data = result.data if result.data else []
    prediction = np.sum([t["amount"] for t in data]) * 1.05 if data else 0
    return {"prediction": prediction}

@api_router.get("/insights/score")
async def score(current_user: TokenData = Depends(get_current_user)):
    result = supabase.supabase.table("transactions").select("*").eq("user_id", current_user.user_id).execute()
    total = np.sum([t["amount"] for t in result.data]) if result.data else 0
    score = min(100, total / 1000 * 100)
    return {"score": score}

# ---------------- INIT DATABASE ----------------
async def init_database():
    return True
