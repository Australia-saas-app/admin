import * as z from "zod"

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})


export const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    companyName: z.string().min(1, "Company name is required"),
    country: z.string().min(1, "Country is required"),
    mobileNumber: z.string().min(1, "Mobile number is required"),
  // Backend expects businessCategoryId and subBusinessCategoryId (UUID strings)
  businessCategoryId: z.string().uuid("Business category ID must be a valid UUID"),
  subBusinessCategoryId: z.string().uuid("Sub-business category ID must be a valid UUID"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

// Forgot Password: Step 1 - Email
export const forgotPasswordEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

// Forgot Password: Step 2 - OTP (6 digits)
export const otpSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/i, "Enter the 6-digit code"),
})

// Forgot Password: Step 3 - New Password
export const newPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })