'use client';
import { useState } from 'react';
import { 
  BellRing, Megaphone, Send, Mail, MessageSquare, Phone, 
  Smartphone, Clock, List, FileX, AlertTriangle, ShieldCheck, 
  Zap, Wrench, Handshake, ShieldAlert, WifiOff, Users, Edit3, Settings2
} from 'lucide-react';

import BroadcastForm from './BroadcastForm';

const SUB_MENUS = [
  { id: "Delivery Dashboard", icon: BellRing, color: "rose", tabClass: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400", iconClass: "text-rose-600 dark:text-rose-400" },
  { id: "Broadcast Center", icon: Megaphone, color: "blue", tabClass: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400" },
  { id: "System Event Triggers", icon: Zap, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" },
  { id: "Template Builder", icon: Edit3, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" }
];

// Mock Data for Notification Triggers
const notificationTriggers = [
  { id: '1', name: 'Welcome Library', desc: 'Sent when a new tenant library completes registration.', icon: Handshake, active: true, channels: ['Email', 'In-App'] },
  { id: '2', name: 'User Created', desc: 'Sent to new users with login credentials.', icon: Users, active: true, channels: ['Email', 'SMS'] },
  { id: '3', name: 'Subscription Expiry', desc: 'Warning sent 7 days and 1 day before expiry.', icon: Clock, active: true, channels: ['Email', 'In-App', 'SMS'] },
  { id: '4', name: 'System Maintenance', desc: 'Platform-wide scheduled downtime alert.', icon: Wrench, active: false, channels: ['In-App'] },
  { id: '5', name: 'Security Alert', desc: 'Triggered on suspicious login or permission changes.', icon: ShieldAlert, active: true, channels: ['Email', 'SMS', 'Push'] },
  { id: '6', name: 'Service Outage', desc: 'Emergency broadcast for unexpected downtime.', icon: WifiOff, active: false, channels: ['Push', 'SMS'] },
  { id: '7', name: 'Backup Failure', desc: 'Internal alert to SuperAdmin on backup job fail.', icon: AlertTriangle, active: true, channels: ['Email'] },
];

export default function NotificationsPage() {
  const [activeMenu, setActiveMenu] = useState("Delivery Dashboard");
  const [activeTemplate, setActiveTemplate] = useState("Email");

  const renderContent = () => {
    switch (activeMenu) {
      case "Broadcast Center":
        return <BroadcastForm />;
        
      case "Template Builder":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row min-h-[600px]">
            {/* Sidebar for Template Types */}
            <div className="w-full md:w-64 bg-gray-50 dark:bg-[#1E293B] border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-2 shrink-0">
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Channels</h3>
              {[
                { id: 'Email', icon: Mail, color: 'text-blue-500' },
                { id: 'SMS', icon: MessageSquare, color: 'text-emerald-500' },
                { id: 'WhatsApp', icon: Phone, color: 'text-emerald-500' },
                { id: 'Push (Mobile)', icon: Smartphone, color: 'text-indigo-500' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplate(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all text-left ${activeTemplate === t.id ? 'bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-[#0F172A]/50 border border-transparent'}`}
                >
                  <t.icon size={18} className={t.color} /> {t.id}
                </button>
              ))}
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-gray-50/30 dark:bg-[#0D1F3C]/20 relative">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-6 bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl mb-6 border border-gray-100 dark:border-gray-700">
                  {activeTemplate === 'Email' ? <Mail size={48} className="text-blue-500" /> : 
                  activeTemplate === 'SMS' ? <MessageSquare size={48} className="text-emerald-500" /> : 
                  activeTemplate === 'WhatsApp' ? <Phone size={48} className="text-emerald-500" /> : 
                  <Smartphone size={48} className="text-indigo-500" />}
                </div>
                <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">{activeTemplate} Template Builder</h4>
                <p className="text-gray-500 font-medium max-w-md mx-auto mb-8 leading-relaxed">
                  Visual builder for {activeTemplate.toLowerCase()} will load here. You can insert dynamic variables like <code className="text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-1.5 py-0.5 rounded font-bold">{"{{library_name}}"}</code> and <code className="text-rose-500 bg-rose-50 dark:bg-rose-900/30 px-1.5 py-0.5 rounded font-bold">{"{{user_name}}"}</code>.
                </p>
                <button className="px-6 py-3.5 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-xl shadow-lg transition-all flex items-center gap-2">
                  <Edit3 size={18} /> Open Visual Editor
                </button>
              </div>
            </div>
          </div>
        );

      case "System Event Triggers":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-amber-50/50 dark:bg-amber-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <Zap size={24} /> Automated Event Triggers
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Configure automated communication logic for system events.</p>
              </div>
              <button className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2">
                + Create Custom Trigger
              </button>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notificationTriggers.map((trigger) => {
                const Icon = trigger.icon;
                return (
                  <div key={trigger.id} className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E293B] hover:border-amber-300 dark:hover:border-amber-700 transition-all shadow-sm flex flex-col h-full relative overflow-hidden">
                    {trigger.active && <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full"></div>}
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className={`p-3.5 rounded-xl transition-colors ${trigger.active ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        <Icon size={24} />
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={trigger.active} readOnly />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">{trigger.name}</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 flex-1">{trigger.desc}</p>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <div className="flex gap-2">
                        {trigger.channels.map(ch => (
                          <span key={ch} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-extrabold uppercase tracking-wider rounded-md border border-gray-200 dark:border-gray-700">
                            {ch}
                          </span>
                        ))}
                      </div>
                      <button className="text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                        <Settings2 size={18} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        );

      case "Delivery Dashboard":
      default:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { title: 'Messages Sent (24h)', value: '14,204', icon: <Send size={24} />, color: 'emerald' },
                { title: 'Queue Pending', value: '342', icon: <List size={24} />, color: 'amber' },
                { title: 'Delivery Failures', value: '12', icon: <FileX size={24} />, color: 'rose' },
                { title: 'Active Templates', value: '45', icon: <Mail size={24} />, color: 'blue' }
              ].map(stat => (
                <div key={stat.title} className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:shadow-lg transition-shadow cursor-default">
                  <div>
                    <h3 className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">{stat.title}</h3>
                    <div className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</div>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center border border-${stat.color}-100 dark:border-${stat.color}-800/50 shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden p-8 flex flex-col items-center justify-center min-h-[400px] border-dashed border-2">
               <BellRing size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
               <h3 className="text-lg font-extrabold text-gray-600 dark:text-gray-400">Message Delivery Telemetry</h3>
               <p className="text-sm text-gray-400 mt-2 font-medium">Delivery success rate charts and queue latency will appear here.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-0 h-full">
      
      {/* Page Header */}
      <div className="shrink-0">
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-rose-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Communication</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-sm border border-rose-200/50 dark:border-rose-800/50">
                <Megaphone size={24} />
              </div>
              Notifications & Communication
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage system broadcasts, configure automated event triggers, and design email/SMS templates.</p>
          </div>
        </div>
      </div>

      {/* Sub-menu Grid */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {SUB_MENUS.map(menu => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;
          
          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`flex flex-col items-center justify-center p-4 gap-2 rounded-2xl border text-center transition-all ${
                isActive 
                  ? `${menu.tabClass} shadow-md scale-[1.02]`
                  : 'bg-white dark:bg-[#0F172A] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-white shadow-sm'
              }`}
            >
              <Icon size={20} className={isActive ? menu.iconClass : 'opacity-70'} />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">{menu.id}</span>
            </button>
          )
        })}
      </div>

      {/* Dynamic Content */}
      <div className="w-full flex-1 min-h-0 overflow-y-auto pb-6 custom-scrollbar pr-2">
        {renderContent()}
      </div>
    </div>
  );
}
