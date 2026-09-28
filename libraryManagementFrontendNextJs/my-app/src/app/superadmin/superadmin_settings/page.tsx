'use client';
import { useState } from 'react';
import { 
  Settings, Image, Globe, Calendar, Clock, DollarSign, 
  Mail, MessageSquare, HardDrive, FileText, Upload, Save, 
  CheckCircle, Paintbrush, MonitorSmartphone, ShieldAlert,
  Server, Database, Activity, Lock, Smartphone, ShieldCheck
} from 'lucide-react';

const SUB_MENUS = [
  { id: "Branding & UI", icon: Paintbrush, color: "slate" },
  { id: "Localization", icon: Globe, color: "sky" },
  { id: "Communication (Email/SMS)", icon: Mail, color: "indigo" },
  { id: "Storage & Uploads", icon: HardDrive, color: "emerald" },
  { id: "Audit & Logging", icon: ShieldCheck, color: "rose" },
  { id: "System & Maintenance", icon: Server, color: "amber" }
];

export default function SystemSettingsPage() {
  const [activeMenu, setActiveMenu] = useState("Branding & UI");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    maintenance: false,
    debugMode: false,
    autoArchive: true,
  });

  const handleToggle = (key: string) => {
    setToggleStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  const activeColor = SUB_MENUS.find(m => m.id === activeMenu)?.color || 'slate';
  const ActiveIcon = SUB_MENUS.find(m => m.id === activeMenu)?.icon || Settings;

  const renderContent = () => {
    switch (activeMenu) {
      case "Localization":
        return (
          <form onSubmit={handleSave} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-sky-50/50 dark:bg-sky-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-sky-600 dark:text-sky-400 flex items-center gap-2">
                  <Globe size={24} /> Regional & Localization Settings
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Configure default date, time, currency, and language formats globally.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Globe size={14} className="text-sky-500"/> Default System Language</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-sky-500 font-bold shadow-sm">
                    <option>English (United States)</option>
                    <option>English (United Kingdom)</option>
                    <option>Hindi (India)</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Clock size={14} className="text-sky-500"/> System Timezone</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-sky-500 font-bold shadow-sm">
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Calendar size={14} className="text-sky-500"/> Date Format</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-sky-500 font-bold shadow-sm">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><Clock size={14} className="text-sky-500"/> Time Format</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-sky-500 font-bold shadow-sm">
                      <option>12-hour (AM/PM)</option>
                      <option>24-hour</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"><DollarSign size={14} className="text-emerald-500"/> Default Currency</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-sky-500 font-bold shadow-sm">
                      <option>INR (₹) - Indian Rupee</option>
                      <option>USD ($) - US Dollar</option>
                      <option>EUR (€) - Euro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Number Format</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-sky-500 font-bold shadow-sm">
                      <option>1,000,000.00 (Standard)</option>
                      <option>1.000.000,00 (European)</option>
                      <option>10,00,000.00 (Indian)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#0D1F3C] border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
              {saved && (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                  <CheckCircle size={16} /> Saved Successfully
                </span>
              )}
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                <Save size={16} /> {isSaving ? "Saving..." : "Save Localization"}
              </button>
            </div>
          </form>
        );

      case "Communication (Email/SMS)":
        return (
          <form onSubmit={handleSave} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-indigo-50/50 dark:bg-indigo-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Mail size={24} /> Communication Settings (SMTP & SMS)
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Configure global outbound email servers and SMS gateways for notifications.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* SMTP Settings */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <Mail size={16} className="text-indigo-400" /> SMTP Configuration
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">SMTP Host</label>
                  <input type="text" defaultValue="smtp.sendgrid.net" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">SMTP Port</label>
                    <input type="number" defaultValue={587} className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Encryption</label>
                    <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold shadow-sm">
                      <option>TLS</option>
                      <option>SSL</option>
                      <option>None</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">SMTP Username</label>
                  <input type="text" defaultValue="apikey" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">SMTP Password</label>
                  <input type="password" defaultValue="••••••••••••••••" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Default From Email</label>
                  <input type="email" defaultValue="noreply@nexus360.com" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold shadow-sm" />
                </div>
              </div>

              {/* SMS Settings */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <Smartphone size={16} className="text-indigo-400" /> SMS Gateway
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">SMS Provider</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold shadow-sm">
                    <option>Twilio</option>
                    <option>Msg91</option>
                    <option>AWS SNS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Account SID / Client ID</label>
                  <input type="text" defaultValue="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Auth Token / API Key</label>
                  <input type="password" defaultValue="••••••••••••••••" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-mono shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Sender ID / From Number</label>
                  <input type="text" defaultValue="+1234567890" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold shadow-sm" />
                </div>
                <button type="button" className="mt-4 px-4 py-2 w-full bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Send Test SMS
                </button>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#0D1F3C] border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
              {saved && (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                  <CheckCircle size={16} /> Saved Successfully
                </span>
              )}
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                <Save size={16} /> {isSaving ? "Saving..." : "Save Communication"}
              </button>
            </div>
          </form>
        );

      case "Storage & Uploads":
        return (
          <form onSubmit={handleSave} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-emerald-50/50 dark:bg-emerald-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <HardDrive size={24} /> Storage & File Rules
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Configure AWS S3 buckets and global file upload limits.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <Database size={16} className="text-emerald-400" /> Storage Provider
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Driver</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-emerald-500 font-bold shadow-sm">
                    <option>AWS S3</option>
                    <option>Local Server</option>
                    <option>Google Cloud Storage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">S3 Bucket Name</label>
                  <input type="text" defaultValue="nexus360-assets-prod" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-emerald-500 font-mono shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">S3 Region</label>
                  <input type="text" defaultValue="ap-south-1" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-emerald-500 font-mono shadow-sm" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <Upload size={16} className="text-emerald-400" /> Upload Limits
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Max File Size (MB)</label>
                  <input type="number" defaultValue={25} className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-emerald-500 font-mono shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Allowed File Types</label>
                  <input type="text" defaultValue=".jpg, .png, .pdf, .csv, .xlsx" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-emerald-500 font-mono shadow-sm" />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#0D1F3C] border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
              {saved && (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                  <CheckCircle size={16} /> Saved Successfully
                </span>
              )}
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                <Save size={16} /> {isSaving ? "Saving..." : "Save Storage"}
              </button>
            </div>
          </form>
        );

      case "Audit & Logging":
        return (
          <form onSubmit={handleSave} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-rose-50/50 dark:bg-rose-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <ShieldCheck size={24} /> Audit & Logging
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Manage system log verbosity and global audit trail retention policies.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">System Log Level</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-rose-500 font-bold shadow-sm">
                    <option>ERROR - Errors Only</option>
                    <option>WARNING - Warnings & Errors</option>
                    <option>INFO - Standard Actions</option>
                    <option>DEBUG - Detailed Diagnostics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Audit Log Retention Period</label>
                  <select className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-rose-500 font-bold shadow-sm">
                    <option>30 Days</option>
                    <option>90 Days</option>
                    <option>1 Year</option>
                    <option>Indefinite (Not Recommended)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#0F172A] shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Auto-Archive Old Logs</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Compress and move logs to cold storage after retention.</p>
                  </div>
                  <button type="button" onClick={() => handleToggle('autoArchive')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${toggleStates.autoArchive ? 'bg-rose-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute transition-transform ${toggleStates.autoArchive ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#0D1F3C] border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
              {saved && (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                  <CheckCircle size={16} /> Saved Successfully
                </span>
              )}
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                <Save size={16} /> {isSaving ? "Saving..." : "Save Audit Settings"}
              </button>
            </div>
          </form>
        );

      case "System & Maintenance":
        return (
          <form onSubmit={handleSave} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-amber-50/50 dark:bg-amber-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Server size={24} /> Core System & Maintenance
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Toggle maintenance mode and manage core system preferences.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-amber-200 dark:border-amber-900/50 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><Lock size={16} className="text-amber-500"/> Maintenance Mode</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Locks out all users (except SuperAdmins) globally.</p>
                  </div>
                  <button type="button" onClick={() => handleToggle('maintenance')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${toggleStates.maintenance ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute transition-transform ${toggleStates.maintenance ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#0F172A] flex items-center justify-between shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><Activity size={16} className="text-gray-400"/> Debug Mode</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Show detailed stack traces in UI on error.</p>
                  </div>
                  <button type="button" onClick={() => handleToggle('debugMode')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${toggleStates.debugMode ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute transition-transform ${toggleStates.debugMode ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Max Global API Request Limit (per min)</label>
                <input type="number" defaultValue={5000} className="w-full sm:w-1/3 p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-amber-500 font-mono shadow-sm" />
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#0D1F3C] border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
              {saved && (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                  <CheckCircle size={16} /> Saved Successfully
                </span>
              )}
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                <Save size={16} /> {isSaving ? "Saving..." : "Save System Settings"}
              </button>
            </div>
          </form>
        );

      case "Branding & UI":
      default:
        return (
          <form onSubmit={handleSave} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Paintbrush size={24} className="text-slate-500" /> Platform Branding & UI
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Customize logos, login screen themes, and global application names.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" /> Text Identifiers
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Global Platform Name</label>
                  <input type="text" defaultValue="Nexus 360" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-slate-500 font-bold shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Support Email Address</label>
                  <input type="email" defaultValue="support@nexus360.com" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-slate-500 font-bold shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Primary Email Branding Color</label>
                  <div className="flex gap-2">
                    <input type="color" defaultValue="#0f172a" className="w-12 h-12 p-1 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer" />
                    <input type="text" defaultValue="#0f172a" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-slate-500 font-mono shadow-sm" />
                  </div>
                </div>
              </div>

              <div className="xl:col-span-2 space-y-6">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <Image size={16} className="text-slate-400" /> Visual Assets
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 bg-white dark:bg-[#0F172A] shadow-sm">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-3">Primary Platform Logo</label>
                    <div className="h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-slate-50 dark:bg-[#1E293B] dark:hover:bg-slate-900/30 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload size={18} className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <p className="text-xs font-bold text-gray-500">Click to upload logo</p>
                      <p className="text-[10px] text-gray-400">PNG, SVG (Max 2MB)</p>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 bg-white dark:bg-[#0F172A] shadow-sm">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-3">Browser Favicon</label>
                    <div className="h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-slate-50 dark:bg-[#1E293B] dark:hover:bg-slate-900/30 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload size={18} className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <p className="text-xs font-bold text-gray-500">Click to upload icon</p>
                      <p className="text-[10px] text-gray-400">PNG, ICO (32x32)</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 bg-white dark:bg-[#0F172A] shadow-sm">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><MonitorSmartphone size={14} className="text-slate-500" /> Custom Login Page Background</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-full sm:w-1/2 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-slate-50 dark:bg-[#1E293B] dark:hover:bg-slate-900/30 transition-colors cursor-pointer">
                      <Upload size={16} className="text-slate-500 mb-1" />
                      <span className="text-xs font-bold text-gray-500">Upload HD Image</span>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Or Use Solid Background Color</label>
                      <div className="flex gap-2">
                        <input type="color" defaultValue="#f8fafc" className="w-10 h-10 p-0.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer" />
                        <input type="text" defaultValue="#f8fafc" className="w-full p-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:border-slate-500 font-mono shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#0D1F3C] border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
              {saved && (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                  <CheckCircle size={16} /> Assets & Branding Saved
                </span>
              )}
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                <Save size={16} /> {isSaving ? "Saving..." : "Save Branding Settings"}
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-0 h-full">
      {/* Page Header */}
      <div className="shrink-0">
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-slate-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">System</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border transition-colors ${
                activeColor === 'slate' ? 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 border-slate-100 dark:border-slate-800/30' :
                activeColor === 'sky' ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 border-sky-100 dark:border-sky-800/30' :
                activeColor === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-100 dark:border-indigo-800/30' :
                activeColor === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800/30' :
                activeColor === 'rose' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-rose-100 dark:border-rose-800/30' :
                'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800/30'
              }`}>
                <ActiveIcon size={24} />
              </div>
              System Global Settings
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Configure platform-wide branding, regional localizations, file upload limits, and general technical parameters.</p>
          </div>
        </div>
      </div>

      {/* Sub-menu Grid */}
      <div className="shrink-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
        {SUB_MENUS.map(menu => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;
          
          let activeClasses = "";
          let iconClasses = "opacity-70";
          if (isActive) {
            switch(menu.color) {
              case 'slate': activeClasses = "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900/20 dark:border-slate-800/50 dark:text-slate-400 shadow-sm scale-[1.02]"; iconClasses = "text-slate-600 dark:text-slate-400"; break;
              case 'sky': activeClasses = "bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-900/20 dark:border-sky-800/50 dark:text-sky-400 shadow-sm scale-[1.02]"; iconClasses = "text-sky-600 dark:text-sky-400"; break;
              case 'indigo': activeClasses = "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-400 shadow-sm scale-[1.02]"; iconClasses = "text-indigo-600 dark:text-indigo-400"; break;
              case 'emerald': activeClasses = "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400 shadow-sm scale-[1.02]"; iconClasses = "text-emerald-600 dark:text-emerald-400"; break;
              case 'rose': activeClasses = "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-400 shadow-sm scale-[1.02]"; iconClasses = "text-rose-600 dark:text-rose-400"; break;
              case 'amber': activeClasses = "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400 shadow-sm scale-[1.02]"; iconClasses = "text-amber-600 dark:text-amber-400"; break;
            }
          }

          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`flex flex-col items-center justify-center p-4 gap-2 rounded-2xl border text-center transition-all ${
                isActive 
                  ? activeClasses
                  : 'bg-white dark:bg-[#0F172A] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon size={20} className={iconClasses} />
              <span className="text-[11px] font-bold uppercase tracking-wider">{menu.id}</span>
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
