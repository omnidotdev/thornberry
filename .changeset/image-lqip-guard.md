---
"@omnidotdev/thornberry": patch
---

`Image` and `blurUpStyle` only use an `lqip` that is a small base64 image data URI; anything else (a URL, SVG, or an oversized value) shows no placeholder, since previews can come from stored user data
