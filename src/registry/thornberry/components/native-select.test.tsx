import { afterEach, describe, expect, mock, test } from "bun:test";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef, useState } from "react";

import { NativeSelect } from "@/registry/thornberry/components/native-select";

const options = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High", disabled: true },
];

const getSelect = () => screen.getByRole("combobox") as HTMLSelectElement;

const Controlled = ({ onChange }: { onChange: (value: string) => void }) => {
  const [value, setValue] = useState("low");

  return (
    <NativeSelect
      aria-label="Priority"
      options={options}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
        setValue(event.target.value);
      }}
    />
  );
};

afterEach(() => {
  cleanup();
});

describe("NativeSelect", () => {
  test("renders a native select with the given options", () => {
    render(<NativeSelect aria-label="Priority" options={options} />);

    const select = getSelect();
    expect(select.tagName).toBe("SELECT");
    expect(
      Array.from(select.options).map((option) => [option.value, option.text]),
    ).toEqual([
      ["low", "Low"],
      ["medium", "Medium"],
      ["high", "High"],
    ]);
    expect(select.options[2]?.disabled).toBe(true);
  });

  test("renders children, including optgroups, after the options", () => {
    render(
      <NativeSelect
        aria-label="Region"
        options={[{ value: "all", label: "All" }]}
      >
        <optgroup label="Europe">
          <option value="de">Germany</option>
        </optgroup>
      </NativeSelect>,
    );

    const select = getSelect();
    expect(Array.from(select.options).map((option) => option.value)).toEqual([
      "all",
      "de",
    ]);
    expect(select.querySelector("optgroup")?.label).toBe("Europe");
  });

  test("starts on a disabled, hidden placeholder option", () => {
    render(
      <NativeSelect
        aria-label="Priority"
        options={options}
        placeholder="Choose a priority"
      />,
    );

    const select = getSelect();
    const placeholder = select.options[0];
    expect(placeholder?.text).toBe("Choose a priority");
    expect(placeholder?.value).toBe("");
    expect(placeholder?.disabled).toBe(true);
    expect(placeholder?.hidden).toBe(true);
    expect(select.value).toBe("");
  });

  test("honors defaultValue over the placeholder", () => {
    render(
      <NativeSelect
        aria-label="Priority"
        options={options}
        placeholder="Choose a priority"
        defaultValue="medium"
      />,
    );

    expect(getSelect().value).toBe("medium");
  });

  test("reports changes and follows a controlled value", () => {
    const onChange = mock();

    render(<Controlled onChange={onChange} />);

    const select = getSelect();
    expect(select.value).toBe("low");

    fireEvent.change(select, { target: { value: "medium" } });

    expect(onChange).toHaveBeenCalledWith("medium");
    expect(select.value).toBe("medium");
  });

  test("passes disabled and native attributes to the select", () => {
    render(
      <NativeSelect
        id="priority"
        name="priority"
        aria-describedby="priority-hint"
        options={options}
        disabled
        required
      />,
    );

    const select = getSelect();
    expect(select.disabled).toBe(true);
    expect(select.required).toBe(true);
    expect(select.id).toBe("priority");
    expect(select.name).toBe("priority");
    expect(select.getAttribute("aria-describedby")).toBe("priority-hint");
  });

  test("keeps label association on the select", () => {
    render(
      <>
        <label htmlFor="status">Status</label>
        <NativeSelect id="status" options={options} />
      </>,
    );

    expect(screen.getByLabelText("Status")).toBe(getSelect());
  });

  test("styles the error state through aria-invalid", () => {
    render(
      <NativeSelect aria-label="Priority" options={options} aria-invalid />,
    );

    const select = getSelect();
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.className).toContain("aria-invalid:border-destructive");
  });

  test("hides the chevron from assistive technology", () => {
    const { container } = render(
      <NativeSelect aria-label="Priority" options={options} />,
    );

    const chevron = container.querySelector("svg");
    expect(chevron?.getAttribute("aria-hidden")).toBe("true");
  });

  test("forwards its ref to the select element", () => {
    const ref = createRef<HTMLSelectElement>();
    render(<NativeSelect aria-label="Priority" options={options} ref={ref} />);

    expect(ref.current).toBe(getSelect());
  });

  test("merges className onto the outer box and selectClassName onto the select", () => {
    const { container } = render(
      <NativeSelect
        aria-label="Priority"
        options={options}
        className="w-full"
        selectClassName="pl-2"
      />,
    );

    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("w-full");
    expect(wrapper?.className).toContain("relative");

    // tailwind-merge drops the default padding in favor of the override
    const select = getSelect();
    expect(select.className).toContain("pl-2");
    expect(select.className).not.toContain("pl-3");
    expect(select.className).toContain("appearance-none");
  });

  test("changes height and chevron offset with size", () => {
    const { container, rerender } = render(
      <NativeSelect aria-label="Priority" options={options} size="sm" />,
    );

    expect(getSelect().className).toContain("h-8");
    expect(container.querySelector("svg")?.getAttribute("class")).toContain(
      "right-2.5",
    );

    rerender(<NativeSelect aria-label="Priority" options={options} />);
    expect(getSelect().className).toContain("h-9");

    rerender(
      <NativeSelect aria-label="Priority" options={options} size="lg" />,
    );
    expect(getSelect().className).toContain("h-10");
  });
});
