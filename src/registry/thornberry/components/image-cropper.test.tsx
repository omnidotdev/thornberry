import { afterEach, expect, mock, test } from "bun:test";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useEffect, useRef } from "react";

// happy-dom cannot lay out or measure, so the real react-easy-crop never fires
// onCropComplete and its canvas has no 2d context. Stub the cropper to report a
// crop area on mount, and stub the crop helper to hand back a known blob, so the
// Save -> crop -> onConfirm wiring can be asserted deterministically.
const FAKE_BLOB = new Blob(["cropped"], { type: "image/jpeg" });

mock.module("react-easy-crop", () => ({
  default: ({
    onCropComplete,
  }: {
    onCropComplete?: (a: unknown, b: unknown) => void;
  }) => {
    // ImageCropper passes a fresh inline onCropComplete each render, so hold it
    // in a ref and fire once on mount rather than depending on it (which would
    // loop). The real cropper only fires on interaction
    const cb = useRef(onCropComplete);
    cb.current = onCropComplete;
    useEffect(() => {
      const area = { x: 0, y: 0, width: 10, height: 10 };
      cb.current?.(area, area);
    }, []);
    return <div data-testid="stub-cropper" />;
  },
}));

mock.module("@/registry/thornberry/lib/crop", () => ({
  getCroppedImg: async () => FAKE_BLOB,
}));

const { ImageCropper } = await import(
  "@/registry/thornberry/components/image-cropper"
);

afterEach(() => cleanup());

const SRC = "data:image/png;base64,iVBORw0KGgo=";

test("Save crops the image and hands the blob to onConfirm", async () => {
  const received: Blob[] = [];
  render(
    <ImageCropper
      imageSrc={SRC}
      onCancel={() => {}}
      onConfirm={(blob) => {
        received.push(blob);
      }}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  await waitFor(() => expect(received.length).toBe(1));
  expect(received[0]).toBe(FAKE_BLOB);
});

test("Cancel discards without cropping", () => {
  let cancelled = false;
  const received: Blob[] = [];
  render(
    <ImageCropper
      imageSrc={SRC}
      onCancel={() => {
        cancelled = true;
      }}
      onConfirm={(blob) => {
        received.push(blob);
      }}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(cancelled).toBe(true);
  expect(received.length).toBe(0);
});
