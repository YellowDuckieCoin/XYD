const xrpl = require('xrpl');
const fs = require('fs');

async function main() {
  // Connect to XRPL Testnet
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  console.log('Connected to XRPL Testnet');

  // Create Issuer account
  const issuer_wallet = (await client.fundWallet()).wallet;
  console.log('Issuer wallet created:', issuer_wallet.address);

  // Create User account
  const user_wallet = (await client.fundWallet()).wallet;
  console.log('User wallet created:', user_wallet.address);

  // Wait for account creation confirmation
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Establish TrustLine
  const trust_set_tx = {
    TransactionType: "TrustSet",
    Account: user_wallet.address,
    LimitAmount: {
      currency: "XYD",
      issuer: issuer_wallet.address,
      value: "21000000000"
    }
  };

  const prepared_trust = await client.autofill(trust_set_tx);
  const signed_trust = user_wallet.sign(prepared_trust);
  const trust_result = await client.submitAndWait(signed_trust.tx_blob);
  console.log('TrustLine creation result:', trust_result.result.meta.TransactionResult);

  // Issue tokens to user account
  const payment_tx = {
    TransactionType: "Payment",
    Account: issuer_wallet.address,
    Amount: {
      currency: "XYD",
      value: "21000000000",
      issuer: issuer_wallet.address
    },
    Destination: user_wallet.address
  };

  const prepared_payment = await client.autofill(payment_tx);
  const signed_payment = issuer_wallet.sign(prepared_payment);
  const payment_result = await client.submitAndWait(signed_payment.tx_blob);
  console.log('Token issuance result:', payment_result.result.meta.TransactionResult);

  // Query user account balance for confirmation
  const balances = await client.request({
    command: 'account_lines',
    account: user_wallet.address
  });
  const XYD_balance = balances.result.lines.find(line => line.currency === 'XYD');
  console.log(`User wallet ${user_wallet.address} has ${XYD_balance.balance} XYD`);

  // Save wallet keys and addresses to keys.json
  const keys = {
    issuer: {
      address: issuer_wallet.address,
      publicKey: issuer_wallet.publicKey,
      privateKey: issuer_wallet.privateKey,
      seed: issuer_wallet.seed
    },
    user: {
      address: user_wallet.address,
      publicKey: user_wallet.publicKey,
      privateKey: user_wallet.privateKey,
      seed: user_wallet.seed
    },
    token: {
      currency: "XYD",
      totalSupply: "21000000000"
    }
  };

  fs.writeFileSync('keys.json', JSON.stringify(keys, null, 2));
  console.log('Keys saved to keys.json');

  client.disconnect();
}

main().catch(console.error);