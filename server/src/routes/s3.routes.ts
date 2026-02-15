import { Router } from 'express';
import { s3Service, type S3Config } from '../BL/s3.bl.js';

const router = Router();

// Helper to extract config from body
const getConfig = (req: any): S3Config => {
  return {
    accessKeyId: req.body.accessKeyId,
    secretAccessKey: req.body.secretAccessKey,
    endpoint: req.body.endpoint,
    region: req.body.region,
  };
};

router.post('/list-buckets', async (req, res, next) => {
  try {
    const buckets = await s3Service.listBuckets(getConfig(req));
    res.json(buckets);
  } catch (err) {
    next(err);
  }
});

router.post('/list-objects', async (req, res, next) => {
  try {
    const { bucketName, prefix } = req.body;
    if (!bucketName) {
      res.status(400).json({ error: 'Bucket name is required' });
      return;
    }
    const objects = await s3Service.listObjects(
      getConfig(req),
      bucketName,
      prefix,
    );
    res.json(objects);
  } catch (err) {
    next(err);
  }
});

router.post('/get-download-url', async (req, res, next) => {
  try {
    const { bucketName, key } = req.body;
    if (!bucketName || !key) {
      res.status(400).json({ error: 'Bucket name and Key are required' });
      return;
    }
    const url = await s3Service.getDownloadUrl(getConfig(req), bucketName, key);
    res.json({ url });
  } catch (err) {
    next(err);
  }
});

router.get('/download', async (req, res, next) => {
  try {
    const { bucket, key, accessKeyId, secretAccessKey, endpoint, region } =
      req.query;

    if (!bucket || !key || !accessKeyId || !secretAccessKey) {
      res.status(400).send('Missing parameters');
      return;
    }

    const config: S3Config = {
      accessKeyId: accessKeyId as string,
      secretAccessKey: secretAccessKey as string,
      endpoint: endpoint as string,
      region: region as string,
    };

    const { stream, contentType } = await s3Service.getFileStream(
      config,
      bucket as string,
      key as string,
    );

    res.setHeader('Content-Type', contentType || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${(key as string).split('/').pop()}"`,
    );

    // @ts-ignore
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
});

export default router;
