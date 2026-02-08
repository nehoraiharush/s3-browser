
import { useState } from 'react';
import { CssBaseline, Toolbar, Box, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { AuthProvider } from './context/AuthContext';
import { AccountProvider, useAccount } from './context/AccountContext';
import { ThemeModeProvider, useThemeMode } from './context/ThemeModeContext';
import { AccountManager } from './components/AccountManager/AccountManager';
import { BucketBrowser } from './components/BucketBrowser/BucketBrowser';
import { FileSearch } from './components/FileSearch/FileSearch';
import { useStyles } from './App.s';

const ModeToggle = () => {
    const theme = useTheme();
    const { toggleColorMode } = useThemeMode();
    const { classes } = useStyles();

    return (
        <IconButton 
            sx={{ ml: 1 }} 
            onClick={toggleColorMode} 
            color="inherit"
            className={classes.modeToggle}
        >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    );
};

const MainContent = () => {
    const { classes } = useStyles();
    const { activeAccount } = useAccount();
    const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
    
    if (!activeAccount) {
        return (
            <Box component="main" className={classes.centeredContainer}>
                <Box className={classes.centeredText}>
                    <h1>S3 Browser</h1>
                    <p>Select an AWS Account from the sidebar to begin.</p>
                </Box>
            </Box>
        );
    }

    if (selectedBucket) {
        return (
            <Box component="main" className={classes.fileSearchWrapper}>
                <FileSearch 
                    bucketName={selectedBucket} 
                    onBack={() => setSelectedBucket(null)} 
                />
            </Box>
        );
    }

    return (
        <Box component="main" className={classes.mainContentWrapper}>
            <Toolbar />
            <BucketBrowser 
                selectedBucket={selectedBucket} 
                onBucketSelect={setSelectedBucket} 
            />
        </Box>
    );
};

const AppContent = () => {
    const { classes } = useStyles();

    return (
        <AuthProvider>
            <AccountProvider>
                <Box className={classes.appContainer}>
                    <CssBaseline />
                    <ModeToggle />
                    <AccountManager />
                    <MainContent />
                </Box>
            </AccountProvider>
        </AuthProvider>
    );
};

function App() {
  return (
    <ThemeModeProvider>
        <AppContent />
    </ThemeModeProvider>
  );
}

export default App;
