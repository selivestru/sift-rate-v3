import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import { Popover, PopoverContent, PopoverTrigger } from '~/common/ui/Popover'
import { selectTriggerVariants } from '~/common/ui/Select'
import { cn } from '~/common/utils/cn'

import { formatReviewDateLabel, REVIEW_MIN_YEAR, reviewMonthKeys } from '../utils/review-date'

interface ReviewDateValue {
  year?: number
  month?: number
}

interface ReviewDateSelectProps {
  year?: number
  month?: number
  onChange: (value: ReviewDateValue) => void
}

export const ReviewDateSelect = ({ year, month, onChange }: ReviewDateSelectProps) => {
  const content = useIntlayer('review-date')
  const currentYear = new Date().getFullYear()
  const [open, setOpen] = useState(false)
  const [displayedYear, setDisplayedYear] = useState(year ?? currentYear)

  const isActive = year != null
  const monthNames = reviewMonthKeys.map((key) => content.months[key].value)

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDisplayedYear(year ?? currentYear)
    }
    setOpen(nextOpen)
  }

  const handleMonthClick = (monthValue: number) => {
    if (year === displayedYear && month === monthValue) {
      onChange({ year: displayedYear })
    } else {
      onChange({ year: displayedYear, month: monthValue })
    }
  }

  const handleYearOnly = () => {
    onChange({ year: displayedYear })
  }

  const handleClear = () => {
    onChange({})
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        aria-label={content.filterByDate.value}
        className={cn(selectTriggerVariants())}
      >
        <span
          className={cn(
            'inline-flex flex-1 items-center gap-1.5 truncate text-left',
            isActive && 'text-primary',
          )}
        >
          <Calendar />
          {formatReviewDateLabel(year, month, monthNames, content.anyDate.value)}
        </span>
        <span className="text-muted-foreground inline-flex shrink-0">
          <ChevronDown />
        </span>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-70 p-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              aria-label={content.previousYear.value}
              isDisabled={displayedYear <= REVIEW_MIN_YEAR}
              onClick={() => setDisplayedYear((value) => Math.max(REVIEW_MIN_YEAR, value - 1))}
            >
              <ChevronLeft />
            </Button>
            <button
              type="button"
              aria-label={content.showAllYear({ year: displayedYear })}
              onClick={handleYearOnly}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-semibold tabular-nums transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40',
                isActive && month == null && year === displayedYear && 'text-primary',
              )}
            >
              {displayedYear}
            </button>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              aria-label={content.nextYear.value}
              isDisabled={displayedYear >= currentYear}
              onClick={() => setDisplayedYear((value) => Math.min(currentYear, value + 1))}
            >
              <ChevronRight />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {monthNames.map((name, index) => {
              const monthValue = index + 1
              const isSelected = year === displayedYear && month === monthValue

              return (
                <Button
                  key={name}
                  variant="secondary"
                  size="sm"
                  fullWidth
                  aria-pressed={isSelected}
                  onClick={() => handleMonthClick(monthValue)}
                  className={cn(
                    isSelected && 'bg-primary text-primary-foreground hover:bg-primary',
                  )}
                >
                  {name}
                </Button>
              )
            })}
          </div>

          <Button variant="ghost" size="sm" fullWidth onClick={handleClear}>
            {content.anyDate.value}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
