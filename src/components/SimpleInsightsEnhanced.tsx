import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CurrencySelector, convertToUSD, formatUSD, formatInCurrency } from './CurrencySelector';
import { useCurrency } from './CurrencyContext';
import { getCategoryColors, getFinancialColors } from './ChartColors';
import { 
  Brain,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Target,
  Lightbulb,
  Trophy,
  Calendar,
  Sparkles,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

export function SimpleInsightsEnhanced() {
  const { selectedCurrency, currencyData, setSelectedCurrency, setCurrencyData } = useCurrency();

  const handleCurrencyChange = useCallback((currency: { code: string; symbol: string; name: string; rate: number }) => {
    setSelectedCurrency(currency.code);
    setCurrencyData(currency);
  }, [setSelectedCurrency, setCurrencyData]);

  // Mock AI insights data - using USD base amounts
  const spendingPrediction = {
    nextMonth: 51,
    confidence: 87,
    trend: 'increasing',
    change: 8.5
  };

  const categoryInsights = [
    {
      category: 'Food & Dining',
      currentSpend: 14,
      budget: 12,
      prediction: 16,
      trend: 'over_budget',
      tip: `Try cooking at home more often to save ${formatUSD(4)}/month`
    },
    {
      category: 'Transportation',
      currentSpend: 10,
      budget: 12,
      prediction: 10,
      trend: 'under_budget',
      tip: `Great job! You saved ${formatUSD(2)} on transport this month`
    },
    {
      category: 'Entertainment',
      currentSpend: 8,
      budget: 10,
      prediction: 9,
      trend: 'on_track',
      tip: 'Your entertainment spending is well balanced'
    }
  ];

  const monthlyComparison = [
    { month: 'Oct', spending: 46, predicted: 45 },
    { month: 'Nov', spending: 49, predicted: 49 },
    { month: 'Dec', spending: 47, predicted: 48 },
    { month: 'Jan', spending: 47, predicted: 51 }
  ];

  const aiRecommendations = [
    {
      type: 'saving',
      title: 'Savings Opportunity',
      message: `You can save ${formatUSD(5)}/month by reducing food delivery orders`,
      impact: 'high',
      icon: Target
    },
    {
      type: 'alert',
      title: 'Budget Alert',
      message: 'Food expenses are 20% above your budget this month',
      impact: 'medium',
      icon: AlertCircle
    },
    {
      type: 'achievement',
      title: 'Great Job!',
      message: 'You saved 15% more than last month',
      impact: 'positive',
      icon: Trophy
    },
    {
      type: 'tip',
      title: 'Smart Tip',
      message: 'Track UPI spending more closely - it represents 40% of expenses',
      impact: 'low',
      icon: Lightbulb
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-destructive/10 border-destructive/30 text-destructive';
      case 'medium': return 'bg-warning/10 border-warning/30 text-warning';
      case 'positive': return 'bg-success/10 border-success/30 text-success';
      default: return 'bg-primary/10 border-primary/30 text-primary';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-lg p-3 shadow-xl z-50"
          style={{
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            borderColor: 'hsl(var(--border))'
          }}
        >
          <p className="font-medium text-card-foreground">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.dataKey === 'spending' ? 'Actual' : 'Predicted'}: {selectedCurrency === 'USD' 
                ? formatUSD(item.value) 
                : formatInCurrency(item.value, selectedCurrency)
              }
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Currency Selector */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-semibold text-foreground">AI Financial Insights</h1>
          <p className="text-muted-foreground mt-1">Smart analysis of your spending patterns and predictions</p>
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
              <Brain className="h-3 w-3 mr-1" />
            </motion.div>
            AI Learning
          </Badge>
          <CurrencySelector 
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>
      </motion.div>

      {/* AI Prediction Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Brain className="h-6 w-6 mr-2 text-primary" />
              </motion.div>
              AI Spending Prediction
            </CardTitle>
            <CardDescription>Machine learning analysis for next month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Predicted Spending</p>
                <motion.p 
                  className="text-3xl font-bold text-primary"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {selectedCurrency === 'USD' 
                    ? formatUSD(spendingPrediction.nextMonth) 
                    : formatInCurrency(spendingPrediction.nextMonth, selectedCurrency)
                  }
                </motion.p>
                {selectedCurrency !== 'USD' && (
                  <div className="text-sm text-muted-foreground mt-1">
                    ≈ {formatUSD(spendingPrediction.nextMonth)}
                  </div>
                )}
                <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">
                  {spendingPrediction.confidence}% Confidence
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Trend</p>
                <div className="flex items-center justify-center mt-2">
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <TrendingUp className="h-5 w-5 text-warning mr-1" />
                  </motion.div>
                  <span className="text-xl font-semibold text-warning">
                    +{spendingPrediction.change}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">vs last month</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">AI Status</p>
                <div className="flex items-center justify-center mt-2">
                  <motion.div 
                    className="w-3 h-3 bg-success rounded-full mr-2"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <span className="text-lg font-medium text-success">Active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Learning your patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-card via-card to-muted/20 border-primary/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <Target className="h-5 w-5 mr-2 text-primary" />
              </motion.div>
              Category Analysis
            </CardTitle>
            <CardDescription>AI insights for each spending category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categoryInsights.map((insight, index) => (
                <motion.div
                  key={insight.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{insight.category}</h3>
                    <Badge 
                      variant={
                        insight.trend === 'over_budget' ? 'destructive' :
                        insight.trend === 'under_budget' ? 'default' : 'secondary'
                      }
                      className={
                        insight.trend === 'over_budget' ? 'bg-destructive text-destructive-foreground' :
                        insight.trend === 'under_budget' ? 'bg-success text-success-foreground' : ''
                      }
                    >
                      {insight.trend === 'over_budget' ? 'Over Budget' :
                       insight.trend === 'under_budget' ? 'Under Budget' : 'On Track'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {selectedCurrency === 'USD' 
                        ? formatUSD(insight.currentSpend) 
                        : formatInCurrency(insight.currentSpend, selectedCurrency)
                      }</span>
                      <span>Budget: {selectedCurrency === 'USD' 
                        ? formatUSD(insight.budget) 
                        : formatInCurrency(insight.budget, selectedCurrency)
                      }</span>
                    </div>
                    <Progress 
                      value={(insight.currentSpend / insight.budget) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>AI Prediction: {selectedCurrency === 'USD' 
                        ? formatUSD(insight.prediction) 
                        : formatInCurrency(insight.prediction, selectedCurrency)
                      }</span>
                      <span>{((insight.currentSpend / insight.budget) * 100).toFixed(0)}% of budget</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg border-l-4 border-primary/50">
                    <p className="text-sm text-muted-foreground">
                      <Lightbulb className="h-4 w-4 inline mr-1 text-primary" />
                      {insight.tip}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Prediction Accuracy Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-card via-card to-muted/20 border-success/10 hover:shadow-xl hover:shadow-success/5 transition-all duration-300 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <motion.div
                animate={{ 
                  y: [0, -3, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Activity className="h-5 w-5 mr-2 text-success" />
              </motion.div>
              Prediction vs Reality
            </CardTitle>
            <CardDescription>How accurate our AI predictions have been</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyComparison} barCategoryGap={30} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getFinancialColors().expenses} stopOpacity={1}/>
                    <stop offset="95%" stopColor={getFinancialColors().expenses} stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getFinancialColors().primary} stopOpacity={1}/>
                    <stop offset="95%" stopColor={getFinancialColors().primary} stopOpacity={0.6}/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                  tickLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                  tick={{ 
                    fill: 'hsl(var(--foreground))', 
                    fontSize: 14,
                    fontWeight: 500
                  }}
                  dy={10}
                />
                <YAxis 
                  axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                  tickLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                  tick={{ 
                    fill: 'hsl(var(--foreground))', 
                    fontSize: 12,
                    fontWeight: 500
                  }}
                  tickFormatter={(value) => `${value}`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="spending" 
                  fill="url(#spendingGradient)" 
                  name="spending" 
                  radius={[6, 6, 0, 0]}
                  stroke={getFinancialColors().expenses}
                  strokeWidth={2}
                  filter="url(#glow)"
                />
                <Bar 
                  dataKey="predicted" 
                  fill="url(#predictedGradient)" 
                  name="predicted" 
                  radius={[6, 6, 0, 0]}
                  stroke={getFinancialColors().primary}
                  strokeWidth={2}
                  filter="url(#glow)"
                />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Chart Legend */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full border-2"
                  style={{ 
                    backgroundColor: getFinancialColors().expenses + '80',
                    borderColor: getFinancialColors().expenses
                  }}
                />
                <span className="text-sm font-medium text-foreground">Actual Spending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full border-2"
                  style={{ 
                    backgroundColor: getFinancialColors().primary + '80',
                    borderColor: getFinancialColors().primary
                  }}
                />
                <span className="text-sm font-medium text-foreground">AI Prediction</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-card via-card to-muted/20 border-primary/10 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Brain className="h-5 w-5 mr-2 text-primary" />
              </motion.div>
              Smart Recommendations
            </CardTitle>
            <CardDescription>Personalized tips based on your spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiRecommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`p-4 rounded-lg border-l-4 ${getImpactColor(recommendation.impact)} hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-start space-x-3">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3 + index,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <recommendation.icon className="h-5 w-5 mt-0.5" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-medium">{recommendation.title}</h4>
                      <p className="text-sm opacity-90 mt-1">{recommendation.message}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {recommendation.impact === 'high' ? 'High Impact' :
                         recommendation.impact === 'medium' ? 'Medium Impact' :
                         recommendation.impact === 'positive' ? 'Achievement' : 'Low Impact'}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Learning Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-gradient-to-br from-success/10 via-card to-card border-success/20 hover:shadow-xl hover:shadow-success/5 transition-all duration-300 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <Calendar className="h-5 w-5 mr-2 text-success" />
              </motion.div>
              AI Learning Progress
            </CardTitle>
            <CardDescription>How much data the AI has learned from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Days of Data</p>
                <motion.p 
                  className="text-2xl font-bold text-foreground"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  45
                </motion.p>
                <Progress value={75} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">75% to optimal accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Transactions Analyzed</p>
                <motion.p 
                  className="text-2xl font-bold text-foreground"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  127
                </motion.p>
                <Progress value={60} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">Good sample size</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                <motion.p 
                  className="text-2xl font-bold text-success"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  87%
                </motion.p>
                <Progress value={87} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">High accuracy achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}