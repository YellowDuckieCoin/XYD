const xrpl = require('xrpl');
const fs = require('fs');

async function setDefaultRipple() {
  const keys = JSON.parse(fs.readFileSync('keys.json'));
  const issuer_wallet = xrpl.Wallet.fromSeed(keys.issuer.seed);

  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  console.log('Connected to XRPL Testnet');

  // Set DefaultRipple flag
  const accountSetTx = {
    TransactionType: "AccountSet",
    Account: issuer_wallet.address,
    SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple
  };

  const prepared = await client.autofill(accountSetTx);
  const signed = issuer_wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  if (result.result.meta.TransactionResult === "tesSUCCESS") {
    console.log("✅ DefaultRipple has been successfully enabled for the Issuer account!");
  } else {
    console.error("❌ Failed to set DefaultRipple:", result.result.meta.TransactionResult);
  }

  await client.disconnect();
}

setDefaultRipple().catch(console.error);