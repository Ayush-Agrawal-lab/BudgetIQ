import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyData {
  code: string;
  symbol: string;
  name: string;
  rate: number;
}

interface CurrencyContextType {
  selectedCurrency: string;
  currencyData: CurrencyData;
  setSelectedCurrency: (currency: string) => void;
  setCurrencyData: (data: CurrencyData) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [currencyData, setCurrencyData] = useState<CurrencyData>({
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1
  });

  // Load saved currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem('budgetiq-currency');
    const savedCurrencyData = localStorage.getItem('budgetiq-currency-data');
    
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
    
    if (savedCurrencyData) {
      try {
        setCurrencyData(JSON.parse(savedCurrencyData));
      } catch (error) {
        console.warn('Failed to parse saved currency data:', error);
      }
    }
  }, []);

  // Save currency preference when it changes
  useEffect(() => {
    localStorage.setItem('budgetiq-currency', selectedCurrency);
    localStorage.setItem('budgetiq-currency-data', JSON.stringify(currencyData));
  }, [selectedCurrency, currencyData]);

  const value = {
    selectedCurrency,
    currencyData,
    setSelectedCurrency,
    setCurrencyData,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};