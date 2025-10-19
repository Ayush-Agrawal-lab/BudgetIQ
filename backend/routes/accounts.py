# accounts.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from routes.auth import get_current_user, TokenData
from models.core import Account
from models.schemas import AccountCreate
from services.supabase_service import (
    get_user_accounts,
    get_account_by_id,
    create_account as create_account_db,
    delete_account as delete_account_db
)
from errors import NotFoundException

router = APIRouter(prefix="/accounts", tags=["Accounts"])

# -----------------------------
# GET ALL ACCOUNTS
# -----------------------------
@router.get("/", response_model=List[Account])
async def get_accounts(current_user: TokenData = Depends(get_current_user)):
    """Get all accounts for the current user"""
    accounts = await get_user_accounts(current_user.email)
    return accounts

# -----------------------------
# CREATE ACCOUNT
# -----------------------------
@router.post("/", response_model=Account, status_code=status.HTTP_201_CREATED)
async def create_account(account: AccountCreate, current_user: TokenData = Depends(get_current_user)):
    """Create a new account for the current user"""
    account_data = {
        "user_id": current_user.email,
        **account.dict()
    }
    created_account = await create_account_db(account_data)
    if not created_account:
        raise HTTPException(status_code=400, detail="Could not create account")
    return created_account

# -----------------------------
# GET ACCOUNT BY ID
# -----------------------------
@router.get("/{account_id}", response_model=Account)
async def get_account(account_id: str, current_user: TokenData = Depends(get_current_user)):
    """Get a specific account by ID"""
    account = await get_account_by_id(account_id, current_user.email)
    if not account:
        raise NotFoundException(detail=f"Account with ID {account_id} not found")
    return account

# -----------------------------
# DELETE ACCOUNT
# -----------------------------
@router.delete("/{account_id}", status_code=status.HTTP_200_OK)
async def delete_account(account_id: str, current_user: TokenData = Depends(get_current_user)):
    """Delete an account by ID"""
    result = await delete_account_db(account_id, current_user.email)
    if not result:
        raise NotFoundException(detail=f"Account with ID {account_id} not found")
    return {"message": "Account deleted successfully"}
