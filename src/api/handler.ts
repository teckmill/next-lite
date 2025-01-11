export type ApiRequest = {
  method: string;
  query: Record<string, string>;
  params: Record<string, string>;
  body: any;
};

export type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (data: any) => void;
  send: (data: any) => void;
};

export type ApiHandler = (req: ApiRequest, res: ApiResponse) => void | Promise<void>;

export function createApiHandler(handler: ApiHandler) {
  return async function(req: ApiRequest, res: ApiResponse) {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export function createApiRoute(methods: Record<string, ApiHandler>) {
  return createApiHandler(async (req, res) => {
    const handler = methods[req.method.toLowerCase()];
    
    if (!handler) {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    await handler(req, res);
  });
}
