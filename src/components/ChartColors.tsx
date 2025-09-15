// Chart color utility for theme-aware colors
export const getChartColors = () => {
  if (typeof window === 'undefined') {
    // Default colors for SSR
    return {
      chart1: '#8b5cf6',
      chart2: '#06b6d4', 
      chart3: '#f59e0b',
      chart4: '#ef4444',
      chart5: '#10b981',
      success: '#10b981',
      destructive: '#ef4444',
      warning: '#f59e0b',
      primary: '#3b82f6',
      muted: '#6b7280'
    };
  }

  const isDark = document.documentElement.classList.contains('dark');
  
  if (isDark) {
    return {
      chart1: '#a855f7',  // Purple - brighter for dark mode
      chart2: '#22d3ee',  // Cyan - brighter for dark mode
      chart3: '#fbbf24',  // Amber - brighter for dark mode
      chart4: '#f87171',  // Red - brighter for dark mode
      chart5: '#34d399',  // Emerald - brighter for dark mode
      success: '#4ade80',
      destructive: '#f87171', 
      warning: '#fbbf24',
      primary: '#60a5fa',
      muted: '#94a3b8'
    };
  } else {
    return {
      chart1: '#7c3aed',  // Purple
      chart2: '#0891b2',  // Cyan
      chart3: '#d97706',  // Amber  
      chart4: '#dc2626',  // Red
      chart5: '#059669',  // Emerald
      success: '#16a34a',
      destructive: '#dc2626',
      warning: '#d97706', 
      primary: '#2563eb',
      muted: '#64748b'
    };
  }
};

export const getCategoryColors = () => {
  const colors = getChartColors();
  return [
    colors.chart1, // Food & Dining - Purple
    colors.chart2, // Transportation - Cyan
    colors.chart3, // Entertainment - Amber
    colors.chart4, // Education - Red  
    colors.chart5, // Others - Emerald
  ];
};

export const getFinancialColors = () => {
  const colors = getChartColors();
  return {
    income: colors.success,
    expenses: colors.destructive,
    savings: colors.primary,
    balance: colors.primary
  };
};