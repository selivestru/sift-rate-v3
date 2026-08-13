export type SessionMetadata = {
  browser: UAParser.IBrowser
  os: UAParser.IOS
  device: UAParser.IDevice
  ip: string | undefined
}

export type UserSession = SessionMetadata & {
  sid: string
  isCurrent: boolean
}
