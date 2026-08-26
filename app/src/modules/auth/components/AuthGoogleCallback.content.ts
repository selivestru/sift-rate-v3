import { insert, t, type Dictionary } from 'intlayer'

const authGoogleCallbackContent = {
  key: 'auth-google-callback',
  content: {
    emailAlreadyLinked: t({
      en: 'This email is already linked to an account. Try signing in again, or contact us if that wasn’t you.',
      uk: 'Цю електронну адресу вже пов’язано з обліковим записом. Спробуйте увійти ще раз або зв’яжіться з нами, якщо це були не ви.',
      ru: 'Этот адрес электронной почты уже связан с аккаунтом. Попробуйте войти ещё раз или свяжитесь с нами, если это были не вы.',
    }),
    googleSignInFailed: t({
      en: 'Google sign-in failed. Please try again.',
      uk: 'Не вдалося увійти через Google. Спробуйте ще раз.',
      ru: 'Не удалось войти через Google. Попробуйте ещё раз.',
    }),
    googleSignInSuccessful: t({
      en: 'Google sign-in successful.',
      uk: 'Вхід через Google успішний.',
      ru: 'Вход через Google выполнен успешно.',
    }),
    success: t({
      en: 'Success',
      uk: 'Успішно',
      ru: 'Успешно',
    }),
    failed: t({
      en: 'Failed',
      uk: 'Не вдалося',
      ru: 'Не удалось',
    }),
    backToSignIn: insert(
      t({
        en: 'Back to {{signIn}}',
        uk: 'Повернутися до {{signIn}}',
        ru: 'Вернуться ко {{signIn}}',
      }),
    ),
  },
} satisfies Dictionary

export default authGoogleCallbackContent
