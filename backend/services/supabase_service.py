from supabase import create_client
import os
from dotenv import load_dotenv
from pathlib import Path

# ---------------- ENV ----------------
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------- USERS ----------------
async def get_user_by_email(email: str):
    result = supabase.table("users").select("*").eq("email", email).execute()
    return result.data[0] if result.data else None

async def create_user(email: str, hashed_password: str):
    result = supabase.table("users").insert({"email": email, "password": hashed_password}).execute()
    return result.data[0] if result.data else None

# ---------------- ACCOUNTS ----------------
async def get_user_accounts(user_id: str):
    result = supabase.table("accounts").select("*").eq("user_id", user_id).execute()
    return result.data if result.data else []

async def create_account(account_data: dict):
    result = supabase.table("accounts").insert(account_data).execute()
    return result.data[0] if result.data else None
