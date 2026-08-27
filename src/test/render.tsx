import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { HelmetProvider } from "react-helmet-async";
import i18n from "@/i18n/config";

// Shared harness: Router + QueryClient + i18n + Helmet so any rd/* component
// or full page can render without pulling in App.tsx. Tests can still override
// by passing their own wrapper via RenderOptions.
//
// HelmetProvider is here because any page rendering <SEO /> throws
// "Cannot read properties of undefined (reading 'add')" without it — which
// made every page-level component untestable, not just the one that hit it.

interface Options extends Omit<RenderOptions, "wrapper"> {
  route?: string;
}

export function renderWithProviders(ui: ReactElement, { route = "/", ...rest }: Options = {}) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  const utils = render(
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>
    </HelmetProvider>,
    rest
  );
  return { ...utils, i18n, queryClient: qc };
}
