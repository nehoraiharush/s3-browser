import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    gap: theme.spacing(2),
  },
  searchBar: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    // Modern shadow for search bar
    boxShadow: theme.shadows[2],
  },
  dataGridContainer: {
    flexGrow: 1,
    minHeight: 0,
    '& .MuiDataGrid-root': {
        border: 'none',
        '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
        '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderBottom: `1px solid ${theme.palette.divider}`,
        }
    }
  },
}));
