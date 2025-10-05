import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from datetime import datetime
from app import app
from models.core import AccountType, TransactionType, TransactionCategory, GoalType

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_supabase():
    with patch("services.supabase_service.supabase") as mock:
        yield mock

@pytest.fixture
def test_user_token():
    return "test_token"

def test_root(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to BudgetIQ API"}

def test_create_account(client, mock_supabase, test_user_token):
    """Test account creation"""
    mock_supabase.from_.return_value.insert.return_value.single.return_value = AsyncMock(
        return_value={
            "id": "test_id",
            "name": "Test Account",
            "type": "checking",
            "balance": 1000,
            "currency": "USD"
        }
    )

    response = client.post(
        "/api/accounts/",
        json={
            "name": "Test Account",
            "type": "checking",
            "balance": 1000,
            "currency": "USD"
        },
        headers={"Authorization": f"Bearer {test_user_token}"}
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Test Account"

def test_create_transaction(client, mock_supabase, test_user_token):
    """Test transaction creation"""
    mock_supabase.from_.return_value.insert.return_value.single.return_value = AsyncMock(
        return_value={
            "id": "test_id",
            "account_id": "test_account",
            "type": "expense",
            "category": "groceries",
            "amount": 50,
            "description": "Groceries"
        }
    )

    response = client.post(
        "/api/transactions/",
        json={
            "account_id": "test_account",
            "type": "expense",
            "category": "groceries",
            "amount": 50,
            "description": "Groceries"
        },
        headers={"Authorization": f"Bearer {test_user_token}"}
    )

    assert response.status_code == 200
    assert response.json()["amount"] == 50

def test_create_goal(client, mock_supabase, test_user_token):
    """Test goal creation"""
    mock_supabase.from_.return_value.insert.return_value.single.return_value = AsyncMock(
        return_value={
            "id": "test_id",
            "name": "Test Goal",
            "type": "savings",
            "target_amount": 5000,
            "current_amount": 0,
            "target_date": "2024-12-31"
        }
    )

    response = client.post(
        "/api/goals/",
        json={
            "name": "Test Goal",
            "type": "savings",
            "target_amount": 5000,
            "target_date": "2024-12-31"
        },
        headers={"Authorization": f"Bearer {test_user_token}"}
    )

    assert response.status_code == 200
    assert response.json()["target_amount"] == 5000

def test_get_insights(client, mock_supabase, test_user_token):
    """Test insights endpoint"""
    mock_supabase.from_.return_value.select.return_value = AsyncMock(
        return_value=[{
            "amount": 100,
            "type": "expense",
            "date": "2024-01-01"
        }]
    )

    response = client.get(
        "/api/insights/prediction",
        headers={"Authorization": f"Bearer {test_user_token}"}
    )

    assert response.status_code == 200
    assert "prediction" in response.json()