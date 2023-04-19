export const ERROR_MESSAGES = {
  AUTH_FAILURE: 'Authorization failed',
  AUTH_INVALID_CODE: 'Invalid authorization code',
  AUTH_TOKEN_EXPIRED: 'Access token is no longer valid, please log in again',
  AUTH_USER_NOT_FOUND: 'User is not found',

  /** Google Auth */
  EMAIL_SEND_FAILURE: 'Sending email is failed',
  GOOGLE_AUTH_FAILURE: 'Invalid google authorization code',
  GOOGLE_AUTH_CALLBACK_FAILURE: 'Google auth callback link is invalid',

  /** Wallet connect */
  WALLET_CONNECT_FAILTURE: 'Wallet connect has failed',
  WALLET_INVALID_SIGNATURE: 'Invalid signature',
  WRONG_WALLET_OWNER: 'Wallet was already registered with different user',

  /** Organization */
  ORGANIZATION_ID_MISSING: 'Organization id is missing',
  ORGANIZATION_CREATION_FAILURE: 'Creating an organization is failed',
  ORGANIZATION_UPDATE_FAILURE: 'Updating an organization is failed',
  ORGANIZATION_GET_ALL_FAILURE: 'Fetching all organizations is failed',
  ORGANIZATION_GET_ONE_FAILURE: 'Fetching an organization details is failed',
  ORGANIZATION_ADD_MEMBERS_FAILURE: 'Adding members is failed',
  ORGANIZATION_GET_ALL_MEMBERS_FAILURE: 'Fetching all members is failed',
};

export const SUCCESS_MESSAGES = {
  LOGIN_EMAIL: 'Sent login email successfully',
  SIGNUP_EMAIL: 'Sent signup email successfully',

  /** Organization */
  ORGANIZATION_ADD_MEMBERS: 'Invited members successfully',
};
