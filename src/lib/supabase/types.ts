export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          account_id: string
          user_id: string
          account_name: string
          account_type: 'checking' | 'savings' | 'credit_card' | 'investment'
          balance: number
          currency: string
          is_active: boolean
          created_at: string
          updated_at: string
          last_sync_at?: string | null
          account_number?: string | null
          institution_name?: string | null
        }
        Insert: {
          account_id?: string
          user_id: string
          account_name: string
          account_type: 'checking' | 'savings' | 'credit_card' | 'investment'
          balance: number
          currency: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_sync_at?: string | null
          account_number?: string | null
          institution_name?: string | null
        }
        Update: {
          account_id?: string
          user_id?: string
          account_name?: string
          account_type?: 'checking' | 'savings' | 'credit_card' | 'investment'
          balance?: number
          currency?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_sync_at?: string | null
          account_number?: string | null
          institution_name?: string | null
        }
      }
      transactions: {
        Row: {
          transaction_id: string
          user_id: string
          account_id: string
          category_id: string | null
          amount: number
          type: 'income' | 'expense' | 'transfer'
          description: string | null
          transaction_date: string
          created_at: string
          updated_at: string
          is_recurring: boolean
          recurring_id: string | null
          status: 'pending' | 'completed' | 'failed'
          payment_method: string | null
          location: string | null
          notes: string | null
          tags: string[] | null
        }
        Insert: {
          transaction_id?: string
          user_id: string
          account_id: string
          category_id?: string | null
          amount: number
          type: 'income' | 'expense' | 'transfer'
          description?: string | null
          transaction_date: string
          created_at?: string
          updated_at?: string
          is_recurring?: boolean
          recurring_id?: string | null
          status?: 'pending' | 'completed' | 'failed'
          payment_method?: string | null
          location?: string | null
          notes?: string | null
          tags?: string[] | null
        }
        Update: {
          transaction_id?: string
          user_id?: string
          account_id?: string
          category_id?: string | null
          amount?: number
          type?: 'income' | 'expense' | 'transfer'
          description?: string | null
          transaction_date?: string
          created_at?: string
          updated_at?: string
          is_recurring?: boolean
          recurring_id?: string | null
          status?: 'pending' | 'completed' | 'failed'
          payment_method?: string | null
          location?: string | null
          notes?: string | null
          tags?: string[] | null
        }
      }
      recurring_transactions: {
        Row: {
          recurring_id: string
          user_id: string
          account_id: string
          category_id: string | null
          amount: number
          type: 'income' | 'expense' | 'transfer'
          description: string | null
          frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
          start_date: string
          end_date: string | null
          last_generated_date: string | null
          next_due_date: string
          is_active: boolean
        }
        Insert: {
          recurring_id?: string
          user_id: string
          account_id: string
          category_id?: string | null
          amount: number
          type: 'income' | 'expense' | 'transfer'
          description?: string | null
          frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
          start_date: string
          end_date?: string | null
          last_generated_date?: string | null
          next_due_date: string
          is_active?: boolean
        }
        Update: {
          recurring_id?: string
          user_id?: string
          account_id?: string
          category_id?: string | null
          amount?: number
          type?: 'income' | 'expense' | 'transfer'
          description?: string | null
          frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'
          start_date?: string
          end_date?: string | null
          last_generated_date?: string | null
          next_due_date?: string
          is_active?: boolean
        }
      }
      categories: {
        Row: {
          category_id: string
          user_id: string | null
          name: string
          type: 'income' | 'expense'
          icon: string | null
          color: string | null
          is_default: boolean
          parent_category_id: string | null
          created_at: string
        }
        Insert: {
          category_id?: string
          user_id?: string | null
          name: string
          type: 'income' | 'expense'
          icon?: string | null
          color?: string | null
          is_default?: boolean
          parent_category_id?: string | null
          created_at?: string
        }
        Update: {
          category_id?: string
          user_id?: string | null
          name?: string
          type?: 'income' | 'expense'
          icon?: string | null
          color?: string | null
          is_default?: boolean
          parent_category_id?: string | null
          created_at?: string
        }
      }
      budgets: {
        Row: {
          budget_id: string
          user_id: string
          category_id: string | null
          amount: number
          period: 'monthly' | 'yearly'
          start_date: string
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          budget_id?: string
          user_id: string
          category_id?: string | null
          amount: number
          period: 'monthly' | 'yearly'
          start_date: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          budget_id?: string
          user_id?: string
          category_id?: string | null
          amount?: number
          period?: 'monthly' | 'yearly'
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      monthly_spending_by_category: {
        Row: {
          user_id: string
          category_id: string
          month: string
          total_amount: number
        }
      }
    }
    Functions: {
      get_account_balance: {
        Args: {
          account_id: string
        }
        Returns: number
      }
    }
    Enums: {
      account_type: 'checking' | 'savings' | 'credit_card' | 'investment'
      transaction_type: 'income' | 'expense' | 'transfer'
      transaction_status: 'pending' | 'completed' | 'failed'
      budget_period: 'monthly' | 'yearly'
    }
  }
}