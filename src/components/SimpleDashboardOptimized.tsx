import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DonutChartEnhanced } from './DonutChartEnhanced';
import { FinancialOverviewChartEnhanced } from './FinancialOverviewChartEnhanced';
import { getCategoryColors, getFinancialColors } from './ChartColors';
import { CurrencySelector, formatUSD, formatInCurrency } from './CurrencySelector';
import { useCurrency } from './CurrencyContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Eye,
  Plus,
  Brain,
  Target,
  PieChart,
  Sparkles,
  Activity
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart
} from 'recharts';

export function SimpleDashboard() {
  const { selectedCurrency, currencyData, setSelectedCurrency, setCurrencyData } = useCurrency();

  // Sample data - Base amounts in USD for consistent conversion
  const financialData = useMemo(() => {
    const balanceUSD = 31;
    const totalIncomeUSD = 78;
    const totalExpenseUSD = 47;
    const savingsUSD = totalIncomeUSD - totalExpenseUSD;
    const savingsRate = ((savingsUSD / totalIncomeUSD) * 100).toFixed(1);

    return {
      balance: balanceUSD,
      income: totalIncomeUSD,
      expenses: totalExpenseUSD,
      savings: savingsUSD,
      savingsRate: parseFloat(savingsRate)
    };
  }, []);

  const categoryData = useMemo(() => {
    const categoryColors = getCategoryColors();
    return [
      { name: 'Food & Dining', value: 35, amount: 14, color: categoryColors[0] },
      { name: 'Transportation', value: 25, amount: 10, color: categoryColors[1] },
      { name: 'Entertainment', value: 20, amount: 8, color: categoryColors[2] },
      { name: 'Education', value: 15, amount: 6, color: categoryColors[3] },
      { name: 'Others', value: 5, amount: 2, color: categoryColors[4] },
    ];
  }, []);

  const monthlyData = useMemo(() => [
    { month: 'Oct', income: 70, expense: 51 },
    { month: 'Nov', income: 75, expense: 46 },
    { month: 'Dec', income: 82, expense: 49 },
    { month: 'Jan', income: 78, expense: 47 },
  ], []);

  const handleCurrencyChange = useCallback((currency: { code: string; symbol: string; name: string; rate: number }) => {
    setSelectedCurrency(currency.code);
    setCurrencyData(currency);
  }, [setSelectedCurrency, setCurrencyData]);

  const handleCategoryClick = useCallback((category: string, customName?: string) => {
    if (customName) {
      console.log(`Custom category added: ${customName} under Others`);
    }
    console.log(`Category clicked: ${category}`);
  }, []);

  const quickStats = useMemo(() => [
    {
      title: "Monthly Income",
      value: selectedCurrency === 'USD' ? formatUSD(financialData.income) : formatInCurrency(financialData.income, selectedCurrency),
      valueUSD: formatUSD(financialData.income),
      change: "+8.2%",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "from-success/10 via-card to-card border-success/20"
    },
    {
      title: "Monthly Expenses", 
      value: selectedCurrency === 'USD' ? formatUSD(financialData.expenses) : formatInCurrency(financialData.expenses, selectedCurrency),
      valueUSD: formatUSD(financialData.expenses),
      change: "-3.1%",
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "from-destructive/10 via-card to-card border-destructive/20"
    },
    {
      title: "Monthly Savings",
      value: selectedCurrency === 'USD' ? formatUSD(financialData.savings) : formatInCurrency(financialData.savings, selectedCurrency),
      valueUSD: formatUSD(financialData.savings),
      change: `${financialData.savingsRate}%`,
      icon: Target,
      color: "text-primary",
      bgColor: "from-primary/10 via-card to-card border-primary/20"
    }
  ], [selectedCurrency, financialData]);

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Welcome Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Welcome to BudgetIQ
          </h1>
          <p className="text-muted-foreground mt-1">
            Your intelligent financial dashboard for January 2024
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Active
          </Badge>
          <CurrencySelector 
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={stat.title} className={`h-full bg-gradient-to-br ${stat.bgColor} hover:shadow-lg transition-shadow duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  {selectedCurrency !== 'USD' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈ {stat.valueUSD}
                    </p>
                  )}
                  <p className={`text-xs ${stat.color}/80 mt-1`}>
                    {stat.change}
                  </p>
                </div>
                <div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview Donut Chart */}
        <Card className="bg-gradient-to-br from-card via-card to-muted/20 border-primary/10 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              Financial Overview
            </CardTitle>
            <CardDescription>Income vs Expenses distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialOverviewChartEnhanced 
              data={financialData} 
              currencySymbol={selectedCurrency === 'USD' ? '$' : currencyData.symbol}
              selectedCurrency={selectedCurrency}
            />
          </CardContent>
        </Card>

        {/* Spending Breakdown */}
        <Card className="bg-gradient-to-br from-card via-card to-muted/20 border-primary/10 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              Spending Breakdown
            </CardTitle>
            <CardDescription>Click on "Others" to specify custom categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="h-64">
                <DonutChartEnhanced 
                  data={categoryData}
                  centerText="Total Spent"
                  centerValue={selectedCurrency === 'USD' ? formatUSD(financialData.expenses) : formatInCurrency(financialData.expenses, selectedCurrency)}
                  onCategoryClick={handleCategoryClick}
                  size="medium"
                  selectedCurrency={selectedCurrency}
                />
              </div>
              <div className="space-y-3">
                {categoryData.map((category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {selectedCurrency === 'USD' ? formatUSD(category.amount) : formatInCurrency(category.amount, selectedCurrency)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">({category.value}%)</span>
                      {selectedCurrency !== 'USD' && (
                        <div className="text-xs text-muted-foreground">≈ {formatUSD(category.amount)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="bg-gradient-to-br from-card via-card to-muted/20 border-success/10 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-success" />
            Financial Trend
          </CardTitle>
          <CardDescription>Income vs Expenses flow over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getFinancialColors().income} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={getFinancialColors().income} stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getFinancialColors().expenses} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={getFinancialColors().expenses} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                className="text-muted-foreground"
              />
              <YAxis hide />
              <Tooltip 
                formatter={(value, name) => [formatUSD(Number(value)), name === 'income' ? 'Income' : 'Expense']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke={getFinancialColors().income}
                strokeWidth={2}
                fill="url(#incomeGradient)"
                name="income"
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke={getFinancialColors().expenses}
                strokeWidth={2}
                fill="url(#expenseGradient)"
                name="expense"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button className="transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
        <Button variant="outline" className="transition-all duration-200">
          <Eye className="h-4 w-4 mr-2" />
          View All Transactions
        </Button>
        <Button variant="outline" className="transition-all duration-200">
          <Brain className="h-4 w-4 mr-2" />
          AI Insights
        </Button>
      </div>
    </div>
  );
}