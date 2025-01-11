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
          <div className={styles.badges}>
            <a href="https://github.com/teckmill/next-lite" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/github/stars/teckmill/next-lite?style=social" alt="GitHub stars" />
            </a>
            <a href="https://github.com/teckmill/next-lite/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/github/license/teckmill/next-lite" alt="License" />
            </a>
            <a href="https://www.npmjs.com/package/next-lite" target="_blank" rel="noopener noreferrer">
              <img src="https://img.shields.io/npm/v/next-lite" alt="npm version" />
            </a>
          </div>
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
          <div className={styles.cta}>
            <a href="https://github.com/teckmill/next-lite" className={styles.primaryButton} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
            <a href="https://github.com/teckmill/next-lite/wiki" className={styles.secondaryButton} target="_blank" rel="noopener noreferrer">
              Documentation
            </a>
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
                Config lines: <span>0</span>
              </div>
              <ul className={styles.featureList}>
                <li>Zero configuration needed</li>
                <li>Intuitive file-based routing</li>
                <li>TypeScript support out of the box</li>
                <li>Automatic code optimization</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h3>🚀 Production Ready</h3>
              <p>Built for modern web development with all the features you need</p>
              <div className={styles.code}>
                Bundle size: <span>{"<"} 50KB</span>
              </div>
              <ul className={styles.featureList}>
                <li>SSR & SSG support</li>
                <li>API routes</li>
                <li>CSS Modules</li>
                <li>Image optimization</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.getStarted}>
          <h2 className={styles.sectionTitle}>Get Started</h2>
          <div className={styles.terminal}>
            <code>
              <span className={styles.comment}># Create a new project</span>
              <br />
              npx create-next-lite-app my-app
              <br /><br />
              <span className={styles.comment}># Or clone the example</span>
              <br />
              git clone https://github.com/teckmill/next-lite.git
              <br />
              cd next-lite
              <br />
              npm install
              <br />
              npm run dev
            </code>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.links}>
            <a href="https://github.com/teckmill/next-lite" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://github.com/teckmill/next-lite/wiki" target="_blank" rel="noopener noreferrer">Documentation</a>
            <a href="https://github.com/teckmill/next-lite/issues" target="_blank" rel="noopener noreferrer">Issues</a>
            <a href="https://github.com/teckmill/next-lite/discussions" target="_blank" rel="noopener noreferrer">Discussions</a>
          </div>
          <p>Made with ❤️ by <a href="https://github.com/teckmill" target="_blank" rel="noopener noreferrer">Teckmill</a></p>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;
