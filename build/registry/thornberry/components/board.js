import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/board.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { jsxDEV } from "react/jsx-dev-runtime";
var useInertialScroll = ({
  friction = 0.87,
  velocityMultiplier = 1.3,
  minVelocity = 0.5
} = {}) => {
  const scrollContainerRef = useRef(null);
  const [isMouseDragging, setIsMouseDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const animationFrameRef = useRef(null);
  const stopInertia = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);
  const startInertia = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container)
      return;
    const animate = () => {
      if (Math.abs(velocityRef.current) < minVelocity) {
        velocityRef.current = 0;
        animationFrameRef.current = null;
        return;
      }
      container.scrollLeft -= velocityRef.current;
      velocityRef.current *= friction;
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [friction, minVelocity]);
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest("[data-rfd-draggable-id]"))
      return;
    const container = scrollContainerRef.current;
    if (!container)
      return;
    stopInertia();
    setIsMouseDragging(true);
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftStartRef.current = container.scrollLeft;
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    container.style.cursor = "grabbing";
  }, [stopInertia]);
  const endDrag = useCallback(() => {
    if (!isMouseDragging)
      return;
    setIsMouseDragging(false);
    const container = scrollContainerRef.current;
    if (container)
      container.style.cursor = "grab";
    if (Math.abs(velocityRef.current) > minVelocity)
      startInertia();
  }, [isMouseDragging, minVelocity, startInertia]);
  const handleMouseMove = useCallback((e) => {
    if (!isMouseDragging)
      return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container)
      return;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * velocityMultiplier;
    container.scrollLeft = scrollLeftStartRef.current - walk;
    if (deltaTime > 0) {
      velocityRef.current = (e.pageX - lastXRef.current) / deltaTime * 16;
    }
    lastXRef.current = e.pageX;
    lastTimeRef.current = currentTime;
  }, [isMouseDragging, velocityMultiplier]);
  useEffect(() => stopInertia, [stopInertia]);
  return {
    scrollContainerRef,
    isMouseDragging,
    handleMouseDown,
    handleMouseUp: endDrag,
    handleMouseMove,
    handleMouseLeave: endDrag
  };
};
var boardSurface = "-mx-1 flex flex-col gap-4 px-1 pb-4 sm:flex-row sm:items-start sm:gap-4 sm:overflow-x-auto";
var Board = ({ className, enableDragScroll = true, ...rest }) => {
  const {
    scrollContainerRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove
  } = useInertialScroll();
  if (!enableDragScroll) {
    return /* @__PURE__ */ jsxDEV("div", {
      className: cn(boardSurface, className),
      ...rest
    }, undefined, false, undefined, this);
  }
  return /* @__PURE__ */ jsxDEV("div", {
    ref: scrollContainerRef,
    className: cn(boardSurface, "sm:cursor-grab sm:select-none", className),
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseUp,
    ...rest
  }, undefined, false, undefined, this);
};
var BoardColumn = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV("div", {
  className: cn("flex w-full flex-col rounded-xl border bg-muted/40 sm:w-80 sm:shrink-0", className),
  ...rest
}, undefined, false, undefined, this);
var BoardColumnHeader = ({
  title,
  color,
  icon,
  count,
  className,
  children,
  ...rest
}) => /* @__PURE__ */ jsxDEV("div", {
  className: cn("flex items-center justify-between gap-2 px-3 py-2.5", className),
  ...rest,
  children: [
    /* @__PURE__ */ jsxDEV("div", {
      className: "flex min-w-0 items-center gap-2",
      children: [
        icon ?? /* @__PURE__ */ jsxDEV("span", {
          className: "size-2.5 shrink-0 rounded-full",
          style: { backgroundColor: color ?? "var(--color-muted-foreground)" }
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV("span", {
          className: "truncate font-semibold text-foreground text-sm",
          children: title
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this),
    count != null && /* @__PURE__ */ jsxDEV("span", {
      className: "shrink-0 rounded-full bg-card px-2 py-0.5 font-medium text-muted-foreground text-xs tabular-nums",
      children: count
    }, undefined, false, undefined, this),
    children
  ]
}, undefined, true, undefined, this);
var BoardColumnBody = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV("div", {
  className: cn("flex flex-col gap-2 px-2 pb-2", className),
  ...rest
}, undefined, false, undefined, this);
var BoardColumnEmpty = ({ className, ...rest }) => /* @__PURE__ */ jsxDEV("p", {
  className: cn("rounded-lg border border-dashed px-3 py-8 text-center text-muted-foreground text-xs", className),
  ...rest
}, undefined, false, undefined, this);
export {
  useInertialScroll,
  BoardColumnHeader,
  BoardColumnEmpty,
  BoardColumnBody,
  BoardColumn,
  Board
};
