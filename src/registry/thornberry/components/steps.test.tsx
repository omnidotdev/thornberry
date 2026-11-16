import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { Steps } from "@/registry/thornberry/components/steps";

const items = [
  { title: "Account", description: "Your details", content: "Account form" },
  { title: "Workspace", content: "Workspace form" },
  { title: "Invite", content: "Invite form" },
];

const trigger = (title: string | RegExp) =>
  screen.getByRole("tab", { name: title });

// Ark (Zag) machines commit state after the click's microtasks settle, so
// flush them before asserting on the next render
const click = async (element: Element) => {
  fireEvent.click(element);
  await act(async () => {});
};

afterEach(() => {
  cleanup();
});

describe("Steps", () => {
  test("renders a step per item with the first one current", () => {
    render(<Steps items={items} />);

    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(trigger(/Account/).getAttribute("aria-selected")).toBe("true");
    expect(trigger(/Account/).hasAttribute("data-current")).toBe(true);
    expect(trigger(/Workspace/).hasAttribute("data-incomplete")).toBe(true);
    expect(screen.getByText("Your details")).toBeDefined();

    expect(screen.getByRole("tabpanel").textContent).toBe("Account form");
    expect(screen.getByRole("button", { name: "Back" })).toHaveProperty(
      "disabled",
      true,
    );
  });

  test("moves forward and back with the navigation buttons", async () => {
    const onStepChange = mock();
    render(<Steps items={items} onStepChange={onStepChange} />);

    await click(screen.getByRole("button", { name: "Next" }));

    expect(onStepChange).toHaveBeenLastCalledWith({ step: 1 });
    expect(trigger(/Account/).hasAttribute("data-complete")).toBe(true);
    expect(trigger(/Workspace/).hasAttribute("data-current")).toBe(true);
    expect(screen.getByRole("tabpanel").textContent).toBe("Workspace form");

    await click(screen.getByRole("button", { name: "Back" }));
    expect(trigger(/Account/).hasAttribute("data-current")).toBe(true);
  });

  test("shows the completed content after the last step", async () => {
    render(<Steps items={items} defaultStep={2} completedContent="All set" />);

    const finish = screen.getByRole("button", { name: "Finish" });
    await click(finish);

    expect(screen.getByText("All set").hidden).toBe(false);
    for (const title of [/Account/, /Workspace/, /Invite/]) {
      expect(trigger(title).hasAttribute("data-complete")).toBe(true);
    }
    expect(finish).toHaveProperty("disabled", true);
  });

  test("jumps to a step from its trigger unless linear", async () => {
    const { rerender } = render(<Steps items={items} />);

    await click(trigger(/Invite/));
    expect(trigger(/Invite/).hasAttribute("data-current")).toBe(true);

    rerender(<Steps items={items} linear key="linear" />);
    await click(trigger(/Invite/));
    expect(trigger(/Account/).hasAttribute("data-current")).toBe(true);
  });

  test("lays out vertically", () => {
    const { container } = render(
      <Steps items={items} orientation="vertical" />,
    );

    expect(
      container
        .querySelector('[data-part="list"]')
        ?.getAttribute("aria-orientation"),
    ).toBe("vertical");
  });
});
