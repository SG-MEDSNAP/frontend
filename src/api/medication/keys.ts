export const medicationKeys = {
  all: ['medications'] as const,
  lists: () => [...medicationKeys.all, 'list'] as const,
  list: (filters?: unknown) =>
    [...medicationKeys.lists(), { filters }] as const,
  detail: (id: number) => [...medicationKeys.all, 'detail', id] as const,
};

