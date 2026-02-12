import React, { useState } from 'react';
import {
  TextField,
  Typography,
  IconButton,
  Alert,
  Box,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { ListObjectsV2Command, type _Object } from '@aws-sdk/client-s3';
import { useS3Client } from '../../hooks/useS3Client';
import { useStyles } from './FileSearch.s';
import { downloadFile } from '../../BL/Files/downloadFile';

interface FileSearchProps {
  bucketName: string;
  onBack: () => void;
}

export const FileSearch: React.FC<FileSearchProps> = ({
  bucketName,
  onBack,
}) => {
  const { classes } = useStyles();
  const s3 = useS3Client();
  const [prefix, setPrefix] = useState('');
  const [results, setResults] = useState<_Object[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* useEffect to initial load */
  React.useEffect(() => {
    handleSearch();
  }, [bucketName, s3]);

  const handleSearch = async () => {
    if (!s3 || !bucketName) return;

    setLoading(true);
    setError(null);
    try {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
        MaxKeys: 100, // Limit results for performance
      });
      const response = await s3.send(command);
      setResults(response.Contents || []);
    } catch (err: any) {
      console.error('Search failed', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (key: string) => {
    if (!s3) return;

    try {
      await downloadFile(s3, { Bucket: bucketName, Key: key });
    } catch (err: any) {
      console.error('Download failed', err);
      setError('Failed to generate download URL');
    }
  };

  const columns: GridColDef[] = [
    { field: 'Key', headerName: 'Key', flex: 1 },
    {
      field: 'LastModified',
      headerName: 'Last Modified',
      width: 200,
      valueFormatter: (value: any) =>
        value ? new Date(value).toLocaleString() : '',
    },
    { field: 'Size', headerName: 'Size (Bytes)', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleDownload(params.row.Key)}>
          <DownloadIcon />
        </IconButton>
      ),
    },
  ];

  const rows = results.map((item, index) => ({
    id: item.Key || index, // DataGrid needs an ID
    ...item,
  }));

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='h6'>Files in: {bucketName}</Typography>
      </Box>

      <Paper className={classes.searchBar}>
        <TextField
          fullWidth
          label='Search Prefix (starts with...)'
          variant='outlined'
          size='small'
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder='e.g. images/ or logs/2023-'
        />
        <IconButton onClick={handleSearch} color='primary' sx={{ p: '10px' }}>
          <SearchIcon />
        </IconButton>
      </Paper>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box className={classes.dataGridContainer}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};
