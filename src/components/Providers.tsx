"use client";

import { FC, ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "../providers/LocalizationProvider";
import { AuthProvider } from "../providers/AuthProvider";

type ProvidersProps = {
  children: ReactNode;
};

export const Providers: FC<ProvidersProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider>
        <AuthProvider>{children}</AuthProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};
