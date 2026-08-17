import { ArrowLeft } from 'reicon-react'

import { Button, type ButtonProps } from './Button'

type BackButtonProps = ButtonProps & {
  render: React.ReactNode
  params?: Record<string, string>
}

export const BackButton = ({ children, render, ...props }: BackButtonProps) => {
  return (
    <Button
      type="button"
      render={render}
      className="w-fit"
      startIcon={<ArrowLeft />}
      variant="secondary"
      {...props}
    >
      {children ?? 'Back'}
    </Button>
  )
}
