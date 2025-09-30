// Shared types for medication APIs

export type DoseDay =
  | 'MON'
  | 'TUE'
  | 'WED'
  | 'THU'
  | 'FRI'
  | 'SAT'
  | 'SUN'
  | 'DAILY';

// Request payload for registering a medication
export interface MedicationRegisterRequest {
  name: string;
  preNotify: boolean;
  doseTimes: string[]; // "HH:mm"
  doseDays: DoseDay[];
}

// Medication resource returned by API
export interface MedicationData {
  id: number;
  name: string;
  imageUrl: string;
  preNotify: boolean;
  doseTimes: string[];
  doseDays: DoseDay[];
  createdAt: string;
  updatedAt: string;
}

// Standard API envelope
export interface ApiResponse<T = MedicationData> {
  code: string;
  httpStatus: number;
  message: string;
  data: T;
  error: null | any;
}
