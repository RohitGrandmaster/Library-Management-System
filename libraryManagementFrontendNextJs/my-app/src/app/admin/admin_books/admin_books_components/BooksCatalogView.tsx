'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, PlusCircle, Copy, Grid, User, Building2, Map,
  Languages, Tag, Library, MapPin, Barcode, Hash, Upload, Download,
  Archive, Search, MoreVertical, Edit3, Eye, ArrowRightLeft,
  Printer, History, CheckCircle, AlertTriangle, FileText,
  Image as ImageIcon, DollarSign, List, ShieldCheck
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_BOOKS = [
  { id: 'BK-1001', isbn: '978-0-13-235088-4', title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', publisher: 'Prentice Hall', edition: '1st', copies: 10, available: 6, issued: 3, reserved: 1, lost: 0, damaged: 0, location: 'Shelf A1', status: 'Available' },
  { id: 'BK-1002', isbn: '978-0-201-83595-3', title: 'The Mythical Man-Month', author: 'Fred Brooks', category: 'Software Eng', publisher: 'Addison-Wesley', edition: '2nd', copies: 5, available: 0, issued: 5, reserved: 0, lost: 0, damaged: 0, location: 'Shelf A2', status: 'Issued Out' },
  { id: 'BK-1003', isbn: '978-1-59327-928-8', title: 'Python Crash Course', author: 'Eric Matthes', category: 'Programming', publisher: 'No Starch Press', edition: '2nd', copies: 15, available: 12, issued: 2, reserved: 1, lost: 0, damaged: 0, location: 'Shelf B1', status: 'Available' },
  { id: 'BK-1004', isbn: '978-0-262-03384-8', title: 'Intro to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Sci', publisher: 'MIT Press', edition: '3rd', copies: 4, available: 1, issued: 1, reserved: 0, lost: 1, damaged: 1, location: 'Shelf C3', status: 'Low Stock' },
];

const SIDEBAR_MENU = [
  { id: 'all', label: 'All Books', icon: BookOpen },
  { id: 'add', label: 'Add Book', icon: PlusCircle },
  { id: 'copies', label: 'Book Copies', icon: Copy },
  { id: 'categories', label: 'Categories', icon: Grid },
  { id: 'authors', label: 'Authors', icon: User },
  { id: 'publishers', label: 'Publishers', icon: Building2 },
  { id: 'subjects', label: 'Subjects', icon: Map },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'editions', label: 'Editions', icon: Tag },
  { id: 'types', label: 'Book Types', icon: Library },
  { id: 'collections', label: 'Collections', icon: BookOpen },
  { id: 'locations', label: 'Locations (Rack/Shelf)', icon: MapPin },
  { id: 'barcode', label: 'Barcode Mgmt', icon: Barcode },
  { id: 'isbn', label: 'ISBN Mgmt', icon: Hash },
  { id: 'import', label: 'Import Books', icon: Upload },
  { id: 'export', label: 'Export Books', icon: Download },
  { id: 'archived', label: 'Archived Books', icon: Archive },
];

const FORM_TABS = [
  { id: 'basic', label: 'Basic Info', icon: BookOpen },
  { id: 'physical', label: 'Physical Details', icon: FileText },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'media', label: 'Media & Notes', icon: ImageIcon },
];

export default function BooksCatalogView() {
  const [books, setBooks] = useState(MOCK_BOOKS);
  const [activeMenu, setActiveMenu] = useState('all');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [activeFormTab, setActiveFormTab] = useState('basic');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(v => v === message ? '' : v), 2200); };

  const getStatusStyle = (status: string) => {
    if (status === 'Available') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    if (status === 'Issued Out') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    if (status === 'Low Stock') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800';
  };

  const handleAction = (action: string, book: any) => {
    setActionMenuOpen(null);
    notify(action.replace('_',' ') + ' completed for ' + book.title + '.');
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
            Books & Catalog
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Central repository for managing all library books, metadata, and inventory.
          </p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setActiveMenu('add')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm transition-colors">
             <PlusCircle size={16} /> Add New Book
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* SIDEBAR SUB-MENU */}
        <div className="w-full lg:w-64 flex flex-col gap-1 shrink-0 bg-card border border-border p-3 rounded-2xl shadow-sm h-[600px] overflow-y-auto custom-scrollbar">
          {SIDEBAR_MENU.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-200 ${
                activeMenu === menu.id 
                ? 'bg-teal-600 text-white shadow-md scale-[1.02]' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <menu.icon size={16} className={activeMenu === menu.id ? 'text-white' : 'text-teal-500/70'} />
              <span className="font-medium text-sm">{menu.label}</span>
            </button>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              
              {/* --- ALL BOOKS TABLE --- */}
              {activeMenu === 'all' && (
                <div className="flex flex-col h-full">
                  <div className="p-6 pb-4 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <BookOpen className="text-teal-500" /> Book Inventory
                    </h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input type="text" placeholder="Search by Title, ISBN, Author..." className="pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-72 transition-all" />
                    </div>
                  </div>

                  <div className="flex-1 overflow-x-auto custom-scrollbar p-6">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-lg">Book Details</th>
                          <th className="px-4 py-3">Category/Publisher</th>
                          <th className="px-4 py-3 text-center">Copies (Total/Avail)</th>
                          <th className="px-4 py-3 text-center">Status Stats</th>
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_BOOKS.map((book) => (
                          <tr key={book.id} className="border-b border-border hover:bg-muted/20 transition-colors group">
                            <td className="px-4 py-3">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-14 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 rounded border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 shadow-sm shrink-0">
                                  <BookOpen size={20} />
                                </div>
                                <div>
                                  <p className="font-bold text-base text-foreground leading-tight group-hover:text-teal-600 transition-colors">{book.title}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{book.author} • Edition: {book.edition}</p>
                                  <p className="text-[10px] text-muted-foreground font-mono mt-1">ID: {book.id} | ISBN: {book.isbn}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-foreground">{book.category}</p>
                              <p className="text-xs text-muted-foreground">{book.publisher}</p>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className="font-bold text-lg">{book.copies}</span>
                                <span className="text-muted-foreground">/</span>
                                <span className="font-bold text-lg text-emerald-600">{book.available}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-3 text-xs">
                                <div className="flex flex-col items-center"><span className="font-bold text-orange-500">{book.issued}</span><span className="text-[10px] text-muted-foreground uppercase">Iss</span></div>
                                <div className="flex flex-col items-center"><span className="font-bold text-blue-500">{book.reserved}</span><span className="text-[10px] text-muted-foreground uppercase">Res</span></div>
                                <div className="flex flex-col items-center"><span className="font-bold text-red-500">{book.lost + book.damaged}</span><span className="text-[10px] text-muted-foreground uppercase">L/D</span></div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground font-medium">{book.location}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusStyle(book.status)} whitespace-nowrap`}>
                                {book.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="relative inline-block text-left">
                                <button onClick={() => setActionMenuOpen(actionMenuOpen === book.id ? null : book.id)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                                  <MoreVertical size={18} className="text-muted-foreground" />
                                </button>
                                {actionMenuOpen === book.id && (
                                  <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1 text-left">
                                    <button onClick={() => handleAction('view', book)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Eye size={14} className="text-blue-500"/> View Details</button>
                                    <button onClick={() => handleAction('edit', book)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Edit3 size={14} className="text-amber-500"/> Edit Book</button>
                                    <div className="h-px bg-border my-1"></div>
                                    <button onClick={() => handleAction('add_copy', book)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Copy size={14} className="text-emerald-500"/> Add Copy</button>
                                    <button onClick={() => handleAction('transfer', book)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><ArrowRightLeft size={14} className="text-indigo-500"/> Transfer Copy</button>
                                    <div className="h-px bg-border my-1"></div>
                                    <button onClick={() => handleAction('print_barcode', book)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Barcode size={14} className="text-slate-500"/> Print Barcode</button>
                                    <button onClick={() => handleAction('print_label', book)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><Printer size={14} className="text-slate-500"/> Print Label</button>
                                    <button onClick={() => handleAction('history', book)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"><History size={14} className="text-purple-500"/> View History</button>
                                    <div className="h-px bg-border my-1"></div>
                                    <button onClick={() => handleAction('archive', book)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 text-red-500"><Archive size={14}/> Archive</button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- ADD BOOK FORM --- */}
              {activeMenu === 'add' && (
                <div className="flex flex-col h-full bg-background">
                  <div className="p-6 border-b border-border bg-card">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <PlusCircle className="text-teal-500" /> Add New Book Entry
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Fill out the detailed catalog information for the new book.</p>
                    
                    {/* Form Tabs */}
                    <div className="flex gap-2 mt-6 overflow-x-auto custom-scrollbar pb-2">
                      {FORM_TABS.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveFormTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                            activeFormTab === tab.id
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-400 border border-teal-200 dark:border-teal-800'
                            : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <tab.icon size={16} /> {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 flex-1 overflow-y-auto">
                    {activeFormTab === 'basic' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                         <div className="space-y-2 md:col-span-2">
                           <label className="text-sm font-medium">Book Title <span className="text-red-500">*</span></label>
                           <input type="text" placeholder="Enter main title" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Subtitle</label>
                           <input type="text" placeholder="Enter subtitle if any" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">ISBN-10 / ISBN-13 <span className="text-red-500">*</span></label>
                           <input type="text" placeholder="e.g. 978-..." className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Author <span className="text-red-500">*</span></label>
                           <input type="text" placeholder="Primary Author" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Co-Author(s)</label>
                           <input type="text" placeholder="Secondary Authors" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Publisher</label>
                           <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none"><option>Select Publisher</option></select>
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Category</label>
                           <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none"><option>Select Category</option></select>
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Subject</label>
                           <input type="text" placeholder="e.g. Computer Science" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Language</label>
                           <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none"><option>English</option><option>Hindi</option></select>
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Edition</label>
                           <input type="text" placeholder="e.g. 1st Edition" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Publication Year</label>
                           <input type="number" placeholder="YYYY" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div className="space-y-2 md:col-span-2">
                           <label className="text-sm font-medium">Book Type</label>
                           <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none"><option>Standard Book</option><option>Reference Book (Not for issue)</option><option>Journal</option></select>
                         </div>
                      </div>
                    )}

                    {activeFormTab === 'physical' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Number of Pages</label>
                           <input type="number" placeholder="e.g. 350" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Cover Type</label>
                           <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none"><option>Hardcover</option><option>Paperback</option></select>
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Size / Dimensions</label>
                           <input type="text" placeholder="e.g. 6x9 inches" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Weight (grams)</label>
                           <input type="number" placeholder="e.g. 500" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div className="space-y-2 md:col-span-2">
                           <label className="text-sm font-medium">Initial Condition</label>
                           <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none"><option>New</option><option>Good</option><option>Fair</option></select>
                         </div>
                      </div>
                    )}

                    {activeFormTab === 'financial' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Purchase Price (₹)</label>
                            <input type="number" placeholder="0.00" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Selling/Replacement Value (₹)</label>
                            <input type="number" placeholder="0.00" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Purchase Date</label>
                            <input type="date" className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Vendor / Supplier</label>
                            <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none"><option>Select Vendor</option></select>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Invoice Number</label>
                            <input type="text" placeholder="INV-..." className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                          </div>
                       </div>
                    )}

                    {activeFormTab === 'location' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Assign Branch</label>
                            <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none"><option>Central Main Library</option></select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Section</label>
                            <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none"><option>Select Section</option></select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Rack</label>
                            <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none"><option>Select Rack</option></select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Shelf</label>
                            <select className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none"><option>Select Shelf</option></select>
                          </div>
                       </div>
                    )}

                    {activeFormTab === 'media' && (
                       <div className="space-y-6 max-w-3xl">
                          <div className="space-y-2">
                             <label className="text-sm font-medium">Cover Image</label>
                             <div className="w-full h-40 border-2 border-dashed border-border rounded-xl bg-muted/30 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-teal-500/50 transition-colors cursor-pointer">
                               <ImageIcon size={32} className="mb-2 text-teal-500/50" />
                               <span className="text-sm font-medium text-foreground">Upload Cover Image</span>
                               <span className="text-xs mt-1">Recommended: JPG, PNG (Max 2MB)</span>
                             </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea rows={4} placeholder="Summary of the book..." className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Internal Notes</label>
                            <textarea rows={2} placeholder="Any notes for staff (not visible to members)..." className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-teal-500 outline-none" />
                          </div>
                       </div>
                    )}

                  </div>

                  {/* Form Footer Action */}
                  <div className="p-4 border-t border-border bg-card flex justify-between items-center rounded-b-2xl">
                     <div className="text-sm text-muted-foreground">
                        Step <span className="font-bold text-foreground">{FORM_TABS.findIndex(t => t.id === activeFormTab) + 1}</span> of {FORM_TABS.length}
                     </div>
                     <div className="flex gap-3">
                        <button type="button" onClick={()=>setActiveMenu("all")} className="px-6 py-2 rounded-xl border border-border bg-muted hover:bg-muted/80 font-medium">Cancel</button>
                        <button type="button" onClick={()=>{ const n="New Book "+(books.length+1); setBooks(items=>[...items,{id:"BK-"+String(books.length+1005),isbn:"Pending",title:n,author:"New Author",category:"General",publisher:"Library",edition:"1st",copies:1,available:1,issued:0,reserved:0,lost:0,damaged:0,location:"Unassigned",status:"Available"}]); notify("Book entry saved successfully."); setActiveMenu("all"); }} className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium flex items-center gap-2 shadow-md"><CheckCircle size={18}/> Save Book Entry</button>
                     </div>
                  </div>
                </div>
              )}

              {/* --- CATALOG SUB-WORKSPACES --- */}
              {!['all', 'add'].includes(activeMenu) && (
                 <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-card p-10">
                   <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border border-border">
                     <BookOpen size={48} className="opacity-20 text-teal-500" />
                   </div>
                   <h3 className="text-2xl font-bold text-foreground mb-2 capitalize">{activeMenu.replace('_', ' ')} Management</h3>
                   <p className="text-center max-w-md mb-6">This section handles the configuration and records for {activeMenu.replace('_', ' ')}.</p>
                   <button onClick={()=>notify(activeMenu.replace("_"," ") + " workspace opened.")} className="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md">
                     Open {activeMenu.replace('_', ' ')}
                   </button>
                 </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {notice && <div className="fixed right-5 bottom-5 z-50 rounded-xl border border-border bg-card shadow-xl px-4 py-3 text-sm font-semibold">{notice}</div>}
    </div>
  );
}
