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
    expect(screen.getByTestId("team-name-team-1")).toHaveTextContent(
      "Engineering",
    );
    expect(screen.getByTestId("team-name-team-2")).toHaveTextContent("Design");
  });

  it("links to each team detail page", () => {
    render(<TeamsList {...baseProps} />);

    expect(screen.getByTestId("team-link-team-1")).toHaveAttribute(
      "href",
      "/teams/team-1",
    );
    expect(screen.getByTestId("team-link-team-2")).toHaveAttribute(
      "href",
      "/teams/team-2",
    );
  });

  it("renders correct member count text (singular vs plural)", () => {
    render(<TeamsList {...baseProps} />);

    expect(screen.getByTestId("team-members-team-1")).toHaveTextContent(
      "1 member",
    );
    expect(screen.getByTestId("team-members-team-2")).toHaveTextContent(
      "2 members",
    );
  });
});
