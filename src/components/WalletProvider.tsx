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
import { Program, Provider, web3 } from "@project-serum/anchor";
import { State as StoreState } from "../store/reducer";
import MultisigIdl from "../idl";
import uxdIdl from "../idl/controllerUXD";

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
  idoClient: Program
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

  const { wallet, multisigClient, idoClient } = useMemo(() => {
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

    const UXDIDOProgramAdress = new web3.PublicKey("UXDJHLPFr8qjLqZs8ejW24zFTq174g1wQHQ4LFhTXxz");

    const idoClient = new Program(
      uxdIdl,
      UXDIDOProgramAdress,
      provider
    )

    return {
      wallet,
      multisigClient,
      idoClient
    };
  }, [walletProvider, network]);

  return (
    <WalletContext.Provider value={{ wallet, multisigClient, idoClient }}>
      {props.children}
    </WalletContext.Provider>
  );
}
