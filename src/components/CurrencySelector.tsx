import React from 'react';
import { Badge } from './ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { DollarSign, Euro, PoundSterling } from 'lucide-react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate to USD
  icon: React.ReactNode;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1, icon: <DollarSign className="h-4 w-4" /> },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.85, icon: <Euro className="h-4 w-4" /> },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.73, icon: <PoundSterling className="h-4 w-4" /> },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 110, icon: <span className="text-sm font-bold">¥</span> },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83, icon: <span className="text-sm font-bold">₹</span> },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.25, icon: <span className="text-sm font-bold">C$</span> },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.35, icon: <span className="text-sm font-bold">A$</span> },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.88, icon: <span className="text-sm font-bold">CHF</span> },
];

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: Currency) => void;
}

export function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0];

  return (
    <div className="flex items-center space-x-3">
      <Badge variant="outline" className="flex items-center space-x-1">
        <DollarSign className="h-3 w-3" />
        <span>Results: USD</span>
      </Badge>
      
      <Select value={selectedCurrency} onValueChange={(value) => {
        const currency = currencies.find(c => c.code === value);
        if (currency) onCurrencyChange(currency);
      }}>
        <SelectTrigger className="w-48">
          <SelectValue>
            <div className="flex items-center space-x-2">
              {currentCurrency.icon}
              <span>{currentCurrency.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center space-x-2">
                {currency.icon}
                <span>{currency.name} ({currency.symbol})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function convertToUSD(amount: number, fromCurrency: string): number {
  const currency = currencies.find(c => c.code === fromCurrency);
  if (!currency) return amount;
  return Math.round((amount / currency.rate) * 100) / 100;
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies.find(c => c.code === currencyCode);
  if (!currency) return `$${amount.toLocaleString()}`;
  return `${currency.symbol}${amount.toLocaleString()}`;
}

export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function formatInCurrency(amountInUSD: number, targetCurrency: string): string {
  const currency = currencies.find(c => c.code === targetCurrency);
  if (!currency) return formatUSD(amountInUSD);
  
  const convertedAmount = Math.round((amountInUSD * currency.rate) * 100) / 100;
  return `${currency.symbol}${convertedAmount.toLocaleString()}`;
}