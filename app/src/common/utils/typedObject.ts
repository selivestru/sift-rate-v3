export const objectKeys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>

export const objectValues = <T extends object>(obj: T) => Object.values(obj) as Array<T[keyof T]>

export const objectEntries = <T extends object>(obj: T) =>
  Object.entries(obj) as Array<
    {
      [K in keyof T]: [K, T[K]]
    }[keyof T]
  >
