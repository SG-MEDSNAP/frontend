export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  tokens: () => [...authKeys.all, 'tokens'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
} as const;
