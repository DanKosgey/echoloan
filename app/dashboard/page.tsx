"use client"

import { useEffect, useState } from "react"
import { User, LogOut, Wallet, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserDashboard() {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        // You would fetch user details here from an endpoint like /api/me
        // For now we just mock
        setUser({ phone: "+263 77 123 4567" })
    }, [])

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        window.location.href = "/login"
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-black">
                    <span className="text-blue-600">Eco</span><span className="text-red-600">Cash</span>
                </h1>
                <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </nav>

            <main className="max-w-4xl mx-auto p-6 space-y-6">
                <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-full">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm">Welcome back</p>
                                <p className="font-bold text-xl">{user?.phone}</p>
                            </div>
                        </div>
                        <div className="mt-8">
                            <p className="text-blue-100 text-sm mb-1">Available Loan Limit</p>
                            <h2 className="text-4xl font-bold">$ 500.00</h2>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card onClick={() => alert("Apply feature coming soon!")} className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">Apply for Loan</CardTitle>
                            <Wallet className="h-5 w-5 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">Get instant cash based on your usage.</p>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">My History</CardTitle>
                            <CreditCard className="h-5 w-5 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">View past applications and repayments.</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
