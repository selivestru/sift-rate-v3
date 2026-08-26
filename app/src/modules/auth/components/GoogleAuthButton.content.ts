import { t, type Dictionary } from 'intlayer'

const googleAuthButtonContent = {
  key: 'google-auth-button',
  content: {
    continueWithGoogle: t({
      en: 'Continue with Google',
      uk: 'Продовжити через Google',
      ru: 'Продолжить через Google',
    }),
  },
} satisfies Dictionary

export default googleAuthButtonContent
