'use client';

import React, { createContext, useContext, useState } from 'react';

interface AdminContextType {
  selectedBranch: string;
  setSelectedBranch: (val: string) => void;
}

const AdminContext = createContext<AdminContextType>({
  selectedBranch: 'Main Branch',
  setSelectedBranch: () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [selectedBranch, setSelectedBranch] = useState('Main Branch');
  
  return (
    <AdminContext.Provider value={{ selectedBranch, setSelectedBranch }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
