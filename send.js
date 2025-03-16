const xrpl = require('xrpl');
const fs = require('fs');

async function sendXYD(destinationAddress, amountToSend) {
  // Read keys.json to retrieve keys
  const keys = JSON.parse(fs.readFileSync('keys.json'));
  const user_wallet = xrpl.Wallet.fromSeed(keys.user.seed);
  const issuerAddress = keys.issuer.address;

  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  console.log('Connected to XRPL Testnet');

  // Query user account balance
  const balances = await client.request({
    command: 'account_lines',
    account: user_wallet.address
  });

  const XYD_balance = balances.result.lines.find(line => line.currency === 'XYD');

  if (!XYD_balance || parseFloat(XYD_balance.balance) < parseFloat(amountToSend)) {
    console.error(`❌ Insufficient balance, current balance is ${XYD_balance ? XYD_balance.balance : 0} XYD`);
    client.disconnect();
    return;
  }

  // Construct payment transaction
  const payment_tx = {
    TransactionType: "Payment",
    Account: user_wallet.address,
    Amount: {
      currency: "XYD",
      value: amountToSend,
      issuer: issuerAddress
    },
    Destination: destinationAddress
  };

  const prepared_payment = await client.autofill(payment_tx);
  const signed_payment = user_wallet.sign(prepared_payment);
  const result = await client.submitAndWait(signed_payment.tx_blob);

  if (result.result.meta.TransactionResult === "tesSUCCESS") {
    console.log(`✅ Successfully sent ${amountToSend} XYD to ${destinationAddress}`);
  } else {
    console.error('❌ Sending failed:', result.result.meta.TransactionResult);
  }

  await client.disconnect();
}

// Load wallet information from keys.json
const keys = JSON.parse(fs.readFileSync('keys.json'));
const user_wallet = xrpl.Wallet.fromSeed(keys.user.seed);
const issuerAddress = keys.issuer.address;

// Get destination address and amount to send from command line arguments
const [,, destinationAddress, amountToSend] = process.argv;

if (!destinationAddress || !amountToSend) {
  console.error('Usage: node send_XYD.js <destination_address> <amount_to_send>');
  process.exit(1);
}

// Execute the send function
sendXYD(destinationAddress, amountToSend).catch(console.error);