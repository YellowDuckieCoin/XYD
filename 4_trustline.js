const axios = require('axios');
const QRCode = require('qrcode');

async function createTrustSetPayload() {
  const apiUrl = 'https://api.xrpl.services/api/v1/platform/payload';

  // Request body, exactly matching your captured request content
  const requestData = {
    "options": {
      "xrplAccount": null,
      "web": true,
      "referer": "https://xrpl.services/"
    },
    "payload": {
      "txjson": {
        "TransactionType": "TrustSet",
        "Flags": 131072,
        "LimitAmount": {
          "issuer": "rGsXikYmTsrh2Q5B1UXfQVzsGFPXewt5WN",
          "currency": "XYD",
          "value": "21000000000"
        }
      },
      "custom_meta": {
        "instruction": "- Issuer Address: rGsXikYmTsrh2Q5B1UXfQVzsGFPXewt5WN\n- Token currency code: XYD\n- Limit: 21000000000"
      },
      "options": {
        "expire": 5
      }
    }
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://xrpl.services',
        'Referer': 'https://xrpl.services'
      }
    });

    const payloadUrl = response.data.next.always;
    console.log("✅ Successfully created Xaman Payload URL:", payloadUrl);

    // Generate QR code to terminal
    QRCode.toString(payloadUrl, { type: 'terminal', small: true }, function(err, qr) {
      if (err) {
        console.error('Failed to generate QR code:', err);
        return;
      }
      console.log("\n📌 Please use Xaman wallet to scan the following QR code to sign:\n");
      console.log(qr);
    });

    // Also save QR code as an image
    await QRCode.toFile('xaman_payload_qr.png', payloadUrl, { width: 300 });
    console.log("QR code image has been saved as xaman_payload_qr.png");

  } catch (error) {
    console.error('Request failed:', error.response ? error.response.data : error.message);
  }
}

createTrustSetPayload();
