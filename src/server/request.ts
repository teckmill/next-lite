export class NextRequest extends Request {
  private _cookies: Map<string, string>;
  private _nextConfig: any;

  constructor(input: RequestInfo, init?: RequestInit) {
    super(input, init);
    this._cookies = new Map();
    this.parseCookies();
  }

  private parseCookies() {
    const cookieHeader = this.headers.get('cookie');
    if (cookieHeader) {
      const pairs = cookieHeader.split(';');
      pairs.forEach(pair => {
        const [key, value] = pair.trim().split('=');
        this._cookies.set(key, value);
      });
    }
  }

  get cookies() {
    return {
      get: (name: string) => this._cookies.get(name),
      getAll: () => Object.fromEntries(this._cookies),
      set: (name: string, value: string, options?: { path?: string; expires?: Date; httpOnly?: boolean }) => {
        this._cookies.set(name, value);
        const cookie = `${name}=${value}${options?.path ? `; path=${options.path}` : ''}${
          options?.expires ? `; expires=${options.expires.toUTCString()}` : ''
        }${options?.httpOnly ? '; httpOnly' : ''}`;
        this.headers.append('Set-Cookie', cookie);
      },
      delete: (name: string) => {
        this._cookies.delete(name);
        this.headers.append('Set-Cookie', `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
      }
    };
  }

  get nextConfig() {
    return this._nextConfig;
  }

  set nextConfig(config: any) {
    this._nextConfig = config;
  }

  get ip() {
    return this.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
           this.headers.get('x-real-ip') ||
           '127.0.0.1';
  }

  get geo() {
    return {
      country: this.headers.get('x-vercel-ip-country'),
      region: this.headers.get('x-vercel-ip-region'),
      city: this.headers.get('x-vercel-ip-city')
    };
  }
}
