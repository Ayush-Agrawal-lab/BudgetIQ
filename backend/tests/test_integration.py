import asyncio
import httpx
from datetime import datetime

async def test_full_integration(backend_url: str = "http://localhost:8000"):
    async with httpx.AsyncClient() as client:
        print("\n🔄 Testing Full Stack Integration")
        print("=================================")

        # ----------------------
        # 1️⃣ Authentication Flow
        # ----------------------
        print("\n1. Testing Authentication Flow")
        try:
            # Signup
            signup_data = {
                "email": "test@example.com",
                "password": "testpassword123"
            }
            signup_response = await client.post(f"{backend_url}/api/auth/signup", json=signup_data)
            signup_response.raise_for_status()
            print("✅ Signup successful")

            # Login
            login_data = {
                "email": "test@example.com",
                "password": "testpassword123"
            }
            login_response = await client.post(f"{backend_url}/api/auth/login", json=login_data)
            login_response.raise_for_status()
            print("✅ Login successful")

            token = login_response.json().get("access_token")
            headers = {"Authorization": f"Bearer {token}"}

        except Exception as e:
            print("❌ Authentication Error:", str(e))
            return

        # ----------------------
        # 2️⃣ Account Management
        # ----------------------
        print("\n2. Testing Account Management")
        try:
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
            create_account_response.raise_for_status()
            print("✅ Create Account successful")
            account_id = create_account_response.json().get("id")

            get_accounts_response = await client.get(
                f"{backend_url}/api/accounts",
                headers=headers
            )
            get_accounts_response.raise_for_status()
            print("✅ Get Accounts successful")

        except Exception as e:
            print("❌ Account Management Error:", str(e))
            return

        # ----------------------
        # 3️⃣ Transactions
        # ----------------------
        print("\n3. Testing Transactions")
        try:
            transaction_data = {
                "amount": 100.0,
                "type": "expense",
                "category": "groceries",
                "description": "Test transaction",
                "date": datetime.now().isoformat(),
                "account_id": account_id  # Use created account ID
            }
            create_transaction_response = await client.post(
                f"{backend_url}/api/transactions",
                json=transaction_data,
                headers=headers
            )
            create_transaction_response.raise_for_status()
            print("✅ Create Transaction successful")

            get_transactions_response = await client.get(
                f"{backend_url}/api/transactions",
                headers=headers
            )
            get_transactions_response.raise_for_status()
            print("✅ Get Transactions successful")

        except Exception as e:
            print("❌ Transactions Error:", str(e))
            return

        # ----------------------
        # 4️⃣ Goals
        # ----------------------
        print("\n4. Testing Goals")
        try:
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
            create_goal_response.raise_for_status()
            print("✅ Create Goal successful")

            get_goals_response = await client.get(
                f"{backend_url}/api/goals",
                headers=headers
            )
            get_goals_response.raise_for_status()
            print("✅ Get Goals successful")

        except Exception as e:
            print("❌ Goals Error:", str(e))
            return

        # ----------------------
        # 5️⃣ AI Insights
        # ----------------------
        print("\n5. Testing AI Insights")
        try:
            prediction_response = await client.get(
                f"{backend_url}/api/insights/prediction",
                headers=headers
            )
            prediction_response.raise_for_status()
            print("✅ Get Prediction successful")

            score_response = await client.get(
                f"{backend_url}/api/insights/score",
                headers=headers
            )
            score_response.raise_for_status()
            print("✅ Get Financial Score successful")

        except Exception as e:
            print("❌ AI Insights Error:", str(e))
            return

        # ----------------------
        # 6️⃣ Dashboard
        # ----------------------
        print("\n6. Testing Dashboard")
        try:
            dashboard_response = await client.get(
                f"{backend_url}/api/dashboard/summary",
                headers=headers
            )
            dashboard_response.raise_for_status()
            print("✅ Get Dashboard Summary successful")

        except Exception as e:
            print("❌ Dashboard Error:", str(e))
            return

        print("\n🎉 All tests completed successfully!")

if __name__ == "__main__":
    asyncio.run(test_full_integration())
