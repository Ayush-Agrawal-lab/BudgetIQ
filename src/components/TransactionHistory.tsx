import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CurrencySelector, convertToUSD, formatUSD, formatInCurrency } from './CurrencySelector';
import { useCurrency } from './CurrencyContext';
import { 
  History,
  Search,
  Filter,
  Calendar,
  ArrowUpDown,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const { selectedCurrency, currencyData, setSelectedCurrency, setCurrencyData } = useCurrency();

  // Mock transaction data - amounts stored in USD
  const [transactions] = useState([
    {
      id: 1,
      type: 'expense',
      amount: 3.01, // $3.01 USD (originally ₹250)
      category: 'Food & Dining',
      account: 'UPI Wallet',
      description: 'Lunch at college cafeteria',
      date: '2024-01-15',
      time: '12:30 PM'
    },
    {
      id: 2,
      type: 'income',
      amount: 60.24, // $60.24 USD (originally ₹5000)
      category: 'Pocket Money',
      account: 'Bank Account',
      description: 'Monthly allowance from parents',
      date: '2024-01-01',
      time: '9:00 AM'
    },
    {
      id: 3,
      type: 'expense',
      amount: 1.45, // $1.45 USD (originally ₹120)
      category: 'Transportation',
      account: 'Cash',
      description: 'Auto rickshaw to college',
      date: '2024-01-14',
      time: '8:15 AM'
    },
    {
      id: 4,
      type: 'expense',
      amount: 0.96, // $0.96 USD (originally ₹80)
      category: 'Education',
      account: 'UPI Wallet',
      description: 'Photocopying and stationery',
      date: '2024-01-13',
      time: '2:45 PM'
    },
    {
      id: 5,
      type: 'income',
      amount: 18.07, // $18.07 USD (originally ₹1500)
      category: 'Part-time Job',
      account: 'Bank Account',
      description: 'Tutoring payment',
      date: '2024-01-10',
      time: '6:00 PM'
    },
    {
      id: 6,
      type: 'expense',
      amount: 3.61, // $3.61 USD (originally ₹300)
      category: 'Entertainment',
      account: 'Cash',
      description: 'Movie with friends',
      date: '2024-01-08',
      time: '7:30 PM'
    }
  ]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'amount') {
      return b.amount - a.amount;
    }
    return 0;
  });

  const handleCurrencyChange = (currency: { code: string; symbol: string; name: string; rate: number }) => {
    setSelectedCurrency(currency.code);
    setCurrencyData(currency);
  };

  // Calculate totals (already in USD)
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="p-6 space-y-6">
      {/* Header with Currency Selector */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Transaction History</h1>
          <p className="text-muted-foreground mt-1">View and manage all your transactions</p>
        </div>
        <CurrencySelector 
          selectedCurrency={selectedCurrency}
          onCurrencyChange={handleCurrencyChange}
        />
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-gradient-to-br from-success/10 via-card to-card border-success/20 card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-semibold text-success">
                    {selectedCurrency === 'USD' 
                      ? formatUSD(totalIncome) 
                      : formatInCurrency(totalIncome, selectedCurrency)
                    }
                  </p>
                  {selectedCurrency !== 'USD' && (
                    <p className="text-xs text-muted-foreground">≈ {formatUSD(totalIncome)}</p>
                  )}
                </div>
                <motion.div
                  animate={{ 
                    y: [0, -3, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <TrendingUp className="h-8 w-8 text-success" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-gradient-to-br from-destructive/10 via-card to-card border-destructive/20 card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-semibold text-destructive">
                    {selectedCurrency === 'USD' 
                      ? formatUSD(totalExpense) 
                      : formatInCurrency(totalExpense, selectedCurrency)
                    }
                  </p>
                  {selectedCurrency !== 'USD' && (
                    <p className="text-xs text-muted-foreground">≈ {formatUSD(totalExpense)}</p>
                  )}
                </div>
                <motion.div
                  animate={{ 
                    y: [0, 3, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <TrendingDown className="h-8 w-8 text-destructive" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20 card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {selectedCurrency === 'USD' 
                      ? formatUSD(balance) 
                      : formatInCurrency(balance, selectedCurrency)
                    }
                  </p>
                  {selectedCurrency !== 'USD' && (
                    <p className="text-xs text-muted-foreground">≈ {formatUSD(balance)}</p>
                  )}
                </div>
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <DollarSign className="h-8 w-8 text-primary" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-card via-card to-muted/20 border-primary/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <History className="h-5 w-5 mr-2 text-primary" />
              </motion.div>
              All Transactions
            </CardTitle>
            <CardDescription>Search and filter your transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expense">Expenses Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="amount">Sort by Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              {sortedTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              ) : (
                sortedTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className={`p-2 rounded-full ${
                              transaction.type === 'income' 
                                ? 'bg-success/20 text-success' 
                                : 'bg-destructive/20 text-destructive'
                            }`}
                            whileHover={{ scale: 1.3 }}
                          >
                            {transaction.type === 'income' ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                          </motion.div>
                          <div>
                            <p className="font-medium">{transaction.category}</p>
                            <p className="text-sm text-muted-foreground">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {transaction.account} • {transaction.date} • {transaction.time}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge 
                            variant={transaction.type === 'income' ? 'default' : 'destructive'}
                            className={`text-lg px-3 py-1 ${transaction.type === 'income' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {selectedCurrency === 'USD' 
                              ? formatUSD(transaction.amount) 
                              : formatInCurrency(transaction.amount, selectedCurrency)
                            }
                          </Badge>
                          {selectedCurrency !== 'USD' && (
                            <p className="text-xs text-muted-foreground mt-1">
                              ≈ {transaction.type === 'income' ? '+' : '-'}{formatUSD(transaction.amount)}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80 hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}