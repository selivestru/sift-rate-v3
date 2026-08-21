import { useEffect, useRef, useState } from 'react'

import { useDidUpdate } from './useDidUpdate'

export type PositiveInteger<Value extends number> = `${Value}` extends
  | `-${number}`
  | `${number}.${number}`
  ? never
  : Value

export const getTimeFromSeconds = (timestamp: number) => {
  const roundedTimestamp = Math.ceil(timestamp)
  const days = Math.floor(roundedTimestamp / (60 * 60 * 24))
  const hours = Math.floor((roundedTimestamp % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((roundedTimestamp % (60 * 60)) / 60)
  const seconds = Math.floor(roundedTimestamp % 60)

  return {
    seconds,
    minutes,
    hours,
    days,
  }
}

export interface UseTimerOptions {
  immediately?: boolean
  onExpire?: () => void
  onStart?: () => void
  onTick?: (seconds: number) => void
}
export interface UseTimerReturn {
  active: boolean
  count: number
  days: number
  hours: number
  minutes: number
  seconds: number
  clear: () => void
  decrease: (seconds: PositiveInteger<number>) => void
  increase: (seconds: PositiveInteger<number>) => void
  pause: () => void
  restart: (time: PositiveInteger<number>, immediately?: boolean) => void
  resume: () => void
  start: () => void
  toggle: () => void
}

export interface UseTimer {
  (): UseTimerReturn

  (seconds: PositiveInteger<number>, callback: () => void): UseTimerReturn

  (seconds: PositiveInteger<number>, options?: UseTimerOptions): UseTimerReturn
}

export const useTimer = ((...params: unknown[]) => {
  const initialSeconds = Math.max((params[0] ?? 0) as PositiveInteger<number>, 0)
  const options = (typeof params[1] === 'object' ? params[1] : { onExpire: params[1] }) as
    | UseTimerOptions
    | undefined

  const [active, setActive] = useState(initialSeconds > 0 && (options?.immediately ?? true))
  const [seconds, setSeconds] = useState(initialSeconds)

  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const optionsRef = useRef<UseTimerOptions>(options)
  optionsRef.current = options ?? {}

  useDidUpdate(() => {
    if (initialSeconds <= 0) {
      setActive(false)
      setSeconds(0)
      return
    }

    setActive(true)
    setSeconds(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    if (!active) return

    optionsRef.current?.onStart?.()
    const onInterval = () => {
      setSeconds((prevSeconds) => {
        optionsRef.current?.onTick?.(prevSeconds)
        const updatedSeconds = prevSeconds - 1
        if (updatedSeconds === 0) {
          setActive(false)
          optionsRef.current?.onExpire?.()
        }
        return updatedSeconds
      })
    }

    intervalIdRef.current = setInterval(onInterval, 1000)
    return () => {
      clearInterval(intervalIdRef.current)
    }
  }, [active])

  const pause = () => setActive(false)
  const resume = () => {
    if (seconds <= 0) return
    setActive(true)
  }

  const toggle = () => {
    if (seconds <= 0) return
    setActive(!active)
  }

  const restart = (num: PositiveInteger<number>, immediately = true) => {
    setSeconds(num)
    if (immediately) setActive(true)
  }

  const start = () => {
    if (initialSeconds <= 0) return

    setActive(true)
    setSeconds(initialSeconds)
  }

  const clear = () => {
    setActive(false)
    setSeconds(0)
  }

  const increase = (num: PositiveInteger<number>) => setSeconds((prevSeconds) => prevSeconds + num)
  const decrease = (num: PositiveInteger<number>) => {
    setSeconds((prevSeconds) => {
      const updatedSeconds = prevSeconds - num
      if (updatedSeconds <= 0) {
        setActive(false)
        return 0
      } else {
        return updatedSeconds
      }
    })
  }

  return {
    ...getTimeFromSeconds(seconds),
    count: seconds,
    pause,
    active,
    resume,
    toggle,
    start,
    restart,
    clear,
    increase,
    decrease,
  }
}) as UseTimer
