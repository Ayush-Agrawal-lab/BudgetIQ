import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './services/posthog'; // Import PostHog configuration
import axios from 'axios';
import './App.css';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Sun, Moon, Plus, TrendingUp, TrendingDown, Wallet, DollarSign, PieChart, Target, Settings, LogOut, Menu, X, CreditCard, BarChart3, Sparkles, ArrowUpRight, ArrowDownRight, Home } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Configure axios defaults and interceptors
axios.defaults.baseURL = API_URL;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  });
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        }
      } catch (error) {
        // Only treat 401 as invalid credentials. Other errors (e.g. 404 when /me is missing)
        // should not immediately clear the token to avoid logging users out unexpectedly.
        const status = error.response?.status;
        if (status === 401) {
          console.error('Auth check failed (unauthorized):', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        } else {
          // Non-auth errors: log and continue. The app will still function or surface other errors.
          console.warn('Auth check encountered non-401 error, keeping token:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const handleLogin = async (token, user) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      
      // Verify the token immediately
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update user data with full profile
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={!token ? <LandingPage onThemeToggle={toggleTheme} theme={theme} /> : <Navigate to="/dashboard" />} />
          <Route path="/auth" element={!token ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={token ? <DashboardLayout token={token} user={user} onLogout={handleLogout} onThemeToggle={toggleTheme} theme={theme}><Dashboard token={token} /></DashboardLayout> : <Navigate to="/" />} />
          <Route path="/transactions" element={token ? <DashboardLayout token={token} user={user} onLogout={handleLogout} onThemeToggle={toggleTheme} theme={theme}><Transactions token={token} /></DashboardLayout> : <Navigate to="/" />} />
          <Route path="/accounts" element={token ? <DashboardLayout token={token} user={user} onLogout={handleLogout} onThemeToggle={toggleTheme} theme={theme}><Accounts token={token} /></DashboardLayout> : <Navigate to="/" />} />
          <Route path="/insights" element={token ? <DashboardLayout token={token} user={user} onLogout={handleLogout} onThemeToggle={toggleTheme} theme={theme}><Insights token={token} /></DashboardLayout> : <Navigate to="/" />} />
          <Route path="/settings" element={token ? <DashboardLayout token={token} user={user} onLogout={handleLogout} onThemeToggle={toggleTheme} theme={theme}><SettingsPage user={user} onThemeToggle={toggleTheme} theme={theme} /></DashboardLayout> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

// ==================== LANDING PAGE ====================
function LandingPage({ onThemeToggle, theme }) {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="logo">
            <Wallet className="logo-icon" />
            <span>BudgetIQ</span>
          </div>
          <div className="nav-actions">
            <Button variant="ghost" onClick={onThemeToggle} className="theme-toggle">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
            <Button onClick={() => navigate('/auth')} className="nav-login-btn">Login</Button>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-Powered Finance</span>
          </div>
          <h1 className="hero-title">Take Control of Your Money with <span className="gradient-text">AI Insights</span></h1>
          <p className="hero-subtitle">Smart budgeting, expense tracking, and AI-powered predictions to help you make better financial decisions.</p>
          <div className="hero-buttons">
            <Button size="lg" onClick={() => navigate('/auth')} className="cta-primary" data-testid="get-started-btn">
              Get Started Free
              <ArrowUpRight size={20} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="cta-secondary">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Sparkles /></div>
            <h3>AI Predictions</h3>
            <p>Get smart expense forecasts and personalized saving tips powered by machine learning.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Wallet /></div>
            <h3>Multi-Account Tracking</h3>
            <p>Manage all your accounts in one place - bank, wallet, cash, and UPI.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><BarChart3 /></div>
            <h3>Visual Insights</h3>
            <p>Beautiful charts and graphs to understand your spending patterns at a glance.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Target /></div>
            <h3>Goal Tracking</h3>
            <p>Set financial goals and track your progress with smart recommendations.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2025 BudgetIQ - B.Tech College Project</p>
      </footer>
    </div>
  );
}

// ==================== AUTH PAGE ====================
function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };
      
      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      if (!response.data.access_token) {
        throw new Error('Invalid response from server');
      }

      // If backend returns user data directly, use it. Otherwise fall back to /api/auth/me
      const returnedUser = response.data.user;
      let userProfile = returnedUser;
      if (!userProfile) {
        const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${response.data.access_token}` }
        });
        userProfile = userResponse.data;
      }

      await onLogin(response.data.access_token, userProfile);
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.detail || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">
              <Wallet size={32} />
              <span>BudgetIQ</span>
            </div>
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to your account' : 'Start your financial journey'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                  data-testid="signup-name-input"
                />
              </div>
            )}
            <div className="form-group">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-testid="auth-email-input"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                data-testid="auth-password-input"
              />
            </div>

            {error && <div className="error-message" data-testid="auth-error">{error}</div>}

            <Button type="submit" className="auth-submit-btn" disabled={loading} data-testid="auth-submit-btn">
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="auth-switch-btn" data-testid="auth-switch-btn">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD LAYOUT ====================
function DashboardLayout({ children, token, user, onLogout, onThemeToggle, theme }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verify authentication on dashboard mount
    const verifyAuth = async () => {
      try {
        if (!token) {
          navigate('/auth');
          return;
        }
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.data) {
          throw new Error('Invalid auth state');
        }
      } catch (error) {
        console.error('Dashboard auth check failed:', error);
        onLogout();
        navigate('/auth');
      }
    };
    verifyAuth();
  }, [token, navigate, onLogout]);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: CreditCard, label: 'Transactions', path: '/transactions' },
    { icon: Wallet, label: 'Accounts', path: '/accounts' },
    { icon: Sparkles, label: 'AI Insights', path: '/insights' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Wallet />
            {sidebarOpen && <span>BudgetIQ</span>}
          </div>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item ${window.location.pathname === item.path ? 'active' : ''}`}
              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={onLogout} className="nav-item logout-btn" data-testid="logout-btn">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="top-navbar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu-toggle">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="navbar-actions">
            <Button variant="ghost" onClick={onThemeToggle} className="theme-toggle">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
            <div className="user-avatar" data-testid="user-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>
        <main className="content-area">
          {children}
        </main>
      </div>

      <QuickAddFAB token={token} />
    </div>
  );
}

// ==================== DASHBOARD PAGE ====================
function Dashboard({ token }) {
  const [summary, setSummary] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [score, setScore] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for dashboard updates
    const handleUpdate = () => {
      fetchDashboardData();
    };
    window.addEventListener('dashboard-update', handleUpdate);
    
    return () => {
      window.removeEventListener('dashboard-update', handleUpdate);
    };
  }, [token]); // Add token as dependency to re-fetch when it changes

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // First fetch accounts and transactions to calculate summary
      const [accountsRes, transactionsRes] = await Promise.all([
        axios.get(`${API_URL}/api/accounts`, { headers }),
        axios.get(`${API_URL}/api/transactions`, { headers })
      ]);

      // Calculate summary from transactions
      const transactions = transactionsRes.data;
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const totalSavings = totalIncome - totalExpense;

      // Calculate monthly trend
      const monthlyTrend = calculateMonthlyTrend(transactions);

      // Calculate category breakdown
      const categoryBreakdown = calculateCategoryBreakdown(transactions);

      setSummary({
        total_income: totalIncome,
        total_expense: totalExpense,
        total_savings: totalSavings,
        monthly_trend: monthlyTrend,
        category_breakdown: categoryBreakdown
      });

      // Fetch other data
      const [predictionRes, scoreRes, goalsRes] = await Promise.all([
        axios.get(`${API_URL}/api/insights/prediction`, { headers }),
        axios.get(`${API_URL}/api/insights/score`, { headers }),
        axios.get(`${API_URL}/api/goals`, { headers }),
      ]);

      setPrediction(predictionRes.data);
      setScore(scoreRes.data.score);
      setGoals(goalsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate monthly trend
  const calculateMonthlyTrend = (transactions) => {
    const monthlyData = {};
    
    transactions.forEach(txn => {
      const month = txn.date.substring(0, 7); // Get YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (txn.type === 'income') {
        monthlyData[month].income += parseFloat(txn.amount);
      } else {
        monthlyData[month].expense += parseFloat(txn.amount);
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense
      }));
  };

  // Helper function to calculate category breakdown
  const calculateCategoryBreakdown = (transactions) => {
    const breakdown = {};
    
    transactions
      .filter(txn => txn.type === 'expense')
      .forEach(txn => {
        if (!breakdown[txn.category]) {
          breakdown[txn.category] = 0;
        }
        breakdown[txn.category] += parseFloat(txn.amount);
      });

    return breakdown;
  };

  if (loading) {
    return <div className="loading-state">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page" data-testid="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your financial overview</p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Income"
          value={`₹${summary?.total_income || 0}`}
          icon={<TrendingUp />}
          trend="positive"
          testId="stat-income"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${summary?.total_expense || 0}`}
          icon={<TrendingDown />}
          trend="negative"
          testId="stat-expense"
        />
        <StatCard
          title="Total Savings"
          value={`₹${summary?.total_savings || 0}`}
          icon={<DollarSign />}
          trend={summary?.total_savings > 0 ? 'positive' : 'negative'}
          testId="stat-savings"
        />
        <StatCard
          title="AI Prediction"
          value={`₹${prediction?.predicted_amount || 0}`}
          icon={<Sparkles />}
          subtitle={`Next month (${prediction?.confidence || 'low'} confidence)`}
          testId="stat-prediction"
        />
      </div>

      <div className="dashboard-grid">
        <Card className="chart-card">
          <div className="card-header">
            <h3>Monthly Trend</h3>
          </div>
          <div className="chart-container">
            {summary?.monthly_trend && summary.monthly_trend.length > 0 ? (
              <SimpleBarChart data={summary.monthly_trend} />
            ) : (
              <div className="empty-state">No transaction data yet</div>
            )}
          </div>
        </Card>

        <Card className="chart-card">
          <div className="card-header">
            <h3>Category Breakdown</h3>
          </div>
          <div className="chart-container">
            {summary?.category_breakdown && Object.keys(summary.category_breakdown).length > 0 ? (
              <SimplePieChart data={summary.category_breakdown} />
            ) : (
              <div className="empty-state">No expenses categorized yet</div>
            )}
          </div>
        </Card>

        <Card className="score-card">
          <div className="card-header">
            <h3>Financial Health Score</h3>
          </div>
          <div className="score-display">
            <div className="score-circle" style={{'--score': score || 0}}>
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="score-bg" />
                <circle cx="50" cy="50" r="45" className="score-progress" />
              </svg>
              <div className="score-value" data-testid="financial-score">{score || 0}</div>
            </div>
            <p className="score-label">
              {score >= 80 ? 'Excellent! Keep it up!' : score >= 60 ? 'Good progress' : score >= 40 ? 'Needs improvement' : 'Start tracking more'}
            </p>
          </div>
        </Card>

        <Card className="goals-card">
          <div className="card-header">
            <h3>Active Goals</h3>
          </div>
          <div className="goals-list">
            {goals.length > 0 ? (
              goals.slice(0, 3).map(goal => (
                <div key={goal.id} className="goal-item" data-testid="goal-item">
                  <div className="goal-info">
                    <span className="goal-name">{goal.name}</span>
                    <span className="goal-amount">₹{goal.current_amount} / ₹{goal.target_amount}</span>
                  </div>
                  <div className="goal-progress-bar">
                    <div className="goal-progress-fill" style={{width: `${(goal.current_amount / goal.target_amount) * 100}%`}} />
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No goals set yet</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, subtitle, testId }) {
  return (
    <Card className={`stat-card ${trend}`} data-testid={testId}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </Card>
  );
}

function SimpleBarChart({ data }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expense)));
  
  return (
    <div className="simple-bar-chart">
      {data.map((item, index) => (
        <div key={index} className="chart-bar-group">
          <div className="chart-bars">
            <div className="chart-bar income" style={{height: `${(item.income / maxValue) * 100}%`}} title={`Income: ₹${item.income}`} />
            <div className="chart-bar expense" style={{height: `${(item.expense / maxValue) * 100}%`}} title={`Expense: ₹${item.expense}`} />
          </div>
          <span className="chart-label">{item.month.split('-')[1]}</span>
        </div>
      ))}
      <div className="chart-legend">
        <span><span className="legend-dot income"></span>Income</span>
        <span><span className="legend-dot expense"></span>Expense</span>
      </div>
    </div>
  );
}

function SimplePieChart({ data }) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  return (
    <div className="simple-pie-chart">
      <div className="pie-items">
        {Object.entries(data).map(([category, amount], index) => (
          <div key={category} className="pie-item">
            <span className="pie-color" style={{backgroundColor: colors[index % colors.length]}} />
            <span className="pie-category">{category}</span>
            <span className="pie-value">₹{amount.toFixed(0)}</span>
            <span className="pie-percent">({((amount / total) * 100).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== TRANSACTIONS PAGE ====================
function Transactions({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [txnRes, accRes] = await Promise.all([
        axios.get(`${API_URL}/api/transactions`, { headers }),
        axios.get(`${API_URL}/api/accounts`, { headers }),
      ]);
      setTransactions(txnRes.data);
      setAccounts(accRes.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await axios.delete(`${API_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' || t.type === filter
  );

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="transactions-page" data-testid="transactions-page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Manage your income and expenses</p>
        </div>
      </div>

      <div className="filters-bar">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all" data-testid="filter-all">All</TabsTrigger>
            <TabsTrigger value="income" data-testid="filter-income">Income</TabsTrigger>
            <TabsTrigger value="expense" data-testid="filter-expense">Expenses</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="transactions-list">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(txn => {
            const account = accounts.find(a => a.id === txn.account_id);
            return (
              <Card key={txn.id} className="transaction-item" data-testid="transaction-item">
                <div className="transaction-icon">
                  {txn.type === 'income' ? <ArrowUpRight className="income-icon" /> : <ArrowDownRight className="expense-icon" />}
                </div>
                <div className="transaction-details">
                  <h4>{txn.description}</h4>
                  <p>{txn.category} • {account?.name || 'Unknown'} • {new Date(txn.date).toLocaleDateString()}</p>
                </div>
                <div className="transaction-amount">
                  <span className={txn.type}>{txn.type === 'income' ? '+' : '-'}₹{txn.amount}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(txn.id)} data-testid="delete-transaction-btn">×</Button>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="empty-state">No transactions found</div>
        )}
      </div>
    </div>
  );
}

// ==================== ACCOUNTS PAGE ====================
function Accounts({ token }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'bank', balance: 0 });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/accounts`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAddDialogOpen(false);
      setFormData({ name: '', type: 'bank', balance: 0 });
      fetchAccounts();
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this account?')) return;
    try {
      await axios.delete(`${API_URL}/api/accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="accounts-page" data-testid="accounts-page">
      <div className="page-header">
        <div>
          <h1>Accounts</h1>
          <p>Manage your financial accounts</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="add-account-btn">
              <Plus size={20} />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAccount} className="dialog-form">
              <div className="form-group">
                <Label>Account Name</Label>
                <Input
                  placeholder="e.g., Main Savings"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  data-testid="account-name-input"
                />
              </div>
              <div className="form-group">
                <Label>Account Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger data-testid="account-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-group">
                <Label>Initial Balance</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.balance}
                  onChange={(e) => setFormData({...formData, balance: parseFloat(e.target.value) || 0})}
                  required
                  data-testid="account-balance-input"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="submit-account-btn">Add Account</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="accounts-grid">
        {accounts.length > 0 ? (
          accounts.map(account => (
            <Card key={account.id} className="account-card" data-testid="account-card">
              <div className="account-header">
                <div className="account-icon">
                  <Wallet />
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(account.id)} data-testid="delete-account-btn">×</Button>
              </div>
              <h3>{account.name}</h3>
              <p className="account-type">{account.type.toUpperCase()}</p>
              <h2 className="account-balance" data-testid="account-balance">₹{account.balance.toFixed(2)}</h2>
            </Card>
          ))
        ) : (
          <div className="empty-state">No accounts added yet</div>
        )}
      </div>
    </div>
  );
}

// ==================== INSIGHTS PAGE ====================
function Insights({ token }) {
  const [prediction, setPrediction] = useState(null);
  const [tips, setTips] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({ name: '', target_amount: 0, current_amount: 0, deadline: '' });

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [predRes, tipsRes, goalsRes] = await Promise.all([
        axios.get(`${API_URL}/api/insights/prediction`, { headers }),
        axios.get(`${API_URL}/api/insights/tips`, { headers }),
        axios.get(`${API_URL}/api/goals`, { headers }),
      ]);
      setPrediction(predRes.data);
      setTips(tipsRes.data.tips);
      setGoals(goalsRes.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/goals`, goalForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAddGoalOpen(false);
      setGoalForm({ name: '', target_amount: 0, current_amount: 0, deadline: '' });
      fetchInsights();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await axios.delete(`${API_URL}/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInsights();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="insights-page" data-testid="insights-page">
      <div className="page-header">
        <h1>AI Insights</h1>
        <p>Smart predictions and personalized tips</p>
      </div>

      <div className="insights-grid">
        <Card className="prediction-card">
          <div className="card-header">
            <Sparkles />
            <h3>Next Month Prediction</h3>
          </div>
          <div className="prediction-content">
            <h2 className="prediction-amount" data-testid="prediction-amount">₹{prediction?.predicted_amount || 0}</h2>
            <div className="prediction-meta">
              <span className={`confidence-badge ${prediction?.confidence}`} data-testid="prediction-confidence">
                {prediction?.confidence} confidence
              </span>
              <span className={`trend-badge ${prediction?.trend}`} data-testid="prediction-trend">
                {prediction?.trend === 'increasing' ? '📈' : prediction?.trend === 'decreasing' ? '📉' : '→'} {prediction?.trend}
              </span>
            </div>
            {prediction?.historical_average && (
              <p className="prediction-note">Historical average: ₹{prediction.historical_average}</p>
            )}
          </div>
        </Card>

        <Card className="tips-card">
          <div className="card-header">
            <h3>Personalized Tips</h3>
          </div>
          <div className="tips-list">
            {tips.length > 0 ? (
              tips.map((tip, index) => (
                <div key={index} className="tip-item" data-testid="tip-item">
                  {tip}
                </div>
              ))
            ) : (
              <div className="empty-state">Add more transactions to get personalized tips</div>
            )}
          </div>
        </Card>
      </div>

      <div className="goals-section">
        <div className="section-header">
          <h2>Financial Goals</h2>
          <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
            <DialogTrigger asChild>
              <Button data-testid="add-goal-btn">
                <Plus size={20} />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Financial Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGoal} className="dialog-form">
                <div className="form-group">
                  <Label>Goal Name</Label>
                  <Input
                    placeholder="e.g., New Laptop"
                    value={goalForm.name}
                    onChange={(e) => setGoalForm({...goalForm, name: e.target.value})}
                    required
                    data-testid="goal-name-input"
                  />
                </div>
                <div className="form-group">
                  <Label>Target Amount</Label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={goalForm.target_amount}
                    onChange={(e) => setGoalForm({...goalForm, target_amount: parseFloat(e.target.value) || 0})}
                    required
                    data-testid="goal-target-input"
                  />
                </div>
                <div className="form-group">
                  <Label>Current Amount</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={goalForm.current_amount}
                    onChange={(e) => setGoalForm({...goalForm, current_amount: parseFloat(e.target.value) || 0})}
                    data-testid="goal-current-input"
                  />
                </div>
                <div className="form-group">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={goalForm.deadline}
                    onChange={(e) => setGoalForm({...goalForm, deadline: e.target.value})}
                    required
                    data-testid="goal-deadline-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="submit-goal-btn">Create Goal</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="goals-grid">
          {goals.length > 0 ? (
            goals.map(goal => {
              const progress = (goal.current_amount / goal.target_amount) * 100;
              return (
                <Card key={goal.id} className="goal-card" data-testid="goal-card">
                  <div className="goal-card-header">
                    <Target />
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)} data-testid="delete-goal-btn">×</Button>
                  </div>
                  <h3>{goal.name}</h3>
                  <div className="goal-amounts">
                    <span data-testid="goal-current">₹{goal.current_amount}</span>
                    <span className="goal-target" data-testid="goal-target">/ ₹{goal.target_amount}</span>
                  </div>
                  <div className="goal-progress-bar">
                    <div className="goal-progress-fill" style={{width: `${Math.min(progress, 100)}%`}} data-testid="goal-progress" />
                  </div>
                  <p className="goal-deadline">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                  <p className="goal-percentage">{progress.toFixed(1)}% completed</p>
                </Card>
              );
            })
          ) : (
            <div className="empty-state">No goals created yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== SETTINGS PAGE ====================
function SettingsPage({ user, onThemeToggle, theme }) {
  return (
    <div className="settings-page" data-testid="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your preferences</p>
      </div>

      <div className="settings-sections">
        <Card className="settings-card">
          <h3>Profile Information</h3>
          <div className="settings-item">
            <Label>Name</Label>
            <Input value={user?.name || ''} disabled />
          </div>
          <div className="settings-item">
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled />
          </div>
        </Card>

        <Card className="settings-card">
          <h3>Appearance</h3>
          <div className="settings-item">
            <div>
              <Label>Theme</Label>
              <p className="setting-description">Switch between light and dark mode</p>
            </div>
            <Button onClick={onThemeToggle} variant="outline" data-testid="theme-toggle-btn">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ==================== QUICK ADD FAB ====================
function QuickAddFAB({ token }) {
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    account_id: '',
    type: 'expense',
    amount: '',
    category: 'food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, account_id: response.data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data
      if (!formData.account_id) {
        alert('Please select an account');
        return;
      }
      if (!formData.amount || formData.amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      await axios.post(`${API_URL}/api/transactions`, {
        ...formData,
        amount: parseFloat(formData.amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Reset form
      setIsOpen(false);
      setFormData({
        account_id: accounts[0]?.id || '',
        type: 'expense',
        amount: '',
        category: 'food',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

      // Show success message
      alert('Transaction added successfully!');

      // Refresh the current page component instead of full page reload
      const currentPath = window.location.pathname;
      if (currentPath === '/dashboard') {
        window.dispatchEvent(new CustomEvent('dashboard-update'));
      } else if (currentPath === '/transactions') {
        window.dispatchEvent(new CustomEvent('transactions-update'));
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error adding transaction: ' + (error.response?.data?.detail || 'Please try again'));
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="quick-add-fab" data-testid="quick-add-fab">
            <Plus size={24} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Add Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="dialog-form">
            <div className="form-group">
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger data-testid="quick-add-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <Label>Account</Label>
              <Select value={formData.account_id} onValueChange={(value) => setFormData({...formData, account_id: value})}>
                <SelectTrigger data-testid="quick-add-account">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="100"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
                data-testid="quick-add-amount"
              />
            </div>
            <div className="form-group">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger data-testid="quick-add-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="bills">Bills</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="form-group">
              <Label>Description</Label>
              <Input
                placeholder="e.g., Lunch at cafe"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                data-testid="quick-add-description"
              />
            </div>
            <div className="form-group">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
                data-testid="quick-add-date"
              />
            </div>
            <Button type="submit" className="w-full" data-testid="quick-add-submit">Add Transaction</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;