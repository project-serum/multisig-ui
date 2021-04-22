import React, { useState, useEffect, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Select from '@material-ui/core/Select';
import Menu from '@material-ui/core/Menu';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import SearchIcon from '@material-ui/icons/Search';
import { PublicKey } from '@solana/web3.js';
import {
	networks,
  State as StoreState,
	ActionType,
} from '../store/reducer';
import { useWallet } from './WalletProvider';

export default function Header() {
  const { wallet } = useWallet();
	const history = useHistory();
  const [multisigAddress, setMultisigAddress] = useState('');
  const disabled = !isValidPubkey(multisigAddress);
  const searchFn = () => {
    history.push(`/${multisigAddress}`);
  };
  return (
    <AppBar
      position="static"
      style={{
        background: '#ffffff',
        color: '#272727',
        boxShadow: 'none',
        borderBottom: 'solid 1pt #ccc',
      }}
    >
      <Toolbar>
        <div
          style={{
            display: 'flex',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', flex: 1 }}>
            <SerumLogoButton />
            <BarButton label="Multisig" hrefClient="/" />
            <BarButton label="Trade" href="https://dex.projectserum.com" />
            <BarButton label="Swap" href="https://swap.projectserum.com" />
            <BarButton label="Stake" href="https://stake.projectserum.com" />
            <BarButton label="Lockup" href="https://stake.projectserum.com/#/lockup" />
				<div
					style={{
						marginLeft: '16px',
						marginRight: '16px',
						borderRadius: '25px',
						display: 'flex',
						flex: 1,
						backgroundColor: 'rgb(245 245 245)',
					}}
				>
					<input
						style={{
							flex: 1,
							background: 'none',
							padding: '16px',
							border: 'none',
							outlineWidth: 0,
							color: 'inherit',
						}}
						placeholder="Search for a multisig address"
						value={multisigAddress}
						onChange={e => setMultisigAddress(e.target.value as string)}
						onKeyPress={e => {
							if (e.key === 'Enter') {
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
              display: 'flex',
            }}
          >
            <NetworkSelector />
		        {!wallet.publicKey ? (
							<WalletConnectButton
              style={{
                display: wallet.publicKey ? 'none' : '',
              }}
            />
						) : (
							<UserSelector />
						)}
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}

function SerumLogoButton() {
  const history = useHistory();
  return (
    <div style={{ display: 'flex' }} onClick={() => history.push('/')}>
      <Button color="inherit">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <img
            style={{
              display: 'block',
              height: '35px',
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onClick={() => hrefClient && history.push(hrefClient)}
    >
      <Link
        style={{ color: 'inherit', textDecoration: 'none' }}
        href={href}
        target="_blank"
      >
        <Button color="inherit">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography style={{ fontSize: '15px' }}>{label}</Typography>
          </div>
        </Button>
      </Link>
    </div>
  );
}

function NetworkSelector() {
  const network = useSelector((state: StoreState) => {
    return state.common.network;
  });
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        marginRight: '10px',
        fontSize: '15px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Button
        color="inherit"
        onClick={e =>
          setAnchorEl(
            // @ts-ignore
            e.currentTarget,
          )
        }
      >
        <BubbleChartIcon />
        <Typography style={{ marginLeft: '5px', fontSize: '15px' }}>
          {network.label}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{
          marginLeft: '12px',
          color: 'white',
        }}
      >
        {Object.keys(networks).map((n: string) => (
          <MenuItem
            key={n}
            onClick={() => {
              handleClose();
              dispatch({
                type: ActionType.CommonSetNetwork,
                item: {
                  network: networks[n],
                  networkKey: n,
                },
              });
            }}
          >
            <Typography>{networks[n].label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

function UserSelector() {
  const { wallet } = useWallet();

  return (
    <Select
      displayEmpty
      renderValue={() => {
        return (
          <Typography style={{ overflow: 'hidden' }}>
            {wallet.publicKey.toString()}
          </Typography>
        );
      }}
      style={{
        marginLeft: '12px',
        width: '150px',
      }}
      onChange={e => {
        if (e.target.value === 'disconnect') {
          wallet.disconnect();
        }
      }}
    >
      <MenuItem value="disconnect">
        <IconButton color="inherit">
          <ExitToAppIcon />
          <Typography style={{ marginLeft: '15px' }}>Disconnect</Typography>
        </IconButton>
      </MenuItem>
    </Select>
  );
}

type WalletConnectButtonProps = {
  style?: any;
};

export function WalletConnectButton(
  props: WalletConnectButtonProps,
): ReactElement {
  const { showDisconnect } = useSelector((state: StoreState) => {
    return {
      showDisconnect: state.common.isWalletConnected,
    };
  });
  const dispatch = useDispatch();
  const { wallet, multisigClient } = useWallet();
  const { enqueueSnackbar } = useSnackbar();

  // Wallet connection event listeners.
  useEffect(() => {
    wallet.on('disconnect', () => {
      enqueueSnackbar('Disconnected from wallet', {
        variant: 'info',
        autoHideDuration: 2500,
      });
      dispatch({
        type: ActionType.CommonWalletDidDisconnect,
        item: {},
      });
      dispatch({
        type: ActionType.CommonTriggerShutdown,
        item: {},
      });
    });
    wallet.on('connect', async () => {
      dispatch({
        type: ActionType.CommonWalletDidConnect,
        item: {},
      });
    });
  }, [wallet, dispatch, enqueueSnackbar, multisigClient.provider.connection]);

  return showDisconnect ? (
    <Button
      style={props.style}
      color="inherit"
      onClick={() => wallet.disconnect()}
    >
      <ExitToAppIcon />
      <Typography style={{ marginLeft: '5px', fontSize: '15px' }}>
        Disconnect
      </Typography>
    </Button>
  ) : (
    <Button
      style={props.style}
      color="inherit"
      onClick={() => wallet.connect()}
    >
      <PersonIcon />
      <Typography style={{ marginLeft: '5px', fontSize: '15px' }}>
        Connect wallet
      </Typography>
    </Button>
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
