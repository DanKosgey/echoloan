'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, PiggyBank, TrendingUp, Wallet, Menu, X, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function LoansPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated by checking for token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to login
      router.push('/login');
    }
  }, [router]);

  // Fetch user's loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch('/api/user/loans');
        if (response.ok) {
          const data = await response.json();
          setLoans(data.loans || []);
        }
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const menuItems = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Loans', href: '/loans' },
  ];

  const loanStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'repaid':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const loanStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'repaid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="flex flex-col h-full bg-background">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="block py-2 px-4 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EcoCash</span>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  item.href === '/loans' 
                    ? 'text-foreground' 
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Loans</h1>
          <p className="text-foreground/70">Manage your loan applications and payments</p>
        </div>

        {/* Loan actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <a
            href="/loans/apply"
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Apply for Loan
          </a>
        </div>

        {/* Loan summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70">Total Loans</p>
                <h2 className="text-2xl font-bold">{loans.length}</h2>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70">Active Loans</p>
                <h2 className="text-2xl font-bold">
                  {loans.filter(loan => loan.status === 'approved' || loan.status === 'pending').length}
                </h2>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70">Total Amount</p>
                <h2 className="text-2xl font-bold">
                  USD {loans.reduce((sum, loan) => sum + (loan.amount || 0), 0).toLocaleString()}
                </h2>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Loan history */}
        <div>
          <h2 className="text-xl font-bold mb-4">Loan History</h2>
          {loading ? (
            <div className="bg-card rounded-xl border shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-foreground/70">Loading your loans...</p>
            </div>
          ) : loans.length === 0 ? (
            <div className="bg-card rounded-xl border shadow-sm p-8 text-center">
              <PiggyBank className="h-12 w-12 text-primary/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No loans yet</h3>
              <p className="text-foreground/70 mb-4">You haven't applied for any loans.</p>
              <a
                href="/loans/apply"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Apply for Loan
              </a>
            </div>
          ) : (
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4">Loan ID</th>
                    <th className="text-left p-4">Amount</th>
                    <th className="text-left p-4">Repayment</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-right p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id} className="border-b">
                      <td className="p-4">#{loan.id}</td>
                      <td className="p-4">USD {loan.amount?.toLocaleString()}</td>
                      <td className="p-4">USD {loan.repayment_amount?.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {loanStatusIcon(loan.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${loanStatusColor(loan.status)}`}>
                            {loan.status?.charAt(0).toUpperCase() + loan.status?.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {new Date(loan.created_at || loan.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}