import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"

// ─── Tailwind class merging ───────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Format a date for display in the schedule (e.g. "Aug 20, 2026")
 */
export function formatGameDate(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy")
}

/**
 * Format a game time (e.g. "7:00 PM")
 */
export function formatGameTime(date: Date | string) {
  return format(new Date(date), "h:mm a")
}

/**
 * Format date + time together (e.g. "Aug 20, 2026 · 7:00 PM")
 */
export function formatGameDateTime(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy · h:mm a")
}

/**
 * Relative time (e.g. "3 days ago", "in 2 hours")
 */
export function formatRelativeTime(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

// ─── Stat helpers ─────────────────────────────────────────────────────────────

/**
 * Format a stat average to one decimal place (e.g. 12.3)
 */
export function formatAvg(total: number, games: number): string {
  if (games === 0) return "0.0"
  return (total / games).toFixed(1)
}

// ─── String helpers ───────────────────────────────────────────────────────────

/**
 * Returns initials from a name (e.g. "John Doe" → "JD")
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}