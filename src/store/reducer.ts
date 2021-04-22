import { PublicKey } from '@solana/web3.js';

export type Action = {
  type: ActionType;
  item: any;
};

export enum ActionType {
  CommonTriggerShutdown,
  CommonDidShutdown,
  CommonWalletDidConnect,
  CommonWalletDidDisconnect,
  CommonWalletSetProvider,
	CommonSetNetwork,
}

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  let newState = {
    common: { ...state.common },
  };
  switch (action.type) {
    case ActionType.CommonWalletSetProvider:
      newState.common.walletProvider = action.item.walletProvider;
      return newState;
    case ActionType.CommonWalletDidConnect:
      newState.common.isWalletConnected = true;
      return newState;
    case ActionType.CommonWalletDidDisconnect:
      newState.common.isWalletConnected = false;
      return newState;
    case ActionType.CommonSetNetwork:
      if (newState.common.network.label !== action.item.network.label) {
        newState.common.network = action.item.network;
      }
      return newState;
		default:
			return newState;
	}
}

export type State = {
  common: CommonState;
};

export type CommonState = {
  walletProvider?: string;
  isWalletConnected: boolean;
	network: Network;
};

export const networks: Networks = {
  mainnet: {
    // Cluster.
    label: 'Mainnet Beta',
    url: 'https://solana-api.projectserum.com',
    //url: 'https://api.mainnet-beta.solana.com',
    explorerClusterSuffix: '',
    multisigProgramId: new PublicKey(
      '3S6ALMCGVib4X3vVR3CLpm2K6Ng5qbWFYMTo5jfxWcEq',
    ),
  },
  devnet: {
    // Cluster.
    label: 'Devnet',
    url: 'https://devnet.solana.com',
    explorerClusterSuffix: 'devnet',
    multisigProgramId: new PublicKey(
      '3S6ALMCGVib4X3vVR3CLpm2K6Ng5qbWFYMTo5jfxWcEq',
    ),
  },

  // Fill in with your local cluster addresses.
  localhost: {
    // Cluster.
    label: 'Localhost',
    url: 'http://localhost:8899',
    explorerClusterSuffix: 'localhost',
    multisigProgramId: new PublicKey(
      '9z7Pq56To96qbVLzuBcf47Lc7u8uUWZh6k5rhcaTsDjz',
    ),
  },
};


export const initialState: State = {
  common: {
    isWalletConnected: false,
    walletProvider: 'https://www.sollet.io',
		network: networks.localhost,
  },
};

type Networks = { [label: string]: Network };

export type Network = {
  // Cluster.
  label: string;
  url: string;
  explorerClusterSuffix: string;
  multisigProgramId: PublicKey;
};
