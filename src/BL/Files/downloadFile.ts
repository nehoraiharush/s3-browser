import {
  GetObjectCommand,
  S3Client,
  type GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const downloadFile = async (
  s3: S3Client,
  { Bucket, Key }: GetObjectCommandInput,
) => {
  if (!Key || !Bucket) return;

  const command = new GetObjectCommand({
    Bucket,
    Key,
    ResponseContentDisposition: `attachment; filename="${Key.split('/').pop()}"`,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  // Create a hidden link and click it to force download without new tab
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', Key?.split('/').pop() || Key); // Attribute is backup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
