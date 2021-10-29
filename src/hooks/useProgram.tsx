import { Program, Provider } from "@project-serum/anchor";
import { ConfirmOptions } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import MultisigIdl from "../idl";

export function useProgram(): Program | null {
  const wallet = useAnchorWallet();
  const connection = useConnection();

  return useMemo(() => {
    if (!wallet) {
      return null;
    }
    const opts: ConfirmOptions = {
      preflightCommitment: "recent",
      commitment: "recent",
    };
    const provider = new Provider(connection.connection, wallet, opts);
    return new Program(MultisigIdl, "msigmtwzgXJHj2ext4XJjCDmpbcMuufFb5cHuwg6Xdt", provider);
  }, [wallet, connection]);
}
