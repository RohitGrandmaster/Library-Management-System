'use client';
import { useState } from 'react';
import { 
  Network, Code, Webhook, Key, Mail, MessageSquare, Phone, 
  CreditCard, HardDrive, Share2, Activity, Link2, ShieldCheck, Zap
} from 'lucide-react';

import ApiKeysView from './ApiKeysView';
import IntegrationLogsView from './IntegrationLogsView';

const SUB_MENUS = [
  "API Dashboard", "API Keys", "Applications", "Webhooks", "Webhook Logs", 
  "Email Provider", "SMS Provider", "WhatsApp Provider", "Payment Gateway", 
  "Storage Provider", "Other Integrations", "Integration Health"
];

export default function ApiIntegrationsPage() {
  const [activeMenu, setActiveMenu] = useState("API Dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "API Keys":
        return <ApiKeysView />;
      case "Webhook Logs":
      case "Integration Health":
        return <IntegrationLogsView />;
      case "Email Provider":
      case "SMS Provider":
      case "WhatsApp Provider":
      case "Payment Gateway":
      case "Storage Provider":
      case "Webhooks":
      case "Other Integrations":
      case "Applications":
        return (
          <div className="border-2 border-dashed border-amber-200 dark:border-amber-900/30 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-amber-50/30 dark:bg-amber-900/10 animate-in zoom-in-95 duration-500">
            <div className="p-5 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-6 shadow-inner">
              <Link2 size={48} className="text-amber-500 dark:text-amber-400" />
            </div>
            <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Configure {activeMenu}</h4>
            <p className="text-gray-500 font-medium max-w-lg mx-auto mb-8">
              Connect external services, set up authentication credentials, and manage provider-specific routing settings for your Nexus 360 platform.
            </p>
            <button className="px-6 py-3 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 transition-all">
              Connect New Provider
            </button>
          </div>
        );
      case "API Dashboard":
      default:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Real-time API Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { title: 'API Requests (24h)', value: '1.2M', icon: <Activity size={24} />, color: 'amber', detail: 'Peak: 450 req/sec' },
                { title: 'Average Latency', value: '42ms', icon: <Zap size={24} />, color: 'emerald', detail: 'p95: 120ms' },
                { title: 'Error Rate (5xx)', value: '0.04%', icon: <ShieldCheck size={24} />, color: 'blue', detail: 'Platform highly stable' },
                { title: 'Active Webhooks', value: '24', icon: <Webhook size={24} />, color: 'purple', detail: 'Across 8 Tenants' }
              ].map(stat => (
                <div key={stat.title} className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.title}</h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{stat.value}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{stat.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Connected Providers */}
              <div className="bg-white dark:bg-[#0F172A] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Share2 className="text-amber-500" size={18} /> Provider Ecosystem Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'SMTP Mail (SendGrid)', status: 'Connected', icon: <Mail size={16} /> },
                    { label: 'SMS Gateway (Twilio)', status: 'Connected', icon: <MessageSquare size={16} /> },
                    { label: 'WhatsApp (Meta API)', status: 'Connected', icon: <Phone size={16} /> },
                    { label: 'Payment (Stripe)', status: 'Connected', icon: <CreditCard size={16} /> },
                    { label: 'Storage (AWS S3)', status: 'Connected', icon: <HardDrive size={16} /> },
                    { label: 'Custom App Auth', status: 'Connected', icon: <Code size={16} /> },
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1E293B] rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                        <span className="text-amber-500/70">{service.icon}</span> {service.label}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Key Security Summary */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-8 rounded-2xl shadow-inner border border-amber-100 dark:border-amber-800 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <Key size={28} className="text-amber-600 dark:text-amber-400" />
                  <h2 className="text-xl font-extrabold text-amber-900 dark:text-amber-300">API Key Security Center</h2>
                </div>
                <div className="space-y-4 relative">
                  <div className="bg-white/60 dark:bg-[#0F172A]/60 backdrop-blur-sm p-4 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Active Keys</span>
                      <span className="text-sm font-bold text-emerald-600">4</span>
                    </div>
                    <p className="text-xs text-gray-500">Currently authorizing requests</p>
                  </div>
                  <div className="bg-white/60 dark:bg-[#0F172A]/60 backdrop-blur-sm p-4 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Exposed / Compromised Alerts</span>
                      <span className="text-sm font-bold text-gray-400">0</span>
                    </div>
                    <p className="text-xs text-gray-500">No leaked keys detected on public repos.</p>
                  </div>
                  <button onClick={() => setActiveMenu('API Keys')} className="w-full mt-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all shadow-md">
                    Manage API Keys
                  </button>
                </div>
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
          <span>Nexus 360</span><span>/</span><span className="text-amber-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">API & Integrations</span>
        </div>
        <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl shadow-sm border border-amber-200/50 dark:border-amber-800/50">
            <Network size={28} className="text-amber-600 dark:text-amber-400" />
          </div>
          API Gateway & Integrations
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage third-party providers (Email, SMS, Storage), configure global Webhooks, and control API keys for external applications.</p>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all shadow-sm ${
              activeMenu === menu 
                ? 'bg-amber-500 text-white shadow-amber-500/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-amber-50 dark:hover:bg-[#1E293B] hover:text-amber-600 hover:border-amber-200'
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
