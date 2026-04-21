import ja from '../../locales/ja.json'
import en from '../../locales/en.json'
import zh from '../../locales/zh.json'

export type LocaleCode = 'ja' | 'en' | 'zh'

export const messages: Record<LocaleCode, Record<string, any>> = {
  ja,
  en,
  zh
}

export const languages = [
  { code: 'zh', label: 'CH' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JA' }
] as const
