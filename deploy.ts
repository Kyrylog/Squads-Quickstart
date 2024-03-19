//The Squads V4 program is deployed on the Solana mainnet-beta cluster
import { Connection, PublicKey } from '@solana/web3.js'; // Import Solana-specific libraries
import { MultiSig } from '@sqds/multisig'; // Import the MultiSig contract from @sqds/multisig

const ownersAddresses: string[] = ["address1", "address2", "address3"]; // Array of owner addresses

async function main() {
  const connection = new Connection('https://solana-mainnet-skip-blocks.com'); // Initialize connection to Solana network

  // Load the program ID of the deployed Squads V4 program
  const programId = new PublicKey('your-program-id-here');

  // Initialize the MultiSig contract instance
  const multisig = new MultiSig(connection, programId);

  // Deploy the MultiSig contract with the provided owner addresses and threshold
  const multisigAddress = await multisig.deploy(ownersAddresses, 2);

  console.log(`Contract Deployed at: ${multisigAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});