import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { getFinancialColors } from './ChartColors';
import { formatInCurrency, formatUSD } from './CurrencySelector';

interface FinancialData {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

interface FinancialOverviewChartProps {
  data: FinancialData;
  selectedCurrency?: string;
}

export function FinancialOverviewChartEnhanced({ data, selectedCurrency = 'USD' }: FinancialOverviewChartProps) {
  const colors = useMemo(() => getFinancialColors(), []);
  
  const chartData = useMemo(() => [
    {
      name: 'Expenses',
      value: data.expenses,
      percentage: Math.round((data.expenses / data.income) * 100),
      color: colors.expenses
    },
    {
      name: 'Savings',
      value: data.savings,
      percentage: data.savingsRate,
      color: colors.savings
    }
  ], [data, colors]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
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
          <p className="font-medium text-card-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Amount: {selectedCurrency === 'USD' 
              ? formatUSD(data.value) 
              : formatInCurrency(data.value, selectedCurrency)
            }
          </p>
          <p className="text-sm text-muted-foreground">
            {data.payload.percentage}% of income
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percentage < 10) return null; // Only show labels for larger segments

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-bold"
        style={{ 
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))'
        }}
      >
        {percentage}%
      </text>
    );
  };

  return (
    <div className="relative w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={110}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1200}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Content */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="absolute top-0 left-0 right-0 h-72 flex flex-col items-center justify-center pointer-events-none"
      >
        <motion.div 
          className="text-2xl font-bold text-foreground"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {selectedCurrency === 'USD' 
            ? formatUSD(data.balance) 
            : formatInCurrency(data.balance, selectedCurrency)
          }
        </motion.div>
        {selectedCurrency !== 'USD' && (
          <div className="text-xs text-muted-foreground mt-1">
            ≈ {formatUSD(data.balance)}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          Current Balance
        </div>
        <motion.div 
          className="text-xs text-success mt-1"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          +12% from last month
        </motion.div>
      </motion.div>
      
      {/* Legend */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-6">
        {chartData.map((entry, index) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + (index * 0.1) }}
            className="flex items-center space-x-2"
          >
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {entry.name}: {entry.percentage}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}