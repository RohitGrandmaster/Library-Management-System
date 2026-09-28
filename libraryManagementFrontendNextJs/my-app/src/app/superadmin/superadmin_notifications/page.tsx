'use client';
import { useState } from 'react';
import { 
  BellRing, Megaphone, Send, Mail, MessageSquare, Phone, 
  Smartphone, Clock, List, FileX, AlertTriangle, ShieldCheck, 
  Zap, Wrench, Handshake, ShieldAlert, WifiOff
} from 'lucide-react';

import BroadcastForm from './BroadcastForm';

const SUB_MENUS = [
  "Notification Dashboard", "System Announcements", "Broadcasts", 
  "Email Templates", "SMS Templates", "WhatsApp Templates", "Push Templates", 
  "Scheduled Notifications", "Notification Queue", "Delivery Logs", "Failed Notifications"
];

// Mock Data for Notification Triggers
const notificationTriggers = [
  { id: '1', name: 'Welcome Library', desc: 'Sent when a new tenant library completes registration.', icon: <Handshake size={20} />, active: true },
  { id: '2', name: 'User Created', desc: 'Sent to new users with login credentials.', icon: <Users size={20} />, active: true },
  { id: '3', name: 'Subscription Expiry', desc: 'Warning sent 7 days and 1 day before expiry.', icon: <Clock size={20} />, active: true },
  { id: '4', name: 'System Maintenance', desc: 'Platform-wide scheduled downtime alert.', icon: <Wrench size={20} />, active: false },
  { id: '5', name: 'Security Alert', desc: 'Triggered on suspicious login or permission changes.', icon: <ShieldAlert size={20} />, active: true },
  { id: '6', name: 'Service Outage', desc: 'Emergency broadcast for unexpected downtime.', icon: <WifiOff size={20} />, active: false },
  { id: '7', name: 'Backup Failure', desc: 'Internal alert to SuperAdmin on backup job fail.', icon: <AlertTriangle size={20} />, active: true },
  { id: '8', name: 'Platform Announcement', desc: 'General newsletter or new feature release.', icon: <Megaphone size={20} />, active: false },
];

export default function NotificationsPage() {
  const [activeMenu, setActiveMenu] = useState("Notification Dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "Broadcasts":
        return <BroadcastForm />;
        
      case "Email Templates":
      case "SMS Templates":
      case "WhatsApp Templates":
      case "Push Templates":
        return (
          <div className="border-2 border-dashed border-rose-200 dark:border-rose-900/30 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-rose-50/30 dark:bg-rose-900/10 animate-in zoom-in-95 duration-500">
            <div className="p-5 bg-rose-100 dark:bg-rose-900/40 rounded-full mb-6 shadow-inner">
              {activeMenu.includes("Email") ? <Mail size={48} className="text-rose-500" /> : 
               activeMenu.includes("SMS") ? <MessageSquare size={48} className="text-rose-500" /> : 
               activeMenu.includes("WhatsApp") ? <Phone size={48} className="text-rose-500" /> : 
               <Smartphone size={48} className="text-rose-500" />}
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">{activeMenu} Editor</h4>
            <p className="text-gray-500 font-medium max-w-lg mx-auto mb-8">
              Visual builder for {activeMenu.toLowerCase()} will load here. You can insert dynamic variables like {"{{library_name}}"} and {"{{user_name}}"}.
            </p>
            <button className="px-6 py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 transition-all">
              Create New Template
            </button>
          </div>
        );

      case "Notification Dashboard":
      case "System Announcements":
      default:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { title: 'Messages Sent (24h)', value: '14,204', icon: <Send size={20} />, color: 'emerald' },
                { title: 'Queue Pending', value: '342', icon: <List size={20} />, color: 'yellow' },
                { title: 'Delivery Failures', value: '12', icon: <FileX size={20} />, color: 'red' },
                { title: 'Active Templates', value: '45', icon: <Mail size={20} />, color: 'rose' }
              ].map(stat => (
                <div key={stat.title} className="bg-white dark:bg-[#0F172A] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                      {stat.icon}
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.title}</h3>
                  </div>
                  <div className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Triggers Management */}
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C]">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="text-rose-500" size={24} /> System Notification Triggers
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Configure automated communication logic for system events.</p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {notificationTriggers.map((trigger) => (
                  <div key={trigger.id} className="group p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E293B] hover:border-rose-300 dark:hover:border-rose-700 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors`}>
                        {trigger.icon}
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={trigger.active} />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5 leading-tight">{trigger.name}</h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 line-clamp-2">{trigger.desc}</p>
                    
                    <button className="w-full mt-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-900/20 dark:hover:border-rose-800 transition-all">
                      Edit Logic
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Page Header */}
      <div>
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-rose-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Notifications</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl shadow-sm border border-rose-200/50 dark:border-rose-800/50">
                <BellRing size={28} className="text-rose-600 dark:text-rose-400" />
              </div>
              Notifications & Communication
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage system announcements, configure templates, and broadcast alerts to libraries and users.</p>
          </div>
          <button onClick={() => setActiveMenu('Broadcasts')} className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 transition-all">
            <Megaphone size={16} /> New Broadcast
          </button>
        </div>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all shadow-sm ${
              activeMenu === menu 
                ? 'bg-rose-600 text-white shadow-rose-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-rose-50 dark:hover:bg-[#1E293B] hover:text-rose-600 hover:border-rose-200'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="w-full mt-2">
        {renderContent()}
      </div>
    </div>
  );
}

// Inline Users icon since it wasn't imported at top to save space
function Users(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
