"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResetPinPage() {
    const searchParams = useSearchParams()
    const phone = searchParams.get("phone") || ""

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [newPin, setNewPin] = useState(["", "", "", ""])
    const [confirmPin, setConfirmPin] = useState(["", "", "", ""])
    const [showPin, setShowPin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)
        if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
    }

    const handlePinChange = (index: number, value: string, setter: any, current: string[]) => {
        if (!/^\d*$/.test(value)) return
        const newP = [...current]
        newP[index] = value.slice(-1)
        setter(newP)
        // Simple auto-focus logic could go here
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPin.join("") !== confirmPin.join("")) {
            setError("PINs do not match")
            return
        }

        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/reset-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone,
                    otp: otp.join(""),
                    newPin: newPin.join("")
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Reset failed")
            }

            // Success -> Redirect to Login via Loading
            const details = encodeURIComponent("Updating security credentials...")
            window.location.href = `/loading-secure?next=/login&message=${details}`

        } catch (err: any) {
            setError(err.message || "Failed to reset PIN")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Security PIN</h2>
                <p className="text-center text-sm text-gray-500 mb-8">Enter the OTP sent to {phone} and set your new PIN.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP Section */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Verification Code (OTP)</label>
                        <div className="flex gap-2 justify-between">
                            {otp.map((digit, i) => (
                                <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    className="w-10 h-12 text-center text-xl font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            ))}
                        </div>
                    </div>

                    {/* New PIN */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">New 4-Digit PIN</label>
                        <div className="flex gap-4 justify-center">
                            {newPin.map((digit, i) => (
                                <input key={`n-${i}`} type={showPin ? "text" : "password"} maxLength={1} value={digit}
                                    onChange={(e) => handlePinChange(i, e.target.value, setNewPin, newPin)}
                                    className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Confirm PIN */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Confirm New PIN</label>
                        <div className="flex gap-4 justify-center">
                            {confirmPin.map((digit, i) => (
                                <input key={`c-${i}`} type={showPin ? "text" : "password"} maxLength={1} value={digit}
                                    onChange={(e) => handlePinChange(i, e.target.value, setConfirmPin, confirmPin)}
                                    className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                                />
                            ))}
                        </div>
                    </div>

                    <button type="button" onClick={() => setShowPin(!showPin)} className="block mx-auto text-sm text-blue-600 font-semibold">
                        {showPin ? "Hide PINs" : "Show PINs"}
                    </button>

                    {error && <p className="text-red-500 text-sm text-center font-bold px-4 py-2 bg-red-50 rounded-lg">{error}</p>}

                    <Button type="submit" disabled={loading} className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
                        {loading ? "Updating..." : "Reset PIN"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
