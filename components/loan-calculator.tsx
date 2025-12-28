"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, DollarSign, Percent, Calendar } from "lucide-react"

interface LoanCalculatorProps {
  onApply: () => void
}

export default function LoanCalculator({ onApply }: LoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(1000)
  const [loanTerm, setLoanTerm] = useState(24)
  const [apr, setApr] = useState(8.5)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  useEffect(() => {
    // Calculate monthly payment using amortization formula
    const monthlyRate = apr / 100 / 12
    const numberOfPayments = loanTerm

    let payment = 0
    if (monthlyRate > 0) {
      payment =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    } else {
      payment = loanAmount / numberOfPayments
    }

    const total = payment * numberOfPayments
    const interest = total - loanAmount

    setMonthlyPayment(payment)
    setTotalPayment(total)
    setTotalInterest(interest)
  }, [loanAmount, loanTerm, apr])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <section id="calculator" className="py-16 md:py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          {/* Calculator Form */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Calculate Your Monthly Payment</h2>
            <p className="text-muted-foreground mb-8">Adjust the loan details to see real-time calculations.</p>

            <div className="space-y-6">
              {/* Loan Amount */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Loan Amount
                </label>
                <input
                  type="range"
                  min="100"
                  max="100000"
                  step="1000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-bold text-primary">{formatCurrency(loanAmount)}</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-24 px-3 py-1 text-sm border border-border rounded-md bg-input text-foreground"
                  />
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  Loan Term (Months)
                </label>
                <input
                  type="range"
                  min="6"
                  max="84"
                  step="1"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-bold text-primary">{loanTerm} months</span>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-24 px-3 py-1 text-sm border border-border rounded-md bg-input text-foreground"
                  />
                </div>
              </div>

              {/* APR */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Percent className="h-4 w-4 text-primary" />
                  Annual Interest Rate (APR)
                </label>
                <input
                  type="range"
                  min="3"
                  max="20"
                  step="0.1"
                  value={apr}
                  onChange={(e) => setApr(Number(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-bold text-primary">{apr.toFixed(2)}%</span>
                  <input
                    type="number"
                    value={apr}
                    onChange={(e) => setApr(Number(e.target.value))}
                    step="0.1"
                    className="w-24 px-3 py-1 text-sm border border-border rounded-md bg-input text-foreground"
                  />
                </div>
              </div>

              <Button onClick={onApply} size="lg" className="w-full gap-2 mt-8">
                Apply Now <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-primary">{formatCurrency(monthlyPayment)}</div>
                <p className="text-xs text-muted-foreground mt-2">Per month</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-accent">{formatCurrency(totalInterest)}</div>
                <p className="text-xs text-muted-foreground mt-2">Over {loanTerm} months</p>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 border-border bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-foreground">{formatCurrency(totalPayment)}</div>
                <p className="text-xs text-muted-foreground mt-2">Principal + Interest</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
