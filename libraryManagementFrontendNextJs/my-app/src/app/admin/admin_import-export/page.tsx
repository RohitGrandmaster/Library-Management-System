'use client';

import { useRef, useState } from 'react';
import { Download, FileDown, FileUp, RefreshCw, UploadCloud } from 'lucide-react';

type Row = Record<string, string | number>;

const DATASETS: Record<string, Row[]> = {
  Members: [
    { memberId: 'MBR-1001', name: 'Amit Kumar', phone: '+91 9876500001', status: 'Active' },
    { memberId: 'MBR-1002', name: 'Neha Singh', phone: '+91 9876500002', status: 'Active' },
    { memberId: 'MBR-1003', name: 'Rahul Verma', phone: '+91 9876500003', status: 'Suspended' },
  ],
  Books: [
    { isbn: '978000000001', title: 'Clean Code', author: 'Robert C. Martin', status: 'Available' },
    { isbn: '978000000002', title: 'Atomic Habits', author: 'James Clear', status: 'Issued' },
    { isbn: '978000000003', title: 'The Alchemist', author: 'Paulo Coelho', status: 'Available' },
  ],
  Staff: [
    { staffId: 'ST-101', name: 'Sunita Patil', role: 'Manager', status: 'Active' },
    { staffId: 'ST-102', name: 'Priya Joshi', role: 'Staff', status: 'Active' },
  ],
};

function rowsToCsv(rows: Row[]) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const str = String(value ?? '');
    return /[",\n]/.test(str) ? '"' + str.replace(/"/g, '""') + '"' : str;
  };
  return [headers.join(','), ...rows.map(row => headers.map(h => escape(row[h])).join(','))].join('\n');
}

export default function AdminImportExportPage() {
  const [dataset, setDataset] = useState<keyof typeof DATASETS>('Members');
  const [rows, setRows] = useState<Row[]>(DATASETS.Members);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('Ready for import/export.');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const switchDataset = (next: keyof typeof DATASETS) => {
    setDataset(next);
    setRows(DATASETS[next]);
    setStatus(`Loaded ${DATASETS[next].length} mock ${next.toLowerCase()} records.`);
    setFileName('');
  };

  const downloadCsv = () => {
    const csv = rowsToCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `libraryos-${dataset.toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus(`Exported ${rows.length} ${dataset.toLowerCase()} records to CSV.`);
  };

  const handleImport = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
      setStatus('Import file has no data rows.');
      return;
    }
    const headers = lines[0].split(',').map(h => h.trim());
    const imported = lines.slice(1).map((line, index) => {
      const values = line.split(',');
      return headers.reduce<Row>((acc, header, i) => { acc[header || `column${i + 1}`] = values[i]?.trim() ?? ''; return acc; }, { __row: index + 1 });
    });
    setRows(imported);
    setStatus(`Imported ${imported.length} rows from ${file.name}.`);
  };

  const resetDataset = () => {
    setRows(DATASETS[dataset]);
    setFileName('');
    setStatus(`Reset to ${DATASETS[dataset].length} sample ${dataset.toLowerCase()} records.`);
  };

  const columns = rows.length ? Object.keys(rows[0]) : [];

  return (
    <div className="space-y-6 pb-12 min-w-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Library OS › Admin › Import / Export</p>
          <h1 className="text-2xl font-bold tracking-tight">Data Import &amp; Export</h1>
          <p className="text-sm text-muted-foreground mt-1">Preview, import and export library master data without leaving the Admin workspace.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={downloadCsv} className="admin-btn admin-btn-primary inline-flex items-center gap-2"><Download size={16} /> Export CSV</button>
          <button onClick={() => fileInputRef.current?.click()} className="admin-btn admin-btn-ghost inline-flex items-center gap-2"><UploadCloud size={16} /> Import CSV</button>
          <input ref={fileInputRef} hidden type="file" accept=".csv,text/csv" onChange={(e) => handleImport(e.target.files?.[0])} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(DATASETS) as Array<keyof typeof DATASETS>).map(name => (
          <button key={name} onClick={() => switchDataset(name)} className={`admin-card p-4 text-left transition-all ${dataset === name ? 'ring-2 ring-[var(--primary)]' : 'hover:bg-muted/40'}`}>
            <div className="flex items-center gap-2 font-semibold"><FileUp size={16} /> {name}</div>
            <div className="text-2xl font-bold mt-1">{DATASETS[name].length}</div>
            <div className="text-xs text-muted-foreground">sample records</div>
          </button>
        ))}
      </div>

      <div className="admin-card p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <div className="text-sm font-semibold flex items-center gap-2"><FileDown size={16} /> Current dataset: {dataset}</div>
          <div className="text-xs text-muted-foreground mt-1">{fileName || 'No file imported in this session.'}</div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><RefreshCw size={14} /> {status}</div>
        <button onClick={resetDataset} className="admin-btn admin-btn-ghost inline-flex items-center gap-2"><RefreshCw size={15} /> Reset Sample Data</button>
      </div>

      <div className="admin-table-wrapper overflow-x-auto">
        <table className="admin-table min-w-[700px] w-full">
          <thead><tr>{columns.map(col => <th key={col}>{col}</th>)}</tr></thead>
          <tbody>
            {rows.map((row, index) => <tr key={index}>{columns.map(col => <td key={col}>{String(row[col] ?? '')}</td>)}</tr>)}
            {!rows.length && <tr><td className="text-center py-12 text-muted-foreground" colSpan={Math.max(columns.length, 1)}>No rows to display.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
