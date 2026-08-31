import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot
} from "../../../chunks/account-user-two-factor-authentication-f0pw65h3.js";
import {
  useAccountContext
} from "../../../chunks/account-user-two-factor-authentication-en4v22ys.js";
import {
  DialogBackdrop,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  DialogTitle
} from "../../../chunks/account-user-two-factor-authentication-p3ac7628.js";
import {
  Button
} from "../../../chunks/account-user-two-factor-authentication-jb3sh07m.js";
import"../../../chunks/account-user-two-factor-authentication-zdtfvyzd.js";
import"../../../chunks/account-user-two-factor-authentication-yp1ewaxt.js";
import {
  __commonJS,
  __toESM
} from "../../../chunks/account-user-two-factor-authentication-d1wjbx81.js";

// node_modules/normalize-wheel/src/UserAgent_DEPRECATED.js
var require_UserAgent_DEPRECATED = __commonJS(function(exports, module) {
  var _populated = false;
  var _ie;
  var _firefox;
  var _opera;
  var _webkit;
  var _chrome;
  var _ie_real_version;
  var _osx;
  var _windows;
  var _linux;
  var _android;
  var _win64;
  var _iphone;
  var _ipad;
  var _native;
  var _mobile;
  function _populate() {
    if (_populated) {
      return;
    }
    _populated = true;
    var uas = navigator.userAgent;
    var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(uas);
    var os = /(Mac OS X)|(Windows)|(Linux)/.exec(uas);
    _iphone = /\b(iPhone|iP[ao]d)/.exec(uas);
    _ipad = /\b(iP[ao]d)/.exec(uas);
    _android = /Android/i.exec(uas);
    _native = /FBAN\/\w+;/i.exec(uas);
    _mobile = /Mobile/i.exec(uas);
    _win64 = !!/Win64/.exec(uas);
    if (agent) {
      _ie = agent[1] ? parseFloat(agent[1]) : agent[5] ? parseFloat(agent[5]) : NaN;
      if (_ie && document && document.documentMode) {
        _ie = document.documentMode;
      }
      var trident = /(?:Trident\/(\d+.\d+))/.exec(uas);
      _ie_real_version = trident ? parseFloat(trident[1]) + 4 : _ie;
      _firefox = agent[2] ? parseFloat(agent[2]) : NaN;
      _opera = agent[3] ? parseFloat(agent[3]) : NaN;
      _webkit = agent[4] ? parseFloat(agent[4]) : NaN;
      if (_webkit) {
        agent = /(?:Chrome\/(\d+\.\d+))/.exec(uas);
        _chrome = agent && agent[1] ? parseFloat(agent[1]) : NaN;
      } else {
        _chrome = NaN;
      }
    } else {
      _ie = _firefox = _opera = _chrome = _webkit = NaN;
    }
    if (os) {
      if (os[1]) {
        var ver = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(uas);
        _osx = ver ? parseFloat(ver[1].replace("_", ".")) : true;
      } else {
        _osx = false;
      }
      _windows = !!os[2];
      _linux = !!os[3];
    } else {
      _osx = _windows = _linux = false;
    }
  }
  var UserAgent_DEPRECATED = {
    ie: function() {
      return _populate() || _ie;
    },
    ieCompatibilityMode: function() {
      return _populate() || _ie_real_version > _ie;
    },
    ie64: function() {
      return UserAgent_DEPRECATED.ie() && _win64;
    },
    firefox: function() {
      return _populate() || _firefox;
    },
    opera: function() {
      return _populate() || _opera;
    },
    webkit: function() {
      return _populate() || _webkit;
    },
    safari: function() {
      return UserAgent_DEPRECATED.webkit();
    },
    chrome: function() {
      return _populate() || _chrome;
    },
    windows: function() {
      return _populate() || _windows;
    },
    osx: function() {
      return _populate() || _osx;
    },
    linux: function() {
      return _populate() || _linux;
    },
    iphone: function() {
      return _populate() || _iphone;
    },
    mobile: function() {
      return _populate() || (_iphone || _ipad || _android || _mobile);
    },
    nativeApp: function() {
      return _populate() || _native;
    },
    android: function() {
      return _populate() || _android;
    },
    ipad: function() {
      return _populate() || _ipad;
    }
  };
  module.exports = UserAgent_DEPRECATED;
});

// node_modules/normalize-wheel/src/ExecutionEnvironment.js
var require_ExecutionEnvironment = __commonJS(function(exports, module) {
  var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
  var ExecutionEnvironment = {
    canUseDOM,
    canUseWorkers: typeof Worker !== "undefined",
    canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),
    canUseViewport: canUseDOM && !!window.screen,
    isInWorker: !canUseDOM
  };
  module.exports = ExecutionEnvironment;
});

// node_modules/normalize-wheel/src/isEventSupported.js
var require_isEventSupported = __commonJS(function(exports, module) {
  var ExecutionEnvironment = require_ExecutionEnvironment();
  var useHasFeature;
  if (ExecutionEnvironment.canUseDOM) {
    useHasFeature = document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== true;
  }
  function isEventSupported(eventNameSuffix, capture) {
    if (!ExecutionEnvironment.canUseDOM || capture && !("addEventListener" in document)) {
      return false;
    }
    var eventName = "on" + eventNameSuffix;
    var isSupported = eventName in document;
    if (!isSupported) {
      var element = document.createElement("div");
      element.setAttribute(eventName, "return;");
      isSupported = typeof element[eventName] === "function";
    }
    if (!isSupported && useHasFeature && eventNameSuffix === "wheel") {
      isSupported = document.implementation.hasFeature("Events.wheel", "3.0");
    }
    return isSupported;
  }
  module.exports = isEventSupported;
});

// node_modules/normalize-wheel/src/normalizeWheel.js
var require_normalizeWheel = __commonJS(function(exports, module) {
  var UserAgent_DEPRECATED = require_UserAgent_DEPRECATED();
  var isEventSupported = require_isEventSupported();
  var PIXEL_STEP = 10;
  var LINE_HEIGHT = 40;
  var PAGE_HEIGHT = 800;
  function normalizeWheel(event) {
    var sX = 0, sY = 0, pX = 0, pY = 0;
    if ("detail" in event) {
      sY = event.detail;
    }
    if ("wheelDelta" in event) {
      sY = -event.wheelDelta / 120;
    }
    if ("wheelDeltaY" in event) {
      sY = -event.wheelDeltaY / 120;
    }
    if ("wheelDeltaX" in event) {
      sX = -event.wheelDeltaX / 120;
    }
    if ("axis" in event && event.axis === event.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }
    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;
    if ("deltaY" in event) {
      pY = event.deltaY;
    }
    if ("deltaX" in event) {
      pX = event.deltaX;
    }
    if ((pX || pY) && event.deltaMode) {
      if (event.deltaMode == 1) {
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }
    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }
    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }
    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY
    };
  }
  normalizeWheel.getEventType = function() {
    return UserAgent_DEPRECATED.firefox() ? "DOMMouseScroll" : isEventSupported("wheel") ? "wheel" : "mousewheel";
  };
  module.exports = normalizeWheel;
});

// src/registry/thornberry/components/account-avatar-upload.tsx
import { Camera, CloudUpload, Loader2, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

// node_modules/react-easy-crop/index.module.mjs
var import_normalize_wheel = __toESM(require_normalizeWheel(), 1);
import * as React from "react";
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && typeof Symbol == "function" && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function toPrimitive(t, r) {
  if (_typeof(t) != "object" || !t)
    return t;
  var e = t[Symbol.toPrimitive];
  if (e !== undefined) {
    var i = e.call(t, r || "default");
    if (_typeof(i) != "object")
      return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (r === "string" ? String : Number)(t);
}
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return _typeof(i) == "symbol" ? i : i + "";
}
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1;r < arguments.length; r++) {
    var t = arguments[r] != null ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function getCropSize(mediaWidth, mediaHeight, containerWidth, containerHeight, aspect, rotation = 0) {
  const { width, height } = rotateSize(mediaWidth, mediaHeight, rotation);
  const fittingWidth = Math.min(width, containerWidth);
  const fittingHeight = Math.min(height, containerHeight);
  if (fittingWidth > fittingHeight * aspect)
    return {
      width: fittingHeight * aspect,
      height: fittingHeight
    };
  return {
    width: fittingWidth,
    height: fittingWidth / aspect
  };
}
function getMediaZoom(mediaSize) {
  return mediaSize.width > mediaSize.height ? mediaSize.width / mediaSize.naturalWidth : mediaSize.height / mediaSize.naturalHeight;
}
function restrictPosition(position, mediaSize, cropSize, zoom, rotation = 0) {
  const { width, height } = rotateSize(mediaSize.width, mediaSize.height, rotation);
  return {
    x: restrictPositionCoord(position.x, width, cropSize.width, zoom),
    y: restrictPositionCoord(position.y, height, cropSize.height, zoom)
  };
}
function restrictPositionCoord(position, mediaSize, cropSize, zoom) {
  const maxPosition = Math.abs(mediaSize * zoom / 2 - cropSize / 2);
  return clamp(position, -maxPosition, maxPosition);
}
function getDistanceBetweenPoints(pointA, pointB) {
  return Math.sqrt(Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2));
}
function getRotationBetweenPoints(pointA, pointB) {
  return Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180 / Math.PI;
}
function computeCroppedArea(crop, mediaSize, cropSize, aspect, zoom, rotation = 0, restrictPosition2 = true) {
  const limitAreaFn = restrictPosition2 ? limitArea : noOp;
  const mediaBBoxSize = rotateSize(mediaSize.width, mediaSize.height, rotation);
  const mediaNaturalBBoxSize = rotateSize(mediaSize.naturalWidth, mediaSize.naturalHeight, rotation);
  const croppedAreaPercentages = {
    x: limitAreaFn(100, ((mediaBBoxSize.width - cropSize.width / zoom) / 2 - crop.x / zoom) / mediaBBoxSize.width * 100),
    y: limitAreaFn(100, ((mediaBBoxSize.height - cropSize.height / zoom) / 2 - crop.y / zoom) / mediaBBoxSize.height * 100),
    width: limitAreaFn(100, cropSize.width / mediaBBoxSize.width * 100 / zoom),
    height: limitAreaFn(100, cropSize.height / mediaBBoxSize.height * 100 / zoom)
  };
  const widthInPixels = Math.round(limitAreaFn(mediaNaturalBBoxSize.width, croppedAreaPercentages.width * mediaNaturalBBoxSize.width / 100));
  const heightInPixels = Math.round(limitAreaFn(mediaNaturalBBoxSize.height, croppedAreaPercentages.height * mediaNaturalBBoxSize.height / 100));
  const sizePixels = mediaNaturalBBoxSize.width >= mediaNaturalBBoxSize.height * aspect ? {
    width: Math.round(heightInPixels * aspect),
    height: heightInPixels
  } : {
    width: widthInPixels,
    height: Math.round(widthInPixels / aspect)
  };
  return {
    croppedAreaPercentages,
    croppedAreaPixels: _objectSpread2(_objectSpread2({}, sizePixels), {}, {
      x: Math.round(limitAreaFn(mediaNaturalBBoxSize.width - sizePixels.width, croppedAreaPercentages.x * mediaNaturalBBoxSize.width / 100)),
      y: Math.round(limitAreaFn(mediaNaturalBBoxSize.height - sizePixels.height, croppedAreaPercentages.y * mediaNaturalBBoxSize.height / 100))
    })
  };
}
function limitArea(max, value) {
  return Math.min(max, Math.max(0, value));
}
function noOp(_max, value) {
  return value;
}
function getInitialCropFromCroppedAreaPercentages(croppedAreaPercentages, mediaSize, rotation, cropSize, minZoom, maxZoom) {
  const mediaBBoxSize = rotateSize(mediaSize.width, mediaSize.height, rotation);
  const zoom = clamp(cropSize.width / mediaBBoxSize.width * (100 / croppedAreaPercentages.width), minZoom, maxZoom);
  return {
    crop: {
      x: zoom * mediaBBoxSize.width / 2 - cropSize.width / 2 - mediaBBoxSize.width * zoom * (croppedAreaPercentages.x / 100),
      y: zoom * mediaBBoxSize.height / 2 - cropSize.height / 2 - mediaBBoxSize.height * zoom * (croppedAreaPercentages.y / 100)
    },
    zoom
  };
}
function getZoomFromCroppedAreaPixels(croppedAreaPixels, mediaSize, cropSize) {
  const mediaZoom = getMediaZoom(mediaSize);
  return cropSize.height > cropSize.width ? cropSize.height / (croppedAreaPixels.height * mediaZoom) : cropSize.width / (croppedAreaPixels.width * mediaZoom);
}
function getInitialCropFromCroppedAreaPixels(croppedAreaPixels, mediaSize, rotation = 0, cropSize, minZoom, maxZoom) {
  const mediaNaturalBBoxSize = rotateSize(mediaSize.naturalWidth, mediaSize.naturalHeight, rotation);
  const zoom = clamp(getZoomFromCroppedAreaPixels(croppedAreaPixels, mediaSize, cropSize), minZoom, maxZoom);
  const cropZoom = cropSize.height > cropSize.width ? cropSize.height / croppedAreaPixels.height : cropSize.width / croppedAreaPixels.width;
  return {
    crop: {
      x: ((mediaNaturalBBoxSize.width - croppedAreaPixels.width) / 2 - croppedAreaPixels.x) * cropZoom,
      y: ((mediaNaturalBBoxSize.height - croppedAreaPixels.height) / 2 - croppedAreaPixels.y) * cropZoom
    },
    zoom
  };
}
function getCenter(a, b) {
  return {
    x: (b.x + a.x) / 2,
    y: (b.y + a.y) / 2
  };
}
function getRadianAngle(degreeValue) {
  return degreeValue * Math.PI / 180;
}
function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
  };
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function classNames(...args) {
  return args.filter((value) => {
    if (typeof value === "string" && value.length > 0)
      return true;
    return false;
  }).join(" ").trim();
}
var styles_default = `.reactEasyCrop_Container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  user-select: none;
  touch-action: none;
  cursor: move;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reactEasyCrop_Image,
.reactEasyCrop_Video {
  will-change: transform; /* this improves performances and prevent painting issues on iOS Chrome */
  max-width: unset; /* prevent global img/video reset rules from constraining the cropper media */
}

.reactEasyCrop_Contain {
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.reactEasyCrop_Cover_Horizontal {
  width: 100%;
  height: auto;
}
.reactEasyCrop_Cover_Vertical {
  width: auto;
  height: 100%;
}

.reactEasyCrop_CropArea {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  box-shadow: 0 0 0 9999em;
  color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.reactEasyCrop_CropAreaRound {
  border-radius: 50%;
}

.reactEasyCrop_CropAreaGrid::before {
  content: ' ';
  box-sizing: border-box;
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.5);
  top: 0;
  bottom: 0;
  left: 33.33%;
  right: 33.33%;
  border-top: 0;
  border-bottom: 0;
}

.reactEasyCrop_CropAreaGrid::after {
  content: ' ';
  box-sizing: border-box;
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.5);
  top: 33.33%;
  bottom: 33.33%;
  left: 0;
  right: 0;
  border-left: 0;
  border-right: 0;
}
`;
var RESIZE_EMIT_DEBOUNCE_TIME = 250;
var MIN_ZOOM = 1;
var MAX_ZOOM = 3;
var KEYBOARD_STEP = 1;
var Cropper = class Cropper2 extends React.Component {
  constructor(..._args) {
    super(..._args);
    this.cropperRef = React.createRef();
    this.imageRef = React.createRef();
    this.videoRef = React.createRef();
    this.containerPosition = {
      x: 0,
      y: 0
    };
    this.containerRef = null;
    this.styleRef = null;
    this.containerRect = null;
    this.mediaSize = {
      width: 0,
      height: 0,
      naturalWidth: 0,
      naturalHeight: 0
    };
    this.dragStartPosition = {
      x: 0,
      y: 0
    };
    this.dragStartCrop = {
      x: 0,
      y: 0
    };
    this.gestureZoomStart = 0;
    this.gestureRotationStart = 0;
    this.isTouching = false;
    this.lastPinchDistance = 0;
    this.lastPinchRotation = 0;
    this.rafDragTimeout = null;
    this.rafPinchTimeout = null;
    this.wheelTimer = null;
    this.resizeEmitTimer = null;
    this.currentDoc = typeof document !== "undefined" ? document : null;
    this.currentWindow = typeof window !== "undefined" ? window : null;
    this.resizeObserver = null;
    this.previousCropSize = null;
    this.isInitialized = false;
    this.dragInteractionSource = null;
    this.state = {
      cropSize: null,
      hasWheelJustStarted: false,
      mediaObjectFit: undefined
    };
    this.initResizeObserver = () => {
      if (typeof window.ResizeObserver === "undefined" || !this.containerRef)
        return;
      let isFirstResize = true;
      this.resizeObserver = new window.ResizeObserver((entries) => {
        if (isFirstResize) {
          isFirstResize = false;
          return;
        }
        this.computeSizes({ isResizeTriggered: true });
      });
      this.resizeObserver.observe(this.containerRef);
    };
    this.onWindowResize = () => {
      this.computeSizes({ isResizeTriggered: true });
    };
    this.preventZoomSafari = (e) => e.preventDefault();
    this.cleanEvents = () => {
      if (!this.currentDoc)
        return;
      this.currentDoc.removeEventListener("mousemove", this.onMouseMove);
      this.currentDoc.removeEventListener("mouseup", this.onDragStopped);
      this.currentDoc.removeEventListener("touchmove", this.onTouchMove);
      this.currentDoc.removeEventListener("touchend", this.onDragStopped);
      this.currentDoc.removeEventListener("gesturechange", this.onGestureChange);
      this.currentDoc.removeEventListener("gestureend", this.onGestureEnd);
      this.currentDoc.removeEventListener("scroll", this.onScroll);
    };
    this.clearScrollEvent = () => {
      if (this.containerRef)
        this.containerRef.removeEventListener("wheel", this.onWheel);
      if (this.wheelTimer)
        clearTimeout(this.wheelTimer);
    };
    this.onMediaLoad = () => {
      const cropSize = this.computeSizes();
      if (cropSize) {
        this.previousCropSize = cropSize;
        this.emitCropData();
        this.setInitialCrop(cropSize);
        this.isInitialized = true;
      }
      if (this.props.onMediaLoaded)
        this.props.onMediaLoaded(this.mediaSize);
    };
    this.setInitialCrop = (cropSize) => {
      if (this.props.initialCroppedAreaPercentages) {
        const { crop, zoom } = getInitialCropFromCroppedAreaPercentages(this.props.initialCroppedAreaPercentages, this.mediaSize, this.props.rotation, cropSize, this.props.minZoom, this.props.maxZoom);
        this.props.onCropChange(crop);
        this.props.onZoomChange && this.props.onZoomChange(zoom);
      } else if (this.props.initialCroppedAreaPixels) {
        const { crop, zoom } = getInitialCropFromCroppedAreaPixels(this.props.initialCroppedAreaPixels, this.mediaSize, this.props.rotation, cropSize, this.props.minZoom, this.props.maxZoom);
        this.props.onCropChange(crop);
        this.props.onZoomChange && this.props.onZoomChange(zoom);
      }
    };
    this.computeSizes = ({ isResizeTriggered = false } = {}) => {
      const mediaRef = this.imageRef.current || this.videoRef.current;
      if (mediaRef && this.containerRef) {
        var _this$imageRef$curren, _this$videoRef$curren, _this$imageRef$curren2, _this$videoRef$curren2, _this$state$cropSize, _this$state$cropSize2;
        this.containerRect = this.containerRef.getBoundingClientRect();
        this.saveContainerPosition();
        const containerAspect = this.containerRect.width / this.containerRect.height;
        const naturalWidth = ((_this$imageRef$curren = this.imageRef.current) === null || _this$imageRef$curren === undefined ? undefined : _this$imageRef$curren.naturalWidth) || ((_this$videoRef$curren = this.videoRef.current) === null || _this$videoRef$curren === undefined ? undefined : _this$videoRef$curren.videoWidth) || 0;
        const naturalHeight = ((_this$imageRef$curren2 = this.imageRef.current) === null || _this$imageRef$curren2 === undefined ? undefined : _this$imageRef$curren2.naturalHeight) || ((_this$videoRef$curren2 = this.videoRef.current) === null || _this$videoRef$curren2 === undefined ? undefined : _this$videoRef$curren2.videoHeight) || 0;
        const isMediaScaledDown = mediaRef.offsetWidth < naturalWidth || mediaRef.offsetHeight < naturalHeight;
        const mediaAspect = naturalWidth / naturalHeight;
        let renderedMediaSize;
        if (isMediaScaledDown)
          switch (this.state.mediaObjectFit) {
            default:
            case "contain":
              renderedMediaSize = containerAspect > mediaAspect ? {
                width: this.containerRect.height * mediaAspect,
                height: this.containerRect.height
              } : {
                width: this.containerRect.width,
                height: this.containerRect.width / mediaAspect
              };
              break;
            case "horizontal-cover":
              renderedMediaSize = {
                width: this.containerRect.width,
                height: this.containerRect.width / mediaAspect
              };
              break;
            case "vertical-cover":
              renderedMediaSize = {
                width: this.containerRect.height * mediaAspect,
                height: this.containerRect.height
              };
              break;
          }
        else
          renderedMediaSize = {
            width: mediaRef.offsetWidth,
            height: mediaRef.offsetHeight
          };
        this.mediaSize = _objectSpread2(_objectSpread2({}, renderedMediaSize), {}, {
          naturalWidth,
          naturalHeight
        });
        if (this.props.setMediaSize)
          this.props.setMediaSize(this.mediaSize);
        const cropSize = this.props.cropSize ? this.props.cropSize : getCropSize(this.mediaSize.width, this.mediaSize.height, this.containerRect.width, this.containerRect.height, this.props.aspect, this.props.rotation);
        if (((_this$state$cropSize = this.state.cropSize) === null || _this$state$cropSize === undefined ? undefined : _this$state$cropSize.height) !== cropSize.height || ((_this$state$cropSize2 = this.state.cropSize) === null || _this$state$cropSize2 === undefined ? undefined : _this$state$cropSize2.width) !== cropSize.width)
          this.props.onCropSizeChange && this.props.onCropSizeChange(cropSize);
        this.setState({ cropSize }, () => this.recomputeCropPosition({ isResizeTriggered }));
        if (this.props.setCropSize)
          this.props.setCropSize(cropSize);
        return cropSize;
      }
    };
    this.saveContainerPosition = () => {
      if (this.containerRef) {
        const bounds = this.containerRef.getBoundingClientRect();
        this.containerPosition = {
          x: bounds.left,
          y: bounds.top
        };
      }
    };
    this.onMouseDown = (e) => {
      if (!this.currentDoc)
        return;
      e.preventDefault();
      this.currentDoc.addEventListener("mousemove", this.onMouseMove);
      this.currentDoc.addEventListener("mouseup", this.onDragStopped);
      this.saveContainerPosition();
      this.onDragStart(Cropper2.getMousePoint(e), "mouse");
    };
    this.onMouseMove = (e) => this.onDrag(Cropper2.getMousePoint(e));
    this.onScroll = (e) => {
      if (!this.currentDoc)
        return;
      e.preventDefault();
      this.saveContainerPosition();
    };
    this.onTouchStart = (e) => {
      if (!this.currentDoc)
        return;
      this.isTouching = true;
      if (this.props.onTouchRequest && !this.props.onTouchRequest(e))
        return;
      this.currentDoc.addEventListener("touchmove", this.onTouchMove, { passive: false });
      this.currentDoc.addEventListener("touchend", this.onDragStopped);
      this.saveContainerPosition();
      if (e.touches.length === 2)
        this.onPinchStart(e);
      else if (e.touches.length === 1)
        this.onDragStart(Cropper2.getTouchPoint(e.touches[0]), "touch");
    };
    this.onTouchMove = (e) => {
      e.preventDefault();
      if (e.touches.length === 2)
        this.onPinchMove(e);
      else if (e.touches.length === 1)
        this.onDrag(Cropper2.getTouchPoint(e.touches[0]));
    };
    this.onGestureStart = (e) => {
      if (!this.currentDoc)
        return;
      e.preventDefault();
      this.currentDoc.addEventListener("gesturechange", this.onGestureChange);
      this.currentDoc.addEventListener("gestureend", this.onGestureEnd);
      this.gestureZoomStart = this.props.zoom;
      this.gestureRotationStart = this.props.rotation;
    };
    this.onGestureChange = (e) => {
      e.preventDefault();
      if (this.isTouching)
        return;
      const point = Cropper2.getMousePoint(e);
      const newZoom = this.gestureZoomStart - 1 + e.scale;
      this.setNewZoom(newZoom, point, { shouldUpdatePosition: true });
      if (this.props.onRotationChange) {
        const newRotation = this.gestureRotationStart + e.rotation;
        this.props.onRotationChange(newRotation);
      }
    };
    this.onGestureEnd = (e) => {
      this.cleanEvents();
    };
    this.onDragStart = ({ x, y }, source) => {
      var _this$props$onInterac, _this$props;
      this.dragStartPosition = {
        x,
        y
      };
      this.dragStartCrop = _objectSpread2({}, this.props.crop);
      this.dragInteractionSource = source;
      (_this$props$onInterac = (_this$props = this.props).onInteractionStart) === null || _this$props$onInterac === undefined || _this$props$onInterac.call(_this$props, { source });
    };
    this.onDrag = ({ x, y }) => {
      if (!this.currentWindow)
        return;
      if (this.rafDragTimeout)
        this.currentWindow.cancelAnimationFrame(this.rafDragTimeout);
      this.rafDragTimeout = this.currentWindow.requestAnimationFrame(() => {
        if (!this.state.cropSize)
          return;
        if (x === undefined || y === undefined)
          return;
        const offsetX = x - this.dragStartPosition.x;
        const offsetY = y - this.dragStartPosition.y;
        const requestedPosition = {
          x: this.dragStartCrop.x + offsetX,
          y: this.dragStartCrop.y + offsetY
        };
        const newPosition = this.props.restrictPosition ? restrictPosition(requestedPosition, this.mediaSize, this.state.cropSize, this.props.zoom, this.props.rotation) : requestedPosition;
        this.props.onCropChange(newPosition);
      });
    };
    this.onDragStopped = () => {
      var _this$props$onInterac2, _this$props2, _this$dragInteraction;
      this.isTouching = false;
      this.cleanEvents();
      this.emitCropData();
      (_this$props$onInterac2 = (_this$props2 = this.props).onInteractionEnd) === null || _this$props$onInterac2 === undefined || _this$props$onInterac2.call(_this$props2, { source: (_this$dragInteraction = this.dragInteractionSource) !== null && _this$dragInteraction !== undefined ? _this$dragInteraction : "mouse" });
      this.dragInteractionSource = null;
    };
    this.onWheel = (e) => {
      if (!this.currentWindow)
        return;
      if (this.props.onWheelRequest && !this.props.onWheelRequest(e))
        return;
      e.preventDefault();
      const point = Cropper2.getMousePoint(e);
      const { pixelY } = import_normalize_wheel.default(e);
      const newZoom = this.props.zoom - pixelY * this.props.zoomSpeed / 200;
      this.setNewZoom(newZoom, point, { shouldUpdatePosition: true });
      if (!this.state.hasWheelJustStarted)
        this.setState({ hasWheelJustStarted: true }, () => {
          var _this$props$onInterac3, _this$props3;
          return (_this$props$onInterac3 = (_this$props3 = this.props).onInteractionStart) === null || _this$props$onInterac3 === undefined ? undefined : _this$props$onInterac3.call(_this$props3, { source: "wheel" });
        });
      if (this.wheelTimer)
        clearTimeout(this.wheelTimer);
      this.wheelTimer = this.currentWindow.setTimeout(() => this.setState({ hasWheelJustStarted: false }, () => {
        var _this$props$onInterac4, _this$props4;
        return (_this$props$onInterac4 = (_this$props4 = this.props).onInteractionEnd) === null || _this$props$onInterac4 === undefined ? undefined : _this$props$onInterac4.call(_this$props4, { source: "wheel" });
      }), 250);
    };
    this.getPointOnContainer = ({ x, y }, containerTopLeft) => {
      if (!this.containerRect)
        throw new Error("The Cropper is not mounted");
      return {
        x: this.containerRect.width / 2 - (x - containerTopLeft.x),
        y: this.containerRect.height / 2 - (y - containerTopLeft.y)
      };
    };
    this.getPointOnMedia = ({ x, y }) => {
      const { crop, zoom } = this.props;
      return {
        x: (x + crop.x) / zoom,
        y: (y + crop.y) / zoom
      };
    };
    this.setNewZoom = (zoom, point, { shouldUpdatePosition = true } = {}) => {
      if (!this.state.cropSize || !this.props.onZoomChange)
        return;
      const newZoom = clamp(zoom, this.props.minZoom, this.props.maxZoom);
      if (shouldUpdatePosition) {
        const zoomPoint = this.getPointOnContainer(point, this.containerPosition);
        const zoomTarget = this.getPointOnMedia(zoomPoint);
        const requestedPosition = {
          x: zoomTarget.x * newZoom - zoomPoint.x,
          y: zoomTarget.y * newZoom - zoomPoint.y
        };
        const newPosition = this.props.restrictPosition ? restrictPosition(requestedPosition, this.mediaSize, this.state.cropSize, newZoom, this.props.rotation) : requestedPosition;
        this.props.onCropChange(newPosition);
      }
      this.props.onZoomChange(newZoom);
    };
    this.getCropData = () => {
      if (!this.state.cropSize)
        return null;
      return computeCroppedArea(this.props.restrictPosition ? restrictPosition(this.props.crop, this.mediaSize, this.state.cropSize, this.props.zoom, this.props.rotation) : this.props.crop, this.mediaSize, this.state.cropSize, this.getAspect(), this.props.zoom, this.props.rotation, this.props.restrictPosition);
    };
    this.emitCropData = () => {
      if (this.resizeEmitTimer) {
        clearTimeout(this.resizeEmitTimer);
        this.resizeEmitTimer = null;
      }
      const cropData = this.getCropData();
      if (!cropData)
        return;
      const { croppedAreaPercentages, croppedAreaPixels } = cropData;
      if (this.props.onCropComplete)
        this.props.onCropComplete(croppedAreaPercentages, croppedAreaPixels);
      if (this.props.onCropAreaChange)
        this.props.onCropAreaChange(croppedAreaPercentages, croppedAreaPixels);
    };
    this.emitCropAreaChange = () => {
      const cropData = this.getCropData();
      if (!cropData)
        return;
      const { croppedAreaPercentages, croppedAreaPixels } = cropData;
      if (this.props.onCropAreaChange)
        this.props.onCropAreaChange(croppedAreaPercentages, croppedAreaPixels);
    };
    this.recomputeCropPosition = ({ isResizeTriggered = false } = {}) => {
      var _this$previousCropSiz, _this$previousCropSiz2;
      if (!this.state.cropSize)
        return;
      let adjustedCrop = this.props.crop;
      if (this.isInitialized && ((_this$previousCropSiz = this.previousCropSize) === null || _this$previousCropSiz === undefined ? undefined : _this$previousCropSiz.width) && ((_this$previousCropSiz2 = this.previousCropSize) === null || _this$previousCropSiz2 === undefined ? undefined : _this$previousCropSiz2.height)) {
        if (Math.abs(this.previousCropSize.width - this.state.cropSize.width) > 0.000001 || Math.abs(this.previousCropSize.height - this.state.cropSize.height) > 0.000001) {
          const scaleX = this.state.cropSize.width / this.previousCropSize.width;
          const scaleY = this.state.cropSize.height / this.previousCropSize.height;
          adjustedCrop = {
            x: this.props.crop.x * scaleX,
            y: this.props.crop.y * scaleY
          };
        }
      }
      const newPosition = this.props.restrictPosition ? restrictPosition(adjustedCrop, this.mediaSize, this.state.cropSize, this.props.zoom, this.props.rotation) : adjustedCrop;
      this.previousCropSize = this.state.cropSize;
      this.props.onCropChange(newPosition);
      if (isResizeTriggered)
        this.debouncedEmitCropData();
      else
        this.emitCropData();
    };
    this.debouncedEmitCropData = () => {
      if (!this.currentWindow)
        return;
      if (this.resizeEmitTimer)
        clearTimeout(this.resizeEmitTimer);
      this.resizeEmitTimer = this.currentWindow.setTimeout(() => {
        this.emitCropData();
      }, RESIZE_EMIT_DEBOUNCE_TIME);
    };
    this.onKeyDown = (event) => {
      const { crop, onCropChange, keyboardStep, zoom, rotation } = this.props;
      let step = keyboardStep;
      if (!this.state.cropSize)
        return;
      if (event.shiftKey)
        step *= 0.2;
      let newCrop = _objectSpread2({}, crop);
      switch (event.key) {
        case "ArrowUp":
          newCrop.y -= step;
          event.preventDefault();
          break;
        case "ArrowDown":
          newCrop.y += step;
          event.preventDefault();
          break;
        case "ArrowLeft":
          newCrop.x -= step;
          event.preventDefault();
          break;
        case "ArrowRight":
          newCrop.x += step;
          event.preventDefault();
          break;
        default:
          return;
      }
      if (this.props.restrictPosition)
        newCrop = restrictPosition(newCrop, this.mediaSize, this.state.cropSize, zoom, rotation);
      if (!event.repeat) {
        var _this$props$onInterac5, _this$props5;
        (_this$props$onInterac5 = (_this$props5 = this.props).onInteractionStart) === null || _this$props$onInterac5 === undefined || _this$props$onInterac5.call(_this$props5, { source: "keyboard" });
      }
      onCropChange(newCrop);
    };
    this.onKeyUp = (event) => {
      var _this$props$onInterac6, _this$props6;
      switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          event.preventDefault();
          break;
        default:
          return;
      }
      this.emitCropData();
      (_this$props$onInterac6 = (_this$props6 = this.props).onInteractionEnd) === null || _this$props$onInterac6 === undefined || _this$props$onInterac6.call(_this$props6, { source: "keyboard" });
    };
  }
  componentDidMount() {
    if (!this.currentDoc || !this.currentWindow)
      return;
    if (this.containerRef) {
      if (this.containerRef.ownerDocument)
        this.currentDoc = this.containerRef.ownerDocument;
      if (this.currentDoc.defaultView)
        this.currentWindow = this.currentDoc.defaultView;
      this.initResizeObserver();
      if (typeof window.ResizeObserver === "undefined")
        this.currentWindow.addEventListener("resize", this.onWindowResize);
      this.props.zoomWithScroll && this.containerRef.addEventListener("wheel", this.onWheel, { passive: false });
      this.containerRef.addEventListener("gesturestart", this.onGestureStart);
    }
    this.currentDoc.addEventListener("scroll", this.onScroll);
    if (!this.props.disableAutomaticStylesInjection) {
      this.styleRef = this.currentDoc.createElement("style");
      this.styleRef.setAttribute("type", "text/css");
      if (this.props.nonce)
        this.styleRef.setAttribute("nonce", this.props.nonce);
      this.styleRef.innerHTML = styles_default;
      this.currentDoc.head.appendChild(this.styleRef);
    }
    if (this.imageRef.current && this.imageRef.current.complete)
      this.onMediaLoad();
    if (this.props.setImageRef)
      this.props.setImageRef(this.imageRef);
    if (this.props.setVideoRef)
      this.props.setVideoRef(this.videoRef);
    if (this.props.setCropperRef)
      this.props.setCropperRef(this.cropperRef);
  }
  componentWillUnmount() {
    var _this$resizeObserver;
    if (!this.currentDoc || !this.currentWindow)
      return;
    if (typeof window.ResizeObserver === "undefined")
      this.currentWindow.removeEventListener("resize", this.onWindowResize);
    (_this$resizeObserver = this.resizeObserver) === null || _this$resizeObserver === undefined || _this$resizeObserver.disconnect();
    if (this.resizeEmitTimer)
      clearTimeout(this.resizeEmitTimer);
    if (this.containerRef)
      this.containerRef.removeEventListener("gesturestart", this.preventZoomSafari);
    if (this.styleRef) {
      var _this$styleRef$parent;
      (_this$styleRef$parent = this.styleRef.parentNode) === null || _this$styleRef$parent === undefined || _this$styleRef$parent.removeChild(this.styleRef);
    }
    this.cleanEvents();
    this.props.zoomWithScroll && this.clearScrollEvent();
  }
  componentDidUpdate(prevProps) {
    var _prevProps$cropSize, _this$props$cropSize, _prevProps$cropSize2, _this$props$cropSize2, _prevProps$crop, _this$props$crop, _prevProps$crop2, _this$props$crop2;
    if (prevProps.rotation !== this.props.rotation) {
      this.computeSizes();
      this.recomputeCropPosition();
    } else if (prevProps.aspect !== this.props.aspect)
      this.computeSizes();
    else if (prevProps.objectFit !== this.props.objectFit)
      this.computeSizes();
    else if (prevProps.zoom !== this.props.zoom)
      this.recomputeCropPosition();
    else if (((_prevProps$cropSize = prevProps.cropSize) === null || _prevProps$cropSize === undefined ? undefined : _prevProps$cropSize.height) !== ((_this$props$cropSize = this.props.cropSize) === null || _this$props$cropSize === undefined ? undefined : _this$props$cropSize.height) || ((_prevProps$cropSize2 = prevProps.cropSize) === null || _prevProps$cropSize2 === undefined ? undefined : _prevProps$cropSize2.width) !== ((_this$props$cropSize2 = this.props.cropSize) === null || _this$props$cropSize2 === undefined ? undefined : _this$props$cropSize2.width))
      this.computeSizes();
    else if (((_prevProps$crop = prevProps.crop) === null || _prevProps$crop === undefined ? undefined : _prevProps$crop.x) !== ((_this$props$crop = this.props.crop) === null || _this$props$crop === undefined ? undefined : _this$props$crop.x) || ((_prevProps$crop2 = prevProps.crop) === null || _prevProps$crop2 === undefined ? undefined : _prevProps$crop2.y) !== ((_this$props$crop2 = this.props.crop) === null || _this$props$crop2 === undefined ? undefined : _this$props$crop2.y))
      this.emitCropAreaChange();
    if (prevProps.zoomWithScroll !== this.props.zoomWithScroll && this.containerRef)
      this.props.zoomWithScroll ? this.containerRef.addEventListener("wheel", this.onWheel, { passive: false }) : this.clearScrollEvent();
    if (prevProps.video !== this.props.video) {
      var _this$videoRef$curren3;
      (_this$videoRef$curren3 = this.videoRef.current) === null || _this$videoRef$curren3 === undefined || _this$videoRef$curren3.load();
    }
    const objectFit = this.getObjectFit();
    if (objectFit !== this.state.mediaObjectFit)
      this.setState({ mediaObjectFit: objectFit }, this.computeSizes);
  }
  getAspect() {
    const { cropSize, aspect } = this.props;
    if (cropSize)
      return cropSize.width / cropSize.height;
    return aspect;
  }
  getObjectFit() {
    if (this.props.objectFit === "cover") {
      if ((this.imageRef.current || this.videoRef.current) && this.containerRef) {
        var _this$imageRef$curren3, _this$videoRef$curren4, _this$imageRef$curren4, _this$videoRef$curren5;
        this.containerRect = this.containerRef.getBoundingClientRect();
        const containerAspect = this.containerRect.width / this.containerRect.height;
        return (((_this$imageRef$curren3 = this.imageRef.current) === null || _this$imageRef$curren3 === undefined ? undefined : _this$imageRef$curren3.naturalWidth) || ((_this$videoRef$curren4 = this.videoRef.current) === null || _this$videoRef$curren4 === undefined ? undefined : _this$videoRef$curren4.videoWidth) || 0) / (((_this$imageRef$curren4 = this.imageRef.current) === null || _this$imageRef$curren4 === undefined ? undefined : _this$imageRef$curren4.naturalHeight) || ((_this$videoRef$curren5 = this.videoRef.current) === null || _this$videoRef$curren5 === undefined ? undefined : _this$videoRef$curren5.videoHeight) || 0) < containerAspect ? "horizontal-cover" : "vertical-cover";
      }
      return "horizontal-cover";
    }
    return this.props.objectFit;
  }
  onPinchStart(e) {
    const pointA = Cropper2.getTouchPoint(e.touches[0]);
    const pointB = Cropper2.getTouchPoint(e.touches[1]);
    this.lastPinchDistance = getDistanceBetweenPoints(pointA, pointB);
    this.lastPinchRotation = getRotationBetweenPoints(pointA, pointB);
    this.onDragStart(getCenter(pointA, pointB), "touch");
  }
  onPinchMove(e) {
    if (!this.currentDoc || !this.currentWindow)
      return;
    const pointA = Cropper2.getTouchPoint(e.touches[0]);
    const pointB = Cropper2.getTouchPoint(e.touches[1]);
    const center = getCenter(pointA, pointB);
    this.onDrag(center);
    if (this.rafPinchTimeout)
      this.currentWindow.cancelAnimationFrame(this.rafPinchTimeout);
    this.rafPinchTimeout = this.currentWindow.requestAnimationFrame(() => {
      const distance = getDistanceBetweenPoints(pointA, pointB);
      const newZoom = this.props.zoom * (distance / this.lastPinchDistance);
      this.setNewZoom(newZoom, center, { shouldUpdatePosition: false });
      this.lastPinchDistance = distance;
      const rotation = getRotationBetweenPoints(pointA, pointB);
      const newRotation = this.props.rotation + (rotation - this.lastPinchRotation);
      this.props.onRotationChange && this.props.onRotationChange(newRotation);
      this.lastPinchRotation = rotation;
    });
  }
  render() {
    var _this$state$mediaObje;
    const { image, video, mediaProps, cropperProps, transform, crop: { x, y }, rotation, zoom, cropShape, showGrid, roundCropAreaPixels, style: { containerStyle, cropAreaStyle, mediaStyle }, classes: { containerClassName, cropAreaClassName, mediaClassName } } = this.props;
    const objectFit = (_this$state$mediaObje = this.state.mediaObjectFit) !== null && _this$state$mediaObje !== undefined ? _this$state$mediaObje : this.getObjectFit();
    return /* @__PURE__ */ React.createElement("div", {
      onMouseDown: this.onMouseDown,
      onTouchStart: this.onTouchStart,
      ref: (el) => this.containerRef = el,
      "data-testid": "container",
      style: containerStyle,
      className: classNames("reactEasyCrop_Container", containerClassName)
    }, image ? /* @__PURE__ */ React.createElement("img", _objectSpread2(_objectSpread2({
      alt: "",
      className: classNames("reactEasyCrop_Image", objectFit === "contain" && "reactEasyCrop_Contain", objectFit === "horizontal-cover" && "reactEasyCrop_Cover_Horizontal", objectFit === "vertical-cover" && "reactEasyCrop_Cover_Vertical", mediaClassName)
    }, mediaProps), {}, {
      src: image,
      ref: this.imageRef,
      style: _objectSpread2(_objectSpread2({}, mediaStyle), {}, { transform: transform || `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${zoom})` }),
      onLoad: this.onMediaLoad
    })) : video && /* @__PURE__ */ React.createElement("video", _objectSpread2(_objectSpread2({
      autoPlay: true,
      playsInline: true,
      loop: true,
      muted: true,
      className: classNames("reactEasyCrop_Video", objectFit === "contain" && "reactEasyCrop_Contain", objectFit === "horizontal-cover" && "reactEasyCrop_Cover_Horizontal", objectFit === "vertical-cover" && "reactEasyCrop_Cover_Vertical", mediaClassName)
    }, mediaProps), {}, {
      ref: this.videoRef,
      onLoadedMetadata: this.onMediaLoad,
      style: _objectSpread2(_objectSpread2({}, mediaStyle), {}, { transform: transform || `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${zoom})` }),
      controls: false
    }), (Array.isArray(video) ? video : [{ src: video }]).map((item) => /* @__PURE__ */ React.createElement("source", _objectSpread2({ key: item.src }, item)))), this.state.cropSize && /* @__PURE__ */ React.createElement("div", _objectSpread2({
      ref: this.cropperRef,
      style: _objectSpread2(_objectSpread2({}, cropAreaStyle), {}, {
        width: roundCropAreaPixels ? Math.round(this.state.cropSize.width) : this.state.cropSize.width,
        height: roundCropAreaPixels ? Math.round(this.state.cropSize.height) : this.state.cropSize.height
      }),
      tabIndex: 0,
      onKeyDown: this.onKeyDown,
      onKeyUp: this.onKeyUp,
      "data-testid": "cropper",
      className: classNames("reactEasyCrop_CropArea", cropShape === "round" && "reactEasyCrop_CropAreaRound", showGrid && "reactEasyCrop_CropAreaGrid", cropAreaClassName)
    }, cropperProps)));
  }
};
Cropper.defaultProps = {
  zoom: 1,
  rotation: 0,
  aspect: 4 / 3,
  maxZoom: MAX_ZOOM,
  minZoom: MIN_ZOOM,
  cropShape: "rect",
  objectFit: "contain",
  showGrid: true,
  style: {},
  classes: {},
  mediaProps: {},
  cropperProps: {},
  zoomSpeed: 1,
  restrictPosition: true,
  zoomWithScroll: true,
  keyboardStep: KEYBOARD_STEP
};
Cropper.getMousePoint = (e) => ({
  x: Number(e.clientX),
  y: Number(e.clientY)
});
Cropper.getTouchPoint = (touch) => ({
  x: Number(touch.clientX),
  y: Number(touch.clientY)
});
var src_default = Cropper;

// src/registry/thornberry/components/account-avatar-upload.tsx
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
var MAX_AVATAR_SIZE = 5 * 1024 * 1024;
var ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];
var createImage = (url) => new Promise((resolve, reject) => {
  const image = new Image;
  image.addEventListener("load", () => resolve(image));
  image.addEventListener("error", (error) => reject(error));
  image.setAttribute("crossOrigin", "anonymous");
  image.src = url;
});
var getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return null;
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
  });
};
var sizeClassMap = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-14",
  "2xl": "size-16"
};
var sizePixelMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
  "2xl": 64
};
var AvatarUpload = ({
  size = "md",
  editable = true,
  uploadEnabled = true,
  onUpload,
  onClear
}) => {
  const { authClient, toaster } = useAccountContext();
  const { data: session, refetch } = authClient.useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const canUpload = uploadEnabled && !!onUpload;
  const hasImage = !!(previewUrl || session?.user.image);
  const isBusy = isUploading || isClearing;
  const isCropping = !!imageToCrop;
  const pixelSize = sizePixelMap[size];
  const iconSize = Math.max(16, pixelSize * 0.4);
  const resetCrop = useCallback(() => {
    setImageToCrop(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);
  const handleClear = useCallback(async () => {
    if (!onClear || isBusy)
      return;
    setIsClearing(true);
    setDialogOpen(false);
    try {
      await onClear();
      setPreviewUrl(null);
      await refetch();
      toaster.success({
        title: "Avatar removed",
        description: "Your profile picture has been removed."
      });
    } catch (error) {
      toaster.error({
        title: "Failed to remove avatar",
        description: error instanceof Error ? error.message : "Failed to remove avatar"
      });
    } finally {
      setIsClearing(false);
    }
  }, [onClear, isBusy, refetch, toaster]);
  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file)
      return;
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      toaster.error({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, WebP, or GIF image."
      });
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toaster.error({
        title: "File too large",
        description: "Image must be less than 5 MB."
      });
      return;
    }
    const reader = new FileReader;
    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [toaster]);
  const handleCropConfirm = useCallback(async () => {
    if (!imageToCrop || !croppedAreaPixels || !onUpload)
      return;
    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (!croppedBlob) {
        throw new Error("Failed to crop image");
      }
      setPreviewUrl(URL.createObjectURL(croppedBlob));
      await onUpload(croppedBlob);
      await refetch();
      setImageToCrop(null);
      setDialogOpen(false);
      toaster.success({
        title: "Avatar updated",
        description: "Your profile picture has been updated."
      });
    } catch (error) {
      setPreviewUrl(null);
      toaster.error({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar"
      });
    } finally {
      setIsUploading(false);
    }
  }, [imageToCrop, croppedAreaPixels, onUpload, refetch, toaster]);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "avatar-upload-wrapper relative inline-flex w-fit shrink-0",
        role: editable ? "button" : undefined,
        tabIndex: editable && !isBusy ? 0 : undefined,
        onClick: () => {
          if (editable && !isBusy)
            setDialogOpen(true);
        },
        onKeyDown: (event) => {
          if (editable && !isBusy && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            setDialogOpen(true);
          }
        },
        style: { cursor: editable && !isBusy ? "pointer" : "default" },
        children: [
          /* @__PURE__ */ jsxs(AvatarRoot, {
            className: sizeClassMap[size],
            children: [
              /* @__PURE__ */ jsx(AvatarImage, {
                src: previewUrl || session?.user.image || undefined
              }),
              /* @__PURE__ */ jsx(AvatarFallback, {
                children: session?.user.name?.charAt(0)
              })
            ]
          }),
          editable && /* @__PURE__ */ jsx("div", {
            className: "avatar-overlay absolute inset-0 flex items-center justify-center rounded-full bg-black/60 transition-opacity",
            style: { opacity: isBusy ? 1 : 0, pointerEvents: "none" },
            children: isBusy ? /* @__PURE__ */ jsx(Loader2, {
              size: iconSize,
              color: "white",
              className: "animate-spin"
            }) : /* @__PURE__ */ jsx(Camera, {
              size: iconSize,
              color: "white"
            })
          }),
          /* @__PURE__ */ jsx("style", {
            children: `
          .avatar-upload-wrapper:hover .avatar-overlay {
            opacity: 1 !important;
          }
        `
          })
        ]
      }),
      /* @__PURE__ */ jsx("input", {
        ref: fileInputRef,
        type: "file",
        accept: ALLOWED_AVATAR_TYPES.join(","),
        onChange: handleFileChange,
        style: { display: "none" }
      }),
      /* @__PURE__ */ jsxs(DialogRoot, {
        open: dialogOpen,
        onOpenChange: ({ open }) => {
          setDialogOpen(open);
          if (!open)
            resetCrop();
        },
        children: [
          /* @__PURE__ */ jsx(DialogBackdrop, {}),
          /* @__PURE__ */ jsx(DialogPositioner, {
            children: /* @__PURE__ */ jsxs(DialogContent, {
              children: [
                /* @__PURE__ */ jsx(DialogTitle, {
                  children: isCropping ? "Crop your photo" : "Profile photo"
                }),
                isCropping ? /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col gap-4",
                  children: [
                    /* @__PURE__ */ jsx("div", {
                      style: {
                        position: "relative",
                        width: "100%",
                        height: 300,
                        background: "var(--colors-background-subtle)",
                        borderRadius: "var(--radii-md)",
                        overflow: "hidden"
                      },
                      children: /* @__PURE__ */ jsx(src_default, {
                        image: imageToCrop ?? undefined,
                        crop,
                        zoom,
                        aspect: 1,
                        cropShape: "round",
                        showGrid: false,
                        onCropChange: setCrop,
                        onCropComplete: (_, pixels) => setCroppedAreaPixels(pixels),
                        onZoomChange: setZoom
                      })
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex flex-col gap-2",
                      children: [
                        /* @__PURE__ */ jsx("p", {
                          className: "text-muted-foreground text-sm",
                          children: "Zoom"
                        }),
                        /* @__PURE__ */ jsx("input", {
                          type: "range",
                          min: 1,
                          max: 3,
                          step: 0.1,
                          value: zoom,
                          onChange: (event) => setZoom(Number(event.target.value)),
                          className: "w-full"
                        })
                      ]
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center justify-end gap-2",
                      children: [
                        /* @__PURE__ */ jsx(Button, {
                          variant: "outline",
                          onClick: resetCrop,
                          children: "Cancel"
                        }),
                        /* @__PURE__ */ jsx(Button, {
                          onClick: handleCropConfirm,
                          disabled: isUploading,
                          children: isUploading ? "Uploading..." : "Save"
                        })
                      ]
                    })
                  ]
                }) : /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col gap-3",
                  children: [
                    canUpload ? /* @__PURE__ */ jsxs(Button, {
                      variant: "outline",
                      className: "w-full justify-start gap-3",
                      onClick: () => fileInputRef.current?.click(),
                      children: [
                        /* @__PURE__ */ jsx(CloudUpload, {
                          className: "size-5"
                        }),
                        "Upload new photo"
                      ]
                    }) : /* @__PURE__ */ jsx("p", {
                      className: "text-muted-foreground text-sm",
                      children: "Photo uploads are unavailable right now."
                    }),
                    hasImage && onClear && /* @__PURE__ */ jsxs(Button, {
                      variant: "outline",
                      className: "w-full justify-start gap-3 text-red-500 hover:text-red-600",
                      onClick: handleClear,
                      disabled: isClearing,
                      children: [
                        /* @__PURE__ */ jsx(Trash2, {
                          className: "size-5"
                        }),
                        isClearing ? "Removing..." : "Remove photo"
                      ]
                    })
                  ]
                })
              ]
            })
          })
        ]
      })
    ]
  });
};
export {
  AvatarUpload
};
