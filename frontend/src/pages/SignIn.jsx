// // import React, { useState } from 'react';
// // import { Container, Box, TextField, Button, Typography, Link, Paper } from '@mui/material';
// // import { useAuth } from '../contexts/AuthContext';
// // import { useNavigate } from 'react-router-dom';

// // export default function SignIn() {
// //   const { signin } = useAuth();
// //   const nav = useNavigate();
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [err, setErr] = useState('');

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     setErr('');
// //     try {
// //       await signin(email, password);
// //       nav('/dashboard');
// //     } catch (error) {
// //       setErr(error.response?.data?.message || 'Sign in failed');
// //     }
// //   };

// //   return (
// //     <Container maxWidth="xs">
// //       <Paper sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 6, sm: 8 } }}>
// //         <Typography variant="h5" gutterBottom>Sign in</Typography>
// //         <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
// //           <TextField fullWidth label="Email" margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
// //           <TextField fullWidth type="password" label="Password" margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
// //           <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Sign In</Button>
// //           {err && <Typography color="error" sx={{ mt: 1 }}>{err}</Typography>}
// //         </Box>
// //         <Box sx={{ mt: 2 }}>
// //           <Link href="/signup" underline="hover">Create an account</Link>
// //         </Box>
// //       </Paper>
// //     </Container>
// //   );
// // }







// import React, { useState } from 'react';
// import { Container, Box, TextField, Button, Typography, Link, Paper } from '@mui/material';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

// export default function SignIn() {
//   const { signin } = useAuth();
//   const nav = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [err, setErr] = useState('');

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const passwordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//   const submit = async (e) => {
//     e.preventDefault();
//     setErr('');

//     if (!emailRegex.test(email)) {
//       setErr('Please enter a valid email address.');
//       return;
//     }

//     if (!passwordRegex.test(password)) {
//       setErr(
//         'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
//       );
//       return;
//     }

//     try {
//       await signin(email, password);
//       nav('/dashboard');
//     } catch (error) {
//       setErr(error.response?.data?.message || 'Sign in failed');
//     }
//   };

//   return (
//     <Container maxWidth="xs">
//       <Paper sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 6, sm: 8 } }}>
//         <Typography variant="h5" gutterBottom>Sign in</Typography>

//         <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
//           <TextField fullWidth label="Email" margin="normal"
//             value={email} onChange={(e) => setEmail(e.target.value)} />

//           <TextField fullWidth type="password" label="Password" margin="normal"
//             value={password} onChange={(e) => setPassword(e.target.value)} />

//           <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
//             Sign In
//           </Button>

//           {err && <Typography color="error" sx={{ mt: 1 }}>{err}</Typography>}
//         </Box>

//         <Box sx={{ mt: 2 }}>
//           <Link href="/signup" underline="hover">Create an account</Link>
//         </Box>
//       </Paper>
//     </Container>
//   );
// }





import React, { useState } from 'react';
import {
  Container, Box, TextField, Button, Typography, Link, Paper,
  InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const { signin } = useAuth();
  const nav = useNavigate();
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
      await signin(email, password);
      nav('/dashboard');
    } catch (error) {
      setErr(error.response?.data?.message || 'Sign in failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: { xs: 2, sm: 3 }, mt: { xs: 6, sm: 8 } }}>
        <Typography variant="h5" gutterBottom>Sign in</Typography>

        <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            type={showPass ? 'text' : 'password'}
            label="Password"
            margin="normal"
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
            Sign In
          </Button>

          {err && <Typography color="error" sx={{ mt: 1 }}>{err}</Typography>}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Link href="/signup" underline="hover">Create an account</Link>
        </Box>
      </Paper>
    </Container>
  );
}
