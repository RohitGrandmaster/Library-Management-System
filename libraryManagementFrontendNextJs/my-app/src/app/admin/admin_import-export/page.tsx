'use client';

import { useRef, useState } from 'react';
import { Download, FileDown, FileUp, RefreshCw, UploadCloud, FileText } from 'lucide-react';

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
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 to-green-500 bg-clip-text text-transparent flex items-center gap-2">
            <Download size={28} className="text-teal-600" /> Import & Export
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preview, import and export library master data without leaving the Admin workspace.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={downloadCsv} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 shadow-sm transition-all">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:bg-secondary/80 shadow-sm transition-all border border-border">
            <UploadCloud size={16} /> Import CSV
          </button>
          <input ref={fileInputRef} hidden type="file" accept=".csv,text/csv" onChange={(e) => handleImport(e.target.files?.[0])} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(Object.keys(DATASETS) as Array<keyof typeof DATASETS>).map(name => (
          <button key={name} onClick={() => switchDataset(name)} className={`p-5 rounded-2xl border text-left transition-all ${dataset === name ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/10 shadow-sm' : 'border-border bg-card hover:border-teal-300'}`}>
            <div className="flex items-center gap-2 font-bold text-base text-foreground"><FileUp size={18} className="text-teal-500" /> {name}</div>
            <div className="text-3xl font-black mt-2 text-foreground">{DATASETS[name].length}</div>
            <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">sample records</div>
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-sm">
        <div>
          <div className="text-sm font-bold flex items-center gap-2 text-foreground"><FileDown size={16} className="text-teal-500" /> Current dataset: {dataset}</div>
          <div className="text-xs text-muted-foreground mt-1 font-medium">{fileName || 'No file imported in this session.'}</div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400"><RefreshCw size={14} /> {status}</div>
        <button onClick={resetDataset} className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-xs font-bold hover:bg-secondary/80 transition-all">
          <RefreshCw size={14} /> Reset Sample Data
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                {columns.map(col => <th key={col} className="px-5 py-4 font-bold">{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                  {columns.map(col => (
                    <td key={col} className="px-5 py-3 font-medium text-foreground">{String(row[col] ?? '')}</td>
                  ))}
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td className="text-center py-16 text-muted-foreground" colSpan={Math.max(columns.length, 1)}>
                    <FileText size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                    <p className="font-medium text-base">No rows to display.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
