from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
import numpy as np
from collections import defaultdict
from supabase import create_client, Client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase connection
supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_SERVICE_KEY']
supabase: Client = create_client(supabase_url, supabase_key)

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "budgetiq-secret-key-college-project-2025"
ALGORITHM = "HS256"
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ==================== DATABASE INITIALIZATION ====================

async def init_database():
    """Create all necessary tables in Supabase"""
    try:
        # Check if tables exist by trying to query them
        supabase.table('users').select('id').limit(1).execute()
        print("✅ Database tables already exist")
    except Exception as e:
        print("⚠️ Tables might not exist, they should be created in Supabase dashboard")
        print("Please run the SQL script to create tables")

# ==================== MODELS ====================

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

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== AI PREDICTION MODEL ====================

def predict_next_month_expense(transactions: List[dict]) -> dict:
    """Simple AI model to predict next month's expenses using linear regression"""
    if len(transactions) < 3:
        return {
            "predicted_amount": 0,
            "confidence": "low",
            "trend": "insufficient_data"
        }
    
    # Group expenses by month
    monthly_expenses = defaultdict(float)
    for t in transactions:
        if t["type"] == "expense":
            date = datetime.fromisoformat(t["date"])
            month_key = f"{date.year}-{date.month:02d}"
            monthly_expenses[month_key] += t["amount"]
    
    if len(monthly_expenses) < 2:
        return {
            "predicted_amount": 0,
            "confidence": "low",
            "trend": "insufficient_data"
        }
    
    # Sort by month and get values
    sorted_months = sorted(monthly_expenses.items())
    expenses = [expense for _, expense in sorted_months]
    
    # Simple linear regression
    n = len(expenses)
    x = np.arange(n)
    y = np.array(expenses)
    
    # Calculate slope and intercept
    x_mean = np.mean(x)
    y_mean = np.mean(y)
    slope = np.sum((x - x_mean) * (y - y_mean)) / np.sum((x - x_mean) ** 2)
    intercept = y_mean - slope * x_mean
    
    # Predict next month
    predicted = slope * n + intercept
    predicted = max(0, predicted)
    
    # Determine trend
    if slope > 50:
        trend = "increasing"
    elif slope < -50:
        trend = "decreasing"
    else:
        trend = "stable"
    
    # Confidence based on data points
    if n >= 6:
        confidence = "high"
    elif n >= 4:
        confidence = "medium"
    else:
        confidence = "low"
    
    return {
        "predicted_amount": round(predicted, 2),
        "confidence": confidence,
        "trend": trend,
        "historical_average": round(y_mean, 2)
    }

def generate_financial_tips(transactions: List[dict], prediction: dict) -> List[str]:
    """Generate personalized financial tips based on spending patterns"""
    tips = []
    
    if not transactions:
        return ["Start tracking your expenses to get personalized insights!"]
    
    # Calculate category-wise expenses
    category_expenses = defaultdict(float)
    total_expense = 0
    total_income = 0
    
    for t in transactions:
        if t["type"] == "expense":
            category_expenses[t["category"]] += t["amount"]
            total_expense += t["amount"]
        else:
            total_income += t["amount"]
    
    # Tip 1: Highest spending category
    if category_expenses:
        highest_cat = max(category_expenses, key=category_expenses.get)
        highest_amount = category_expenses[highest_cat]
        if highest_amount > total_expense * 0.3:
            tips.append(f"💡 Your '{highest_cat}' spending is high ({round(highest_amount/total_expense*100)}%). Consider setting a budget limit.")
    
    # Tip 2: Savings rate
    if total_income > 0:
        savings_rate = ((total_income - total_expense) / total_income) * 100
        if savings_rate < 20:
            tips.append(f"📊 You're saving {round(savings_rate)}% of your income. Aim for at least 20% savings rate.")
        elif savings_rate > 40:
            tips.append(f"🎉 Excellent! You're saving {round(savings_rate)}% of your income. Keep it up!")
    
    # Tip 3: Trend-based advice
    if prediction["trend"] == "increasing":
        tips.append("📈 Your expenses are trending upward. Review your recent purchases and cut unnecessary costs.")
    elif prediction["trend"] == "decreasing":
        tips.append("📉 Great job! Your expenses are decreasing. Maintain this discipline.")
    
    # Tip 4: General advice
    if len(tips) < 3:
        tips.extend([
            "💰 Create an emergency fund covering 3-6 months of expenses.",
            "📱 Review subscriptions monthly and cancel unused services.",
            "🎯 Set specific savings goals to stay motivated."
        ])
    
    return tips[:4]

def calculate_financial_score(transactions: List[dict], user_accounts: List[dict]) -> int:
    """Calculate financial health score (0-100)"""
    score = 50
    
    if not transactions:
        return score
    
    total_income = sum(t["amount"] for t in transactions if t["type"] == "income")
    total_expense = sum(t["amount"] for t in transactions if t["type"] == "expense")
    
    # Factor 1: Savings rate (up to +30 points)
    if total_income > 0:
        savings_rate = ((total_income - total_expense) / total_income)
        score += min(30, savings_rate * 75)
    
    # Factor 2: Consistency (up to +10 points)
    if len(transactions) > 10:
        score += 10
    elif len(transactions) > 5:
        score += 5
    
    # Factor 3: Account balance (up to +10 points)
    total_balance = sum(acc.get("balance", 0) for acc in user_accounts)
    if total_balance > total_expense:
        score += 10
    elif total_balance > total_expense * 0.5:
        score += 5
    
    return min(100, max(0, int(score)))

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/signup")
async def signup(user_data: UserSignup):
    try:
        # Check if user exists
        existing = supabase.table('users').select('*').eq('email', user_data.email).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        user = User(
            name=user_data.name,
            email=user_data.email
        )
        user_dict = user.dict()
        user_dict["password"] = hash_password(user_data.password)
        
        supabase.table('users').insert(user_dict).execute()
        
        token = create_token(user.id)
        return {"token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    try:
        result = supabase.table('users').select('*').eq('email', credentials.email).execute()
        if not result.data or not verify_password(credentials.password, result.data[0]["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user = result.data[0]
        token = create_token(user["id"])
        return {"token": token, "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ACCOUNT ROUTES ====================

@api_router.post("/accounts")
async def create_account(account_data: AccountCreate, user_id: str = Depends(get_current_user)):
    try:
        account = Account(
            user_id=user_id,
            **account_data.dict()
        )
        supabase.table('accounts').insert(account.dict()).execute()
        return account
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/accounts")
async def get_accounts(user_id: str = Depends(get_current_user)):
    try:
        result = supabase.table('accounts').select('*').eq('user_id', user_id).execute()
        return [Account(**acc) for acc in result.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/accounts/{account_id}")
async def delete_account(account_id: str, user_id: str = Depends(get_current_user)):
    try:
        result = supabase.table('accounts').delete().eq('id', account_id).eq('user_id', user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Account not found")
        return {"message": "Account deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== TRANSACTION ROUTES ====================

@api_router.post("/transactions")
async def create_transaction(txn_data: TransactionCreate, user_id: str = Depends(get_current_user)):
    try:
        # Verify account belongs to user
        account_result = supabase.table('accounts').select('*').eq('id', txn_data.account_id).eq('user_id', user_id).execute()
        if not account_result.data:
            raise HTTPException(status_code=404, detail="Account not found")
        
        account = account_result.data[0]
        
        # Create transaction
        transaction = Transaction(
            user_id=user_id,
            **txn_data.dict()
        )
        supabase.table('transactions').insert(transaction.dict()).execute()
        
        # Update account balance
        balance_change = txn_data.amount if txn_data.type == "income" else -txn_data.amount
        new_balance = account["balance"] + balance_change
        supabase.table('accounts').update({"balance": new_balance}).eq('id', txn_data.account_id).execute()
        
        return transaction
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/transactions")
async def get_transactions(user_id: str = Depends(get_current_user)):
    try:
        result = supabase.table('transactions').select('*').eq('user_id', user_id).order('date', desc=True).execute()
        return [Transaction(**txn) for txn in result.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: str, user_id: str = Depends(get_current_user)):
    try:
        # Get transaction
        txn_result = supabase.table('transactions').select('*').eq('id', transaction_id).eq('user_id', user_id).execute()
        if not txn_result.data:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        txn = txn_result.data[0]
        
        # Reverse balance change
        account_result = supabase.table('accounts').select('*').eq('id', txn["account_id"]).execute()
        if account_result.data:
            account = account_result.data[0]
            balance_change = -txn["amount"] if txn["type"] == "income" else txn["amount"]
            new_balance = account["balance"] + balance_change
            supabase.table('accounts').update({"balance": new_balance}).eq('id', txn["account_id"]).execute()
        
        supabase.table('transactions').delete().eq('id', transaction_id).execute()
        return {"message": "Transaction deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== GOALS ROUTES ====================

@api_router.post("/goals")
async def create_goal(goal_data: GoalCreate, user_id: str = Depends(get_current_user)):
    try:
        goal = Goal(
            user_id=user_id,
            **goal_data.dict()
        )
        supabase.table('goals').insert(goal.dict()).execute()
        return goal
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/goals")
async def get_goals(user_id: str = Depends(get_current_user)):
    try:
        result = supabase.table('goals').select('*').eq('user_id', user_id).execute()
        return [Goal(**goal) for goal in result.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/goals/{goal_id}")
async def update_goal(goal_id: str, update_data: GoalCreate, user_id: str = Depends(get_current_user)):
    try:
        result = supabase.table('goals').update(update_data.dict()).eq('id', goal_id).eq('user_id', user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Goal not found")
        return {"message": "Goal updated"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str, user_id: str = Depends(get_current_user)):
    try:
        result = supabase.table('goals').delete().eq('id', goal_id).eq('user_id', user_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Goal not found")
        return {"message": "Goal deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== AI & INSIGHTS ROUTES ====================

@api_router.get("/insights/prediction")
async def get_prediction(user_id: str = Depends(get_current_user)):
    try:
        result = supabase.table('transactions').select('*').eq('user_id', user_id).execute()
        prediction = predict_next_month_expense(result.data)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/insights/tips")
async def get_tips(user_id: str = Depends(get_current_user)):
    try:
        result = supabase.table('transactions').select('*').eq('user_id', user_id).execute()
        prediction = predict_next_month_expense(result.data)
        tips = generate_financial_tips(result.data, prediction)
        return {"tips": tips}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/insights/score")
async def get_financial_score(user_id: str = Depends(get_current_user)):
    try:
        txn_result = supabase.table('transactions').select('*').eq('user_id', user_id).execute()
        acc_result = supabase.table('accounts').select('*').eq('user_id', user_id).execute()
        score = calculate_financial_score(txn_result.data, acc_result.data)
        return {"score": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/dashboard/summary")
async def get_dashboard_summary(user_id: str = Depends(get_current_user)):
    try:
        txn_result = supabase.table('transactions').select('*').eq('user_id', user_id).execute()
        acc_result = supabase.table('accounts').select('*').eq('user_id', user_id).execute()
        
        transactions = txn_result.data
        accounts = acc_result.data
        
        total_income = sum(t["amount"] for t in transactions if t["type"] == "income")
        total_expense = sum(t["amount"] for t in transactions if t["type"] == "expense")
        total_balance = sum(acc["balance"] for acc in accounts)
        
        # Category breakdown
        category_data = defaultdict(float)
        for t in transactions:
            if t["type"] == "expense":
                category_data[t["category"]] += t["amount"]
        
        # Monthly trend (last 6 months)
        monthly_trend = defaultdict(lambda: {"income": 0, "expense": 0})
        for t in transactions:
            date = datetime.fromisoformat(t["date"])
            month_key = f"{date.year}-{date.month:02d}"
            monthly_trend[month_key][t["type"]] += t["amount"]
        
        sorted_trend = sorted(monthly_trend.items())[-6:]
        
        return {
            "total_income": round(total_income, 2),
            "total_expense": round(total_expense, 2),
            "total_savings": round(total_income - total_expense, 2),
            "total_balance": round(total_balance, 2),
            "category_breakdown": dict(category_data),
            "monthly_trend": [{
                "month": month,
                "income": round(data["income"], 2),
                "expense": round(data["expense"], 2)
            } for month, data in sorted_trend]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await init_database()
    logger.info("✅ BudgetIQ API started with Supabase")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 BudgetIQ API shutdown")