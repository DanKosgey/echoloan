"use client"

import { useEffect, useState } from "react"

interface LoanRecipient {
  id: number
  name: string
  loan: number
}

const recipients: LoanRecipient[] = [
  { id: 1, name: "Sarah Mwale", loan: 5000 },
  { id: 2, name: "John Ndlovu", loan: 8500 },
  { id: 3, name: "Tendai Chipawo", loan: 3200 },
  { id: 4, name: "Grace Sibanda", loan: 6750 },
  { id: 5, name: "Emmanuel Konde", loan: 4500 },
  { id: 6, name: "Naledi Moyo", loan: 7200 },
  { id: 7, name: "David Mutapi", loan: 5900 },
  { id: 8, name: "Precious Mahomo", loan: 9100 },
]

export default function LoanRecipients() {
  const [displayRecipients, setDisplayRecipients] = useState<LoanRecipient[]>([])

  useEffect(() => {
    // Create a continuous loop of recipients
    const loop = [...recipients, ...recipients]
    setDisplayRecipients(loop)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-blue-600 to-blue-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Loan Recipients</h2>
          <p className="text-blue-100">See who's benefiting from our quick loans</p>
        </div>

        <div className="relative overflow-hidden">
          <style>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .scrolling-container {
              animation: scroll 30s linear infinite;
              display: flex;
              gap: 1rem;
              width: fit-content;
            }
            .scrolling-container:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="scrolling-container">
            {displayRecipients.map((recipient, index) => (
              <div
                key={`${recipient.id}-${index}`}
                className="flex-shrink-0 bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow min-w-[280px]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{recipient.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{recipient.name}</p>
                    <p className="text-sm text-green-600 font-bold">Loan: ${recipient.loan.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-blue-100 mt-8 text-sm">
          Join thousands of satisfied customers who've received fast, flexible loans
        </p>
      </div>
    </section>
  )
}
