import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  appContainer: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
  mainContentWrapper: {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  centeredContainer: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  centeredText: {
    textAlign: 'center',
  },
  fileSearchWrapper: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'hidden',
  },
  modeToggle: {
      position: 'absolute',
      top: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 1200, // Above drawer
  }
}));
