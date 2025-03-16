const xrpl = require('xrpl');
const fs = require('fs');

async function freezeIssuance() {
  const keys = JSON.parse(fs.readFileSync('keys.json'));
  const issuer_wallet = xrpl.Wallet.fromSeed(keys.issuer.seed);

  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  console.log('Connected to XRPL Testnet');

  // Set RegularKey to a black hole address
  const setRegularKeyTx = {
    TransactionType: "SetRegularKey",
    Account: issuer_wallet.address,
    RegularKey: "rrrrrrrrrrrrrrrrrrrrrhoLvTp"
  };

  const preparedSetRegularKey = await client.autofill(setRegularKeyTx);
  const signedSetRegularKey = issuer_wallet.sign(preparedSetRegularKey);
  const resultSetRegularKey = await client.submitAndWait(signedSetRegularKey.tx_blob);

  if (resultSetRegularKey.result.meta.TransactionResult === "tesSUCCESS") {
    console.log('✅ RegularKey has been successfully set to a black hole address');
  } else {
    console.error('❌ Failed to set RegularKey:', resultSetRegularKey.result.meta.TransactionResult);
    await client.disconnect();
    return;
  }

  // Disable Master Key to completely freeze issuance
  const disableMasterKeyTx = {
    TransactionType: "AccountSet",
    Account: issuer_wallet.address,
    SetFlag: xrpl.AccountSetAsfFlags.asfDisableMaster
  };

  const preparedDisableMaster = await client.autofill(disableMasterKeyTx);
  const signedDisableMaster = issuer_wallet.sign(preparedDisableMaster);
  const resultDisableMaster = await client.submitAndWait(signedDisableMaster.tx_blob);

  if (resultDisableMaster.result.meta.TransactionResult === "tesSUCCESS") {
    console.log("✅ Issuance successfully frozen! No more XYD can be issued.");
  } else {
    console.error("❌ Failed to freeze issuance:", resultDisableMaster.result.meta.TransactionResult);
  }

  await client.disconnect();
}

freezeIssuance().catch(console.error);