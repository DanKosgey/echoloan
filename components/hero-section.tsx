'use client';

import Link from 'next/link';
import { Users, CheckCircle, Zap, Shield, CreditCard } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Instant Financial Solutions</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Fast, Secure & Affordable Financial Solutions
              </h1>
              
              <p className="text-lg md:text-xl text-foreground/80 max-w-2xl leading-relaxed">
                Access instant loans, credit cards, and savings accounts with EcoCash. Our digital platform makes financial services accessible to everyone.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group"
              >
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-primary/30 bg-background px-8 text-base font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Learn More
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">10k+</p>
                  <p className="text-sm text-foreground/70">Users</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Secure</p>
                  <p className="text-sm text-foreground/70">Platform</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-xl"></div>
              
              <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm p-8 rounded-3xl border border-border/20 shadow-xl max-w-md">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 rounded-full bg-primary/20 mb-6">
                    <CreditCard className="h-10 w-10 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">EcoCash Financial Platform</h3>
                  <p className="text-foreground/70 mb-6">
                    Your trusted partner for all financial needs
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-background/50 p-4 rounded-xl border border-border/20">
                      <p className="text-2xl font-bold text-primary">ZWL $2,500</p>
                      <p className="text-xs text-foreground/60 mt-1">Credit Limit</p>
                    </div>
                    <div className="bg-background/50 p-4 rounded-xl border border-border/20">
                      <p className="text-2xl font-bold text-primary">ZWL $1,200</p>
                      <p className="text-xs text-foreground/60 mt-1">Savings</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border/20 w-full">
                    <p className="text-sm text-foreground/70 mb-3">Quick Actions</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="py-3 rounded-lg bg-background/50 border border-border/20 hover:bg-primary/10 transition-colors">
                        <span className="text-xs">Loan</span>
                      </button>
                      <button className="py-3 rounded-lg bg-background/50 border border-border/20 hover:bg-primary/10 transition-colors">
                        <span className="text-xs">Save</span>
                      </button>
                      <button className="py-3 rounded-lg bg-background/50 border border-border/20 hover:bg-primary/10 transition-colors">
                        <span className="text-xs">Pay</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}