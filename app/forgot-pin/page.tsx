"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ForgotPinPage() {
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/forgot-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneIdentifier: phone })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to initiate reset")
            }

            // Redirect to loading page -> reset page
            const details = encodeURIComponent("Sending reset code...")
            const nextUrl = encodeURIComponent(`/forgot-pin/reset?phone=${encodeURIComponent(phone)}`)
            window.location.href = `/loading-secure?next=${nextUrl}&message=${details}`

        } catch (err: any) {
            setError(err.message || "Something went wrong")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>
                <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    <Home className="w-5 h-5" />
                </Link>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Forgot PIN?</h2>
                    <p className="text-gray-600 text-center mb-8">Enter your registered phone number to reset your PIN.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="+263 77 123 4567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
                            />
                            <p className="text-xs text-gray-500 mt-2 px-1">Include country code (e.g. +263)</p>
                        </div>

                        {error && <p className="text-red-500 text-center text-sm font-semibold">{error}</p>}

                        <Button
                            type="submit"
                            disabled={loading || !phone}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg rounded-xl"
                        >
                            {loading ? "Verifying..." : "Send Reset Code"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
