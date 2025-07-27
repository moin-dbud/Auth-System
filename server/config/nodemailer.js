import nodemailer from 'nodemailer';

let transporter;
if (process.env.NODE_ENV === 'production') {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });
} else {
  // Dummy transporter for dev/no email password
  transporter = {
    sendMail: async () => {
      console.log('Dummy email sent (dev mode)');
      return Promise.resolve();
    }
  };
}

export default transporter;