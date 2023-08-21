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
    platform: Platforms
  ): Promise<boolean> {
    try {
      const emailLink = `${redirectUri}?code=${code}`;
      await sendEmail<{ emailLink: string }>(
        email,
        EmailSubjects.Login,
        this.getEmailTemplate(platform).Login,
        { emailLink }
      );
      return true;
    } catch (error) {
      console.log('email send', error);
      return false;
    }
  }

  getEmailTemplate = (
    platform: Platforms
  ): {
    Login: MailTemplates;
    RecipientInvite: MailTemplates;
    TeammateInvite: MailTemplates;
  } => {
    switch (platform) {
      case Platforms.App:
        return {
          Login: MailTemplates.Login,
          RecipientInvite: MailTemplates.RecipientInvite,
          TeammateInvite: MailTemplates.TeammateInvite,
        };
      case Platforms.Portfolio:
        return {
          Login: MailTemplates.LoginInstitutional,
          RecipientInvite: MailTemplates.RecipientInviteInstitutional,
          TeammateInvite: MailTemplates.RecipientInviteInstitutional,
        };
    }
  };

  async sendInvitationEmail(
    email: string,
    code: string,
    redirectUri: string,
    platform?: Platforms,
    name?: string
  ): Promise<boolean> {
    try {
      const emailLink = `${redirectUri}?code=${code}`;
      await sendEmail<{ emailLink: string; name?: string }>(
        email,
        EmailSubjects.Login,
        this.getEmailTemplate(platform || Platforms.App).TeammateInvite,
        { emailLink, name }
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
    redirectUri: string,
    name?: string,
    tokenSymbol?: string
  ): Promise<boolean> {
    try {
      const emailLink = `${redirectUri}?code=${code}`;
      await sendEmail<{
        emailLink: string;
        name?: string;
        tokenSymbol?: string;
      }>(
        email,
        EmailSubjects.Login,
        this.getEmailTemplate(Platforms.App).RecipientInvite,
        { emailLink, tokenSymbol, name }
      );
      return true;
    } catch (error) {
      console.error('Sending invitation email: ', error);
      return false;
    }
  }
}
