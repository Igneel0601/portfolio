import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { DateRange } from "@/components/DateRange";

describe("DateRange", () => {
  it("turns a → into a single icon and keeps both parts", () => {
    const { container } = render(<DateRange text="Feb → May 2026" />);
    expect(container.querySelectorAll("svg")).toHaveLength(1); // one MoveRight
    expect(container.textContent).toContain("Feb");
    expect(container.textContent).toContain("May 2026");
  });

  it("renders an arrowless string plain (no icon)", () => {
    const { container } = render(<DateRange text="Odoo Hackathon" />);
    expect(container.querySelectorAll("svg")).toHaveLength(0);
    expect(container.textContent).toBe("Odoo Hackathon");
  });

  it("handles multiple arrows with one icon each", () => {
    const { container } = render(<DateRange text="a → b → c" />);
    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });
});
