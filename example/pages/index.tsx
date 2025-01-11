import React from 'react';
import styles from '../styles/Home.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header className={styles.header}>
          <img src="/logo.svg" alt="Next-Lite Logo" className={styles.logo} />
          <h1 className={styles.title}>Next-Lite</h1>
          <p className={styles.description}>
            A lightweight, blazing-fast alternative to Next.js that prioritizes speed and simplicity
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{"<"} 50KB</span>
              <span className={styles.statLabel}>Core Size</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>100ms</span>
              <span className={styles.statLabel}>Build Time</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>Zero</span>
              <span className={styles.statLabel}>Config</span>
            </div>
          </div>
        </header>

        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Core Features</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>⚡️ Lightning Fast</h3>
              <p>Built with esbuild for incredible build speeds and optimized runtime performance</p>
              <div className={styles.code}>
                Build time: <span>{"<"} 100ms</span>
              </div>
              <ul className={styles.featureList}>
                <li>Instant HMR updates</li>
                <li>Optimized production builds</li>
                <li>Smart code splitting</li>
                <li>Minimal runtime overhead</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>🎯 Simple by Design</h3>
              <p>Focus on what matters - building your app, not configuring your framework</p>
              <div className={styles.code}>
                Config lines: <span>{"<"} 10</span>
              </div>
              <ul className={styles.featureList}>
                <li>Intuitive file-based routing</li>
                <li>Automatic TypeScript support</li>
                <li>Built-in CSS Modules</li>
                <li>Zero configuration needed</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>🔄 Modern Development</h3>
              <p>Enjoy a modern development experience with the latest features</p>
              <div className={styles.code}>
                <span>npm create next-lite-app</span>
              </div>
              <ul className={styles.featureList}>
                <li>React 18+ support</li>
                <li>TypeScript by default</li>
                <li>CSS Modules & Sass</li>
                <li>API routes support</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>📦 Production Ready</h3>
              <p>Built for real-world applications with essential features included</p>
              <div className={styles.code}>
                <span>npm run build</span>
              </div>
              <ul className={styles.featureList}>
                <li>Static Site Generation (SSG)</li>
                <li>Server-Side Rendering (SSR)</li>
                <li>Incremental Static Regeneration</li>
                <li>Edge Function Support</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.comparison}>
          <h2 className={styles.sectionTitle}>Why Next-Lite?</h2>
          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCard}>
              <h3>🚀 Performance</h3>
              <ul className={styles.featureList}>
                <li>50% faster builds than Next.js</li>
                <li>30% smaller bundle sizes</li>
                <li>Instant hot module replacement</li>
                <li>Optimized production builds</li>
              </ul>
            </div>
            <div className={styles.comparisonCard}>
              <h3>💡 Developer Experience</h3>
              <ul className={styles.featureList}>
                <li>Simpler configuration</li>
                <li>Clearer error messages</li>
                <li>Better debugging tools</li>
                <li>Faster feedback loop</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.getStarted}>
          <h2 className={styles.sectionTitle}>Get Started</h2>
          <div className={styles.commandCard}>
            <div className={styles.code}>
              <span>npx create-next-lite-app my-app</span>
            </div>
            <p className={styles.commandDescription}>
              Create a new Next-Lite project with a single command. Includes TypeScript, ESLint, and CSS Modules configured out of the box.
            </p>
          </div>
          <div className={styles.links}>
            <a href="https://github.com/next-lite/next-lite" className={styles.link}>
              📚 Documentation
            </a>
            <a href="https://github.com/next-lite/next-lite" className={styles.link}>
              ⭐️ GitHub
            </a>
            <a href="https://github.com/next-lite/next-lite/examples" className={styles.link}>
              🎯 Examples
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
