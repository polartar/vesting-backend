import { Injectable } from '@nestjs/common';
import { EmailSubjects, MailTemplates } from 'src/common/utils/constants';
import { sendEmail } from 'src/common/utils/sendgrid';

@Injectable()
export class EmailService {
  async sendLoginEmail(email: string, code: string): Promise<boolean> {
    try {
      const emailLink = `${process.env.AUTH_URL}/code?=${code}`;
      await sendEmail<{ emailLink: string }>(
        email,
        EmailSubjects.Login,
        MailTemplates.Login,
        { emailLink }
      );
      return true;
    } catch (error) {
      console.log('email send', error);
      return false;
    }
  }
}
