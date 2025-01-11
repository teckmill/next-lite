import React from 'react';
import { useRouter } from '../../src/router/router';
import type { GetServerSideProps } from '../../src/router/types';

interface Props {
  message: string;
  timestamp: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  // Example of server-side data fetching
  return {
    props: {
      message: 'Welcome to Next-Lite!',
      timestamp: new Date().toISOString()
    }
  };
};

export default function HomePage({ message, timestamp }: Props) {
  const router = useRouter();
  
  return (
    <div className="container">
      <h1>{message}</h1>
      <p>Page rendered at: {timestamp}</p>
      
      <div className="navigation">
        <button onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </button>
        <button onClick={() => router.push('/about')}>
          About Us
        </button>
      </div>
      
      <div className="info">
        <h2>Current Route Info:</h2>
        <pre>
          {JSON.stringify({
            pathname: router.pathname,
            query: router.query,
            asPath: router.asPath
          }, null, 2)}
        </pre>
      </div>
      
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .navigation {
          margin: 2rem 0;
          display: flex;
          gap: 1rem;
        }
        
        button {
          padding: 0.5rem 1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        button:hover {
          background: #0051a2;
        }
        
        .info {
          background: #f6f6f6;
          padding: 1rem;
          border-radius: 4px;
        }
        
        pre {
          background: #fff;
          padding: 1rem;
          border-radius: 4px;
          overflow: auto;
        }
      `}</style>
    </div>
  );
}
