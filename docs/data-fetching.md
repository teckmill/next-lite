# Data Fetching in Next-Lite

Next-Lite provides multiple ways to fetch data for your pages, each optimized for different use cases.

## Static Site Generation (SSG)

### getStaticProps

Use `getStaticProps` to fetch data at build time:

```typescript
// pages/blog.tsx
import type { GetStaticProps } from 'next-lite';

interface Post {
  id: number;
  title: string;
}

interface Props {
  posts: Post[];
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  return {
    props: { posts },
    revalidate: 60 // Optional: revalidate every 60 seconds
  };
};

const BlogPage: React.FC<Props> = ({ posts }) => {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};

export default BlogPage;
```

### getStaticPaths

For dynamic routes, use `getStaticPaths` to specify which paths to pre-render:

```typescript
// pages/posts/[id].tsx
import type { GetStaticPaths, GetStaticProps } from 'next-lite';

interface Post {
  id: number;
  title: string;
  content: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  const paths = posts.map((post: Post) => ({
    params: { id: post.id.toString() }
  }));

  return {
    paths,
    fallback: 'blocking' // or true/false
  };
};

export const getStaticProps: GetStaticProps<Post> = async ({ params }) => {
  const res = await fetch(`https://api.example.com/posts/${params.id}`);
  const post = await res.json();

  return {
    props: post,
    revalidate: 60
  };
};
```

## Server-Side Rendering (SSR)

### getServerSideProps

Use `getServerSideProps` to fetch data on each request:

```typescript
// pages/profile.tsx
import type { GetServerSideProps } from 'next-lite';

interface User {
  id: number;
  name: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const userRes = await fetch('https://api.example.com/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const user = await userRes.json();

  return {
    props: { user },
  };
};
```

## Client-Side Data Fetching

### Using SWR

Next-Lite works great with SWR for client-side data fetching:

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  return <div>Hello {data.name}!</div>;
}
```

### Custom Hooks

Create reusable data fetching hooks:

```typescript
// hooks/useUser.ts
import useSWR from 'swr';
import type { User } from '../types';

export function useUser(id: string) {
  const { data, error, isLoading } = useSWR<User>(
    id ? `/api/users/${id}` : null,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error
  };
}
```

## API Routes

### Basic API Route

```typescript
// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next-lite';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const posts = await db.posts.findMany();
    res.status(200).json(posts);
  } else if (req.method === 'POST') {
    const post = await db.posts.create({
      data: req.body
    });
    res.status(201).json(post);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## Error Handling

### Client-Side

```typescript
async function fetchData() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Server-Side

```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data = await fetchData();
    return { props: { data } };
  } catch (error) {
    return {
      props: { error: 'Failed to load data' },
      // or redirect to error page
      // redirect: { destination: '/error', permanent: false }
    };
  }
};
```

## Best Practices

1. **Caching Strategy**
   - Use SSG for static data
   - Use SSR for dynamic, user-specific data
   - Implement proper cache headers

2. **Performance**
   - Implement proper loading states
   - Use pagination for large datasets
   - Optimize API response size

3. **Security**
   - Validate input data
   - Implement proper authentication
   - Use CORS headers when needed

4. **Error Handling**
   - Implement proper error boundaries
   - Provide meaningful error messages
   - Log errors for debugging
