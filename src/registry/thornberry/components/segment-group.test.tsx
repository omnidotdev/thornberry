import { afterEach, describe, expect, mock, test } from "bun:test";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { SegmentGroup } from "@/registry/thornberry/components/segment-group";

const items = ["Day", "Week", { value: "month", label: "Month" }];

const getItem = (label: string) => {
  const item = screen.getByText(label).closest('[data-part="item"]');
  if (!item) throw new Error(`expected a segment for ${label}`);
  return item;
};

// Ark (Zag) machines commit state after the click's microtasks settle, so
// flush them before asserting on the next render
const click = async (element: Element) => {
  fireEvent.click(element);
  await act(async () => {});
};

afterEach(() => {
  cleanup();
});

describe("SegmentGroup", () => {
  test("renders a radio per segment and checks the default value", () => {
    render(<SegmentGroup items={items} defaultValue="Week" />);

    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(getItem("Week").getAttribute("data-state")).toBe("checked");
    expect(getItem("Day").getAttribute("data-state")).toBe("unchecked");
  });

  test("lays out horizontally unless told otherwise", () => {
    const { container, rerender } = render(<SegmentGroup items={items} />);

    const root = () => container.querySelector('[data-part="root"]');
    expect(root()?.getAttribute("data-orientation")).toBe("horizontal");

    rerender(<SegmentGroup items={items} orientation="vertical" />);
    expect(root()?.getAttribute("data-orientation")).toBe("vertical");
  });

  test("selects a segment when its radio is chosen", async () => {
    const onValueChange = mock();
    render(
      <SegmentGroup
        items={items}
        defaultValue="Day"
        onValueChange={onValueChange}
      />,
    );

    const monthRadio = getItem("Month").querySelector("input");
    if (!monthRadio) throw new Error("expected a hidden radio input");
    await click(monthRadio);

    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: "month" }),
    );
    expect(getItem("Month").getAttribute("data-state")).toBe("checked");
    expect(getItem("Day").getAttribute("data-state")).toBe("unchecked");
  });

  test("does not select a disabled segment", () => {
    render(
      <SegmentGroup
        items={["On", { value: "off", label: "Off", disabled: true }]}
        defaultValue="On"
      />,
    );

    const offItem = getItem("Off");
    expect(offItem.hasAttribute("data-disabled")).toBe(true);

    const offRadio = offItem.querySelector("input");
    expect(offRadio?.disabled).toBe(true);
  });
});
