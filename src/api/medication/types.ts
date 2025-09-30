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

// Medication record status types
export type MedicationRecordStatus = 'TAKEN' | 'PENDING' | 'SKIPPED';

// Medication record item
export interface MedicationRecordItem {
  recordId?: number;
  alarmTime: string;
  medicationId: number;
  medicationName: string;
  status: MedicationRecordStatus;
  imageUrl?: string;
  checkedAt?: string;
  firstAlarmAt?: string;
  secondAlarmAt?: string;
  caregiverNotifiedAt?: string;
}

// Response for GET /medication-records
export interface MedicationRecordsResponse {
  date: string;
  items: MedicationRecordItem[];
}

// Response for GET /medication-records/dates
export type MedicationRecordDates = string[];

// Standard API envelope
export interface ApiResponse<T = MedicationData> {
  code: string;
  httpStatus: number;
  message: string;
  data: T;
  error: null | any;
}
