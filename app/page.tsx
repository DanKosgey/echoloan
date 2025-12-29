"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from '@/components/hero-section';
import FeaturesSection from '@/components/features-section';
import LoanRecipients from '@/components/loan-recipients';
import CreditCardAd from '@/components/credit-card-ad';
import LoanCalculator from '@/components/loan-calculator';
import TestimonialsSection from '@/components/testimonials-section';
import PartnersSection from '@/components/partners-section';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <LoanRecipients />
      <PartnersSection />
      <CreditCardAd />
      <LoanCalculator />
      <TestimonialsSection />
    </main>
  );
}
