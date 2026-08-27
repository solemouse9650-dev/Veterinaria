import type { DayHours, HoursConfig, OpenStatusOverride } from '@/types'

const TIME_ZONE = 'America/Argentina/Buenos_Aires'

const WEEKDAY_INDEX: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  miércoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  sábado: 6,
}

export interface ClinicOpenStatus {
  open: boolean
  label: string
  note: string
}

function argentinaNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || ''

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }

  return {
    weekday: weekdayMap[get('weekday')] ?? 0,
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

function timeToMinutes(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return hours * 60 + minutes
}

function parseRange(value: string) {
  const [startRaw, endRaw] = value.split('-').map((part) => part.trim())
  const start = timeToMinutes(startRaw || '')
  const end = timeToMinutes(endRaw || '')
  if (start == null || end == null || end <= start) return null
  return { start, end }
}

export function dayTimeRanges(day: DayHours) {
  if (day.closed) return []
  const open = day.open.trim()
  const close = day.close.trim()
  const ranges = []

  if (open.includes('-')) {
    const range = parseRange(open)
    if (range) ranges.push(range)
  }
  if (close.includes('-')) {
    const range = parseRange(close)
    if (range) ranges.push(range)
  }
  if (!open.includes('-') && !close.includes('-')) {
    const range = parseRange(`${open}-${close}`)
    if (range) ranges.push(range)
  }

  return ranges
}

function todayHoliday(hours: HoursConfig, date: string) {
  return hours.holidays.find((item) => item.date === date && item.closed)
}

function todayVacation(hours: HoursConfig, date: string) {
  return hours.vacations.find(
    (item) => item.start && item.end && date >= item.start && date <= item.end,
  )
}

export function normalizeHours(hours: HoursConfig): HoursConfig {
  const override: OpenStatusOverride =
    hours.statusOverride === 'open' || hours.statusOverride === 'closed'
      ? hours.statusOverride
      : 'auto'
  return {
    ...hours,
    holidays: hours.holidays || [],
    vacations: hours.vacations || [],
    emergencyNote: hours.emergencyNote || '',
    statusOverride: override,
    statusNote: hours.statusNote || '',
  }
}

export function getClinicOpenStatus(
  hours: HoursConfig,
  now = new Date(),
): ClinicOpenStatus {
  const config = normalizeHours(hours)
  const note = config.statusNote.trim()

  if (config.statusOverride === 'open') {
    return { open: true, label: 'Abierto ahora', note }
  }
  if (config.statusOverride === 'closed') {
    return { open: false, label: 'Cerrado', note }
  }

  const current = argentinaNow(now)
  const holiday = todayHoliday(config, current.date)
  if (holiday) {
    return {
      open: false,
      label: 'Cerrado',
      note: holiday.name || note,
    }
  }

  const vacation = todayVacation(config, current.date)
  if (vacation) {
    return {
      open: false,
      label: 'Cerrado',
      note: vacation.note || note,
    }
  }

  const today = config.regular.find((day) => {
    const key = day.day.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return WEEKDAY_INDEX[key] === current.weekday || WEEKDAY_INDEX[day.day.toLowerCase()] === current.weekday
  })

  if (!today || today.closed) {
    return { open: false, label: 'Cerrado', note }
  }

  const openNow = dayTimeRanges(today).some(
    (range) => current.minutes >= range.start && current.minutes < range.end,
  )

  return {
    open: openNow,
    label: openNow ? 'Abierto ahora' : 'Cerrado',
    note,
  }
}
