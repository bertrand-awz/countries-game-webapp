export const SUPPORTED_ANSWER_VALIDATION_LANGUAGES = ["fr", "en", "de", "es", "ja"] as const;
export const ANY_ANSWER_VALIDATION_LANGUAGE = "any";

export type SupportedLanguage = (typeof SUPPORTED_ANSWER_VALIDATION_LANGUAGES)[number];
export type AnswerValidationLanguage = SupportedLanguage | typeof ANY_ANSWER_VALIDATION_LANGUAGE;

export function isSupportedLanguage(language: string): language is SupportedLanguage {
  return SUPPORTED_ANSWER_VALIDATION_LANGUAGES.includes(language as SupportedLanguage);
}

export function isAnswerValidationLanguage(language: string): language is AnswerValidationLanguage {
  return (
    language === ANY_ANSWER_VALIDATION_LANGUAGE ||
    SUPPORTED_ANSWER_VALIDATION_LANGUAGES.includes(language as SupportedLanguage)
  );
}
