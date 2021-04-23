import React from "react";
import { Provider } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { HashRouter, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";
import { PublicKey } from "@solana/web3.js";
import { store } from "./store";
import WalletProvider from "./components/WalletProvider";
import Layout from "./components/Layout";
import Multisig from "./components/Multisig";
import { networks } from "./store/reducer";

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
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={5} autoHideDuration={8000}>
          <WalletProvider>
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
