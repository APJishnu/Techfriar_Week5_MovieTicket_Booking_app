const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber.startsWith('+')) {
    return `+91${phoneNumber.replace(/^0+/, '')}`; // Remove leading zeros and add country code
  }
  return phoneNumber;
};

const sendSms = async (to, otp) => {
  const from = process.env.TWILIO_PHONE_NUMBER;
  // Format the phone number
  const formattedNumber = formatPhoneNumber(to);

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: from,
      to: formattedNumber,
    });

    return true;
  } catch (error) {
    return false;
  }
};


const sendWhatsAppMessage = async (phoneNumber, messageBody) => {
  try {
    const message = await client.messages.create({
      from: 'whatsapp:+14155238886', // Use your Twilio WhatsApp number
      to: `whatsapp:+91${phoneNumber}`, // Format phone number for WhatsApp
      body: messageBody,
    });
    return message;
  } catch (error) {
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
};


module.exports = {sendSms,sendWhatsAppMessage};
