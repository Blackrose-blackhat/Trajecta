"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ContactUs() {
    const { toast } = useToast();
  const [email, setEmail] = useState("")
  const [feedback, setFeedback] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your server
    console.log("Submitted:", { email, feedback })
    toast({
      title: "Feedback Sent",
      description: "Thank you for your feedback!",
    })
    setEmail("")
    setFeedback("")
  }

  return (
    <div className="flex w-full items-center justify-center p-5 ">
      <Card className="md:w-1/2 w-full   text-neutral-100 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">We would love to hear from you</CardTitle>
          <CardDescription className="text-neutral-400 text-center">
            We&apos;d love to hear your feedback about our product.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-neutral-200">
                Email
              </Label>
              <Input
                id="email"
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder-neutral-400 focus:ring-neutral-500 focus:border-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-sm font-medium text-neutral-200">
                Product Feedback
              </Label>
              <Textarea
                id="feedback"
                placeholder="Tell us what you think about our product..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                className="bg-neutral-700 border-neutral-600 text-neutral-100 placeholder-neutral-400 focus:ring-neutral-500 focus:border-neutral-500 min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-neutral-600 hover:bg-neutral-700 text-neutral-100">
              Send Feedback
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}