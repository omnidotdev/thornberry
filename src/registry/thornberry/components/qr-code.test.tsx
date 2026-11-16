import { afterEach, describe, expect, test } from "bun:test";

import { cleanup, render, screen } from "@testing-library/react";

import { QrCode } from "@/registry/thornberry/components/qr-code";

const pattern = (container: HTMLElement) => {
  const path = container.querySelector('[data-part="pattern"]');
  if (!path) throw new Error("expected a QR pattern");
  return path.getAttribute("d") ?? "";
};

// Ark draws one 10-unit square per dark module, so the viewBox width over 10
// is the number of modules per side (the code's version plus its border)
const modulesPerSide = (container: HTMLElement) => {
  const viewBox = container
    .querySelector('[data-part="frame"]')
    ?.getAttribute("viewBox");
  return Number(viewBox?.split(" ")[2]) / 10;
};

afterEach(() => {
  cleanup();
});

describe("QrCode", () => {
  test("renders the value as a labelled, sized svg", () => {
    const { container } = render(
      <QrCode value="https://omni.dev" size={120} label="Omni website" />,
    );

    const frame = screen.getByRole("img", { name: "Omni website" });
    expect(frame.tagName.toLowerCase()).toBe("svg");
    expect(frame.style.width).toBe("120px");
    expect(frame.style.height).toBe("120px");
    expect(pattern(container).length).toBeGreaterThan(0);
  });

  test("draws a different pattern for a different value", () => {
    const { container, rerender } = render(<QrCode value="first" />);
    const first = pattern(container);

    rerender(<QrCode value="second value" />);
    expect(pattern(container)).not.toBe(first);
  });

  test("uses a denser code for higher error correction", () => {
    const value = "otpauth://totp/Omni:user@omni.dev?secret=JBSWY3DPEHPK3PXP";

    const { container, rerender } = render(
      <QrCode value={value} errorCorrection="L" />,
    );
    const low = modulesPerSide(container);

    rerender(<QrCode value={value} errorCorrection="H" />);
    expect(modulesPerSide(container)).toBeGreaterThan(low);
  });

  test("renders an overlay and raises error correction for it", () => {
    const value = "https://omni.dev/some/longer/path";
    const { container, rerender } = render(<QrCode value={value} />);
    const plain = modulesPerSide(container);

    rerender(<QrCode value={value} overlay={<span>logo</span>} />);

    expect(screen.getByText("logo").closest('[data-part="overlay"]')).not.toBe(
      null,
    );
    expect(modulesPerSide(container)).toBeGreaterThan(plain);
  });
});
