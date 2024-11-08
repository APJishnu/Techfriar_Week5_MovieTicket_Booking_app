const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendWhatsAppMessage = async (phoneNumber, messageBody, mediaUrl) => {
  try {
    const message = await client.messages.create({
      from: "whatsapp:+14155238886", // Use your Twilio WhatsApp number
      to: `whatsapp:+91${phoneNumber}`, // Format phone number for WhatsApp
      body: messageBody,
      mediaUrl: [mediaUrl], // Include the media URL here
    });
    return message;
  } catch (error) {
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
};

module.exports = { sendWhatsAppMessage };
