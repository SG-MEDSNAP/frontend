import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // 실패 시 2번 재시도
      staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 간주
      gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    },
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
