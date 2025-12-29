'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Calendar, TrendingDown, PiggyBank } from 'lucide-react';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(1000);
  const [interestRate, setInterestRate] = useState(15);
  const [loanTerm, setLoanTerm] = useState(12);

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    // Calculate monthly payment
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    
    if (monthlyRate === 0) {
      // If interest rate is 0, just divide by number of payments
      const payment = loanAmount / numberOfPayments;
      setMonthlyPayment(payment);
      setTotalPayment(loanAmount);
      setTotalInterest(0);
    } else {
      // Calculate using standard loan payment formula
      const x = Math.pow(1 + monthlyRate, numberOfPayments);
      const monthly = (loanAmount * x * monthlyRate) / (x - 1);
      
      if (!isNaN(monthly)) {
        setMonthlyPayment(monthly);
        setTotalPayment(monthly * numberOfPayments);
        setTotalInterest(monthly * numberOfPayments - loanAmount);
      } else {
        setMonthlyPayment(0);
        setTotalPayment(0);
        setTotalInterest(0);
      }
    }
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Loan Calculator
          </h2>
          <p className="max-w-[900px] text-foreground/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Estimate your monthly payments and total interest with our easy-to-use calculator.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Loan Amount: ZWL {loanAmount.toLocaleString()}</label>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <input
                  type="range"
                  min="100"
                  max="100000"
                  step="100"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs text-foreground/70 mt-1">
                <span>ZWL 100</span>
                <span>ZWL 100,000</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Interest Rate: {interestRate}%</label>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-primary" />
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs text-foreground/70 mt-1">
                <span>1%</span>
                <span>50%</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Loan Term: {loanTerm} months</label>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs text-foreground/70 mt-1">
                <span>1 month</span>
                <span>60 months</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-primary/10 shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="font-semibold">Estimated Costs</h3>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-foreground/70">Monthly Payment</span>
                </div>
                <span className="font-semibold">ZWL {monthlyPayment.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <PiggyBank className="h-4 w-4 text-primary" />
                  <span className="text-foreground/70">Total Payment</span>
                </div>
                <span className="font-semibold">ZWL {totalPayment.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  <span className="text-foreground/70">Total Interest</span>
                </div>
                <span className="font-semibold">ZWL {totalInterest.toFixed(2)}</span>
              </div>
              
              <div className="pt-4">
                <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                  Apply for Loan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}