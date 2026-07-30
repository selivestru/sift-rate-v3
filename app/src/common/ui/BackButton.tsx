import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'reicon-react'

import type { FileRoutesByTo } from '~/app/routeTree.gen'

import { Button, type ButtonProps } from './Button'

type BackButtonProps = ButtonProps & {
  to: keyof FileRoutesByTo
}

export const BackButton = ({ children, to, ...props }: BackButtonProps) => {
  return (
    <Button
      type="button"
      render={<Link to={to} />}
      className="w-fit"
      startIcon={<ArrowLeft />}
      variant="secondary"
      {...props}
    >
      {children ?? 'Back'}
    </Button>
  )
}
