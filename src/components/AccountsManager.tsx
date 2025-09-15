import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CurrencySelector, formatUSD, formatInCurrency } from './CurrencySelector';
import { useCurrency } from './CurrencyContext';
import { 
  Wallet,
  Plus,
  CreditCard,
  Building2,
  Smartphone,
  PiggyBank,
  Eye,
  EyeOff,
  Edit,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

export function AccountsManager() {
  const [showBalances, setShowBalances] = useState(true);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const { selectedCurrency, currencyData, setSelectedCurrency, setCurrencyData } = useCurrency();
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: '',
    balance: '',
    description: ''
  });

  // Mock account data - amounts stored in USD
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: 'Main Bank Account',
      type: 'bank',
      balance: 189.76, // $189.76 USD (originally ₹15750)
      description: 'Primary savings account',
      icon: Building2,
      color: 'blue'
    },
    {
      id: 2,
      name: 'Cash Wallet',
      type: 'cash',
      balance: 30.12, // $30.12 USD (originally ₹2500)
      description: 'Physical cash on hand',
      icon: Wallet,
      color: 'green'
    },
    {
      id: 3,
      name: 'UPI Wallet',
      type: 'digital',
      balance: 10.24, // $10.24 USD (originally ₹850)
      description: 'PhonePe/GPay balance',
      icon: Smartphone,
      color: 'purple'
    },
    {
      id: 4,
      name: 'Credit Card',
      type: 'credit',
      balance: -15.06, // -$15.06 USD (originally -₹1250)
      description: 'HDFC Credit Card',
      icon: CreditCard,
      color: 'red'
    }
  ]);

  const accountTypes = [
    { value: 'bank', label: 'Bank Account', icon: Building2 },
    { value: 'cash', label: 'Cash', icon: Wallet },
    { value: 'digital', label: 'Digital Wallet', icon: Smartphone },
    { value: 'credit', label: 'Credit Card', icon: CreditCard },
    { value: 'savings', label: 'Savings', icon: PiggyBank }
  ];

  const totalAssets = accounts.filter(acc => acc.balance > 0).reduce((sum, acc) => sum + acc.balance, 0);
  const totalDebt = Math.abs(accounts.filter(acc => acc.balance < 0).reduce((sum, acc) => sum + acc.balance, 0));
  const netWorth = totalAssets - totalDebt;

  const handleCurrencyChange = (currency: { code: string; symbol: string; name: string; rate: number }) => {
    setSelectedCurrency(currency.code);
    setCurrencyData(currency);
  };

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.type || !newAccount.balance) {
      alert('Please fill all required fields');
      return;
    }

    const accountType = accountTypes.find(type => type.value === newAccount.type);
    const account = {
      id: accounts.length + 1,
      name: newAccount.name,
      type: newAccount.type,
      balance: parseFloat(newAccount.balance),
      description: newAccount.description,
      icon: accountType?.icon || Wallet,
      color: ['blue', 'green', 'purple', 'red', 'yellow'][accounts.length % 5]
    };

    setAccounts([...accounts, account]);
    setNewAccount({ name: '', type: '', balance: '', description: '' });
    setIsAddingAccount(false);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-primary/20 text-primary',
      green: 'bg-success/20 text-success',
      purple: 'bg-chart-4/20 text-chart-4',
      red: 'bg-destructive/20 text-destructive',
      yellow: 'bg-warning/20 text-warning'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Account Manager</h1>
          <p className="text-muted-foreground mt-1">Manage your accounts and balances</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={() => setShowBalances(!showBalances)} variant="outline">
            {showBalances ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showBalances ? 'Hide' : 'Show'} Balances
          </Button>
          <CurrencySelector 
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold text-success">
                  {showBalances ? (
                    selectedCurrency === 'USD' 
                      ? formatUSD(totalAssets) 
                      : formatInCurrency(totalAssets, selectedCurrency)
                  ) : '••••••'}
                </p>
                {showBalances && selectedCurrency !== 'USD' && (
                  <p className="text-xs text-muted-foreground">≈ {formatUSD(totalAssets)}</p>
                )}
              </div>
              <Building2 className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Debt</p>
                <p className="text-2xl font-bold text-destructive">
                  {showBalances ? (
                    selectedCurrency === 'USD' 
                      ? formatUSD(totalDebt) 
                      : formatInCurrency(totalDebt, selectedCurrency)
                  ) : '••••••'}
                </p>
                {showBalances && selectedCurrency !== 'USD' && (
                  <p className="text-xs text-muted-foreground">≈ {formatUSD(totalDebt)}</p>
                )}
              </div>
              <CreditCard className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Worth</p>
                <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {showBalances ? (
                    selectedCurrency === 'USD' 
                      ? formatUSD(netWorth) 
                      : formatInCurrency(netWorth, selectedCurrency)
                  ) : '••••••'}
                </p>
                {showBalances && selectedCurrency !== 'USD' && (
                  <p className="text-xs text-muted-foreground">≈ {formatUSD(netWorth)}</p>
                )}
              </div>
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Your Accounts
              </CardTitle>
              <CardDescription>All your financial accounts in one place</CardDescription>
            </div>
            <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Account</DialogTitle>
                  <DialogDescription>
                    Add a new account to track your finances
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="account-name">Account Name *</Label>
                    <Input
                      id="account-name"
                      placeholder="e.g., Main Bank Account"
                      value={newAccount.name}
                      onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>Account Type *</Label>
                    <Select value={newAccount.type} onValueChange={(value) => setNewAccount({...newAccount, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center">
                              <type.icon className="h-4 w-4 mr-2" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="account-balance">Current Balance * (USD)</Label>
                    <Input
                      id="account-balance"
                      type="number"
                      placeholder="0.00"
                      value={newAccount.balance}
                      onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="account-description">Description (Optional)</Label>
                    <Input
                      id="account-description"
                      placeholder="Additional details about this account"
                      value={newAccount.description}
                      onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddAccount} className="flex-1">
                      Add Account
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingAccount(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${getColorClasses(account.color)}`}>
                      <account.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">{account.name}</h3>
                      <p className="text-sm text-muted-foreground">{account.description}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {accountTypes.find(type => type.value === account.type)?.label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        account.balance >= 0 ? 'text-foreground' : 'text-red-600'
                      }`}>
                        {showBalances ? (
                          selectedCurrency === 'USD' 
                            ? formatUSD(Math.abs(account.balance)) 
                            : formatInCurrency(Math.abs(account.balance), selectedCurrency)
                        ) : (
                          '••••••'
                        )}
                      </p>
                      {showBalances && selectedCurrency !== 'USD' && (
                        <p className="text-xs text-muted-foreground">
                          ≈ {formatUSD(Math.abs(account.balance))}
                        </p>
                      )}
                      {account.balance < 0 && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          Debt
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}