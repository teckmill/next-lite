# Routing in Next-Lite

Next-Lite provides a file-system based router built on the concepts of pages.

## Pages

In Next-Lite, a page is a React Component exported from a `.js`, `.jsx`, `.ts`, or `.tsx` file in the `pages` directory. Each page is associated with a route based on its file name.

### Examples

- `pages/index.tsx` → `/`
- `pages/about.tsx` → `/about`
- `pages/blog/index.tsx` → `/blog`
- `pages/blog/[slug].tsx` → `/blog/:slug`

## Dynamic Routes

### Pages with Dynamic Routes

```tsx
// pages/posts/[id].tsx
import { useRouter } from 'next-lite/router';

const Post: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return <h1>Post: {id}</h1>;
};

export default Post;
```

### Catch-all Routes

```tsx
// pages/docs/[...slug].tsx
import { useRouter } from 'next-lite/router';

const Doc: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query; // slug will be an array

  return <h1>Doc: {slug.join('/')}</h1>;
};

export default Doc;
```

## Navigation

### Using the Link Component

```tsx
import Link from 'next-lite/link';

function NavBar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog/[slug]" as="/blog/hello-world">
        Blog Post
      </Link>
    </nav>
  );
}
```

### Programmatic Navigation

```tsx
import { useRouter } from 'next-lite/router';

function LoginButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  );
}
```

## Route Parameters

### Query Parameters

```tsx
// Access query parameters
const { category, sort } = useRouter().query;
// URL: /products?category=electronics&sort=price
```

### Dynamic Route Parameters

```tsx
// pages/users/[id]/posts/[postId].tsx
const { id, postId } = useRouter().query;
// URL: /users/123/posts/456
```

## Custom Error Pages

### 404 Page

```tsx
// pages/404.tsx
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>;
}
```

### 500 Page

```tsx
// pages/500.tsx
export default function Custom500() {
  return <h1>500 - Server Error</h1>;
}
```

## Advanced Routing

### Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next-lite/server';
import type { NextRequest } from 'next-lite/server';

export function middleware(request: NextRequest) {
  // Check auth token
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

### Route Groups

Organize your routes using folders without affecting the URL structure:

```
pages/
├── (marketing)
│   ├── about.tsx
│   └── contact.tsx
└── (app)
    ├── dashboard.tsx
    └── settings.tsx
```

## Best Practices

1. **Organized Structure**
   - Keep related pages together in directories
   - Use descriptive names for files and directories

2. **Performance**
   - Use dynamic imports for large page components
   - Implement proper loading states

3. **SEO**
   - Use descriptive titles and meta tags
   - Implement proper canonical URLs

4. **Accessibility**
   - Ensure proper focus management during navigation
   - Use semantic HTML elements

## Troubleshooting

Common routing issues and their solutions:

1. **404 Errors**
   - Check file names and case sensitivity
   - Verify dynamic route parameters

2. **Redirect Loops**
   - Check middleware logic
   - Verify navigation conditions

3. **Performance Issues**
   - Implement proper code splitting
   - Use shallow routing when appropriate
