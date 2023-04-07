export interface JwtDto {
  userId: string;
  /**
   * Issued at
   */
  iat: number;
  /**
   * Expiration time
   */
  exp: number;
}

export interface TokenPayload {
  userId: string;
  walletId?: string;
}
