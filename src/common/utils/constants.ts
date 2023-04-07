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

export enum MailTemplates {
  Login = 'd-dbd24a1f6b69408bbdcff1b4130ecde4',
  TeammateInvite = 'd-bde77990c2394a1fba408a67285063b6',
  RecipientInvite = 'd-c7dcc8f33282470099ae8a0247710d20',
}

export enum EmailSubjects {
  Login = 'Login to VTVL',
  Signup = 'Signup to VTVL',
}

export const SIGN_MESSAGE_TEMPLATE = (
  address: string,
  utcTimeString: UTCString
) =>
  `VTVL uses cryptographic signatures instead of passwords to verify that you are the owner of this address. The wallet address is ${
    address /* wallet: 0xab12 */
  } and the time is ${utcTimeString /* 2022-06-01 16:47:55 UTC */}.`;
