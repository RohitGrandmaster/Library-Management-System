'use client';
import { useState } from 'react';
import { 
  User, UserCog, KeyRound, Fingerprint, History, 
  MonitorSmartphone, LogOut, Camera, CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SuperAdminProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Profile');
  const [saved, setSaved] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Edit Profile', icon: UserCog },
    { name: 'Change Password', icon: KeyRound },
    { name: '2FA', icon: Fingerprint },
    { name: 'Login History', icon: History },
    { name: 'Active Sessions', icon: MonitorSmartphone },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="sa-page-animate">
      {showLogout && (
        <div className="sa-wizard-modal-overlay" onClick={() => setShowLogout(false)}>
          <div className="sa-wizard-modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <div className="sa-wizard-modal-icon">
              <LogOut size={20} className="sa-metric--warning" />
            </div>
            <p className="sa-wizard-modal-title">Are you sure you want to logout?</p>
            <div className="flex gap-3 mt-6">
              <button className="sa-btn-ghost sa-btn-ghost--sm flex-1" onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="sa-btn-ghost sa-btn-ghost--danger flex-1" onClick={() => router.push('/auth/login')}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className="sa-toast sa-toast--success">
          <CheckCircle size={16} /> Profile updated successfully!
        </div>
      )}

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>Nexus 360</span><span>/</span><span>Super Admin</span><span>/</span><span>My Profile</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <User className="text-primary" size={28} /> My Profile
          </h1>
          <button onClick={() => setShowLogout(true)} className="sa-btn-ghost sa-btn-ghost--danger text-sm font-bold">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon size={16} /> {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Sidebar Profile Card (Always visible) */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sa-card p-6 flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-4">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/30">
                SA
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <h2 className="text-lg font-bold text-white">Super Admin</h2>
            <p className="text-xs text-primary font-bold tracking-widest uppercase mt-1">Platform Owner</p>
            
            <div className="w-full h-px bg-white/10 my-4" />
            
            <div className="w-full space-y-3 text-left">
              <div>
                <p className="text-xs text-secondary mb-1">Email</p>
                <p className="text-sm text-white font-medium">admin@nexus360.com</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Phone</p>
                <p className="text-sm text-white font-medium">+91 9876543210</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Account Status</p>
                <p className="text-sm text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle size={14} /> Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-8 lg:col-span-9 sa-card p-6 h-[550px] overflow-y-auto">
          
          {activeTab === 'Profile' && (
            <div className="animate-fade-in flex flex-col items-center justify-center h-full text-white/40">
              <User size={64} className="mb-4 opacity-30 text-primary" />
              <h2 className="text-xl font-bold text-white mb-2">Welcome to your Profile</h2>
              <p className="text-sm text-center max-w-sm">Use the tabs above to manage your personal details, update your password, or review your active sessions.</p>
            </div>
          )}

          {activeTab === 'Edit Profile' && (
            <div className="max-w-xl space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-white mb-2">Edit Personal Details</h2>
                <p className="text-sm text-secondary mb-6">Update your name, email, and contact information.</p>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/80">Full Name</label>
                    <input type="text" defaultValue="Super Admin" className="sa-input" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/80">Email Address</label>
                    <input type="email" defaultValue="admin@nexus360.com" className="sa-input" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/80">Phone Number</label>
                    <input type="tel" defaultValue="+91 9876543210" className="sa-input" />
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <button onClick={handleSave} className="sa-btn-primary w-full sm:w-auto">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Change Password' && (
            <div className="max-w-xl space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-white mb-2">Change Password</h2>
                <p className="text-sm text-secondary mb-6">Ensure your account uses a long, random password to stay secure.</p>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/80">Current Password</label>
                    <input type="password" placeholder="••••••••" className="sa-input" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/80">New Password</label>
                    <input type="password" placeholder="••••••••" className="sa-input" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-white/80">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="sa-input" />
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <button onClick={handleSave} className="sa-btn-primary w-full sm:w-auto">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'Profile' && activeTab !== 'Edit Profile' && activeTab !== 'Change Password' && (
            <div className="flex flex-col items-center justify-center h-full text-white/40 animate-fade-in">
              <KeyRound size={48} className="mb-4 opacity-30 text-primary" />
              <p className="text-lg font-medium">{activeTab} Details</p>
              <p className="text-sm mt-1 text-center max-w-sm">This section is connected to the Security Center module for session management.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
