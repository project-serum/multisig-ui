// TODO: use the `@solana/spl-token` package instead of utils here.
import * as anchor from '@project-serum/anchor';
import { TokenInstructions } from '@project-serum/serum';

// TODO: remove this constant once @project-serum/serum uses the same version
//       of @solana/web3.js as anchor (or switch packages).
const TOKEN_PROGRAM_ID = TokenInstructions.TOKEN_PROGRAM_ID;

const ASSOC_TOKEN_PROGRAM_ID = new anchor.web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');



export async function createMint(provider: anchor.Provider, authority: anchor.web3.PublicKey) {
    if (authority === undefined) {
        authority = provider.wallet.publicKey;
    }
    const mint = anchor.web3.Keypair.generate();
    console.log(mint.publicKey.toBase58())
    const instructions = await createMintInstructions(provider, authority, mint.publicKey);
    return { mint, instructions};
    // const tx = new anchor.web3.Transaction();
    // tx.add(...instructions);

    // await provider.send(tx, [mint]);

    // return mint.publicKey;
}

async function createMintInstructions(
    provider: anchor.Provider,
    authority: anchor.web3.PublicKey,
    mint: anchor.web3.PublicKey
) {
    console.log("TOKEN_PROGRAM_ID", TOKEN_PROGRAM_ID)
    let instructions = [
        anchor.web3.SystemProgram.createAccount({
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey: mint,
            space: 82,
            lamports: await provider.connection.getMinimumBalanceForRentExemption(82),
            programId: TOKEN_PROGRAM_ID,
        }),
        TokenInstructions.initializeMint({
            mint,
            decimals: 6,
            mintAuthority: authority,
        }),
    ];
    return instructions;
}

export async function createTokenAccount(
    provider: anchor.Provider,
    mint: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey
) {
    const vault = anchor.web3.Keypair.generate();
    console.log(vault.publicKey.toBase58())
    //const tx = new anchor.web3.Transaction();
    const instructions = await createTokenAccountInstrs(provider, vault.publicKey, mint, owner);
    return { account: vault, instructions}
    // await provider.send(tx, [vault]);
    // return vault.publicKey;
}

async function createTokenAccountInstrs(
    provider: anchor.Provider,
    newAccountPubkey: anchor.web3.PublicKey,
    mint: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    lamports?: number
) {
    if (lamports === undefined) {
        lamports = await provider.connection.getMinimumBalanceForRentExemption(165);
    }
    return [
        anchor.web3.SystemProgram.createAccount({
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey,
            space: 165,
            lamports,
            programId: TOKEN_PROGRAM_ID,
        }),
        TokenInstructions.initializeAccount({
            account: newAccountPubkey,
            mint,
            owner,
        }),
    ];
}


// derives the canonical token account address for a given wallet and mint
export function findAssociatedTokenAddress(walletKey: anchor.web3.PublicKey, mintKey: anchor.web3.PublicKey,) {
    if (!walletKey || !mintKey) return;
    return findAddr(
        [walletKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mintKey.toBuffer()],
        ASSOC_TOKEN_PROGRAM_ID
    );
}

// simple shorthand
function findAddr(seeds: (Buffer | Uint8Array)[], programId: anchor.web3.PublicKey) {
    return anchor.utils.publicKey.findProgramAddressSync(seeds, programId)[0];
}