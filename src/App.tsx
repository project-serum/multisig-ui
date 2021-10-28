import React, { useCallback, useMemo } from "react";
import { Provider } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { HashRouter, Route } from "react-router-dom";
import { SnackbarProvider, useSnackbar } from "notistack";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";
import { PublicKey } from "@solana/web3.js";
import { store } from "./store";
import Layout from "./components/Layout";
import Multisig from "./components/Multisig";
import { networks } from "./store/reducer";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import { WalletProvider } from "@solana/wallet-adapter-react";
import {
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolongWallet,
  getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import { WalletError } from "@solana/wallet-adapter-base";

function App() {
  const theme = createMuiTheme({
    palette: {
      background: {
        default: "rgb(255,255,255)",
      },
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
    },
    overrides: {},
  });
  const wallets = useMemo(
    () => [
        getPhantomWallet(),
        getSolflareWallet(),
        getTorusWallet({
            options: {
                clientId: 'BOM5Cl7PXgE9Ylq1Z1tqzhpydY0RVr8k90QQ85N7AKI5QGSrr9iDC-3rvmy0K_hF0JfpLMiXoDhta68JwcxS1LQ',
            },
        }),
        getLedgerWallet(),
        getSolongWallet(),
        getMathWallet(),
        getSolletWallet(),
    ],
    []
  );

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={5} autoHideDuration={8000}>
          <WalletProvider wallets={wallets} autoConnect>
              <WalletDialogProvider>
                <HashRouter basename={"/"}>
                      <Layout>
                        <Route exact path="/" component={MultisigPage} />
                        <Route
                          exact
                          path="/:address"
                          component={MultisigInstancePage}
                        />
                      </Layout>
                </HashRouter>
              </WalletDialogProvider>
          </WalletProvider>
        </SnackbarProvider>
      </MuiThemeProvider>
    </Provider>
  );
}

function MultisigPage() {
  const { hash } = window.location;
  if (hash) {
    window.location.href = `/#/${networks.mainnet.multisigUpgradeAuthority!.toString()}`;
  }
  const multisig = networks.mainnet.multisigUpgradeAuthority;
  return <Multisig multisig={multisig} />;
}

export function MultisigInstancePage() {
  const history = useHistory();
  const location = useLocation();
  const path = location.pathname.split("/");
  if (path.length !== 2) {
    history.push(`/multisig`);
    return <></>;
  } else {
    const multisig = new PublicKey(path[1]);
    return <Multisig multisig={multisig} />;
  }
}

export default App;
