import { useMemo } from 'react';
import { S3Client } from '@aws-sdk/client-s3';
import { useAccount } from '../context/AccountContext';

export const useS3Client = () => {
  const { activeAccount } = useAccount();

  const client = useMemo(() => {
    if (!activeAccount) return null;

    return new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: activeAccount.accessKeyId,
        secretAccessKey: activeAccount.secretAccessKey,
      },
      endpoint: activeAccount.endpoint,
      forcePathStyle: !!activeAccount.endpoint, // Needed for local S3 servers like MinIO/s3rver
    });
  }, [activeAccount]);

  return client;
};
