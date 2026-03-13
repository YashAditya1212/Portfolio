import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─── GLSL ES 3.0 shaders (Three.js r163+ defaults to WebGL2) ─────────────────
// Changes from GLSL1:
//   varying      → in (fragment) / out (vertex)
//   texture2D()  → texture()
//   gl_FragColor → explicit out vec4 fragColor
const VERT = `#version 300 es
out vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;

uniform sampler2D uBg;
uniform vec2  uMouse;
uniform float uTime;
uniform vec2  uRes;
uniform float uReveal;

in  vec2 vUv;
out vec4 fragColor;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main(){
  vec2 uv  = vUv;
  vec2 mUv = uMouse / uRes;
  mUv.y    = 1.0 - mUv.y;

  // layered water ripples emanating from cursor
  float disp = 0.0;
  for(int i = 0; i < 6; i++){
    float fi  = float(i);
    vec2  d   = uv - mUv;
    float dst = length(d * vec2(uRes.x / uRes.y, 1.0));
    disp += sin(dst * (18.0 + fi * 6.0) - uTime * (2.5 + fi * 0.4) + fi * 0.3)
          * exp(-dst * (6.0 + fi * 1.5)) * 0.012;
  }

  // subtle animated surface noise
  vec2  nuv = uv * 8.0 + uTime * 0.04;
  float n1  = hash(floor(nuv));
  float n2  = hash(floor(nuv + vec2(1.0, 0.0)));
  float n3  = hash(floor(nuv + vec2(0.0, 1.0)));
  float n4  = hash(floor(nuv + vec2(1.0, 1.0)));
  vec2  ff  = fract(nuv); ff = ff * ff * (3.0 - 2.0 * ff);
  float noise = mix(mix(n1, n2, ff.x), mix(n3, n4, ff.x), ff.y) * 0.006;

  vec2 dUv = clamp(uv + vec2(disp + noise), 0.001, 0.999);
  vec4 tex = texture(uBg, dUv);          // ← texture() not texture2D()

  // radial reveal around cursor position
  float d2m    = length((uv - mUv) * vec2(uRes.x / uRes.y, 1.0));
  float rRad   = 0.22 * uReveal;
  float reveal = pow(smoothstep(rRad, rRad * 0.1, d2m), 0.7);

  // dark water base with shimmer
  float sh   = sin(uv.x * 60.0 + uTime * 0.8) * sin(uv.y * 40.0 - uTime * 0.5) * 0.012;
  vec4  dark = vec4(0.02 + sh * 0.3, 0.04 + sh * 0.6, 0.05 + sh * 0.5, 1.0);

  fragColor = mix(dark, tex, reveal);    // ← fragColor not gl_FragColor
}`

const BG_URL = 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1920&q=80'

export default function Hero() {
  const canvasRef = useRef(null)
  const wrapRef   = useRef(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const revealRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return

    const abort = { cancelled: false }
    let animId  = null

    const W = wrap.clientWidth  || window.innerWidth
    const H = wrap.clientHeight || window.innerHeight

    // ── renderer ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H, false)

    const scene  = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    // ── image load — raw Image() bypasses TextureLoader cache ────────────
    // TextureLoader caches by URL and can fire callbacks synchronously on
    // repeat calls, racing against cleanup. Raw Image never fires sync.
    const img = new Image()
    img.crossOrigin = ''
    let material = null
    const startT = performance.now()

    img.onload = () => {
      if (abort.cancelled) return

      const tex         = new THREE.Texture(img)
      tex.needsUpdate   = true
      tex.minFilter     = THREE.LinearFilter
      tex.magFilter     = THREE.LinearFilter
      tex.colorSpace    = THREE.SRGBColorSpace   // r152+ (replaces encoding)

      material = new THREE.ShaderMaterial({
        glslVersion:    THREE.GLSL3,             // r163+ WebGL2 default
        vertexShader:   VERT,
        fragmentShader: FRAG,
        uniforms: {
          uBg:     { value: tex },
          uMouse:  { value: new THREE.Vector2(W / 2, H / 2) },
          uTime:   { value: 0 },
          uRes:    { value: new THREE.Vector2(W, H) },
          uReveal: { value: 0 },
        },
      })

      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

      const tick = () => {
        if (abort.cancelled) return
        animId = requestAnimationFrame(tick)
        revealRef.current += (1 - revealRef.current) * 0.03
        material.uniforms.uTime.value   = (performance.now() - startT) / 1000
        material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y)
        material.uniforms.uReveal.value = revealRef.current
        renderer.render(scene, camera)
      }
      tick()
    }

    img.src = BG_URL

    // ── events ────────────────────────────────────────────────────────────
    const onMove = e => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const onResize = () => {
      if (abort.cancelled) return
      const w = wrap.clientWidth  || window.innerWidth
      const h = wrap.clientHeight || window.innerHeight
      renderer.setSize(w, h, false)
      if (material) material.uniforms.uRes.value.set(w, h)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize',    onResize)

    // ── cleanup ───────────────────────────────────────────────────────────
    return () => {
      abort.cancelled = true
      img.onload      = null
      cancelAnimationFrame(animId)
      renderer.dispose()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize',    onResize)
    }
  }, [])

  return (
    <section id="hero" ref={wrapRef} style={{ position:'relative', width:'100vw', height:'100vh', overflow:'hidden', background:'#020506' }}>

      {/* Water ripple canvas */}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block' }} />

      {/* Portrait — drop yash.png (transparent bg cutout) into /public */}
      <div style={{ position:'absolute', inset:0, zIndex:2, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
        <img src="/yash.png" alt="Yash" style={{
          height:'88vh', width:'auto', maxWidth:'55vw',
          objectFit:'contain', objectPosition:'center bottom',
          mixBlendMode:'lighten',
          maskImage:'linear-gradient(to bottom, black 50%, transparent 100%)',
          WebkitMaskImage:'linear-gradient(to bottom, black 50%, transparent 100%)',
          opacity:0.88, userSelect:'none',
        }} />
      </div>

      {/* HUD ticks */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:3 }}>
        {[...Array(12)].map((_,i) => (
          <div key={i} style={{ position:'absolute', right:'8%', top:`${8+i*7}%`, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:10, height:1, background:'rgba(240,235,224,0.12)' }} />
            <span style={{ fontFamily:'var(--font-body)', fontSize:'0.55rem', color:'rgba(240,235,224,0.18)', letterSpacing:'0.1em' }}>
              {String(i*10).padStart(3,'0')}
            </span>
          </div>
        ))}
      </div>

      {/* Targeting reticle */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:320, height:380, pointerEvents:'none', zIndex:3 }}>
        {['top-left','top-right','bottom-left','bottom-right'].map(c => (
          <div key={c} style={{
            position:'absolute',
            ...(c.includes('top')    ? {top:0}    : {bottom:0}),
            ...(c.includes('left')   ? {left:0}   : {right:0}),
            width:24, height:24,
            borderTop:    c.includes('top')    ? '1.5px solid rgba(240,235,224,0.35)':'none',
            borderBottom: c.includes('bottom') ? '1.5px solid rgba(240,235,224,0.35)':'none',
            borderLeft:   c.includes('left')   ? '1.5px solid rgba(240,235,224,0.35)':'none',
            borderRight:  c.includes('right')  ? '1.5px solid rgba(240,235,224,0.35)':'none',
          }} />
        ))}
      </div>

      {/* Text */}
      <div style={{ position:'absolute', inset:0, zIndex:4, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
        <div style={{ fontFamily:'var(--font-body)', fontSize:'0.65rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(240,235,224,0.55)', marginBottom:'0.8rem' }}>About Me</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight:300, fontSize:'clamp(4.5rem,10vw,9rem)', lineHeight:0.92, color:'var(--cream)', textAlign:'center', letterSpacing:'-0.01em' }}>Yash</h1>
        <div style={{ fontFamily:'var(--font-body)', fontSize:'0.7rem', letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(240,235,224,0.55)', margin:'1.4rem 0 1.2rem' }}>Full-Stack Developer</div>
        <div style={{ display:'flex', gap:'1rem' }}>
          {[['GH','https://github.com'],['LI','#'],['MA','mailto:yash@example.com']].map(([l,h]) => (
            <a key={l} href={h} style={{ width:32, height:32, borderRadius:'50%', border:'1px solid rgba(240,235,224,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-body)', fontSize:'0.55rem', color:'rgba(240,235,224,0.4)', textDecoration:'none', pointerEvents:'all', transition:'border-color 0.2s,color 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(173,235,179,0.5)';e.currentTarget.style.color='var(--mint)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(240,235,224,0.2)';e.currentTarget.style.color='rgba(240,235,224,0.4)'}}
            >{l}</a>
          ))}
        </div>
        <div style={{ marginTop:'1.6rem', textAlign:'center', fontFamily:'var(--font-body)', fontSize:'0.6rem', letterSpacing:'0.16em', color:'rgba(240,235,224,0.3)', lineHeight:1.8, textTransform:'uppercase' }}>
          MediSync — Founder &nbsp;·&nbsp; God's Eye — Creator &nbsp;·&nbsp; AKTU B.Tech CSE
        </div>
      </div>

      <div style={{ position:'absolute', bottom:'2.5rem', left:'3rem', fontFamily:'var(--font-body)', fontSize:'0.6rem', letterSpacing:'0.18em', color:'rgba(240,235,224,0.3)', textTransform:'uppercase', zIndex:4 }}>Gorakhpur → NCR</div>
      <div style={{ position:'absolute', bottom:'2.5rem', right:'3rem', fontFamily:'var(--font-body)', fontSize:'0.6rem', letterSpacing:'0.18em', color:'rgba(240,235,224,0.3)', textTransform:'uppercase', zIndex:4 }}>GATE 2026</div>

      <div style={{ position:'absolute', bottom:'2.5rem', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', zIndex:4 }}>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'0.6rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(240,235,224,0.3)' }}>Scroll</span>
        <div style={{ width:1, height:40, background:'linear-gradient(to bottom,rgba(173,235,179,0.5),transparent)', animation:'scrollPulse 2s ease infinite' }} />
      </div>
      <style>{`@keyframes scrollPulse{0%,100%{opacity:.3;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.2)}}`}</style>
    </section>
  )
}
