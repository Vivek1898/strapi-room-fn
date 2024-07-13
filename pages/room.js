import { useState } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Input,
    Paper,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {jwtDecode as jwt_decode} from "jwt-decode";
import axios from "axios";
import {API_URL as SOCKET_URL} from "@/config";


const theme = createTheme({
    palette: {
        primary: {
            main: 'rgb(25, 118, 210)',
        },
        secondary: {
            main: '#000000',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
        },
    },
    typography: {
        h4: {
            fontWeight: 700,
        },
    },
});

export default function CreateRoom() {
    const [roomType, setRoomType] = useState('public');
    const [roomName, setRoomName] = useState('');
    const router = useRouter();

    const handleStartChat = async () => {
        if (roomType === 'public') {
            router.push(`/chat?roomname=public&roomid=3`);
        } else if (roomType === 'private' && roomName) {
            const token = localStorage.getItem('token');
            const decoded = jwt_decode(token);
            const res = await axios.post(`${SOCKET_URL}/api/rooms`, {
                data: {
                    Name: roomName,
                    // name: roomName,
                    Enumeration: 'private',
                    participants: [decoded.id],
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res.data);
            const roomId = res.data.data.id;
            router.push(`/chat?roomname=${roomName}&roomid=${roomId}`);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container
                component="main"
                maxWidth="md"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    bgcolor: theme.palette.background.default,
                    padding: 2,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        borderRadius: 2,
                        width: '100%',
                        maxWidth: 600,
                    }}
                >
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Create a Room
                    </Typography>
                    <RadioGroup
                        aria-label="room-type"
                        name="room-type"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    >
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        padding: 2,
                                        borderRadius: 2,
                                        border: roomType === 'public' ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                                    }}
                                >
                                    <FormControlLabel
                                        value="public"
                                        control={<Radio color="primary" />}
                                        label={
                                            <Typography variant="h6" gutterBottom>
                                                Public Room
                                            </Typography>
                                        }
                                    />
                                    <Typography gutterBottom>
                                        Anyone can join this room. It's open to everyone.
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        padding: 2,
                                        borderRadius: 2,
                                        border: roomType === 'private' ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                                    }}
                                >
                                    <FormControlLabel
                                        value="private"
                                        control={<Radio color="primary" />}
                                        label={
                                            <Typography variant="h6" gutterBottom>
                                                Private Room
                                            </Typography>
                                        }
                                    />
                                    <Typography gutterBottom>
                                        Only people with the room name can join. Keep it private.
                                    </Typography>
                                    <FormControl fullWidth margin="normal">
                                        <FormLabel sx={{ color: '#ffffff' }}>Room Name</FormLabel>
                                        <Input
                                            type="text"
                                            placeholder="Enter room name"
                                            value={roomName}
                                            onChange={(e) => setRoomName(e.target.value)}
                                            disabled={roomType !== 'private'}
                                            sx={{
                                                color: '#000000',
                                                bgcolor: '#ffffff',
                                                borderRadius: 1,
                                            }}
                                        />
                                    </FormControl>
                                </Paper>
                            </Grid>
                        </Grid>
                    </RadioGroup>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 3 }}
                        onClick={handleStartChat}
                    >
                        Start Chat
                    </Button>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}
