import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ScrollToTop from '@components/ScrollToTop';
import WalletConfig from '@components/WalletConfig';
import { Web3Provider } from 'context/web3Context';
import useAppContext from 'context/AppContext';
import Header from 'pages/Header';
import Footer from 'pages/Footer';
import Bonding from 'pages/Bondig';
import Staking from 'pages/Staking';
import Referral from 'pages/Referral';
import Admin from 'pages/Admin';
import Clock from "@components/Clock";
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const { isDark } = useAppContext();

  darkTheme.palette.mode = isDark ? 'dark' : 'light'

  return (
    <div className="App bg-no-repeat bg-body-main bg-fixed bg-cover bg-center">
      <WalletConfig>
        <ThemeProvider theme={darkTheme}>
          <div className="flex flex-col justify-between min-h-screen px-3 sm:px-0">
            <Web3Provider>
              <Routes>
                <Route path="/" element={<Bonding />} />
              </Routes>
            </Web3Provider>
          </div>
        </ThemeProvider>
      </WalletConfig>
    </div >
  );
}

export default App;
