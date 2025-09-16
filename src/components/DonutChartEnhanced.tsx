import { useState, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { getCategoryColors } from './ChartColors';
import { formatUSD, formatInCurrency } from './CurrencySelector';

interface DonutChartData {
  name: string;
  value: number;
  amount: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  centerText?: string;
  centerValue?: string;
  onCategoryClick?: (category: string, customName?: string) => void;
  size?: 'small' | 'medium' | 'large';
  selectedCurrency?: string;
}

export function DonutChartEnhanced({ 
  data, 
  centerText, 
  centerValue, 
  onCategoryClick,
  size = 'medium',
  selectedCurrency = 'USD'
}: DonutChartProps) {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [showOtherDialog, setShowOtherDialog] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const sizes = {
    small: { outer: 60, inner: 30, height: 140 },
    medium: { outer: 100, inner: 50, height: 220 },
    large: { outer: 140, inner: 70, height: 320 }
  };

  const currentSize = useMemo(() => sizes[size], [size]);
  const categoryColors = useMemo(() => getCategoryColors(), []);

  // Assign colors to data if not provided
  const chartData = useMemo(() => 
    data.map((item, index) => ({
      ...item,
      color: item.color || categoryColors[index % categoryColors.length]
    })), [data, categoryColors]
  );

  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    if (percent < 0.05) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
        style={{ 
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))'
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
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
          <p className="font-medium text-card-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            Amount: {selectedCurrency === 'USD' 
              ? formatUSD(payload[0].payload.amount) 
              : formatInCurrency(payload[0].payload.amount, selectedCurrency)
            }
          </p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value}% of total
          </p>
        </motion.div>
      );
    }
    return null;
  };

  const handleSegmentClick = useCallback((data: any) => {
    const categoryName = data.name;
    setSelectedSegment(categoryName);
    
    if (categoryName === 'Others' && onCategoryClick) {
      setShowOtherDialog(true);
    } else if (onCategoryClick) {
      onCategoryClick(categoryName);
    }
  }, [onCategoryClick]);

  const handleOtherSubmit = useCallback(() => {
    if (customCategory.trim() && onCategoryClick) {
      onCategoryClick('Others', customCategory.trim());
      setCustomCategory('');
      setShowOtherDialog(false);
    }
  }, [customCategory, onCategoryClick]);

  return (
    <>
      <div className="relative w-full" style={{ height: currentSize.height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={currentSize.outer}
              innerRadius={currentSize.inner}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
              onClick={handleSegmentClick}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                  stroke={selectedSegment === entry.name ? '#ffffff' : 'none'}
                  strokeWidth={selectedSegment === entry.name ? 3 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Content */}
        {(centerText || centerValue) && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            {centerValue && (
              <motion.div 
                className="text-2xl font-bold text-foreground"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {centerValue}
              </motion.div>
            )}
            {centerText && (
              <div className="text-sm text-muted-foreground mt-1 text-center">
                {centerText}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Other Category Dialog */}
      <Dialog open={showOtherDialog} onOpenChange={setShowOtherDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Specify Other Category</DialogTitle>
            <DialogDescription>
              What specific category would you like to track under "Others"?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category Name</Label>
              <Input
                id="category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g., Healthcare, Utilities, Hobbies..."
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowOtherDialog(false);
                  setCustomCategory('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleOtherSubmit}
                disabled={!customCategory.trim()}
              >
                Add Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}