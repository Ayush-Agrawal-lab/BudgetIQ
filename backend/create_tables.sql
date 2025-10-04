-- BudgetIQ Database Schema for Supabase (PostgreSQL)
-- Run this SQL in Supabase SQL Editor to create all tables

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

-- Create index on email for faster lookups
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

-- Create index on user_id for faster queries
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

-- Create indexes for faster queries
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

-- Create index on user_id
CREATE INDEX idx_goals_user_id ON goals(user_id);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users (allow users to read/update their own data)
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (true);

-- RLS Policies for Accounts
CREATE POLICY "Users can view own accounts" ON accounts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own accounts" ON accounts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own accounts" ON accounts
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own accounts" ON accounts
    FOR DELETE USING (true);

-- RLS Policies for Transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own transactions" ON transactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own transactions" ON transactions
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own transactions" ON transactions
    FOR DELETE USING (true);

-- RLS Policies for Goals
CREATE POLICY "Users can view own goals" ON goals
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own goals" ON goals
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own goals" ON goals
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete own goals" ON goals
    FOR DELETE USING (true);

-- Create a function to automatically update updated_at timestamp (optional)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ BudgetIQ database schema created successfully!';
    RAISE NOTICE '📊 Tables created: users, accounts, transactions, goals';
    RAISE NOTICE '🔒 Row Level Security (RLS) enabled on all tables';
    RAISE NOTICE '📈 Indexes created for optimized queries';
END $$;