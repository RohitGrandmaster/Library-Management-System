'use client';
import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import RoleMatrixBuilder from './RoleMatrixBuilder';
import PermissionHistory from './PermissionHistory';

const SUB_MENUS = ["Role Matrix Builder", "Permission History (Audit)"];

export default function RolesPage() {
  const [activeMenu, setActiveMenu] = useState("Role Matrix Builder");

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* Page Header */}
      <div>
        <div className="sa-breadcrumb mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Nexus 360</span><span>/</span><span className="text-orange-600">Super Admin</span><span>/</span><span className="text-gray-900 dark:text-white">Roles & Permissions</span>
        </div>
        <h1 className="sa-page-title text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl shadow-sm border border-orange-200/50 dark:border-orange-800/50">
            <ShieldAlert size={28} className="text-orange-600 dark:text-orange-400" />
          </div>
          Roles & Permissions
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">Control the global access architecture and module permissions for all authenticated platform roles.</p>
      </div>

      {/* Sub-menu Tabs */}
      <div className="flex gap-1.5 pb-2 pt-1 px-1 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {SUB_MENUS.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`px-6 py-3 text-sm font-bold rounded-xl whitespace-nowrap transition-all shadow-sm ${
              activeMenu === menu 
                ? 'bg-orange-600 text-white shadow-orange-600/20 scale-105' 
                : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-orange-50 dark:hover:bg-[#1E293B] hover:text-orange-600 hover:border-orange-200'
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="w-full">
        {activeMenu === "Role Matrix Builder" ? <RoleMatrixBuilder /> : <PermissionHistory />}
      </div>
    </div>
  );
}
