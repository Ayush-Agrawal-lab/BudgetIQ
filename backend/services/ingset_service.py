from ingset import Task, TaskScheduler
from datetime import datetime, timedelta
from config import settings
import asyncio

from typing import List
from pydantic import BaseModel
from services.ai_service import AIService
from services.supabase_service import get_user_accounts, get_user_transactions

class User(BaseModel):
    email: str

async def get_all_users() -> List[User]:
    """Get all users from Supabase"""
    # TODO: Implement this function when user table access is available
    return []  # Placeholder for now

async def update_user_prediction(user_email: str, prediction: dict):
    """Update user's predictions in Supabase"""
    # TODO: Implement this function when predictions table is available
    pass

async def update_user_trends(user_email: str, trends: dict):
    """Update user's trends in Supabase"""
    # TODO: Implement this function when trends table is available
    pass

# Initialize task scheduler
scheduler = TaskScheduler()

from services.ai_service import AIService
from services.supabase_service import get_user_accounts, get_user_transactions

ai_service = AIService()

async def update_predictions_task():
    """
    Background task to update AI predictions for all users
    """
    # TODO: Get all users from Supabase
    users = await get_all_users()

    # Update predictions for each user
    for user in users:
        try:
            transactions = await get_user_transactions(user.email)
            prediction = ai_service.predict_next_month_expense(transactions)
            await update_user_prediction(user.email, prediction)
        except Exception as e:
            # Log error but continue processing other users
            print(f"Error updating predictions for user {user.email}: {e}")

async def update_trends_task():
    """
    Background task to update trend analysis for all users
    """
    # TODO: Get all users from Supabase
    users = await get_all_users()

    # Update trends for each user
    for user in users:
        try:
            transactions = await get_user_transactions(user.email)
            accounts = await get_user_accounts(user.email)
            trends = ai_service.analyze_trends(transactions, accounts)
            await update_user_trends(user.email, trends)
        except Exception as e:
            # Log error but continue processing other users
            print(f"Error updating trends for user {user.email}: {e}")

def setup_background_tasks():
    """
    Set up periodic background tasks using Ingset
    """
    # Schedule prediction updates
    scheduler.add_task(
        Task(
            name="update_predictions",
            coroutine=update_predictions_task,
            interval=timedelta(minutes=settings.PREDICTION_UPDATE_INTERVAL)
        )
    )

    # Schedule trend analysis updates
    scheduler.add_task(
        Task(
            name="update_trends",
            coroutine=update_trends_task,
            interval=timedelta(minutes=settings.TREND_UPDATE_INTERVAL)
        )
    )

    # Start the scheduler
    asyncio.create_task(scheduler.start())