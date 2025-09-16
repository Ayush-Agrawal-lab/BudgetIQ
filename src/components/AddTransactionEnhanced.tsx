import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { CurrencySelector, convertToUSD, formatUSD } from './CurrencySelector';
import { useCurrency } from './CurrencyContext';
import { 
  Plus,
  Minus,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export function AddTransactionEnhanced() {
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    category: '',
    account: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { selectedCurrency, currencyData, setSelectedCurrency, setCurrencyData } = useCurrency();

  const expenseCategories = [
    'Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 
    'Bills & Utilities', 'Education', 'Healthcare', 'Travel', 'Other'
  ];

  const incomeCategories = [
    'Salary', 'Freelance', 'Pocket Money', 'Scholarship', 'Part-time Job', 'Other'
  ];

  const accounts = [
    'Cash', 'Bank Account', 'UPI Wallet', 'Credit Card', 'Savings Account'
  ];

  const handleCurrencyChange = (currency: { code: string; symbol: string; name: string; rate: number }) => {
    setSelectedCurrency(currency.code);
    setCurrencyData(currency);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.amount || !formData.category || !formData.account) {
      alert('Please fill all required fields');
      return;
    }

    // Convert amount to USD for storage (assuming user entered in selected currency)
    const amountInUSD = convertToUSD(parseFloat(formData.amount), selectedCurrency);
    
    // Here you would typically send data to your backend
    console.log('Transaction Data:', {
      ...formData,
      amountInOriginalCurrency: formData.amount,
      originalCurrency: selectedCurrency,
      amountInUSD: amountInUSD
    });
    
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        type: '',
        amount: '',
        category: '',
        account: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div 
            className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0]
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <CheckCircle className="h-8 w-8 text-success" />
          </motion.div>
          <motion.h2 
            className="text-2xl font-semibold text-foreground mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Transaction Added!
          </motion.h2>
          <motion.p 
            className="text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your transaction has been recorded successfully.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header with Currency Selector */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Add Transaction</h1>
          <p className="text-muted-foreground mt-1">Record your income and expenses</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="h-3 w-3 mr-1" />
            </motion.div>
            Smart Entry
          </Badge>
          <CurrencySelector 
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-card via-card to-muted/20 border-primary/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
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
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
              </motion.div>
              Transaction Details
            </CardTitle>
            <CardDescription>Fill in the details of your transaction - amounts are saved in USD</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Transaction Type *</Label>
                  <div className="flex gap-2 mt-2">
                    <motion.div 
                      className="flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant={formData.type === 'income' ? 'default' : 'outline'}
                        className={`w-full transition-all duration-200 ${formData.type === 'income' ? 'bg-success hover:bg-success/90 text-success-foreground' : 'hover:bg-success/10 hover:text-success hover:border-success'}`}
                        onClick={() => setFormData({...formData, type: 'income', category: ''})}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Income
                      </Button>
                    </motion.div>
                    <motion.div 
                      className="flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant={formData.type === 'expense' ? 'default' : 'outline'}
                        className={`w-full transition-all duration-200 ${formData.type === 'expense' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'hover:bg-destructive/10 hover:text-destructive hover:border-destructive'}`}
                        onClick={() => setFormData({...formData, type: 'expense', category: ''})}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Expense
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="amount">Amount * ({currencyData.symbol})</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="mt-2"
                  />
                  {formData.amount && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈ {formatUSD(convertToUSD(parseFloat(formData.amount), selectedCurrency))} (will be saved in USD)
                    </p>
                  )}
                </div>
              </div>

              {/* Category and Account */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(value: string) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(formData.type === 'expense' ? expenseCategories : incomeCategories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Account *</Label>
                  <Select value={formData.account} onValueChange={(value: string) => setFormData({...formData, account: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account} value={account}>
                          {account}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date">Date</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="max-w-xs"
                  />
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    Transaction date helps with monthly tracking
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any notes about this transaction..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="mt-2"
                  rows={3}
                />
              </div>

              {/* Preview */}
              {formData.type && formData.amount && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-muted rounded-lg border-l-4 border-primary"
                >
                  <h3 className="font-medium mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-primary" />
                    Preview
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {formData.category || 'No category'} • {formData.account || 'No account'}
                      </p>
                      <p className="text-sm text-muted-foreground">{formData.date}</p>
                      {formData.description && (
                        <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Original: {currencyData.symbol}{formData.amount} → Stored: {formatUSD(convertToUSD(parseFloat(formData.amount), selectedCurrency))}
                      </p>
                    </div>
                    <Badge 
                      variant={formData.type === 'income' ? 'default' : 'destructive'} 
                      className={`text-lg px-3 py-1 ${formData.type === 'income' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}`}
                    >
                      {formData.type === 'income' ? '+' : '-'}{currencyData.symbol}{formData.amount}
                    </Badge>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button type="submit" className="w-full" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}