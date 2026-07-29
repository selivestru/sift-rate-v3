import { Transform } from 'class-transformer'

export const ToLowerCase = () => {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value
    }

    return value.toLowerCase()
  })
}
