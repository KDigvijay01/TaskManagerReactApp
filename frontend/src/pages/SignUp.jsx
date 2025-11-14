import React, { useState } from 'react';
import {
  Container, Box, TextField, Button, Typography, Paper,
  InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!emailRegex.test(email)) {
      setErr('Please enter a valid email address.');
      return;
    }
    if (!passwordRegex.test(password)) {
      setErr(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    try {
      await signup({ name, email, password });
      nav('/dashboard');
    } catch (error) {
      setErr(error.response?.data?.message || 'Sign up failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 6, sm: 8 } }}>
        <Typography variant="h5" gutterBottom>Create account</Typography>

        <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
          <TextField
            fullWidth label="Name" margin="normal"
            value={name} onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth label="Email" margin="normal"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass((p) => !p)}>
                    {!showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            Create account
          </Button>

          {err && <Typography color="error" sx={{ mt: 1 }}>{err}</Typography>}
        </Box>
      </Paper>
    </Container>
  );
}
