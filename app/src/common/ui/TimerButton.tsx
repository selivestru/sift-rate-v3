import { useTimer } from '~/common/hooks/useTimer'

import { formatTime } from '../utils/formatTime'
import { Button, type ButtonProps } from './Button'

export type TimerButtonProps = Omit<Partial<ButtonProps>, 'children'> & {
  ttl: number
  label: string
}

export const TimerButton = ({
  ttl,
  label,
  onClick,
  className,
  size,
  isDisabled,
  ...props
}: TimerButtonProps) => {
  const { days, hours, minutes, seconds, active } = useTimer(ttl)

  const time = formatTime({ days, hours, minutes, seconds })

  return (
    <Button
      data-slot="timer-button"
      className={className}
      variant={active ? 'outline' : 'default'}
      size={size}
      isDisabled={active || isDisabled}
      onClick={active ? undefined : onClick}
      {...props}
    >
      {active ? (
        <>
          {label} <span className="tabular-nums">({time})</span>
        </>
      ) : (
        label
      )}
    </Button>
  )
}
