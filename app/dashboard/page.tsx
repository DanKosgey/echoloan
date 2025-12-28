"use client"

import { useEffect, useState } from "react"
import { User, LogOut, Wallet, CreditCard, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function UserDashboard() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isApplyOpen, setIsApplyOpen] = useState(false)
    const [loanAmount, setLoanAmount] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const fetchUserData = async () => {
        try {
            const res = await fetch("/api/user/me")
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
            } else {
                if (res.status === 401) window.location.href = "/login"
            }
        } catch (error) {
            console.error("Failed to fetch user", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        window.location.href = "/login"
    }

    const handleApplyLoan = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!loanAmount || isNaN(Number(loanAmount)) || Number(loanAmount) <= 0) {
            alert("Please enter a valid amount")
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch("/api/loans/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: loanAmount })
            })

            const data = await res.json()
            if (res.ok) {
                alert("Loan application submitted successfully!")
                setIsApplyOpen(false)
                setLoanAmount("")
                fetchUserData() // Refresh data
            } else {
                alert(data.error || "Failed to apply")
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading your profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <h1 className="text-2xl font-black">
                    <span className="text-blue-600">Eco</span><span className="text-red-600">Cash</span>
                </h1>
                <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </nav>

            <main className="max-w-4xl mx-auto p-6 space-y-6">

                {/* User Card */}
                <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <CardContent className="p-8 relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Welcome back,</p>
                                <h2 className="font-bold text-2xl">{user?.full_name || 'Valued Customer'}</h2>
                                <p className="text-blue-200 text-sm mt-1">{user?.ecocash_phone}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-blue-100 text-sm mb-1 uppercase tracking-wider font-semibold">Wallet Balance</p>
                                <h3 className="text-4xl font-bold tracking-tight">$ {Number(user?.account_balance || 0).toFixed(2)}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-100 text-sm mb-1 uppercase tracking-wider font-semibold">Loan Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md`}>
                                    {user?.loans?.[0]?.status === 'pending' ? 'Reviewing' : 'Active'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                        onClick={() => setIsApplyOpen(true)}
                        className="cursor-pointer hover:shadow-xl transition-all border-l-4 border-l-green-500 group"
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold group-hover:text-green-600 transition-colors">Apply for Loan</CardTitle>
                            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                <Wallet className="h-6 w-6 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Get instant cash deposited directly into your wallet. Low interest rates.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-xl transition-all border-l-4 border-l-purple-500 group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold group-hover:text-purple-600 transition-colors">History & Repayment</CardTitle>
                            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                <CreditCard className="h-6 w-6 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                View your past loan statements and make repayments easily.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity / Loans List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Recent Applications</h3>
                    {user?.loans && user.loans.length > 0 ? (
                        <div className="grid gap-4">
                            {user.loans.map((loan: any) => (
                                <Card key={loan.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Loan #{loan.id}</p>
                                            <p className="font-bold text-lg">$ {Number(loan.amount).toFixed(2)}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Applied on {new Date(loan.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide
                                                ${loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                ${loan.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                                                ${loan.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                                            `}>
                                                {loan.status}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-8 text-center border border-gray-100 border-dashed">
                            <p className="text-gray-500">No recent loan activity found.</p>
                            <Button variant="link" onClick={() => setIsApplyOpen(true)} className="mt-2 text-blue-600">
                                Apply for your first loan
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* Apply Loan Modal */}
            <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Apply for Personal Loan</DialogTitle>
                        <DialogDescription>
                            Enter the amount you wish to borrow. Interest rate: 15%.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleApplyLoan} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="amount" className="text-sm font-medium text-gray-700">Loan Amount ($)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="e.g. 500"
                                    className="pl-8 text-lg"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {loanAmount && !isNaN(Number(loanAmount)) && (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Principal:</span>
                                    <span className="font-medium">$ {Number(loanAmount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Interest (15%):</span>
                                    <span className="font-medium">$ {(Number(loanAmount) * 0.15).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-blue-600">
                                    <span>Total Repayment:</span>
                                    <span>$ {(Number(loanAmount) * 1.15).toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsApplyOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting || !loanAmount} className="bg-blue-600 hover:bg-blue-700">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {submitting ? "Submitting..." : "Submit Application"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    )
}
