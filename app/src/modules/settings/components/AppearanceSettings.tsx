import { AnimatePresence, motion } from 'motion/react'
import { useIntlayer } from 'react-intlayer'
import { Check, Monitor, Moon, Sun } from 'reicon-react'

import { LOCALES, LOCALE_NATIVE_NAMES, useAppLocale, useThemeLabels } from '~/common/i18n'
import {
  ACCENT_COLORS,
  ACCENT_PREVIEW,
  THEME_MODES,
  useTheme,
  type ThemeMode,
} from '~/common/theme'
import { PageHeader } from '~/common/ui/PageHeader'
import { cn } from '~/common/utils/cn'

import { appearanceNavItem } from '../constants/settings-nav'
import { SettingsSection } from './SettingsSection'

const THEME_ICONS: Record<ThemeMode, typeof Monitor> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

export const AppearanceSettings = () => {
  const { theme, setTheme, accent, setAccent } = useTheme()
  const { locale, setLocale } = useAppLocale()
  const { themeLabels, accentLabels } = useThemeLabels()
  const content = useIntlayer('appearance-settings')
  const shared = useIntlayer('shared')
  const settingsNav = useIntlayer('settings-nav')

  return (
    <div className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-6">
      <PageHeader
        icon={appearanceNavItem.icon}
        label={shared.settings.value}
        title={settingsNav.appearance.value}
        description={content.pageDescription.value}
      />

      <div className="flex flex-col gap-4 sm:gap-5">
        <SettingsSection
          title={content.themeTitle.value}
          description={content.themeDescription.value}
        >
          <div
            role="radiogroup"
            aria-label={content.themeTitle.value}
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {THEME_MODES.map((mode) => {
              const selected = theme === mode
              const Icon = THEME_ICONS[mode]
              return (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${themeLabels[mode]}${selected ? content.selectedSuffix.value : ''}`}
                  onClick={() => setTheme(mode)}
                  className={cn(
                    'border-border bg-background hover:bg-accent flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors duration-300',
                    'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
                    selected && 'border-ring bg-accent ring-ring/30 ring-2',
                  )}
                >
                  <span
                    className={cn(
                      'border-border bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border',
                      selected && 'bg-primary text-primary-foreground border-transparent',
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium">{themeLabels[mode]}</span>
                    <span className="text-muted-foreground text-xs"></span>
                  </span>
                  {selected && <Check className="text-primary size-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        </SettingsSection>

        <SettingsSection
          title={content.languageTitle.value}
          description={content.languageDescription.value}
        >
          <div
            role="radiogroup"
            aria-label={content.languageGroupLabel.value}
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {LOCALES.map((option) => {
              const selected = locale === option
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${LOCALE_NATIVE_NAMES[option]}${selected ? content.selectedSuffix.value : ''}`}
                  onClick={() => setLocale(option)}
                  className={cn(
                    'border-border bg-background hover:bg-accent flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors duration-300',
                    'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
                    selected && 'border-ring bg-accent ring-ring/30 ring-2',
                  )}
                >
                  <span
                    className={cn(
                      'border-border bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border text-xs font-medium uppercase',
                      selected && 'bg-primary text-primary-foreground border-transparent',
                    )}
                  >
                    {option}
                  </span>
                  <span className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium">{LOCALE_NATIVE_NAMES[option]}</span>
                    <span className="text-muted-foreground text-xs"></span>
                  </span>
                  {selected && <Check className="text-primary size-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        </SettingsSection>

        <SettingsSection
          title={content.accentTitle.value}
          description={content.accentDescription.value}
        >
          <div
            role="radiogroup"
            aria-label={content.accentTitle.value}
            className="flex flex-wrap gap-3"
          >
            {ACCENT_COLORS.map((color) => {
              const selected = accent === color
              return (
                <button
                  style={{
                    '--accent-color': ACCENT_PREVIEW[color],
                  }}
                  key={color}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${accentLabels[color]}${selected ? content.selectedSuffix.value : ''}`}
                  onClick={() => setAccent(color)}
                  className={cn(
                    'group flex flex-col items-center gap-2 rounded-xl p-1.5 transition-colors duration-300',
                    'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
                  )}
                >
                  <span
                    className={cn(
                      'relative flex size-11 items-center justify-center rounded-full border-2 transition-[border-color,box-shadow] duration-300',
                      selected
                        ? 'border-(--accent-color)'
                        : 'border-transparent group-hover:border-border',
                    )}
                  >
                    <span className="size-8 rounded-full bg-(--accent-color) shadow-inner transition-[background-color] duration-300" />
                    <AnimatePresence>
                      {selected && (
                        <motion.span
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="absolute"
                        >
                          <Check className="size-4 text-white drop-shadow-sm" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium transition-colors duration-300',
                      selected ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {accentLabels[color]}
                  </span>
                </button>
              )
            })}
          </div>
        </SettingsSection>
      </div>
    </div>
  )
}
