import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Providers } from "@/providers/Providers";
import { TeamsPageClient } from "@/components/teams/TeamsPageClient";
import { teams as mockTeams } from "@/lib/domain/mockData";

vi.mock("next/link", () => {
  return {
    __esModule: true,
    default: ({ href, children, ...rest }: any) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  };
});

describe("TeamsPage", () => {
  it("renders teams heading and list", () => {
    render(
      <Providers>
        <TeamsPageClient teams={mockTeams} />
      </Providers>,
    );

    expect(screen.getByRole("heading", { name: /teams/i })).toBeInTheDocument();
    expect(screen.getByText(/Team Alpha/i)).toBeInTheDocument();
  });
});
