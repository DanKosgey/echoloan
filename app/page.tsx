"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import LoanCalculator from "@/components/loan-calculator"
import ApplicationModal from "@/components/application-modal"
import FeaturesSection from "@/components/features-section"
import CreditCardAd from "@/components/credit-card-ad"
import Footer from "@/components/footer"
import LoanRecipients from "@/components/loan-recipients"
import PartnersSection from "@/components/partners-section"

import { useRouter } from "next/navigation"

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleApply = () => {
    router.push("/login")
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection onApply={handleApply} />
      <LoanRecipients />
      <LoanCalculator onApply={handleApply} />
      <PartnersSection />
      <CreditCardAd />
      <FeaturesSection />
      <Footer />
      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
