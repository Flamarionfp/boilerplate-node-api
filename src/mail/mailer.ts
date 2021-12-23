import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'eaf8b56bc6769a',
    pass: '14957a156685ca',
  }
})

export default transport