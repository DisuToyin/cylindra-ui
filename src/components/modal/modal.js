import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import BasicSelect from '../select/SelectComp';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',

  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal({
  handleClose,
  open,

  footer,
  header,
  title,
  children,
  handleSubmit,
  loading,
  btnText = 'Save',
}) {
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            {header && (
              <header style={{ borderBottom: '.5px Solid #80808033', paddingBottom: '.5rem' }}>
                <Typography id="transition-modal-title" variant="h6" component="h2">
                  {title}
                </Typography>
              </header>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>{children}</div>

            {footer && (
              <footer
                style={{
                  borderTop: '.5px Solid #80808033',
                  paddingTop: '1rem',
                  justifyContent: 'right',
                  marginTop: '3rem',
                  display: 'flex',
                  gap: '1rem',
                }}
              >
                <LoadingButton size="large" type="submit" variant="contained" color="error" onClick={handleClose}>
                  Close
                </LoadingButton>
                {loading ? (
                  <LoadingButton size="large" disabled type="submit" variant="contained" onClick={handleSubmit}>
                    Please wait...
                  </LoadingButton>
                ) : (
                  <LoadingButton size="large" type="submit" variant="contained" onClick={handleSubmit}>
                    {btnText}
                  </LoadingButton>
                )}
              </footer>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
