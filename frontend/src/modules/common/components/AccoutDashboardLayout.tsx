'use client'
import React, { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/src/components/ui/card'
import PageHeader from '@/src/components/ui/PageHeader'
import { Button } from '@/src/components/ui/button'
import { Table, TableHeading, TableBody, TableRow, TableColumn } from '@/src/components/table'
import TabButton from '@/src/components/ui/TabButton'

const demoStats = [
  { label: 'Total Project', value: 250 },
  { label: 'Pending Project', value: 140 },
  { label: 'Successful Projects', value: 10 },
  { label: 'Cancel Projects', value: 100 },
]

const demoTransactions = [
  { id: 'tx-1', method: 'Stripe', amount: '6 INR', date: '03 Feb 2025, 2:05 PM (UTC)', status: 'Complete' },
  { id: 'tx-2', method: 'PayPal', amount: '8 INR', date: '02 Feb 2025, 12:30 PM (UTC)', status: 'Complete' },
  { id: 'tx-3', method: 'Stripe', amount: '12 INR', date: '01 Feb 2025, 9:12 AM (UTC)', status: 'Pending' },
]

const demoWithdrawals = [
  { id: 'wd-1', method: 'Bank Transfer', amount: '50 USD', date: '05 Feb 2025, 1:00 PM (UTC)', status: 'Processing' },
  { id: 'wd-2', method: 'PayPal', amount: '30 USD', date: '02 Feb 2025, 11:20 AM (UTC)', status: 'Complete' },
]

const demoProjects = Array.from({ length: 7 }).map((_, i) => ({
  id: `p-${i + 1}`,
  subcategory: 'office',
  price: '556 INR',
  status: i % 3 === 0 ? 'Earnings' : 'Complete',
}))

const AccoutDashboardLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payment' | 'withdraw'>('payment')
  return (
    <div className="px-4 md:px-8 lg:px-12 py-6">
      <PageHeader title="Dashboard" />

      {/* Main area */}
        <section className="mt-6">
          {/* Top stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {demoStats.map((s) => (
              <Card key={s.label} className="p-0">
                <CardContent className="p-3">
                  <div className="text-xs text-slate-500">{s.label}</div>
                  <div className="text-lg font-semibold mt-1">{s.value}</div>
                </CardContent>
              </Card>
            ))}

            <Card className="hidden lg:flex p-0">
              <CardContent className="p-3">
                <div className="text-xs text-slate-500">Total Add money</div>
                <div className="text-lg font-semibold mt-1">$150</div>
              </CardContent>
            </Card>

            <Card className="hidden lg:flex p-0">
              <CardContent className="p-3">
                <div className="text-xs text-slate-500">Total Withdrawn</div>
                <div className="text-lg font-semibold mt-1">$100</div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1 p-0">
              <CardContent className="p-3">
                <div className="text-xs text-slate-500">Current Balance</div>
                <div className="text-lg font-semibold mt-1">$50</div>
              </CardContent>
            </Card>
          </div>

          {/* Chart + Payments + Projects */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <main className="lg:col-span-8">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription className="text-xs">Money in / Money out</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" /> Money in
                      <span className="inline-block w-2 h-2 bg-slate-300 rounded-full ml-2" /> Money out
                    </div>
                    <div className="flex items-center gap-2">
                      <select className="text-xs border rounded px-2 py-1">
                        <option>2025</option>
                      </select>
                      <select className="text-xs border rounded px-2 py-1">
                        <option>July</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 bg-white">
                    <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
                      <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points="0,120 50,100 100,95 150,80 200,90 250,70 300,85 350,60 400,70 450,50 500,65 550,55 600,40" />
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                  {/* Payment / Withdraw tabs */}
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TabButton label="Payment" isActive={activeTab === 'payment'} onClick={() => setActiveTab('payment')} />
                      <TabButton label="Withdraw" isActive={activeTab === 'withdraw'} onClick={() => setActiveTab('withdraw')} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input placeholder="Search" className="text-sm border rounded px-2 py-1" />
                      <button className="px-3 py-1 text-sm rounded bg-secondary text-base-400">Up</button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Show payments or withdrawals based on active tab */}
                    {activeTab === 'payment' ? (
                      <Table>
                        <TableHeading>
                          <TableColumn isHeader>TRANSACTION ID</TableColumn>
                          <TableColumn isHeader>METHOD</TableColumn>
                          <TableColumn isHeader>AMOUNT</TableColumn>
                          <TableColumn isHeader>DATE & TIME</TableColumn>
                          <TableColumn isHeader>STATUS</TableColumn>
                          <TableColumn isHeader>ACTION</TableColumn>
                        </TableHeading>
                        <TableBody>
                          {demoTransactions.map((t) => (
                            <TableRow key={t.id}>
                              <TableColumn>{t.id}</TableColumn>
                              <TableColumn>{t.method}</TableColumn>
                              <TableColumn>{t.amount}</TableColumn>
                              <TableColumn>{t.date}</TableColumn>
                              <TableColumn>
                                <span className={`px-2 py-1 rounded text-xs ${t.status === 'Complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status}</span>
                              </TableColumn>
                              <TableColumn>
                                <Button variant="outline" size="sm">View</Button>
                              </TableColumn>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Table>
                        <TableHeading>
                          <TableColumn isHeader>WITHDRAW ID</TableColumn>
                          <TableColumn isHeader>METHOD</TableColumn>
                          <TableColumn isHeader>AMOUNT</TableColumn>
                          <TableColumn isHeader>DATE & TIME</TableColumn>
                          <TableColumn isHeader>STATUS</TableColumn>
                          <TableColumn isHeader>ACTION</TableColumn>
                        </TableHeading>
                        <TableBody>
                          {demoWithdrawals.map((w) => (
                            <TableRow key={w.id}>
                              <TableColumn>{w.id}</TableColumn>
                              <TableColumn>{w.method}</TableColumn>
                              <TableColumn>{w.amount}</TableColumn>
                              <TableColumn>{w.date}</TableColumn>
                              <TableColumn>
                                <span className={`px-2 py-1 rounded text-xs ${w.status === 'Complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{w.status}</span>
                              </TableColumn>
                              <TableColumn>
                                <Button variant="outline" size="sm">View</Button>
                              </TableColumn>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
            </main>

            <aside className="lg:col-span-4">
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Current Balance</div>
                      <div className="text-xl font-semibold mt-1">$50</div>
                    </div>
                    <div className="space-y-2">
                      <Button size="sm">Add Money</Button>
                      <Button variant="outline" size="sm">Withdraw</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Recent Projects</CardTitle>
                  <div className="flex items-center gap-2">
                    <input placeholder="Search" className="text-sm border rounded px-2 py-1" />
                    <button className="px-3 py-1 text-sm rounded bg-white border">Up</button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeading>
                      <TableColumn isHeader>ID</TableColumn>
                      <TableColumn isHeader>SUBCATEGORY</TableColumn>
                      <TableColumn isHeader>PRICE</TableColumn>
                      <TableColumn isHeader>STATUS</TableColumn>
                      <TableColumn isHeader>ACTION</TableColumn>
                    </TableHeading>
                    <TableBody>
                      {demoProjects.map((p) => (
                        <TableRow key={p.id}>
                          <TableColumn>{p.id}</TableColumn>
                          <TableColumn>{p.subcategory}</TableColumn>
                          <TableColumn>{p.price}</TableColumn>
                          <TableColumn>
                            <span className={`px-2 py-1 rounded text-xs ${p.status === 'Complete' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{p.status}</span>
                          </TableColumn>
                          <TableColumn>
                            <Button variant="outline" size="sm">View</Button>
                          </TableColumn>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
    </div>
  )
}

export default AccoutDashboardLayout