import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography, 
  IconButton, 
  Button,
  Divider,
  Toolbar,
  Drawer,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAccount } from '../../context/AccountContext';
import { AddAccountDialog } from './AddAccountDialog';
import { useStyles } from './AccountManager.s';

export const AccountManager: React.FC = () => {
    const { classes } = useStyles();
  const { accounts, activeAccount, selectAccount, deleteAccount } = useAccount();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <Drawer variant="permanent" className={classes.drawer} classes={{ paper: classes.drawer }}>
        <Toolbar>
           <Typography variant="h6" noWrap component="div">
            AWS Accounts
          </Typography>
        </Toolbar>
        <Divider />
        <Box className={classes.buttonContainer}>
            <Button 
                fullWidth 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setIsAddDialogOpen(true)}
                className={classes.addButton}
            >
                Add Account
            </Button>
        </Box>
        <List>
          {accounts.map((account) => (
            <ListItem 
                key={account.id} 
                disablePadding
                secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={(e) => {
                        e.stopPropagation();
                        deleteAccount(account.id);
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  }
            >
              <ListItemButton 
                selected={activeAccount?.id === account.id}
                onClick={() => selectAccount(account.id)}
              >
                <ListItemText 
                    primary={account.name} 
                    secondary={account.region} 
                />
              </ListItemButton>
            </ListItem>
          ))}
          {accounts.length === 0 && (
              <Box className={classes.emptyState}>
                  <Typography variant="body2" color="text.secondary">
                      No accounts added.
                  </Typography>
              </Box>
          )}
        </List>
      </Drawer>
      <AddAccountDialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
    </>
  );
};
