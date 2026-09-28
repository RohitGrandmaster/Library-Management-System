'use client';

import { useState } from 'react';
import {
  Settings, Save, Loader2, CheckCircle, Clock, Users, BookOpen,
  CreditCard, Calendar, Activity, Bell, FileText, Bookmark, Database,
  RefreshCw, Hash, ReceiptText
} from 'lucide-react';

const SUB_MENUS = [
  { id: 'Default Library Settings', icon: Settings, tone: 'sky' },
  { id: 'Default Membership Rules', icon: Users, tone: 'violet' },
  { id: 'Default Circulation Rules', icon: BookOpen, tone: 'blue' },
  { id: 'Default Fine Rules', icon: CreditCard, tone: 'red' },
  { id: 'Default Reservation Rules', icon: Bookmark, tone: 'indigo' },
  { id: 'Default Inventory Rules', icon: Database, tone: 'emerald' },
  { id: 'Default Notification Rules', icon: Bell, tone: 'amber' },
  { id: 'Default Barcode Rules', icon: Activity, tone: 'cyan' },
  { id: 'Default Receipt Rules', icon: ReceiptText, tone: 'orange' },
  { id: 'Default Numbering Rules', icon: Hash, tone: 'purple' },
] as const;

const toneClasses: Record<string, string> = {
  sky: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-900/40',
  violet: 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-900/40',
  blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/40',
  red: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/40',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/40',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/40',
  amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/40',
  cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-900/40',
  orange: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/40',
  purple: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/40',
};

function Field({ label, value, type = 'text', icon: Icon }: { label: string; value: string; type?: string; icon?: typeof Clock }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#0F172A]">
      <label className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input type={type} defaultValue={value} className={`w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-gray-700 dark:bg-[#111827] dark:text-white ${Icon ? 'pl-9' : ''}`} />
      </div>
    </div>
  );
}

function SelectField({ label, value, options }: { label: string; value: string; options: string[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#0F172A]">
      <label className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300">{label}</label>
      <select defaultValue={value} className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-gray-700 dark:bg-[#111827] dark:text-white">
        {options.map(option => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}

export default function GlobalConfigPage() {
  const [activeMenu, setActiveMenu] = useState('Default Library Settings');
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
      case 'Default Library Settings':
        return <ConfigGrid title="Core Library Defaults" description="Baseline identity and operational settings applied to every newly registered library." tone="sky">
          <Field label="Default Library Type" value="Public Library" />
          <Field label="Default Time Zone" value="Asia/Kolkata" />
          <Field label="Default Currency" value="INR" />
          <SelectField label="Default Language" value="English" options={['English', 'Hindi', 'Bilingual']} />
          <SelectField label="Library Status on Registration" value="Active" options={['Active', 'Pending Approval', 'Suspended']} />
          <SelectField label="Default Opening Model" value="Mon–Sat" options={['Mon–Sat', 'Mon–Sun', 'Custom']} />
        </ConfigGrid>;
      case 'Default Membership Rules':
        return <ConfigGrid title="Patron & Membership Rules" description="Default limits and validity rules for newly created members." tone="violet">
          <Field label="Max Books per Member" value="5" type="number" icon={BookOpen} />
          <Field label="Default Member Validity (Years)" value="1" type="number" icon={Calendar} />
          <Field label="Max Active Reservations" value="2" type="number" icon={Bookmark} />
          <SelectField label="Membership Approval" value="Automatic" options={['Automatic', 'Manual Approval']} />
        </ConfigGrid>;
      case 'Default Circulation Rules':
        return <ConfigGrid title="Base Circulation Policies" description="These values are applied automatically to new libraries unless their assigned plan permits overrides." tone="blue">
          <Field label="Default Issue Period (Days)" value="14" type="number" icon={Clock} />
          <Field label="Maximum Renewals Allowed" value="2" type="number" icon={RefreshCw} />
          <Field label="Grace Period Before Fine (Days)" value="1" type="number" icon={Calendar} />
          <Field label="Maximum Active Loans" value="5" type="number" icon={BookOpen} />
        </ConfigGrid>;
      case 'Default Fine Rules':
        return <ConfigGrid title="Penalty Configurations" description="Default overdue, lost-book and damaged-book penalty rules." tone="red">
          <Field label="Fine per Day (Base Currency)" value="5.0" type="number" icon={CreditCard} />
          <SelectField label="Lost Book Penalty" value="1x Original Book Price" options={['1x Original Book Price', '1.5x Original Book Price', '2x Original Book Price', 'Flat Replacement Fee']} />
          <SelectField label="Damaged Book Penalty" value="50% of Original Price" options={['50% of Original Price', '75% of Original Price', '100% of Original Price']} />
          <Field label="Maximum Fine Cap" value="500" type="number" icon={CreditCard} />
        </ConfigGrid>;
      case 'Default Reservation Rules':
        return <ConfigGrid title="Hold & Reservation Settings" description="Default reservation limits and expiry policies." tone="indigo">
          <Field label="Max Reservation Limit / Member" value="2" type="number" icon={Bookmark} />
          <Field label="Hold Expiry (Days)" value="3" type="number" icon={Clock} />
          <SelectField label="Reservation Queue" value="FIFO" options={['FIFO', 'Priority Based']} />
        </ConfigGrid>;
      case 'Default Inventory Rules':
        return <ConfigGrid title="Inventory Defaults" description="Default accession, stock and inventory handling rules." tone="emerald">
          <SelectField label="Default Accession Numbering" value="Auto-Increment Numeric (1001, 1002...)" options={['Auto-Increment Numeric (1001, 1002...)', 'Alphanumeric Prefix (LIB-1001...)', 'Year Based (2026-0001...)']} />
          <SelectField label="Duplicate ISBN Handling" value="Allow with Warning" options={['Allow with Warning', 'Block Duplicate', 'Allow']} />
          <SelectField label="Stock Status on Registration" value="Available" options={['Available', 'Processing', 'On Hold']} />
        </ConfigGrid>;
      case 'Default Notification Rules':
        return <ConfigGrid title="Notification Defaults" description="Default channels and timing for library notifications." tone="amber">
          <SelectField label="Due Date Reminder" value="Email + In-App" options={['Email + In-App', 'Email Only', 'In-App Only', 'Disabled']} />
          <SelectField label="Overdue Notification" value="Email + In-App" options={['Email + In-App', 'Email Only', 'In-App Only', 'Disabled']} />
          <Field label="Reminder Lead Time (Days)" value="2" type="number" icon={Clock} />
          <SelectField label="System Alerts" value="In-App" options={['In-App', 'Email + In-App']} />
        </ConfigGrid>;
      case 'Default Barcode Rules':
        return <ConfigGrid title="Barcode Defaults" description="Default barcode format and generation behavior for newly registered items." tone="cyan">
          <SelectField label="Barcode Generation Format" value="CODE128" options={['CODE128', 'QR_CODE', 'EAN13', 'CODE39']} />
          <SelectField label="Generation Mode" value="Automatic" options={['Automatic', 'Manual']} />
          <Field label="Default Prefix" value="LIB" />
        </ConfigGrid>;
      case 'Default Receipt Rules':
        return <ConfigGrid title="Receipt & Document Defaults" description="Default receipt formatting and delivery rules." tone="orange">
          <SelectField label="Receipt Format" value="A4" options={['A4', 'A5', 'Thermal 80mm']} />
          <SelectField label="Receipt Delivery" value="Print + In-App" options={['Print + In-App', 'Print Only', 'In-App Only']} />
          <SelectField label="Include Library Branding" value="Yes" options={['Yes', 'No']} />
          <SelectField label="Include Signature Area" value="Yes" options={['Yes', 'No']} />
        </ConfigGrid>;
      case 'Default Numbering Rules':
        return <ConfigGrid title="Numbering & Document Sequences" description="Default numbering patterns used by newly registered libraries." tone="purple">
          <Field label="Member ID Prefix" value="MEM" />
          <Field label="Book Accession Prefix" value="BK" />
          <Field label="Receipt Prefix" value="RCP" />
          <Field label="Reservation Prefix" value="RSV" />
        </ConfigGrid>;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSave} className="flex min-h-0 w-full flex-1 flex-col gap-5 pb-6">
      <header className="shrink-0">
        <div className="sa-breadcrumb mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <span>Nexus 360</span><span>/</span><span className="text-sky-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Global Configuration</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="sa-page-title flex items-center gap-3 text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400"><Settings size={20} /></span>
              Global Library Configuration
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">Set the default rules, schemas, and limitations for all newly registered libraries. Individual libraries can override these if their assigned plan permits.</p>
          </div>
          <div className="hidden rounded-xl border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 dark:border-sky-900/40 dark:bg-sky-900/20 dark:text-sky-300 lg:block">Global defaults • New libraries</div>
        </div>
      </header>

      <section className="shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[#111827]">
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400"><ActiveIcon size={16} /></div>
          <div><p className="text-sm font-extrabold text-gray-900 dark:text-white">Configuration Areas</p><p className="text-[11px] text-gray-500">Select a rule group</p></div>
        </div>
        <div className="flex gap-2 overflow-x-auto p-3 [scrollbar-width:thin]">
          {SUB_MENUS.map(item => {
            const Icon = item.icon;
            const selected = activeMenu === item.id;
            return <button type="button" key={item.id} onClick={() => setActiveMenu(item.id)} className={`group flex min-w-max items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-all ${selected ? `${toneClasses[item.tone]} shadow-sm` : 'border-transparent bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-white dark:hover:bg-[#1E293B] dark:bg-[#0F172A] dark:text-gray-300 dark:hover:border-gray-700'}`}><Icon size={15} /><span>{item.id.replace('Default ', '')}</span></button>;
          })}
        </div>
      </section>

      <section className="min-h-0 flex-1 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[#111827]">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${toneClasses[active.tone]}`}><ActiveIcon size={17} /></div>
            <div><h2 className="text-base font-extrabold text-gray-900 dark:text-white">{activeMenu}</h2><p className="mt-0.5 text-xs text-gray-500">Global baseline values for newly registered libraries.</p></div>
          </div>
        </div>
        <div className="p-4 sm:p-5 lg:p-6">{renderConfigContent()}</div>
      </section>

      <footer className="sticky bottom-0 z-10 flex shrink-0 items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-[#111827]/95">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"><CheckCircle size={15} className={saved ? 'text-emerald-500' : 'text-gray-400'} />{saved ? 'Changes saved successfully' : 'Changes apply as global defaults for new libraries.'}</div>
        <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{isSaving ? 'Saving...' : 'Save Global Defaults'}</button>
      </footer>
    </form>
  );
}

function ConfigGrid({ title, description, tone, children }: { title: string; description: string; tone: string; children: React.ReactNode }) {
  return <div className="space-y-5"><div className={`rounded-xl border px-4 py-3 ${toneClasses[tone]}`}><h3 className="text-sm font-extrabold">{title}</h3><p className="mt-1 text-xs opacity-80">{description}</p></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div></div>;
}
