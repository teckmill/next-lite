import { createApiRoute } from '../../../src/api/handler';

export default createApiRoute({
  get: async (req, res) => {
    res.json({
      message: 'Hello from Next-Lite API!',
      timestamp: new Date().toISOString()
    });
  },
  post: async (req, res) => {
    const { name = 'World' } = req.body;
    res.json({
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString()
    });
  }
});
