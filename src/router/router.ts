import { useState, useEffect, createContext, useContext } from 'react';
import { parseRoute, matchRoute } from './utils';
import { RouteConfig, RouterContext, Middleware, NextRequest, NextResponse } from './types';

const RouterContext = createContext<RouterContext | null>(null);

export function createRouter(routes: RouteConfig[]) {
  let middlewareChain: Middleware[] = [];
  
  return {
    routes,
    currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
    
    use(middleware: Middleware) {
      middlewareChain.push(middleware);
      return this;
    },
    
    async runMiddleware(req: NextRequest): Promise<NextResponse> {
      const chain = [...middlewareChain];
      
      const runner = async (index: number): Promise<NextResponse> => {
        if (index >= chain.length) {
          return NextResponse.next();
        }
        
        const middleware = chain[index];
        return middleware(req, () => runner(index + 1));
      };
      
      return runner(0);
    },
    
    match(path: string) {
      for (const route of routes) {
        const params = matchRoute(route.path, path);
        if (params) {
          return { route, params };
        }
        
        if (route.children) {
          for (const childRoute of route.children) {
            const childParams = matchRoute(childRoute.path, path);
            if (childParams) {
              return { route: childRoute, params: childParams };
            }
          }
        }
      }
      return null;
    },
    
    async loadData(route: RouteConfig, params: Record<string, string>) {
      if (route.getStaticProps) {
        return route.getStaticProps({ params });
      }
      
      if (route.getServerSideProps) {
        const req = new NextRequest(window.location.href);
        const res = new NextResponse();
        return route.getServerSideProps({ params, req, res });
      }
      
      return { props: {} };
    },

    navigate(path: string, replace = false) {
      if (typeof window !== 'undefined') {
        const method = replace ? 'replaceState' : 'pushState';
        window.history[method]({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

export function RouterProvider({ 
  router, 
  children 
}: { 
  router: ReturnType<typeof createRouter>;
  children: React.ReactNode;
}) {
  const [currentPath, setCurrentPath] = useState(router.currentPath);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleLocationChange = async () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      setLoading(true);
      setError(null);

      try {
        const match = router.match(path);
        if (match) {
          const { route, params } = match;
          
          // Run middleware
          const req = new NextRequest(window.location.href);
          const middlewareResult = await router.runMiddleware(req);
          
          if (middlewareResult.headers.get('x-middleware-rewrite')) {
            const rewriteUrl = middlewareResult.headers.get('x-middleware-rewrite')!;
            router.navigate(rewriteUrl, true);
            return;
          }
          
          if (middlewareResult.headers.get('Location')) {
            router.navigate(middlewareResult.headers.get('Location')!, true);
            return;
          }
          
          // Load data
          await router.loadData(route, params);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [router]);

  const contextValue: RouterContext = {
    pathname: currentPath,
    params: router.match(currentPath)?.params || {},
    query: Object.fromEntries(new URLSearchParams(window.location.search)),
    asPath: window.location.pathname + window.location.search,
    push: (url: string) => router.navigate(url),
    replace: (url: string) => router.navigate(url, true),
    back: () => window.history.back(),
    reload: () => window.location.reload()
  };

  if (loading) {
    // You can customize the loading component
    return <div>Loading...</div>;
  }

  if (error) {
    // You can customize the error component
    return <div>Error: {error.message}</div>;
  }

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}
