import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Stack 
} from '@mui/material';
import { useAccount } from '../../context/AccountContext';

interface AddAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddAccountDialog: React.FC<AddAccountDialogProps> = ({ open, onClose }) => {
  const { addAccount } = useAccount();
  const [name, setName] = useState('');
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [region, setRegion] = useState('us-east-1');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && accessKeyId && secretAccessKey) {
      await addAccount({
        name,
        accessKeyId,
        secretAccessKey,
        region
      });
      // Reset form
      setName('');
      setAccessKeyId('');
      setSecretAccessKey('');
      setRegion('us-east-1');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add AWS Account</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Account Name (Display)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Access Key ID"
              value={accessKeyId}
              onChange={(e) => setAccessKeyId(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Secret Access Key"
              value={secretAccessKey}
              onChange={(e) => setSecretAccessKey(e.target.value)}
              required
              fullWidth
              type="password"
            />
            <TextField
              label="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Add Account</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
