export const SALT_ROUNDS = 10

export const REQUEST_USER_KEY = 'user'

export const VerificationCode = {
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
} as const

export type VerificationCodeType = (typeof VerificationCode)[keyof typeof VerificationCode]
