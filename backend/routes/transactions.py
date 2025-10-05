from fastapi import APIRouter, Depends, HTTPException
from typing import List
from routes.auth import get_current_user, TokenData
from models.core import Transaction
from models.schemas import TransactionCreate, TransactionUpdate
from services.supabase_service import (
    get_user_transactions, create_transaction as create_transaction_db,
    delete_transaction as delete_transaction_db
)
from errors import NotFoundException

router = APIRouter()

@router.get("/", response_model=List[Transaction])
async def get_transactions(
    current_user: TokenData = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """Get all transactions for the current user"""
    transactions = await get_user_transactions(current_user.email)
    return transactions[skip:skip + limit]

@router.post("/", response_model=Transaction)
async def create_transaction(
    transaction: TransactionCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new transaction for the current user"""
    transaction_data = {
        "user_id": current_user.email,
        **transaction.dict(),
        "date": datetime.utcnow()
    }
    created_transaction = await create_transaction_db(transaction_data)
    if not created_transaction:
        raise HTTPException(status_code=400, detail="Could not create transaction")
    return created_transaction

@router.get("/{transaction_id}", response_model=Transaction)
async def get_transaction(
    transaction_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Get a specific transaction by ID"""
    transactions = await get_user_transactions(current_user.email)
    transaction = next((t for t in transactions if t["id"] == transaction_id), None)
    if not transaction:
        raise NotFoundException(detail=f"Transaction with ID {transaction_id} not found")
    return transaction

@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Delete a transaction by ID"""
    result = await delete_transaction_db(transaction_id, current_user.email)
    if not result:
        raise NotFoundException(detail=f"Transaction with ID {transaction_id} not found")
    return {"message": "Transaction deleted successfully"}