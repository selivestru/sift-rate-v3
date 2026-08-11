declare global {
  interface ObjectConstructor {
    keys<T extends object>(obj: T): Array<keyof T>

    values<T extends object>(obj: T): Array<T[keyof T]>

    entries<T extends object>(
      obj: T,
    ): Array<
      {
        [K in keyof T]: [K, T[K]]
      }[keyof T]
    >
  }
}
