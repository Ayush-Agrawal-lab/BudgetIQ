from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, timedelta, timezone
import uuid
import jwt
from passlib.context import CryptContext
from collections import defaultdict
import numpy as np
from supabase import create_client, Client
import os

from config import settings

# ---------------- SUPABASE ----------------
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

# ---------------- SECURITY ----------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = "HS256"
security = HTTPBearer()

# ---------------- ROUTER ----------------
api_router = APIRouter(prefix="/api", tags=["BudgetIQ"])

# ---------------- MODELS ----------------
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Account(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    type: str
    balance: float
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Transaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    account_id: str
    type: str
    amount: float
    category: str
    description: str
    date: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Goal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    target_amount: float
    current_amount: float = 0
    deadline: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AccountCreate(BaseModel):
    name: str
    type: str
    balance: float

class TransactionCreate(BaseModel):
    account_id: str
    type: str
    amount: float
    category: str
    description: str
    date: str

class GoalCreate(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0
    deadline: str

# ---------------- AUTH HELPERS ----------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_token(user_id: str) -> str:
    payload = {"user_id": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

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

def generate_financial_tips(transactions: List[dict], prediction: dict) -> List[str]:
    tips = []
    if not transactions: return ["Start tracking your expenses to get personalized insights!"]
    category_expenses = defaultdict(float)
    total_expense = total_income = 0
    for t in transactions:
        if t["type"] == "expense":
            category_expenses[t["category"]] += t["amount"]
            total_expense += t["amount"]
        else:
            total_income += t["amount"]
    if category_expenses:
        highest_cat = max(category_expenses, key=category_expenses.get)
        highest_amount = category_expenses[highest_cat]
        if highest_amount > total_expense*0.3:
            tips.append(f"💡 Your '{highest_cat}' spending is high ({round(highest_amount/total_expense*100)}%). Consider setting a budget limit.")
    if total_income>0:
        savings_rate = ((total_income-total_expense)/total_income)*100
        if savings_rate<20: tips.append(f"📊 You're saving {round(savings_rate)}% of your income. Aim for at least 20% savings rate.")
        elif savings_rate>40: tips.append(f"🎉 Excellent! You're saving {round(savings_rate)}% of your income. Keep it up!")
    if prediction["trend"]=="increasing": tips.append("📈 Your expenses are trending upward. Review your purchases.")
    elif prediction["trend"]=="decreasing": tips.append("📉 Great job! Your expenses are decreasing.")
    if len(tips)<3: tips.extend(["💰 Create an emergency fund covering 3-6 months of expenses.","📱 Review subscriptions monthly and cancel unused services.","🎯 Set specific savings goals to stay motivated."])
    return tips[:4]

def calculate_financial_score(transactions: List[dict], accounts: List[dict]) -> int:
    score = 50
    if not transactions: return score
    total_income = sum(t["amount"] for t in transactions if t["type"]=="income")
    total_expense = sum(t["amount"] for t in transactions if t["type"]=="expense")
    if total_income>0:
        savings_rate = ((total_income-total_expense)/total_income)
        score += min(30,savings_rate*75)
    if len(transactions)>10: score+=10
    elif len(transactions)>5: score+=5
    total_balance = sum(acc.get("balance",0) for acc in accounts)
    if total_balance>total_expense: score+=10
    elif total_balance>total_expense*0.5: score+=5
    return min(100,max(0,int(score)))
