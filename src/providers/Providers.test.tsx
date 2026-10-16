import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useTzarTheme } from "@tzardom-ui/react";
import { Providers } from "./Providers";

const Child = () => <div data-testid="child">child-content</div>;

describe("Providers", () => {
  it("renders children inside QueryClientProvider", () => {
    render(
      <Providers>
        <Child />
      </Providers>,
    );

    expect(screen.getByTestId("child")).toHaveTextContent("child-content");
  });

  it("gives children the tzardom-ui theme", () => {
    const ThemeName = () => (
      <div data-testid="theme-name">{useTzarTheme().theme}</div>
    );

    render(
      <Providers>
        <ThemeName />
      </Providers>,
    );

    expect(screen.getByTestId("theme-name")).toHaveTextContent("light");
  });
});
