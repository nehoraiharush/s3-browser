import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import { ListBucketsCommand, type Bucket } from '@aws-sdk/client-s3';
import { useS3Client } from '../../hooks/useS3Client';
import { useAccount } from '../../context/AccountContext';
import { useStyles } from './BucketBrowser.s';

interface BucketBrowserProps {
  onBucketSelect: (bucketName: string) => void;
  selectedBucket: string | null;
}

export const BucketBrowser: React.FC<BucketBrowserProps> = ({
  onBucketSelect,
  selectedBucket,
}) => {
  const { classes, cx } = useStyles();
  const { activeAccount } = useAccount();
  const s3 = useS3Client();
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const listBuckets = async () => {
      if (!s3 || !activeAccount) return;

      setLoading(true);
      setError(null);
      try {
        const command = new ListBucketsCommand({});
        const response = await s3.send(command);

        setBuckets(response.Buckets || []);
      } catch (err: any) {
        console.error('Failed to list buckets', err);
        setError(err.message || 'Failed to list buckets');
      } finally {
        setLoading(false);
      }
    };

    listBuckets();
  }, [s3, activeAccount]);

  if (!activeAccount) {
    return (
      <Typography>
        Please add and select an AWS Account from the sidebar.
      </Typography>
    );
  }

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity='error'>Error listing buckets: {error}</Alert>;
  }
  console.log({ buckets });

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Typography variant='h5'>Buckets in "{activeAccount.name}"</Typography>
      </Box>

      <Box className={classes.bucketGrid}>
        {buckets.map((bucket) => (
          <Card
            key={bucket.Name}
            className={cx(classes.card, {
              [classes.selectedCard]: selectedBucket === bucket.Name,
            })}
          >
            <CardActionArea
              onClick={() => bucket.Name && onBucketSelect(bucket.Name)}
              className={classes.cardActionArea}
            >
              <CardContent className={classes.cardContent}>
                <StorageIcon color='primary' />
                <Box className={classes.bucketInfo}>
                  <Typography variant='subtitle1' noWrap title={bucket.Name}>
                    {bucket.Name}
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    {bucket.CreationDate
                      ? new Date(bucket.CreationDate).toLocaleDateString()
                      : '-'}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
        {buckets.length === 0 && (
          <Box className={classes.emptyState}>
            <Alert severity='info'>No buckets found in this account.</Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
};
