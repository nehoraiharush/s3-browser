import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const require = createRequire(import.meta.url);
const S3rver = require('s3rver');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const S3_PORT = 4569; // Internal port for S3rver
const PROXY_PORT = 4568; // External port representing the public Endpoint

const corsPath = path.join(__dirname, '../s3-mock/cors.xml');
const corsConfig = fs.readFileSync(corsPath);

// 1. Start S3rver (Internal)
console.log('Starting S3rver on internal port ' + S3_PORT + '...');
new S3rver({
  port: S3_PORT,
  address: '127.0.0.1',
  directory: path.join(__dirname, '../s3-data'),
  configureBuckets: [
    {
      name: 'demo-bucket',
      configs: [corsConfig]
    }
  ]
}).run((err) => {
  if (err) {
    console.error('S3rver error:', err);
    return;
  }
  console.log('S3rver running internally.');

  // 2. Start Express Proxy (External)
  const app = express();

  // Force CORS on *everything*
  app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*'],
    exposedHeaders: ['ETag', 'x-amz-request-id', 'x-amz-id-2'],
    credentials: true,
  }));

  // Proxy requests to S3rver
  app.use('/', createProxyMiddleware({
    target: `http://127.0.0.1:${S3_PORT}`,
    changeOrigin: true,
    ws: true,
    logLevel: 'debug' // Show us what's happening
  }));

  app.listen(PROXY_PORT, () => {
    console.log(`\n✅ Local S3 Proxy listening at http://localhost:${PROXY_PORT}`);
    console.log(`Use this endpoint in your App: http://localhost:${PROXY_PORT}`);
  });
});
