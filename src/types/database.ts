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
          id: string
          user_id: string
          name: string
          balance: number
          currency: string
          type: string
          last_sync_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['accounts']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['accounts']['Insert']>
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          category_id: string | null
          amount: number
          type: 'income' | 'expense' | 'transfer'
          description: string
          transaction_date: string
          is_recurring: boolean
          recurring_id: string | null
          status: 'pending' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      recurring_transactions: {
        Row: {
          recurring_id: string
          user_id: string
          account_id: string
          category_id: string | null
          amount: number
          type: 'income' | 'expense'
          description: string
          frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
          start_date: string
          next_due_date: string
          last_generated_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['recurring_transactions']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['recurring_transactions']['Insert']>
      }
    }
    Functions: {
      get_account_balance: {
        Args: {
          account_id: string
        }
        Returns: {
          balance: number
        }
      }
    }
    Enums: {
      transaction_type: 'income' | 'expense' | 'transfer'
      transaction_status: 'pending' | 'completed' | 'cancelled'
      recurring_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    }
  }
}
