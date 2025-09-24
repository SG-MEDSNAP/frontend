// Basic validators for Join form

export function isKoreanEnglishName(value: string): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 15) return false;
  // 자음/모음 단독(ㄱ-ㅎ, ㅏ-ㅣ)도 허용하여 입력 중 조합 이슈 방지
  return /^[a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]+$/.test(trimmed);
}

// Validate YYYY.MM.DD with real calendar bounds (supports leap year)
export function isValidBirthYYYYMMDD(value: string): boolean {
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(value)) return false;
  const [yStr, mStr, dStr] = value.split('.');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);
  if (y < 1900 || y > 2100) return false;
  if (m < 1 || m > 12) return false;
  const daysInMonth = new Date(y, m, 0).getDate();
  return d >= 1 && d <= daysInMonth;
}

// Accepts '010-0000-0000' or digits; validates Korean mobile numbers
export function isValidKoreanMobile(input: string): boolean {
  const digits = (input || '').replace(/\D/g, '');
  // 010,011,016,017,018,019 + 7~8 digits => total 10 or 11
  return /^01[016789]\d{7,8}$/.test(digits);
}
