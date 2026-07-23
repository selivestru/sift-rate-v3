export const mockDelay = (ms = 500) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
