"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

interface HeroSectionProps {
  onApply: () => void
}

export default function HeroSection({ onApply }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* White upper section with logo */}
      <div className="pt-16 pb-32 text-center relative z-10">
        <div className="mb-8">
          <Image src="/images/image.png" alt="EcoCash Logo" width={200} height={80} className="mx-auto" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Personal Loans, Made Simple</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 px-4">
          Get quick access to funds with transparent rates, no hidden fees, and approvals in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Button size="lg" onClick={onApply} className="gap-2">
            Apply Now <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>

      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-auto block"
        style={{ marginTop: "-1px" }}
      >
        <path fill="#0052CC" d="M0,40 Q360,0 720,40 T1440,40 L1440,120 L0,120 Z" />
      </svg>

      {/* Blue lower section */}
      <div className="bg-blue-600 h-40 md:h-64"></div>
    </section>
  )
}
