from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, List
from routes.auth import get_current_user, TokenData
from services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

class DashboardSummary(BaseModel):
    total_balance: float
    monthly_income: float
    monthly_expenses: float
    savings_rate: float
    financial_score: int
    expense_prediction: Dict
    recent_transactions: List
    goals_progress: List

@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(current_user: TokenData = Depends(get_current_user)):
    # TODO: Get all required data from Supabase
    # For now, return a placeholder response
    return {
        "total_balance": 0,
        "monthly_income": 0,
        "monthly_expenses": 0,
        "savings_rate": 0,
        "financial_score": 50,
        "expense_prediction": {
            "prediction": 0,
            "confidence": "low",
            "trend": "stable",
            "historical_avg": 0
        },
        "recent_transactions": [],
        "goals_progress": []
    }