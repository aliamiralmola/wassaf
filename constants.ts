import { ToneOfVoice, OutputLanguage, DescriptionLength } from './types';

export const TONE_OPTIONS = [
  { value: ToneOfVoice.Professional, label: 'احترافي' },
  { value: ToneOfVoice.Friendly, label: 'ودود' },
  { value: ToneOfVoice.Witty, label: 'ذكي / فكاهي' },
  { value: ToneOfVoice.Persuasive, label: 'مقنع / تسويقي' },
  { value: ToneOfVoice.Luxurious, label: 'فاخر' },
  { value: ToneOfVoice.Simple, label: 'بسيط ومباشر' },
];

export const LANGUAGE_OPTIONS = [
    { value: OutputLanguage.Arabic, label: 'العربية' },
    { value: OutputLanguage.English, label: 'English' },
    { value: OutputLanguage.French, label: 'Français' },
    { value: OutputLanguage.Spanish, label: 'Español' },
];

export const LENGTH_OPTIONS = [
    { value: DescriptionLength.Short, label: 'قصير' },
    { value: DescriptionLength.Medium, label: 'متوسط' },
    { value: DescriptionLength.Long, label: 'طويل' },
];