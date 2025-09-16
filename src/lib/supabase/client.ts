import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Basic tables
export type Tables = {
  transactions: {
    Row: {
      id: string;
      user_id: string;
      account_id: string;
      category_id: string | null;
      amount: number;
      type: 'income' | 'expense' | 'transfer';
      description: string;
      transaction_date: string;
      is_recurring: boolean;
      recurring_id: string | null;
      status: 'pending' | 'completed' | 'cancelled';
      created_at: string;
      updated_at: string;
    };
    Insert: Omit<Tables['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Tables['transactions']['Insert']>;
  };
  recurring_transactions: {
    Row: {
      recurring_id: string;
      user_id: string;
      account_id: string;
      category_id: string | null;
      amount: number;
      type: 'income' | 'expense';
      description: string;
      frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
      start_date: string;
      next_due_date: string;
      last_generated_date: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: Omit<Tables['recurring_transactions']['Row'], 'created_at' | 'updated_at'>;
    Update: Partial<Tables['recurring_transactions']['Insert']>;
  };
  accounts: {
    Row: {
      id: string;
      user_id: string;
      name: string;
      balance: number;
      currency: string;
      type: string;
      last_sync_at: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: Omit<Tables['accounts']['Row'], 'created_at' | 'updated_at'>;
    Update: Partial<Tables['accounts']['Insert']>;
  };
};

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export type SupabaseClient = ReturnType<typeof createClient>;
