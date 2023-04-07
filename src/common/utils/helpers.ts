import { DEFAULT_CODE_LENGTH } from './constants';

export const generateRandomCode = (length: number = DEFAULT_CODE_LENGTH) => {
  const characters = String(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  );
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const compareStrings = (str1: string, str2: string) => {
  return str1.toLowerCase() === str2.toLowerCase();
};
