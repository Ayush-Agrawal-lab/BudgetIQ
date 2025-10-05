from datetime import datetime
from enum import Enum
from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional, List
from uuid import UUID

class AccountType(str, Enum):
    CHECKING = "checking"
    SAVINGS = "savings"
    CREDIT = "credit"
    INVESTMENT = "investment"
    LOAN = "loan"
    OTHER = "other"

class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"

class TransactionCategory(str, Enum):
    SALARY = "salary"
    GROCERIES = "groceries"
    UTILITIES = "utilities"
    RENT = "rent"
    TRANSPORTATION = "transportation"
    ENTERTAINMENT = "entertainment"
    HEALTH = "health"
    SHOPPING = "shopping"
    OTHER = "other"

class GoalType(str, Enum):
    SAVINGS = "savings"
    DEBT_PAYMENT = "debt_payment"
    INVESTMENT = "investment"
    OTHER = "other"

class User(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime
    updated_at: datetime

class Account(BaseModel):
    id: UUID
    user_id: UUID
    name: str = Field(..., min_length=1, max_length=100)
    type: AccountType
    balance: float = Field(..., ge=0)
    currency: str = Field(..., min_length=3, max_length=3)
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

class Transaction(BaseModel):
    id: UUID
    user_id: UUID
    account_id: UUID
    type: TransactionType
    category: TransactionCategory
    amount: float = Field(..., gt=0)
    description: str = Field(..., min_length=1, max_length=500)
    date: datetime
    created_at: datetime
    updated_at: datetime

class Goal(BaseModel):
    id: UUID
    user_id: UUID
    name: str = Field(..., min_length=1, max_length=100)
    type: GoalType
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(0, ge=0)
    target_date: datetime
    is_completed: bool = False
    created_at: datetime
    updated_at: datetime

class Dashboard(BaseModel):
    total_balance: float
    monthly_income: float
    monthly_expenses: float
    savings_rate: float
    accounts: List[Account]
    recent_transactions: List[Transaction]
    active_goals: List[Goal]