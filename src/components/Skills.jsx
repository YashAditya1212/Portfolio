import { useEffect, useRef } from 'react'

const SKILLS = [
  {
    cat: 'Frontend',
    icon: '◈',
    items: ['React', 'HTML/CSS', 'JavaScript', 'Tailwind', 'Three.js', 'GSAP'],
    accent: '#ADEBB3',
  },
  {
    cat: 'Backend',
    icon: '◉',
    items: ['Node.js', 'Express', 'Python', 'Flask', 'REST APIs', 'JWT Auth'],
    accent: '#c9a84c',
  },
  {
    cat: 'Database',
    icon: '◫',
    items: ['MongoDB', 'Mongoose', 'SQL Basics', 'Redis'],
    accent: '#7b9fe8',
  },
  {
    cat: 'AI / ML',
    icon: '◬',
    items: ['YOLOv8', 'OpenCV', 'Python ML', 'CNN', 'Flask APIs'],
    accent: '#e85d5d',
  },
  {
    cat: 'DevOps',
    icon: '◭',
    items: ['Docker', 'Linux', 'Git', 'GitHub', 'AWS (learning)', 'CI/CD'],
    accent: '#5de8c4',
  },
  {
    cat: 'Currently Learning',
    icon: '◌',
    items: ['DSA', 'System Design', 'Kubernetes', 'Next.js', 'TypeScript'],
    accent: '#9b5de8',
  },
]

export default function Skills() {
  const gridRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = '1'
          en.target.style.transform = 'translateY(0)'
        }
      })
    }, { threshold: 0.1 })
    cardRefs.current.forEach(el => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Mouse tilt effect per card
  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`
  }
  const handleMouseLeave = card => {
    card.style.transform = 'rotateY(0) rotateX(0) translateY(0)'
  }

  return (
    <section style={{ padding: '9rem 0 8rem', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

      {/* Background noise texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
        backgroundSize: '200px 200px', opacity: 0.6,
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--mint)', display: 'block', marginBottom: '1rem' }}>· Expertise ·</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', color: 'var(--cream)', lineHeight: 1 }}>
            Tech Stack
          </h2>
        </div>

        <div ref={gridRef} style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 3rem',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {SKILLS.map((s, i) => (
            <div key={s.cat}
              ref={el => cardRefs.current[i] = el}
              onMouseMove={e => handleMouseMove(e, cardRefs.current[i])}
              onMouseLeave={() => handleMouseLeave(cardRefs.current[i])}
              style={{
                background: 'var(--glass)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
                borderRadius: 6, padding: '2rem',
                opacity: 0, transform: 'translateY(40px)',
                transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s, box-shadow 0.3s`,
                transformStyle: 'preserve-3d',
                perspective: 800,
                cursor: 'default',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 40px ${s.accent}15, 0 0 0 1px ${s.accent}20` }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.4rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: s.accent }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: s.accent }}>{s.cat}</div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: `linear-gradient(to right, ${s.accent}30, transparent)`, marginBottom: '1.2rem' }} />

              {/* Skills pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {s.items.map(item => (
                  <span key={item} style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 300,
                    padding: '4px 12px', borderRadius: 2,
                    background: `${s.accent}0d`, border: `1px solid ${s.accent}25`,
                    color: 'rgba(240,235,224,0.7)', letterSpacing: '0.04em',
                  }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
