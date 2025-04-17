import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkImageUrl = (imageUrl: string | undefined | null): string => {
  const placeholder = "/images/white-image.png";
  if (!imageUrl) {
    return placeholder;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }
  
  return placeholder;
}

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return '';
  
  // Định dạng ngày theo tiếng Việt: DD/MM/YYYY
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export function formatAddress(address: string): string {
  if (!address) return ""
  if (address.length < 10) return address

  return `${address.substring(0, 4)}…${address.substring(address.length - 4)}`
}

export function formatTimestamp(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  if (diff < 60000) {
    return "Just Now"
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes} min${minutes > 1 ? "s" : ""}`
  } else if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours} hour${hours > 1 ? "s" : ""}`
  } else {
    const days = Math.floor(diff / 86400000)
    return `${days} day${days > 1 ? "s" : ""}`
  }
}

export function formatCurrency(value: number): string {
  if (value === 0) return "$0.00"

  if (Math.abs(value) < 0.01) {
    return value < 0 ? "<-$0.01" : "<$0.01"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
