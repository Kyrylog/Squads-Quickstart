
<p align="center">
  <img src="https://solana.com/favicon-32x32.png" width="200" alt="Solana Logo">
</p>

<h1 align="center">Solana Multisig Squads Protocol TypeScript</h1>

<p align="center">
   <img alt="License" src="https://img.shields.io/badge/license-Apache%202.0-blue.svg">
  <img alt="Build Status" src="https://img.shields.io/badge/build-passing-teal.svg">
</p>

## Table of Contents

- [Overview](#overview)
- [Framework](#framework)
- [Deployment](#deployment)
- [Configuration](#configuration)

## Overview

It is a comprehensive TypeScript library designed for building and interacting with multi-signature wallets on the Solana blockchain. With a focus on security and scalability, this library empowers developers to create robust decentralized applications (dApps) by providing intuitive APIs for managing multi-signature transactions, enabling seamless integration of multi-party authorization mechanisms. Leveraging TypeScript's strong typing capabilities, Solana Multisig Squads TypeScript ensures code reliability and enhances developer productivity. By abstracting complex blockchain interactions, it simplifies the process of creating and managing multi-signature wallets, fostering the development of sophisticated decentralized finance (DeFi) applications and enhancing the Solana ecosystem's interoperability and usability.

**Key Features:**
- Squads SDK: Squads has 2 different SDKs, one for Typescript and one for Rust.The Squads V4 Typescript SDK is named @sqds/multisig 
- Solana SDKs: Solana offers software development kits (SDKs) for different programming languages, such as Rust, JavaScript, and TypeScript. These SDKs provide libraries, tools, and documentation to simplify development and interaction with the Solana blockchain.
- Developer Tools: The Solana framework includes a suite of developer tools, including Solana CLI (Command Line Interface), Solana Explorer (blockchain explorer), and Solana Dashboard (web-based interface), which streamline the development, deployment, and monitoring of Solana-based applications.
- Secure Multi-Signature Transactions: Facilitates the creation and execution of multi-signature transactions, ensuring robust security through distributed authorization mechanisms.
- Comprehensive TypeScript Support: Harnesses the power of TypeScript for enhanced code quality, providing type safety and improved developer experience.
- Intuitive API: Offers a user-friendly interface and intuitive API methods for interacting with multi-signature wallets, simplifying integration into decentralized applications.
- Scalability and Performance: Leverages Solana's high throughput and low latency architecture, ensuring scalability and optimal performance even in high-demand environments.

## Framework

The Solana Multisig Squads protocol, implemented in TypeScript, presents a sophisticated framework for decentralized multi-signature wallet management on the Solana blockchain. Engineered with a focus on security and scalability, this protocol streamlines the creation and execution of multi-party transactions through intuitive APIs and customizable authorization policies. Leveraging TypeScript's robust typing system, developers benefit from enhanced code quality and reliability, ensuring seamless integration and interoperability within the Solana ecosystem. With a comprehensive suite of features and active community support, Solana Multisig Squads protocol TypeScript implementation empowers developers to build resilient decentralized applications, foster innovative use cases, and contribute to the evolution of decentralized finance (DeFi) and beyond on the Solana blockchain.  

## Deployment

Deploying a Solana program using the command-line interface (CLI) enables developers to place on-chain programs, akin to smart contracts in other contexts, utilizing Solana's toolset.

For an understanding of developing and running programs on Solana, begin with an introduction to Solana programs, then delve into the intricacies of on-chain program development.

To initiate program deployment, utilize Solana tools to engage with the on-chain loader to:

- Establish a program account.
- Transfer the program's shared object (the program binary .so) to the data buffer of the program account.
- (Optional) Validate the uploaded program.
- Conclude the program deployment by designating the program account as executable.
- Upon deployment, any individual can execute the program by transmitting transactions referencing it to the cluster.

## Configuration

### Prerequisites

- TypeScript >= 7.4
- npm installed
- dependencies installed:
    - @solana/web3.js;
    - @sqds/multisig;
    - @solana/wallet-adapter-wallets;
    - @types/chai;
    - @types/mocha

### Clone the Repository

```bash
git clone https://github.com/student-ukma-edu/multisig-typescript.git
cd multisig-typescript
npm install -s

