import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
from typing import List, Dict, Optional

class AIService:
    @staticmethod
    def predict_next_month_expense(historical_data: List[Dict]) -> Dict:
        """
        Predict next month's expenses using linear regression
        """
        if not historical_data or len(historical_data) < 2:
            return {
                "prediction": None,
                "confidence": "low",
                "trend": "stable",
                "historical_avg": None
            }

        # Extract amounts and convert to numpy array
        amounts = np.array([float(d['amount']) for d in historical_data])
        months = np.arange(len(amounts)).reshape(-1, 1)

        # Fit linear regression
        model = LinearRegression()
        model.fit(months, amounts)

        # Make prediction for next month
        next_month = np.array([[len(amounts)]])
        prediction = model.predict(next_month)[0]

        # Calculate confidence and trend
        historical_avg = np.mean(amounts)
        slope = model.coef_[0]
        r_squared = model.score(months, amounts)

        # Determine confidence level
        if r_squared > 0.7:
            confidence = "high"
        elif r_squared > 0.4:
            confidence = "medium"
        else:
            confidence = "low"

        # Determine trend
        if abs(slope) < 0.1 * historical_avg:
            trend = "stable"
        else:
            trend = "increasing" if slope > 0 else "decreasing"

        return {
            "prediction": round(float(prediction), 2),
            "confidence": confidence,
            "trend": trend,
            "historical_avg": round(float(historical_avg), 2)
        }

    @staticmethod
    def generate_financial_tips(transactions: List[Dict], accounts: List[Dict]) -> List[str]:
        """
        Generate personalized financial tips based on spending patterns
        """
        tips = []
        
        # Calculate total income and expenses
        total_income = sum(t['amount'] for t in transactions if t['type'] == 'income')
        total_expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
        
        # Basic tips based on savings rate
        if total_income > 0:
            savings_rate = (total_income - total_expenses) / total_income
            if savings_rate < 0.2:
                tips.append("Try to save at least 20% of your income each month")
            elif savings_rate > 0.5:
                tips.append("Great savings rate! Consider investing some of your savings")

        # Category-specific tips
        category_expenses = {}
        for t in transactions:
            if t['type'] == 'expense':
                category_expenses[t['category']] = category_expenses.get(t['category'], 0) + t['amount']

        # Identify high-spending categories
        if category_expenses:
            highest_category = max(category_expenses.items(), key=lambda x: x[1])
            tips.append(f"Your highest spending category is {highest_category[0]}. Consider setting a budget for this category")

        return tips

    @staticmethod
    def calculate_financial_score(transactions: List[Dict], accounts: List[Dict]) -> Dict:
        """
        Calculate financial health score (0-100)
        """
        score = 50  # Base score
        details = {}

        # Calculate savings rate (up to 30 points)
        total_income = sum(t['amount'] for t in transactions if t['type'] == 'income')
        total_expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
        
        if total_income > 0:
            savings_rate = (total_income - total_expenses) / total_income
            savings_score = min(30, int(savings_rate * 100))
            score += savings_score
            details["savings_rate"] = savings_score

        # Transaction consistency (up to 10 points)
        # Check if there are regular monthly transactions
        consistency_score = min(10, len(set(t['category'] for t in transactions)))
        score += consistency_score
        details["consistency"] = consistency_score

        # Account balance health (up to 10 points)
        total_balance = sum(a['balance'] for a in accounts)
        if total_income > 0:
            balance_ratio = total_balance / total_income
            balance_score = min(10, int(balance_ratio * 5))
            score += balance_score
            details["balance_health"] = balance_score

        return {
            "score": min(100, score),
            "details": details,
            "message": "Your financial health score is based on savings rate, transaction consistency, and account balance health."
        }