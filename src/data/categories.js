import {
  Utensils,
  Bus,
  Coffee,
  ShoppingBag,
  Home,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  Wallet,
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'food-dining',    label: 'Food & Dining',    iconName: 'Utensils',      icon: Utensils,      color: '#FF6B6B', bg: '#FEE2E2', text: '#DC2626' },
  { id: 'transport',      label: 'Transport',         iconName: 'Bus',           icon: Bus,           color: '#3B82F6', bg: '#DBEAFE', text: '#2563EB' },
  { id: 'coffee-drinks',  label: 'Coffee & Drinks',   iconName: 'Coffee',        icon: Coffee,        color: '#D97706', bg: '#FEF3C7', text: '#B45309' },
  { id: 'shopping',       label: 'Shopping',          iconName: 'ShoppingBag',   icon: ShoppingBag,   color: '#EC4899', bg: '#FCE7F3', text: '#DB2777' },
  { id: 'housing',        label: 'Housing',           iconName: 'Home',          icon: Home,          color: '#8B5CF6', bg: '#EDE9FE', text: '#7C3AED' },
  { id: 'bills',          label: 'Bills',             iconName: 'Zap',           icon: Zap,           color: '#F59E0B', bg: '#FEF3C7', text: '#D97706' },
  { id: 'entertainment',  label: 'Entertainment',     iconName: 'Film',          icon: Film,          color: '#6366F1', bg: '#E0E7FF', text: '#4F46E5' },
  { id: 'healthcare',     label: 'Healthcare',        iconName: 'HeartPulse',    icon: HeartPulse,    color: '#EF4444', bg: '#FEE2E2', text: '#DC2626' },
  { id: 'education',      label: 'Education',         iconName: 'GraduationCap', icon: GraduationCap, color: '#10B981', bg: '#D1FAE5', text: '#059669' },
  { id: 'travel',         label: 'Travel',            iconName: 'Bus',           icon: Bus,           color: '#06B6D4', bg: '#CFFAFE', text: '#0891B2' },
  { id: 'other',          label: 'Other',             iconName: 'Wallet',        icon: Wallet,        color: '#64748B', bg: '#F1F5F9', text: '#475569' },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((cat) => [cat.label, cat])
);

export function getCategoryMeta(label) {
  return CATEGORY_MAP[label] ?? {
    id: 'other',
    label: label || 'Other',
    iconName: 'Wallet',
    icon: Wallet,
    color: '#64748B',
    bg: '#F1F5F9',
    text: '#475569',
  };
}
