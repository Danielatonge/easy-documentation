import { Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

let openSnackbarFn;

const Notifier = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSnackbarClose = () => {
    setOpen(false);
    setMessage('');
  };

  const openSnackbar = ({ notificationMessage }) => {
    setOpen(true);
    setMessage(notificationMessage);
  };

  useEffect(() => {
    openSnackbarFn = openSnackbar;
  }, []);

  const messageTemplate = (
    <span id="snackbar-message-id" dangerouslySetInnerHTML={{ __html: message }} />
  );
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={messageTemplate}
        ContentProps={{ 'aria-describedby': 'snackbar-message-id' }}
      />
    </div>
  );
};

export function openSnackbarExported({ notificationMessage }) {
  openSnackbarFn({ notificationMessage });
}

export default Notifier;
