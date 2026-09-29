'use client';
import { useState } from 'react';
import {
  Settings, Save, Loader2, CheckCircle, Clock, Users, BookOpen,
  CreditCard, Calendar, Activity, Bell, FileText, Bookmark, Database,
  RefreshCw, Hash, ReceiptText, ShieldCheck, Mail, SlidersHorizontal, Share2, Layers
} from 'lucide-react';

const SUB_MENUS = [
  { id: 'Library Defaults', icon: Settings, color: 'blue', desc: 'Core identity & behavior' },
  { id: 'Membership Rules', icon: Users, color: 'violet', desc: 'Patron limits & validity' },
  { id: 'Circulation Policies', icon: BookOpen, color: 'emerald', desc: 'Issue & renewal limits' },
  { id: 'Fine & Penalty Rules', icon: CreditCard, color: 'rose', desc: 'Overdue charges & bans' },
  { id: 'Reservation Logic', icon: Bookmark, color: 'amber', desc: 'Queue & hold durations' },
  { id: 'Inventory Defaults', icon: Database, color: 'cyan', desc: 'Cataloging schemas' },
  { id: 'Notification Triggers', icon: Bell, color: 'orange', desc: 'Automated alerts' },
  { id: 'Barcode Formats', icon: Activity, color: 'fuchsia', desc: 'Label generation rules' },
  { id: 'Receipt Templates', icon: ReceiptText, color: 'indigo', desc: 'Print & email receipts' },
  { id: 'Sequence Generators', icon: Hash, color: 'pink', desc: 'Auto-increment prefixes' },
] as const;

function Field({ label, value, type = 'text', icon: Icon, description }: { label: string; value: string; type?: string; icon?: any; description?: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#0F172A] hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <label className="text-sm font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</label>
      </div>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />}
        <input 
          type={type} 
          defaultValue={value} 
          className={`w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-bold text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:border-gray-700 dark:bg-[#1E293B] dark:text-white dark:focus:border-blue-500 dark:focus:bg-[#0F172A] shadow-inner ${Icon ? 'pl-10' : ''}`} 
        />
      </div>
      {description && <p className="text-[11px] font-bold text-gray-500 mt-2">{description}</p>}
    </div>
  );
}

function SelectField({ label, value, options, description }: { label: string; value: string; options: string[]; description?: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#0F172A] hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <label className="text-sm font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</label>
      </div>
      <select defaultValue={value} className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-bold text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:border-gray-700 dark:bg-[#1E293B] dark:text-white dark:focus:border-blue-500 dark:focus:bg-[#0F172A] shadow-inner cursor-pointer">
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      {description && <p className="text-[11px] font-bold text-gray-500 mt-2">{description}</p>}
    </div>
  );
}

export default function GlobalConfigPage() {
  const [activeMenu, setActiveMenu] = useState('Library Defaults');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const active = SUB_MENUS.find(item => item.id === activeMenu) ?? SUB_MENUS[0];
  const ActiveIcon = active.icon;

  const renderConfigContent = () => {
    switch (activeMenu) {
      case 'Library Defaults':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <Field label="Default Library Type" value="Public Library" description="The default classification assigned to new registrations." />
            <Field label="Default Time Zone" value="Asia/Kolkata" icon={Clock} description="Base timezone for cron jobs and dates." />
            <Field label="Default Currency" value="INR" icon={CreditCard} description="Currency symbol used for fines and billing." />
            <SelectField label="Default Language" value="English" options={['English', 'Hindi', 'Bilingual']} description="UI Language fallback." />
            <SelectField label="Library Status on Registration" value="Active" options={['Active', 'Pending Approval', 'Suspended']} description="Initial state of a new tenant." />
            <SelectField label="Default Opening Model" value="Mon–Sat" options={['Mon–Sat', 'Mon–Sun', 'Custom']} description="Affects fine calculation." />
          </div>
        );
      case 'Membership Rules':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <Field label="Max Books per Member" value="5" type="number" icon={BookOpen} description="Default checkout limit per user." />
            <Field label="Default Member Validity (Years)" value="1" type="number" icon={Calendar} description="Account expiry duration." />
            <Field label="Max Active Reservations" value="2" type="number" icon={Bookmark} description="Limit on concurrent holds." />
            <SelectField label="Membership Approval" value="Automatic" options={['Automatic', 'Manual Approval']} description="Whether new signups require admin review." />
          </div>
        );
      case 'Circulation Policies':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <Field label="Default Issue Period (Days)" value="14" type="number" icon={Clock} description="How long a book can be kept initially." />
            <Field label="Maximum Renewals Allowed" value="2" type="number" icon={RefreshCw} description="Times a book can be re-issued." />
            <Field label="Grace Period Before Fine (Days)" value="1" type="number" icon={Calendar} description="Days allowed past due date without penalty." />
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center p-16 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/10 animate-in zoom-in-95 duration-500 min-h-[400px]">
             <div className={`w-24 h-24 rounded-full bg-${active.color}-100 dark:bg-${active.color}-900/30 text-${active.color}-600 dark:text-${active.color}-400 flex items-center justify-center mb-6 shadow-inner border border-${active.color}-200 dark:border-${active.color}-800`}>
               <ActiveIcon size={40} />
             </div>
             <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{active.id}</h3>
             <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
               Configure the global {active.id.toLowerCase()} that act as the foundational blueprint for all new library tenants in the Nexus 360 ecosystem.
             </p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-left cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">Global Overrides Enabled</div>
                  <div className="text-xs font-semibold text-gray-500">Super Admins can force these rules.</div>
                </div>
                <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-left cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">Tenant Overrides</div>
                  <div className="text-xs font-semibold text-gray-500">Tenants can customize their own.</div>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-6rem)]">
      
      {/* Sidebar Navigation */}
      <div className="lg:w-72 shrink-0 flex flex-col bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C]/30">
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
            <SlidersHorizontal size={20} className="text-blue-600 dark:text-blue-400" /> System Defaults
          </h2>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Base Configuration Engine</p>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {SUB_MENUS.map(menu => {
            const Icon = menu.icon;
            const isActive = activeMenu === menu.id;
            
            return (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group ${
                  isActive 
                    ? `bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 shadow-sm`
                    : 'bg-transparent text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? `bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400` : 'bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className={`text-xs font-extrabold mb-0.5 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{menu.id}</div>
                  <div className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-blue-500/80 dark:text-blue-400/80' : 'text-gray-400'}`}>{menu.desc}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <form onSubmit={handleSave} className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        
        {/* Content Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C]/30 shrink-0">
          <div className="sa-breadcrumb mb-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <span>Nexus 360</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span className="text-blue-600">Super Admin</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span className="text-gray-900 dark:text-white">Global Config</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                {activeMenu}
              </h1>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 font-medium">
                These settings will apply as the default blueprint for all new library tenants.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button type="button" className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 dark:bg-[#1E293B] dark:border-gray-600 dark:text-gray-300 transition-colors">
                Discard Changes
              </button>
              <button 
                type="submit" 
                disabled={isSaving}
                className="px-6 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? 'Saving...' : 'Apply Defaults'}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Fields Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 bg-gray-50/20 dark:bg-transparent">
          {renderConfigContent()}
        </div>

        {/* Footer Notification */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0F172A] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <ShieldCheck size={14} className="text-emerald-500" /> Tenant overrides are enabled. These defaults will only apply to new tenants.
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle size={14} /> Global configuration saved successfully.
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
