# Next-Lite

A lightweight alternative to Next.js that prioritizes speed and simplicity while maintaining essential features.

[![GitHub](https://img.shields.io/github/license/teckmill/next-lite)](https://github.com/teckmill/next-lite/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/next-lite)](https://www.npmjs.com/package/next-lite)
[![GitHub stars](https://img.shields.io/github/stars/teckmill/next-lite)](https://github.com/teckmill/next-lite/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/teckmill/next-lite)](https://github.com/teckmill/next-lite/issues)

## Features

- 🚀 Lightweight (<50KB core)
- 📁 File-based routing
- 🎨 Multiple rendering options (SSG, SSR, CSR)
- ⚡️ Built-in performance optimizations
- 🔄 Fast live reloading
- 📦 TypeScript support
- 🎯 Zero-config API routes

## Quick Start

```bash
# Create a new Next-Lite project
npx create-next-lite-app my-app

# Or clone the example project
git clone https://github.com/teckmill/next-lite.git
cd next-lite

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
import React from 'react';
import styles from '../styles/Home.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>Welcome to Next-Lite!</h1>
    </div>
  );
};

export default HomePage;
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 [Documentation](https://github.com/teckmill/next-lite/wiki)
- 🐛 [Report Bug](https://github.com/teckmill/next-lite/issues)
- 💡 [Request Feature](https://github.com/teckmill/next-lite/issues)
- 💬 [Discussions](https://github.com/teckmill/next-lite/discussions)
