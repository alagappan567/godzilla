'use client';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('./components/Hero'), { ssr: false });

export default function Home() {
  return (
    <main style={{ background: '#060a0f', height: '100vh', overflow: 'hidden' }}>
      <Hero />
    </main>
  );
}
