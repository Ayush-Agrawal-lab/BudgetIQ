from pydantic import BaseModel, EmailStr, Field, UUID4
from typing import Optional
from models.core import AccountType, TransactionType, TransactionCategory, GoalType

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AccountCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: AccountType
    balance: float = Field(..., ge=0)
    currency: str = Field(..., min_length=3, max_length=3)

class AccountUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[AccountType] = None
    balance: Optional[float] = Field(None, ge=0)
    is_active: Optional[bool] = None

class TransactionCreate(BaseModel):
    account_id: UUID4
    type: TransactionType
    category: TransactionCategory
    amount: float = Field(..., gt=0)
    description: str = Field(..., min_length=1, max_length=500)

class TransactionUpdate(BaseModel):
    type: Optional[TransactionType] = None
    category: Optional[TransactionCategory] = None
    amount: Optional[float] = Field(None, gt=0)
    description: Optional[str] = Field(None, min_length=1, max_length=500)

class GoalCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: GoalType
    target_amount: float = Field(..., gt=0)
    target_date: str

class GoalUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[GoalType] = None
    target_amount: Optional[float] = Field(None, gt=0)
    current_amount: Optional[float] = Field(None, ge=0)
    target_date: Optional[str] = None
    is_completed: Optional[bool] = None