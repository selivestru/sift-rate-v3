import type { DependencyList, EffectCallback } from 'react'
import { useLayoutEffect, useRef } from 'react'

export const useDidUpdate = (effect: EffectCallback, deps?: DependencyList) => {
  const mountedRef = useRef(false)

  useLayoutEffect(
    () => () => {
      mountedRef.current = false
    },
    [],
  )

  useLayoutEffect(() => {
    if (mountedRef.current) {
      return effect()
    }

    mountedRef.current = true
    return undefined
  }, deps)
}
