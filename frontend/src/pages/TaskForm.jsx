import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Stack,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const MAX_DESCRIPTION = 800;

export default function TaskForm() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [errorMsg, setErrorMsg] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const { data } = await api.get(`/tasks/${id}`);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setStatus(data.status || 'pending');
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const validate = () => {
    if (!title.trim()) return 'Title is required.';
    if (title.length < 3) return 'Title must be at least 3 characters.';
    if (description.length > MAX_DESCRIPTION)
      return `Description must be ≤ ${MAX_DESCRIPTION} characters.`;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientError = validate();
    if (clientError) {
      setErrorMsg(clientError);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      if (id) await api.put(`/tasks/${id}`, { title, description, status });
      else await api.post('/tasks', { title, description, status });
      setSuccessOpen(true);
      setTimeout(() => nav('/dashboard'), 900);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title || description) {
      // eslint-disable-next-line no-restricted-globals
      if (!confirm('Discard changes and return to Dashboard?')) return;
    }
    nav('/dashboard');
  };

  return (
    <>
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: 600,
          mx: 'auto',
          mt: 4,
        }}
        elevation={3}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {id ? 'Edit Task' : 'Create Task'}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Title */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Title
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Box>

            {/* Description */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter task details or notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                helperText={`${description.length}/${MAX_DESCRIPTION} characters`}
              />
            </Box>

            {/* Status */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Status
              </Typography>
              <TextField
                select
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Box>

            {/* Error Message */}
            {errorMsg && (
              <Alert severity="error" onClose={() => setErrorMsg('')}>
                {errorMsg}
              </Alert>
            )}

            {/* Buttons */}
            <Stack
              spacing={2}
              sx={{
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                type="submit"
                disabled={loading}
              >
                {loading ? (id ? 'Updating...' : 'Creating...') : id ? 'Update Task' : 'Create Task'}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={1500}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {id ? 'Task updated successfully' : 'Task created successfully'}
        </Alert>
      </Snackbar>
    </>
  );
}
