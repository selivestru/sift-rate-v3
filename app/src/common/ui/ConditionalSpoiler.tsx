import { Spoiler } from 'spoiled'

import 'spoiled/style.css'

interface ConditionalSpoilerProps extends React.PropsWithChildren {
  isSpoiler: boolean
}

export const ConditionalSpoiler = ({ isSpoiler, children, ...props }: ConditionalSpoilerProps) => {
  if (isSpoiler) {
    return (
      <Spoiler revealOn="click" tagName="div" theme="dark" {...props}>
        {children}
      </Spoiler>
    )
  }

  return <div {...props}>{children}</div>
}
