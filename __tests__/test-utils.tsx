import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { render, RenderOptions } from "@testing-library/react-native";
import { ReactElement } from "react";
// Source - https://stackoverflow.com/a
// Posted by David Castillo, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-23, License - CC BY-SA 4.0

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <LanguageProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  );
};

const customRender = (ui: ReactElement, options: RenderOptions = {}) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// re-export everything
export * from "@testing-library/react-native";

// override render method
export { customRender as render };
