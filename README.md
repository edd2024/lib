# lib
A modular front-end component library (JS + CSS) by Elevate Digital Designs.

## Use from your domain
```html
<link rel="stylesheet" href="https://elevatedigitaldesigns.net/lib/lib.min.css">
<script src="https://elevatedigitaldesigns.net/lib/lib.min.js"></script>
<script>Lib.initLib();</script>
```

## Notes
- `src/js/modules.js` is checked in **and** auto-generated each build. Edits will be overwritten.
- Put your files at:
  - JS → `src/js/3d-stack.js`, `src/js/progress-indicator.js` (or add more)
  - CSS → `src/css/3d-stack.css`, `src/css/progress-indicator.css`
- If a module exports `init()`, it will be called automatically.
