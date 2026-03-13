import { useRef, useState, useEffect } from 'react'

export default function Contact() {
  const sectionRef = useRef(null)
  const headRef = useRef(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = '1'
          en.target.style.transform = 'translateY(0)'
        }
      })
    }, { threshold: 0.2 })
    if (headRef.current) obs.observe(headRef.current)
    return () => obs.disconnect()
  }, [])

  const inputStyle = {
    width: '100%', background: 'var(--glass)', backdropFilter: 'blur(12px)',
    border: '1px solid var(--glass-border)', borderRadius: 4, padding: '0.9rem 1.2rem',
    fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 300, color: 'var(--cream)',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    letterSpacing: '0.02em',
  }

  const handleFocus = e => { e.target.style.borderColor = 'rgba(173,235,179,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(173,235,179,0.05)' }
  const handleBlur = e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none' }

  return (
    <section id="contact" ref={sectionRef} style={{
      position: 'relative', padding: '9rem 0 6rem', background: '#06080a', overflow: 'hidden',
    }}>
      {/* Gradient light at top */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(173,235,179,0.3), transparent)' }} />
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 400, height: 200, background: 'radial-gradient(ellipse at center top, rgba(173,235,179,0.06), transparent)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 3rem' }}>
        {/* Header */}
        <div ref={headRef} style={{
          textAlign: 'center', marginBottom: '4rem',
          opacity: 0, transform: 'translateY(30px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--mint)', display: 'block', marginBottom: '1rem' }}>· Get in Touch ·</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', color: 'var(--cream)', lineHeight: 1, marginBottom: '1.2rem' }}>
            Let's Build
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            Open to opportunities, collaborations, and interesting conversations. Reach out.
          </p>
        </div>

        {/* Social links row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3.5rem' }}>
          {[
            { label: 'GitHub', href: 'https://github.com' },
            { label: 'LinkedIn', href: '#' },
            { label: 'Mail', href: 'mailto:yash@example.com' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
              fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none',
              transition: 'color 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--mint)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              <span style={{ width: 16, height: 1, background: 'currentColor', display: 'inline-block' }} />
              {s.label}
            </a>
          ))}
        </div>

        {/* Glass form */}
        {!sent ? (
          <div style={{
            background: 'var(--glass)', backdropFilter: 'blur(24px)',
            border: '1px solid var(--glass-border)', borderRadius: 8,
            padding: '2.5rem', boxShadow: '0 4px 40px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <input type="text" placeholder="Your name" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <input type="email" placeholder="your@email.com" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '0.5rem' }}>Message</label>
              <textarea rows={5} placeholder="What's on your mind..." style={{ ...inputStyle, resize: 'none', lineHeight: 1.7 }} onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <button onClick={() => setSent(true)} style={{
              width: '100%', padding: '0.95rem', background: 'transparent',
              border: '1px solid rgba(173,235,179,0.4)', borderRadius: 4,
              fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--mint)', cursor: 'none',
              transition: 'background 0.3s, box-shadow 0.3s',
            }}
              onMouseEnter={e => { e.target.style.background = 'rgba(173,235,179,0.08)'; e.target.style.boxShadow = '0 0 20px rgba(173,235,179,0.12)' }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none' }}
            >Send Message →</button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 8, backdropFilter: 'blur(16px)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2rem', color: 'var(--mint)', marginBottom: '0.8rem' }}>Message sent.</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)' }}>I'll get back to you soon.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '6rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '2rem 3rem 0',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 300, color: 'var(--muted)' }}>Yash</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.14em', color: 'rgba(240,235,224,0.2)', textTransform: 'uppercase' }}>© 2026 · Built with React + Three.js</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.14em', color: 'rgba(240,235,224,0.2)', textTransform: 'uppercase' }}>NCR, India</span>
      </div>
    </section>
  )
}
