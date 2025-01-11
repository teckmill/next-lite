# Deploying Next-Lite Applications

This guide covers different deployment options and best practices for Next-Lite applications.

## Production Build

Before deploying, create a production build:

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

## Deployment Options

### 1. Node.js Server

Deploy as a Node.js server using PM2 or similar process managers.

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "next-lite" -- start
```

Example ecosystem config (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'next-lite',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### 2. Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

Docker Compose configuration:
```yaml
# docker-compose.yml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

### 3. Static Export

For static sites, use the export command:

```bash
npm run export
```

This generates a static version in the `out` directory that can be deployed to any static hosting service.

## Environment Variables

### Production Environment Variables

Create a `.env.production` file:
```env
DATABASE_URL=https://production-db.example.com
API_KEY=your-production-api-key
```

Access environment variables:
```typescript
const apiKey = process.env.API_KEY;
```

### Runtime Configuration

```typescript
// next-lite.config.js
module.exports = {
  env: {
    customKey: process.env.CUSTOM_KEY
  },
  publicRuntimeConfig: {
    staticFolder: '/static'
  }
};
```

## Optimization

### 1. Performance Optimization

```typescript
// next-lite.config.js
module.exports = {
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

### 2. Cache Configuration

```typescript
// pages/_app.tsx
export function generateHeaders() {
  return {
    'Cache-Control': 'public, max-age=31536000, immutable'
  };
}
```

### 3. Image Optimization

```typescript
// next-lite.config.js
module.exports = {
  images: {
    domains: ['example.com'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96]
  }
};
```

## Monitoring

### 1. Error Tracking

```typescript
// pages/_app.tsx
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

### 2. Performance Monitoring

```typescript
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

## Security

### 1. Headers Configuration

```typescript
// next-lite.config.js
module.exports = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        }
      ]
    }
  ]
};
```

### 2. Content Security Policy

```typescript
// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next-lite/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            httpEquiv="Content-Security-Policy"
            content="default-src 'self'; img-src 'self' https:; script-src 'self'"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

## CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        run: |
          # Add your deployment commands here
```

## Troubleshooting

Common deployment issues and solutions:

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for environment variables

2. **Runtime Errors**
   - Check server logs
   - Verify environment variables
   - Check file permissions

3. **Performance Issues**
   - Enable compression
   - Implement proper caching
   - Optimize assets

## Best Practices

1. **Version Control**
   - Use semantic versioning
   - Maintain a changelog
   - Tag releases

2. **Testing**
   - Run tests before deployment
   - Implement smoke tests
   - Monitor error rates

3. **Backup**
   - Regular database backups
   - Version control for configuration
   - Document deployment procedures
