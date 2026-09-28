"use client";

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, ComposedChart
} from 'recharts';

// Data for: Library growth, Branch growth, User growth, Member growth
const PLATFORM_GROWTH_DATA = [
  { name: 'Jan', libraries: 120, branches: 240, users: 4000, members: 120000 },
  { name: 'Feb', libraries: 150, branches: 310, users: 4800, members: 150000 },
  { name: 'Mar', libraries: 210, branches: 450, users: 5900, members: 210000 },
  { name: 'Apr', libraries: 280, branches: 590, users: 7200, members: 280000 },
  { name: 'May', libraries: 390, branches: 810, users: 9500, members: 390000 },
  { name: 'Jun', libraries: 510, branches: 1100, users: 12400, members: 510000 },
];

// Data for: Book growth, Circulation trend
const CONTENT_GROWTH_DATA = [
  { name: 'Jan', books: 1.2, circulation: 0.8 },
  { name: 'Feb', books: 1.5, circulation: 1.0 },
  { name: 'Mar', books: 1.8, circulation: 1.2 },
  { name: 'Apr', books: 2.2, circulation: 1.5 },
  { name: 'May', books: 2.7, circulation: 1.9 },
  { name: 'Jun', books: 3.5, circulation: 2.4 },
];

// Data for: Platform usage trend, Storage trend, API usage
const USAGE_TRENDS_DATA = [
  { name: 'Week 1', api: 1.2, storage: 2.1, platformUsage: 75 },
  { name: 'Week 2', api: 1.5, storage: 2.3, platformUsage: 78 },
  { name: 'Week 3', api: 1.8, storage: 2.5, platformUsage: 82 },
  { name: 'Week 4', api: 2.1, storage: 2.8, platformUsage: 88 },
];

// Data for: Login trend, Error trend
const HEALTH_TRENDS_DATA = [
  { name: 'Mon', logins: 8500, errors: 45 },
  { name: 'Tue', logins: 9200, errors: 32 },
  { name: 'Wed', logins: 9800, errors: 28 },
  { name: 'Thu', logins: 10500, errors: 52 },
  { name: 'Fri', logins: 11200, errors: 18 },
  { name: 'Sat', logins: 5400, errors: 12 },
  { name: 'Sun', logins: 4200, errors: 8 },
];

export default function DashboardAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Platform Growth (Libraries, Branches, Users, Members) */}
        <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-6">Platform Growth (Users & Members)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PLATFORM_GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '8px'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" name="User Growth" />
                <Area type="monotone" dataKey="members" stroke="#10b981" fillOpacity={1} fill="url(#colorMembers)" name="Member Growth (scale / 10)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Library & Branch Growth */}
        <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-6">Infrastructure Growth (Libraries & Branches)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLATFORM_GROWTH_DATA} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip cursor={{fill: '#374151', opacity: 0.1}} contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '8px'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                <Bar dataKey="libraries" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Library Growth" />
                <Bar dataKey="branches" fill="#ec4899" radius={[4, 4, 0, 0]} name="Branch Growth" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Book Growth & Circulation Trend */}
        <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-6">Book Growth & Circulation Trend (in Millions)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CONTENT_GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '8px'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                <Line type="monotone" dataKey="books" stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} name="Book Growth (M)" />
                <Line type="monotone" dataKey="circulation" stroke="#06b6d4" strokeWidth={3} dot={{r: 4}} name="Circulation Trend (M)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. System Usage: Platform, API, Storage */}
        <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-6">System Usage (API, Storage, Platform)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={USAGE_TRENDS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '8px'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                <Bar yAxisId="left" dataKey="platformUsage" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} name="Platform Usage Trend (%)" />
                <Line yAxisId="right" type="monotone" dataKey="api" stroke="#10b981" strokeWidth={2} name="API Usage (M Req)" />
                <Line yAxisId="right" type="monotone" dataKey="storage" stroke="#ef4444" strokeWidth={2} name="Storage Trend (TB)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Login Trend & Error Trend */}
        <div className="bg-white dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-6">Login Trend & System Error Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HEALTH_TRENDS_DATA}>
                <defs>
                  <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                <Tooltip contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '8px'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                <Area yAxisId="left" type="monotone" dataKey="logins" stroke="#6366f1" fillOpacity={1} fill="url(#colorLogins)" name="Login Trend" />
                <Area yAxisId="right" type="monotone" dataKey="errors" stroke="#ef4444" fillOpacity={1} fill="url(#colorErrors)" name="Error Trend" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
