import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@material-ui/core/Menu";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import SearchIcon from "@material-ui/icons/Search";
import { PublicKey } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import DisconnectIcon from '@material-ui/icons/LinkOff';
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-material-ui";
import { ENDPOINTS, useConnectionConfig } from "../connection";

export default function Header() {
  const wallet  = useAnchorWallet();
  const history = useHistory();
  const [multisigAddress, setMultisigAddress] = useState("");
  const disabled = !isValidPubkey(multisigAddress);
  const searchFn = () => {
    history.push(`/${multisigAddress}`);
  };
  return (
    <AppBar
      position="static"
      style={{
        background: "#ffffff",
        color: "#272727",
        boxShadow: "none",
        borderBottom: "solid 1pt #ccc",
      }}
    >
      <Toolbar>
        <div
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", flex: 1 }}>
            <BarButton label="Multisig" hrefClient="/" />
            <div
              style={{
                marginLeft: "16px",
                marginRight: "16px",
                borderRadius: "25px",
                display: "flex",
                flex: 1,
                backgroundColor: "rgb(245 245 245)",
              }}
            >
              <input
                style={{
                  flex: 1,
                  background: "none",
                  padding: "16px",
                  border: "none",
                  outlineWidth: 0,
                  color: "inherit",
                }}
                placeholder="Search a multisig address..."
                value={multisigAddress}
                onChange={(e) => setMultisigAddress(e.target.value as string)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    searchFn();
                  }
                }}
              />
              <IconButton disabled={disabled} onClick={searchFn}>
                <SearchIcon />
              </IconButton>
            </div>
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            <NetworkSelector />
            <WalletMultiButton />
            {wallet && <WalletDisconnectButton startIcon={<DisconnectIcon />} style={{ marginLeft: 8 }} />}
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}

function SerumLogoButton() {
  const history = useHistory();
  return (
    <div style={{ display: "flex" }} onClick={() => history.push("/")}>
      <Button color="inherit">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              display: "block",
              height: "35px",
            }}
            alt="Logo"
            src="http://dex.projectserum.com/static/media/logo.49174c73.svg"
          />
        </div>
      </Button>
    </div>
  );
}

type BarButtonProps = {
  label: string;
  hrefClient?: string;
  href?: string;
};

function BarButton(props: BarButtonProps) {
  const history = useHistory();
  const { label, href, hrefClient } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onClick={() => hrefClient && history.push(hrefClient)}
    >
      <Link
        style={{ color: "inherit", textDecoration: "none" }}
        href={href}
        target="_blank"
      >
        <Button color="inherit">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography style={{ fontSize: "15px" }}>{label}</Typography>
          </div>
        </Button>
      </Link>
    </div>
  );
}

function NetworkSelector() {
  const [anchorEl, setAnchorEl] = useState(null);
  const {env, setEndpoint} = useConnectionConfig();

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        marginRight: "10px",
        fontSize: "15px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Button
        color="inherit"
        onClick={(e) =>
          setAnchorEl(
            // @ts-ignore
            e.currentTarget
          )
        }
      >
        <BubbleChartIcon />
        <Typography style={{ marginLeft: "5px", fontSize: "15px" }}>
          {env.toString()}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{
          marginLeft: "12px",
          color: "white",
        }}
      >
        {ENDPOINTS.map(endpoint => {
          return (
            <MenuItem
            key={endpoint.name.toString()}
            onClick={() => {
              handleClose();
              setEndpoint(endpoint.endpoint);
            }}
          >
            <Typography>{endpoint.name}</Typography>
          </MenuItem>
          )
        })}
      </Menu>
    </div>
  );
}

function isValidPubkey(addr: string): boolean {
  try {
    new PublicKey(addr);
    return true;
  } catch (_) {
    return false;
  }
}
