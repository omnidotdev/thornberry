import type { Area } from "react-easy-crop";
/**
 * Crop an image to the given pixel area and return a JPEG Blob. An opaque white
 * background is filled first so transparent source pixels do not encode as
 * black in the alpha-less JPEG output.
 */
declare const getCroppedImg: (imageSrc: string, pixelCrop: Area) => Promise<Blob | null>;
export { getCroppedImg };
