
const nodemailer = require('nodemailer');
async function test() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kimanonuevo59@gmail.com',
      pass: 'roia whtf zrce owlu',
    },
  });
  try {
    await transporter.verify();
    console.log('SMTP Config is Valid!');
  } catch (error) {
    console.error('SMTP Error:', error);
  }
}
test();

