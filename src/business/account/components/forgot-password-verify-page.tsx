"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/ui/card"
import { Input } from "@/src/shared/ui/ui/input"
import { Button } from "@/src/shared/ui/ui/button"



interface ForgotPasswordVerifyPageProps {
  email: string
  onSuccess: () => void
  onBackToLogin: () => void
}

export function ForgotPasswordVerifyPage({ email, onSuccess, onBackToLogin }: ForgotPasswordVerifyPageProps) {
  const [code, setCode] = useState("")
  const [timeLeft, setTimeLeft] = useState(119)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length === 6) {
      onSuccess()
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setCode(value)
  }

  return (
    <Card className="w-full shadow-none bg-base-100 md:w-1/3 py-20 mx-auto border-2 border-border/50">
        <CardHeader>
          <CardTitle className="text-center">Forgot password</CardTitle>
          <CardDescription className="text-center">Enter the 6-digit verification code to confirm</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email or phone</label>
                <Input value={email} disabled className="mt-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Enter the 6-digit verification code</label>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={timeLeft > 0}
                    className="h-auto p-0 text-xs text-primary hover:underline disabled:text-muted-foreground disabled:cursor-not-allowed"
                  >
                    Resend
                  </Button>
                </div>
                <Input
                  placeholder="000000"
                  value={code}
                  onChange={handleCodeChange}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
            </div>

            <Button type="submit" disabled={code.length !== 6} className="w-full" size="lg">
              Verify
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button onClick={onBackToLogin} className="text-primary hover:underline font-medium">
                LOGIN
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
  )
}
