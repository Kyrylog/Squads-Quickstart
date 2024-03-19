import * as multisig from "@sqds/multisig";
import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, PublicKey } from "@solana/web3.js";
//Import Signer and define creator
import { WalletSigner } from '@solana/wallet-adapter-wallets';

const { Permission, Permissions } = multisig.types;
const connection = new Connection("http://localhost:8899", "confirmed");


/*Import Signer and define creator:
npm install @solana/wallet-adapter */

// Assuming you have a wallet signer instance available
const wallet: WalletSigner = /* Obtain wallet signer instance */;
const creator: Signer = {
    publicKey: wallet.publicKey,
    secretKey: null // You might not have access to the secret key of the creator 
}; 



/*To handle the error TS2739: Type 'PublicKey' is missing the following properties from 
type 'Signer': publicKey, secretKey, the below script has been created to properly handle the type mismatch.*/

// Define your types
interface PublicKey {
    // Define properties of PublicKey
}

interface Signer {
    publicKey: PublicKey;
    secretKey: any; // Adjust this type as necessary
}

// Define a function to create a Signer
function createSigner(publicKey: PublicKey, secretKey: any): Signer {
    return {
        publicKey,
        secretKey
    };
}

// Example usage
const createKey = /* get your createKey from somewhere */;
const publicKey = /* get your publicKey from somewhere */;
const secretKey = /* get your secretKey from somewhere */;

try {
    const signer = createSigner(publicKey, secretKey);
    createKey(signer); // This line might throw the TS2739 error
} catch (error) {
    console.error("Error occurred while creating signer:", error.message);
}

/* multisigPda is defined correctly in a way of declaration before usage*/
const getMultisigPda: PublicKey = /* variable or constant */

// Initialize multisigPda
const multisigPda: PublicKey = initializeMultisigPda(); // Call your initialization function here

// Example initialization function
function initializeMultisigPda(): PublicKey { 
    // Implement your initialization logic here 
    // For example: 
    const publicKey: PublicKey = new PublicKey(
        'your-public-key-string-here'); 
        return publicKey;
    }

//declare SystemProgram
interface SystemProgramType {
    transfer: (params: any) => any; // Adjust the type if you know the specific type of transfer
    // Define other properties or methods of SystemProgram
}

declare const SystemProgram: SystemProgramType;  






//create a multisig
describe("Interacting with the Squads V4 SDK", () => {
    const creator = Keypair.generate();
    const secondMember = Keypair.generate();
    before(async () => {
        const airdropSignature = await connection.requestAirdrop(
            creator.publicKey,
            1 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(airdropSignature);
    });

    const createKey = Keypair.generate().publicKey;

    // Derive the multisig account PDA
    const [multisigPda] = multisig.getMultisigPda({
        createKey,
    });

    it("Create a new multisig", async () => {
        // Create the multisig
        const signature = await multisig.rpc.multisigCreate({
            connection,
            // One time random Key
            createKey,
            // The creator & fee payer
            creator,
            multisigPda,
            configAuthority: null,
            timeLock: 0,
            members: [{
                    key: creator.publicKey,
                    permissions: Permissions.all(),
                },
                {
                    key: secondMember.publicKey,
                    // This permission means that the user will only be able to vote on transactions
                    permissions: 
Permissions.fromPermissions([Permission.Vote]),
                },
            ],
            // This means that there needs to be 2 votes for a transaction proposal to be approved
            threshold: 2,
        });
        console.log("Multisig created: ", signature);
    });
});

//create transaction proposal
it("Create a transaction proposal", async () => {
    const [vaultPda, vaultBump] = multisig.getVaultPda({
        multisigPda,
        index: 0,
    });
    const instruction = SystemProgram.transfer({
    // The transfer is being signed from the Squads Vault, that is why we use the VaultPda
        fromPubkey: vaultPda,
        toPubkey: creator.publicKey,
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
        feePayer: creator,
        multisigPda,
        transactionIndex,
        creator: creator.publicKey,
        vaultIndex: 1,
        ephemeralSigners: 0,
        transactionMessage: transferMessage,
        memo: "Transfer 0.1 SOL to creator",
    });

    console.log("Transaction created: ", signature1);
    
    const signature2 = await multisig.rpc.proposalCreate({
        connection,
        feePayer: members.voter,
        multisigPda,
        transactionIndex,
        creator: feePayer,
    });
    
    console.log("Transaction proposal created: ", signature2);
    
});

//vote on the transaction proposal

 it("Vote on the created proposal", async () => {
     const transactionIndex = 1n;
     multisig.rpc.proposalApprove({
         connection,
         feePayer: creator,
         multisigPda,
         transactionIndex,
         member: creator.publicKey,
     });

     multisig.rpc.proposalApprove({
         connection,
         feePayer: creator,
         multisigPda,
         transactionIndex,
         member: secondMember.publicKey,
         signers: [creator, secondMember],
     });
 });

//execute transaction
it("Execute the proposal", async () => {
    const transactionIndex = 1n;
    const [proposalPda] = multisig.getProposalPda({
        multisigPda,
        transactionIndex,
    });
    const signature = await multisig.rpc.vaultTransactionExecute({
        connection,
        feePayer: creator,
        multisigPda,
        transactionIndex,
        member: creator.publicKey,
        signers: [creator],
    });
    console.log("Transaction executed: ", signature);
});
