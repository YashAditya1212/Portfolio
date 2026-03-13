import { useEffect, useRef } from 'react'
import Lenis from 'lenis'                          // new package name
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AboutMarquee from './components/AboutMarquee'
import Projects from './components/Projects'
import Education from './components/Education'
import Skills from './components/Skills'
import Contact from './components/Contact'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const cd  = useRef(null)
  const cr  = useRef(null)
  const mouse = useRef({ x: -200, y: -200 })
  const ring  = useRef({ x: -200, y: -200 })
  const rafId = useRef(null)

  useEffect(() => {
    // ── Lenis 1.x smooth scroll ──────────────────────────────────────────
    // API change: duration+easing replaced by lerp (0-1 interpolation factor)
    const lenis = new Lenis({
      lerp: 0.08,           // lower = smoother / more floaty
      smoothWheel: true,
      orientation: 'vertical',
    })

    // Wire Lenis into GSAP's ticker so ScrollTrigger stays in sync.
    // Without this, the Projects pinned carousel stutters because
    // ScrollTrigger reads scroll position on its own RAF tick, not Lenis's.
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    // ── Custom cursor ────────────────────────────────────────────────────
    const onMove = e => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    const animateCursor = () => {
      if (cd.current && cr.current) {
        cd.current.style.left = mouse.current.x + 'px'
        cd.current.style.top  = mouse.current.y + 'px'
        ring.current.x += (mouse.current.x - ring.current.x) * 0.14
        ring.current.y += (mouse.current.y - ring.current.y) * 0.14
        cr.current.style.left = ring.current.x + 'px'
        cr.current.style.top  = ring.current.y + 'px'
      }
      rafId.current = requestAnimationFrame(animateCursor)
    }
    animateCursor()

    const addHover = e => { if (e.target.closest('a,button,[data-cursor]')) document.body.classList.add('hovering') }
    const rmHover  = e => { if (!e.target.closest('a,button,[data-cursor]'))  document.body.classList.remove('hovering') }
    document.addEventListener('mouseover', addHover)
    document.addEventListener('mouseout',  rmHover)

    return () => {
      lenis.destroy()
      // Remove the GSAP ticker listener Lenis added
      gsap.ticker.remove((time) => { lenis.raf(time * 1000) })
      ScrollTrigger.killAll()
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', addHover)
      document.removeEventListener('mouseout',  rmHover)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <div id="cursor-wrap">
        <div id="cd" ref={cd} />
        <div id="cr" ref={cr} />
      </div>
      <Navbar />
      <Hero />
      <AboutMarquee />
      <Projects />
      <Education />
      <Skills />
      <Contact />
    </>
  )
}
