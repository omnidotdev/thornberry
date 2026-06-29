import {
  SheetContent,
  SheetDescription,
  SheetRoot,
  SheetTitle,
  SheetTrigger
} from "../../../chunks/avatar-44chqh8d.js";
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from "../../../chunks/avatar-5623n01g.js";
import {
  Input
} from "../../../chunks/avatar-w14gnk2a.js";
import {
  Button
} from "../../../chunks/avatar-07z52b3z.js";
import"../../../chunks/avatar-zdtfvyzd.js";
import {
  cn
} from "../../../chunks/avatar-yp1ewaxt.js";

// src/registry/thornberry/components/sidebar.tsx
import { ark } from "@ark-ui/react/factory";
import { TooltipContext } from "@ark-ui/react/tooltip";
import { PanelLeftIcon } from "lucide-react";
import {
  createContext,
  useCallback as useCallback2,
  useContext,
  useMemo as useMemo2,
  useRef as useRef2,
  useState as useState2
} from "react";
import { useHotkeys } from "react-hotkeys-hook";

// src/lib/hooks/use-mobile.ts
import { useEffect, useState } from "react";
"use client";
var MOBILE_BREAKPOINT = 768;
var useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(undefined);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
};
var use_mobile_default = useIsMobile;

// src/lib/hooks/use-sidebar-resize.ts
import { useCallback, useEffect as useEffect2, useMemo, useRef } from "react";
"use client";
function parseWidth(width) {
  const unit = width.endsWith("rem") ? "rem" : "px";
  const value = Number.parseFloat(width);
  return { value, unit };
}
function toPx(width) {
  const { value, unit } = parseWidth(width);
  return unit === "rem" ? value * 16 : value;
}
function formatWidth(value, unit) {
  return `${unit === "rem" ? value.toFixed(1) : Math.round(value)}${unit}`;
}
function useSidebarResize({
  direction = "right",
  currentWidth,
  onResize,
  onToggle,
  isCollapsed = false,
  minResizeWidth = "14rem",
  maxResizeWidth = "24rem",
  enableToggle = true,
  enableAutoCollapse = true,
  autoCollapseThreshold = 1.5,
  expandThreshold = 0.2,
  enableDrag = true,
  setIsDraggingRail = () => {},
  widthCookieName,
  widthCookieMaxAge = 60 * 60 * 24 * 7,
  isNested = false
}) {
  const dragRef = useRef(null);
  const startWidth = useRef(0);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const isInteractingWithRail = useRef(false);
  const lastWidth = useRef(0);
  const lastLoggedWidth = useRef(0);
  const dragStartPoint = useRef(0);
  const lastDragDirection = useRef(null);
  const lastTogglePoint = useRef(0);
  const lastToggleWidth = useRef(0);
  const toggleCooldown = useRef(false);
  const lastToggleTime = useRef(0);
  const dragDistanceFromToggle = useRef(0);
  const dragOffset = useRef(0);
  const railRect = useRef(null);
  const autoCollapseThresholdPx = useRef(0);
  const minWidthPx = useMemo(() => toPx(minResizeWidth), [minResizeWidth]);
  const maxWidthPx = useMemo(() => toPx(maxResizeWidth), [maxResizeWidth]);
  const isIncreasingWidth = useCallback((currentX, referenceX) => {
    return direction === "left" ? currentX < referenceX : currentX > referenceX;
  }, [direction]);
  const calculateWidth = useCallback((e, initialX, initialWidth, currentRailRect) => {
    if (isNested && currentRailRect) {
      const deltaX = e.clientX - initialX;
      if (direction === "left") {
        return initialWidth - deltaX;
      }
      return initialWidth + deltaX;
    }
    if (direction === "left") {
      return window.innerWidth - e.clientX;
    }
    return e.clientX;
  }, [direction, isNested]);
  useEffect2(() => {
    autoCollapseThresholdPx.current = enableAutoCollapse ? minWidthPx * autoCollapseThreshold : 0;
  }, [minWidthPx, enableAutoCollapse, autoCollapseThreshold]);
  const persistWidth = useCallback((width) => {
    if (widthCookieName) {
      document.cookie = `${widthCookieName}=${width}; path=/; max-age=${widthCookieMaxAge}`;
    }
  }, [widthCookieName, widthCookieMaxAge]);
  const handleMouseDown = useCallback((e) => {
    isInteractingWithRail.current = true;
    if (!enableDrag) {
      return;
    }
    const currentWidthPx = isCollapsed ? 0 : toPx(currentWidth);
    startWidth.current = currentWidthPx;
    startX.current = e.clientX;
    dragStartPoint.current = e.clientX;
    lastWidth.current = currentWidthPx;
    lastLoggedWidth.current = currentWidthPx;
    lastTogglePoint.current = e.clientX;
    lastToggleWidth.current = currentWidthPx;
    lastDragDirection.current = null;
    toggleCooldown.current = false;
    lastToggleTime.current = 0;
    dragDistanceFromToggle.current = 0;
    dragOffset.current = 0;
    if (isNested && dragRef.current) {
      railRect.current = dragRef.current.getBoundingClientRect();
    } else {
      railRect.current = null;
    }
    e.preventDefault();
  }, [enableDrag, isCollapsed, currentWidth, isNested]);
  useEffect2(() => {
    const handleMouseMove = (e) => {
      if (!isInteractingWithRail.current)
        return;
      const deltaX = Math.abs(e.clientX - startX.current);
      if (!isDragging.current && deltaX > 5) {
        isDragging.current = true;
        setIsDraggingRail(true);
      }
      if (isDragging.current) {
        const { unit } = parseWidth(currentWidth);
        let currentRailRect = railRect.current;
        if (isNested && dragRef.current) {
          currentRailRect = dragRef.current.getBoundingClientRect();
        }
        const currentDragDirection = isIncreasingWidth(e.clientX, lastTogglePoint.current) ? "expand" : "collapse";
        if (lastDragDirection.current !== currentDragDirection) {
          lastDragDirection.current = currentDragDirection;
        }
        dragDistanceFromToggle.current = Math.abs(e.clientX - lastTogglePoint.current);
        const now = Date.now();
        if (toggleCooldown.current && now - lastToggleTime.current > 200) {
          toggleCooldown.current = false;
        }
        if (!toggleCooldown.current) {
          if (enableAutoCollapse && onToggle && !isCollapsed) {
            const currentDragWidth = calculateWidth(e, startX.current, startWidth.current, currentRailRect);
            let shouldCollapse = false;
            if (autoCollapseThreshold <= 1) {
              shouldCollapse = currentDragWidth <= minWidthPx * autoCollapseThreshold;
            } else {
              if (currentDragWidth <= minWidthPx) {
                const extraDragNeeded = minWidthPx * (autoCollapseThreshold - 1);
                const distanceBeyondMin = minWidthPx - currentDragWidth;
                shouldCollapse = distanceBeyondMin >= extraDragNeeded;
              }
            }
            if (currentDragDirection === "collapse" && shouldCollapse) {
              onToggle();
              lastTogglePoint.current = e.clientX;
              lastToggleWidth.current = 0;
              toggleCooldown.current = true;
              lastToggleTime.current = now;
              return;
            }
          }
          if (onToggle && isCollapsed && currentDragDirection === "expand" && dragDistanceFromToggle.current > minWidthPx * expandThreshold) {
            onToggle();
            const initialWidth = calculateWidth(e, startX.current, startWidth.current, currentRailRect);
            const clampedWidth = Math.max(minWidthPx, Math.min(maxWidthPx, initialWidth));
            const formattedWidth2 = formatWidth(unit === "rem" ? clampedWidth / 16 : clampedWidth, unit);
            onResize(formattedWidth2);
            persistWidth(formattedWidth2);
            lastTogglePoint.current = e.clientX;
            lastToggleWidth.current = clampedWidth;
            toggleCooldown.current = true;
            lastToggleTime.current = now;
            return;
          }
        }
        if (isCollapsed) {
          return;
        }
        const newWidthPx = calculateWidth(e, startX.current, startWidth.current, currentRailRect);
        const clampedWidthPx = Math.max(minWidthPx, Math.min(maxWidthPx, newWidthPx));
        const newWidth = unit === "rem" ? clampedWidthPx / 16 : clampedWidthPx;
        const formattedWidth = formatWidth(newWidth, unit);
        onResize(formattedWidth);
        persistWidth(formattedWidth);
        lastWidth.current = clampedWidthPx;
      }
    };
    const handleMouseUp = () => {
      if (!isInteractingWithRail.current)
        return;
      if (!isDragging.current && onToggle && enableToggle) {
        onToggle();
      }
      isDragging.current = false;
      isInteractingWithRail.current = false;
      lastWidth.current = 0;
      lastLoggedWidth.current = 0;
      lastDragDirection.current = null;
      lastTogglePoint.current = 0;
      lastToggleWidth.current = 0;
      toggleCooldown.current = false;
      lastToggleTime.current = 0;
      dragDistanceFromToggle.current = 0;
      dragOffset.current = 0;
      railRect.current = null;
      setIsDraggingRail(false);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    onResize,
    onToggle,
    isCollapsed,
    currentWidth,
    persistWidth,
    setIsDraggingRail,
    minWidthPx,
    maxWidthPx,
    isIncreasingWidth,
    calculateWidth,
    isNested,
    enableAutoCollapse,
    autoCollapseThreshold,
    expandThreshold,
    enableToggle
  ]);
  return {
    dragRef,
    isDragging,
    handleMouseDown
  };
}

// src/registry/thornberry/components/sidebar.tsx
import { jsxDEV } from "react/jsx-dev-runtime";
var SIDEBAR_COOKIE_NAME = "sidebar:state";
var SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var MIN_SIDEBAR_WIDTH = "14rem";
var MAX_SIDEBAR_WIDTH = "22rem";
var SidebarContext = createContext(null);
var useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
};
var SidebarProvider = ({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  defaultWidth = SIDEBAR_WIDTH,
  ...rest
}) => {
  const isMobile = use_mobile_default();
  const [width, setWidth] = useState2(defaultWidth);
  const [openMobile, setOpenMobile] = useState2(false);
  const [isDraggingRail, setIsDraggingRail] = useState2(false);
  const [_open, _setOpen] = useState2(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = useCallback2((value) => {
    const openState = typeof value === "function" ? value(open) : value;
    if (setOpenProp) {
      setOpenProp(openState);
    } else {
      _setOpen(openState);
    }
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }, [setOpenProp, open]);
  const toggleSidebar = useCallback2(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen]);
  useHotkeys("b", toggleSidebar, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = useMemo2(() => ({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
    width,
    setWidth,
    isDraggingRail,
    setIsDraggingRail
  }), [
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    toggleSidebar,
    width,
    isDraggingRail
  ]);
  return /* @__PURE__ */ jsxDEV(SidebarContext.Provider, {
    value: contextValue,
    children: /* @__PURE__ */ jsxDEV("div", {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": width,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn("group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar", className),
      ...rest,
      children
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this);
};
var Sidebar = ({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...rest
}) => {
  const { isMobile, state, openMobile, setOpenMobile, isDraggingRail } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsxDEV("div", {
      "data-slot": "sidebar",
      className: cn("flex h-full w-(--sidebar-width) flex-col bg-red-500 text-sidebar-foreground", className),
      ...rest,
      children
    }, undefined, false, undefined, this);
  }
  if (isMobile) {
    return /* @__PURE__ */ jsxDEV(SheetRoot, {
      open: openMobile,
      onOpenChange: ({ open }) => setOpenMobile(open),
      children: [
        /* @__PURE__ */ jsxDEV(SheetTrigger, {
          asChild: true,
          className: "absolute top-2 right-2 z-50",
          children: /* @__PURE__ */ jsxDEV(Button, {
            variant: "ghost",
            size: "icon",
            className: "h-10 w-10",
            children: /* @__PURE__ */ jsxDEV(PanelLeftIcon, {
              className: "size-5"
            }, undefined, false, undefined, this)
          }, undefined, false, undefined, this)
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV(SheetContent, {
          "data-sidebar": "sidebar",
          "data-slot": "sidebar",
          "data-mobile": "true",
          className: "w-1/2 bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
          side,
          children: [
            /* @__PURE__ */ jsxDEV("div", {
              className: "sr-only",
              children: [
                /* @__PURE__ */ jsxDEV(SheetTitle, {
                  children: "Sidebar"
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV(SheetDescription, {
                  children: "Displays the mobile sidebar."
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              className: "flex h-full w-full flex-col",
              children
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, undefined, true, undefined, this);
  }
  return /* @__PURE__ */ jsxDEV("div", {
    className: "group peer block text-sidebar-foreground",
    "data-state": state,
    "data-collapsible": state === "collapsed" ? collapsible : "",
    "data-variant": variant,
    "data-side": side,
    "data-slot": "sidebar",
    "data-dragging": isDraggingRail,
    children: [
      /* @__PURE__ */ jsxDEV("div", {
        "data-slot": "sidebar-gap",
        className: cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)", "group-data-[dragging=true]:duration-0! group-data-[dragging=true]_*:duration-0!")
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV("div", {
        "data-slot": "sidebar-container",
        className: cn("fixed inset-y-0 z-50 flex h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", "group-data-[dragging=true]:duration-0! group-data-[dragging=true]_*:duration-0!", className),
        ...rest,
        children: /* @__PURE__ */ jsxDEV("div", {
          "data-sidebar": "sidebar",
          "data-slot": "sidebar-inner",
          className: "flex h-full w-full flex-col rounded-xl bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm",
          children
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var SidebarTrigger = ({
  className,
  onClick,
  ...rest
}) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxDEV(Button, {
    "data-sidebar": "trigger",
    "data-slot": "sidebar-trigger",
    variant: "ghost",
    size: "icon",
    className: cn("sticky top-2 ml-2 size-8", className),
    onClick: (event) => {
      onClick?.(event);
      toggleSidebar();
    },
    ...rest,
    children: [
      /* @__PURE__ */ jsxDEV(PanelLeftIcon, {}, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV("span", {
        className: "sr-only",
        children: "Toggle Sidebar"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var SidebarRail = ({
  enableDrag = true,
  className,
  ...rest
}) => {
  const { toggleSidebar, setWidth, state, width, setIsDraggingRail } = useSidebar();
  const { dragRef, handleMouseDown } = useSidebarResize({
    onResize: setWidth,
    onToggle: toggleSidebar,
    currentWidth: width,
    isCollapsed: state === "collapsed",
    minResizeWidth: MIN_SIDEBAR_WIDTH,
    maxResizeWidth: MAX_SIDEBAR_WIDTH,
    setIsDraggingRail,
    widthCookieName: "sidebar:width",
    enableAutoCollapse: true,
    autoCollapseThreshold: 1.3,
    expandThreshold: 0.2
  });
  const anchorRect = useRef2(null);
  const getAnchorRect = useCallback2(() => anchorRect.current, []);
  const isCollapsed = state === "collapsed";
  return /* @__PURE__ */ jsxDEV(TooltipRoot, {
    positioning: {
      placement: "right",
      getAnchorRect
    },
    closeDelay: 0,
    openDelay: 300,
    children: [
      /* @__PURE__ */ jsxDEV(TooltipContext, {
        children: (tootlip) => /* @__PURE__ */ jsxDEV(TooltipTrigger, {
          asChild: true,
          onPointerMove: (e) => {
            anchorRect.current = new DOMRect(e.clientX, e.clientY, 1, 1);
            tootlip.reposition();
          },
          children: /* @__PURE__ */ jsxDEV("button", {
            ref: dragRef,
            "data-sidebar": "rail",
            "data-slot": "sidebar-rail",
            "aria-label": "Toggle Sidebar",
            tabIndex: -1,
            onMouseDown: handleMouseDown,
            className: cn("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:after:left-full", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", "[[data-side=left][data-state=expanded]_&]:cursor-col-resize", className),
            ...rest
          }, undefined, false, undefined, this)
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV(TooltipPositioner, {
        children: /* @__PURE__ */ jsxDEV(TooltipContent, {
          className: "flex h-fit w-full flex-col gap-1 border bg-background text-foreground",
          children: [
            /* @__PURE__ */ jsxDEV("span", {
              children: "Drag to resize"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              className: "inline-flex",
              children: [
                "Click to ",
                isCollapsed ? "expand" : "collapse",
                " ",
                /* @__PURE__ */ jsxDEV("div", {
                  className: "ml-2 flex items-center gap-0.5",
                  children: /* @__PURE__ */ jsxDEV(SidebarMenuShortcut, {
                    children: "B"
                  }, undefined, false, undefined, this)
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var SidebarInset = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("main", {
    "data-slot": "sidebar-inset",
    className: cn("relative flex w-full flex-1 flex-col bg-background", "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarSeparator = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("div", {
    "data-slot": "sidebar-separator",
    className: cn("-mx-2 h-px bg-border py-0", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarInput = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV(Input, {
    "data-slot": "sidebar-input",
    "data-sidebar": "input",
    className: cn("h-8 w-full bg-background shadow-none", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarHeader = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("div", {
    "data-slot": "sidebar-header",
    "data-sidebar": "header",
    className: cn("flex flex-col gap-2 p-2", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarFooter = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("div", {
    "data-slot": "sidebar-footer",
    "data-sidebar": "footer",
    className: cn("flex flex-col gap-2 p-2", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarContent = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("div", {
    "data-slot": "sidebar-content",
    "data-sidebar": "content",
    className: cn("no-scrollbar mb-2 flex min-h-0 flex-1 flex-col gap-4 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarGroup = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("div", {
    "data-slot": "sidebar-group",
    "data-sidebar": "group",
    className: cn("flex w-full flex-col gap-1 px-2", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarGroupLabel = ({
  className,
  ...rest
}) => {
  return /* @__PURE__ */ jsxDEV(ark.div, {
    "data-slot": "sidebar-group-label",
    "data-sidebar": "group-label",
    className: cn("flex shrink-0 items-center rounded-md py-1 font-medium text-sidebar-foreground/70 text-xs outline-hidden ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarGroupAction = ({
  className,
  ...rest
}) => {
  return /* @__PURE__ */ jsxDEV(ark.div, {
    "data-slot": "sidebar-group-action",
    "data-sidebar": "group-action",
    className: cn("flex size-5 cursor-pointer items-center justify-center rounded-md p-0 text-base-400 outline-hidden ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-3 [&>svg]:shrink-0", "group-data-[collapsible=icon]:hidden", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarGroupContent = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("div", {
    "data-slot": "sidebar-group-content",
    "data-sidebar": "group-content",
    className: cn("w-full text-sm", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarMenu = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("div", {
    "data-slot": "sidebar-menu",
    "data-sidebar": "menu",
    className: cn("flex w-full min-w-0 flex-col gap-1", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarMenuItem = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("div", {
    "data-slot": "sidebar-menu-item",
    "data-sidebar": "menu-item",
    className: cn("group/menu-item relative cursor-pointer", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarMenuButton = ({
  isActive = false,
  tooltip,
  shortcut,
  className,
  ...rest
}) => {
  const { isMobile, state } = useSidebar();
  const button = /* @__PURE__ */ jsxDEV(ark.button, {
    "data-slot": "sidebar-menu-button",
    "data-sidebar": "menu-button",
    "data-active": isActive,
    className: cn("peer/menu-button flex h-8 w-full items-center gap-2 overflow-hidden rounded-md px-2 text-left text-sm transition-[width,height,padding,color,box-shadow] [&[data-state=open]>svg]:rotate-90", "font-medium text-sidebar-foreground/70", "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", "outline-hidden focus-visible:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring! focus-visible:ring-offset-2! focus-visible:ring-offset-background", "active:text-sidebar-accent-foreground", "disabled:pointer-events-none disabled:opacity-50", "aria-disabled:pointer-events-none aria-disabled:opacity-50", "data-[active=true]:bg-sidebar-accent/80 data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground", "data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground", "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!", "group-has-data-[sidebar=menu-action]/menu-item:pr-8", "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", className),
    ...rest
  }, undefined, false, undefined, this);
  if (!tooltip) {
    return button;
  }
  return /* @__PURE__ */ jsxDEV(TooltipRoot, {
    positioning: {
      placement: "right",
      offset: { mainAxis: 8 },
      gutter: 4
    },
    closeDelay: 0,
    openDelay: 200,
    disabled: isMobile || state === "expanded",
    children: [
      /* @__PURE__ */ jsxDEV(TooltipTrigger, {
        asChild: true,
        children: button
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV(TooltipPositioner, {
        children: /* @__PURE__ */ jsxDEV(TooltipContent, {
          className: "border bg-background text-foreground",
          children: /* @__PURE__ */ jsxDEV("div", {
            className: "flex items-center gap-2",
            children: [
              tooltip,
              shortcut && /* @__PURE__ */ jsxDEV("div", {
                className: "ml-2 flex items-center gap-0.5",
                children: /* @__PURE__ */ jsxDEV(SidebarMenuShortcut, {
                  className: "w-fit px-1",
                  children: shortcut
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var SidebarMenuAction = ({
  isActive,
  className,
  showOnHover = false,
  ...rest
}) => {
  return /* @__PURE__ */ jsxDEV(ark.button, {
    "data-slot": "sidebar-menu-action",
    "data-sidebar": "menu-action",
    "data-active": isActive,
    className: cn("absolute top-1.5 right-1 flex aspect-square w-5 cursor-pointer items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none outline-hidden ring-sidebar-ring transition-[color,box-shadow] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring! focus-visible:ring-offset-2 peer-hover/menu-button:text-sidebar-accent-foreground data-[active=true]:text-sidebar-accent-foreground data-[active=true]:hover:bg-accent data-[active=true]:dark:hover:bg-base-700 [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 md:after:hidden", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarMenuBadge = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("div", {
    "data-slot": "sidebar-menu-badge",
    "data-sidebar": "menu-badge",
    className: cn("pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 font-medium text-sidebar-foreground text-xs tabular-nums", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarMenuShortcut = ({
  className,
  ...rest
}) => {
  return /* @__PURE__ */ jsxDEV("span", {
    "data-slot": "sidebar-menu-shortcut",
    "data-sidebar": "menu-shortcut",
    className: cn("ml-auto flex size-5 items-center justify-center gap-0.5 rounded-md border bg-background font-medium text-[10px] text-foreground", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarMenuSub = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("ul", {
    "data-slot": "sidebar-menu-sub",
    "data-sidebar": "menu-sub",
    className: cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-sidebar-border border-l px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarMenuSubItem = ({ className, ...rest }) => {
  return /* @__PURE__ */ jsxDEV("li", {
    "data-slot": "sidebar-menu-sub-item",
    "data-sidebar": "menu-sub-item",
    className: cn("group/menu-sub-item relative", className),
    ...rest
  }, undefined, false, undefined, this);
};
var SidebarMenuSubButton = ({
  size = "md",
  isActive = false,
  className,
  ...rest
}) => {
  return /* @__PURE__ */ jsxDEV(ark.a, {
    "data-slot": "sidebar-menu-sub-button",
    "data-sidebar": "menu-sub-button",
    "data-size": size,
    "data-active": isActive,
    className: cn("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-hidden ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className),
    ...rest
  }, undefined, false, undefined, this);
};
export {
  useSidebar,
  SidebarTrigger,
  SidebarSeparator,
  SidebarRail,
  SidebarProvider,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuSub,
  SidebarMenuShortcut,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuAction,
  SidebarMenu,
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupAction,
  SidebarGroup,
  SidebarFooter,
  SidebarContent,
  Sidebar
};
