/**
 * Vitest: 体験レッスン申し込みフォーム バリデーションテスト
 */
import { describe, it, expect } from 'vitest';
import { validateTrialForm, validateField, type TrialFormData } from '../../src/lib/formValidation';

// ─── Helpers ───────────────────────────────────────────────────────────────

const validData: TrialFormData = {
  name:          '山田 花子',
  kana:          'ヤマダ ハナコ',
  email:         'hanako@example.com',
  phone:         '090-1234-5678',
  instrument:    'piano',
  privacyAgreed: true,
};

function withOverride(override: Partial<TrialFormData>): TrialFormData {
  return { ...validData, ...override };
}

// ─── validateTrialForm ──────────────────────────────────────────────────────

describe('validateTrialForm — 正常系', () => {
  it('すべて正しいデータ → valid=true かつ errors={}', () => {
    const result = validateTrialForm(validData);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('電話番号にハイフンなし（数字のみ）でも通る', () => {
    const result = validateTrialForm(withOverride({ phone: '09012345678' }));
    expect(result.valid).toBe(true);
  });

  it('すべての有効な楽器で valid=true になる', () => {
    for (const inst of ['piano', 'guitar', 'violin', 'vocal', 'flute']) {
      const result = validateTrialForm(withOverride({ instrument: inst }));
      expect(result.valid, `instrument="${inst}" should be valid`).toBe(true);
    }
  });
});

// ─── name field ────────────────────────────────────────────────────────────

describe('validateTrialForm — name フィールド', () => {
  it('空文字 → エラー', () => {
    const { errors } = validateTrialForm(withOverride({ name: '' }));
    expect(errors.name).toBeTruthy();
  });

  it('スペースのみ → エラー', () => {
    const { errors } = validateTrialForm(withOverride({ name: '   ' }));
    expect(errors.name).toBeTruthy();
  });

  it('51文字 → 文字数エラー', () => {
    const { errors } = validateTrialForm(withOverride({ name: 'あ'.repeat(51) }));
    expect(errors.name).toBeTruthy();
  });

  it('50文字 → エラーなし', () => {
    const { errors } = validateTrialForm(withOverride({ name: 'あ'.repeat(50) }));
    expect(errors.name).toBeUndefined();
  });
});

// ─── kana field ────────────────────────────────────────────────────────────

describe('validateTrialForm — kana フィールド', () => {
  it('空文字 → エラー', () => {
    const { errors } = validateTrialForm(withOverride({ kana: '' }));
    expect(errors.kana).toBeTruthy();
  });

  it('ひらがな → カタカナエラー', () => {
    const { errors } = validateTrialForm(withOverride({ kana: 'やまだはなこ' }));
    expect(errors.kana).toMatch(/カタカナ/);
  });

  it('英字混入 → カタカナエラー', () => {
    const { errors } = validateTrialForm(withOverride({ kana: 'Yamada Hanako' }));
    expect(errors.kana).toBeTruthy();
  });

  it('カタカナ+スペース → エラーなし', () => {
    const { errors } = validateTrialForm(withOverride({ kana: 'ヤマダ ハナコ' }));
    expect(errors.kana).toBeUndefined();
  });

  it('全角カタカナ（スペースなし） → エラーなし', () => {
    const { errors } = validateTrialForm(withOverride({ kana: 'ヤマダハナコ' }));
    expect(errors.kana).toBeUndefined();
  });

  it('51文字 → 文字数エラー', () => {
    const { errors } = validateTrialForm(withOverride({ kana: 'ア'.repeat(51) }));
    expect(errors.kana).toBeTruthy();
  });
});

// ─── email field ───────────────────────────────────────────────────────────

describe('validateTrialForm — email フィールド', () => {
  it('空文字 → エラー', () => {
    const { errors } = validateTrialForm(withOverride({ email: '' }));
    expect(errors.email).toBeTruthy();
  });

  it('@なし → フォーマットエラー', () => {
    const { errors } = validateTrialForm(withOverride({ email: 'invalid-email' }));
    expect(errors.email).toBeTruthy();
  });

  it('ドメインなし → フォーマットエラー', () => {
    const { errors } = validateTrialForm(withOverride({ email: 'user@' }));
    expect(errors.email).toBeTruthy();
  });

  it('スペース入り → フォーマットエラー', () => {
    const { errors } = validateTrialForm(withOverride({ email: 'user @example.com' }));
    expect(errors.email).toBeTruthy();
  });

  it('正常なメール → エラーなし', () => {
    for (const email of ['user@example.com', 'user+tag@sub.domain.co.jp']) {
      const { errors } = validateTrialForm(withOverride({ email }));
      expect(errors.email, `email="${email}" should be valid`).toBeUndefined();
    }
  });
});

// ─── phone field ───────────────────────────────────────────────────────────

describe('validateTrialForm — phone フィールド', () => {
  it('空文字 → エラー', () => {
    const { errors } = validateTrialForm(withOverride({ phone: '' }));
    expect(errors.phone).toBeTruthy();
  });

  it('英字混入 → フォーマットエラー', () => {
    const { errors } = validateTrialForm(withOverride({ phone: '090-abc-5678' }));
    expect(errors.phone).toBeTruthy();
  });

  it('桁数が少ない（9桁以下） → 桁数エラー', () => {
    const { errors } = validateTrialForm(withOverride({ phone: '090-123-4' }));
    expect(errors.phone).toBeTruthy();
  });

  it('10桁 → エラーなし', () => {
    const { errors } = validateTrialForm(withOverride({ phone: '0312345678' }));
    expect(errors.phone).toBeUndefined();
  });

  it('国際形式 +81-90-1234-5678 → エラーなし', () => {
    const { errors } = validateTrialForm(withOverride({ phone: '+81-90-1234-5678' }));
    expect(errors.phone).toBeUndefined();
  });
});

// ─── instrument field ──────────────────────────────────────────────────────

describe('validateTrialForm — instrument フィールド', () => {
  it('未選択（空文字） → エラー', () => {
    const { errors } = validateTrialForm(withOverride({ instrument: '' }));
    expect(errors.instrument).toBeTruthy();
  });

  it('不正な値 → エラー', () => {
    const { errors } = validateTrialForm(withOverride({ instrument: 'trumpet' }));
    expect(errors.instrument).toBeTruthy();
  });

  it('guitar → エラーなし', () => {
    const { errors } = validateTrialForm(withOverride({ instrument: 'guitar' }));
    expect(errors.instrument).toBeUndefined();
  });
});

// ─── privacy field ─────────────────────────────────────────────────────────

describe('validateTrialForm — privacy フィールド', () => {
  it('false → エラー', () => {
    const { errors } = validateTrialForm(withOverride({ privacyAgreed: false }));
    expect(errors.privacy).toBeTruthy();
  });

  it('true → エラーなし', () => {
    const { errors } = validateTrialForm(withOverride({ privacyAgreed: true }));
    expect(errors.privacy).toBeUndefined();
  });
});

// ─── 複数エラー ──────────────────────────────────────────────────────────────

describe('validateTrialForm — 複数エラー', () => {
  it('すべて空 → valid=false かつ全フィールドにエラー', () => {
    const result = validateTrialForm({
      name:          '',
      kana:          '',
      email:         '',
      phone:         '',
      instrument:    '',
      privacyAgreed: false,
    });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(5);
  });

  it('name と email だけ不正 → errors に name と email のみ', () => {
    const result = validateTrialForm(withOverride({ name: '', email: 'bad-email' }));
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.phone).toBeUndefined();
    expect(result.errors.kana).toBeUndefined();
  });
});

// ─── validateField ─────────────────────────────────────────────────────────

describe('validateField — 単一フィールド検証', () => {
  it('name: 空文字 → エラーメッセージ', () => {
    expect(validateField('name', '')).toBeTruthy();
  });

  it('name: 正常値 → null', () => {
    expect(validateField('name', '田中 太郎')).toBeNull();
  });

  it('email: 不正 → エラーメッセージ', () => {
    expect(validateField('email', 'not-an-email')).toBeTruthy();
  });

  it('email: 正常値 → null', () => {
    expect(validateField('email', 'test@example.com')).toBeNull();
  });

  it('privacyAgreed: false → エラーメッセージ', () => {
    expect(validateField('privacyAgreed', false)).toBeTruthy();
  });
});
