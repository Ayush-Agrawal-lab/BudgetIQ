import { Button } from './ui/button';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Plus,
  History,
  Brain,
  Wallet,
  Settings,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      id: 'add-transaction',
      label: 'Add Transaction',
      icon: <Plus className="h-5 w-5" />,
    },
    {
      id: 'transactions',
      label: 'Transaction History',
      icon: <History className="h-5 w-5" />,
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      id: 'insights',
      label: 'AI Insights',
      icon: <Brain className="h-5 w-5" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-sidebar-primary" aria-hidden="true" />
          <div>
            <span className="text-xl text-sidebar-foreground font-semibold">BudgetIQ</span>
            <p className="text-xs text-sidebar-foreground/70">Smart Budget Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4" aria-label="Primary navigation">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={currentPage === item.id ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md'
                }`}
                onClick={() => onNavigate(item.id)}
                aria-current={currentPage === item.id ? 'page' : undefined}
                aria-label={`Navigate to ${item.label}`}
              >
                <motion.span 
                  aria-hidden="true"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {item.icon}
                </motion.span>
                <span className="ml-3">{item.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border">
        <motion.div 
          className="bg-gradient-to-r from-sidebar-primary/10 to-blue-500/10 rounded-lg p-4 border border-sidebar-primary/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center mb-2">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Brain className="h-5 w-5 text-sidebar-primary mr-2" />
            </motion.div>
            <span className="text-sidebar-foreground font-medium">AI Powered</span>
          </div>
          <p className="text-sm text-sidebar-foreground/70">
            Smart insights for your financial decisions
          </p>
        </motion.div>
      </div>
    </aside>
  );
}