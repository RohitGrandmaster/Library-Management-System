'use client';
import { useState } from 'react';
import { 
  User, Shield, KeyRound, Monitor, Clock, 
  Camera, Lock, CheckCircle, Smartphone, Globe, LogOut, Save
} from 'lucide-react';

const SUB_MENUS = [
  "Profile", "Edit Profile", "Change Password", "Two-Factor Authentication", 
  "Login History", "Active Sessions", "Security Settings"
];

const mockSessions = [
  { id: 1, device: 'MacBook Pro 14"', os: 'macOS Sonoma', browser: 'Chrome', ip: '192.168.1.104', location: 'Mumbai, India', time: 'Active Now', current: true },
  { id: 2, device: 'iPhone 15 Pro', os: 'iOS 17.4', browser: 'Safari', ip: '45.112.99.x', location: 'New Delhi, India', time: 'Last seen 2 hours ago', current: false },
];

const mockLoginHistory = [
  { id: 1, date: '2026-09-28 10:15 AM', ip: '192.168.1.104', location: 'Mumbai, India', status: 'Success' },
  { id: 2, date: '2026-09-27 09:30 AM', ip: '192.168.1.104', location: 'Mumbai, India', status: 'Success' },
  { id: 3, date: '2026-09-26 11:45 PM', ip: '88.21.x.x', location: 'Unknown', status: 'Failed (Wrong Password)' },
];

export default function MyProfilePage() {
  const [activeMenu, setActiveMenu] = useState("Profile");
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
      case "Login History":
      case "Active Sessions":
        return (
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-indigo-50/50 dark:bg-indigo-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Monitor size={24} /> Devices & Activity
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Review your active logins and past authentication history.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8">
              
              {/* Active Sessions */}
              <div className="flex-1 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                  Active Sessions
                </h3>
                {mockSessions.map(session => (
                  <div key={session.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#1E293B] flex items-center justify-between gap-4 shadow-sm hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-[#0F172A] flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100 dark:border-gray-800">
                        {session.device.includes('iPhone') ? <Smartphone size={20} /> : <Monitor size={20} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {session.device} 
                          {session.current && <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-100 text-emerald-700 rounded-full">Current Session</span>}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">{session.os} • {session.browser}</p>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1"><Globe size={10}/> {session.ip} ({session.location})</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs font-bold text-gray-400">{session.time}</span>
                      {!session.current && (
                        <button className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">
                          Revoke Access
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Login History */}
              <div className="flex-1 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">
                  Recent Login History
                </h3>
                <div className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                  {mockLoginHistory.map((log, idx) => (
                    <div key={log.id} className={`p-4 flex items-center justify-between ${idx !== mockLoginHistory.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''} hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-colors`}>
                      <div className="flex items-start gap-3">
                        <Clock size={16} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{log.date}</p>
                          <p className="text-xs text-gray-500">{log.ip} • {log.location}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                  <button className="w-full p-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-gray-50 dark:bg-[#0D1F3C] hover:bg-indigo-50 transition-colors">
                    View Full Audit Log
                  </button>
                </div>
              </div>

            </div>
          </div>
        );

      case "Change Password":
      case "Two-Factor Authentication":
      case "Security Settings":
        return (
          <form onSubmit={handleSave} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-indigo-50/50 dark:bg-indigo-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Shield size={24} /> Security & Authentication
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Update your password and manage two-factor authentication.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8">
              
              <div className="flex-1 space-y-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                  <KeyRound size={16} className="text-indigo-500" /> Change Password
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                  <input type="password" required className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                  <input type="password" required className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                  <input type="password" required className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 shadow-sm" />
                </div>
              </div>

              <div className="xl:w-1/3 bg-gray-50 dark:bg-[#0D1F3C] border border-gray-100 dark:border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Smartphone size={16} className="text-indigo-500" /> Two-Factor Auth (2FA)
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-[#0F172A] border border-emerald-200 dark:border-emerald-900/30 rounded-xl shadow-sm mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">2FA is Enabled</p>
                        <p className="text-xs text-gray-500">Authenticator App</p>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="w-full py-2 bg-white dark:bg-[#1E293B] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    Reconfigure Authenticator
                  </button>
                </div>
                
                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
                  {saved && (
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 animate-in slide-in-from-bottom-2 mb-3">
                      <CheckCircle size={16} /> Security Settings Updated
                    </span>
                  )}
                  <button type="submit" disabled={isSaving} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                    <Save size={16} /> {isSaving ? "Saving..." : "Update Security Settings"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        );

      case "Profile":
      case "Edit Profile":
      default:
        return (
          <form onSubmit={handleSave} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-indigo-50/50 dark:bg-indigo-900/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <User size={24} /> Personal Information
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Manage your SuperAdmin profile details and avatar.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-10">
              
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-[#0F172A] shadow-xl overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-500">
                    <User size={48} />
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Profile Photo</h3>
                  <p className="text-[10px] text-gray-500 mt-1">JPG or PNG. Max 1MB.</p>
                </div>
              </div>

              {/* Text Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input type="text" defaultValue="Rohit Sharma" required className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address (Read-only)</label>
                    <input type="email" defaultValue="admin@nexus360.com" disabled className="w-full p-3 bg-gray-100 dark:bg-[#0D1F3C] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <input type="tel" defaultValue="+91 9876543210" className="w-full p-3 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold shadow-sm" />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#0D1F3C] border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-4">
              {saved && (
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in slide-in-from-right-4">
                  <CheckCircle size={16} /> Profile Saved
                </span>
              )}
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2">
                <Save size={16} /> {isSaving ? "Saving..." : "Save Profile Changes"}
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
          <span>Nexus 360</span><span>/</span><span className="text-indigo-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">My Account</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl shadow-sm border border-indigo-200/50 dark:border-indigo-800/50">
                <User size={28} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              My Profile Settings
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium max-w-3xl">Manage your personal information, security credentials, and active sessions.</p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-xl text-sm font-bold shadow-sm transition-colors">
            <LogOut size={16} /> Log Out Current Session
          </button>
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
                ? 'bg-indigo-600 text-white shadow-indigo-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-indigo-50 dark:hover:bg-[#1E293B] hover:text-indigo-600 hover:border-indigo-200'
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
