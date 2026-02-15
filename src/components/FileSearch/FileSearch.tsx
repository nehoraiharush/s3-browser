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
import { type _Object } from '@aws-sdk/client-s3';
import { s3Api } from '../../services/s3Api';
import { useAccount } from '../../context/AccountContext';
import { useStyles } from './FileSearch.s';

interface FileSearchProps {
  bucketName: string;
  onBack: () => void;
}

export const FileSearch: React.FC<FileSearchProps> = ({
  bucketName,
  onBack,
}) => {
  const { classes } = useStyles();
  const { activeAccount } = useAccount();
  const [prefix, setPrefix] = useState('');
  const [results, setResults] = useState<_Object[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* useEffect to initial load */
  React.useEffect(() => {
    handleSearch();
  }, [bucketName, activeAccount]);

  const handleSearch = async () => {
    if (!activeAccount || !bucketName) return;

    setLoading(true);
    setError(null);
    try {
      const data = await s3Api.listObjects(activeAccount, bucketName, prefix);
      setResults(data || []);
    } catch (err: any) {
      console.error('Search failed', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (key: string) => {
    if (!activeAccount) return;

    try {
      const url = await s3Api.getDownloadUrl(activeAccount, bucketName, key);

      // Create a hidden link and click it
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', key.split('/').pop() || key);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
