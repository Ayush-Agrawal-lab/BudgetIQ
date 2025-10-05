from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from routes.auth import get_current_user, TokenData
from services.ai_service import AIService
from services.supabase_service import get_user_transactions, get_user_accounts

router = APIRouter()
ai_service = AIService()

class Prediction(BaseModel):
    prediction: float
    confidence: str
    trend: str
    historical_avg: float

@router.get("/prediction", response_model=Prediction)
async def get_prediction(current_user: TokenData = Depends(get_current_user)):
    """Get expense prediction for next month"""
    # Get historical transactions from Supabase
    transactions = await get_user_transactions(current_user.email)
    return ai_service.predict_next_month_expense(transactions)

@router.get("/tips", response_model=List[str])
async def get_financial_tips(current_user: TokenData = Depends(get_current_user)):
    """Get personalized financial tips based on transaction history"""
    # Get user data from Supabase
    transactions = await get_user_transactions(current_user.email)
    accounts = await get_user_accounts(current_user.email)
    return ai_service.generate_financial_tips(transactions, accounts)

@router.get("/score", response_model=Dict[str, float])
async def get_financial_score(current_user: TokenData = Depends(get_current_user)):
    """Calculate user's financial health score"""
    # Get user data from Supabase
    transactions = await get_user_transactions(current_user.email)
    accounts = await get_user_accounts(current_user.email)
    return ai_service.calculate_financial_score(transactions, accounts)