"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, ShieldCheck, Database, Server } from "lucide-react"

export default function SecureLoadingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const nextUrl = searchParams.get("next") || "/dashboard"
    const message = searchParams.get("message") || "Processing secure transaction..."

    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState("Initializing secure connection...")

    useEffect(() => {
        const totalDuration = 5000 // 5 seconds
        const intervalTime = 100 // update every 100ms
        const steps = totalDuration / intervalTime

        let currentStep = 0

        const timer = setInterval(() => {
            currentStep++
            const newProgress = Math.min((currentStep / steps) * 100, 100)
            setProgress(newProgress)

            // Dynamic status updates for "cool" factor
            if (newProgress > 10 && newProgress < 30) setStatus("Encrypting user data...")
            if (newProgress > 30 && newProgress < 50) setStatus("Verifying credentials with secure server...")
            if (newProgress > 50 && newProgress < 70) setStatus("Syncing with profile database...")
            if (newProgress > 70 && newProgress < 90) setStatus("Finalizing secure handshake...")
            if (newProgress >= 90) setStatus("Redirecting...")

            if (currentStep >= steps) {
                clearInterval(timer)
                router.push(nextUrl)
            }
        }, intervalTime)

        return () => clearInterval(timer)
    }, [router, nextUrl])

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-white to-white z-0" />

            <div className="max-w-md w-full relative z-10 text-center space-y-8">
                {/* Logo/Icon Animation */}
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20" />
                    <div className="relative bg-white p-6 rounded-full shadow-xl border-2 border-blue-100 flex items-center justify-center">
                        <ShieldCheck className="w-10 h-10 text-blue-600 animate-pulse" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        Safe<span className="text-blue-600">Guard</span> Processing
                    </h1>
                    <p className="text-gray-500 font-medium">{message}</p>
                    <p className="text-sm text-blue-600 font-semibold h-6">{status}</p>
                </div>

                {/* Customized Progress Bar */}
                <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-100 ease-linear rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 font-medium">
                        <span>0%</span>
                        <span>{Math.round(progress)}%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Tech Decorators */}
                <div className="flex justify-center gap-8 pt-8 opacity-40 grayscale">
                    <div className="flex flex-col items-center gap-1">
                        <Database className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] text-gray-400">DB_SYNC</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Server className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] text-gray-400">SECURE_GW</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
