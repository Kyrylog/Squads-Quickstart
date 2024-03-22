import * as multisig from "@sqds/multisig";
import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, TransactionMessage } from "@solana/web3.js";

const { Permission, Permissions } = multisig.types;
const { Multisig } = multisig.accounts;

const connection = new Connection("http://localhost:8899", "confirmed");

describe("Interacting with the Squads V4 SDK", () => {
    const creatorKeyPair = Keypair.generate();
    const secondMemberKeyPair = Keypair.generate()

    before(async () => {
        const airdropSignature = await connection.requestAirdrop(
            creatorKeyPair.publicKey,
            1 * LAMPORTS_PER_SOL
        );

        console.log("airdropSignature request", airdropSignature);
        await connection.confirmTransaction(airdropSignature);

        (await connection.getAccountInfo(creatorKeyPair.publicKey)).executable ?
            console.log("Account is executable, tests have to run further (In order to avoid 'Attempt to debit an account but found no record of a prior credit')") :
            console.log("Account is NOT executable, further tests won't be satisfied")
    });

    const { publicKey, secretKey } = Keypair.generate()

    // Derive the multisig account PDA
    const [multisigPda] = multisig.getMultisigPda({
        createKey: creatorKeyPair.publicKey,
    });

    it("Create a new multisig", async () => {
        // Create the multisig
        const signature = await multisig.rpc.multisigCreate({
            connection,
            // One time random Key
            createKey: { publicKey, secretKey },
            // The creator & fee payerKey
            creator: creatorKeyPair,
            multisigPda: multisigPda,
            configAuthority: null,
            timeLock: 0,
            members: [{
                key: creatorKeyPair.publicKey,
                permissions: Permissions.all(),
            },
            {
                key: secondMemberKeyPair.publicKey,
                // This permission means that the user will only be able to vote on transactions
                permissions: Permissions.fromPermissions([Permission.Vote]),
            },
            ],
            // This means that there needs to be 2 votes for a transaction proposal to be approved
            threshold: 2,
        });
        console.log("Multisig created: ", signature);
    });

    it("Create a transaction proposal", async () => {
        const multisigAccount = await Multisig.fromAccountAddress(
            connection,
            multisigPda
        );

        const [vaultPda, vaultBump] = multisig.getVaultPda({
            multisigPda,
            index: 0,
        });

        const instruction = SystemProgram.transfer({
            // The transfer is being signed from the Squads Vault, that is why we use the VaultPda
            fromPubkey: vaultPda,
            toPubkey: creatorKeyPair.publicKey,
            lamports: 1 * LAMPORTS_PER_SOL
        });
        // This message contains the instructions that the transaction is going to execute
        const transferMessage = new TransactionMessage({
            payerKey: vaultPda,
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions: [instruction],
        });
        // This is the first transaction in the multisig
        const transactionIndex = 1n;
        const signature1 = await multisig.rpc.vaultTransactionCreate({
            connection,
            feePayer: creatorKeyPair,
            multisigPda,
            transactionIndex,
            creator: creatorKeyPair.publicKey,
            vaultIndex: 1,
            ephemeralSigners: 0,
            transactionMessage: transferMessage,
            memo: "Transfer 0.1 SOL to creator",
        });

        console.log("Transaction created: ", signature1);

        const signature2 = await multisig.rpc.proposalCreate({
            connection,
            feePayer: creatorKeyPair,
            multisigPda,
            transactionIndex,
            creator: creatorKeyPair,
        });

        console.log("Transaction proposal created: ", signature2);
    });


    it("Vote on the created proposal", async () => {
        const transactionIndex = 1n;
        multisig.rpc.proposalApprove({
            connection,
            feePayer: creatorKeyPair,
            multisigPda,
            transactionIndex,
            member: creatorKeyPair,
        });

        multisig.rpc.proposalApprove({
            connection,
            feePayer: creatorKeyPair,
            multisigPda,
            transactionIndex,
            member: secondMemberKeyPair,
        });
    });


    it("Execute the proposal", async () => {
        const transactionIndex = 1n;
        const [proposalPda] = multisig.getProposalPda({
            multisigPda,
            transactionIndex,
        });
        const signature = await multisig.rpc.vaultTransactionExecute({
            connection,
            feePayer: creatorKeyPair,
            multisigPda,
            transactionIndex,
            member: creatorKeyPair.publicKey,
            signers: [creatorKeyPair],
        });
        console.log("Transaction executed: ", signature);
    });
});