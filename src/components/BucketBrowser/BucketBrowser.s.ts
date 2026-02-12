import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  bucketGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
  },
  card: {
    border: '1px solid rgba(255, 255, 255, 0.12)',
    height: '100%',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
    },
  },
  selectedCard: {
    border: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: 'rgba(144, 202, 249, 0.08)',
  },
  cardActionArea: {
    height: '100%',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  bucketInfo: {
    minWidth: 0,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  emptyState: {
    width: '100%',
  },
}));
