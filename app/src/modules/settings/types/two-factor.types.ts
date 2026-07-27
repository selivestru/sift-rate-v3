export interface TwoFactorSetupResponse {
  otpauthUrl: string
  secret: string
}

export interface TwoFactorToggleResponse {
  twoFactorEnabled: boolean
}
