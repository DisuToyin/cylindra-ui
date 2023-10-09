import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm({
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  handleAuth,
  authLoading,
  showMoreFields = false,
}) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Stack spacing={3}>
        {showMoreFields && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
            <TextField
              onChange={(e) => setFirstName(e.target.value)}
              style={{ width: '-webkit-fill-available' }}
              name="first name"
              label="First Name"
            />
            <TextField
              onChange={(e) => setLastName(e.target.value)}
              style={{ width: '-webkit-fill-available' }}
              name="last name"
              label="Last Name"
            />{' '}
          </div>
        )}
        <TextField onChange={(e) => setEmail(e.target.value)} name="email" label="Email address" />

        <TextField
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {!showMoreFields && (
          <Link variant="subtitle2" underline="hover">
            Forgot password?
          </Link>
        )}
      </Stack>

      <LoadingButton
        disabled={authLoading}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleAuth}
      >
        {showMoreFields ? (authLoading ? `Loading` : `Register`) : authLoading ? `Loading` : `Login`}
      </LoadingButton>
    </>
  );
}
