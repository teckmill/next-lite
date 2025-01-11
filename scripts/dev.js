const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

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

// CSS Modules Plugin
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

// Live Reload Script
const livereloadScript = `
  (function() {
    const socket = new WebSocket('ws://localhost:8080');
    
    socket.onmessage = function(event) {
      if (event.data === 'reload') {
        console.log('Reloading...');
        window.location.reload();
      }
    };

    socket.onclose = function() {
      console.log('Live reload disconnected. Attempting to reconnect...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };
  })();
`;

async function startDevServer() {
  try {
    // Create WebSocket server for live reload
    const wss = new WebSocket.Server({ port: 8080 });
    let sockets = new Set();

    wss.on('connection', (socket) => {
      sockets.add(socket);
      socket.on('close', () => sockets.delete(socket));
    });

    // Ensure public directory exists
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }
    if (!fs.existsSync('public/dist')) {
      fs.mkdirSync('public/dist');
    }

    // Write live reload script
    await fs.promises.writeFile('public/dist/livereload.js', livereloadScript);

    // Initial build
    const service = await esbuild.context({
      entryPoints: ['src/index.ts'],
      bundle: true,
      outdir: 'public/dist',
      platform: 'browser',
      format: 'esm',
      splitting: false,
      sourcemap: true,
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
        '.svg': 'text'
      },
      plugins: [
        cssModulesPlugin,
        {
          name: 'live-reload',
          setup(build) {
            build.onEnd((result) => {
              if (result.errors.length === 0) {
                console.log('Build completed successfully. Notifying browsers...');
                sockets.forEach(socket => {
                  if (socket.readyState === WebSocket.OPEN) {
                    socket.send('reload');
                  }
                });
              } else {
                console.error('Build failed:', result.errors);
              }
            });
          },
        }
      ],
      define: {
        'process.env.NODE_ENV': '"development"'
      }
    });

    // Do an initial build
    await service.rebuild();

    // Create HTTP server
    const server = http.createServer(async (req, res) => {
      try {
        // Default to index.html for root path
        let filePath = req.url === '/' ? '/index.html' : req.url;
        filePath = path.join(process.cwd(), 'public', filePath);

        // Get file extension and MIME type
        const ext = path.extname(filePath);
        let contentType = mimeTypes[ext] || 'application/octet-stream';

        // Special handling for module scripts
        if (filePath.endsWith('.js') && filePath.includes('/dist/')) {
          contentType = 'text/javascript; charset=utf-8';
        }

        // Check if file exists
        if (fs.existsSync(filePath)) {
          const content = await fs.promises.readFile(filePath, 'utf8');
          
          // Inject live reload script for HTML files
          if (ext === '.html') {
            const modifiedContent = content.replace(
              '</body>',
              '<script src="/dist/livereload.js"></script></body>'
            );
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(modifiedContent);
          } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
          }
        } else {
          res.writeHead(404);
          res.end('File not found');
        }
      } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500);
        res.end('Internal server error');
      }
    });

    // Start the server
    const PORT = 3001;
    server.listen(PORT, () => {
      console.log(`Development server running at http://localhost:${PORT}`);
    });

    // Watch for changes
    await service.watch();

    // Handle shutdown
    const cleanup = async () => {
      console.log('Shutting down...');
      await service.dispose();
      server.close();
      wss.close();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

  } catch (error) {
    console.error('Failed to start development server:', error);
    process.exit(1);
  }
}

startDevServer().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
