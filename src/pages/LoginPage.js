import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import React, { useState, useContext } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, Alert, Snackbar } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';

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

// ----------------------------------------------------------------------

export default function LoginPage() {
  const { setAuth } = useAuth();
  const res = useAuth();
  const navigate = useNavigate();

  const mdUp = useResponsive('up', 'md');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [authLoading, setAuthLoading] = useState(false);

  const [openSB, setOpenSB] = useState(false);
  const [alertMessage, setAlertMessage] = useState('Success');
  const [result, setResult] = useState('success');

  const handleLogin = async () => {
    setAuthLoading(true);
    const payload = {
      email,
      password,
    };

    console.log({ payload });

    try {
      const { data } = await axios.post('/api/user/login', payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      console.log({ data: data?.data, success: data?.success });
      setAuth(data?.data);
      setOpenSB(true);
      setAlertMessage('Login Successful!');
      setResult('success');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.log(error);
      setOpenSB(true);
      setAlertMessage('Login Failed!');
      setResult('error');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> Login | Cylindra UI </title>
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
              Sign in to Cylindra
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Don’t have an account? {''}
              <Link href="register" variant="subtitle2">
                Get started
              </Link>
            </Typography>

            <LoginForm
              setPassword={setPassword}
              setEmail={setEmail}
              handleAuth={handleLogin}
              authLoading={authLoading}
            />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
