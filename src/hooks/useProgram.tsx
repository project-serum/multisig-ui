import { Program, Provider, Wallet } from "@project-serum/anchor";
import { ConfirmOptions, Keypair } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import MultisigIdl from "../idl";
import { useConnection } from "../connection";

export function useProgram(): Program {
  const wallet = useAnchorWallet();
  const connection = useConnection();

  return useMemo(() => {
    const opts: ConfirmOptions = {
      preflightCommitment: "recent",
      commitment: "recent",
    };
    let provider = new Provider(connection, wallet ?? new Wallet(Keypair.generate()), opts);

    return new Program(MultisigIdl, "msigmtwzgXJHj2ext4XJjCDmpbcMuufFb5cHuwg6Xdt", provider);
  }, [wallet, connection]);
}
