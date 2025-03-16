const xrpl = require('xrpl');
const fs = require('fs');

async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233'); // XRPL Testnet
  await client.connect();

  // Create a new wallet (new account)
  const newWallet = (await client.fundWallet()).wallet;
  console.log(`New account address: ${newWallet.address}`);
  console.log(`New account private key: ${newWallet.seed}`);

  const keyData = {
    user: {
      address: newWallet.address,
      publicKey: newWallet.publicKey,
      privateKey: newWallet.privateKey,
      seed: newWallet.seed
    }
  };

  fs.writeFileSync('key_airdrop.json', JSON.stringify(keyData, null, 2));
  console.log('Account information saved to key_airdrop.json');

  const trustSetTx = {
    TransactionType: "TrustSet",
    Account: newWallet.address,
    LimitAmount: {
      currency: "XYD",
      issuer: "rGsXikYmTsrh2Q5B1UXfQVzsGFPXewt5WN",
      value: "100000000" // Trust limit, adjust as needed
    }
  };

  // Sign and submit the TrustSet transaction
  const prepared = await client.autofill(trustSetTx);
  const signed = newWallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  console.log(`Trustline creation result: ${result.result.meta.TransactionResult}`);

  await client.disconnect();
}

main().catch(console.error);