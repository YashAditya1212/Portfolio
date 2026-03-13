import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    id: 1, num: '01',
    title: 'MediSync',
    sub: 'Healthcare Aggregator',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    desc: 'Full-stack multi-hospital platform connecting patients to doctors, clinics and hospitals nationwide. Features appointment booking, admin panel, and real-time sync.',
    img: '/projects/medisync.png',
    accent: '#ADEBB3',
    github: 'https://github.com',
  },
  {
    id: 2, num: '02',
    title: "God's Eye",
    sub: 'AI Collision Detection',
    tags: ['YOLOv8', 'Python', 'Flask', 'OpenCV'],
    desc: 'CNN-based vehicle accident detection system using CCTV networks. Auto-dispatches emergency services via real-time inference on video streams.',
    img: '/projects/godseye.png',
    accent: '#e85d5d',
    github: 'https://github.com',
  },
  {
    id: 3, num: '03',
    title: 'Flaired',
    sub: 'Travel Platform',
    tags: ['React', 'Node', 'Maps API'],
    desc: 'Cinematic travel discovery platform. Explore destinations with immersive visuals and trip planning tools.',
    img: '/projects/flaired.png',
    accent: '#5de8c4',
    github: 'https://github.com',
  },
  {
    id: 4, num: '04',
    title: 'Shadow',
    sub: 'Car Rental Service',
    tags: ['React', 'Node', 'MongoDB'],
    desc: 'Premium online car rental platform with dark luxury aesthetic, fleet management and real-time booking.',
    img: '/projects/shadow.png',
    accent: '#c9a84c',
    github: 'https://github.com',
  },
  {
    id: 5, num: '05',
    title: 'Logistics Tracker',
    sub: 'Shipment & Tracking',
    tags: ['React', 'Node', 'Maps'],
    desc: 'Real-time logistics and shipment tracking platform with global route visualization and fleet management.',
    img: '/projects/logistics.png',
    accent: '#7b9fe8',
    github: 'https://github.com',
  },
  {
    id: 6, num: '06',
    title: 'WeatherScope',
    sub: 'Forecast Dashboard',
    tags: ['React', 'Weather API', 'Charts'],
    desc: 'Glassmorphic weather dashboard with city skyline backgrounds, hourly forecasts, and live meteorological data.',
    img: '/projects/weather.png',
    accent: '#5db0e8',
    github: 'https://github.com',
  },
  {
    id: 7, num: '07',
    title: 'Apex Bank',
    sub: 'Banking Application',
    tags: ['React', 'Node', 'MongoDB'],
    desc: 'Full-featured banking application with account management, transactions, loan options and mobile-first design.',
    img: '/projects/banking.png',
    accent: '#e8b45d',
    github: 'https://github.com',
  },
  {
    id: 8, num: '08',
    title: 'TaskFlow',
    sub: 'Task Management',
    tags: ['React', 'Node', 'Express'],
    desc: 'Dark productivity app with real-time task tracking, calendar integration, insights dashboard and progress analytics.',
    img: '/projects/todo.png',
    accent: '#9b5de8',
    github: 'https://github.com',
  },
]

export default function Projects() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const bgRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    // Total horizontal scroll distance
    const totalW = track.scrollWidth - window.innerWidth

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalW + window.innerHeight}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: self => {
            const progress = self.progress
            const idx = Math.round(progress * (PROJECTS.length - 1))
            setActiveIdx(Math.min(idx, PROJECTS.length - 1))
          },
        },
      })
      tl.to(track, { x: -totalW, ease: 'none' })
    }, section)

    return () => ctx.revert()
  }, [])

  const activeProject = PROJECTS[activeIdx]

  return (
    <section ref={sectionRef} id="projects" style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#040608' }}>

      {/* Dynamic background image */}
      <div ref={bgRef} style={{ position: 'absolute', inset: 0, transition: 'opacity 0.6s ease', zIndex: 0 }}>
        {PROJECTS.map((p, i) => (
          <div key={p.id} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${p.img})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === activeIdx ? 0.18 : 0,
            transition: 'opacity 0.8s ease',
            filter: 'blur(2px) saturate(0.6)',
          }} />
        ))}
        {/* Gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(4,6,8,0.95) 0%, rgba(4,6,8,0.5) 50%, rgba(4,6,8,0.95) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(4,6,8,0.7) 0%, transparent 30%, transparent 70%, rgba(4,6,8,0.7) 100%)' }} />
      </div>

      {/* Section header */}
      <div style={{ position: 'absolute', top: '2.5rem', left: '3rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--mint)' }}>Selected Work</span>
        <div style={{ width: 40, height: 1, background: 'var(--glass-border)' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--muted)' }}>{activeIdx + 1} / {PROJECTS.length}</span>
      </div>

      {/* Current project info — top center */}
      <div style={{ position: 'absolute', top: '2.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: activeProject.accent, transition: 'color 0.5s',
        }}>
          {activeProject.sub}
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: '2.5rem', right: '3rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>Scroll</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {PROJECTS.map((_, i) => (
            <div key={i} style={{ width: i === activeIdx ? 20 : 6, height: 2, background: i === activeIdx ? 'var(--mint)' : 'rgba(240,235,224,0.2)', transition: 'all 0.4s ease', borderRadius: 1 }} />
          ))}
        </div>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '10vw', gap: '5vw', willChange: 'transform', position: 'relative', zIndex: 5 }}>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} isActive={i === activeIdx} />
        ))}
        {/* spacer */}
        <div style={{ minWidth: '10vw', flexShrink: 0 }} />
      </div>
    </section>
  )
}

function ProjectCard({ project: p, isActive }) {
  return (
    <div style={{
      minWidth: '55vw', maxWidth: 760,
      flexShrink: 0,
      display: 'flex', gap: '3rem', alignItems: 'center',
      opacity: isActive ? 1 : 0.35,
      transform: `scale(${isActive ? 1 : 0.94}) translateY(${isActive ? 0 : 20}px)`,
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    }}>
      {/* Image */}
      <div style={{
        position: 'relative', width: 340, height: 220, flexShrink: 0,
        borderRadius: 4, overflow: 'hidden',
        boxShadow: isActive ? `0 0 60px ${p.accent}22, 0 20px 60px rgba(0,0,0,0.6)` : '0 10px 40px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.5s ease',
      }}>
        <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {/* Accent overlay */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${p.accent}15, transparent)` }} />
        {/* Number badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontStyle: 'italic',
          color: p.accent, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          padding: '4px 10px', border: `1px solid ${p.accent}40`, borderRadius: 2,
        }}>{p.num}</div>
      </div>

      {/* Text info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: p.accent, marginBottom: '0.7rem' }}>
          {p.sub}
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2.6rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1, marginBottom: '1rem' }}>
          {p.title}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.82rem', lineHeight: 1.75, color: 'var(--muted)', marginBottom: '1.4rem', maxWidth: 320 }}>
          {p.desc}
        </p>
        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {p.tags.map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', padding: '4px 10px',
              border: `1px solid ${p.accent}35`, color: p.accent, borderRadius: 2,
              background: `${p.accent}08`,
            }}>{t}</span>
          ))}
        </div>
        {/* CTA */}
        <a href={p.github} target="_blank" rel="noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontFamily: 'var(--font-body)', fontSize: '0.65rem', letterSpacing: '0.14em',
          textTransform: 'uppercase', textDecoration: 'none',
          color: 'var(--cream)', borderBottom: `1px solid ${p.accent}60`,
          paddingBottom: '2px', transition: 'color 0.2s, border-color 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = p.accent; e.currentTarget.style.borderColor = p.accent }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--cream)'; e.currentTarget.style.borderColor = `${p.accent}60` }}
        >
          View on GitHub →
        </a>
      </div>
    </div>
  )
}
