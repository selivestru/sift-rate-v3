import { useCallback, useEffect, useRef } from 'react'

import { cn } from '~/common/utils/cn'

const OTP_LENGTH = 6

interface InputOTPProps {
  value: string
  onChange: (value: string) => void
  isInvalid?: boolean
  disabled?: boolean
  className?: string
}

export const InputOTP = ({
  value,
  onChange,
  isInvalid = false,
  disabled = false,
  className,
}: InputOTPProps) => {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const setRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      refs.current[index] = el
    },
    [],
  )

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  const focusNext = (index: number) => {
    const next = index + 1
    if (next < OTP_LENGTH) {
      refs.current[next]?.focus()
      refs.current[next]?.select()
    }
  }

  const focusPrev = (index: number) => {
    const prev = index - 1
    if (prev >= 0) {
      refs.current[prev]?.focus()
      refs.current[prev]?.select()
    }
  }

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, '').slice(-1)
    if (!digit) return

    const chars = value.split('')
    chars[index] = digit
    const newValue = chars.join('').slice(0, OTP_LENGTH)

    onChange(newValue)
    focusNext(index)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (value[index]) {
        const chars = value.split('')
        chars[index] = ''
        onChange(chars.join(''))
      } else {
        focusPrev(index)
      }
      return
    }

    if (e.key === 'Delete') {
      e.preventDefault()
      const chars = value.split('')
      chars[index] = ''
      onChange(chars.join(''))
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusPrev(index)
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusNext(index)
      return
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return

    onChange(pasted)

    const targetIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    refs.current[targetIndex]?.focus()
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  return (
    <div
      className={cn('flex items-center justify-center gap-2', className)}
      role="group"
      aria-label="One-time password"
    >
      {Array.from({ length: OTP_LENGTH }, (_, index) => (
        <input
          key={`otp-${index}`}
          ref={setRef(index)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[index] ?? ''}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          className={cn(
            'bg-secondary text-foreground size-10 rounded-md text-center text-lg font-medium outline-none transition-colors duration-200',
            'focus-visible:ring-ring/40 focus-visible:border-ring focus-visible:ring-2',
            isInvalid && 'border-destructive ring-2 ring-destructive/30',
            !isInvalid && 'border-transparent',
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          )}
        />
      ))}
    </div>
  )
}
