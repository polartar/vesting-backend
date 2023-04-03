import { MailService } from '@sendgrid/mail';
import { MailTemplates, EmailSubjects, EMAIL_SENDER } from './constants';

const Mail = new MailService();
Mail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail<T>(
  to: string,
  subject: EmailSubjects,
  templateId: MailTemplates,
  data: T
): Promise<void> {
  const dynamicTemplateData = { ...data, subject };
  await Mail.send({
    to,
    from: EMAIL_SENDER,
    templateId,
    dynamicTemplateData,
    subject,
  });
}
