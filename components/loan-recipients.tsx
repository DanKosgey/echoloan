"use client"

import { useEffect, useState } from "react"
import { Users, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';

const recipients = [
  { name: "Small Business Owners", count: "5,000+", icon: <Users className="h-5 w-5 text-primary" /> },
  { name: "Students", count: "3,000+", icon: <DollarSign className="h-5 w-5 text-primary" /> },
  { name: "Farmers", count: "2,500+", icon: <TrendingUp className="h-5 w-5 text-primary" /> },
  { name: "Entrepreneurs", count: "4,000+", icon: <CheckCircle className="h-5 w-5 text-primary" /> },
];

export default function LoanRecipients() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Who We Serve
          </h2>
          <p className="max-w-[900px] text-foreground/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            EcoCash provides financial solutions to a diverse community of individuals and businesses.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipients.map((recipient, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 rounded-xl bg-background shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                {recipient.icon}
              </div>
              <h3 className="text-xl font-bold mb-1">{recipient.name}</h3>
              <p className="text-foreground/70">{recipient.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
