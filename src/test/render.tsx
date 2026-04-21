import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n/config";

// Shared harness: Router + QueryClient + i18n so any rd/* component can
// render without pulling in App.tsx. Tests can still override by passing
// their own wrapper via RenderOptions.

interface Options extends Omit<RenderOptions, "wrapper"> {
  route?: string;
}

export function renderWithProviders(ui: ReactElement, { route = "/", ...rest }: Options = {}) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  const utils = render(
    <QueryClientProvider client={qc}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
    rest
  );
  return { ...utils, i18n, queryClient: qc };
}
