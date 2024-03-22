import * as multisig from "@sqds/multisig";
import {
  Connection,
  SystemProgram,
  Keypair,
  TransactionMessage,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const { Permission, Permissions } = multisig.types;
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

describe("Interacting with the Squads V4 SDK", () => {
  // add here secret key for account
  const creator = Keypair.fromSecretKey(new Uint8Array([]));
  const secondMember = Keypair.generate();
  const createKey = Keypair.generate();

  before(async () => {
    const balance = await connection.getBalance(creator.publicKey);

    console.log(balance);
  });

  // Derive the multisig account PDA
  const [multisigPda] = multisig.getMultisigPda({
    createKey: createKey.publicKey,
  });

  it("Create a new multisig", async () => {
    const signature = await multisig.rpc.multisigCreate({
      connection,
      // One time random Key
      createKey,
      // The creator & fee payer
      creator,
      multisigPda,
      configAuthority: null,
      timeLock: 0,
      members: [
        {
          key: creator.publicKey,
          permissions: Permissions.all(),
        },
        {
          key: secondMember.publicKey,
          // This permission means that the user will only be able to vote on transactions
          permissions: Permissions.fromPermissions([Permission.Vote]),
        },
      ],
      // This means that there needs to be 2 votes for a transaction proposal to be approved
      threshold: 2,
      sendOptions: { maxRetries: 5, skipPreflight: true },
    });
    console.log("Multisig created: ", signature);
  });

  it("Create a transaction proposal", async () => {
    const [vaultPda, vaultBump] = multisig.getVaultPda({
      multisigPda,
      index: 0,
    });
    const instruction = SystemProgram.transfer({
      // The transfer is being signed from the Squads Vault, that is why we use the VaultPda
      fromPubkey: vaultPda,
      toPubkey: creator.publicKey,
      lamports: 1 * LAMPORTS_PER_SOL,
    });
    // This message contains the instructions that the transaction is going to execute
    const transferMessage = new TransactionMessage({
      payerKey: vaultPda,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
      instructions: [instruction],
    });
    // This is the first transaction in the multisig
    const transactionIndex = BigInt(1);
    const signature1 = await multisig.rpc.vaultTransactionCreate({
      connection,
      feePayer: creator,
      multisigPda,
      transactionIndex,
      creator: creator.publicKey,
      vaultIndex: 1,
      ephemeralSigners: 0,
      transactionMessage: transferMessage,
      memo: "Transfer 0.1 SOL to creator",
      sendOptions: { maxRetries: 5, skipPreflight: true },
    });

    console.log("Transaction created: ", signature1);

    const signature2 = await multisig.rpc.proposalCreate({
      connection,
      feePayer: creator,
      multisigPda,
      transactionIndex,
      creator,
      sendOptions: { maxRetries: 5, skipPreflight: true },
    });

    console.log("Transaction proposal created: ", signature2);
  });

  it("Vote on the created proposal", async () => {
    const transactionIndex = BigInt(1);
    const proposalApprove = await multisig.rpc.proposalApprove({
      connection,
      feePayer: creator,
      multisigPda,
      transactionIndex,
      member: creator,
      sendOptions: { maxRetries: 5, skipPreflight: true },
    });

    console.log("proposalApprove: ", proposalApprove);

    const proposalApprove2 = await multisig.rpc.proposalApprove({
      connection,
      feePayer: creator,
      multisigPda,
      transactionIndex,
      member: secondMember,
      sendOptions: { maxRetries: 5, skipPreflight: true },
    });

    console.log("proposalApprove2: ", proposalApprove2);
  });

  it("Execute the proposal", async () => {
    const transactionIndex = BigInt(1);
    const [proposalPda] = multisig.getProposalPda({
      multisigPda,
      transactionIndex,
    });
    const [vaultPda, vaultBump] = multisig.getVaultPda({
      multisigPda,
      index: 0,
    });

    const signature = await multisig.rpc.vaultTransactionExecute({
      connection,
      feePayer: creator,
      multisigPda,
      transactionIndex,
      member: creator.publicKey,
      signers: [creator],
      sendOptions: { maxRetries: 5, skipPreflight: true },
    });
    console.log("Transaction executed: ", signature);
  });
});
