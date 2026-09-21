import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Providers } from "../components/Providers";

const Child = () => <div>child-content</div>;

describe("Providers", () => {
  it("renders children inside QueryClientProvider", () => {
    const { getByText } = render(
      <Providers>
        <Child />
      </Providers>,
    );

    expect(getByText("child-content")).toBeInTheDocument();
  });
});
