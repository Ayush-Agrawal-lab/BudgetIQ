import pytest
from models.core import (
    Account, Transaction, Goal,
    AccountType, TransactionType, TransactionCategory, GoalType
)
from datetime import datetime
from uuid import UUID

def test_account_model():
    """Test Account model validation"""
    account = Account(
        id=UUID('12345678-1234-5678-1234-567812345678'),
        user_id=UUID('12345678-1234-5678-1234-567812345678'),
        name="Test Account",
        type=AccountType.CHECKING,
        balance=1000.0,
        currency="USD",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    assert account.name == "Test Account"
    assert account.balance == 1000.0

def test_transaction_model():
    """Test Transaction model validation"""
    transaction = Transaction(
        id=UUID('12345678-1234-5678-1234-567812345678'),
        user_id=UUID('12345678-1234-5678-1234-567812345678'),
        account_id=UUID('12345678-1234-5678-1234-567812345678'),
        type=TransactionType.EXPENSE,
        category=TransactionCategory.GROCERIES,
        amount=50.0,
        description="Test Transaction",
        date=datetime.now(),
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    assert transaction.amount == 50.0
    assert transaction.category == TransactionCategory.GROCERIES

def test_goal_model():
    """Test Goal model validation"""
    goal = Goal(
        id=UUID('12345678-1234-5678-1234-567812345678'),
        user_id=UUID('12345678-1234-5678-1234-567812345678'),
        name="Test Goal",
        type=GoalType.SAVINGS,
        target_amount=5000.0,
        current_amount=1000.0,
        target_date=datetime.now(),
        is_completed=False,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    assert goal.target_amount == 5000.0
    assert not goal.is_completed

def test_invalid_account():
    """Test Account model with invalid data"""
    with pytest.raises(ValueError):
        Account(
            id=UUID('12345678-1234-5678-1234-567812345678'),
            user_id=UUID('12345678-1234-5678-1234-567812345678'),
            name="",  # Empty name should fail
            type=AccountType.CHECKING,
            balance=-1000.0,  # Negative balance should fail
            currency="INVALID",  # Invalid currency should fail
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

def test_invalid_transaction():
    """Test Transaction model with invalid data"""
    with pytest.raises(ValueError):
        Transaction(
            id=UUID('12345678-1234-5678-1234-567812345678'),
            user_id=UUID('12345678-1234-5678-1234-567812345678'),
            account_id=UUID('12345678-1234-5678-1234-567812345678'),
            type=TransactionType.EXPENSE,
            category=TransactionCategory.GROCERIES,
            amount=-50.0,  # Negative amount should fail
            description="",  # Empty description should fail
            date=datetime.now(),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

def test_invalid_goal():
    """Test Goal model with invalid data"""
    with pytest.raises(ValueError):
        Goal(
            id=UUID('12345678-1234-5678-1234-567812345678'),
            user_id=UUID('12345678-1234-5678-1234-567812345678'),
            name="",  # Empty name should fail
            type=GoalType.SAVINGS,
            target_amount=-5000.0,  # Negative target amount should fail
            current_amount=-1000.0,  # Negative current amount should fail
            target_date=datetime.now(),
            is_completed=False,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )