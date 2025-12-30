"use client"

import { TrendingUp, Shield, Zap, Clock, Lock, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Zap,
    title: "Instant Approval",
    description: "Get approved in minutes with our streamlined application process.",
  },
  {
    icon: Shield,
    title: "Secure & Safe",
    description: "Your data is encrypted and protected with bank-level security.",
  },
  {
    icon: TrendingUp,
    title: "Transparent Rates",
    description: "No hidden fees or surprise charges. See exactly what you pay.",
  },
  {
    icon: Clock,
    title: "Fast Funding",
    description: "Funds can be deposited to your account within 24 hours.",
  },
  {
    icon: FileText,
    title: "Simple Process",
    description: "Minimal documentation required. Apply online in seconds.",
  },
  {
    icon: Lock,
    title: "Privacy Protected",
    description: "We never share your information with third parties.",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose EcoCash?</h2>
          <p className="text-lg text-muted-foreground">
            We're committed to providing fast, transparent, and secure lending solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
