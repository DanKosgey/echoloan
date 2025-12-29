import { CreditCard, Zap, Shield, TrendingUp } from 'lucide-react';

export default function CreditCardAd() {
  const features = [
    { title: "Low Interest", description: "Starting from 15%", icon: <TrendingUp className="h-5 w-5 text-primary" /> },
    { title: "Instant Approval", description: "Get approved in minutes", icon: <Zap className="h-5 w-5 text-primary" /> },
    { title: "Secure", description: "Bank-level security", icon: <Shield className="h-5 w-5 text-primary" /> },
    { title: "Rewards", description: "Earn cashback on purchases", icon: <CreditCard className="h-5 w-5 text-primary" /> },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-accent/10 to-primary/10">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EcoCash Credit Card
            </h2>
            <p className="max-w-[600px] text-foreground/80 md:text-xl">
              The perfect companion for your financial journey. Enjoy competitive rates, rewards, and instant access to credit.
            </p>
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-foreground/70 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
              <a
                href="/cards"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Apply Now
              </a>
              <a
                href="/cards"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
              
              <div className="relative bg-gradient-to-br from-primary to-accent rounded-2xl p-8 shadow-xl text-white">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold">EcoCash Card</h3>
                    <p className="text-sm opacity-80">Premium Financial Solution</p>
                  </div>
                  <CreditCard className="h-8 w-8" />
                </div>
                
                <div className="space-y-2 mb-8">
                  <div className="flex justify-between">
                    <span className="text-sm opacity-80">Card Number</span>
                  </div>
                  <div className="font-mono text-2xl tracking-widest">4234 5678 9012 3456</div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm opacity-80">Valid Thru</div>
                    <div className="text-lg">05/28</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-80">Card Holder</div>
                    <div className="text-lg text-right">JOHN DOE</div>
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