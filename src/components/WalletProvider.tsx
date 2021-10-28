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
import { Program, Provider, Wallet } from "@project-serum/anchor";
import { State as StoreState } from "../store/reducer";
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import MultisigIdl from "../idl";

export function useProgram(): ProgramContextValue {
  const w = useContext(ProgramContext);
  if (!w) {
    throw new Error("Missing wallet context");
  }
  // @ts-ignore
  return w;
}

const ProgramContext = React.createContext<null | ProgramContextValue>(null);

type ProgramContextValue = {
  multisigClient: Program | null;
};

export default function ProgramProvider(
  props: PropsWithChildren<ReactNode>
): ReactElement {
  const { network } = useSelector((state: StoreState) => {
    return {
      network: state.common.network,
    };
  });
  let wallet = useAnchorWallet();

  const { multisigClient } = useMemo(() => {
    if (!wallet) {
      return {multisigClient: null}
    }

    const opts: ConfirmOptions = {
      preflightCommitment: "recent",
      commitment: "recent",
    };
    const connection = new Connection(network.url, opts.preflightCommitment);
    const provider = new Provider(connection, wallet, opts);

    const multisigClient = new Program(
      MultisigIdl,
      network.multisigProgramId,
      provider
    );

    return {
      multisigClient,
    };
  }, [network]);

  return (
    <ProgramContext.Provider value={{ multisigClient }}>
      {props.children}
    </ProgramContext.Provider>
  );
}
