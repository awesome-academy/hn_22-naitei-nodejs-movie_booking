import { randomInt } from "crypto"

//generate ra mã OTP
export const generateOTP = () => {
  return String(randomInt(100000, 1000000))
}