import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextType {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState('San Francisco');

  // Load saved location preference
  useEffect(() => {
    const savedLocation = localStorage.getItem('budgetiq-location');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  // Save location preference when it changes
  useEffect(() => {
    localStorage.setItem('budgetiq-location', selectedLocation);
  }, [selectedLocation]);

  const value = {
    selectedLocation,
    setSelectedLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Popular countries/cities for quick selection
export const popularLocations = [
  'New York, USA',
  'London, UK',
  'Tokyo, Japan',
  'Paris, France',
  'Mumbai, India',
  'Sydney, Australia',
  'Toronto, Canada',
  'Berlin, Germany',
  'Singapore',
  'Dubai, UAE',
  'São Paulo, Brazil',
  'Mexico City, Mexico',
  'Seoul, South Korea',
  'Rome, Italy',
  'Amsterdam, Netherlands',
  'Stockholm, Sweden',
  'Barcelona, Spain',
  'Vienna, Austria',
  'Zurich, Switzerland',
  'Buenos Aires, Argentina'
];