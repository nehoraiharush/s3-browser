import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  region?: string;
}

export class S3Service {
  private createClient(config: S3Config): S3Client {
    if (!config.accessKeyId || !config.secretAccessKey) {
      throw new Error('Missing AWS Credentials');
    }
    return new S3Client({
      region: config.region || 'us-east-1',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint || undefined,
      forcePathStyle: !!config.endpoint,
    });
  }

  async listBuckets(config: S3Config) {
    const s3 = this.createClient(config);
    const command = new ListBucketsCommand({});
    const response = await s3.send(command);
    return response.Buckets || [];
  }

  async listObjects(config: S3Config, bucketName: string, prefix: string = '') {
    const s3 = this.createClient(config);
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      MaxKeys: 100,
    });
    const response = await s3.send(command);
    return response.Contents || [];
  }

  async getDownloadUrl(config: S3Config, bucketName: string, key: string) {
    const s3 = this.createClient(config);
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"`,
    });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
  }

  async getFileStream(config: S3Config, bucketName: string, key: string) {
    const s3 = this.createClient(config);
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const response = await s3.send(command);
    return {
      stream: response.Body,
      contentType: response.ContentType,
      contentLength: response.ContentLength,
    };
  }
}

export const s3Service = new S3Service();
