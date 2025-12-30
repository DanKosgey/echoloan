"use client"

export default function CreditCardAd() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-primary/5 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Introducing EcoCash Credit Card</h2>
            <p className="text-lg text-muted-foreground">
              Experience seamless payments and exclusive benefits with your EcoCash Card
            </p>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <style>{`
              @keyframes roll-card {
                0% {
                  transform: rotateY(0deg) rotateX(5deg);
                }
                50% {
                  transform: rotateY(360deg) rotateX(5deg);
                }
                100% {
                  transform: rotateY(0deg) rotateX(5deg);
                }
              }
              
              .rolling-card {
                animation: roll-card 4s infinite ease-in-out;
                transform-style: preserve-3d;
                perspective: 1000px;
              }
            `}</style>

            <div className="rolling-card">
              <div className="w-80 h-48 bg-gradient-to-br from-primary to-primary/90 rounded-2xl shadow-2xl flex flex-col justify-between p-8 border-2 border-white/20 relative overflow-hidden">
                {/* Card background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full blur-2xl"></div>
                  <div className="absolute bottom-4 left-4 w-20 h-20 bg-white rounded-full blur-2xl"></div>
                </div>

                {/* Card content */}
                <div className="relative z-10">
                  <div className="text-white/80 text-sm font-semibold">EcoCash</div>
                </div>

                <div className="relative z-10 text-center">
                  <h3 className="text-4xl font-bold text-white tracking-widest">EcoCash</h3>
                </div>

                <div className="relative z-10 flex justify-between items-end">
                  <div>
                    <p className="text-white/70 text-xs">CARDHOLDER</p>
                    <p className="text-white font-semibold">YOUR NAME</p>
                  </div>
                  <div className="text-white/80 text-lg font-bold">💳</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">💳</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Card Access</h3>
              <p className="text-sm text-muted-foreground">
                Get your virtual card instantly and start shopping online immediately
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">🎁</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Exclusive Rewards</h3>
              <p className="text-sm text-muted-foreground">Earn cashback and rewards on every purchase you make</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">🛡️</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Secure & Safe</h3>
              <p className="text-sm text-muted-foreground">
                Bank-level security with fraud protection on all transactions
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Apply for EcoCash Card
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
