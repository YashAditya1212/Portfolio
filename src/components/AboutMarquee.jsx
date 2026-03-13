import { useEffect, useRef } from 'react'

const MARQUEE_TEXT = [
  'Full-Stack Developer',
  '·',
  'React · Node · Python',
  '·',
  'MediSync Founder',
  '·',
  'GATE 2026',
  '·',
  'YOLOv8 · Docker · AWS',
  '·',
  'B.Tech CSE',
  '·',
]

export default function AboutMarquee() {
  const track1 = useRef(null)
  const track2 = useRef(null)
  const pos1 = useRef(0)
  const pos2 = useRef(0)
  const animId = useRef(null)

  useEffect(() => {
    const speed = 0.5
    const animate = () => {
      pos1.current -= speed
      pos2.current -= speed
      const w1 = track1.current?.scrollWidth / 2 || 0
      const w2 = track2.current?.scrollWidth / 2 || 0
      if (Math.abs(pos1.current) >= w1) pos1.current = 0
      if (Math.abs(pos2.current) >= w2) pos2.current = 0
      if (track1.current) track1.current.style.transform = `translateX(${pos1.current}px)`
      if (track2.current) track2.current.style.transform = `translateX(${pos2.current}px)`
      animId.current = requestAnimationFrame(animate)
    }
    // Stagger row 2
    setTimeout(() => { pos2.current = -(track2.current?.scrollWidth / 4 || 0) }, 0)
    animId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId.current)
  }, [])

  const items = [...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT]

  return (
    <section id="about" style={{ background: 'var(--bg)', padding: '8rem 0 6rem', overflow: 'hidden' }}>

      {/* Section label */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--mint)', display: 'block', marginBottom: '1.2rem' }}>
          · About ·
        </span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', color: 'var(--cream)', lineHeight: 1 }}>
          The Builder
        </h2>
      </div>

      {/* Bio block */}
      <div style={{ maxWidth: 680, margin: '0 auto 5rem', padding: '0 3rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1rem', lineHeight: 1.85, color: 'var(--muted)', letterSpacing: '0.01em' }}>
          B.Tech CSE student at AKTU, Lucknow — building production-grade systems from Gorakhpur to the NCR.
          I architect full-stack platforms, train computer-vision models, and ship code that works in the real world.
          Currently preparing for <span style={{ color: 'var(--mint)' }}>GATE 2026</span> while running{' '}
          <span style={{ color: 'var(--cream)' }}>MediSync</span> — a multi-hospital healthcare aggregator.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '3rem' }}>
          {[['8+', 'Projects'], ['3', 'Live Platforms'], ['8.6', 'CGPA']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '0.4rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee row 1 */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '1rem 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div ref={track1} style={{ display: 'flex', gap: '2.5rem', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {items.map((t, i) => (
            <span key={i} style={{
              fontFamily: t === '·' ? 'var(--font-body)' : 'var(--font-display)',
              fontStyle: t === '·' ? 'normal' : 'italic',
              fontSize: t === '·' ? '1.2rem' : '1.6rem',
              fontWeight: 300,
              color: t === '·' ? 'var(--mint)' : 'var(--muted)',
              letterSpacing: '0.02em',
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Marquee row 2 - slightly different content reversed feel */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '1rem 0', borderBottom: '1px solid var(--glass-border)', background: 'rgba(173,235,179,0.02)' }}>
        <div ref={track2} style={{ display: 'flex', gap: '2.5rem', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {[...items].reverse().map((t, i) => (
            <span key={i} style={{
              fontFamily: t === '·' ? 'var(--font-body)' : 'var(--font-display)',
              fontStyle: 'normal',
              fontSize: t === '·' ? '0.8rem' : '0.65rem',
              fontWeight: 400,
              color: t === '·' ? 'var(--gold)' : 'rgba(240,235,224,0.2)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
