"use client"

import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/images/image.png" alt="EcoCash Logo" width={180} height={48} priority className="h-12 w-auto" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Calculator
          </a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>
      </div>
    </header>
  )
}
