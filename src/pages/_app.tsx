import { AppProps } from 'next/app';
import { SocketProvider } from '../context/socketContext';
import NoSSRWrapper from '../components/noSSR';


const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <NoSSRWrapper>
            <SocketProvider>
                <Component {...pageProps} />
            </SocketProvider>
        </NoSSRWrapper>
    );
}

export default MyApp;