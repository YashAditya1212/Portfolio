import { useEffect, useRef } from 'react'

const EDU = [
  {
    num: 1, side: 'left',
    degree: 'Bachelor of Technology',
    inst: 'Abdul Kalam Technical University, Lucknow',
    period: 'Sept 2022 – Ongoing',
    detail: 'Computer Science and Engineering | CGPA: 8.6',
    accent: '#ADEBB3',
  },
  {
    num: 2, side: 'right',
    degree: 'XII Standard',
    inst: 'The Pillars Public School, Gorakhpur',
    period: '2022',
    detail: 'Physics, Chemistry, Mathematics (CBSE)',
    accent: '#c9a84c',
  },
  {
    num: 3, side: 'left',
    degree: 'X Standard',
    inst: 'The Pillars Public School, Gorakhpur',
    period: '2020',
    detail: 'CBSE Board Examination',
    accent: '#7b9fe8',
  },
]

export default function Education() {
  const sectionRef = useRef(null)
  const itemRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = '1'
          en.target.style.transform = 'translateY(0)'
        }
      })
    }, { threshold: 0.25 })

    itemRefs.current.forEach(el => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="education" ref={sectionRef} style={{
      position: 'relative', padding: '9rem 0 8rem', overflow: 'hidden',
      background: '#06080a',
    }}>

      {/* Sci-fi bg image - architecture/space */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1545670723-196ed0954986?w=1920&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.12, filter: 'saturate(0.4) sepia(0.3)',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #06080a 0%, rgba(6,8,10,0.6) 40%, rgba(6,8,10,0.6) 60%, #06080a 100%)', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* Section label */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--mint)', display: 'block', marginBottom: '1rem' }}>· Education ·</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', color: 'var(--cream)', lineHeight: 1 }}>
            Academic Path
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 3rem', position: 'relative' }}>

          {/* Center line */}
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
            background: 'linear-gradient(to bottom, transparent, rgba(240,235,224,0.1) 20%, rgba(240,235,224,0.1) 80%, transparent)',
            transform: 'translateX(-50%)',
          }} />

          {EDU.map((e, i) => (
            <div key={e.num}
              ref={el => itemRefs.current[i] = el}
              style={{
                display: 'flex', justifyContent: e.side === 'left' ? 'flex-start' : 'flex-end',
                marginBottom: '4rem', position: 'relative',
                opacity: 0, transform: `translateY(40px)`,
                transition: `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`,
              }}>

              {/* Number node */}
              <div style={{
                position: 'absolute', left: '50%', top: '1.2rem',
                transform: 'translateX(-50%)',
                width: 36, height: 36, borderRadius: 3,
                background: 'rgba(8,10,12,0.9)', backdropFilter: 'blur(10px)',
                border: `1px solid ${e.accent}60`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 300, color: e.accent,
                zIndex: 2, boxShadow: `0 0 20px ${e.accent}20`,
              }}>{e.num}</div>

              {/* Card - takes up ~44% width, on the appropriate side */}
              <div style={{
                width: '44%',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--glass-border)',
                borderRadius: 4, padding: '1.6rem 1.8rem',
                boxShadow: `0 4px 30px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.04)`,
              }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: e.accent, marginBottom: '0.6rem' }}>{e.period}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontStyle: 'italic', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2, marginBottom: '0.5rem' }}>{e.degree}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 500, color: 'rgba(240,235,224,0.7)', marginBottom: '0.4rem' }}>{e.inst}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 300, color: 'var(--muted)' }}>{e.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
