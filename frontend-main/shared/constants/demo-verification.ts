/** Local dev fallback when OTP API is unavailable. Not shown in the UI. */
export const DEMO_VERIFICATION_CODE = "123456"

/** Validates OTP format. Replace with API verification when backend OTP is connected. */
export function isValidVerificationCode(code: string): boolean {
  return /^\d{6}$/.test(code.trim())
}

/** @deprecated Use isValidVerificationCode */
export function isValidDemoVerificationCode(code: string): boolean {
  return isValidVerificationCode(code)
}
