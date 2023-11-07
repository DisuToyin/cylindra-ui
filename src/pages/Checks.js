import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import TextField from '@mui/material/TextField';

import toast from 'react-hot-toast';
import BasicSelect from '../components/select/SelectComp';
import TransitionsModal from '../components/modal/modal';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Toast from '../components/hot-toast/toast';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

import useRefreshToken from '../hooks/useRefreshToken';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

import { fDateTime } from '../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Site', alignRight: false },
  { id: 'last_check', label: 'Last Check', alignRight: false },

  { id: 'status', label: 'Status', alignRight: false },
  { id: 'response_time', label: 'Avg Response Time', alignRight: false },
  { id: 'created_at', label: 'Date Created', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Checks() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  // modal
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [editModal, setEditModal] = useState(false);
  const handleOpenEdit = () => {
    setEditModal(true);
    handleCloseMenu();
  };
  const handleCloseEdit = () => setEditModal(false);
  const [siteDetails, setSiteDetails] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const handleOpenDelete = () => setDeleteModal(true);
  const handleCloseDelete = () => setDeleteModal(false);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sites, setSites] = useState([]);

  // payload
  const [siteName, setSiteName] = useState('');
  const [siteLink, setSiteLink] = useState('');
  const [interval, setInterval] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUserSites = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/web', {
          signal: controller.signal,
        });

        if (isMounted) setSites(data);
      } catch (err) {
        console.error(err);
      }
    };

    getUserSites();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const handleCreateSite = async () => {
    // let isMounted = true;
    // const controller = new AbortController();
    try {
      setLoading(true);
      const payload = {
        name: siteName,
        link: siteLink,
        interval,
        notification: 'both',
      };
      const { data } = await axiosPrivate.post('/api/web/create', payload);
      console.log({ data });
      toast.success('Successfully added site!');
    } catch (error) {
      console.log(error);
      toast.error('Error Occured!');
    } finally {
      const { data } = await axiosPrivate.get('/api/web');

      setSites(data);

      setLoading(false);
      setOpenModal(false);
    }
  };

  const handleEditSite = async () => {
    try {
      const payload = {
        web_id: siteDetails?._id,
        name: siteName,
        link: siteLink,
        interval,
        notification: 'both',
      };
      console.log(payload);
      setLoading(true);
      await axiosPrivate.put('/api/web/edit', payload);
      const { data } = await axiosPrivate.get('/api/web');
      setSites(data);
      setLoading(false);
      toast.success('Successfully updated site details!');
      setEditModal(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err?.response?.data?.message || 'Error Occured!');
    }
  };
  const handleDeleteSite = async () => {
    console.log({ web_id: siteDetails?._id });

    try {
      setLoading(true);
      await axiosPrivate.delete(`/api/web/delete/${siteDetails?._id}`);
      const { data } = await axiosPrivate.get('/api/web');
      setSites(data);
      setLoading(false);
      toast.success('Successfully deleted site!');
      setDeleteModal(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err?.response?.data?.message || 'Error Occured!');
    }
  };

  return (
    <>
      <Helmet>
        <title> Site Checks | Cylindra UI </title>
      </Helmet>
      <Toast />
      <TransitionsModal
        open={openModal}
        setOpen={setOpenModal}
        handleClose={handleClose}
        handleOpen={handleOpen}
        footer
        header
        title={'Add a site'}
        handleSubmit={handleCreateSite}
        loading={loading}
      >
        {/* <Typography color="info">Check where you will like to be notified</Typography> */}
        <TextField onChange={(e) => setSiteLink(e.target.value)} style={{}} name="link" label="Site/API URL" />{' '}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {' '}
          <TextField
            onChange={(e) => setSiteName(e.target.value)}
            style={{ width: '50%' }}
            name="name"
            label="Friendly Name"
          />{' '}
          <BasicSelect labelName="Interval" setInterval={setInterval} interval={interval} />
        </div>
        <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Email" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Slack" />
        </FormGroup>
      </TransitionsModal>

      <TransitionsModal
        open={editModal}
        setOpen={setEditModal}
        handleClose={handleCloseEdit}
        handleOpen={handleOpenEdit}
        footer
        header
        title={'Edit Site'}
        handleSubmit={handleEditSite}
        loading={loading}
      >
        {/* <Typography color="info">Check where you will like to be notified</Typography> */}
        <TextField
          defaultValue={siteDetails?.link}
          onChange={(e) => setSiteLink(e.target.value)}
          style={{}}
          name="link"
          label="Site/API URL"
        />{' '}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {' '}
          <TextField
            defaultValue={siteDetails?.name}
            onChange={(e) => setSiteName(e.target.value)}
            style={{ width: '50%' }}
            name="name"
            label="Friendly Name"
          />{' '}
          <BasicSelect labelName="Interval" setInterval={setInterval} interval={interval} />
        </div>
        <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Email" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Slack" />
        </FormGroup>
      </TransitionsModal>

      <TransitionsModal
        open={deleteModal}
        setOpen={setDeleteModal}
        handleClose={handleCloseDelete}
        handleOpen={handleOpenDelete}
        footer
        header
        title={'Delete Site'}
        handleSubmit={handleDeleteSite}
        loading={loading}
        btnText={'Delete'}
      >
        {/* <Typography color="info">Check where you will like to be notified</Typography> */}
        <span style={{ textAlign: 'center' }}>
          {' '}
          Are you sure you want to delete <b>{siteDetails?.link}</b> ?
        </span>
      </TransitionsModal>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Checks
          </Typography>
          <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Check
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {sites?.data?.map((row) => {
                    // const { id, name, site, ssl, status } = row;
                    const selectedUser = selected.indexOf(row?.name) !== -1;

                    return (
                      <TableRow
                        style={{ cursor: 'pointer' }}
                        hover
                        key={row?.id}
                        tabIndex={-1}
                        // role="checkbox"
                        selected={selectedUser}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, row?.name)} />
                        </TableCell>
                        <TableCell
                          onClick={() => navigate(`/dashboard/check/${row?._id}`, { state: { siteData: row } })}
                          component="th"
                          scope="row"
                          padding="2rem"
                        >
                          <Typography variant="subtitle2" noWrap>
                            {row?.name}
                          </Typography>
                        </TableCell>

                        <TableCell align="left">{row?.link}</TableCell>

                        <TableCell align="left">{row?.interval}</TableCell>

                        <TableCell align="left">
                          <Label color={'success'}>Down</Label>
                        </TableCell>

                        <TableCell align="left">xxx</TableCell>
                        <TableCell align="left">{fDateTime(row?.createdAt)}</TableCell>

                        <TableCell align="left">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify
                              icon={'eva:more-vertical-fill'}
                              onClick={() => {
                                setInterval(row?.interval);
                                setSiteDetails(row);
                              }}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleOpenEdit}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleOpenDelete} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
