"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * Landing Page
 * Public page showcasing CanvasChat features
 */

export default function Home() {
  return (
    <>
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary-dark) 50%, var(--accent-purple) 100%);
        }
        
        .hero {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: var(--text-primary);
          text-align: center;
          padding: 4rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .hero-content {
          max-width: 800px;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 3rem 2rem;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.7);
          box-shadow: var(--shadow-xl);
          position: relative;
          z-index: 10;
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .hero p {
          font-size: 1.5rem;
          margin-bottom: 2.5rem;
          color: var(--text-secondary);
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .features {
          padding: 6rem 1.5rem;
          background: rgba(255, 255, 255, 0.6);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          text-align: center;
          padding: 2rem;
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-color);
        }

        .feature-icon {
          margin-bottom: 1.5rem;
          color: var(--primary-color);
          display: flex;
          justify-content: center;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .feature-card p {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 3rem;
          color: var(--text-primary);
        }

        .cta-section {
          padding: 6rem 1.5rem;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
          color: white;
          text-align: center;
        }

        .cta-container {
          max-width: 700px;
          margin: 0 auto;
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: var(--radius-lg);
          padding: 3rem 2rem;
          backdrop-filter: blur(10px);
          background: rgba(255,255,255,0.1);
        }

        .btn {
          padding: 0.875rem 1.5rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-purple);
        }

        .btn-ghost {
          border: 2px solid var(--border-color);
          background: transparent;
          color: var(--text-primary);
        }

        .btn-ghost:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.5rem;
          }
          .hero p {
            font-size: 1.25rem;
          }
        }
      `}</style>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
        <Link href="/" style={{ display: 'block' }}>
          <Image src="/CanvasChat.logowithtext.png" alt="CanvasChat" width={400} height={120} style={{ height: '120px', width: 'auto' }} />
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/auth/signin" className="btn btn-ghost">Sign In</Link>
          <Link href="/auth/signup" className="btn btn-primary">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Draw, Animate, Collaborate</h1>
          <p>The interactive canvas platform for creative minds. Create stunning visuals with powerful drawing tools and smooth animations.</p>
          <div className="hero-buttons">
            <Link href="/auth/signup" className="btn btn-primary">Start Creating Free</Link>
            <a href="#features" className="btn btn-ghost">See Features</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2 className="section-title">Powerful Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <h3>Drawing Tools</h3>
            <p>Professional drawing tools with customizable brushes, colors, and shapes. Create exactly what you envision.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
                <path d="m4.2 4.2 4.2 4.2m5.6 5.6 4.2 4.2"></path>
                <path d="M1 12h6m6 0h6"></path>
                <path d="m4.2 19.8 4.2-4.2m5.6-5.6 4.2-4.2"></path>
              </svg>
            </div>
            <h3>Smooth Animations</h3>
            <p>Bring your creations to life with preset animations or create custom animations with our powerful engine.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
            </div>
            <h3>Unlimited Canvas</h3>
            <p>Work on an infinite canvas with layers, grouping, and advanced object manipulation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </div>
            <h3>Auto-Save</h3>
            <p>Never lose your work. Everything is automatically saved and synced to the cloud.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <h3>Responsive Design</h3>
            <p>Works seamlessly on desktop, tablet, and mobile devices. Create anywhere, anytime.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h3>Lightning Fast</h3>
            <p>Built on Cloudflare&apos;s edge network for instant loading and real-time performance.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to Start Creating?</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Join thousands of creators using CanvasChat today</p>
          <Link href="/auth/signup" className="btn btn-primary" style={{ background: 'white', color: 'var(--primary-color)' }}>
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', color: 'white', padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Image src="/CanvasChat.logowithtext.png" alt="CanvasChat" width={128} height={32} style={{ filter: 'brightness(0) invert(1)' }} />
        </div>
        <p style={{ opacity: 0.8 }}>© 2025 CanvasChat. Built with Fabric.js & Anime.js</p>
      </footer>
    </>
  );
}
