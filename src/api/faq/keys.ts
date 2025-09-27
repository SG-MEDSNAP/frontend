export const faqKeys = {
  all: ['faqs'] as const,
  lists: () => [...faqKeys.all, 'list'] as const,
  list: (filters?: { category?: string; search?: string }) =>
    [...faqKeys.lists(), { filters }] as const,
  detail: (id: number) => [...faqKeys.all, 'detail', id] as const,
};
