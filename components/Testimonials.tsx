"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useInterval } from "react-use"
import { Separator } from "./ui/separator"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Software Engineer",
    content: "This product has revolutionized our workflow. Highly recommended!",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Sarah Lee",
    role: "Product Manager",
    content: "Incredible user experience. It's been a game-changer for our team.",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Michael Chen",
    role: "UX Designer",
    content: "The attention to detail in this product is unmatched. Love it!",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Emily Davis",
    role: "Marketing Specialist",
    content: "Our campaigns have never been more effective. Thank you!",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "David Wilson",
    role: "CTO",
    content: "This solution has streamlined our operations significantly.",
    avatar: "/placeholder.svg?height=40&width=40"
  }
]

export default function TestimonialCarousel() {
  const [slidesInView, setSlidesInView] = useState(3)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [api, setApi] = useState<any>(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesInView(1)
      } else if (window.innerWidth < 1024) {
        setSlidesInView(2)
      } else {
        setSlidesInView(3)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useInterval(() => {
    if (api) {
      api.scrollNext()
    }
  }, 5000)

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Some of Our Users</h2>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        onSelect={(index) => setCurrentSlide(index)}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className={`pl-2 md:pl-4 ${slidesInView === 3 ? 'basis-1/3' : slidesInView === 2 ? 'basis-1/2' : 'basis-full'}`}>
              <Card>
                <CardContent className="flex flex-col-reverse gap-2  items-start p-6">

                  <blockquote className="text-lg mb-4">&ldquo;{testimonial.content}&rdquo;</blockquote>
                <Separator />
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                   
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  )
}