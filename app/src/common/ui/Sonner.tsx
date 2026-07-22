import { AlertTriangle, CheckCircle, InfoCircle, XCircle2 } from 'reicon-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { Spinner } from './Spinner'

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-center"
      icons={{
        success: <CheckCircle className="size-4" />,
        info: <InfoCircle className="size-4" />,
        warning: <AlertTriangle className="size-4" />,
        error: <XCircle2 className="size-4" />,
        loading: <Spinner className="size-4" />,
      }}
      style={{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--foreground)',
        '--normal-border': 'var(--border)',
        '--border-radius': 'var(--radius)',
      }}
      toastOptions={{
        closeButton: true,
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  )
}
