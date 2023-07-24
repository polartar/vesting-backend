export const GOOGLE_AUTH_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

export const AUTHORIZATION_CODE_EXPIRE_TIME = 1000 * 60 * 60 * 24; // 24 hours

export const DEFAULT_CODE_LENGTH = 24;

export const EMAIL_SENDER = {
  name: 'VTVL',
  email: 'no-reply@vtvl.io',
};

export enum Platforms {
  App = 'app',
  Portfolio = 'portfolio',
}

export enum MailTemplates {
  Login = 'd-dbd24a1f6b69408bbdcff1b4130ecde4',
  LoginInstitutional = 'd-4958750812af4664a91288369225afa7',
  TeammateInvite = 'd-bde77990c2394a1fba408a67285063b6',
  RecipientInvite = 'd-c7dcc8f33282470099ae8a0247710d20',
  /** V2 Email theme */
  LoginV2 = 'd-d7421e14f0f049e1a0e18488ff1b2f63',
  TeammateInviteV2 = 'd-82a9d1093c4f42bcaa53a93d6eb23815',
  RecipientInviteV2 = 'd-02355a5f1ee04a21b54952fc13e91923',
}

export enum EmailSubjects {
  Login = 'Login to VTVL',
  Signup = 'Signup to VTVL',
}

export const WEBSITE_NAME = 'VTVL';
export const WEBSITE_EMAIL = 'no-reply@vtvl.io';

export const SIGN_MESSAGE_TEMPLATE = (
  address: string,
  utcTimeString: UTCString
) =>
  `VTVL uses cryptographic signatures instead of passwords to verify that you are the owner of this address. The wallet address is ${
    address /* wallet: 0xab12 */
  } and the time is ${utcTimeString /* 2022-06-01 16:47:55 UTC */}.`;
