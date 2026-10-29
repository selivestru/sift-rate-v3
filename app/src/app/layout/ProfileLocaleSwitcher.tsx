import { useIntlayer } from 'react-intlayer'

import EnFlag from '~/common/assets/icons/en.svg?react'
import RuFlag from '~/common/assets/icons/ru.svg?react'
import UkFlag from '~/common/assets/icons/uk.svg?react'
import { LOCALES, LOCALE_NATIVE_NAMES, useAppLocale, type AppLocale } from '~/common/i18n'
import { Button } from '~/common/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/common/ui/DropdownMenu'

const flagIcon: Record<AppLocale, React.JSX.Element> = {
  en: <EnFlag />,
  uk: <UkFlag />,
  ru: <RuFlag />,
}

const LocaleOptions = ({ locale, setLocale }: ReturnType<typeof useAppLocale>) => {
  const content = useIntlayer('profile-locale-switcher')

  return (
    <DropdownMenuRadioGroup value={locale} onValueChange={setLocale}>
      {LOCALES.map((option) => {
        const selected = locale === option
        return (
          <DropdownMenuRadioItem
            key={option}
            value={option}
            aria-label={`${LOCALE_NATIVE_NAMES[option]}${selected ? content.selectedSuffix.value : ''}`}
          >
            {flagIcon[option]}
            {LOCALE_NATIVE_NAMES[option]}
          </DropdownMenuRadioItem>
        )
      })}
    </DropdownMenuRadioGroup>
  )
}

export const ProfileLocaleSwitcher = () => {
  const { locale, setLocale } = useAppLocale()
  const content = useIntlayer('profile-locale-switcher')

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="cursor-pointer">
        {content.languageLabel.value}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent aria-label={content.languageGroupLabel.value}>
        <LocaleOptions locale={locale} setLocale={setLocale} />
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

export const GuestLocaleSwitcher = () => {
  const { locale, setLocale } = useAppLocale()
  const content = useIntlayer('profile-locale-switcher')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="secondary" size="sm" aria-label={content.languageLabel.value}>
            {locale.toUpperCase()}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-fit">
        <LocaleOptions locale={locale} setLocale={setLocale} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
