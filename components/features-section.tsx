import { CreditCard, PiggyBank, TrendingUp, Shield, Clock, Zap } from 'lucide-react';

const features = [
  {
    title: "Instant Loans",
    description: "Get approved for loans in minutes with our automated system.",
    icon: <Zap className="h-6 w-6 text-primary" />
  },
  {
    title: "Low Interest Rates",
    description: "Competitive rates that help you save money over time.",
    icon: <TrendingUp className="h-6 w-6 text-primary" />
  },
  {
    title: "Secure Platform",
    description: "Bank-level security to protect your financial information.",
    icon: <Shield className="h-6 w-6 text-primary" />
  },
  {
    title: "24/7 Access",
    description: "Manage your finances anytime, anywhere with our mobile app.",
    icon: <Clock className="h-6 w-6 text-primary" />
  },
  {
    title: "Easy Repayment",
    description: "Flexible repayment options that fit your budget.",
    icon: <CreditCard className="h-6 w-6 text-primary" />
  },
  {
    title: "Savings Accounts",
    description: "Grow your money with our high-yield savings options.",
    icon: <PiggyBank className="h-6 w-6 text-primary" />
  }
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why Choose EcoCash?
            </h2>
            <p className="max-w-[900px] text-foreground/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We provide fast, secure, and affordable financial solutions to help you achieve your goals.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl bg-background shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}