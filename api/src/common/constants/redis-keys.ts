export const REDIS_KEYS = {
  EMAIL_VERIFY: (id: string) => `email_verify:${id}`,
  EMAIL_VERIFY_TOKEN: (token: string) => `email_verify_token:${token}`,
  PASSWORD_RESET: (id: string) => `pwreset:${id}`,
  PASSWORD_RESET_TOKEN: (hash: string) => `pwreset_token:${hash}`,
  EMAIL_CHANGE: (id: string) => `email_change:${id}`,
  EMAIL_CHANGE_TOKEN: (hash: string) => `email_change_token:${hash}`,
  TWO_FA: (id: string) => `2fa:${id}`,
  USER_SESSIONS: (id: string) => `user_sessions:${id}`,
  DELETE_ACCOUNT: (id: string) => `delete_account:${id}`,
  DELETE_ACCOUNT_TOKEN: (hash: string) => `delete_account_token:${hash}`,
}
