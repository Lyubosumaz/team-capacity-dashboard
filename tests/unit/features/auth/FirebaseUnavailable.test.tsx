import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FirebaseUnavailable } from "@/features/auth/FirebaseUnavailable";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("FirebaseUnavailable", () => {
  it("names the feature that needs Firebase", () => {
    render(<FirebaseUnavailable feature="Teams" />);

    expect(screen.getByTestId("firebase-unavailable-header")).toHaveTextContent(
      "Teams needs Firebase configured",
    );
  });

  it("links back to the overview", () => {
    render(<FirebaseUnavailable feature="Teams" />);

    expect(
      screen.getByTestId("firebase-unavailable-home-link"),
    ).toHaveAttribute("href", "/");
  });
});
