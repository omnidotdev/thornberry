import { afterEach, describe, expect, test } from "bun:test";

import { cleanup, fireEvent, render } from "@testing-library/react";

import { Image, blurUpStyle } from "./image";

const LQIP = "data:image/webp;base64,UklGRg==";

afterEach(cleanup);

const img = () => {
  const element = document.querySelector("img");
  if (!element) throw new Error("expected an img");
  return element;
};

describe("Image blur-up", () => {
  test("shows the blurred placeholder until the image loads", () => {
    render(
      <Image src="/photo.jpg" width={400} height={300} alt="" lqip={LQIP} />,
    );

    // The test DOM drops the long data-URI image but keeps its siblings, so
    // the placeholder is detected by its sizing; `blurUpStyle` is checked below
    expect(img().style.backgroundSize).toBe("cover");

    fireEvent.load(img());

    expect(img().style.backgroundSize).toBe("");
  });

  test("has no placeholder without an lqip", () => {
    render(<Image src="/photo.jpg" width={400} height={300} alt="" />);

    expect(img().style.backgroundSize).toBe("");
  });

  test("still calls the caller's onLoad", () => {
    let loaded = false;
    render(
      <Image
        src="/photo.jpg"
        width={400}
        height={300}
        alt=""
        lqip={LQIP}
        onLoad={() => {
          loaded = true;
        }}
      />,
    );

    fireEvent.load(img());

    expect(loaded).toBe(true);
  });
});

describe("lqip validation", () => {
  test("ignores anything but a small base64 image data URI", () => {
    for (const bad of [
      "https://tracker.example.com/p.gif",
      "data:image/svg+xml;base64,PHN2Zz4=",
      "data:image/webp;base64,AA' onload='x",
      `data:image/webp;base64,${"A".repeat(5000)}`,
    ]) {
      expect(blurUpStyle(bad)).toEqual({});
      render(
        <Image src="/photo.jpg" width={400} height={300} alt="" lqip={bad} />,
      );
      expect(img().style.backgroundSize).toBe("");
      cleanup();
    }
  });
});

describe("blurUpStyle", () => {
  test("covers the box and follows the focal point", () => {
    const style = blurUpStyle(LQIP, "top");

    expect(style.backgroundSize).toBe("cover");
    expect(style.backgroundPosition).toBe("top");
    expect(decodeURIComponent(String(style.backgroundImage))).toContain(
      "feGaussianBlur",
    );
    expect(decodeURIComponent(String(style.backgroundImage))).toContain(LQIP);
  });
});
