'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { CalendarDays, UserPlus, User } from 'lucide-react';

interface SeatData {
  id: string;
  status: 'free' | 'occupied' | 'expiring' | 'maintenance';
  student?: string;
  smartId?: string;
  shift?: string;
  expiry?: string;
}


const SHIFT_TABS = ['All', 'Morning', 'Evening', 'Full Day'];

const LEGEND_ITEMS = [
  { cls: 'ss-legend-dot--success',     label: 'Free' },
  { cls: 'ss-legend-dot--danger',      label: 'Occupied' },
  { cls: 'ss-legend-dot--warning',     label: 'Expiring ≤7 days' },
  { cls: 'ss-legend-dot--maintenance', label: 'Maintenance' },
];

const SHIFT_BADGE: Record<string, string> = {
  Morning:  'ss-badge ss-badge--primary',
  Evening:  'ss-badge ss-badge--success',
  'Full Day':'ss-badge ss-badge--info',
};

export default function SeatMatrixPage() {
  const [activeTab, setActiveTab]       = useState('All');
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [date, setDate]                 = useState(() => new Date().toISOString().slice(0, 10));
  const [seatsData, setSeatsData]       = useState<SeatData[]>([]);

  useEffect(() => {
    fetchApi('/seats_shifts_lockers/seat-matrix').then(data => {
      const mapped = data.map((s: any) => ({
        id: s.seatNumber.replace('S-', ''),
        status: s.isActive ? 'free' : 'maintenance',
      }));
      setSeatsData(mapped);
    }).catch(console.error);
  }, []);

  const visible = activeTab === 'All'
    ? seatsData
    : seatsData.filter(s => s.shift === activeTab || s.status === 'free' || s.status === 'maintenance');

  return (
    <div className="ss-page">

      {/* Filter bar */}
      <div className="ss-matrix-filter-bar">
        <div className="ss-tab-group">
          {SHIFT_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`ss-tab-btn ${activeTab === tab ? 'ss-tab-btn--active' : 'ss-tab-btn--inactive'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <label className="ss-date-btn">
          <CalendarDays size={15} className="ss-date-btn__icon" />
          <input
            type="date"
            className="ss-date-input"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>
      </div>

      {/* Legend */}
      <div className="ss-legend-card">
        {LEGEND_ITEMS.map(({ cls, label }) => (
          <div key={label} className="ss-legend-item">
            <span className={`ss-legend-dot ${cls}`} />
            <span className="ss-legend-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Grid + Sidebar */}
      <div className="ss-matrix-wrap">

        <div className="ss-matrix-grid-panel">
          <div className="ss-matrix-grid-header">
            <h2 className="ss-section-heading">A-Wing Floor Plan</h2>
            <span className="ss-text-caption">{visible.filter(s => s.status === 'free').length} seats free</span>
          </div>
          <div className="ss-seat-grid">
            {visible.map(seat => (
              <button
                key={seat.id}
                className={`ss-seat-cell ss-seat-cell--${seat.status}`}
                onClick={() => setSelectedSeat(seat)}
                title={
                  seat.student
                    ? `${seat.student} · ${seat.shift} · Expires ${seat.expiry}`
                    : seat.status === 'maintenance' ? 'Under Maintenance' : 'Available'
                }
              >
                {seat.id}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="ss-matrix-side">
          {!selectedSeat ? (
            <div className="ss-detail-panel">
              <p className="ss-text-secondary ss-text-caption">Click any seat to view details</p>
            </div>
          ) : selectedSeat.status === 'free' ? (
            /* Free seat panel */
            <div className="ss-detail-panel">
              <div className="ss-occupied-header__row">
                <span className="ss-badge ss-badge--success">Free</span>
                <span className="ss-occupied-header__seat">Seat {selectedSeat.id}</span>
              </div>
              <p className="ss-text-secondary ss-text-caption">This seat is available for assignment.</p>
              <button className="ss-btn-primary ss-btn--full">
                <UserPlus size={15} />⚡ Assign Student
              </button>
              <button className="ss-btn-ghost ss-btn--full" onClick={() => setSelectedSeat(null)}>
                Close
              </button>
            </div>
          ) : selectedSeat.status === 'maintenance' ? (
            /* Maintenance panel */
            <div className="ss-detail-panel">
              <div className="ss-occupied-header__row">
                <span className="ss-badge ss-badge--inactive">Maintenance</span>
                <span className="ss-occupied-header__seat">Seat {selectedSeat.id}</span>
              </div>
              <p className="ss-text-secondary ss-text-caption">This seat is under maintenance and unavailable.</p>
              <button className="ss-btn-ghost ss-btn--full" onClick={() => setSelectedSeat(null)}>Close</button>
            </div>
          ) : (
            /* Occupied / expiring panel */
            <>
              <div className="ss-occupied-header">
                <div className="ss-occupied-header__row">
                  <span className={`ss-badge ${selectedSeat.status === 'expiring' ? 'ss-badge--warning' : 'ss-badge--danger'}`}>
                    {selectedSeat.status === 'expiring' ? 'Expiring Soon' : 'Occupied'}
                  </span>
                  <span className="ss-occupied-header__seat">Seat {selectedSeat.id}</span>
                </div>
                <div className="ss-occupied-avatar-wrap">
                  <div className="ss-occupied-avatar">
                    <User size={40} className="ss-text-secondary" />
                  </div>
                  <h3 className="ss-occupied-name">{selectedSeat.student}</h3>
                  <p className="ss-occupied-id">{selectedSeat.smartId}</p>
                </div>
              </div>
              <div className="ss-detail-panel">
                <div className="ss-detail-grid">
                  <div className="ss-detail-cell">
                    <p className="ss-kpi-card__label">Shift</p>
                    <span className={SHIFT_BADGE[selectedSeat.shift ?? ''] ?? 'ss-badge ss-badge--inactive'}>
                      {selectedSeat.shift}
                    </span>
                  </div>
                  <div className="ss-detail-cell">
                    <p className="ss-kpi-card__label">Expires</p>
                    <p className={`ss-detail-cell__value ${selectedSeat.status === 'expiring' ? 'ss-detail-cell__value--danger' : ''}`}>
                      {selectedSeat.expiry}
                    </p>
                  </div>
                </div>
                <button className="ss-btn-primary ss-btn--full">
                  👁️ View Full Profile
                </button>
                <button className="ss-btn-ghost ss-btn--full" onClick={() => setSelectedSeat(null)}>
                  Close
                </button>
              </div>
            </>
          )}
        </aside>

      </div>
    </div>
  );
}
