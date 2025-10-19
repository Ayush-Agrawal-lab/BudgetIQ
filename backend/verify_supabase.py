# services/supabase_service.py
from supabase import create_client
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent  # Adjust if needed
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']  # Use anon/public key for frontend, service key for backend
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------------------
# USERS
# ---------------------------
async def get_user_by_email(email: str):
    result = supabase.table("users").select("*").eq("email", email).execute()
    if result.data and len(result.data) > 0:
        return result.data[0]
    return None

async def create_user(email: str, hashed_password: str):
    result = supabase.table("users").insert({"email": email, "password": hashed_password}).execute()
    return result.data[0] if result.data else None

# ---------------------------
# ACCOUNTS
# ---------------------------
async def get_user_accounts(user_id: str):
    """Return all accounts for a specific user"""
    result = supabase.table("accounts").select("*").eq("user_id", user_id).execute()
    return result.data if result.data else []

async def get_account_by_id(account_id: str, user_id: str):
    """Return a single account by ID for the current user"""
    result = supabase.table("accounts") \
                     .select("*") \
                     .eq("id", account_id) \
                     .eq("user_id", user_id) \
                     .execute()
    return result.data[0] if result.data and len(result.data) > 0 else None

async def create_account(account_data: dict):
    """Create a new account"""
    result = supabase.table("accounts").insert(account_data).execute()
    return result.data[0] if result.data else None

async def delete_account(account_id: str, user_id: str):
    """Delete an account by ID for the current user"""
    result = supabase.table("accounts").delete().eq("id", account_id).eq("user_id", user_id).execute()
    return True if result.data and len(result.data) > 0 else False
