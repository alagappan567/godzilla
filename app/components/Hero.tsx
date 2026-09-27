'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const FRAME_COUNT = 240;
const FOLDER      = 'godzilla';
const MIDDLE      = Math.round((FRAME_COUNT - 1) / 2);

const NAV = ['Home', 'Monsters', 'Battles', 'Legacy'];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const images     = useRef<(HTMLImageElement | null)[]>([]);
  const frameRef   = useRef(MIDDLE);
  const navRef     = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(frameRef.current);
    };
    resize();
    window.addEventListener('resize', resize);

    function draw(i: number) {
      const img = images.current[i];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const { naturalWidth: iw, naturalHeight: ih } = img;
      const cw = canvas!.width, ch = canvas!.height;
      const s  = Math.max(cw / iw, ch / ih);
      ctx!.clearRect(0, 0, cw, ch);
      ctx!.drawImage(img, (cw - iw * s) / 2, (ch - ih * s) / 2, iw * s, ih * s);
    }

    images.current = new Array(FRAME_COUNT).fill(null);
    let ready = false;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/${FOLDER}/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;
      img.onload = () => {
        images.current[i] = img;
        if (!ready) { ready = true; frameRef.current = i; draw(i); }
        if (i === frameRef.current) draw(i);
      };
    }

    const onMove = (e: MouseEvent) => {
      if (!section) return;
      const r = section.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const idx   = Math.round(ratio * (FRAME_COUNT - 1));
      if (idx !== frameRef.current) { frameRef.current = idx; draw(idx); }
    };
    window.addEventListener('mousemove', onMove);

    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(navRef.current,     { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' })
      .fromTo(contentRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1.0,  ease: 'power3.out' }, '-=0.45')
      .fromTo(bottomRef.current,  { opacity: 0, y: 18  }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.55');

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <section ref={sectionRef} style={{
      position: 'relative', height: '100vh', width: '100%',
      overflow: 'hidden', background: '#060a0f',
    }}>

      {/* Full-viewport head-tracking canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Left-edge + top/bottom gradient — deep red-black Godzilla palette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: [
          'linear-gradient(to right, rgba(6,10,15,0.82) 0%, rgba(6,10,15,0.38) 18%, transparent 38%)',
          'linear-gradient(180deg, rgba(6,10,15,0.65) 0%, transparent 16%, transparent 78%, rgba(6,10,15,0.9) 100%)',
        ].join(', '),
      }} />

      {/* ── NAV ── */}
      <div ref={navRef} style={{
        position: 'absolute', top: 0, left: 0, right: 0, opacity: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'clamp(1rem, 2.5vh, 1.6rem) clamp(1.2rem, 4vw, 2.8rem)',
        zIndex: 10,
      }}>
        {/* Logo */}
        <span style={{
          fontFamily: 'Georgia, serif', fontSize: '0.85rem',
          fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: '#fff', textShadow: '0 0 24px rgba(255,60,60,0.75)',
        }}>
          GODZILLA
        </span>

        {/* Nav pill */}
        <div style={{
          display: 'flex', gap: '0.1rem',
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '40px', padding: '0.16rem 0.2rem',
        }}>
          {NAV.map((label, i) => (
            <button key={label} style={{
              fontFamily: 'monospace', fontSize: '0.42rem',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '0.24rem 0.65rem', borderRadius: '30px', border: 'none',
              cursor: 'pointer',
              background: i === 0 ? 'rgba(255,255,255,0.88)' : 'transparent',
              color: i === 0 ? '#060a0f' : 'rgba(255,255,255,0.52)',
              fontWeight: i === 0 ? 700 : 400, transition: 'color 0.2s',
            }}
            onMouseEnter={e => { if (i !== 0) (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
            onMouseLeave={e => { if (i !== 0) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.52)'; }}
            >{label}</button>
          ))}
        </div>

        {/* Menu */}
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          <button style={{
            fontFamily: 'monospace', fontSize: '0.42rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', padding: '0.28rem 0.75rem', borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(6,10,15,0.5)', backdropFilter: 'blur(12px)',
            color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
          }}>Menu</button>
          <button style={{
            width: '24px', height: '24px', borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(6,10,15,0.5)', backdropFilter: 'blur(12px)',
            color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
            fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>··</button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div ref={contentRef} style={{
        position: 'absolute', top: '50%', transform: 'translateY(-52%)',
        left: 'clamp(1.5rem, 5vw, 4rem)',
        maxWidth: 'clamp(220px, 32vw, 400px)',
        zIndex: 5, opacity: 0,
      }}>
        <p style={{
          fontFamily: 'monospace', fontSize: '0.44rem',
          letterSpacing: '0.45em', textTransform: 'uppercase',
          color: 'rgba(255,60,60,0.85)', marginBottom: '0.6rem',
          textShadow: '0 0 14px rgba(255,60,60,0.5)',
        }}>King of the Monsters</p>

        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(2rem, 4vw, 4rem)',
          fontWeight: 900, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#ffffff',
          lineHeight: 1, margin: '0 0 clamp(0.7rem, 1.8vh, 1.2rem)',
          textShadow: '0 0 60px rgba(255,60,60,0.45), 0 4px 28px rgba(0,0,0,0.95)',
        }}>
          GODZILLA
        </h1>

        <p style={{
          fontFamily: 'Georgia, serif', fontSize: 'clamp(0.55rem, 0.75vw, 0.65rem)',
          fontWeight: 300, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.42)',
          marginBottom: 'clamp(0.9rem, 2vh, 1.5rem)',
        }}>
          Born from nuclear fire. Older than civilization. The apex titan rises — and the world trembles beneath his roar.
        </p>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button style={{
            fontFamily: 'monospace', fontSize: '0.44rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '0.55rem 1.1rem', borderRadius: '4px', border: 'none',
            background: 'rgba(255,60,60,0.9)', color: '#fff',
            fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 0 26px rgba(255,60,60,0.5)',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,90,90,1)'; b.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,60,60,0.9)'; b.style.transform = 'translateY(0)'; }}
          >Face the Titan ··</button>

          <button style={{
            fontFamily: 'monospace', fontSize: '0.44rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '0.55rem 1rem', borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)',
            color: 'rgba(255,255,255,0.65)', cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'rgba(255,255,255,0.5)'; b.style.color = '#fff'; b.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'rgba(255,255,255,0.2)'; b.style.color = 'rgba(255,255,255,0.65)'; b.style.transform = 'translateY(0)'; }}
          >▶ Watch Trailer</button>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div ref={bottomRef} style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, opacity: 0,
        display: 'flex', alignItems: 'center',
        height: 'clamp(50px, 7.5vh, 66px)',
        background: 'rgba(6,10,15,0.78)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '0 clamp(1.2rem, 4vw, 2.8rem)',
        zIndex: 6,
      }}>
        {/* Play */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          paddingRight: 'clamp(1rem, 2.5vw, 2rem)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0, cursor: 'pointer',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '0.55rem',
          }}>▶</div>
          <span style={{ fontFamily: 'monospace', fontSize: '0.44rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
            Play Trailer
          </span>
        </div>

        {[
          { n: '01', text: 'Since 1954 — Godzilla has destroyed Tokyo, faced Mothra, Kong, and Mechagodzilla across 38 films.' },
          { n: '02', text: 'MonsterVerse. A titan awakened by nuclear testing. Ancient guardian of an irradiated Earth.' },
        ].map((item, i) => (
          <div key={item.n} style={{
            display: 'flex', alignItems: 'center', gap: '0.65rem',
            padding: '0 clamp(1rem, 2.5vw, 2rem)',
            borderRight: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            flex: 1, minWidth: 0,
          }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,60,60,0.75)', flexShrink: 0, fontWeight: 700 }}>{item.n}</span>
            <p style={{
              fontFamily: 'Georgia, serif', fontSize: 'clamp(0.48rem, 0.68vw, 0.58rem)',
              color: 'rgba(255,255,255,0.33)', lineHeight: 1.4, margin: 0,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>{item.text}</p>
          </div>
        ))}

        {/* Social */}
        <div style={{
          display: 'flex', gap: '0.45rem', alignItems: 'center',
          paddingLeft: 'clamp(1rem, 2.5vw, 2rem)',
          borderLeft: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
        }}>
          {['IG', 'TW', 'YT', 'FB'].map(s => (
            <button key={s} style={{
              width: '26px', height: '26px', borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent', color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace', fontSize: '0.38rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'rgba(255,60,60,0.6)'; b.style.color = 'rgba(255,60,60,0.9)'; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'rgba(255,255,255,0.12)'; b.style.color = 'rgba(255,255,255,0.4)'; }}
            >{s}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
