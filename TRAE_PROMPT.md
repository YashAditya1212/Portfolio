# Trae Prompt — Fix Hero.jsx Three.js Errors

## Context
File: `src/components/Hero.jsx`
Framework: React + Vite
Library: Three.js (latest via npm)

## Errors to Fix

### 1. `THREE.Clock deprecated` → use `performance.now()`
**Problem:** `new THREE.Clock()` and `clock.getElapsedTime()` are deprecated in Three.js r160+.
**Fix:** Replace with `performance.now()`:
```js
// REMOVE this:
const clock = new THREE.Clock()
material.uniforms.uTime.value = clock.getElapsedTime()

// REPLACE with:
const startTime = performance.now()
// inside animate():
material.uniforms.uTime.value = (performance.now() - startTime) / 1000
```

---

### 2. `WebGL: INVALID_OPERATION: uniform2f/uniform1f: location not from associated program`
**Problem:** Three.js tries to set shader uniforms after `renderer.setSize()` is called during window resize. The resize call causes the WebGL program to be re-linked, invalidating cached uniform locations.

**Root causes:**
- `renderer.setSize(w, h)` with no third argument causes Three.js to also set canvas CSS styles, triggering a layout thrash mid-frame
- The resize handler accesses `material.uniforms` before the material is fully initialised (async texture load)

**Fix:**
```js
// 1. Use false as third arg to setSize — don't touch CSS
renderer.setSize(w, h, false)

// 2. Guard the resize handler with a ref check
const matRef = useRef(null)  // store material reference

// In loader.load callback:
matRef.current = material

// In onResize:
const onResize = () => {
  const w = wrap.clientWidth, h = wrap.clientHeight
  renderer.setSize(w, h, false)           // ← false prevents CSS mutation
  if (matRef.current) {                   // ← guard against pre-load resize
    matRef.current.uniforms.uRes.value.set(w, h)
  }
}
```

---

### 3. `yash.png not visible` — portrait photo missing from hero
**Problem:** The photo was never added to the JSX. The Three.js canvas occupies `z-index: 1` and all text/UI is at `z-index: 4`. The photo must sit at `z-index: 2` with `mix-blend-mode: lighten` so it composites over the dark canvas.

**Fix — add this JSX inside the `<section>` after the `<canvas>`:**
```jsx
<div style={{
  position: 'absolute', inset: 0, zIndex: 2,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  pointerEvents: 'none',
}}>
  <img
    src="/yash.png"
    alt="Yash"
    style={{
      height: '88vh',
      width: 'auto',
      maxWidth: '55vw',
      objectFit: 'contain',
      objectPosition: 'center bottom',
      mixBlendMode: 'lighten',
      maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
      opacity: 0.9,
      userSelect: 'none',
    }}
  />
</div>
```

**Important:** `yash.png` must be placed in the `public/` folder (not `src/assets/`).
The image must be a cutout (transparent background) for `mix-blend-mode: lighten` to work correctly.

---

### 4. `favicon.ico 404`
Place any `.ico` file at `public/favicon.ico`, or remove the favicon `<link>` from `index.html`.

---

## Summary of all changes to Hero.jsx

| Issue | Old Code | New Code |
|-------|----------|----------|
| Deprecated Clock | `new THREE.Clock()` + `.getElapsedTime()` | `performance.now()` based timer |
| WebGL uniform error | `renderer.setSize(w, h)` | `renderer.setSize(w, h, false)` |
| Uniform guard missing | Direct access in resize | `if (matRef.current)` guard |
| Photo not visible | Not in JSX | `<img>` at z-index 2 with `mix-blend-mode: lighten` |
