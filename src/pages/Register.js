import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Alert, Stack, Button, Snackbar } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import axios from '../api/axios';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function LoginPage() {
  const navigate = useNavigate();
  const mdUp = useResponsive('up', 'md');

  const userRef = useRef();
  const errRef = useRef();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [authLoading, setAuthLoading] = useState(false);

  const [openSB, setOpenSB] = useState(false);
  const [alertMessage, setAlertMessage] = useState('Success');
  const [result, setResult] = useState('success');

  // const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  // const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  const handleSignup = async () => {
    setAuthLoading(true);
    const payload = {
      name: `${firstName} ${lastName}`,
      email,
      password,
    };

    console.log({ payload });

    try {
      const { data } = await axios.post('/api/user/signup', payload);
      console.log({ data: data?.data, success: data?.success });
      setOpenSB(true);
      setAlertMessage('Sign Up Successful!');
      setResult('success');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.log(error);
      setOpenSB(true);
      setAlertMessage('Sign Up Failed!');
      setResult('error');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> Register | Cylindra UI </title>
      </Helmet>
      <Snackbar
        open={openSB}
        autoHideDuration={6000}
        onClose={() => setOpenSB(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        // message="test"
      >
        <Alert
          onClose={() => setOpenSB(false)}
          variant="filled"
          color={result}
          severity={result}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign up to Cylindra
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Already have an account? {''}
              <Link style={{ cursor: 'pointer' }} href="/login" variant="subtitle2">
                Sign in
              </Link>
            </Typography>

            <LoginForm
              showMoreFields
              setFirstName={setFirstName}
              setPassword={setPassword}
              setLastName={setLastName}
              setEmail={setEmail}
              handleAuth={handleSignup}
              authLoading={authLoading}
            />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
