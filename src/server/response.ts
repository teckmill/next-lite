export class NextResponse extends Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, init);
  }

  static json(data: any, init?: ResponseInit) {
    const headers = new Headers(init?.headers);
    headers.set('Content-Type', 'application/json');

    return new NextResponse(JSON.stringify(data), {
      ...init,
      headers
    });
  }

  static redirect(url: string | URL, init?: ResponseInit) {
    const headers = new Headers(init?.headers);
    headers.set('Location', url.toString());

    return new NextResponse(null, {
      ...init,
      status: init?.status || 307,
      headers
    });
  }

  static rewrite(url: string | URL) {
    return new NextResponse(null, {
      headers: {
        'x-middleware-rewrite': url.toString()
      }
    });
  }

  static next(init?: ResponseInit) {
    return new NextResponse(null, {
      ...init,
      headers: {
        'x-middleware-next': '1'
      }
    });
  }
}
