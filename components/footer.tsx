import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">EcoCash</span>
            </div>
            <p className="text-foreground/70 mb-4">
              Providing fast, secure, and affordable financial solutions to help you achieve your goals.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-foreground/70 hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/loans" className="text-foreground/70 hover:text-primary transition-colors">Loans</Link></li>
              <li><Link href="/cards" className="text-foreground/70 hover:text-primary transition-colors">Credit Cards</Link></li>
              <li><Link href="/savings" className="text-foreground/70 hover:text-primary transition-colors">Savings</Link></li>
              <li><Link href="/about" className="text-foreground/70 hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/loans" className="text-foreground/70 hover:text-primary transition-colors">Personal Loans</Link></li>
              <li><Link href="/loans" className="text-foreground/70 hover:text-primary transition-colors">Business Loans</Link></li>
              <li><Link href="/cards" className="text-foreground/70 hover:text-primary transition-colors">Credit Cards</Link></li>
              <li><Link href="/savings" className="text-foreground/70 hover:text-primary transition-colors">Savings Accounts</Link></li>
              <li><Link href="/insurance" className="text-foreground/70 hover:text-primary transition-colors">Insurance</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-foreground/70">+263 12 345 6789</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-foreground/70">info@ecocash.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-foreground/70">123 Finance Street, Harare, Zimbabwe</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-foreground/70">
          <p>© {new Date().getFullYear()} EcoCash. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}