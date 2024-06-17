"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Providers = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
