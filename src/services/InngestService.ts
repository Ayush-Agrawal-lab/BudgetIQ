import { Inngest } from 'inngest';
import { createClient } from '../lib/supabase/client';
import type { Tables } from '../lib/supabase/client';

export const inngest = new Inngest({ 
  id: 'budgetiq',
  name: 'BudgetIQ Automation',
  eventKey: process.env.INNGEST_EVENT_KEY
});

// Event types for better type safety
type RecurringTransactionEvent = {
  name: 'recurring.transaction.process';
  data: {
    userId: string;
    recurringTransactionId: string;
  };
};

type BalanceUpdateEvent = {
  name: 'account.balance.daily-update';
  data: {
    userId: string;
    accountId: string;
  };
};

export const processRecurringTransactions = inngest.createFunction(
  { 
    id: 'process-recurring-transactions',
    name: 'Process Recurring Transactions'
  },
  { event: 'recurring.transaction.process' },
  async ({ event, step }) => {
    const { userId, recurringTransactionId } = event.data as RecurringTransactionEvent['data'];

    const recurringTx = await step.run('Fetch recurring transaction', async () => {
      const supabase = createClient();
      const { data: txData, error } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('recurring_id', recurringTransactionId)
        .single();

      if (error) throw error;
      if (!txData) throw new Error('Recurring transaction not found');
      return txData as Tables['recurring_transactions']['Row'];
    });

    await step.run('Create transaction', async () => {
      const supabase = createClient();
      
      const newTransaction: Tables['transactions']['Insert'] = {
        user_id: userId,
        account_id: recurringTx.account_id,
        category_id: recurringTx.category_id,
        amount: recurringTx.amount,
        type: recurringTx.type,
        description: recurringTx.description,
        transaction_date: new Date().toISOString(),
        is_recurring: true,
        recurring_id: recurringTransactionId,
        status: 'completed'
      };

      const { error } = await supabase
        .from('transactions')
        .insert([newTransaction]);

      if (error) throw error;
    });

    await step.run('Update next due date', async () => {
      const nextDueDate = calculateNextDueDate(recurringTx.frequency, recurringTx.next_due_date);
      const supabase = createClient();
      
      const updateData: Tables['recurring_transactions']['Update'] = {
        last_generated_date: new Date().toISOString(),
        next_due_date: nextDueDate
      };

      const { error } = await supabase
        .from('recurring_transactions')
        .update([updateData])
        .eq('recurring_id', recurringTransactionId);

      if (error) throw error;
    });

    return { success: true };
  }
);

export const updateDailyBalances = inngest.createFunction(
  { 
    id: 'update-daily-balances',
    name: 'Update Daily Account Balances'
  },
  { event: 'account.balance.daily-update' },
  async ({ event, step }) => {
    const { userId, accountId } = event.data as BalanceUpdateEvent['data'];

    const newBalance = await step.run('Calculate balance', async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('get_account_balance', {
        account_id: accountId
      });

      if (error) throw error;
      return Number(data?.balance ?? 0);
    });

    await step.run('Update balance', async () => {
      const supabase = createClient();
      
      const updateData: Tables['accounts']['Update'] = {
        balance: newBalance,
        last_sync_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('accounts')
        .update([updateData])
        .eq('id', accountId);

      if (error) throw error;
    });

    return { success: true, newBalance };
  }
);

function calculateNextDueDate(frequency: 'daily' | 'weekly' | 'monthly' | 'yearly', currentDueDate: string): string {
  const date = new Date(currentDueDate);
  
  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  
  return date.toISOString();
}
