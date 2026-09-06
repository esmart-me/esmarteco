import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/index.js';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => { success: boolean; message?: string };
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('esmart_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('esmart_compare', JSON.stringify(compareList));
    } catch (err) {
      console.error('Error saving compare list:', err);
    }
  }, [compareList]);

  const addToCompare = (product: Product) => {
    if (compareList.length >= 4) {
      return { success: false, message: 'You can compare up to 4 products at a time.' };
    }
    if (compareList.some(p => p.id === product.id)) {
      return { success: false, message: 'Product is already in comparison.' };
    }
    setCompareList(prev => [...prev, product]);
    return { success: true, message: `${product.title} added to comparison.` };
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const isInCompare = (productId: string) => {
    return compareList.some(p => p.id === productId);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        compareCount: compareList.length
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
