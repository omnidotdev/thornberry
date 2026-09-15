import type { Area } from "react-easy-crop";

/**
 * Image types every avatar/logo uploader accepts. Shared so the personal
 * avatar and the workspace logo accept exactly the same inputs
 */
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/** Maximum upload size for any avatar/logo: 5 MB */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * Crop an image to the given pixel area and return a JPEG Blob. An opaque white
 * background is filled first so transparent source pixels do not encode as
 * black in the alpha-less JPEG output.
 */
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
): Promise<Blob | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
  });
};

export { ALLOWED_IMAGE_TYPES, getCroppedImg, MAX_IMAGE_SIZE };
