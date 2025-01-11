# Getting Started with Next-Lite

This guide will help you set up your first Next-Lite project and understand the basic concepts.

## Quick Start

```bash
npx create-next-lite-app my-app
cd my-app
npm run dev
```

## Manual Installation

1. Create a new directory for your project:
```bash
mkdir my-next-lite-app
cd my-next-lite-app
```

2. Initialize your project:
```bash
npm init -y
```

3. Install Next-Lite and its dependencies:
```bash
npm install next-lite react react-dom
```

4. Add scripts to your package.json:
```json
{
  "scripts": {
    "dev": "next-lite dev",
    "build": "next-lite build",
    "start": "next-lite start"
  }
}
```

## Project Structure

```
my-app/
├── node_modules/
├── pages/
│   ├── _app.tsx        # Custom App component
│   ├── _document.tsx   # Custom Document
│   └── index.tsx       # Home page
├── public/
│   └── assets/         # Static files
├── styles/
│   └── globals.css     # Global styles
├── components/         # Reusable components
├── lib/               # Utility functions
├── next-lite.config.js # Configuration file
├── package.json
└── tsconfig.json      # TypeScript configuration
```

## Creating Your First Page

1. Create a new file `pages/index.tsx`:
```tsx
import React from 'react';
import styles from '../styles/Home.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Welcome to Next-Lite!</h1>
      <p>Get started by editing pages/index.tsx</p>
    </div>
  );
};

export default HomePage;
```

2. Add some styles in `styles/Home.module.css`:
```css
.container {
  padding: 2rem;
  text-align: center;
}
```

## Development Workflow

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Make changes to your code - the page will automatically update

## TypeScript Support

Next-Lite includes built-in TypeScript support. To use TypeScript:

1. Create a `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

2. Create type definitions for CSS modules in `types/css.d.ts`:
```typescript
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

## Next Steps

- Learn about [Routing](./routing.md)
- Explore [Data Fetching](./data-fetching.md)
- Understand [Deployment](./deployment.md)
