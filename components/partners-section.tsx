"use client"
import { Globe, Building2, Users, Star } from 'lucide-react';

export default function PartnersSection() {
  const stats = [
    { value: "50K+", label: "Happy Customers", icon: <Users className="h-6 w-6 text-primary" /> },
    { value: "99.9%", label: "Uptime", icon: <Globe className="h-6 w-6 text-primary" /> },
    { value: "24/7", label: "Support", icon: <Building2 className="h-6 w-6 text-primary" /> },
    { value: "4.9★", label: "Rating", icon: <Star className="h-6 w-6 text-primary" /> },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border"
            >
              <div className="mb-3 p-2 rounded-full bg-primary/10">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-foreground/70 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
