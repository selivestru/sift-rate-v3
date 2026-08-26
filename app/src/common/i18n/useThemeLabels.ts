import { useIntlayer } from 'react-intlayer'

import type { AccentColor } from '../theme/accent'
import type { ThemeMode } from '../theme/theme'

export const useThemeLabels = () => {
  const content = useIntlayer('theme')

  const themeLabels = {
    system: content.system.value,
    light: content.light.value,
    dark: content.dark.value,
  } as const satisfies Record<ThemeMode, string>

  const accentLabels = {
    red: content.red.value,
    orange: content.orange.value,
    yellow: content.yellow.value,
    green: content.green.value,
    teal: content.teal.value,
    cyan: content.cyan.value,
    blue: content.blue.value,
    indigo: content.indigo.value,
    purple: content.purple.value,
    pink: content.pink.value,
  } as const satisfies Record<AccentColor, string>

  return { themeLabels, accentLabels }
}
