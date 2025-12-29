import { Star, Users, CheckCircle, Shield } from 'lucide-react';

const testimonials = [
  {
    name: "Tendai M.",
    role: "Small Business Owner",
    content: "EcoCash helped me expand my business with a quick loan. The process was smooth and the rates were fair.",
    rating: 5,
    avatar: "TM"
  },
  {
    name: "Sipho K.",
    role: "Student",
    content: "Got funding for my university fees in just 2 days. Highly recommend EcoCash for student loans.",
    rating: 5,
    avatar: "SK"
  },
  {
    name: "Precious C.",
    role: "Entrepreneur",
    content: "The best financial service I've used. Fast, reliable, and the customer service is excellent.",
    rating: 4,
    avatar: "PC"
  }
];

const stats = [
  { value: "98%", label: "Customer Satisfaction", icon: <CheckCircle className="h-5 w-5 text-primary" /> },
  { value: "24/7", label: "Customer Support", icon: <Shield className="h-5 w-5 text-primary" /> },
  { value: "10K+", label: "Active Users", icon: <Users className="h-5 w-5 text-primary" /> },
  { value: "4.8★", label: "Average Rating", icon: <Star className="h-5 w-5 text-primary" /> },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Trusted by Thousands
          </h2>
          <p className="max-w-[900px] text-foreground/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            See what our customers say about our financial services and experience.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-4 rounded-xl bg-background shadow-sm border"
            >
              <div className="p-2 rounded-full bg-primary/10 mb-2">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-foreground/70 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="flex flex-col p-6 rounded-xl bg-background shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-foreground/70 text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-foreground/30'}`} 
                  />
                ))}
              </div>
              
              <p className="text-foreground/80 flex-grow">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}