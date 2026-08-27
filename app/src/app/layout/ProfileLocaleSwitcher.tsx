import { useIntlayer } from 'react-intlayer'

import EnFlag from '~/common/assets/icons/en.svg?react'
import RuFlag from '~/common/assets/icons/ru.svg?react'
import UkFlag from '~/common/assets/icons/uk.svg?react'
import { LOCALES, LOCALE_NATIVE_NAMES, useAppLocale, type AppLocale } from '~/common/i18n'
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '~/common/ui/DropdownMenu'

const flagIcon: Record<AppLocale, React.JSX.Element> = {
  en: <EnFlag />,
  uk: <UkFlag />,
  ru: <RuFlag />,
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
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
