import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Download,
  Trash2,
  AlertTriangle,
  Save,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Plus,
  Building2,
  Wallet,
  RefreshCw,
  CheckCircle,
  Clock,
  MoreHorizontal,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SettingsPageProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function SettingsPage({ isDarkMode, onToggleTheme }: SettingsPageProps) {
  const [profile, setProfile] = useState({
    firstName: 'Alex',
    lastName: 'Chen',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 123-4567'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    weeklyReports: true,
    marketingEmails: false,
    securityAlerts: true
  });

  const [privacy, setPrivacy] = useState({
    shareDataForInsights: true,
    allowAnalytics: true,
    showInLeaderboards: false,
    publicProfile: false
  });

  const [showPassword, setShowPassword] = useState(false);

  // Connected accounts data
  const connectedAccounts = [
    {
      id: 1,
      name: "Chase Total Checking",
      type: "Checking",
      balance: 8450.75,
      lastSync: "2 minutes ago",
      status: "connected",
      icon: Building2,
      color: "bg-blue-500",
      change: +234.50,
      changePercent: +2.85
    },
    {
      id: 2,
      name: "Chase Freedom Credit Card",
      type: "Credit Card",
      balance: -1250.30,
      lastSync: "5 minutes ago",
      status: "connected",
      icon: CreditCard,
      color: "bg-purple-500",
      change: -89.99,
      changePercent: -7.73
    },
    {
      id: 3,
      name: "High Yield Savings",
      type: "Savings",
      balance: 15750.00,
      lastSync: "1 hour ago",
      status: "connected",
      icon: Building2,
      color: "bg-green-500",
      change: +125.00,
      changePercent: +0.80
    },
    {
      id: 4,
      name: "Investment Account",
      type: "Investment",
      balance: 42750.80,
      lastSync: "Failed",
      status: "error",
      icon: TrendingUp,
      color: "bg-orange-500",
      change: +1250.30,
      changePercent: +3.01
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="secondary" className="text-green-600 bg-green-50 dark:bg-green-950">Connected</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="text-yellow-600 bg-yellow-50 dark:bg-yellow-950">Needs Attention</Badge>;
      case 'error':
        return <Badge variant="secondary" className="text-red-600 bg-red-50 dark:bg-red-950">Connection Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // Mock save functionality
    console.log('Profile saved:', profile);
  };

  const handleExportData = () => {
    // Mock data export
    console.log('Exporting user data...');
  };

  const handleDeleteAccount = () => {
    // Mock account deletion
    console.log('Account deletion requested...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2" />
                    Connected Financial Accounts
                  </CardTitle>
                  <CardDescription>
                    Manage your linked bank accounts, cards, and investment accounts
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync All
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${account.color} text-white`}>
                          <account.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{account.name}</h3>
                          <p className="text-sm text-muted-foreground">{account.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-semibold ${account.balance < 0 ? 'text-red-500' : ''}`}>
                          ${Math.abs(account.balance).toLocaleString()}
                        </div>
                        {account.balance < 0 && (
                          <p className="text-xs text-red-500">Outstanding Balance</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          {getStatusIcon(account.status)}
                          <span>Last sync: {account.lastSync}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {account.change > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`text-sm ${account.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {account.change > 0 ? '+' : ''}${Math.abs(account.change).toFixed(2)} ({account.changePercent > 0 ? '+' : ''}{account.changePercent.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(account.status)}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-medium">Account Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Bank-Level Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      Your data is protected with 256-bit encryption
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Auto Sync</h4>
                    <p className="text-sm text-muted-foreground">
                      Accounts sync automatically every few minutes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(value) => handleNotificationChange('emailNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get real-time alerts on your device
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(value) => handleNotificationChange('pushNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Budget Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Warnings when approaching budget limits
                    </p>
                  </div>
                  <Switch
                    checked={notifications.budgetAlerts}
                    onCheckedChange={(value) => handleNotificationChange('budgetAlerts', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Summary of your financial activity
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(value) => handleNotificationChange('weeklyReports', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Product updates and promotional content
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(value) => handleNotificationChange('marketingEmails', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important security and login notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={(value) => handleNotificationChange('securityAlerts', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy & Data Settings
              </CardTitle>
              <CardDescription>
                Control how your data is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Share Data for Think Tank Insights</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymized data to contribute to community insights
                    </p>
                  </div>
                  <Switch
                    checked={privacy.shareDataForInsights}
                    onCheckedChange={(value) => handlePrivacyChange('shareDataForInsights', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics & Performance</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve the app with usage analytics
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowAnalytics}
                    onCheckedChange={(value) => handlePrivacyChange('allowAnalytics', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show in Leaderboards</Label>
                    <p className="text-sm text-muted-foreground">
                      Appear in community savings challenges (anonymous)
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showInLeaderboards}
                    onCheckedChange={(value) => handlePrivacyChange('showInLeaderboards', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <Switch
                    checked={privacy.publicProfile}
                    onCheckedChange={(value) => handlePrivacyChange('publicProfile', value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Data Protection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Shield className="h-8 w-8 text-green-500 mb-2" />
                    <h4 className="font-medium mb-1">Bank-Level Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      Your data is protected with 256-bit encryption
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Eye className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="font-medium mb-1">Anonymous Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Think Tank data is fully anonymized
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={onToggleTheme}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Theme Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-white">
                    <div className="w-full h-20 bg-gray-100 rounded mb-2"></div>
                    <p className="text-sm text-center text-gray-600">Light Theme</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gray-900">
                    <div className="w-full h-20 bg-gray-800 rounded mb-2"></div>
                    <p className="text-sm text-center text-gray-300">Dark Theme</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Display Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Compact Mode</Label>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show Animations</Label>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>High Contrast</Label>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Account Management
              </CardTitle>
              <CardDescription>
                Manage your subscription and account data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">Pro Plan - $9.99/month</p>
                  </div>
                  <Badge>Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Next Billing Date</h3>
                    <p className="text-sm text-muted-foreground">January 15, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Update Payment
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Data Management</h3>
                <div className="space-y-3">
                  <Button variant="outline" onClick={handleExportData} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Download all your financial data in CSV format
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-red-600">Danger Zone</h3>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800 dark:text-red-200">
                        Delete Account
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="mt-3"
                        onClick={handleDeleteAccount}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}