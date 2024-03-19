"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var multisig = require("@sqds/multisig");
var web3_js_1 = require("@solana/web3.js");
var _a = multisig.types, Permission = _a.Permission, Permissions = _a.Permissions;
var connection = new web3_js_1.Connection("http://localhost:8899", "confirmed");
/*Import Signer and define creator:
npm install @solana/wallet-adapter */
// Assuming you have a wallet signer instance available
var wallet =  /* Obtain wallet signer instance */;
var creator = {
    publicKey: wallet.publicKey,
    secretKey: null // You might not have access to the secret key of the creator 
};
// Define a function to create a Signer
function createSigner(publicKey, secretKey) {
    return {
        publicKey: publicKey,
        secretKey: secretKey
    };
}
// Example usage
var createKey =  /* get your createKey from somewhere */;
var publicKey =  /* get your publicKey from somewhere */;
var secretKey =  /* get your secretKey from somewhere */;
try {
    var signer = createSigner(publicKey, secretKey);
    createKey(signer); // This line might throw the TS2739 error
}
catch (error) {
    console.error("Error occurred while creating signer:", error.message);
}
/* multisigPda is defined correctly in a way of declaration before usage*/
var getMultisigPda = ; /* variable or constant */
// Initialize multisigPda
var multisigPda = initializeMultisigPda(); // Call your initialization function here
// Example initialization function
function initializeMultisigPda() {
    // Implement your initialization logic here 
    // For example: 
    var publicKey = new web3_js_1.PublicKey('your-public-key-string-here');
    return publicKey;
}
//create a multisig
describe("Interacting with the Squads V4 SDK", function () {
    var creator = web3_js_1.Keypair.generate();
    var secondMember = web3_js_1.Keypair.generate();
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        var airdropSignature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.requestAirdrop(creator.publicKey, 1 * web3_js_1.LAMPORTS_PER_SOL)];
                case 1:
                    airdropSignature = _a.sent();
                    return [4 /*yield*/, connection.confirmTransaction(airdropSignature)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var createKey = web3_js_1.Keypair.generate().publicKey;
    // Derive the multisig account PDA
    var multisigPda = multisig.getMultisigPda({
        createKey: createKey,
    })[0];
    it("Create a new multisig", function () { return __awaiter(void 0, void 0, void 0, function () {
        var signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, multisig.rpc.multisigCreate({
                        connection: connection,
                        // One time random Key
                        createKey: createKey,
                        // The creator & fee payer
                        creator: creator,
                        multisigPda: multisigPda,
                        configAuthority: null,
                        timeLock: 0,
                        members: [{
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
                    })];
                case 1:
                    signature = _a.sent();
                    console.log("Multisig created: ", signature);
                    return [2 /*return*/];
            }
        });
    }); });
});
//create transaction proposal
it("Create a transaction proposal", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, vaultPda, vaultBump, instruction, transferMessage, _b, transactionIndex, signature1, signature2;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = multisig.getVaultPda({
                    multisigPda: multisigPda,
                    index: 0,
                }), vaultPda = _a[0], vaultBump = _a[1];
                instruction = SystemProgram.transfer({
                    // The transfer is being signed from the Squads Vault, that is why we use the VaultPda
                    fromPubkey: vaultPda,
                    toPubkey: creator.publicKey,
                    lamports: 1 * web3_js_1.LAMPORTS_PER_SOL
                });
                _b = TransactionMessage.bind;
                _c = {
                    payerKey: vaultPda
                };
                return [4 /*yield*/, connection.getLatestBlockhash()];
            case 1:
                transferMessage = new (_b.apply(TransactionMessage, [void 0, (_c.recentBlockhash = (_d.sent()).blockhash,
                        _c.instructions = [instruction],
                        _c)]))();
                transactionIndex = 1n;
                return [4 /*yield*/, multisig.rpc.vaultTransactionCreate({
                        connection: connection,
                        feePayer: creator,
                        multisigPda: multisigPda,
                        transactionIndex: transactionIndex,
                        creator: creator.publicKey,
                        vaultIndex: 1,
                        ephemeralSigners: 0,
                        transactionMessage: transferMessage,
                        memo: "Transfer 0.1 SOL to creator",
                    })];
            case 2:
                signature1 = _d.sent();
                console.log("Transaction created: ", signature1);
                return [4 /*yield*/, multisig.rpc.proposalCreate({
                        connection: connection,
                        feePayer: members.voter,
                        multisigPda: multisigPda,
                        transactionIndex: transactionIndex,
                        creator: feePayer,
                    })];
            case 3:
                signature2 = _d.sent();
                console.log("Transaction proposal created: ", signature2);
                return [2 /*return*/];
        }
    });
}); });
//vote on the transaction proposal
it("Vote on the created proposal", function () { return __awaiter(void 0, void 0, void 0, function () {
    var transactionIndex;
    return __generator(this, function (_a) {
        transactionIndex = 1n;
        multisig.rpc.proposalApprove({
            connection: connection,
            feePayer: creator,
            multisigPda: multisigPda,
            transactionIndex: transactionIndex,
            member: creator.publicKey,
        });
        multisig.rpc.proposalApprove({
            connection: connection,
            feePayer: creator,
            multisigPda: multisigPda,
            transactionIndex: transactionIndex,
            member: secondMember.publicKey,
            signers: [creator, secondMember],
        });
        return [2 /*return*/];
    });
}); });
//execute transaction
it("Execute the proposal", function () { return __awaiter(void 0, void 0, void 0, function () {
    var transactionIndex, proposalPda, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                transactionIndex = 1n;
                proposalPda = multisig.getProposalPda({
                    multisigPda: multisigPda,
                    transactionIndex: transactionIndex,
                })[0];
                return [4 /*yield*/, multisig.rpc.vaultTransactionExecute({
                        connection: connection,
                        feePayer: creator,
                        multisigPda: multisigPda,
                        transactionIndex: transactionIndex,
                        member: creator.publicKey,
                        signers: [creator],
                    })];
            case 1:
                signature = _a.sent();
                console.log("Transaction executed: ", signature);
                return [2 /*return*/];
        }
    });
}); });
