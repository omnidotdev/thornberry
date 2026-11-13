import type { Area } from "react-easy-crop";
/**
 * Image types every avatar/logo uploader accepts. Shared so the personal
 * avatar and the workspace logo accept exactly the same inputs
 */
declare const ALLOWED_IMAGE_TYPES: string[];
/** Maximum upload size for any avatar/logo: 5 MB */
declare const MAX_IMAGE_SIZE: number;
/**
 * Maximum upload size for a workspace banner: 10 MB. Banners are wide header
 * images, so they get a larger budget than the square avatar/logo. Mirrors the
 * identity server's banner upload limit
 */
declare const MAX_BANNER_IMAGE_SIZE: number;
/**
 * Banner crop aspect (width / height). Products render the banner as a wide
 * header cropped with object-fit cover at roughly 4:1 (e.g. 1600x400)
 */
declare const BANNER_ASPECT = 4;
/**
 * Crop an image to the given pixel area and return a JPEG Blob. An opaque white
 * background is filled first so transparent source pixels do not encode as
 * black in the alpha-less JPEG output.
 */
declare const getCroppedImg: (imageSrc: string, pixelCrop: Area) => Promise<Blob | null>;
export { ALLOWED_IMAGE_TYPES, BANNER_ASPECT, getCroppedImg, MAX_BANNER_IMAGE_SIZE, MAX_IMAGE_SIZE, };
