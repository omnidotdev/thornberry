import type { Area } from "react-easy-crop";
/**
 * Image types every avatar/logo uploader accepts. Shared so the personal
 * avatar and the workspace logo accept exactly the same inputs
 */
declare const ALLOWED_IMAGE_TYPES: string[];
/** Maximum upload size for any avatar/logo: 5 MB */
declare const MAX_IMAGE_SIZE: number;
/**
 * Crop an image to the given pixel area and return a JPEG Blob. An opaque white
 * background is filled first so transparent source pixels do not encode as
 * black in the alpha-less JPEG output.
 */
declare const getCroppedImg: (imageSrc: string, pixelCrop: Area) => Promise<Blob | null>;
export { ALLOWED_IMAGE_TYPES, getCroppedImg, MAX_IMAGE_SIZE };
