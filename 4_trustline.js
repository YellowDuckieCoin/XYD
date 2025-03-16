const axios = require('axios');
const QRCode = require('qrcode');

async function createTrustSetPayload() {
  const apiUrl = 'https://api.xrpl.services/api/v1/platform/payload';

  // 请求体，与你抓包请求内容完全一致
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
    console.log("✅ 成功创建Xaman Payload URL：", payloadUrl);

    // 生成二维码到终端
    QRCode.toString(payloadUrl, { type: 'terminal', small: true }, function(err, qr) {
      if (err) {
        console.error('生成二维码失败:', err);
        return;
      }
      console.log("\n📌 请使用 Xaman 钱包扫描以下二维码进行签名:\n");
      console.log(qr);
    });

    // 同时保存二维码为图片
    await QRCode.toFile('xaman_payload_qr.png', payloadUrl, { width: 300 });
    console.log("二维码图片已保存为 xaman_payload_qr.png");

  } catch (error) {
    console.error('请求失败:', error.response ? error.response.data : error.message);
  }
}

createTrustSetPayload();
