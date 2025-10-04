"""
Verify Supabase database setup for BudgetIQ
Run this after executing the SQL script in Supabase dashboard
"""

from supabase import create_client
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Connect to Supabase
supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_SERVICE_KEY']
supabase = create_client(supabase_url, supabase_key)

print("🔍 Verifying Supabase Database Setup for BudgetIQ\n")
print(f"📡 Supabase URL: {supabase_url}")
print(f"🔑 Using service role key: {supabase_key[:20]}...\n")

# Check each table
tables = ['users', 'accounts', 'transactions', 'goals']
verified_tables = []
missing_tables = []

print("📋 Checking tables...\n")

for table in tables:
    try:
        # Try to query the table
        result = supabase.table(table).select('id').limit(1).execute()
        
        # Get count
        count_result = supabase.table(table).select('id', count='exact').execute()
        count = count_result.count if hasattr(count_result, 'count') else len(count_result.data)
        
        verified_tables.append(table)
        print(f"   ✅ {table:<15} EXISTS ({count} rows)")
    except Exception as e:
        missing_tables.append(table)
        print(f"   ❌ {table:<15} NOT FOUND")

print("\n" + "="*50 + "\n")

if len(verified_tables) == 4:
    print("🎉 SUCCESS! All tables are ready!")
    print("\n✅ Your BudgetIQ database is fully set up with Supabase!")
    print("\n🚀 You can now:")
    print("   • Create user accounts")
    print("   • Add financial accounts")
    print("   • Track transactions")
    print("   • Set savings goals")
    print("   • Get AI predictions")
    print("\n🌐 Test the API at:")
    print("   https://money-insight-20.preview.emergentagent.com")
    
elif len(verified_tables) > 0:
    print(f"⚠️  PARTIAL SETUP: {len(verified_tables)}/4 tables found")
    print(f"\n✅ Working tables: {', '.join(verified_tables)}")
    print(f"❌ Missing tables: {', '.join(missing_tables)}")
    print("\n📝 Please run the SQL script again for missing tables")
    
else:
    print("❌ NO TABLES FOUND")
    print("\n📝 You need to create the database tables:")
    print("\n1. Open: https://supabase.com/dashboard/project/uoegewoftdwhikefqbfu/sql/new")
    print("2. Copy the SQL from: /app/backend/create_tables.sql")
    print("3. Paste and click RUN")
    print("\nOr follow instructions in: /app/SUPABASE_SETUP_INSTRUCTIONS.md")

print("\n" + "="*50)
