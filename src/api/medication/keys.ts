export const medicationKeys = {
  all: ['medications'] as const,
  lists: () => [...medicationKeys.all, 'list'] as const,
  list: (filters?: unknown) =>
    [...medicationKeys.lists(), { filters }] as const,
  detail: (id: number) => [...medicationKeys.all, 'detail', id] as const,
  records: (date: string) => [...medicationKeys.all, 'records', date] as const,
  recordDates: (year: number, month: number) =>
    [...medicationKeys.all, 'record-dates', { year, month }] as const,
};
