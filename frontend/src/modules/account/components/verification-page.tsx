"use client"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import type React from "react"
import { useState, useEffect } from "react"

interface VerificationPageProps {
  onSuccess: () => void
}

export function VerificationPage({ onSuccess }: VerificationPageProps) {
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
          <CardTitle className="text-center">Enter Verification Code</CardTitle>
          <CardDescription className="text-center">
            We have sent you a 6-digit verification code at abc@gmail.com
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{formatTime(timeLeft)}</p>
              <button
                type="button"
                disabled={timeLeft > 0}
                className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                Did not receive code? Resend
              </button>
            </div>

            <Button type="submit" disabled={code.length !== 6} className="w-full" size="lg">
              Verify
            </Button>
          </form>
        </CardContent>
      </Card>
  )
}
