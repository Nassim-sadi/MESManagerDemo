import type { AlarmSeverity, LineStatus, SerialStatus, WorkOrderStatus } from '@/types/mes'

export type StatusTone = 'ok' | 'warn' | 'alarm' | 'idle' | 'info'

export const WORK_ORDER_TONES: Record<WorkOrderStatus, StatusTone> = {
  Queued: 'idle',
  Running: 'ok',
  Paused: 'warn',
  Hold: 'warn',
  Completed: 'info',
  Cancelled: 'alarm',
}

export const LINE_TONES: Record<LineStatus, StatusTone> = {
  Running: 'ok',
  Setup: 'warn',
  Idle: 'idle',
  Down: 'alarm',
  Maintenance: 'info',
}

export const ALARM_TONES: Record<AlarmSeverity, StatusTone> = {
  Critical: 'alarm',
  Warning: 'warn',
  Info: 'info',
}

export const SERIAL_TONES: Record<SerialStatus, StatusTone> = {
  Passed: 'ok',
  'In Process': 'info',
  Failed: 'alarm',
  Scrapped: 'alarm',
}

export const STATION_TONES: Record<string, StatusTone> = {
  Available: 'ok',
  Busy: 'info',
  Maintenance: 'warn',
  Offline: 'idle',
}

export const TONE_CLASS: Record<StatusTone, string> = {
  ok: 'mes-tone--ok',
  warn: 'mes-tone--warn',
  alarm: 'mes-tone--alarm',
  idle: 'mes-tone--idle',
  info: 'mes-tone--info',
}

/**
 * Safe lookup for status maps. Table rows come from the API as untyped
 * payloads, so an unknown value falls back to the neutral tone.
 */
export function toneOf(map: Record<string, StatusTone>, value: unknown): StatusTone {
  if (typeof value !== 'string') return 'idle'
  return map[value] ?? 'idle'
}
