import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useMemo,
  useContext,
} from "react";
import { useSelector } from "react-redux";
import { Connection, ConfirmOptions } from "@solana/web3.js";
// @ts-ignore
import Wallet from "@project-serum/sol-wallet-adapter";
import { Provider } from "@project-serum/common";
import { Program } from "@project-serum/anchor";
import { State as StoreState } from "../store/reducer";
import MultisigIdl from "../idl";

export function useWallet(): WalletContextValues {
  const w = useContext(WalletContext);
  if (!w) {
    throw new Error("Missing wallet context");
  }
  // @ts-ignore
  return w;
}

const WalletContext = React.createContext<null | WalletContextValues>(null);

type WalletContextValues = {
  wallet: Wallet;
  multisigClient: Program;
};

export default function WalletProvider(
  props: PropsWithChildren<ReactNode>
): ReactElement {
  const { walletProvider, network } = useSelector((state: StoreState) => {
    return {
      walletProvider: state.common.walletProvider,
      network: state.common.network,
    };
  });

  const { wallet, multisigClient } = useMemo(() => {
    const opts: ConfirmOptions = {
      preflightCommitment: "recent",
      commitment: "recent",
    };
    const connection = new Connection(network.url, opts.preflightCommitment);
    const wallet = new Wallet(walletProvider, network.url);
    const provider = new Provider(connection, wallet, opts);

    const multisigClient = new Program(
      MultisigIdl,
      network.multisigProgramId,
      provider
    );

    return {
      wallet,
      multisigClient,
    };
  }, [walletProvider, network]);

  return (
    <WalletContext.Provider value={{ wallet, multisigClient }}>
      {props.children}
    </WalletContext.Provider>
  );
}
