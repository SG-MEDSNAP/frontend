import { z } from 'zod';

const NAME_REGEX = /^[A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ ]{1,15}$/u;

export const medicationSchema = z.object({
  name: z
    .string()
    .min(1, '약 이름을 입력해주세요.')
    .max(15, '최대 15자까지 가능합니다.')
    .refine((v) => NAME_REGEX.test(v), '한글/영문과 공백만 입력 가능합니다.'),
  times: z
    .array(z.string().regex(/^\d{2}:\d{2}$/))
    .min(1, '시간을 최소 1개 추가해주세요.')
    .refine((a) => new Set(a).size === a.length, '시간이 중복되었습니다.'),
  caregiverPhone: z
    .string()
    .optional()
    .refine((v) => {
      if (!v) return true;
      const digits = v.replace(/\D/g, '');
      return /^01[016789]\d{7,8}$/.test(digits);
    }, '전화번호 형식이 올바르지 않습니다.'),
});

export type MedicationForm = z.infer<typeof medicationSchema>;
