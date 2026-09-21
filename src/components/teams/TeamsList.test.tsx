import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TeamsList } from "./TeamsList";

const teams = [
  {
    id: "team-1",
    name: "Engineering",
    members: [
      {
        id: "m1",
        name: "Alice",
        role: "Dev",
        skills: [],
        capacityPerSprint: 10,
        isKeyPerson: true,
      },
    ],
  },
  {
    id: "team-2",
    name: "Design",
    members: [
      {
        id: "m2",
        name: "Bob",
        role: "Designer",
        skills: [],
        capacityPerSprint: 8,
        isKeyPerson: false,
      },
      {
        id: "m3",
        name: "Carol",
        role: "Designer",
        skills: [],
        capacityPerSprint: 8,
        isKeyPerson: false,
      },
    ],
  },
];

const baseProps = {
  teams,
  memberSuffixSingular: "member",
  memberSuffixPlural: "members",
  viewLabel: "View",
};

describe("TeamsList", () => {
  it("renders a list item for each team", () => {
    render(<TeamsList {...baseProps} />);

    expect(screen.getByTestId("teams-list")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  it("links to each team detail page", () => {
    render(<TeamsList {...baseProps} />);

    const engLink = screen.getByRole("link", { name: /engineering/i });
    const designLink = screen.getByRole("link", { name: /design/i });

    expect(engLink).toHaveAttribute("href", "/teams/team-1");
    expect(designLink).toHaveAttribute("href", "/teams/team-2");
  });

  it("renders correct member count text (singular vs plural)", () => {
    render(<TeamsList {...baseProps} />);

    expect(screen.getByText("1 member")).toBeInTheDocument();
    expect(screen.getByText("2 members")).toBeInTheDocument();
  });
});
