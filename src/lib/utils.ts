import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fonction pour formater les nombres avec des espaces
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Fonction pour formater les montants en FCFA avec des espaces
export function formatCurrency(amount: number): string {
  return `${formatNumber(amount)} FCFA`;
}