export interface SessionMetadata {
  browser: UAParser.IBrowser
  os: UAParser.IOS
  device: UAParser.IDevice
  ip: string | undefined
}

export interface UserSession extends SessionMetadata {
  sid: string
  isCurrent: boolean
}
