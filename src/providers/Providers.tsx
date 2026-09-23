"use client";

import { FC, ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "./LocalizationProvider";
import { AuthProvider } from "./AuthProvider";
import { FirebaseProvider } from "./FirebaseProvider";

type ProvidersProps = {
  children: ReactNode;
};

export const Providers: FC<ProvidersProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider>
        <FirebaseProvider>
          <AuthProvider>{children}</AuthProvider>
        </FirebaseProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};
