import { Transform } from 'class-transformer'

export const Trim = () => {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value
    }

    return value.trim()
  })
}
