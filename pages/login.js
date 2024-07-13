import { useState } from 'react';
import axios from 'axios';
import { API_URL } from "@/config";
import { Button, TextField, Typography, Snackbar, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Enter a valid email')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password should be of minimum 6 characters length')
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const res = await axios.post(`${API_URL}/api/auth/local`, {
                    identifier: values.email,
                    password: values.password,
                });

                const data = res.data;
                if (data.jwt) {
                    localStorage.setItem('token', data.jwt);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    router.push('/room');
                    setSnackbarSeverity('success');
                    setSnackbarMessage('Login successful');
                } else {
                    setSnackbarSeverity('error');
                    setSnackbarMessage('Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                setSnackbarSeverity('error');
                setSnackbarMessage(error.response.data.error.message || 'An error occurred during login');
            }
            setOpenSnackbar(true);
            setLoading(false);
        },
    });

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleSnackbarClickAway = () => {
        setOpenSnackbar(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
            <Typography variant="h5" gutterBottom>Login</Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{ marginTop: 20 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>
            </form>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                ClickAwayListenerProps={{ onClickAway: handleSnackbarClickAway }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}
