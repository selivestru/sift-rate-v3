import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'
import { Calendar, ChevronLeft, ChevronRight } from 'reicon-react'

import { useAppLocale } from '~/common/i18n'
import { Button } from '~/common/ui/Button'
import { Popover, PopoverContent, PopoverTrigger } from '~/common/ui/Popover'
import { selectTriggerVariants } from '~/common/ui/Select'
import { cn } from '~/common/utils/cn'

import {
  dateKeyToLocalDate,
  isBeforeMinKey,
  isFutureKey,
  parseDateKey,
  REVIEW_MIN_DATE_KEY,
  REVIEW_MIN_YEAR,
  toDateKey,
  todayKey,
} from '../utils/review-date'

interface ReviewDatePickerProps {
  value?: string
  onChange: (key: string) => void
  isInvalid?: boolean
}

const MONDAY_BASE = new Date(2024, 0, 1)

const clampMonth = (year: number, month: number) => {
  const now = new Date()
  const maxYear = now.getFullYear()
  const maxMonth = now.getMonth() + 1
  if (year > maxYear || (year === maxYear && month > maxMonth)) {
    return { year: maxYear, month: maxMonth }
  }
  if (year < REVIEW_MIN_YEAR) {
    return { year: REVIEW_MIN_YEAR, month: 1 }
  }
  if (month < 1) return { year: year - 1, month: 12 }
  if (month > 12) return { year: year + 1, month: 1 }
  return { year, month }
}

export const ReviewDatePicker = ({ value, onChange, isInvalid = false }: ReviewDatePickerProps) => {
  const content = useIntlayer('review-date-picker')
  const { locale } = useAppLocale()
  const [open, setOpen] = useState(false)

  const fallbackKey = value ?? todayKey()
  const fallback = parseDateKey(fallbackKey)
  const [displayed, setDisplayed] = useState({ year: fallback.year, month: fallback.month })

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      const current = parseDateKey(value ?? todayKey())
      setDisplayed({ year: current.year, month: current.month })
    }
    setOpen(nextOpen)
  }

  const moveMonth = (delta: number) => {
    setDisplayed((prev) => clampMonth(prev.year, prev.month + delta))
  }

  const monthName = new Intl.DateTimeFormat(locale, { month: 'long' }).format(
    new Date(displayed.year, displayed.month - 1, 1),
  )
  const weekdayNames = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
      new Date(MONDAY_BASE.getFullYear(), MONDAY_BASE.getMonth(), MONDAY_BASE.getDate() + index),
    ),
  )

  const firstOffset = (new Date(displayed.year, displayed.month - 1, 1).getDay() + 6) % 7
  const daysInMonth = new Date(displayed.year, displayed.month, 0).getDate()
  const today = todayKey()

  const formatLabel = (key: string) =>
    new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(
      dateKeyToLocalDate(key),
    )

  const canGoPrev =
    `${displayed.year}-${String(displayed.month).padStart(2, '0')}` >
    REVIEW_MIN_DATE_KEY.slice(0, 7)
  const canGoNext =
    displayed.year < new Date().getFullYear() || displayed.month < new Date().getMonth() + 1

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        aria-label={content.chooseDate.value}
        aria-invalid={isInvalid || undefined}
        className={cn(selectTriggerVariants())}
      >
        <span className="inline-flex flex-1 items-center gap-1.5 truncate text-left">
          <Calendar />
          {value ? formatLabel(value) : content.chooseDate.value}
        </span>
        {value === today && (
          <span className="text-muted-foreground shrink-0 text-xs font-normal">
            {content.today.value}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              type="button"
              aria-label={content.previousMonth.value}
              isDisabled={!canGoPrev}
              onClick={() => moveMonth(-1)}
            >
              <ChevronLeft />
            </Button>
            <span
              aria-live="polite"
              className="px-3 py-1.5 text-sm font-semibold capitalize tabular-nums"
            >
              {content.monthYear({ month: monthName, year: String(displayed.year) })}
            </span>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              type="button"
              aria-label={content.nextMonth.value}
              isDisabled={!canGoNext}
              onClick={() => moveMonth(1)}
            >
              <ChevronRight />
            </Button>
          </div>

          <div role="grid" className="grid grid-cols-7 gap-1">
            {weekdayNames.map((name) => (
              <span
                key={name}
                className="text-muted-foreground flex size-9 items-center justify-center text-xs capitalize"
              >
                {name}
              </span>
            ))}
            {Array.from({ length: firstOffset }, (_, index) => (
              <span key={`blank-${index}`} className="size-9" />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1
              const key = toDateKey(new Date(displayed.year, displayed.month - 1, day))
              const isSelected = value === key
              const isToday = today === key
              const isDisabled = isFutureKey(key) || isBeforeMinKey(key)

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isDisabled}
                  aria-pressed={isSelected}
                  aria-label={content.pickDay({ date: formatLabel(key) })}
                  onClick={() => {
                    onChange(key)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex size-9 cursor-pointer items-center justify-center rounded-md text-sm tabular-nums transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50',
                    isSelected
                      ? 'bg-primary text-primary-foreground hover:bg-primary'
                      : 'hover:bg-accent',
                    isToday && !isSelected && 'font-semibold ring-1 ring-ring',
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
