'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, BookOpen, CheckCircle, ChevronRight, Lock } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/app/auth/reusable/schema';
import hardcoded from '@/app/auth/hardcoded.json';
import { login } from '@/lib/auth';

const ROLES = hardcoded.roles;

const ROLE_DEST_LABEL: Record<string, string> = {
  superadmin: 'Setup Library Profile',
  admin: 'Branch Dashboard',
  manager: 'Daily Ops & Members',
};

function getRedirectUrl(role: typeof ROLES[0]): string {
  if (role.id === 'superadmin' && !role.setupComplete) return '/superadmin/superadmin_setup-wizard';
  return role.redirectTo;
}

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', role: 'superadmin' },
  });

  const handleRoleSelect = (role: typeof ROLES[0]) => {
    setSelectedRole(role);
    setValue('email', '', { shouldValidate: false });
    setValue('password', '', { shouldValidate: false });
    setValue('role', role.id as LoginFormData['role']);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data.email, data.password);
      const userRole = response.user.role;
      const roleConfig = ROLES.find((r) => r.id === userRole);
      window.location.href = roleConfig ? getRedirectUrl(roleConfig) : `/${userRole}/dashboard`;
    } catch (err: any) {
      setError('root', { message: err.message || 'Invalid credentials. Please try again.' });
    }
  };

  return (
    <main className="flex min-h-screen bg-[#030712] text-white font-sans overflow-hidden">
      <style>{`
        .glass-panel {
          background: rgba(5, 13, 26, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(34, 211, 238, 0.15);
        }
        .glow-cyan {
          box-shadow: 0 0 40px rgba(34, 211, 238, 0.15);
        }
        .grid-bg {
          background-image: linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 50px #0A1628 inset !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>

      {/* Grid and Ambient Lights */}
      <div className="absolute inset-0 grid-bg z-0" />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* ── LEFT BRAND PANEL (Hidden on Mobile) ── */}
      <section className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative z-10 border-r border-cyan-500/10 bg-[#020610]/50 backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight">
            Library<span className="text-cyan-400">OS</span>
          </span>
        </div>

        {/* Hero Text */}
        <div className="space-y-6 max-w-lg">
          <h1 className="text-5xl font-black tracking-tight leading-[1.1]">
            Welcome Back to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              The Future of Libraries
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Manage your books, automate member alerts, and track attendance all in one seamless dashboard.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            {['Smart ID Cards', 'WhatsApp Automation', 'QR Checkouts', 'Multi-Branch'].map((feature) => (
              <span key={feature} className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle size={12} /> {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} LibraryOS. All rights reserved.</p>
      </section>

      {/* ── RIGHT AUTH PANEL ── */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              Library<span className="text-cyan-400">OS</span>
            </span>
          </div>

          <div className="glass-panel rounded-3xl p-8 glow-cyan">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black tracking-tight mb-2">Sign In</h2>
              <p className="text-slate-400 text-sm">Select your role and enter your credentials</p>
            </div>

            {/* Role Selector */}
            <div className="bg-[#0A1628] p-1.5 rounded-xl flex gap-1 mb-8 border border-white/5">
              {ROLES.map((role) => {
                const isActive = selectedRole.id === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && <CheckCircle size={12} className="opacity-70" />}
                    {role.label}
                  </button>
                );
              })}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <input type="hidden" {...register('role')} />

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your email"
                    {...register('email')}
                    className={`w-full bg-[#0A1628] border ${errors.email ? 'border-rose-500' : 'border-white/10 focus:border-cyan-500'} rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-colors`}
                  />
                </div>
                {errors.email && <p className="text-rose-400 text-xs font-medium mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-cyan-400 font-semibold hover:text-cyan-300">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className={`w-full bg-[#0A1628] border ${errors.password ? 'border-rose-500' : 'border-white/10 focus:border-cyan-500'} rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-colors pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-400 text-xs font-medium mt-1">{errors.password.message}</p>}
              </div>

              {/* Error Banner */}
              {errors.root && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <span>{errors.root.message}</span>
                </div>
              )}

              {/* Access Info Alert */}
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 flex items-start gap-3 mt-4">
                <div className="text-blue-400 mt-0.5">{selectedRole.icon}</div>
                <div>
                  <div className="text-xs font-bold text-blue-300">{selectedRole.label} Access</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Logging in will take you to {ROLE_DEST_LABEL[selectedRole.id]}</div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all active:scale-[0.98] mt-6 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={16} />
                    Secure Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-white/10 pt-6">
              <p className="text-sm text-slate-400">
                New to LibraryOS?{' '}
                <Link href="/auth/signup" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
