# Next-Lite Documentation

Welcome to the Next-Lite documentation! This guide will help you get started with Next-Lite and explore its features.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Core Concepts](#core-concepts)
3. [Features](#features)
4. [API Reference](#api-reference)
5. [Configuration](#configuration)
6. [Deployment](#deployment)

## Getting Started

### Installation

```bash
# Create a new Next-Lite project
npx create-next-lite-app my-app

# Or clone the example project
git clone https://github.com/teckmill/next-lite.git
cd next-lite
npm install
```

### Project Structure

```
your-app/
  ├── pages/           # Page components and routes
  │   ├── index.tsx    # Home page
  │   └── api/        # API routes
  ├── components/      # Reusable components
  ├── public/         # Static assets
  └── styles/         # CSS files
```

## Core Concepts

### File-based Routing

Next-Lite uses file-based routing similar to Next.js. Files in the `pages` directory automatically become routes:

- `pages/index.tsx` → `/`
- `pages/about.tsx` → `/about`
- `pages/blog/[slug].tsx` → `/blog/:slug`

### API Routes

Create API endpoints by adding files to the `pages/api` directory:

```typescript
// pages/api/hello.ts
import { ApiHandler } from 'next-lite';

const handler: ApiHandler = (req, res) => {
  res.json({ message: 'Hello from Next-Lite!' });
};

export default handler;
```

### CSS Modules

Next-Lite supports CSS Modules out of the box:

```typescript
import styles from './Button.module.css';

export function Button() {
  return <button className={styles.button}>Click me</button>;
}
```

## Features

### Static Site Generation (SSG)

```typescript
export async function getStaticProps() {
  return {
    props: {
      data: await fetchData()
    }
  };
}
```

### Server-Side Rendering (SSR)

```typescript
export async function getServerSideProps(context) {
  return {
    props: {
      data: await fetchData(context.params)
    }
  };
}
```

### Image Optimization

Next-Lite includes built-in image optimization:

```typescript
import { Image } from 'next-lite/image';

function MyImage() {
  return (
    <Image
      src="/my-image.jpg"
      alt="My Image"
      width={500}
      height={300}
    />
  );
}
```

## API Reference

### Data Fetching

- `getStaticProps` - Fetch data at build time
- `getServerSideProps` - Fetch data on each request
- `getStaticPaths` - Specify dynamic routes to pre-render

### Components

- `Head` - Modify document head
- `Link` - Client-side route transitions
- `Image` - Optimized image component

## Configuration

### next-lite.config.js

```javascript
module.exports = {
  // Enable/disable features
  features: {
    images: true,
    api: true,
    ssr: true
  },
  
  // Configure build options
  build: {
    minify: true,
    target: ['chrome58', 'firefox57', 'safari11', 'edge16']
  },
  
  // Environment variables
  env: {
    customKey: process.env.CUSTOM_KEY
  }
};
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
npm start
```

### Static Export

```bash
npm run export
```

This exports your app as static HTML files that can be served from any static hosting service.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

Next-Lite is [MIT licensed](LICENSE.md).
