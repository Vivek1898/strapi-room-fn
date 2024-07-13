// import "@/styles/globals.css";
//
// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }
//
// export default MyApp;

import { useEffect ,useState } from 'react';
import { useRouter } from 'next/router';

import NavBar from '../components/NavBar';


function MyApp({ Component, pageProps }) {
  const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if running in the browser
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                setIsLoggedIn(true);
                if(['/login', '/signup','/'].includes(router.pathname)) {
                    router.push('/room');
                }
            } else if (!['/login', '/signup'].includes(router.pathname)) {
                router.push('/login');
            }
        }
    }, [router,isLoggedIn]);

  return (
      // <ThemeProvider theme={theme}>
      //   <CssBaseline />
      <>
        <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn = {setIsLoggedIn} />
        <Component {...pageProps} />
      </>

      // </ThemeProvider>
  );
}

export default MyApp;
