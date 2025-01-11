const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const net = require('net');

// MIME types mapping
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

// Find available port
async function findAvailablePort(startPort) {
  const isPortAvailable = (port) => {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close(() => resolve(true));
      });
      server.listen(port);
    });
  };

  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
  }
  return port;
}

// Error Overlay HTML
const errorOverlayScript = `
  (function() {
    const styles = \`
      .next-lite-error-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        color: #ff5555;
        font-family: monospace;
        padding: 2rem;
        z-index: 9999;
        overflow: auto;
      }
      .next-lite-error-overlay pre {
        background: #1a1a1a;
        padding: 1rem;
        border-radius: 4px;
        white-space: pre-wrap;
      }
      .next-lite-error-overlay .close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        color: white;
        cursor: pointer;
      }
    \`;

    function showError(error) {
      const overlay = document.createElement('div');
      overlay.className = 'next-lite-error-overlay';
      
      const close = document.createElement('div');
      close.className = 'close';
      close.textContent = '✕';
      close.onclick = () => overlay.remove();
      
      const content = document.createElement('pre');
      content.textContent = error;
      
      const style = document.createElement('style');
      style.textContent = styles;
      
      overlay.appendChild(style);
      overlay.appendChild(close);
      overlay.appendChild(content);
      document.body.appendChild(overlay);
    }

    window.showNextLiteError = showError;
  })();
`;

// Enhanced Live Reload with HMR
const hmrClientScript = `
  (function() {
    const socket = new WebSocket('ws://localhost:$PORT');
    let isConnected = false;
    
    socket.onopen = () => {
      console.log('[Next-Lite] Connected to HMR server');
      isConnected = true;
    };
    
    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      
      switch(data.type) {
        case 'reload':
          console.log('[Next-Lite] Full reload requested');
          window.location.reload();
          break;
          
        case 'hmr':
          console.log('[Next-Lite] Hot updating modules:', data.modules);
          try {
            data.modules.forEach(mod => {
              const oldModule = window.__next_lite_modules__[mod.id];
              if (oldModule && oldModule.hot) {
                oldModule.hot.accept();
                if (mod.css) {
                  updateStyle(mod.id, mod.css);
                }
                if (mod.js) {
                  updateModule(mod.id, mod.js);
                }
              }
            });
          } catch (error) {
            console.error('[Next-Lite] HMR update failed:', error);
            window.showNextLiteError(error.stack);
          }
          break;
          
        case 'error':
          console.error('[Next-Lite] Build error:', data.error);
          window.showNextLiteError(data.error);
          break;
      }
    };
    
    socket.onclose = function() {
      console.log('[Next-Lite] Disconnected. Attempting to reconnect...');
      isConnected = false;
      setTimeout(() => {
        if (!isConnected) {
          window.location.reload();
        }
      }, 1000);
    };
    
    function updateStyle(id, css) {
      const existingStyle = document.querySelector(\`style[data-module-id="\${id}"]\`);
      if (existingStyle) {
        existingStyle.textContent = css;
      } else {
        const style = document.createElement('style');
        style.setAttribute('data-module-id', id);
        style.textContent = css;
        document.head.appendChild(style);
      }
    }
    
    function updateModule(id, code) {
      const mod = window.__next_lite_modules__[id];
      if (mod) {
        try {
          eval(code);
          mod.hot.status = 'idle';
        } catch (error) {
          mod.hot.status = 'fail';
          throw error;
        }
      }
    }
    
    window.__next_lite_modules__ = window.__next_lite_modules__ || {};
  })();
`;

// CSS Modules Plugin with source maps
const cssModulesPlugin = {
  name: 'css-modules',
  setup(build) {
    // Handle .module.css files
    build.onLoad({ filter: /\.module\.css$/ }, async (args) => {
      const css = await fs.promises.readFile(args.path, 'utf8');
      const cssFilename = path.basename(args.path);
      const timestamp = Date.now();
      const cssModuleFilename = `${cssFilename}.${timestamp}.css`;
      
      // Generate unique class names
      const classNames = {};
      const processedCss = css.replace(/\.([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, className) => {
        if (!classNames[className]) {
          const uniqueName = `${className}_${Math.random().toString(36).slice(2, 8)}`;
          classNames[className] = uniqueName;
        }
        return `.${classNames[className]}`;
      });

      // Write processed CSS directly to the bundle
      return {
        contents: `
          const style = document.createElement('style');
          style.textContent = ${JSON.stringify(processedCss)};
          document.head.appendChild(style);
          export default ${JSON.stringify(classNames)};
        `,
        loader: 'js',
      };
    });

    // Handle regular .css files
    build.onLoad({ filter: /\.css$/, namespace: 'file' }, async (args) => {
      if (args.path.includes('.module.css')) return;
      const css = await fs.promises.readFile(args.path, 'utf8');
      return {
        contents: `
          const style = document.createElement('style');
          style.textContent = ${JSON.stringify(css)};
          document.head.appendChild(style);
        `,
        loader: 'js',
      };
    });
  },
};

async function startDevServer() {
  try {
    // Find available ports
    const wsPort = await findAvailablePort(8080);
    const httpPort = await findAvailablePort(3000);
    
    // Create WebSocket server for HMR
    const wss = new WebSocket.Server({ port: wsPort });
    const sockets = new Set();
    
    wss.on('connection', (socket) => {
      sockets.add(socket);
      socket.on('close', () => sockets.remove(socket));
    });

    // Create build context
    const ctx = await esbuild.context({
      entryPoints: ['./pages/**/*.{tsx,ts,jsx,js}'],
      bundle: true,
      outdir: '.next',
      sourcemap: true,
      format: 'esm',
      splitting: true,
      plugins: [cssModulesPlugin],
      define: {
        'process.env.NODE_ENV': '"development"'
      },
      loader: {
        '.png': 'dataurl',
        '.svg': 'dataurl',
        '.jpg': 'dataurl',
        '.gif': 'dataurl',
      }
    });

    // Watch for changes
    ctx.watch({
      async onRebuild(error, result) {
        if (error) {
          console.error('Build failed:', error);
          sockets.forEach(socket => {
            socket.send(JSON.stringify({
              type: 'error',
              error: error.message
            }));
          });
        } else {
          console.log('Build succeeded');
          const updates = result.outputFiles.map(file => ({
            id: path.relative(process.cwd(), file.path),
            js: file.text,
            css: file.cssText
          }));
          
          sockets.forEach(socket => {
            socket.send(JSON.stringify({
              type: 'hmr',
              modules: updates
            }));
          });
        }
      }
    });

    // Create HTTP server
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const filepath = path.join(process.cwd(), url.pathname === '/' ? '/index.html' : url.pathname);
        const ext = path.extname(filepath);
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        // Inject HMR client
        if (url.pathname === '/') {
          let html = await fs.promises.readFile(filepath, 'utf8');
          const injectedScripts = `
            <script>${errorOverlayScript}</script>
            <script>${hmrClientScript.replace('$PORT', wsPort)}</script>
          `;
          html = html.replace('</head>', `${injectedScripts}</head>`);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(html);
          return;
        }

        // Serve static files
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        const content = await fs.promises.readFile(filepath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404);
          res.end('Not found');
        } else {
          console.error('Server error:', error);
          res.writeHead(500);
          res.end('Internal server error');
        }
      }
    });

    server.listen(httpPort, () => {
      console.log(`
🚀 Next-Lite dev server running at:
   > Local:    http://localhost:${httpPort}
   > HMR:      ws://localhost:${wsPort}
      `);
    });

  } catch (error) {
    console.error('Failed to start dev server:', error);
    process.exit(1);
  }
}

startDevServer();
