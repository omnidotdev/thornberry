import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Register a happy-dom global DOM so React component tests (.test.tsx) can
// render. Pure lib tests (.test.ts) ignore the DOM and are unaffected
if (typeof globalThis.document === "undefined") {
  GlobalRegistrator.register();
}

// bun defines a global `self` in its test runtime, which makes elkjs's UMD
// worker bundle mis-detect that it is running inside a web worker and skip its
// CommonJS export, leaving `new ELK()` with an undefined worker constructor
// clearing the spurious `self` (a real browser main thread without a worker has
// no `self` either) lets elkjs fall back to its in-process worker
// happy-dom does not set `self`, so this still applies after registration
if (
  typeof globalThis.self !== "undefined" &&
  typeof globalThis.document === "undefined"
) {
  (globalThis as { self?: unknown }).self = undefined;
}

// React Flow touches several browser APIs that happy-dom does not implement.
// Stub them so its components mount without crashing. happy-dom does not lay
// out or measure, so these are no-op shims, not real implementations
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (typeof globalThis.DOMMatrixReadOnly === "undefined") {
  class DOMMatrixStub {
    m22 = 1;
  }
  globalThis.DOMMatrixReadOnly =
    DOMMatrixStub as unknown as typeof DOMMatrixReadOnly;
  globalThis.DOMMatrix = DOMMatrixStub as unknown as typeof DOMMatrix;
}

if (typeof globalThis.matchMedia === "undefined") {
  globalThis.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof matchMedia;
}
