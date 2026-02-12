import { createProxyMiddleware } from 'http-proxy-middleware';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

import files from '../s3-data/mock-s3-files.js';

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
  configureBuckets: [
    {
      name: 'demo-bucket',
      configs: [corsConfig],
    },
  ],
}).run((err) => {
  if (err) {
    console.error('S3rver error:', err);
    return;
  }
  console.log('S3rver running internally.');

  // 2. Start Express Proxy (External)
  const app = express();

  // Force CORS on *everything*
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['*'],
      exposedHeaders: ['ETag', 'x-amz-request-id', 'x-amz-id-2'],
      credentials: true,
    }),
  );

  // Proxy requests to S3rver
  app.use(
    '/',
    createProxyMiddleware({
      target: `http://127.0.0.1:${S3_PORT}`,
      changeOrigin: true,
      ws: true,
      logLevel: 'debug', // Show us what's happening
    }),
  );

  app.listen(PROXY_PORT, async () => {
    console.log(
      `\n✅ Local S3 Proxy listening at http://localhost:${PROXY_PORT}`,
    );
    console.log(
      `Use this endpoint in your App: http://localhost:${PROXY_PORT}`,
    );

    // 3. Seed Data
    await injectMockFiles();
  });
});

const injectMockFiles = async () => {
  console.log('🌱 Seeding demo data...');

  console.log({ files });

  try {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const client = new S3Client({
      region: 'us-east-1',
      endpoint: `http://localhost:${PROXY_PORT}`,
      credentials: { accessKeyId: 'S3RVER', secretAccessKey: 'S3RVER' },
      forcePathStyle: true,
    });

    for (const file of files) {
      await client.send(
        new PutObjectCommand({
          Bucket: 'demo-bucket',
          Key: file.Key,
          Body: file.Body,
        }),
      );
    }

    console.log(`✨ Seeded ${files.length} files successfully!`);
  } catch (err) {
    console.error('❌ Failed to seed data:', err);
  }
};
