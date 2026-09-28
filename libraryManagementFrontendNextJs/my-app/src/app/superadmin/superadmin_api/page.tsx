'use client';
import { useState } from 'react';
import { 
  Network, Code, Webhook, Key, Mail, MessageSquare, Phone, 
  CreditCard, HardDrive, Share2, Activity, Link2, ShieldCheck, Zap,
  Plug, Play, Pause, ExternalLink
} from 'lucide-react';

import ApiKeysView from './ApiKeysView';
import IntegrationLogsView from './IntegrationLogsView';

const SUB_MENUS = [
  { id: "API Dashboard", icon: Activity, color: "blue", tabClass: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400", iconClass: "text-blue-600 dark:text-blue-400" },
  { id: "API Keys", icon: Key, color: "amber", tabClass: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400", iconClass: "text-amber-600 dark:text-amber-400" },
  { id: "Connected Integrations", icon: Plug, color: "emerald", tabClass: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400", iconClass: "text-emerald-600 dark:text-emerald-400" },
  { id: "Webhooks & Logs", icon: Webhook, color: "indigo", tabClass: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400", iconClass: "text-indigo-600 dark:text-indigo-400" }
];

const MOCK_INTEGRATIONS = [
  { id: '1', name: 'Twilio SMS', category: 'Communication', status: 'Connected', health: 'Healthy', icon: MessageSquare, color: 'blue' },
  { id: '2', name: 'SendGrid Email', category: 'Communication', status: 'Connected', health: 'Healthy', icon: Mail, color: 'sky' },
  { id: '3', name: 'Stripe Payments', category: 'Finance', status: 'Connected', health: 'Healthy', icon: CreditCard, color: 'indigo' },
  { id: '4', name: 'AWS S3 Storage', category: 'Infrastructure', status: 'Connected', health: 'Healthy', icon: HardDrive, color: 'amber' },
  { id: '5', name: 'WhatsApp Business API', category: 'Communication', status: 'Disconnected', health: 'N/A', icon: Phone, color: 'emerald' },
  { id: '6', name: 'Okta SSO', category: 'Authentication', status: 'Error', health: 'Failing', icon: ShieldCheck, color: 'rose' },
];

export default function ApiIntegrationsPage() {
  const [activeMenu, setActiveMenu] = useState("API Dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "API Keys":
        return <ApiKeysView />;
        
      case "Webhooks & Logs":
        return <IntegrationLogsView />;
        
      case "Connected Integrations":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-emerald-50/50 dark:bg-[#0D1F3C]/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Plug size={24} /> 3rd-Party Integrations
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Manage external service connections, API keys, and synchronization statuses.</p>
              </div>
              <button className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                + Add Provider
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_INTEGRATIONS.map(int => {
                const Icon = int.icon;
                return (
                  <div key={int.id} className="group bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 p-5 rounded-2xl shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl bg-${int.color}-50 text-${int.color}-600 dark:bg-${int.color}-900/30 dark:text-${int.color}-400 group-hover:scale-110 transition-transform`}>
                        <Icon size={24} />
                      </div>
                      {int.status === 'Connected' ? (
                        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 rounded-full flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Connected
                        </span>
                      ) : int.status === 'Error' ? (
                        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50 rounded-full flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> Error
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 rounded-full flex items-center gap-1">
                          Disconnected
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1">{int.name}</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 flex-1">{int.category}</p>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <button className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                        <Settings2 size={14} /> Configure
                      </button>
                      <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1.5">
                        Docs <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        );

      case "API Dashboard":
      default:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Real-time API Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { title: 'Total API Requests (24h)', value: '1.2M', icon: <Activity size={24} />, color: 'blue', detail: 'Peak: 450 req/sec' },
                { title: 'Global Average Latency', value: '42ms', icon: <Zap size={24} />, color: 'emerald', detail: 'p95: 120ms' },
                { title: 'API Error Rate (5xx)', value: '0.04%', icon: <ShieldCheck size={24} />, color: 'amber', detail: 'Platform highly stable' },
                { title: 'Active Webhook Subs', value: '124', icon: <Webhook size={24} />, color: 'indigo', detail: 'Across 42 Tenants' }
              ].map(stat => (
                <div key={stat.title} className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 dark:bg-${stat.color}-500/10 rounded-bl-full transition-transform group-hover:scale-110`}></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 dark:bg-${stat.color}-900/30 dark:text-${stat.color}-400`}>
                        {stat.icon}
                      </div>
                    </div>
                    <h3 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">{stat.title}</h3>
                    <div className="text-3xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
                    <p className="text-xs font-bold text-gray-400">{stat.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Connected Providers */}
              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-[400px]">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Share2 className="text-blue-500" size={18} /> Provider Ecosystem Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                  {[
                    { label: 'SMTP Mail (SendGrid)', status: 'Connected', icon: Mail },
                    { label: 'SMS Gateway (Twilio)', status: 'Connected', icon: MessageSquare },
                    { label: 'WhatsApp (Meta API)', status: 'Connected', icon: Phone },
                    { label: 'Payment (Stripe)', status: 'Connected', icon: CreditCard },
                    { label: 'Storage (AWS S3)', status: 'Connected', icon: HardDrive },
                    { label: 'Custom App Auth', status: 'Connected', icon: Code },
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1E293B] rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-[#0F172A] rounded-lg shadow-sm text-blue-500">
                           <service.icon size={16} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{service.label}</span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Load Graph Placeholder */}
              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-[400px]">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Activity className="text-blue-500" size={18} /> API Request Volume
                </h3>
                <div className="flex-1 w-full bg-blue-50/50 dark:bg-[#1E293B] rounded-xl border-2 border-dashed border-blue-200 dark:border-gray-700 flex flex-col items-center justify-center text-center p-6">
                   <Network size={48} className="text-blue-300 dark:text-gray-600 mb-4" />
                   <p className="text-sm font-bold text-gray-500">Global API routing telemetry</p>
                   <p className="text-xs font-medium text-gray-400 mt-2">Chart loads from Datadog Integration</p>
                </div>
              </div>
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
          <span>Nexus 360</span><span>/</span><span className="text-blue-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">API & Integrations</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-200/50 dark:border-blue-800/50">
                <Network size={24} />
              </div>
              API & Global Integrations
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage third-party connections, monitor API health telemetry, generate authentication keys, and configure webhooks.</p>
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

// Ensure Settings2 is properly imported at top, if not, add it to lucide-react import
import { Settings2 } from 'lucide-react';
