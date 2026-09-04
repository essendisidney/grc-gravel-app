import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRideDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEE, dd MMM')
}

export function formatFullDate(dateStr: string): string {
  return format(parseISO(dateStr), 'EEEE, dd MMMM yyyy')
}

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${m} ${ampm}`
}

export function formatTimeAgo(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatKm(km: number): string {
  return `${km.toFixed(0)} km`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case 'founding': return '#FEC72E'
    case 'elite': return '#EF4444'
    case 'member': return '#3B82F6'
    case 'youth': return '#22C55E'
    case 'social': return '#8892A4'
    default: return '#8892A4'
  }
}

export function getTierLabel(tier: string): string {
  switch (tier) {
    case 'founding': return 'Founding Member'
    case 'elite': return 'Elite Member'
    case 'member': return 'Club Member'
    case 'youth': return 'Youth Member'
    case 'social': return 'Social Member'
    default: return 'Member'
  }
}

export function getRideTypeColor(type: string): string {
  switch (type) {
    case 'gravel': return '#FEC72E'
    case 'road': return '#3B82F6'
    case 'mtb': return '#22C55E'
    case 'social': return '#8B5CF6'
    case 'youth': return '#EC4899'
    case 'criterium': return '#EF4444'
    case 'training': return '#F97316'
    default: return '#8892A4'
  }
}

export function getRideTypeBg(type: string): string {
  switch (type) {
    case 'gravel': return 'bg-[rgba(254,199,46,0.18)] text-[#B8860B]'
    case 'road': return 'bg-[rgba(59,130,246,0.15)] text-[#60A5FA]'
    case 'mtb': return 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]'
    case 'social': return 'bg-[rgba(139,92,246,0.15)] text-[#A78BFA]'
    case 'youth': return 'bg-[rgba(236,72,153,0.15)] text-[#F472B6]'
    case 'criterium': return 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]'
    case 'training': return 'bg-[rgba(249,115,22,0.15)] text-[#FB923C]'
    default: return 'bg-[rgba(136,146,164,0.15)] text-[#8892A4]'
  }
}

export function normalizePhone(phone: string): string {
  return phone.replace(/^0/, '254').replace(/^\+/, '').replace(/\s/g, '')
}
