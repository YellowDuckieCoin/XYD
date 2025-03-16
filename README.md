# XRPL Token Management Scripts
![image](https://github.com/user-attachments/assets/e492feda-67bc-4598-ae6f-db635386159a)


This repository provides JavaScript scripts for managing a custom token, **XYD** (YellowDuckie) 🟡🦆, on the XRP Ledger (XRPL) Testnet. XYD brings a delightful splash of fun to the blockchain!
![image](https://github.com/user-attachments/assets/8e5a8f5d-e351-408d-b587-21229f4d749b)

## Overview

These scripts perform various token management tasks:

1. **Token Issuance**
   - Creates issuer and user wallets, sets up a Trustline, and issues XYD tokens (21 billion).
   - [View Example Transaction](https://testnet.xrpl.org/transactions/02185BEF4F25AEDE3D22BA11B944352F93BC9B917680CEF8B684A54691E6C7AF/detailed)

2. **DefaultRipple Flag**
   - Enables the `DefaultRipple` flag on the issuer account.

3. **Freeze Issuance**
   - Sets a black hole address and disables the Master Key, permanently freezing token issuance.
   - [View Example Transaction](https://testnet.xrpl.org/transactions/D0C8C9CB87411382224E6A290F491F63C18BDB8DC40144879F8F7871CEE4223F)

4. **Xaman Payload**
   - Generates a TrustSet payload and QR code for signing with the Xaman wallet.

5. **Airdrop Trustline**
   - Creates a wallet and Trustline for XYD tokens.

6. **Send XYD**
   - Transfers XYD tokens to another wallet.

Explore the issuer account on the XRPL Testnet [here](https://testnet.xrpl.org/accounts/rwG2dfAzb5x737WsiiTnH7zub5gve7BXe7).

## Prerequisites

- **Node.js** (v14 or higher)
- XRPL Testnet access (`wss://s.altnet.rippletest.net:51233`)
- **Xaman Wallet** (optional, for QR signing)

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
npm install xrpl axios qrcode
```

## Scripts

### 1. Token Issuance (`issue_token.js`)

Creates issuer/user wallets, Trustline, issues tokens, and generates `keys.json`.

```bash
node issue_token.js
```

Output:
- `keys.json` with wallet details
- Console logs of transactions

### 2. Enable DefaultRipple (`set_default_ripple.js`)

Sets the DefaultRipple flag using `keys.json`.

```bash
node set_default_ripple.js
```

Output:
- Confirmation message

### 3. Freeze Issuance (`freeze_issuance.js`)

Freezes token issuance by setting a black hole address.

```bash
node freeze_issuance.js
```

Output:
- Console confirmation of actions

### 4. Xaman Payload (`create_trustset_payload.js`)

Generates TrustSet payload and QR code.

```bash
node create_trustset_payload.js
```

Output:
- Payload URL
- QR code in terminal
- `xaman_payload_qr.png`

### 5. Airdrop Trustline (`airdrop_trustline.js`)

Creates new wallet and establishes Trustline.

```bash
node airdrop_trustline.js
```

Output:
- `key_airdrop.json` file
- Console logs confirming Trustline creation

### 6. Send XYD (`send_XYD.js`)

Transfers tokens to a specified address.

```bash
node send_XYD.js <destination_address> <amount>
```

Example:

```bash
node send_XYD.js rAbc123...xyz 5000000
```

Output:
- Transaction success message

## File Structure

```
├── issue_token.js               # Token issuance
├── set_default_ripple.js        # DefaultRipple flag
├── freeze_issuance.js           # Freeze issuance
├── create_trustset_payload.js   # Xaman payload
├── airdrop_trustline.js         # Airdrop Trustline
├── send_XYD.js                  # Send XYD tokens
├── keys.json                    # Issuer/user keys
├── key_airdrop.json             # Airdrop wallet keys
├── xaman_payload_qr.png         # QR code image
└── README.md                    # Documentation
```

## Notes

- **Security**: Securely store `keys.json` and `key_airdrop.json`.
- **Testnet**: Designed for XRPL Testnet. Modify for mainnet use.
- **Adjustments**: Customize scripts for token limits or addresses.

## License

Licensed under MIT. See `LICENSE` file for details.
