import { useState } from 'react'

import { copy } from '../utils/copy'

export interface UseCopyReturn {
  copied: boolean
  value?: string
  copy: (value: string) => Promise<void>
}

export interface UseCopyParams {
  resetDelay?: number
}

export const useCopy = (delay: number = 1000): UseCopyReturn => {
  const [value, setValue] = useState<string | undefined>()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    await copy(text)
    setValue(text)
    setCopied(true)
    setTimeout(setCopied, delay, false)
  }

  return { value, copied, copy: copyToClipboard }
}
