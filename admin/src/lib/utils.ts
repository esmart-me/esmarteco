import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAED(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'AED 0';
  const hasDecimals = amount % 1 !== 0;
  return `AED ${amount.toLocaleString('en-AE', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  })}`;
}
