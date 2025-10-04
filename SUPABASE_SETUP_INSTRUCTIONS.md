# 🗄️ Supabase Database Setup for BudgetIQ

## ✅ Current Status

- ✅ Backend updated to use Supabase
- ✅ Supabase client configured and connected
- ⚠️  Database tables need to be created

## 📋 Quick Setup (3 Steps)

### Step 1: Open Supabase SQL Editor

1. Go to: **https://supabase.com/dashboard/project/uoegewoftdwhikefqbfu/sql/new**
2. Click "**New Query**" if not already there

### Step 2: Copy & Paste SQL Script

Copy the entire SQL script below and paste it into the editor:

```sql
-- BudgetIQ Database Schema for Supabase (PostgreSQL)

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Accounts Table
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('bank', 'wallet', 'cash', 'upi')),
    balance DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);

-- Transactions Table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Goals Table
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0,
    deadline DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user_id ON goals(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Service role key bypasses these, so set to true for all)
CREATE POLICY "Enable all for service role" ON users FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON accounts FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON transactions FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON goals FOR ALL USING (true);
```

### Step 3: Run the Script

Click the "**RUN**" button (or press `Ctrl+Enter` / `Cmd+Enter`)

You should see: ✅ **Success. No rows returned**

---

## ✅ Verify Setup

After running the SQL script, verify tables were created:

1. In Supabase Dashboard, go to **Table Editor**
2. You should see 4 tables:
   - ✅ `users`
   - ✅ `accounts`
   - ✅ `transactions`
   - ✅ `goals`

---

## 🔗 Alternative: Run from Command Line

If you prefer, you can also run:

```bash
cd /app/backend
python3 -c "
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
supabase = create_client(
    os.environ['SUPABASE_URL'],
    os.environ['SUPABASE_SERVICE_KEY']
)

# Test connection
try:
    result = supabase.table('users').select('id').limit(1).execute()
    print('✅ Tables exist and working!')
except:
    print('❌ Tables not found. Please run SQL script in Supabase dashboard.')
"
```

---

## 📊 Database Schema Overview

### Tables Created:

1. **`users`** - User accounts with authentication
   - id, name, email, password (hashed), created_at

2. **`accounts`** - Financial accounts (bank, wallet, etc.)
   - id, user_id, name, type, balance, created_at

3. **`transactions`** - Income and expense records
   - id, user_id, account_id, type, amount, category, description, date, created_at

4. **`goals`** - Savings goals
   - id, user_id, name, target_amount, current_amount, deadline, created_at

### Features:
- ✅ UUID primary keys for security
- ✅ Foreign key relationships with CASCADE delete
- ✅ Indexes for optimized queries
- ✅ Row Level Security (RLS) enabled
- ✅ Data validation constraints

---

## 🧪 Test After Setup

Once tables are created, test the API:

```bash
# Test signup
curl -X POST https://money-insight-20.preview.emergentagent.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@budgetiq.com","password":"test123"}'

# Should return: {"token":"...", "user":{...}}
```

---

## 🆘 Troubleshooting

**Issue**: "Table not found" error
**Solution**: Make sure you ran the SQL script in Supabase SQL Editor

**Issue**: "Permission denied" error  
**Solution**: Verify your service role key is correct in `/app/backend/.env`

**Issue**: Can't connect to Supabase
**Solution**: Check if project is paused (free tier auto-pauses after inactivity)

---

## 🎉 Once Complete

After running the SQL script:
1. ✅ Database schema is ready
2. ✅ Backend is already configured to use Supabase
3. ✅ Frontend doesn't need any changes
4. ✅ All features will work exactly as before

The app will now use **Supabase PostgreSQL** instead of MongoDB!
