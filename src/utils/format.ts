const numberFormatter = new Intl.NumberFormat('en-GB')

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return numberFormatter.format(value)
}

export function formatPercent(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(digits)}%`
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function formatTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

/** Compact table timestamp: 20/10 18:44 */
export function formatCompactDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

/** Quantity without thousand separators - keeps narrow table columns tight. */
export function formatQty(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return String(value)
}

export function formatRelative(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60_000)
  const abs = Math.abs(diffMinutes)

  if (abs < 1) return 'just now'
  if (abs < 60) return diffMinutes > 0 ? `${abs} min ago` : `in ${abs} min`
  const hours = Math.round(abs / 60)
  if (hours < 24) return diffMinutes > 0 ? `${hours} h ago` : `in ${hours} h`
  const days = Math.round(hours / 24)
  return diffMinutes > 0 ? `${days} d ago` : `in ${days} d`
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  return `${hours} h ${rest.toString().padStart(2, '0')} min`
}
