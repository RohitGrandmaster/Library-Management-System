'use client';
// RESPONSIBILITY: Entry page for the admin_engagement module (View Only).
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Save, FileBarChart2, Bell, CheckCircle, Clock, Printer, Download, Upload, MessageSquare, Send, Mail, Users, UserCheck, UserX, AlertTriangle } from 'lucide-react';

type AttStatus = 'present' | 'absent' | 'late' | null;

interface Student {
  id: string; smartId: string; name: string; initials: string;
  shift: string; consecutiveAbsent: number;
  status: AttStatus; inTime: string; outTime: string;
}

const INIT_STUDENTS: Student[] = [
  { id:'1', smartId:'SL-001', name:'Rahul Sharma',   initials:'RS', shift:'Morning',   consecutiveAbsent:0, status:'present', inTime:'09:00', outTime:'13:00' },
  { id:'2', smartId:'SL-002', name:'Priya Verma',    initials:'PV', shift:'Morning',   consecutiveAbsent:4, status:'absent', inTime:'',      outTime:''      },
  { id:'3', smartId:'SL-003', name:'Amit Kumar',     initials:'AK', shift:'Afternoon', consecutiveAbsent:0, status:'present', inTime:'13:00', outTime:'18:00' },
  { id:'4', smartId:'SL-004', name:'Sneha Patel',    initials:'SP', shift:'Morning',   consecutiveAbsent:7, status:'absent', inTime:'',      outTime:''      },
  { id:'5', smartId:'SL-005', name:'Rohan Das',      initials:'RD', shift:'Evening',   consecutiveAbsent:0, status:'late', inTime:'18:30', outTime:'22:00' },
  { id:'6', smartId:'SL-006', name:'Kavita Singh',   initials:'KS', shift:'Afternoon', consecutiveAbsent:0, status:null, inTime:'', outTime:'' },
  { id:'7', smartId:'SL-007', name:'Arjun Mehta',    initials:'AM', shift:'Morning',   consecutiveAbsent:2, status:'absent', inTime:'',      outTime:''      },
  { id:'8', smartId:'SL-008', name:'Nisha Gupta',    initials:'NG', shift:'Evening',   consecutiveAbsent:0, status:null, inTime:'', outTime:'' },
];

const today = new Date().toISOString().split('T')[0];

export default function AttendancePage() {
  const [date, setDate]         = useState(today);
  const [shift, setShift]       = useState('All');
  const [students] = useState<Student[]>(INIT_STUDENTS);

  const filtered = shift === 'All' ? students : students.filter(s => s.shift === shift);
  const marked   = filtered.filter(s => s.status !== null).length;
  const present  = filtered.filter(s => s.status === 'present').length;
  const absent   = filtered.filter(s => s.status === 'absent').length;
  const late     = filtered.filter(s => s.status === 'late').length;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Daily Attendance
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '14px' }}>View attendance records for all enrolled students by shift.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="admin-btn-ghost"><Download size={15} /> Export CSV</button>
          <button className="admin-btn-ghost"><Printer size={15} /> Print</button>
          <Link href="/admin/admin_engagement/absentee-report" className="admin-btn-primary">
            <FileBarChart2 size={15} /> Absentee Report
          </Link>
        </div>
      </div>

      {/* ── KPI Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="admin-kpi-card">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="admin-kpi-icon" style={{ background: 'var(--icon-bg-primary)', color: 'var(--primary)' }}>
              <Users size={20} />
            </div>
            <div>
              <div className="admin-kpi-label">Total Students</div>
              <div className="admin-kpi-value">{filtered.length}</div>
            </div>
          </div>
          <div className="admin-kpi-sub">{shift} Shift Selected</div>
        </div>

        <div className="admin-kpi-card">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="admin-kpi-icon" style={{ background: 'var(--icon-bg-success)', color: 'var(--success)' }}>
              <UserCheck size={20} />
            </div>
            <div>
              <div className="admin-kpi-label">Present</div>
              <div className="admin-kpi-value" style={{ color: 'var(--success)' }}>{present}</div>
            </div>
          </div>
          <div className="admin-kpi-sub">{filtered.length ? Math.round(present/filtered.length*100) : 0}% Attendance Rate</div>
        </div>

        <div className="admin-kpi-card">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="admin-kpi-icon" style={{ background: 'var(--icon-bg-danger)', color: 'var(--danger)' }}>
              <UserX size={20} />
            </div>
            <div>
              <div className="admin-kpi-label">Absent</div>
              <div className="admin-kpi-value" style={{ color: 'var(--danger)' }}>{absent}</div>
            </div>
          </div>
          <div className="admin-kpi-sub">{filtered.filter(s=>s.consecutiveAbsent>=3).length} need alerts</div>
        </div>

        <div className="admin-kpi-card">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="admin-kpi-icon" style={{ background: 'var(--icon-bg-warning)', color: 'var(--warning)' }}>
              <Clock size={20} />
            </div>
            <div>
              <div className="admin-kpi-label">Late</div>
              <div className="admin-kpi-value" style={{ color: 'var(--warning)' }}>{late}</div>
            </div>
          </div>
          <div className="admin-kpi-sub">{marked}/{filtered.length} Records Marked</div>
        </div>
      </div>

      {/* ── Filters & Main Content ── */}
      <div className="admin-card">
        {/* Header/Filters */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-glass)' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Shift</label>
              <select 
                value={shift} 
                onChange={e => setShift(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none', minWidth: '150px' }}
              >
                <option>All</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
             <span className="admin-badge admin-badge-success">{present} Present</span>
             <span className="admin-badge admin-badge-danger">{absent} Absent</span>
             <span className="admin-badge admin-badge-warning">{late} Late</span>
          </div>
        </div>

        {/* Student List */}
        <div style={{ padding: '0' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', opacity: 0.5, marginBottom: '16px' }}>📅</div>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>No students in this shift</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Try selecting a different shift or date.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filtered.map(s => {
                const isAlert = s.consecutiveAbsent >= 3;
                return (
                  <div key={s.id} style={{ 
                    display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '16px 20px', 
                    borderBottom: '1px solid var(--border)', 
                    background: isAlert ? 'var(--danger-bg)' : 'transparent',
                    transition: 'background 0.2s'
                  }}>
                    
                    {/* Avatar */}
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', border: '1px solid var(--border-bright)' }}>
                      {s.initials}
                    </div>

                    {/* Info */}
                    <div style={{ flex: '1 1 200px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{s.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.smartId} • {s.shift} Shift</div>
                    </div>

                    {/* View-Only Status */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {s.status === 'present' ? <span className="admin-badge admin-badge-success"><CheckCircle size={12}/> Present</span> : 
                       s.status === 'absent' ? <span className="admin-badge admin-badge-danger">✕ Absent</span> : 
                       s.status === 'late' ? <span className="admin-badge admin-badge-warning"><Clock size={12}/> Late</span> : 
                       <span className="admin-badge" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Unmarked</span>}
                    </div>

                    {/* Time (View-Only) */}
                    <div style={{ display: 'flex', gap: '12px', flex: '1 1 150px', justifyContent: 'flex-end' }}>
                       {(s.status === 'present' || s.status === 'late') ? (
                         <>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>In</span>
                             <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', color: 'var(--text-primary)' }}>{s.inTime || '--:--'}</div>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Out</span>
                             <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', color: 'var(--text-primary)' }}>{s.outTime || '--:--'}</div>
                           </div>
                         </>
                       ) : (
                         <div style={{ fontSize: '13px', color: 'var(--text-disabled)' }}>No timing data</div>
                       )}
                    </div>

                    {/* Alert Message */}
                    {isAlert && (
                      <div style={{ flex: '1 1 100%', marginTop: '8px', padding: '12px 16px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--danger-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontSize: '13px', fontWeight: 600 }}>
                           <AlertTriangle size={16} />
                           {s.consecutiveAbsent} Days Consecutive Absent
                         </div>
                         <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                           Action required by Manager/Superadmin
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
