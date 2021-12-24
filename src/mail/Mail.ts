import * as nodemailer from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import sendEmailResponse from '../interfaces/sendEmailResponse'

class Mail {
  private transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>

  constructor() {
    this.transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'eaf8b56bc6769a',
        pass: '14957a156685ca',
      }
    })
  }

  public sendEmail(
    email: string,
    data: object,
    subject: string,
    templateFile: string,
  ): boolean {
    const response: sendEmailResponse = {}
    const filePath = path.join(__dirname, `./templates/${templateFile}.html`);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const htmlToSend = template(data);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: htmlToSend
    };

    this.transport.sendMail(mailOptions, (err) => {
      if (err) {
        return response.isEmailSended = false
      }
    });
    return response.isEmailSended = true
  }
}

export default Mail;

