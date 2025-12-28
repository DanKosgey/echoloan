"use client"

import { useEffect, useState } from "react"
import { User, LogOut, Wallet, CreditCard, TrendingUp, Clock, CheckCircle, AlertCircle, Building2, Briefcase, ArrowRight, FileText, Shield, Zap, Award, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function UserDashboard() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isApplyOpen, setIsApplyOpen] = useState(false)
    const [loanData, setLoanData] = useState({
        amount: "",
        purpose: "",
        duration: "30",
        employmentStatus: "",
        monthlyIncome: "",
        nationalId: ""
    })
    const [submitting, setSubmitting] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)

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

    const handleNext = () => {
        if (currentStep === 1 && (!loanData.amount || !loanData.purpose)) {
            alert("Please fill in all fields")
            return
        }
        if (currentStep === 2 && (!loanData.employmentStatus || !loanData.monthlyIncome || !loanData.nationalId)) {
            alert("Please complete your information")
            return
        }
        setCurrentStep(currentStep + 1)
    }

    const handleApplyLoan = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        await new Promise(resolve => setTimeout(resolve, 2000))

        try {
            const res = await fetch("/api/loans/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loanData)
            })

            const data = await res.json()
            if (res.ok) {
                alert("✅ Loan application submitted! We'll review and get back to you within 24 hours.")
                setIsApplyOpen(false)
                setLoanData({ amount: "", purpose: "", duration: "30", employmentStatus: "", monthlyIncome: "", nationalId: "" })
                setCurrentStep(1)
                fetchUserData()
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
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg">Loading your dashboard...</p>
                    <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
                </div>
            </div>
        )
    }

    const totalBorrowed = user?.loans?.reduce((sum: number, loan: any) => sum + Number(loan.amount), 0) || 0
    const activeLoan = user?.loans?.find((l: any) => l.status === 'approved')
    const pendingLoans = user?.loans?.filter((l: any) => l.status === 'pending').length || 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Enhanced Navigation - Fully Responsive */}
            <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight">
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Eco</span>
                                <span className="bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">Cash</span>
                            </h1>
                            <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-medium hidden sm:block">Financial Freedom Simplified</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold transition-all text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4"
                    >
                        <LogOut className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Logout</span>
                    </Button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 md:space-y-8">

                {/* Enhanced Hero Card with Glassmorphism */}
                <Card className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white border-none shadow-2xl overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>

                    <CardContent className="p-8 relative z-10">
                        <div className="flex items-start justify-between mb-10">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white/30 rounded-3xl blur-xl"></div>
                                    <div className="relative p-5 bg-white/20 rounded-3xl backdrop-blur-md border border-white/30">
                                        <User className="w-12 h-12 text-white drop-shadow-lg" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <p className="text-blue-100 text-sm font-semibold tracking-wide">Welcome back,</p>
                                        <div className="px-3 py-1 bg-green-400/20 rounded-full border border-green-300/30 backdrop-blur-sm">
                                            <span className="text-green-100 text-xs font-bold flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                                                ACTIVE
                                            </span>
                                        </div>
                                    </div>
                                    <h2 className="font-black text-4xl mb-2 tracking-tight">{user?.full_name || 'Valued Customer'}</h2>
                                    <p className="text-blue-100 font-medium flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        {user?.ecocash_phone}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                <p className="text-blue-100 text-xs uppercase tracking-wider font-bold mb-1">Member Since</p>
                                <p className="font-bold text-xl">{new Date(user?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                                <p className="text-blue-200 text-xs mt-1">Premium Member</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <Wallet className="w-6 h-6 text-white" />
                                        </div>
                                        <Award className="w-5 h-5 text-yellow-300 opacity-70" />
                                    </div>
                                    <p className="text-blue-100 text-xs uppercase tracking-wider font-bold mb-2">Wallet Balance</p>
                                    <h3 className="text-4xl font-black tracking-tight mb-1">$0.00</h3>
                                    <p className="text-xs text-blue-200/80">Ready for your first deposit</p>
                                </div>
                            </div>

                            <div className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="px-2 py-1 bg-green-400/20 rounded-full">
                                            <span className="text-green-100 text-xs font-bold">{user?.loans?.length || 0}</span>
                                        </div>
                                    </div>
                                    <p className="text-blue-100 text-xs uppercase tracking-wider font-bold mb-2">Total Borrowed</p>
                                    <h3 className="text-4xl font-black tracking-tight mb-1">${totalBorrowed.toFixed(2)}</h3>
                                    <p className="text-xs text-blue-200/80">{user?.loans?.length || 0} loan application(s)</p>
                                </div>
                            </div>

                            <div className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        {pendingLoans > 0 && (
                                            <div className="flex">
                                                <span className="flex h-3 w-3 relative">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-blue-100 text-xs uppercase tracking-wider font-bold mb-2">Pending Review</p>
                                    <h3 className="text-4xl font-black tracking-tight mb-1">{pendingLoans}</h3>
                                    <p className="text-xs text-blue-200/80">Applications under review</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Enhanced Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card
                        onClick={() => setIsApplyOpen(true)}
                        className="relative cursor-pointer overflow-hidden border-2 border-transparent hover:border-green-400 transition-all duration-300 group bg-gradient-to-br from-green-50 via-white to-emerald-50 hover:shadow-2xl hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-400/0 group-hover:from-green-400/5 group-hover:to-emerald-400/5 transition-all duration-300"></div>
                        <CardHeader className="relative z-10">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-green-500/50">
                                    <Zap className="h-7 w-7 text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                            </div>
                            <CardTitle className="text-xl font-bold group-hover:text-green-600 transition-colors mb-2">Apply for Loan</CardTitle>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Get instant approval with competitive rates
                            </p>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Quick Approval</span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Low Rates</span>
                            </div>
                            <div className="flex items-center text-green-600 font-bold text-sm">
                                <span>Start Application</span>
                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-2 border-transparent hover:border-purple-400 hover:shadow-2xl transition-all duration-300 group bg-gradient-to-br from-purple-50 via-white to-violet-50 hover:-translate-y-1 cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-400/0 group-hover:from-purple-400/5 group-hover:to-violet-400/5 transition-all duration-300"></div>
                        <CardHeader className="relative z-10">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-purple-500/50">
                                    <FileText className="h-7 w-7 text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                            </div>
                            <CardTitle className="text-xl font-bold group-hover:text-purple-600 transition-colors mb-2">Loan History</CardTitle>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Track all your applications and repayments
                            </p>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Statements</span>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">Reports</span>
                            </div>
                            <div className="flex items-center text-purple-600 font-bold text-sm">
                                <span>View History</span>
                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-2 border-transparent hover:border-blue-400 hover:shadow-2xl transition-all duration-300 group bg-gradient-to-br from-blue-50 via-white to-cyan-50 hover:-translate-y-1 cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-400/0 group-hover:from-blue-400/5 group-hover:to-cyan-400/5 transition-all duration-300"></div>
                        <CardHeader className="relative z-10">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-blue-500/50">
                                    <TrendingUp className="h-7 w-7 text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                            </div>
                            <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors mb-2">Credit Score</CardTitle>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Monitor and improve your creditworthiness
                            </p>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Score Check</span>
                                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">Insights</span>
                            </div>
                            <div className="flex items-center text-blue-600 font-bold text-sm">
                                <span>Check Score</span>
                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Loan Alert - Enhanced */}
                {activeLoan && (
                    <Card className="relative overflow-hidden border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-transparent opacity-50"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
                                        <AlertCircle className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-black text-xl text-gray-900">Active Loan</h4>
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">IN PROGRESS</span>
                                        </div>
                                        <p className="text-gray-700 font-medium">
                                            Outstanding balance: <span className="font-black text-orange-600 text-lg">${Number(activeLoan.amount).toFixed(2)}</span>
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">Click to view repayment schedule and details</p>
                                    </div>
                                </div>
                                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all">
                                    View Details
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Enhanced Recent Applications Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 mb-1">Recent Applications</h3>
                            <p className="text-gray-600">Track and manage your loan applications</p>
                        </div>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold group">
                            View All
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {user?.loans && user.loans.length > 0 ? (
                        <div className="grid gap-5">
                            {user.loans.map((loan: any, index: number) => (
                                <Card
                                    key={loan.id}
                                    className="group border-2 border-gray-200 hover:border-blue-400 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardContent className="p-7">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className={`relative p-5 rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 ${loan.status === 'pending' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                                    loan.status === 'approved' ? 'bg-gradient-to-br from-green-400 to-emerald-600' :
                                                        'bg-gradient-to-br from-red-400 to-pink-600'
                                                    }`}>
                                                    {loan.status === 'pending' && <Clock className="w-8 h-8 text-white" />}
                                                    {loan.status === 'approved' && <CheckCircle className="w-8 h-8 text-white" />}
                                                    {loan.status === 'rejected' && <AlertCircle className="w-8 h-8 text-white" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Loan #{loan.id}</p>
                                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide shadow-sm ${loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                                                            loan.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-300' :
                                                                'bg-red-100 text-red-700 border border-red-300'
                                                            }`}>
                                                            {loan.status}
                                                        </span>
                                                    </div>
                                                    <p className="font-black text-3xl text-gray-900 mb-2">${Number(loan.amount).toFixed(2)}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            Applied {new Date(loan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        {loan.repayment_amount && (
                                                            <span className="flex items-center gap-1 font-semibold">
                                                                <CreditCard className="w-4 h-4" />
                                                                Repay: ${Number(loan.repayment_amount).toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-bold group-hover:shadow-lg transition-all"
                                            >
                                                Details
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="relative overflow-hidden border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 hover:opacity-100 transition-opacity"></div>
                            <CardContent className="p-16 text-center relative z-10">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center">
                                    <Wallet className="w-12 h-12 text-blue-600" />
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 mb-3">No Applications Yet</h4>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                                    Start your journey to financial freedom with a quick and easy loan application
                                </p>
                                <Button
                                    onClick={() => setIsApplyOpen(true)}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Zap className="w-5 h-5 mr-2" />
                                    Apply for Your First Loan
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            {/* Enhanced Loan Application Modal */}
            <Dialog open={isApplyOpen} onOpenChange={(open) => {
                setIsApplyOpen(open)
                if (!open) {
                    setCurrentStep(1)
                    setLoanData({ amount: "", purpose: "", duration: "30", employmentStatus: "", monthlyIncome: "", nationalId: "" })
                }
            }}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                    Loan Application
                                </DialogTitle>
                                <DialogDescription className="text-base">
                                    Complete your application in {currentStep === 1 ? '2' : currentStep === 2 ? '1' : '0'} more step{currentStep === 1 ? 's' : ''}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Enhanced Progress Indicator */}
                    <div className="flex items-center justify-between my-8 px-4">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300 shadow-lg ${currentStep >= step
                                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white scale-110'
                                        : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                                    </div>
                                    <span className={`text-xs font-bold mt-2 ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {step === 1 ? 'Loan Details' : step === 2 ? 'Personal Info' : 'Review'}
                                    </span>
                                </div>
                                {step < 3 && (
                                    <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ${currentStep > step ? 'w-full' : 'w-0'
                                                }`}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleApplyLoan} className="space-y-6">
                        {/* Step 1: Loan Details */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                                <div className="space-y-3">
                                    <Label htmlFor="amount" className="text-base font-bold text-gray-900">Loan Amount</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-black text-xl">$</span>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="Enter amount (e.g. 1000)"
                                            className="pl-10 text-xl font-bold h-14 border-2 focus:border-blue-500 rounded-xl"
                                            value={loanData.amount}
                                            onChange={(e) => setLoanData({ ...loanData, amount: e.target.value })}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="purpose" className="text-base font-bold text-gray-900">Loan Purpose</Label>
                                    <Select value={loanData.purpose} onValueChange={(val) => setLoanData({ ...loanData, purpose: val })}>
                                        <SelectTrigger className="h-14 border-2 rounded-xl font-semibold text-left">
                                            <SelectValue placeholder="Select purpose" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="business" className="cursor-pointer hover:bg-blue-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                    <span className="font-semibold">Business Expansion</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="education" className="cursor-pointer hover:bg-purple-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Award className="w-5 h-5 text-purple-600" />
                                                    <span className="font-semibold">Education</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="medical" className="cursor-pointer hover:bg-red-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                                    <span className="font-semibold">Medical Emergency</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="home" className="cursor-pointer hover:bg-green-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Building2 className="w-5 h-5 text-green-600" />
                                                    <span className="font-semibold">Home Improvement</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="debt" className="cursor-pointer hover:bg-orange-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className="w-5 h-5 text-orange-600" />
                                                    <span className="font-semibold">Debt Consolidation</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="other" className="cursor-pointer hover:bg-gray-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5 text-gray-600" />
                                                    <span className="font-semibold">Other</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="duration" className="text-base font-bold text-gray-900">Repayment Period</Label>
                                    <Select value={loanData.duration} onValueChange={(val) => setLoanData({ ...loanData, duration: val })}>
                                        <SelectTrigger className="h-14 border-2 rounded-xl font-semibold text-left">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="30" className="cursor-pointer hover:bg-blue-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-blue-600" />
                                                    <span className="font-semibold">30 Days</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="60" className="cursor-pointer hover:bg-indigo-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-indigo-600" />
                                                    <span className="font-semibold">60 Days</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="90" className="cursor-pointer hover:bg-purple-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-purple-600" />
                                                    <span className="font-semibold">90 Days</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {loanData.amount && !isNaN(Number(loanData.amount)) && (
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 rounded-2xl space-y-3 shadow-lg">
                                        <h4 className="font-black text-lg text-gray-900 mb-4">Loan Summary</h4>
                                        <div className="space-y-3 text-base">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-semibold">Principal Amount:</span>
                                                <span className="font-black text-lg">${Number(loanData.amount).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-semibold">Interest (15%):</span>
                                                <span className="font-black text-lg text-blue-600">${(Number(loanData.amount) * 0.15).toFixed(2)}</span>
                                            </div>
                                            <div className="border-t-2 border-blue-300 my-3 pt-3 flex justify-between font-black text-xl">
                                                <span className="text-gray-900">Total Repayment:</span>
                                                <span className="text-blue-700">${(Number(loanData.amount) * 1.15).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Personal Information */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                                <div className="space-y-3">
                                    <Label htmlFor="employment" className="text-base font-bold text-gray-900">Employment Status</Label>
                                    <Select value={loanData.employmentStatus} onValueChange={(val) => setLoanData({ ...loanData, employmentStatus: val })}>
                                        <SelectTrigger className="h-14 border-2 rounded-xl font-semibold text-left">
                                            <SelectValue placeholder="Select employment status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="employed" className="cursor-pointer hover:bg-blue-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Briefcase className="w-5 h-5 text-blue-600" />
                                                    <span className="font-semibold">Employed</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="self-employed" className="cursor-pointer hover:bg-green-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-5 h-5 text-green-600" />
                                                    <span className="font-semibold">Self-Employed</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="business" className="cursor-pointer hover:bg-purple-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Building2 className="w-5 h-5 text-purple-600" />
                                                    <span className="font-semibold">Business Owner</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="unemployed" className="cursor-pointer hover:bg-gray-50 py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5 text-gray-600" />
                                                    <span className="font-semibold">Unemployed</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="income" className="text-base font-bold text-gray-900">Monthly Income</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-black text-xl">$</span>
                                        <Input
                                            id="income"
                                            type="number"
                                            placeholder="Enter monthly income"
                                            className="pl-10 text-xl font-bold h-14 border-2 focus:border-blue-500 rounded-xl"
                                            value={loanData.monthlyIncome}
                                            onChange={(e) => setLoanData({ ...loanData, monthlyIncome: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="nationalId" className="text-base font-bold text-gray-900">National ID / Passport</Label>
                                    <Input
                                        id="nationalId"
                                        type="text"
                                        placeholder="e.g. 63-123456A78"
                                        className="text-lg font-semibold h-14 border-2 focus:border-blue-500 rounded-xl"
                                        value={loanData.nationalId}
                                        onChange={(e) => setLoanData({ ...loanData, nationalId: e.target.value })}
                                    />
                                </div>

                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 p-5 rounded-2xl flex items-start gap-4 shadow-lg">
                                    <div className="p-2 bg-yellow-400 rounded-xl">
                                        <AlertCircle className="w-6 h-6 text-yellow-900" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-yellow-900 mb-2">Verification Required</p>
                                        <p className="text-sm text-yellow-800 leading-relaxed">
                                            We may request additional documents to verify your identity and income for security purposes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 space-y-6 border-2 border-gray-200">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl">
                                            <FileText className="w-7 h-7 text-white" />
                                        </div>
                                        <h4 className="font-black text-2xl text-gray-900">Application Summary</h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Loan Amount</p>
                                            <p className="font-black text-3xl text-blue-600">${Number(loanData.amount).toFixed(2)}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Purpose</p>
                                            <p className="font-bold text-xl text-gray-900 capitalize">{loanData.purpose}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Duration</p>
                                            <p className="font-bold text-xl text-gray-900">{loanData.duration} Days</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Employment</p>
                                            <p className="font-bold text-xl text-gray-900 capitalize">{loanData.employmentStatus.replace('-', ' ')}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Monthly Income</p>
                                            <p className="font-bold text-xl text-gray-900">${Number(loanData.monthlyIncome).toFixed(2)}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">ID Number</p>
                                            <p className="font-bold text-xl text-gray-900">{loanData.nationalId}</p>
                                        </div>
                                    </div>

                                    <div className="border-t-2 border-gray-300 pt-6 mt-6">
                                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl text-white shadow-xl">
                                            <div className="flex justify-between items-center">
                                                <span className="text-blue-100 font-bold text-lg">Total Repayment Amount:</span>
                                                <span className="text-4xl font-black">${(Number(loanData.amount) * 1.15).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 p-5 rounded-2xl flex items-start gap-4 shadow-lg">
                                    <div className="p-2 bg-green-400 rounded-xl">
                                        <CheckCircle className="w-6 h-6 text-green-900" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-green-900 mb-2">Fast Approval Process</p>
                                        <p className="text-sm text-green-800 leading-relaxed">
                                            Most applications are reviewed within 24 hours. You'll receive an SMS notification once your application is processed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="mt-8 flex gap-3">
                            {currentStep > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="border-2 font-bold"
                                >
                                    ← Back
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsApplyOpen(false)}
                                className="border-2 font-bold"
                            >
                                Cancel
                            </Button>
                            {currentStep < 3 ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold shadow-lg"
                                >
                                    Next Step →
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-bold shadow-lg"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Submit Application
                                        </>
                                    )}
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}