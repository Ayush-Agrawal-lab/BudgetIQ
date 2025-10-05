import asyncio
from datetime import timedelta
from typing import List
from pydantic import BaseModel

from config import settings
from services.ai_service import AIService
from services.supabase_service import get_user_accounts, get_user_transactions

ai_service = AIService()

# ✅ Pydantic model for users
class User(BaseModel):
    email: str

# --------------------------------------------------------------------
# 🔸 Stub functions (Replace with actual Supabase queries when ready)
# --------------------------------------------------------------------

async def get_all_users() -> List[User]:
    """
    Fetch all users from Supabase (currently a placeholder).
    """
    # TODO: Implement actual Supabase query to fetch users
    return []

async def update_user_prediction(user_email: str, prediction: dict):
    """
    Update the user's prediction data in Supabase.
    """
    # TODO: Implement Supabase update
    print(f"[Prediction Updated] {user_email}: {prediction}")

async def update_user_trends(user_email: str, trends: dict):
    """
    Update the user's trends data in Supabase.
    """
    # TODO: Implement Supabase update
    print(f"[Trends Updated] {user_email}: {trends}")

# --------------------------------------------------------------------
# 🔸 Background Tasks
# --------------------------------------------------------------------

async def update_predictions_task():
    """
    Periodically update AI predictions for all users.
    """
    print("[Background] Running predictions task...")
    users = await get_all_users()
    for user in users:
        try:
            transactions = await get_user_transactions(user.email)
            prediction = ai_service.predict_next_month_expense(transactions)
            await update_user_prediction(user.email, prediction)
        except Exception as e:
            print(f"[Error] Prediction update failed for {user.email}: {e}")

async def update_trends_task():
    """
    Periodically update trend analysis for all users.
    """
    print("[Background] Running trends task...")
    users = await get_all_users()
    for user in users:
        try:
            transactions = await get_user_transactions(user.email)
            accounts = await get_user_accounts(user.email)
            trends = ai_service.analyze_trends(transactions, accounts)
            await update_user_trends(user.email, trends)
        except Exception as e:
            print(f"[Error] Trend update failed for {user.email}: {e}")

# --------------------------------------------------------------------
# 🔸 Scheduler Loops
# --------------------------------------------------------------------

async def run_periodic_task(task_func, interval_minutes: int):
    """
    Runs a given coroutine periodically at the specified interval.
    """
    while True:
        await task_func()
        await asyncio.sleep(interval_minutes * 60)

# --------------------------------------------------------------------
# 🔸 Setup Function (Called in app.py startup)
# --------------------------------------------------------------------

def setup_background_tasks(loop: asyncio.AbstractEventLoop):
    """
    Schedule background tasks to run periodically without blocking the app.
    """
    loop.create_task(
        run_periodic_task(update_predictions_task, settings.PREDICTION_UPDATE_INTERVAL)
    )
    loop.create_task(
        run_periodic_task(update_trends_task, settings.TREND_UPDATE_INTERVAL)
    )
    print("[Scheduler] Background tasks scheduled ✅")
