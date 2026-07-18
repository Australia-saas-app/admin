"use client";

import { Toaster } from "sonner";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProvider from "@/src/context/user.provider";
import { LocaleProvider } from "@/src/shared/context/locale.provider";
import { ThemeProvider } from "@/src/shared/context/theme.provider";
import { NotificationProvider } from "@/src/shared/context/notification.provider";
import { installGlobalErrorReporting } from "@/src/lib/error-reporter";
import { OfflineBanner } from "@/src/shared/components/OfflineBanner";

export interface ProvidersProps {
  children: React.ReactNode;
}

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          const status = (error as { status?: number })?.status;
          if (status && status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: ProvidersProps) {
  // useState keeps QueryClient off the Server→Client serialization boundary
  const [queryClient] = React.useState(getQueryClient);

  // Capture uncaught errors / unhandled rejections app-wide (idempotent).
  React.useEffect(() => {
    installGlobalErrorReporting();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <LocaleProvider>
            <NotificationProvider>
              <Toaster position="top-right" richColors closeButton />
              <OfflineBanner />
              {children}
            </NotificationProvider>
          </LocaleProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
