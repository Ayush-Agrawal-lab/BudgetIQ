# BudgetIQ - Personal Finance Management Platform

**Tagline:** "Smarter Money Decisions with AI"

A modern, minimalist personal finance platform with AI-powered expense predictions and insights. Built as a B.Tech 3rd year college project.

## 🌟 Features

### Core Features
- **Landing Page**: Modern, responsive landing page with hero section and feature showcase
- **Authentication**: JWT-based secure login and signup system
- **Multi-Account Management**: Track bank, wallet, cash, and UPI accounts
- **Transaction Tracking**: Add, view, filter, and manage income/expenses
- **Quick Add FAB**: Floating action button for quick transaction entry from any page

### AI-Powered Features
- **Expense Prediction**: Simple linear regression model predicts next month's expenses
- **Trend Analysis**: Identifies spending trends (increasing, decreasing, stable)
- **Personalized Tips**: AI-generated financial advice based on spending patterns
- **Financial Health Score**: Calculates a 0-100 score based on savings rate and consistency

### Visual Features
- **Dashboard**: Overview cards showing income, expenses, savings, and predictions
- **Charts**: Bar charts for monthly trends and pie charts for category breakdown
- **Financial Score Widget**: Visual circular progress indicator
- **Goal Tracker**: Set and track savings goals with progress bars
- **Light/Dark Theme**: Full theme toggle support

## 🛠️ Tech Stack

### Frontend
- **React** (v19.0.0) - Modern UI framework
- **React Router** - Client-side routing
- **Shadcn UI** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **FastAPI** - High-performance Python web framework
- **MongoDB** (Motor) - NoSQL database with async support
- **JWT** - Secure authentication
- **Passlib + Bcrypt** - Password hashing
- **NumPy** - AI prediction calculations

### Design
- **Fonts**: Playfair Display (headings), Inter (body)
- **Color Scheme**: Emerald green (#10b981) primary, Navy blue accents
- **Minimal & Modern**: Notion/Linear inspired design

## 📁 Project Structure

```
/
├── backend/
│   ├── create_tables.sql     # Database schema
│   ├── requirements.txt      # Python dependencies
│   ├── server.py            # Main backend server
│   └── verify_supabase.py   # Database verification
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Global styles
│   │   ├── components/
│   │   │   └── ui/          # Shadcn UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   ├── components.json      # UI components config
│   ├── package.json         # Node dependencies
│   ├── tailwind.config.js   # Tailwind CSS config
│   └── README.md           # Frontend documentation
├── tests/                   # Python test files
└── README.md               # Main documentation
```

**Note**: The project uses a modern, organized structure with separate backend and frontend directories, along with comprehensive UI components from Shadcn UI.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.11+
- MongoDB running on localhost:27017

### Installation

1. **Backend Setup**:
```bash
cd /app/backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
```

2. **Frontend Setup**:
```bash
cd /app/frontend
yarn install
yarn start
```

3. **Access the App**:
- Frontend: https://money-insight-20.preview.emergentagent.com
- Backend API: https://money-insight-20.preview.emergentagent.com/api

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to existing account

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create new account
- `DELETE /api/accounts/{id}` - Delete account

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add new transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

### AI Insights
- `GET /api/insights/prediction` - Get expense prediction for next month
- `GET /api/insights/tips` - Get personalized financial tips
- `GET /api/insights/score` - Get financial health score
- `GET /api/dashboard/summary` - Get complete dashboard data

## 🤖 AI Model Details

### Expense Prediction Model
- **Algorithm**: Simple Linear Regression
- **Input**: Historical monthly expense data
- **Output**: 
  - Predicted amount for next month
  - Confidence level (low/medium/high)
  - Trend direction (increasing/decreasing/stable)
  - Historical average

### Financial Tips Generation
Analyzes spending patterns to provide:
- Category-wise spending alerts
- Savings rate recommendations
- Trend-based advice
- General financial wellness tips

### Financial Score Calculation
Factors considered:
- Savings rate (up to 30 points)
- Transaction consistency (up to 10 points)
- Account balance health (up to 10 points)
- Base score: 50 points

## 🎨 Design Features

### Light Theme
- Clean white backgrounds
- Soft shadows
- Emerald green accents
- High contrast for readability

### Dark Theme
- Navy blue dark backgrounds
- Reduced eye strain
- Consistent color accents
- Professional appearance

### Responsive Design
- Mobile-first approach
- Collapsible sidebar
- Touch-friendly UI elements
- Optimized for all screen sizes

## 🔒 Security Features

- Password hashing with Bcrypt
- JWT token-based authentication
- 7-day token expiration
- Protected API routes
- CORS configuration

## ✅ Features Verified

All features have been tested and verified:
- ✅ User signup and login
- ✅ Account creation and management
- ✅ Transaction CRUD operations
- ✅ Quick add FAB functionality
- ✅ AI prediction accuracy
- ✅ Financial tips generation
- ✅ Goal tracking
- ✅ Theme toggle (light/dark)
- ✅ Charts and visualizations
- ✅ Responsive design

## 📝 Usage Example

1. **Sign Up**: Create account with email/password
2. **Add Account**: Create "Main Savings" with ₹50,000
3. **Add Transactions**: 
   - Income: Salary - ₹25,000
   - Expense: Groceries - ₹1,500
4. **View Dashboard**: See financial overview with charts
5. **Check AI Insights**: Get predictions and tips
6. **Set Goals**: Create and track savings goals
7. **Toggle Theme**: Switch between light/dark modes

## 🎓 Project Highlights

This project demonstrates:
- Full-stack web development
- RESTful API design
- Database modeling with MongoDB
- AI/ML integration (regression model)
- Modern UI/UX design principles
- Responsive web development
- State management in React
- Asynchronous programming

## 📄 License

Educational project for B.Tech 3rd Year

## 👨‍💻 Built With

Emergent AI Code Generation Platform

---

**Live Demo**: https://money-insight-20.preview.emergentagent.com
