'use client';
import Link from 'next/link';
import '@/app/superadmin/superadmin_system/system.css';

export default function NotFound() {
  return (
    <div className="system-theme min-h-screen flex text-center items-center justify-center p-8">
      <div className="text-center max-w-[480px] w-full mx-auto">

        {/* Giant 404 */}
        <div className="text-[clamp(80px,20vw,140px)] font-extrabold leading-none tracking-tight mb-2 bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent">
          404
        </div>

        {/* Icon illustration */}
        <div className="w-24 h-24 rounded-3xl mx-auto mb-6 bg-primary/10 border border-primary/20 flex items-center justify-center text-5xl">
          🔍
        </div>

        <h1 className="text-[26px] font-bold text-on-surface m-0 mb-3 tracking-tight">
          Page Not Found
        </h1>

        <p className="text-[15px] text-on-surface-variant leading-relaxed m-0 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Check the URL or go back to Dashboard.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/dashboard"
            className="sys-btn-primary !no-underline"
          >
            ← Go to Dashboard
          </Link>
          <button
            className="sys-btn-ghost"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>

        {/* Decorative glow */}
        <div className="sys-offline-glow" />
      </div>
    </div>
  );
}
