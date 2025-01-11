import { useState, useEffect } from 'react';
import { parseRoute, matchRoute } from './utils';

export type RouteConfig = {
  path: string;
  component: React.ComponentType<any>;
  loadData?: () => Promise<any>;
};

export function createRouter(routes: RouteConfig[]) {
  return {
    routes,
    currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
    
    match(path: string) {
      return routes.find(route => matchRoute(route.path, path));
    },

    navigate(path: string) {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };
}

export function useRouter(router: ReturnType<typeof createRouter>) {
  const [currentPath, setCurrentPath] = useState(router.currentPath);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return {
    currentPath,
    navigate: router.navigate,
    match: () => router.match(currentPath)
  };
}
