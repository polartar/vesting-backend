export const ERROR_MESSAGES = {
  AUTH_FAILURE: 'Authorization failed',
  AUTH_INVALID_CODE: 'Invalid authorization code',
  AUTH_TOKEN_EXPIRED: 'Access token is no longer valid, please log in again',
  AUTH_USER_NOT_FOUND: 'User is not found',

  /** Google Auth */
  EMAIL_SEND_FAILURE: 'Sending email is failed',
  GOOGLE_AUTH_FAILURE: 'Invalid google authorization code',

  /** Wallet connect */
  WALLET_CONNECT_FAILTURE: 'Wallet connect has failed',
  WALLET_INVALID_SIGNATURE: 'Invalid signature',
  WRONG_WALLET_OWNER: 'Wallet was already registered with different user',

  /** Organization */
  ORGANIZATION_ID_MISSING: 'Organization id is missing',
};

export const SUCCESS_MESSAGES = {
  LOGIN_EMAIL: 'Sent login email successfully',
  SIGNUP_EMAIL: 'Sent signup email successfully',
};
