
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
  const [loadingMessage, setLoadingMessage] = useState("")

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setPhoneNumber(value)
  }

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanPhone = phoneNumber.startsWith("0") ? phoneNumber.slice(1) : phoneNumber
    const fullPhone = `${selectedCountry.dial}${cleanPhone}`.replace(/\s/g, "")

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
          pin: pin.join(""),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 404) {
          if (confirm("Account not found. Would you like to Sign Up?")) {
            window.location.href = "/register"
            setLoading(false)
          } else {
            setLoading(false)
          }
          return
        }
        throw new Error(data.error || "Login failed")
      }

      const details = encodeURIComponent("Verifying credentials...")
      const otpUrl = data.redirect
        ? `${data.redirect}${data.redirect.includes('?') ? '&' : '?'}phone=${fullPhone}`
        : `/login/otp?phone=${encodeURIComponent(fullPhone)}`

      const nextUrl = encodeURIComponent(otpUrl)

      window.location.href = `/loading-secure?next=${nextUrl}&message=${details}`

    } catch (error) {
      console.error(error)
      alert("Login failed. Please check your credentials.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar - Fully Responsive */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-xs sm:text-sm md:text-base"
        >
          <Home className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span className="hidden xs:inline">Home</span>
        </Link>
        <div className="text-[10px] sm:text-xs md:text-sm text-green-500 font-semibold">Secure</div>
      </div>

      {/* Main Content - Fully Responsive */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        {/* Logo - Responsive */}
        <div className="mb-6 sm:mb-8 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black">
            <span className="text-blue-600">Eco</span>
            <span className="text-red-600">Cash</span>
          </h1>
        </div>

        {/* Login Section - Responsive */}
        <div className="w-full max-w-md px-2 sm:px-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4 sm:mb-6 md:mb-10">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Phone Number Input - Fully Responsive */}
            <div>
              <div className="relative flex items-center border-2 border-blue-500 rounded-lg sm:rounded-xl overflow-hidden bg-blue-50/50">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4 bg-transparent hover:bg-black/5 transition-colors border-r border-blue-200 min-w-[80px] sm:min-w-[100px] md:min-w-[120px]">
                      <span className="text-lg sm:text-xl md:text-2xl">{selectedCountry.flag}</span>
                      <span className="text-gray-700 font-semibold text-xs sm:text-sm md:text-base">{selectedCountry.dial}</span>
                      <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[180px] sm:w-[200px] bg-white border border-gray-200 shadow-xl z-50">
                    {COUNTRIES.map((country) => (
                      <DropdownMenuItem
                        key={country.code}
                        onClick={() => setSelectedCountry(country)}
                        className="gap-2 cursor-pointer py-2"
                      >
                        <span className="text-lg sm:text-xl">{country.flag}</span>
                        <span className="font-medium flex-1 text-sm">{country.name}</span>
                        <span className="text-muted-foreground text-xs">{country.dial}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Phone number"
                  className="flex-1 px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4 bg-transparent text-sm sm:text-base md:text-lg font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  maxLength={12}
                />
              </div>
            </div>

            {/* PIN Input - Fully Responsive */}
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                <label className="text-xs sm:text-sm md:text-base font-semibold text-gray-700">Enter PIN</label>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
                </button>
              </div>
              <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type={showPin ? "text" : "password"}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    maxLength={1}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-center text-lg sm:text-xl md:text-2xl font-bold border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Forgot PIN Link - Responsive */}
            <div className="text-center">
              <Link href="/forgot-pin" className="text-xs sm:text-sm md:text-base text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Forgot PIN?
              </Link>
            </div>

            {/* Login Button - Fully Responsive */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 md:py-6 text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm sm:text-base">{loadingMessage || "Logging in..."}</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>

            {/* Sign Up Link - Responsive */}
            <p className="text-center text-xs sm:text-sm md:text-base text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Footer - Fully Responsive */}
      <div className="bg-gray-50 border-t border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        <div className="max-w-4xl mx-auto text-center space-y-1 sm:space-y-2 md:space-y-3">
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
          <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">© 2025 EcoCash. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
