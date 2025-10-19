from pydantic import BaseModel
from enum import Enum
from typing import Optional
from datetime import datetime

class AccountType(str, Enum):
    CHECKING = "checking"
    SAVINGS = "savings"

class Account(BaseModel):
    id: str
    user_id: str
    name: str
    type: AccountType
    balance: float
    created_at: datetime
