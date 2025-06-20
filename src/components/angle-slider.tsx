"use client";

import { useState } from "react";

import {
  AngleSliderControl,
  AngleSliderMarker,
  AngleSliderMarkerGroup,
  AngleSliderRoot,
  AngleSliderThumb,
  AngleSliderValueText,
} from "@/registry/thornberry/components/angle-slider";

const AngleSlider = () => {
  const [angle, setAngle] = useState(69);

  return (
    <AngleSliderRoot
      value={angle}
      onValueChange={({ value }) => setAngle(value)}
      className="mb-4"
    >
      <AngleSliderControl>
        <AngleSliderThumb />
        <AngleSliderMarkerGroup>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((value) => (
            <AngleSliderMarker key={value} value={value} />
          ))}
        </AngleSliderMarkerGroup>
      </AngleSliderControl>
      <AngleSliderValueText>{angle} ºC</AngleSliderValueText>
    </AngleSliderRoot>
  );
};

export default AngleSlider;
