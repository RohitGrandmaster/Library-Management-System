'use client';
import { useState } from 'react';
import { 
  Settings, Save, Loader2, CheckCircle, Clock, Users, BookOpen, 
  CreditCard, Calendar, Activity, Bell, FileText, Bookmark, Database
} from 'lucide-react';

const SUB_MENUS = [
  { id: "Default Library Settings", icon: <Settings size={18} /> },
  { id: "Default Membership Rules", icon: <Users size={18} /> },
  { id: "Default Circulation Rules", icon: <BookOpen size={18} /> },
  { id: "Default Fine Rules", icon: <CreditCard size={18} /> },
  { id: "Default Reservation Rules", icon: <Bookmark size={18} /> },
  { id: "Default Inventory Rules", icon: <Database size={18} /> },
  { id: "Default Notification Rules", icon: <Bell size={18} /> },
  { id: "Default Barcode Rules", icon: <Activity size={18} /> },
  { id: "Default Receipt Rules", icon: <FileText size={18} /> },
  { id: "Default Numbering Rules", icon: <FileText size={18} /> }
];

export default function GlobalConfigPage() {
  const [activeMenu, setActiveMenu] = useState("Default Circulation Rules");
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

  const renderConfigContent = () => {
    switch (activeMenu) {
      case "Default Circulation Rules":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="col-span-full mb-2 border-b border-sky-100 dark:border-sky-900/30 pb-2">
              <h3 className="text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-600"></span> Base Circulation Policies
              </h3>
              <p className="text-xs text-gray-500 mt-1">These values are applied automatically to new libraries unless explicitly overridden by the tenant.</p>
            </div>
            
            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Default Issue Period (Days)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" defaultValue="14" className="w-full pl-9 p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm" />
              </div>
            </div>
            
            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Maximum Renewals Allowed</label>
              <div className="relative">
                <RefreshIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" defaultValue="2" className="w-full pl-9 p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm" />
              </div>
            </div>

            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Grace Period Before Fine (Days)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" defaultValue="1" className="w-full pl-9 p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm" />
              </div>
            </div>
          </div>
        );

      case "Default Membership Rules":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="col-span-full mb-2 border-b border-purple-100 dark:border-purple-900/30 pb-2">
              <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span> Patron Rules
              </h3>
            </div>
            
            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Max Books per Member</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" defaultValue="5" className="w-full pl-9 p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm" />
              </div>
            </div>
            
            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Default Member Validity (Years)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" defaultValue="1" className="w-full pl-9 p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm" />
              </div>
            </div>
          </div>
        );

      case "Default Fine Rules":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="col-span-full mb-2 border-b border-red-100 dark:border-red-900/30 pb-2">
              <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span> Penalty Configurations
              </h3>
            </div>
            
            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Fine per Day (Base Currency)</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" step="0.5" defaultValue="5.0" className="w-full pl-9 p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm" />
              </div>
            </div>

            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Lost Book Penalty Multiplier</label>
              <select className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm">
                <option>1x Original Book Price</option>
                <option>1.5x Original Book Price</option>
                <option>2x Original Book Price</option>
                <option>Flat Replacement Fee</option>
              </select>
            </div>

            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Damaged Book Penalty Multiplier</label>
              <select className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm">
                <option>50% of Original Price</option>
                <option>75% of Original Price</option>
                <option>100% of Original Price</option>
              </select>
            </div>
          </div>
        );

      case "Default Reservation Rules":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="col-span-full mb-2 border-b border-indigo-100 dark:border-indigo-900/30 pb-2">
              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Hold & Reserve Settings
              </h3>
            </div>
            
            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Max Reservation Limit / Member</label>
              <div className="relative">
                <Bookmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" defaultValue="2" className="w-full pl-9 p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm" />
              </div>
            </div>
            
            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Hold Expiry (Days)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="number" defaultValue="3" className="w-full pl-9 p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm" />
              </div>
            </div>
          </div>
        );

      case "Default Barcode Rules":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Barcode Generation Format</label>
              <select className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm">
                <option>CODE128</option>
                <option>QR_CODE</option>
                <option>EAN13</option>
                <option>CODE39</option>
              </select>
            </div>
          </div>
        );

      case "Default Inventory Rules":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-gray-50/50 dark:bg-[#1E293B]/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Default Accession Numbering</label>
              <select className="w-full p-2.5 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all shadow-sm">
                <option>Auto-Increment Numeric (1001, 1002...)</option>
                <option>Alphanumeric Prefix (LIB-1001...)</option>
                <option>Year Based (2026-0001...)</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-16 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-[#0F172A]/50">
            <Settings size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Configure {activeMenu}</h4>
            <p className="text-gray-500 font-medium max-w-md mx-auto">
              These settings act as the global baseline for all new libraries provisioned on the platform.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-300 h-full">
      {/* Page Header */}
      <div>
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-sky-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Global Configuration</span>
        </div>
        <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-xl shadow-sm border border-sky-200/50 dark:border-sky-800/50">
            <Settings size={28} className="text-sky-600 dark:text-sky-400" />
          </div>
          Global Library Configuration
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Set the default rules, schemas, and limitations for all newly registered libraries. Individual libraries can override these if their assigned plan permits.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* Left Side Navigation List */}
        <div className="w-full xl:w-80 shrink-0 bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden p-3">
          <div className="space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {SUB_MENUS.map(menu => (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all text-left group ${
                  activeMenu === menu.id 
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 shadow-sm border border-sky-200 dark:border-sky-800' 
                    : 'bg-transparent text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className={`transition-colors ${activeMenu === menu.id ? 'text-sky-600 dark:text-sky-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
                  {menu.icon}
                </div>
                {menu.id}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Settings Form */}
        <div className="flex-1 w-full bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col overflow-hidden">
          <form onSubmit={handleSave} className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0D1F3C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                {activeMenu}
              </h2>
              
              <div className="flex items-center gap-3">
                {saved && (
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                    <CheckCircle size={16} /> Defaults Updated
                  </span>
                )}
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Defaults
                </button>
              </div>
            </div>
            
            <div className="p-8">
              {renderConfigContent()}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Inline component for the refresh icon to save an import
function RefreshIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
      <path d="M16 21v-5h5"/>
    </svg>
  );
}
