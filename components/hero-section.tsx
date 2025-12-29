'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CreditCard, PiggyBank, TrendingUp, CheckCircle, Users } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Fast, Secure & Affordable Financial Solutions
              </h1>
              <p className="max-w-[600px] text-foreground/80 md:text-xl">
                Access instant loans, credit cards, and savings accounts with EcoCash. Our digital platform makes financial services accessible to everyone.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Get Started
              </Link>
              <Link
                href="/loans"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-full max-w-lg">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
              
              <div className="relative bg-card rounded-2xl p-6 shadow-xl border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <span className="font-semibold">EcoCash Card</span>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Active</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/70">Available Credit</span>
                    <span className="font-semibold">ZWL $2,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/70">Total Savings</span>
                    <span className="font-semibold">ZWL $1,200</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground/70">Quick Actions</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="text-xs mt-1">Loan</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                      <PiggyBank className="h-5 w-5 text-primary" />
                      <span className="text-xs mt-1">Save</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-2 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-xs mt-1">Pay</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-foreground/70">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-primary" />
                <span>10k+ Users</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-primary" />
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}