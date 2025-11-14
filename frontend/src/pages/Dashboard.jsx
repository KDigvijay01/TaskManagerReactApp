import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Pagination, TableContainer, Paper, Grid, Card, CardContent, CardActions, Stack
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useSearch } from '../contexts/SearchContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [rawTasks, setRawTasks] = useState([]); // original list from server
  const [tasks, setTasks] = useState([]); // list shown in UI (may be filtered)
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const { searchQuery } = useSearch();
  const [isLoading, setIsLoading] = useState(false);


  // load tasks - behavior changes if searchQuery is present
  const load = async (p = 1) => {
  try {
    setIsLoading(true);
    if (searchQuery && searchQuery.trim()) {
      const { data } = await api.get('/tasks', { params: { page: 1, limit: 1000 } });
      const fetched = data.tasks || [];
      setRawTasks(fetched);
      const q = searchQuery.toLowerCase();
      const filtered = fetched.filter((t) => {
        const title = (t.title || '').toLowerCase();
        const desc = (t.description || '').toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
      setTasks(filtered);
      setPages(1);
      setPage(1);
      setTotal(filtered.length);
    } else {
      const { data } = await api.get('/tasks', { params: { page: p, limit: 10 } });
      const fetched = data.tasks || [];
      setRawTasks(fetched);
      setTasks(fetched);
      setPages(data.pages || 1);
      setPage(data.page || p);
      setTotal(data.total || fetched.length);
    }
  } catch (err) {
    console.error('Failed to load tasks', err);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    // initial load on mount
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when searchQuery changes, reload (page 1)
  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      // reload current view (if searching, reload will reapply filter)
      // if not searching, ensure we stay on the same page (but server might have fewer items)
      await load(page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Tasks</Typography>
        <Box>
          <Button component={RouterLink} to="/tasks/new" variant="contained">Add Task</Button>
        </Box>
      </Box>
      
      {isLoading ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220 }}>
    <LoadingSpinner size={72} />
  </Box>
) : isMdUp ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map(t => (
                <TableRow key={t._id}>
                  <TableCell sx={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</TableCell>
                  <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{dayjs(t.createdAt).format('DD MMM YYYY, h:mm A')}</TableCell>
                  <TableCell>
                    <IconButton component={RouterLink} to={`/tasks/${t._id}/edit`} aria-label="edit"><EditIcon /></IconButton>
                    {user?.role === 'admin' && (
                      <IconButton onClick={() => deleteTask(t._1d || t._id)} aria-label="delete"><DeleteIcon /></IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={2}>
          {tasks.map(t => (
            <Grid item xs={12} key={t._id}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{t.title}</Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        {t.description || '—'}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 110, textAlign: 'right' }}>
                      <Typography variant="caption" display="block">{t.status}</Typography>
                      <Typography variant="caption" display="block">{dayjs(t.createdAt).format('DD MMM')}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button size="small" component={RouterLink} to={`/tasks/${t._id}/edit`} startIcon={<EditIcon />}>Edit</Button>
                  {user?.role === 'admin' && <Button size="small" color="error" onClick={() => deleteTask(t._id)} startIcon={<DeleteIcon />}>Delete</Button>}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {/* When search is active we set pages = 1 so pagination becomes single page */}
        <Pagination count={pages} page={page} onChange={(e, val) => load(val)} />
      </Box>

      <Box sx={{ mt: 1 }}>
        <Typography variant="caption">{total} tasks</Typography>
      </Box>
    </Container>
  );
}
