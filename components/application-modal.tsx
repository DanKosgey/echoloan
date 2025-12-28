"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
}

type ApplicationStep = "personal" | "loan-details" | "review" | "success"

export default function ApplicationModal({ isOpen, onClose }: ApplicationModalProps) {
  const router = useRouter()
  const [applicationStep, setApplicationStep] = useState<ApplicationStep>("personal")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    loanAmount: "",
    loanPurpose: "",
    repaymentPeriod: "",
    incomeSource: "",
  })

  const handleApplicationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validatePersonalDetails = () => {
    if (!formData.firstName.trim()) {
      setError("Full name is required")
      return false
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Valid email is required")
      return false
    }
    setError("")
    return true
  }

  const validateLoanDetails = () => {
    if (!formData.loanAmount || Number.parseInt(formData.loanAmount) <= 0) {
      setError("Loan amount must be greater than 0")
      return false
    }
    if (!formData.loanPurpose) {
      setError("Loan purpose is required")
      return false
    }
    if (!formData.repaymentPeriod) {
      setError("Repayment period is required")
      return false
    }
    if (!formData.incomeSource) {
      setError("Income source is required")
      return false
    }
    setError("")
    return true
  }

  const handleNextStep = () => {
    if (applicationStep === "personal") {
      if (validatePersonalDetails()) {
        setApplicationStep("loan-details")
      }
    } else if (applicationStep === "loan-details") {
      if (validateLoanDetails()) {
        setApplicationStep("review")
      }
    }
  }

  const handlePrevStep = () => {
    if (applicationStep === "loan-details") {
      setApplicationStep("personal")
    } else if (applicationStep === "review") {
      setApplicationStep("loan-details")
    }
  }

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const applicationData = {
      ...formData,
      submittedAt: new Date().toISOString(),
    }

    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      })
      setApplicationStep("success")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setApplicationStep("personal")
      setFormData({
        firstName: "",
        email: "",
        phone: "",
        loanAmount: "",
        loanPurpose: "",
        repaymentPeriod: "",
        incomeSource: "",
      })
      setError("")
    }, 300)
  }

  if (!isOpen) return null

  const StepIndicator = () => {
    const steps = [
      { number: 1, label: "Personal", id: "personal" },
      { number: 2, label: "Loan Details", id: "loan-details" },
      { number: 3, label: "Review", id: "review" },
    ]

    const stepOrder = ["personal", "loan-details", "review"]
    const currentStepIndex = stepOrder.indexOf(applicationStep)

    return (
      <div className="flex items-center justify-between mb-8 px-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                  index < currentStepIndex
                    ? "bg-blue-600 text-white"
                    : index === currentStepIndex
                      ? "bg-blue-600 text-white ring-4 ring-blue-200"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {index < currentStepIndex ? <Check className="w-7 h-7" /> : step.number}
              </div>
              <p
                className={`text-sm font-medium mt-2 ${index <= currentStepIndex ? "text-blue-600" : "text-gray-400"}`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-2 ${index < currentStepIndex ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Apply for a Loan</h1>
            <p className="text-blue-100 text-sm mt-1">
              {applicationStep === "success" ? "Application Complete" : "Complete your application in 3 simple steps"}
            </p>
          </div>
          <button onClick={handleClose} className="text-white hover:bg-blue-600 p-2 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Step Indicator */}
        {applicationStep !== "success" && <StepIndicator />}

        {/* Content */}
        <div className="px-8 py-8">
          {applicationStep === "success" ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
              <p className="text-gray-600 text-lg mb-2">
                We'll review your application and contact you within 24 hours.
              </p>
              <p className="text-gray-500">
                A confirmation email has been sent to <span className="font-semibold">{formData.email}</span>
              </p>
              <p className="text-gray-500 text-sm mt-4">Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              {applicationStep === "personal" && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleApplicationChange}
                        required
                        className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleApplicationChange}
                        required
                        className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleApplicationChange}
                      required
                      className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="+263 77 123 4567"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-lg transition-all"
                  >
                    Continue to Loan Details
                  </Button>
                </div>
              )}

              {applicationStep === "loan-details" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Loan Amount Needed ($)</label>
                    <input
                      type="number"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleApplicationChange}
                      required
                      className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="10,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Loan Purpose</label>
                    <select
                      name="loanPurpose"
                      value={formData.loanPurpose}
                      onChange={handleApplicationChange}
                      required
                      className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="">Select a purpose</option>
                      <option value="business">Business Expansion</option>
                      <option value="education">Education</option>
                      <option value="home">Home Improvement</option>
                      <option value="vehicle">Vehicle Purchase</option>
                      <option value="debt">Debt Consolidation</option>
                      <option value="emergency">Emergency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Repayment Period</label>
                      <select
                        name="repaymentPeriod"
                        value={formData.repaymentPeriod}
                        onChange={handleApplicationChange}
                        required
                        className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        <option value="">Select period</option>
                        <option value="3-months">3 Months</option>
                        <option value="6-months">6 Months</option>
                        <option value="12-months">12 Months</option>
                        <option value="24-months">24 Months</option>
                        <option value="36-months">36 Months</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Income Source</label>
                      <select
                        name="incomeSource"
                        value={formData.incomeSource}
                        onChange={handleApplicationChange}
                        required
                        className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                      >
                        <option value="">Select source</option>
                        <option value="employment">Employment</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="business">Business</option>
                        <option value="investment">Investment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-4 text-lg rounded-lg transition-all"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-lg transition-all"
                    >
                      Review Application
                    </Button>
                  </div>
                </div>
              )}

              {applicationStep === "review" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold mb-1">FULL NAME</p>
                        <p className="text-base font-semibold text-gray-900">{formData.firstName}</p>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold mb-1">EMAIL</p>
                        <p className="text-base font-semibold text-gray-900">{formData.email}</p>
                      </div>
                      <div className="bg-white p-3 rounded md:col-span-2">
                        <p className="text-xs text-gray-600 font-semibold mb-1">PHONE</p>
                        <p className="text-base font-semibold text-gray-900">{formData.phone}</p>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4">Loan Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold mb-1">LOAN AMOUNT</p>
                        <p className="text-2xl font-bold text-blue-600">${formData.loanAmount}</p>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold mb-1">PURPOSE</p>
                        <p className="text-base font-semibold text-gray-900 capitalize">{formData.loanPurpose}</p>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold mb-1">REPAYMENT PERIOD</p>
                        <p className="text-base font-semibold text-gray-900">{formData.repaymentPeriod}</p>
                      </div>
                      <div className="bg-white p-3 rounded">
                        <p className="text-xs text-gray-600 font-semibold mb-1">INCOME SOURCE</p>
                        <p className="text-base font-semibold text-gray-900 capitalize">{formData.incomeSource}</p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded">
                    By submitting this application, you agree to our terms and conditions. We'll review your information
                    and contact you within 24 hours.
                  </p>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-4 text-lg rounded-lg transition-all"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg rounded-lg transition-all"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin inline" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
