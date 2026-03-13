import { useEffect, useRef, useState } from 'react'

const links = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href, e) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1.5rem 3rem',
      transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
      background: scrolled ? 'rgba(8,10,12,0.7)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
    }}>
      {/* Logo */}
      <a href="#" style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 400, color: 'var(--cream)', textDecoration: 'none', letterSpacing: '0.02em' }}>
        Yash
      </a>

      {/* Role badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--mint)', display: 'inline-block' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Developer · Builder
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {links.map(l => (
          <a key={l.label} href={l.href} onClick={e => scrollTo(l.href, e)}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--cream)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >{l.label}</a>
        ))}
      </div>
    </nav>
  )
}
