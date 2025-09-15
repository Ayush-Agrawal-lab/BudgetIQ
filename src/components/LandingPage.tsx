import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Brain, 
  Shield, 
  Smartphone,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle,
  Plus,
  History,
  Wallet
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Plus,
      title: 'Easy Transaction Entry',
      description: 'Quick and simple way to add income and expenses with smart categorization'
    },
    {
      icon: History,
      title: 'Transaction History',
      description: 'View, search, and filter all your transactions in one place'
    },
    {
      icon: Wallet,
      title: 'Multiple Accounts',
      description: 'Track cash, bank accounts, digital wallets, and credit cards'
    },
    {
      icon: Brain,
      title: 'AI Insights',
      description: 'Smart spending predictions and personalized financial recommendations'
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Beautiful charts and graphs to understand your spending patterns'
    },
    {
      icon: Smartphone,
      title: 'Responsive Design',
      description: 'Works perfectly on mobile, tablet, and desktop devices'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <span className="text-xl font-bold text-foreground">BudgetIQ</span>
              <p className="text-xs text-muted-foreground">Smart Budget Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => onNavigate('auth')}>
              Sign In
            </Button>
            <Button onClick={() => onNavigate('auth')}>
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered Financial Intelligence
          </Badge>
          
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Budget Smart, Live
            <span className="text-primary"> Better</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Master your finances with BudgetIQ's intelligent budget management. 
            AI-powered insights, beautiful visualizations, and smart categorization 
            to help you achieve your financial goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => onNavigate('auth')} className="bg-primary hover:bg-primary/90">
              Start Your Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Explore Features
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Intelligent Features for Modern Finance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience next-generation financial management with AI-driven insights and intuitive design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1), duration: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105 border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="p-2 bg-primary/10 rounded-lg mr-3"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Why Choose BudgetIQ?
              </h2>
              <div className="space-y-4">
                {[
                  'AI-powered expense predictions and insights',
                  'Beautiful, intuitive dark-themed interface',
                  'Multiple account tracking and management',
                  'Interactive charts and visualizations',
                  'Smart categorization and budgeting',
                  'Responsive design for all devices'
                ].map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                  >
                    <CheckCircle className="h-5 w-5 text-success mr-3" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="relative"
            >
              <Card className="p-8 bg-card shadow-xl border-primary/20">
                <div className="text-center">
                  <motion.div 
                    className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Brain className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">AI-Powered Intelligence</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced machine learning algorithms analyze your spending patterns to provide intelligent insights and predictions.
                  </p>
                  <Badge className="bg-success/20 text-success border-success/30">
                    87% Prediction Accuracy
                  </Badge>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start tracking your expenses today and discover insights about your spending habits with our AI-powered platform.
          </p>
          
          <Button size="lg" onClick={() => onNavigate('auth')} className="bg-primary hover:bg-primary/90">
            Get Started for Free
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Perfect for students • Built with modern tech
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <span className="font-semibold text-foreground">BudgetIQ</span>
                <p className="text-xs text-muted-foreground">BTech College Project</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with React, TypeScript & AI
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}