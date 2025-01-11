import React from 'react';
import { createRoot } from 'react-dom/client';
import { createRouter } from './router/router';
import '../example/styles/globals.css';

// Import pages
import HomePage from '../example/pages/index';

// Initialize the router with routes
const router = createRouter([
  {
    path: '/',
    component: HomePage
  }
]);

// Mount the application
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  
  // Initial render
  const render = async () => {
    const route = router.match(window.location.pathname);
    if (route && route.component) {
      // Get the page config
      const Component = route.component;
      let props = {};
      
      // Handle SSG/SSR data fetching
      if (Component.getStaticProps) {
        props = await Component.getStaticProps();
      }
      
      root.render(React.createElement(Component, props));
    } else {
      root.render(React.createElement('div', null, '404 - Page Not Found'));
    }
  };

  // Handle route changes
  window.addEventListener('popstate', render);
  render();
}
