import { useMemo } from 'react';
import { S3Client } from '@aws-sdk/client-s3';
import { useAccount } from '../context/AccountContext';

export const useS3Client = () => {
  const { activeAccount } = useAccount();

  const client = useMemo(() => {
    if (!activeAccount) return null;

    return new S3Client({
      region: activeAccount.region,
      credentials: {
        accessKeyId: activeAccount.accessKeyId,
        secretAccessKey: activeAccount.secretAccessKey,
      },
    });
  }, [activeAccount]);

  return client;
};
