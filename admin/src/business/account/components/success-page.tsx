"use client"

import { Button } from "@/src/shared/ui/ui/button"
import { Card, CardContent, CardHeader } from "@/src/shared/ui/ui/card"
import { CheckCircle2 } from "lucide-react"

interface SuccessPageProps {
  onDone: () => void
}

export function SuccessPage({ onDone }: SuccessPageProps) {
  return (
      <Card className="w-full shadow-none bg-base-100 md:w-1/3 py-20 mx-auto border-2 border-border/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Successful</h2>
            <p className="text-muted-foreground">Thank you for your application</p>
          </div>

          <Button onClick={onDone} className="w-full" size="lg">
            Done
          </Button>
        </CardContent>
      </Card>
  )
}
