/**
 * 体験レッスン申し込みフォーム バリデーション
 * Trial lesson form validation utilities
 */

export interface TrialFormData {
  name: string;
  kana: string;
  email: string;
  phone: string;
  instrument: string;
  privacyAgreed: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const VALID_INSTRUMENTS = ['piano', 'guitar', 'violin', 'vocal', 'flute'] as const;
export type Instrument = typeof VALID_INSTRUMENTS[number];

// Katakana pattern (full-width katakana + space)
const KATAKANA_RE = /^[\u30A0-\u30FF\s　]+$/;

// Basic email pattern
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Phone: digits, hyphens, plus, parentheses (Japanese / international)
const PHONE_RE = /^[\d\-+()（）\s]+$/;
const PHONE_MIN_DIGITS = 10;

/** Count only digit characters in a string */
function countDigits(s: string): number {
  return (s.match(/\d/g) ?? []).length;
}

/**
 * Validate the trial lesson application form data.
 * Returns { valid, errors } where errors is a map of field → message.
 */
export function validateTrialForm(data: TrialFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // --- Name ---
  if (!data.name.trim()) {
    errors.name = 'お名前を入力してください';
  } else if (data.name.trim().length > 50) {
    errors.name = 'お名前は50文字以内で入力してください';
  }

  // --- Kana ---
  if (!data.kana.trim()) {
    errors.kana = 'フリガナを入力してください';
  } else if (!KATAKANA_RE.test(data.kana.trim())) {
    errors.kana = 'フリガナはカタカナで入力してください';
  } else if (data.kana.trim().length > 50) {
    errors.kana = 'フリガナは50文字以内で入力してください';
  }

  // --- Email ---
  if (!data.email.trim()) {
    errors.email = 'メールアドレスを入力してください';
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = '正しいメールアドレスを入力してください';
  } else if (data.email.trim().length > 254) {
    errors.email = 'メールアドレスが長すぎます';
  }

  // --- Phone ---
  if (!data.phone.trim()) {
    errors.phone = '電話番号を入力してください';
  } else if (!PHONE_RE.test(data.phone)) {
    errors.phone = '電話番号は数字・ハイフンで入力してください';
  } else if (countDigits(data.phone) < PHONE_MIN_DIGITS) {
    errors.phone = '電話番号は10桁以上で入力してください';
  } else if (countDigits(data.phone) > 15) {
    errors.phone = '電話番号が長すぎます';
  }

  // --- Instrument ---
  if (!data.instrument) {
    errors.instrument = 'ご希望の楽器を選択してください';
  } else if (!VALID_INSTRUMENTS.includes(data.instrument as Instrument)) {
    errors.instrument = '正しい楽器を選択してください';
  }

  // --- Privacy ---
  if (!data.privacyAgreed) {
    errors.privacy = 'プライバシーポリシーへの同意が必要です';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Maps TrialFormData field names to the error key used in ValidationResult.errors.
 * Most match 1:1, but privacyAgreed → privacy.
 */
const FIELD_TO_ERROR_KEY: Record<keyof TrialFormData, string> = {
  name:          'name',
  kana:          'kana',
  email:         'email',
  phone:         'phone',
  instrument:    'instrument',
  privacyAgreed: 'privacy',
};

/**
 * Validate a single field by name. Returns error message or null.
 */
export function validateField(
  field: keyof TrialFormData,
  value: string | boolean
): string | null {
  // Build a minimal data object with defaults
  const defaults: TrialFormData = {
    name:          'テスト太郎',
    kana:          'テストタロウ',
    email:         'test@example.com',
    phone:         '090-0000-0000',
    instrument:    'piano',
    privacyAgreed: true,
  };

  const data = { ...defaults, [field]: value };
  const result = validateTrialForm(data);
  const errorKey = FIELD_TO_ERROR_KEY[field];
  return result.errors[errorKey] ?? null;
}
