import asyncio
import httpx
import json
from datetime import datetime

async def test_full_integration(backend_url: str = "http://localhost:8000"):
    async with httpx.AsyncClient() as client:
        print("\n🔄 Testing Full Stack Integration")
        print("=================================")

        # Test 1: Authentication
        print("\n1. Testing Authentication Flow")
        try:
            # Signup
            signup_data = {
                "email": "test@example.com",
                "password": "testpassword123"
            }
            signup_response = await client.post(f"{backend_url}/api/auth/signup", json=signup_data)
            print("✅ Signup:", signup_response.status_code == 200)
            
            token = signup_response.json().get("access_token")
            headers = {"Authorization": f"Bearer {token}"}

            # Login
            login_data = {
                "username": "test@example.com",
                "password": "testpassword123"
            }
            login_response = await client.post(f"{backend_url}/api/auth/login", data=login_data)
            print("✅ Login:", login_response.status_code == 200)

        except Exception as e:
            print("❌ Authentication Error:", str(e))

        # Test 2: Account Management
        print("\n2. Testing Account Management")
        try:
            # Create Account
            account_data = {
                "name": "Test Account",
                "type": "savings",
                "balance": 1000.0
            }
            create_account_response = await client.post(
                f"{backend_url}/api/accounts",
                json=account_data,
                headers=headers
            )
            print("✅ Create Account:", create_account_response.status_code == 200)
            
            # Get Accounts
            get_accounts_response = await client.get(
                f"{backend_url}/api/accounts",
                headers=headers
            )
            print("✅ Get Accounts:", get_accounts_response.status_code == 200)

        except Exception as e:
            print("❌ Account Management Error:", str(e))

        # Test 3: Transactions
        print("\n3. Testing Transactions")
        try:
            # Create Transaction
            transaction_data = {
                "amount": 100.0,
                "type": "expense",
                "category": "groceries",
                "description": "Test transaction",
                "date": datetime.now().isoformat(),
                "account_id": "1"
            }
            create_transaction_response = await client.post(
                f"{backend_url}/api/transactions",
                json=transaction_data,
                headers=headers
            )
            print("✅ Create Transaction:", create_transaction_response.status_code == 200)
            
            # Get Transactions
            get_transactions_response = await client.get(
                f"{backend_url}/api/transactions",
                headers=headers
            )
            print("✅ Get Transactions:", get_transactions_response.status_code == 200)

        except Exception as e:
            print("❌ Transactions Error:", str(e))

        # Test 4: Goals
        print("\n4. Testing Goals")
        try:
            # Create Goal
            goal_data = {
                "name": "Test Goal",
                "target_amount": 5000.0,
                "current_amount": 1000.0
            }
            create_goal_response = await client.post(
                f"{backend_url}/api/goals",
                json=goal_data,
                headers=headers
            )
            print("✅ Create Goal:", create_goal_response.status_code == 200)
            
            # Get Goals
            get_goals_response = await client.get(
                f"{backend_url}/api/goals",
                headers=headers
            )
            print("✅ Get Goals:", get_goals_response.status_code == 200)

        except Exception as e:
            print("❌ Goals Error:", str(e))

        # Test 5: AI Insights
        print("\n5. Testing AI Insights")
        try:
            # Get Prediction
            prediction_response = await client.get(
                f"{backend_url}/api/insights/prediction",
                headers=headers
            )
            print("✅ Get Prediction:", prediction_response.status_code == 200)
            
            # Get Financial Score
            score_response = await client.get(
                f"{backend_url}/api/insights/score",
                headers=headers
            )
            print("✅ Get Financial Score:", score_response.status_code == 200)

        except Exception as e:
            print("❌ AI Insights Error:", str(e))

        # Test 6: Dashboard
        print("\n6. Testing Dashboard")
        try:
            dashboard_response = await client.get(
                f"{backend_url}/api/dashboard/summary",
                headers=headers
            )
            print("✅ Get Dashboard Summary:", dashboard_response.status_code == 200)

        except Exception as e:
            print("❌ Dashboard Error:", str(e))

if __name__ == "__main__":
    asyncio.run(test_full_integration())