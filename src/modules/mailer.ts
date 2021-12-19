import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '1a8d3c59ad73f1',
    pass: '7528d3e25fdf2f',
  }
})

export default transport