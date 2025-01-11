# Next-Lite

A lightweight alternative to Next.js that prioritizes speed and simplicity while maintaining essential features.

## Features

- 🚀 Lightweight (<50KB core)
- 📁 File-based routing
- 🎨 Multiple rendering options (SSG, SSR, CSR)
- ⚡️ Built-in performance optimizations
- 🔄 Fast live reloading
- 📦 TypeScript support
- 🎯 Zero-config API routes

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
your-app/
  ├── pages/           # Page components and routes
  │   ├── index.tsx    # Home page
  │   └── api/        # API routes
  ├── components/      # Reusable components
  ├── public/         # Static assets
  └── styles/         # CSS files
```

## Creating Pages

Create pages by adding files to the `pages` directory:

```tsx
// pages/index.tsx
import { withPage } from 'next-lite';

function HomePage({ data }) {
  return <h1>{data.title}</h1>;
}

export default withPage(HomePage, {
  renderMode: 'ssg',
  getStaticProps: async () => {
    return {
      data: { title: 'Welcome to Next-Lite!' }
    };
  }
});
```

## API Routes

Create API endpoints in the `pages/api` directory:

```typescript
// pages/api/hello.ts
import { createApiRoute } from 'next-lite';

export default createApiRoute({
  get: async (req, res) => {
    res.json({ message: 'Hello from Next-Lite!' });
  }
});
```

## Rendering Modes

- **Static Site Generation (SSG)**: Pre-renders pages at build time
- **Server-Side Rendering (SSR)**: Renders pages on each request
- **Client-Side Rendering (CSR)**: Renders pages in the browser

## License

MIT
