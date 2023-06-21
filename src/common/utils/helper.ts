import { AUTHORIZATION_CODE_EXPIRE_TIME } from './constants';

export const getExpiredTime = () =>
  new Date().getTime() + AUTHORIZATION_CODE_EXPIRE_TIME;
