import { Injectable } from '@nestjs/common';
import {
  EmailSubjects,
  MailTemplates,
  Platforms,
} from 'src/common/utils/constants';
import { sendEmail } from 'src/common/utils/sendgrid';

@Injectable()
export class EmailService {
  async sendLoginEmail(
    email: string,
    code: string,
    redirectUri: string,
    platform?: Platforms
  ): Promise<boolean> {
    try {
      const emailLink = `${redirectUri}?code=${code}`;
      await sendEmail<{ emailLink: string }>(
        email,
        EmailSubjects.Login,
        this.getLoginEmailTemplate(platform || Platforms.App),
        { emailLink }
      );
      return true;
    } catch (error) {
      console.log('email send', error);
      return false;
    }
  }

  getLoginEmailTemplate = (platform: Platforms): MailTemplates => {
    switch (platform) {
      case Platforms.App:
        return MailTemplates.Login;
      case Platforms.Portfolio:
        return MailTemplates.LoginInstitutional;
    }
  };

  async sendInvitationEmail(
    email: string,
    code: string,
    redirectUri: string
  ): Promise<boolean> {
    try {
      const emailLink = `${redirectUri}?code=${code}`;
      await sendEmail<{ emailLink: string }>(
        email,
        EmailSubjects.Login,
        MailTemplates.TeammateInvite,
        { emailLink }
      );
      return true;
    } catch (error) {
      console.error('Sending invitation email: ', error);
      return false;
    }
  }

  async sendRecipientInvitationEmail(
    email: string,
    code: string,
    redirectUri: string
  ): Promise<boolean> {
    try {
      const emailLink = `${redirectUri}?code=${code}`;
      await sendEmail<{ emailLink: string }>(
        email,
        EmailSubjects.Login,
        MailTemplates.RecipientInvite,
        { emailLink }
      );
      return true;
    } catch (error) {
      console.error('Sending invitation email: ', error);
      return false;
    }
  }
}
