import { v4 as uuidv4 } from 'uuid';
import { createClient } from '../lib/supabase/client';
import type { Database } from '../lib/supabase/types';

type Account = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

export class AccountService {
  async createAccount(userId: string, accountData: Omit<AccountInsert, 'user_id' | 'account_id'>): Promise<Account> {
    try {
      const account: AccountInsert = {
        account_id: uuidv4(),
        user_id: userId,
        ...accountData,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await createClient()
        .from('accounts')
        .insert(account)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  async getAccountById(userId: string, accountId: string): Promise<Account | null> {
    try {
      const { data, error } = await createClient()
        .from('accounts')
        .select()
        .eq('account_id', accountId)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
  }

  async getUserAccounts(userId: string): Promise<Account[]> {
    try {
      const { data, error } = await createClient()
        .from('accounts')
        .select()
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user accounts:', error);
      throw error;
    }
  }

  async updateAccount(userId: string, accountId: string, updateData: AccountUpdate): Promise<Account> {
    try {
      const updates: AccountUpdate = {
        ...updateData,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await createClient()
        .from('accounts')
        .update(updates)
        .eq('account_id', accountId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  async deleteAccount(userId: string, accountId: string): Promise<void> {
    try {
      const { error } = await createClient()
        .from('accounts')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('account_id', accountId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  async getAccountBalance(accountId: string): Promise<number> {
    try {
      const { data, error } = await createClient()
        .rpc('get_account_balance', { account_id: accountId });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting account balance:', error);
      throw error;
    }
  }
}