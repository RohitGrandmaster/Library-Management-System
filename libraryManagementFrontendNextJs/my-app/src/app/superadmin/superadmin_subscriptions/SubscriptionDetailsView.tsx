"use client";
import React, { useState } from 'react';
import { 
  CreditCard, Activity, ArrowLeft, Terminal, Shield, MoreVertical, 
  Power, PauseCircle, RefreshCw, Edit, ShieldAlert, CheckCircle, 
  ArrowUpCircle, ArrowDownCircle, Banknote, CalendarClock, Ban, Receipt
} from 'lucide-react';

const DRILLDOWN_TABS = [
  "Overview", "Usage & Limits", "Invoices", "Payments", "Refunds", 
  "Coupons / Discounts", "Subscription History"
];

const getTabMeta = (tab: string) => {
  switch(tab) {
    case "Usage & Limits": return { icon: <Activity size={24} />, color: "text-purple-600", bg: "bg-purple-100" };
    case "Invoices":
    case "Payments": return { icon: <Banknote size={24} />, color: "text-emerald-600", bg: "bg-emerald-100" };
    case "Refunds": return { icon: <Receipt size={24} />, color: "text-orange-600", bg: "bg-orange-100" };
    case "Coupons / Discounts": return { icon: <CheckCircle size={24} />, color: "text-teal-600", bg: "bg-teal-100" };
    case "Subscription History": return { icon: <CalendarClock size={24} />, color: "text-amber-600", bg: "bg-amber-100" };
    default: return { icon: <CreditCard size={24} />, color: "text-pink-600", bg: "bg-pink-100" };
  }
};

export default function SubscriptionDetailsView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showOpsMenu, setShowOpsMenu] = useState(false);

  const meta = getTabMeta(activeTab);

  const notify = (msg: string) => {
    window.alert(msg);
  };

  const renderTabContent = () => {
    if (activeTab === "Overview") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-in fade-in duration-300">
          {[
            ['Active Tenants', '12', <Activity size={20} />],
            ['Total Revenue', '$23,880', <Banknote size={20} />],
            ['Pending Renewals', '3', <CalendarClock size={20} />],
            ['Coupons Used', '45', <CheckCircle size={20} />],
          ].map(([label, value, icon]) => (
            <div key={label as string} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E293B] p-5">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0F172A] flex items-center justify-center text-pink-600 shadow-sm">{icon}</div>
              <p className="text-xs font-bold text-gray-500 mt-4">{label as string}</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{value as string}</p>
            </div>
          ))}
          <div className="sm:col-span-2 xl:col-span-4 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mt-2 bg-gray-50 dark:bg-[#1E293B]">
            <h4 className="font-extrabold text-gray-900 dark:text-white mb-4">Plan Limits Configuration</h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#0F172A] border shadow-sm">
              <div>
                <p className="font-bold text-pink-600 flex items-center gap-2"><CreditCard size={16}/> Pro Monthly Plan Base</p>
                <p className="text-xs font-bold text-gray-500 mt-1">Includes 5 Libraries, 100GB Storage, Priority Support</p>
              </div>
              <button onClick={() => notify('Opening plan settings...')} className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-bold">Edit Limits</button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "Usage & Limits") {
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Storage", used: 85, total: 100, unit: "GB", icon: <Terminal size={20} className="text-blue-500"/>, status: "Warning" },
              { title: "Members", used: 450, total: 1000, unit: "Users", icon: <Activity size={20} className="text-emerald-500"/>, status: "Normal" },
              { title: "API Calls", used: 99000, total: 100000, unit: "Reqs", icon: <Activity size={20} className="text-red-500"/>, status: "Critical" },
            ].map((limit, i) => (
              <div key={i} className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      {limit.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{limit.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Limit: {limit.total} {limit.unit}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                    limit.status === 'Critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    limit.status === 'Warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>
                    {limit.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-700 dark:text-gray-300">{limit.used} {limit.unit}</span>
                    <span className="text-gray-500 dark:text-gray-400">{(limit.used / limit.total * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        limit.status === 'Critical' ? 'bg-red-500' :
                        limit.status === 'Warning' ? 'bg-yellow-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, limit.used / limit.total * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "Invoices") {
      const invoices = [
        { id: 'INV-2024-001', date: 'Oct 01, 2024', amount: 199.00, status: 'Paid', org: 'StudyNest Patna' },
        { id: 'INV-2024-002', date: 'Nov 01, 2024', amount: 199.00, status: 'Paid', org: 'Readers Den Delhi' },
        { id: 'INV-2024-003', date: 'Dec 01, 2024', amount: 199.00, status: 'Pending', org: 'LibroHub Mumbai' },
        { id: 'INV-2024-004', date: 'Jan 01, 2025', amount: 199.00, status: 'Overdue', org: 'Knowledge Lounge' },
      ];
      
      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-white">Recent Invoices</h4>
            <button className="text-sm font-bold text-pink-600 hover:text-pink-700 dark:text-pink-400">Download All PDF</button>
          </div>
          
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-gray-100">{inv.id}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{inv.date}</td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">{inv.org}</td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">${inv.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-block ${
                          inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          inv.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button className="text-gray-400 hover:text-pink-600 transition-colors">
                            <Terminal size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === "Payments") {
      const payments = [
        { id: 'PAY-991', date: 'Oct 01, 2024', method: 'Stripe', amount: 199.00, status: 'Success', invoice: 'INV-2024-001' },
        { id: 'PAY-992', date: 'Nov 01, 2024', method: 'PayPal', amount: 199.00, status: 'Success', invoice: 'INV-2024-002' },
        { id: 'PAY-993', date: 'Dec 01, 2024', method: 'Bank Transfer', amount: 199.00, status: 'Processing', invoice: 'INV-2024-003' },
        { id: 'PAY-994', date: 'Jan 01, 2025', method: 'Credit Card', amount: 199.00, status: 'Failed', invoice: 'INV-2024-004' },
      ];

      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Related Invoice</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {payments.map(pay => (
                    <tr key={pay.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-900 dark:text-gray-100">{pay.id}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{pay.date}</td>
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-gray-400"/> {pay.method}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">${pay.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{pay.invoice}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
                          pay.status === 'Success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          pay.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {pay.status === 'Success' && <CheckCircle size={12}/>}
                          {pay.status === 'Processing' && <RefreshCw size={12} className="animate-spin"/>}
                          {pay.status === 'Failed' && <Ban size={12}/>}
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === "Refunds") {
      const refunds = [
        { id: 'REF-001', date: 'Sep 15, 2024', amount: 49.00, reason: 'Duplicate Charge', status: 'Processed', org: 'BookHaven BLR' },
        { id: 'REF-002', date: 'Dec 10, 2024', amount: 199.00, reason: 'Service Cancellation', status: 'Pending', org: 'Knowledge Lounge' },
      ];

      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex justify-between items-center">
              <h4 className="font-bold text-gray-900 dark:text-white">Refund Requests</h4>
              <button className="px-4 py-2 bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400 text-sm font-bold rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors">
                Initiate New Refund
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Refund ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {refunds.map(ref => (
                    <tr key={ref.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-900 dark:text-gray-100">{ref.id}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{ref.date}</td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">{ref.org}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{ref.reason}</td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">${ref.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          ref.status === 'Processed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {ref.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "Coupons / Discounts") {
      const coupons = [
        { code: 'WELCOME50', desc: '50% OFF First Month', status: 'Active', used: 12, max: 100, expires: 'Never' },
        { code: 'YEARLY20', desc: '20% OFF Annual Subscription', status: 'Active', used: 5, max: 50, expires: 'Dec 31, 2024' },
        { code: 'BLACKFRIDAY', desc: '30% OFF All Plans', status: 'Expired', used: 89, max: 200, expires: 'Nov 30, 2023' },
      ];

      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-pink-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-pink-700 transition-colors flex items-center gap-2">
              <CheckCircle size={16} /> Create New Coupon
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon, i) => (
              <div key={i} className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full opacity-20 ${coupon.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-extrabold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-3 py-1 rounded-lg border border-pink-100 dark:border-pink-900/30">
                      {coupon.code}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                    coupon.status === 'Active' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {coupon.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">{coupon.desc}</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-500">Usage</span>
                      <span className="text-gray-700 dark:text-gray-300">{coupon.used} / {coupon.max}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                      <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${(coupon.used / coupon.max) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <CalendarClock size={14} /> Expires: {coupon.expires}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === "Subscription History") {
      const history = [
        { id: 'LOG-1', action: 'Plan Base Price Updated', user: 'SuperAdmin (Rohit)', date: 'Feb 12, 2024, 10:30 AM', icon: <Edit size={16}/>, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { id: 'LOG-2', action: 'Storage Limit Increased', user: 'System (Auto-Scale)', date: 'Mar 01, 2024, 02:15 PM', icon: <ArrowUpCircle size={16}/>, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
        { id: 'LOG-3', action: 'API Rate Limit Warning Triggered', user: 'System Monitor', date: 'Apr 10, 2024, 09:45 AM', icon: <ShieldAlert size={16}/>, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
        { id: 'LOG-4', action: 'Plan Created', user: 'SuperAdmin (Admin)', date: 'Jan 01, 2024, 09:00 AM', icon: <CheckCircle size={16}/>, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
      ];

      return (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Audit Log & Timeline</h4>
            <div className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-4 space-y-8">
              {history.map((log, i) => (
                <div key={i} className="relative pl-8">
                  <span className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white dark:border-[#1E293B] ${log.bg} ${log.color}`}>
                    {log.icon}
                  </span>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h5 className="font-bold text-gray-900 dark:text-white">{log.action}</h5>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{log.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Shield size={14} className="text-gray-400"/>
                      Performed by: <span className="font-bold text-gray-800 dark:text-gray-200">{log.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const operations = [
    { label: "Assign Plan", icon: <Edit size={14} />, color: "text-blue-600 hover:bg-blue-50" },
    { label: "Upgrade Plan", icon: <ArrowUpCircle size={14} />, color: "text-emerald-600 hover:bg-emerald-50" },
    { label: "Downgrade Plan", icon: <ArrowDownCircle size={14} />, color: "text-orange-600 hover:bg-orange-50" },
    { label: "Renew Subscription", icon: <RefreshCw size={14} />, color: "text-teal-600 hover:bg-teal-50" },
    { label: "Extend Trial", icon: <CalendarClock size={14} />, color: "text-purple-600 hover:bg-purple-50" },
    { label: "Suspend Subscription", icon: <PauseCircle size={14} />, color: "text-yellow-600 hover:bg-yellow-50" },
    { label: "Resume Subscription", icon: <Power size={14} />, color: "text-emerald-600 hover:bg-emerald-50" },
    { label: "Cancel Subscription", icon: <Ban size={14} />, color: "text-red-600 hover:bg-red-50" },
    { label: "Issue Refund", icon: <Banknote size={14} />, color: "text-rose-600 hover:bg-rose-50" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full h-full flex-1 animate-in fade-in zoom-in-95 duration-300">
      {/* Header & Subscription Operations */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg p-6">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
          <div className="flex-1">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-pink-600 mb-4 transition-colors">
              <ArrowLeft size={14} /> Back to All Plans & Subscriptions
            </button>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 flex items-center justify-center text-pink-600 dark:text-pink-400 font-extrabold text-2xl shadow-inner border border-white/50 dark:border-white/5">
                PRO
              </div>
              
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3 mb-1">
                  Pro Monthly Plan 
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[11px] uppercase tracking-wider border border-emerald-200 dark:border-emerald-800 shadow-sm flex items-center gap-1.5">
                    Active
                  </span>
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                  <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-bold">$199.00 / mo</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5"><Activity size={14} /> 5 Libraries limit</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">Currently assigned to 12 organizations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operations Control Panel */}
          <div className="relative">
            <button 
              onClick={() => setShowOpsMenu(!showOpsMenu)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-200 transition-all hover:border-gray-400"
            >
              Subscription Actions <MoreVertical size={16} className="text-gray-400" />
            </button>

            {showOpsMenu && (
              <div className="absolute right-0 top-14 w-64 bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                <div className="px-3 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">SuperAdmin Actions</p>
                </div>
                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                  {operations.map((op, idx) => (
                    <button key={idx} onClick={() => { notify(op.label + ' action triggered.'); setShowOpsMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${op.color} dark:hover:bg-gray-800 text-left`}>
                      {op.icon} {op.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drilldown Navigation */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden flex flex-col h-full">
        <div className="flex overflow-x-auto border-b [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0D1F3C]/30">
          {DRILLDOWN_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all border-b-2 outline-none ${
                activeTab === tab 
                  ? 'border-pink-600 text-pink-600 bg-pink-50/50 dark:bg-pink-900/20' 
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Dynamic Tab Content Area */}
        <div className="p-8 min-h-[500px] flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-2xl ${meta.bg} dark:bg-opacity-20 flex items-center justify-center ${meta.color} shadow-sm`}>
              {meta.icon}
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{activeTab}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Viewing detailed {activeTab.toLowerCase()} data for the Pro Monthly Plan.</p>
            </div>
          </div>
          
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

