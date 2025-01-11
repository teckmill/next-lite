import React from 'react';
import { renderToString } from 'react-dom/server';

export type RenderMode = 'ssg' | 'ssr' | 'csr';

export interface PageConfig {
  renderMode?: RenderMode;
  getStaticProps?: () => Promise<any>;
  getServerSideProps?: (context: any) => Promise<any>;
}

export async function renderPage(
  Component: React.ComponentType<any>,
  config: PageConfig,
  context = {}
) {
  let props = {};

  switch (config.renderMode) {
    case 'ssg':
      if (config.getStaticProps) {
        props = await config.getStaticProps();
      }
      break;
    case 'ssr':
      if (config.getServerSideProps) {
        props = await config.getServerSideProps(context);
      }
      break;
    default:
      break;
  }

  if (typeof window === 'undefined') {
    return renderToString(React.createElement(Component, props));
  }

  return { props };
}

export function withPage(Component: React.ComponentType<any>, config: PageConfig = {}) {
  const WrappedComponent = (props: any) => {
    return React.createElement(Component, props);
  };

  // Attach the config methods to the wrapped component
  WrappedComponent.getStaticProps = config.getStaticProps;
  WrappedComponent.getServerSideProps = config.getServerSideProps;
  WrappedComponent.renderMode = config.renderMode;

  return WrappedComponent;
}
