import { Route, Routes, Navigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import WalletConfig from '@components/WalletConfig';
import { Web3Provider } from 'context/web3Context';
import useAppContext from 'context/AppContext';
import Header from 'pages/Header';
import Footer from 'pages/Footer';
import Bonding from 'pages/Bondig';
import Staking from 'pages/Staking';
import Referral from 'pages/Referral';
import Admin from 'pages/Admin';
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
              <Header />
              <Routes>
                <Route path="/" element={<Bonding />} />
                <Route path="/bonding" element={<Bonding />} />
                <Route path="/staking" element={<Staking />} />
                <Route path="/referral" element={<Referral />} />
                <Route path="/sam_admin" element={<Admin />} />
              </Routes>
              <Footer />
            </Web3Provider>
          </div>
        </ThemeProvider>
      </WalletConfig>
    </div >
  );
}

export default App;
