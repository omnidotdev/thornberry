---
"@omnidotdev/thornberry": minor
---

Add images to the rich text editor and a new date time picker.

Pass `images` to `RichTextEditor` to upload, paste, drop, or link images. Images are blocks of their own with required alt text, width presets, and keyboard access (select one with the arrow keys, then press Enter). They export as email-safe HTML with https sources only; `isAllowedSrc` keeps every exported image on your own host, and images from elsewhere wait for an uploaded copy (`hasExternalImages`). `onUpdate` also reports `hasMissingAltText` and `isUploading` so sending can wait. Without `images`, the editor is unchanged. `RichTextContent` renders images only with the new `allowImages` prop.

`DateTimePicker` picks a date and a time in an explicit time zone and reports an ISO 8601 string with offset. It reads times in the locale's own format, explains daylight saving gaps and repeats, keeps the same moment when the time zone changes, and supports `minValue="now"` and `maxValue` limits.
