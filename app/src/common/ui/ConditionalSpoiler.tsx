import { Spoiler } from 'spoiled'

import 'spoiled/style.css'
import { useTheme } from '../theme'

interface ConditionalSpoilerProps extends React.PropsWithChildren {
  isSpoiler: boolean
}

export const ConditionalSpoiler = ({ isSpoiler, children, ...props }: ConditionalSpoilerProps) => {
  const { resolvedTheme } = useTheme()

  if (isSpoiler) {
    return (
      <Spoiler revealOn="click" tagName="div" theme={resolvedTheme} {...props}>
        {children}
      </Spoiler>
    )
  }

  return <div {...props}>{children}</div>
}
