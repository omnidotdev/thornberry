// bun defines a global `self` in its test runtime, which makes elkjs's UMD
// worker bundle mis-detect that it is running inside a web worker and skip its
// CommonJS export, leaving `new ELK()` with an undefined worker constructor
// clearing the spurious `self` (a real browser main thread without a worker has
// no `self` either) lets elkjs fall back to its in-process worker
if (
  typeof globalThis.self !== "undefined" &&
  typeof globalThis.document === "undefined"
) {
  (globalThis as { self?: unknown }).self = undefined;
}
