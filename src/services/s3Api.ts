import type { Account } from '../models/account';

const API_BASE = '/api/s3';

export const s3Api = {
  listBuckets: async (account: Account) => {
    const response = await fetch(`${API_BASE}/list-buckets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  },

  listObjects: async (account: Account, bucketName: string, prefix = '') => {
    const response = await fetch(`${API_BASE}/list-objects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...account, bucketName, prefix }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  },

  getDownloadUrl: async (account: Account, bucketName: string, key: string) => {
    // For direct download via proxy with GET, we construct the URL with query params for now.
    // Ideally this would be a POST to get a temporary token, but we are keeping it simple.

    // NOTE: This includes credentials in the URL. This is not secure for shared environments
    // but is acceptable for a local-only tool. If security is critical, we'd use a server-side session.

    const params = new URLSearchParams({
      bucket: bucketName,
      key: key,
      accessKeyId: account.accessKeyId,
      secretAccessKey: account.secretAccessKey,
      region: account.region || 'us-east-1',
      endpoint: account.endpoint || '',
    });

    return `${API_BASE}/download?${params.toString()}`;
  },
};
