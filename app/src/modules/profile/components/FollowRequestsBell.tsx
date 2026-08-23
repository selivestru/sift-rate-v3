import { Link } from '@tanstack/react-router'
import { UserAdd } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/common/ui/Tooltip'

import { useGetFollowRequestsCountQuery } from '../hooks/useGetFollowRequestsCountQuery'

export const FollowRequestsBell = () => {
  const { data, isLoading } = useGetFollowRequestsCountQuery()

  const count = data?.count ?? 0

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            isIconOnly
            variant="secondary"
            render={
              <Link to="/follow-requests" aria-label="Follow requests" className="relative" />
            }
          />
        }
      >
        <UserAdd className="size-5" />

        {isLoading && (
          <span className="bg-primary absolute -top-0.5 -right-1 size-4 animate-pulse rounded-full" />
        )}

        {!isLoading && count > 0 && (
          <>
            <span className="bg-primary absolute -top-0.5 -right-1 size-4 animate-ping rounded-full motion-reduce:animate-none" />

            <span className="bg-primary text-primary-foreground ring-background absolute -top-0.5 -right-1 flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-4 font-semibold tabular-nums ring-2">
              {count > 99 ? '99+' : count}
            </span>
          </>
        )}
      </TooltipTrigger>
      <TooltipContent>Follow requests</TooltipContent>
    </Tooltip>
  )
}
