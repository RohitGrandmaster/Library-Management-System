'use client';
import { useState } from 'react';
import { 
  Settings, Image, Globe, Calendar, Clock, DollarSign, 
  Mail, MessageSquare, HardDrive, FileText, Upload, Save, 
  CheckCircle, Paintbrush, MonitorSmartphone
} from 'lucide-react';

const SUB_MENUS = [
  "General Settings", "Platform Branding", "Date & Time", "Timezone", 
  "Language", "Localization", "Currency", "Email Configuration", 
  "SMS Configuration", "Storage Configuration", "File Upload Rules", 
  "Logging Configuration", "Audit Retention", "Default Limits", 
  "Maintenance Settings", "System Preferences"
];

export default function SystemSettingsPage() {
  const [activeMenu, setActiveMenu] = useState("Platform Branding");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Localization":
      case "Date & Time":
      case "Timezone":
      case "Language":
      case "Currency":
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
              {/* Language & Timezone */}
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

              {/* Formats */}
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
                <Save size={16} /> {isSaving ? "Saving..." : "Save Localization Settings"}
              </button>
            </div>
          </form>
        );

      case "Platform Branding":
      case "General Settings":
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
              
              {/* Text / Identifiers */}
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

              {/* Assets Upload */}
              <div className="xl:col-span-2 space-y-6">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <Image size={16} className="text-slate-400" /> Visual Assets
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Upload */}
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

                  {/* Favicon Upload */}
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

                {/* Login Screen Background */}
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
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Page Header */}
      <div>
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-slate-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">System</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <Settings size={28} className="text-slate-600 dark:text-slate-400" />
              </div>
              System Global Settings
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Configure platform-wide branding, regional localizations, file upload limits, and general technical parameters.</p>
          </div>
        </div>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex gap-1.5 pb-2 pt-1 px-1 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all shadow-sm flex-1 ${
              activeMenu === menu 
                ? 'bg-slate-800 text-white shadow-slate-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:text-slate-800 hover:border-slate-300'
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
