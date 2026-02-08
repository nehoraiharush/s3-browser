import { makeStyles } from 'tss-react/mui';

const DRAWER_WIDTH = 280;

export const useStyles = makeStyles()((theme) => ({
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
    '& .MuiDrawer-paper': { 
      width: DRAWER_WIDTH, 
      boxSizing: 'border-box',
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  },
  drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar as any,
      justifyContent: 'flex-start',
  },
  buttonContainer: {
    padding: theme.spacing(2),
  },
  emptyState: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  addButton: {
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1, 2),
      boxShadow: theme.shadows[2],
  }
}));
