"use client";


import { Toaster } from "sonner";
import * as React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProvider from "@/src/context/user.provider";
import { Provider } from "react-redux";
import { store } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks";
import { hydrate } from "@/src/redux/slices/authSlice";


const queryClient = new QueryClient();

function HydrationWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  return <>{children}</>;
}

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <HydrationWrapper>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <Toaster />
            {children}
          </UserProvider>
        </QueryClientProvider>
      </HydrationWrapper>
    </Provider>
  );
}
