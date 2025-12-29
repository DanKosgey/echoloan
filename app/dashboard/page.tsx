'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, PiggyBank, TrendingUp, Wallet, Menu, X, DollarSign, Users, BarChart3, PieChart } from 'lucide-react';

export default function DashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
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

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          console.error('Failed to fetch profile data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Loans', href: '/loans' },
  ];

  const quickActions = [
    { name: 'Apply Loan', icon: TrendingUp, href: '/loans/apply' },
  ];

  const stats = [
    { name: 'Total Balance', value: loading ? 'USD ...' : `USD ${(profileData?.profile?.balance || 0).toLocaleString()}`, icon: Wallet, change: '' },
    { name: 'Total Loans', value: loading ? '...' : `${profileData?.loan_count || 0}`, icon: TrendingUp, change: '' },
    { name: 'Savings', value: loading ? 'USD ...' : `USD ${(profileData?.profile?.savings || 0).toLocaleString()}`, icon: PiggyBank, change: '' },
    { name: 'Credit Limit', value: loading ? 'USD ...' : `USD ${(profileData?.profile?.credit_limit || 0).toLocaleString()}`, icon: CreditCard, change: '' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                  item.href === '/' 
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
          <h1 className="text-3xl font-bold">
            Welcome back, {loading ? '...' : profileData?.profile?.first_name || 'User'}!
          </h1>
          <p className="text-foreground/70">Here's your financial overview</p>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-card to-card/70 p-6 rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm font-medium">{stat.name}</p>
                  <h2 className="text-2xl font-bold mt-1">{stat.value}</h2>
                  {stat.change && (
                    <p className="text-xs text-green-500 mt-2 flex items-center">
                      <span className="flex h-2 w-2 mr-1">
                        <span className="animate-ping absolute h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative h-2 w-2 rounded-full bg-green-500"></span>
                      </span>
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-full bg-gradient-to-r from-primary to-primary/20 text-white">
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100/80">Main Balance</p>
                <h2 className="text-2xl font-bold mt-1">
                  {loading ? 'USD ...' : `USD ${(profileData?.profile?.balance || 0).toLocaleString()}`}
                </h2>
              </div>
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                <Wallet className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100/80">Savings</p>
                <h2 className="text-2xl font-bold mt-1">
                  {loading ? 'USD ...' : `USD ${(profileData?.profile?.savings || 0).toLocaleString()}`}
                </h2>
              </div>
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100/80">Available Credit</p>
                <h2 className="text-2xl font-bold mt-1">
                  {loading ? 'USD ...' : `USD ${(profileData?.profile?.credit_limit || 0).toLocaleString()}`}
                </h2>
              </div>
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-card to-card/70 rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="p-4 rounded-full bg-gradient-to-r from-primary to-primary/20 text-white mb-3">
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="font-medium">{action.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="bg-gradient-to-br from-card to-card/70 rounded-2xl border border-border shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-4 text-foreground/60 font-medium">Description</th>
                  <th className="text-right p-4 text-foreground/60 font-medium">Amount</th>
                  <th className="text-right p-4 text-foreground/60 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-foreground/70 py-8">Loading transactions...</td>
                  </tr>
                ) : profileData?.transactions && profileData.transactions.length > 0 ? (
                  profileData.transactions.map((transaction: any) => (
                    <tr key={transaction.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="p-4 font-medium">{transaction.description}</td>
                      <td className={`p-4 text-right ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                        {transaction.amount >= 0 ? '+' : ''}USD {Math.abs(transaction.amount).toLocaleString()}
                      </td>
                      <td className="p-4 text-right text-foreground/60">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-foreground/70 py-8">No transactions yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}