import { afterEach, describe, expect, test } from "bun:test";

import { cleanup, render } from "@testing-library/react";

import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/registry/thornberry/components/avatar";

import type { ComponentProps } from "react";

const renderAvatar = (props: ComponentProps<typeof AvatarImage>) =>
  render(
    <AvatarRoot>
      <AvatarImage {...props} />
      <AvatarFallback>A</AvatarFallback>
    </AvatarRoot>,
  );

const getImage = () => {
  const img = document.querySelector("img");
  if (!img) throw new Error("expected an <img> to be rendered");
  return img;
};

afterEach(() => {
  cleanup();
});

describe("AvatarImage", () => {
  test("clears the imperatively-set inline styles when the source is removed", () => {
    const { rerender } = renderAvatar({ src: "https://example.com/a.png" });

    const img = getImage();

    // Simulate the cached/decoded state: the ref forces the image visible with
    // an inline opacity so a page of cached avatars never mass-fades at once
    img.style.opacity = "1";
    img.style.transition = "none";

    // Removing the avatar drops the src to undefined
    rerender(
      <AvatarRoot>
        <AvatarImage src={undefined} />
        <AvatarFallback>A</AvatarFallback>
      </AvatarRoot>,
    );

    expect(img.getAttribute("src")).toBeNull();
    // The leftover inline opacity must be cleared so the class-driven opacity-0
    // wins and the fallback shows, rather than a src-less <img> flashing its alt
    expect(img.style.opacity).toBe("");
    expect(img.style.transition).toBe("");
  });
});
