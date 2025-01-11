import { NextResponse } from '../server/response';
import { NextRequest } from '../server/request';

export type Middleware = (
  request: NextRequest,
  next: () => Promise<NextResponse>
) => Promise<NextResponse>;

export type PageProps = {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
};

export type GetStaticProps<T = any> = (context: {
  params: Record<string, string>;
}) => Promise<{
  props: T;
  revalidate?: number;
}>;

export type GetServerSideProps<T = any> = (context: {
  params: Record<string, string>;
  req: NextRequest;
  res: NextResponse;
}) => Promise<{
  props: T;
  notFound?: boolean;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
}>;

export type RouteConfig = {
  path: string;
  component: React.ComponentType<any>;
  middleware?: Middleware[];
  getStaticProps?: GetStaticProps;
  getServerSideProps?: GetServerSideProps;
  children?: RouteConfig[];
};

export type RouterContext = {
  pathname: string;
  params: Record<string, string>;
  query: Record<string, string>;
  asPath: string;
  push: (url: string) => Promise<void>;
  replace: (url: string) => Promise<void>;
  back: () => void;
  reload: () => void;
};
