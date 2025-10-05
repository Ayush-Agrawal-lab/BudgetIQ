from supabase import create_client
from config import settings

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

async def get_user_by_email(email: str):
    """Get user by email from Supabase"""
    response = await supabase.from_('users').select('*').eq('email', email).single()
    return response.data

async def create_user(email: str, hashed_password: str):
    """Create a new user in Supabase"""
    user_data = {
        'email': email,
        'password': hashed_password,
    }
    response = await supabase.from_('users').insert(user_data).single()
    return response.data

async def get_user_accounts(user_id: str):
    """Get all accounts for a user"""
    response = await supabase.from_('accounts').select('*').eq('user_id', user_id)
    return response.data

async def create_account(account_data: dict):
    """Create a new account"""
    response = await supabase.from_('accounts').insert(account_data).single()
    return response.data

async def delete_account(account_id: str, user_id: str):
    """Delete an account"""
    response = await supabase.from_('accounts').delete().eq('id', account_id).eq('user_id', user_id)
    return response.data

async def get_user_transactions(user_id: str):
    """Get all transactions for a user"""
    response = await supabase.from_('transactions').select('*').eq('user_id', user_id)
    return response.data

async def create_transaction(transaction_data: dict):
    """Create a new transaction"""
    response = await supabase.from_('transactions').insert(transaction_data).single()
    return response.data

async def delete_transaction(transaction_id: str, user_id: str):
    """Delete a transaction"""
    response = await supabase.from_('transactions').delete().eq('id', transaction_id).eq('user_id', user_id)
    return response.data

async def get_user_goals(user_id: str):
    """Get all goals for a user"""
    response = await supabase.from_('goals').select('*').eq('user_id', user_id)
    return response.data

async def create_goal(goal_data: dict):
    """Create a new goal"""
    response = await supabase.from_('goals').insert(goal_data).single()
    return response.data

async def update_goal(goal_id: str, goal_data: dict, user_id: str):
    """Update a goal"""
    response = await supabase.from_('goals').update(goal_data).eq('id', goal_id).eq('user_id', user_id).single()
    return response.data

async def delete_goal(goal_id: str, user_id: str):
    """Delete a goal"""
    response = await supabase.from_('goals').delete().eq('id', goal_id).eq('user_id', user_id)
    return response.data