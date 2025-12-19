const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendWhatsAppMessage(phoneNumber, messageBody, mediaUrl) {
  const payload = {
    from: "whatsapp:+14155238886",
    to: `whatsapp:+91${phoneNumber}`,
    body: messageBody,
  };

  if (mediaUrl) {
    payload.mediaUrl = [mediaUrl];
  }

  return await client.messages.create(payload);
}

module.exports = { sendWhatsAppMessage };
