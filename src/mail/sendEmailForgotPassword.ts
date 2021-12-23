
import mailer from '../mail/mailer'
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

interface res {
  isEmailSended?: boolean;
}

const sendEmailForgotPassword = async (
  email: string,
  token: string
) => {
  const response: res = {}
  const filePath = path.join(__dirname, './view/forgotPassword.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const variables = { token };
  const htmlToSend = template(variables);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Recuperação de senha',
    html: htmlToSend
  };

  mailer.sendMail(mailOptions, (err) => {
    if (err) {
      return response.isEmailSended = false
    }
  });
  return response.isEmailSended = true
}

export default sendEmailForgotPassword