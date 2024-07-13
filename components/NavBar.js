import { useRouter } from 'next/router';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = ({ isLoggedIn , setIsLoggedIn}) => {
    const router = useRouter();

    const handleLogout = () => {
        // Implement logout logic
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        router.push('/login');
        setIsLoggedIn(false);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    StrApi Chat
                </Typography>
                {isLoggedIn && (
                    <>
                        {/*<Button color="inherit" onClick={() => router.push('/chat')}>*/}
                        {/*    Chat*/}
                        {/*</Button>*/}
                        <Button color="inherit" onClick={() => router.push('/room')}>
                            Room
                        </Button>
                    </>
                )}
                {!isLoggedIn && (
                    <>
                        <Button color="inherit" onClick={() => router.push('/login')}>
                            Login
                        </Button>
                        <Button color="inherit" onClick={() => router.push('/signup')}>
                            Sign Up
                        </Button>
                    </>
                )}
                {isLoggedIn && (
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
