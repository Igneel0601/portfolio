import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Insight } from "@/components/Insight";

describe("Insight", () => {
  it("renders *word* as <em class='hl'> and \\n as <br> by default", () => {
    const { container } = render(<Insight text={"*Inngest* runs jobs\n*E2B* runs output"} />);
    const ems = container.querySelectorAll("em.hl");
    expect([...ems].map((e) => e.textContent)).toEqual(["Inngest", "E2B"]);
    expect(container.querySelectorAll("br")).toHaveLength(1);
    expect(container.textContent).toContain("runs jobs");
  });

  it("renders \\n as a space (no <br>) when breaks=false", () => {
    const { container } = render(<Insight text={"line one\nline two"} breaks={false} />);
    expect(container.querySelectorAll("br")).toHaveLength(0);
    expect(container.textContent).toContain("line one line two");
  });

  it("renders plain text with no markers", () => {
    const { container } = render(<Insight text="just text" />);
    expect(container.querySelectorAll("em")).toHaveLength(0);
    expect(container.textContent).toBe("just text");
  });
});
