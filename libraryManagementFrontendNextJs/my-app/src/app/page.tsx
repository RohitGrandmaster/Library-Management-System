'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import {
  BookOpen, Star, ChevronDown, CheckCircle2,
  CreditCard, Clock, IdCard, CalendarCheck,
  MessageCircle, LayoutGrid, Users, Shield,
  MapPin, Bell, Instagram, Twitter, Facebook, Youtube, Linkedin,
  Zap, TrendingUp, Award, ArrowRight, Play, BookMarked,
  GraduationCap, Building2, BarChart3, QrCode, Sparkles,
  ChevronRight, Menu, X,
} from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

const faqs = [
  {
    q: 'Kya main multiple library branches manage kar sakta hoon?',
    a: 'Bilkul! LibraryOS mein aap ek hi dashboard se unlimited branches manage kar sakte hain. Har branch ke liye alag inventory, members aur reports — sab ek account se.',
  },
  {
    q: 'Book return reminders kaise kaam karte hain?',
    a: 'Due date se 3 din pehle, 1 din pehle aur due date pe automatic WhatsApp reminder jaata hai. Late return pe fine bhi automatically calculate hota hai.',
  },
  {
    q: 'Kya digital library card print ho sakta hai?',
    a: 'Haan! Member photo, ID number, validity aur QR code ke saath professional library card ek click mein generate hota hai.',
  },
  {
    q: 'Agar member overdue book nahi lauta toh?',
    a: 'System automatic fine calculate karta hai aur escalation alerts bhejta hai. Member ka borrowing privilege bhi temporarily suspend ho sakta hai.',
  },
  {
    q: 'Kya ghar se library manage kar sakte hain?',
    a: 'Haan! 100% cloud-based hai. Mobile ya laptop — kahin se bhi real-time inventory, members aur reports dekh sakte hain.',
  },
  {
    q: 'New books catalog mein kaise add karte hain?',
    a: 'ISBN scan karo — book ka naam, author, genre, publisher sab automatically fill ho jaata hai. Manual entry bhi possible hai.',
  },
];

const features = [
  {
    title: 'Smart Book Catalog',
    desc: 'ISBN scan se instant book entry. Author, genre, publisher sab auto-fill. 10 lakh+ books ka database.',
    icon: BookOpen,
    gradient: 'from-cyan-500/20 to-blue-500/10',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    title: 'Member Management',
    desc: 'Student, staff, VIP — alag alag membership plans. Photo ID card with QR code ek click mein.',
    icon: Users,
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    title: 'Issue & Return Tracking',
    desc: 'QR/barcode scan se instant checkout. Return due dates, overdue alerts sab automatic.',
    icon: QrCode,
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    title: 'Fee & Fine Collection',
    desc: 'Membership fee, late fine — dono track. Online ya cash. WhatsApp pe receipt auto-send.',
    icon: CreditCard,
    gradient: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-400',
  },
  {
    title: 'WhatsApp Automation',
    desc: 'Due reminders, new arrivals, event alerts — sab automatic WhatsApp pe. Zero manual effort.',
    icon: MessageCircle,
    gradient: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/20',
    iconColor: 'text-green-400',
  },
  {
    title: 'Multi-Shift Reading Rooms',
    desc: 'Morning, Evening, Night — alag seats, fees, attendance. Ek dashboard se sab manage karo.',
    icon: Clock,
    gradient: 'from-cyan-500/20 to-indigo-500/10',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    title: 'Attendance & Analytics',
    desc: 'Daily footfall, peak hours, popular books — data-driven decisions ke liye real-time insights.',
    icon: BarChart3,
    gradient: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/20',
    iconColor: 'text-rose-400',
  },
  {
    title: 'Digital Library Cards',
    desc: 'QR-code powered smart cards. Scanner se instant member verify aur book issue.',
    icon: IdCard,
    gradient: 'from-amber-500/20 to-yellow-500/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    title: 'Multi-Branch Control',
    desc: 'Ek se zyada library branches? Sab ek account se. Centralized reports, alag alag inventory.',
    icon: Building2,
    gradient: 'from-indigo-500/20 to-blue-500/10',
    border: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Librarian, Gyan Mandir Library, Delhi',
    text: 'Pehle book issue-return register mein likhna padta tha. Ab QR scan se 5 second mein ho jaata hai. Members bhi khush hain — WhatsApp pe reminder aata hai toh book time pe waapis aati hai.',
    rating: 5,
    books: '3,200',
  },
  {
    name: 'Ramesh Gupta',
    role: 'Owner, Success Library, Patna',
    text: 'Teen branches hain meri. Pehle teen alag registers the. Ab ek screen pe teeno ka data. Revenue bhi 40% badh gaya kyunki koi book ab kho nahi jaati.',
    rating: 5,
    books: '8,500',
  },
  {
    name: 'Anita Joshi',
    role: 'Head Librarian, City Public Library, Pune',
    text: 'ISBN scan karke book add karo — naam, author, publisher sab auto-fill. ID card print, membership renew — sab ek jagah. Mera kaam half ho gaya.',
    rating: 5,
    books: '12,000',
  },
];

const steps = [
  { step: '01', title: 'Library Setup Karo', desc: 'Naam, logo, branches, membership plans — 10 minute mein configure karo. No technical knowledge needed.' },
  { step: '02', title: 'Books Catalog Mein Daalo', desc: 'ISBN scan karo ya CSV upload karo. 10,000 books bhi 30 minute mein ready.' },
  { step: '03', title: 'Members Enroll Karo', desc: 'Photo, contact, plan select karo. Library card instantly generate. WhatsApp pe welcome message auto-send.' },
  { step: '04', title: 'Issue & Return Start Karo', desc: 'QR scan se instant checkout. Due date set karo. Reminder automatic jaata hai.' },
  { step: '05', title: 'Reports & Growth Dekho', desc: 'Daily visitors, popular books, revenue trends — data se apni library grow karo.' },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '₹699',
    period: '/mo',
    desc: 'Naye libraries ke liye',
    savings: null,
    features: ['Up to 500 books', '100 members', 'WhatsApp alerts', 'Basic reports', 'Email support'],
    cta: 'Start Free Trial',
    popular: false,
    gradient: '',
  },
  {
    name: 'Professional',
    price: '₹1,799',
    period: '/3mo',
    desc: 'Growing libraries ke liye',
    savings: 'Save ₹297 vs monthly',
    features: ['Unlimited books', 'Unlimited members', 'WhatsApp + SMS alerts', 'Smart ID cards', 'QR checkout', 'Analytics dashboard', 'Priority support'],
    cta: 'Start 7-Day Free Trial',
    popular: true,
    gradient: 'from-cyan-900/50 to-blue-900/30',
  },
  {
    name: 'Enterprise',
    price: '₹3,299',
    period: '/6mo',
    desc: 'Multi-branch libraries ke liye',
    savings: 'Save ₹895 vs monthly',
    features: ['Everything in Professional', 'Multi-branch support', 'Advanced analytics', 'Custom reports', 'Dedicated onboarding'],
    cta: 'Contact Sales',
    popular: false,
    gradient: '',
  },
];

export default function LibraryOSLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [demoBooked, setDemoBooked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemo = () => {
    setDemoBooked(true);
    setTimeout(() => setDemoBooked(false), 3000);
  };

  if (!mounted) return <div className="min-h-screen bg-[#030712]" />;

  return (
    <div className="bg-[#030712] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        
        .gradient-text {
          background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gradient-text-gold {
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fde68a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glow-cyan {
          box-shadow: 0 0 40px rgba(34, 211, 238, 0.2), 0 0 80px rgba(34, 211, 238, 0.05);
        }
        .glow-btn {
          box-shadow: 0 0 25px rgba(34, 211, 238, 0.4), 0 4px 30px rgba(0,0,0,0.5);
        }
        .card-hover {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-6px);
          border-color: rgba(34, 211, 238, 0.35) !important;
        }
        .grid-bg {
          background-image: 
            linear-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
        .float-anim { animation: float 6s ease-in-out infinite; }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .pulse-ring { animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#030712]/80 backdrop-blur-2xl border-b border-cyan-500/10'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl blur-sm opacity-60" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Library<span className="gradient-text">OS</span>
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item, i) => (
              <a
                key={i}
                href={`#${['features', 'how', 'pricing', 'faq'][i]}`}
                className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 relative group"
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden md:block px-5 py-2 text-sm font-semibold text-slate-300 border border-white/15 rounded-full hover:border-cyan-500/40 hover:text-cyan-400 transition-all duration-200"
            >
              Login
            </Link>
            <button
              onClick={handleDemo}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full text-sm hover:scale-105 transition-all active:scale-95 glow-btn flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Free Demo
            </button>
            <button
              className="md:hidden p-2 text-slate-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-[#030712]/95 backdrop-blur-xl border-b border-white/10 px-6 py-5 space-y-4"
            >
              {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item, i) => (
                <a
                  key={i}
                  href={`#${['features', 'how', 'pricing', 'faq'][i]}`}
                  className="block text-slate-300 hover:text-cyan-400 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link href="/auth/login" className="block text-slate-300 hover:text-cyan-400 font-medium">
                Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 grid-bg opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030712]" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-purple-600/8 blur-[90px] rounded-full pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full relative z-10"
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/25 rounded-full text-cyan-400 text-sm font-semibold"
            >
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              India ka #1 Library Management Software
            </motion.div>

            {/* Headline */}
            <div>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.0]"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Apni Library Ko
                <br />
                <span className="gradient-text">Smart Banao</span>
                <br />
                <span className="text-white">Aaj Se.</span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
              Book catalog, member management, fee collection, WhatsApp alerts, attendance —
              sab kuch ek jagah.{' '}
              <span className="text-white font-semibold">Library chalana ab itna easy kabhi nahi tha.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleDemo}
                className="group px-8 py-4 text-base font-black bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 glow-btn"
              >
                🚀 Free Demo Book Karo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-white/15 rounded-2xl text-base flex items-center gap-3 hover:bg-white/5 hover:border-white/25 transition-all font-semibold text-slate-300">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                2 Min Demo Video
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-5 text-sm text-slate-400">
              {[
                { icon: CheckCircle2, text: '7 Din Free Trial' },
                { icon: Shield, text: 'No Credit Card' },
                { icon: Zap, text: 'Setup in 1 Hour' },
              ].map(({ icon: Icon, text }, i) => (
                <span key={i} className="flex items-center gap-2 text-slate-300">
                  <Icon size={15} className="text-cyan-400" />
                  {text}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative"
          >
            {/* Main Dashboard Card */}
            <div className="float-anim">
              <div className="rounded-3xl border border-cyan-500/20 bg-[#050D1A]/80 backdrop-blur-xl p-4 shadow-2xl glow-cyan">
                <div className="bg-[#0A1628] rounded-2xl border border-white/8 overflow-hidden">

                  {/* Header */}
                  <div className="bg-[#0D1F3C] px-5 py-4 flex items-center justify-between border-b border-white/8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <BookOpen size={14} />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">LibraryOS</div>
                        <div className="text-xs text-slate-500">Gyan Mandir Library, Delhi</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                      </span>
                      <span className="text-xs font-bold text-cyan-400">LIVE</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 divide-x divide-white/8 border-b border-white/8">
                    {[
                      { val: '3,248', label: 'Total Books', color: 'text-cyan-400' },
                      { val: '847', label: 'Members', color: 'text-amber-400' },
                      { val: '23', label: 'Overdue', color: 'text-rose-400' },
                    ].map((s, i) => (
                      <div key={i} className="p-4 text-center">
                        <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="p-5">
                    <div className="text-xs text-slate-500 mb-3 font-bold uppercase tracking-widest">Recent Activity</div>
                    <div className="space-y-2.5">
                      {[
                        { action: 'Book Issued', name: 'Arjun Sharma', book: 'Atomic Habits', time: '2m ago', color: 'bg-cyan-500' },
                        { action: 'Book Returned', name: 'Priya Singh', book: 'Rich Dad Poor Dad', time: '8m ago', color: 'bg-emerald-500' },
                        { action: 'Fee Paid', name: 'Rohit Kumar', book: '₹450 membership', time: '15m ago', color: 'bg-amber-500' },
                        { action: 'New Member', name: 'Ananya Gupta', book: 'Student Plan', time: '22m ago', color: 'bg-violet-500' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 py-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.color} shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-200 truncate">{item.name}</span>
                              <span className="text-[10px] text-slate-600 ml-2 shrink-0">{item.time}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">{item.action} · {item.book}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="border-t border-white/8 px-5 py-3 flex items-center justify-between">
                    <div className="text-xs text-slate-500">Today's Revenue</div>
                    <div className="text-sm font-black text-cyan-400">₹12,400</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Alert Card */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-8 bg-[#0D1F3C] border border-cyan-500/25 p-4 rounded-2xl shadow-2xl w-56 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle size={12} className="text-white" />
                </div>
                <span className="text-xs font-bold text-green-400">WhatsApp Sent</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">"Arjun ji, aapki book 'Atomic Habits' kal return karni hai. Fine se bachein!"</p>
            </motion.div>

            {/* Floating QR Card */}
            <motion.div
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -left-8 bg-[#0D1F3C] border border-amber-500/25 p-4 rounded-2xl shadow-2xl w-48 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <QrCode size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400">Book Issued</span>
              </div>
              <div className="text-xs text-slate-300">Wings of Fire</div>
              <div className="text-[10px] text-slate-500">A.P.J. Abdul Kalam</div>
              <div className="mt-2 text-[10px] text-emerald-400 font-bold">Due: Oct 12, 2026</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TRUSTED BY ── */}
      <section className="py-12 border-y border-white/6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-600 mb-8 text-xs font-bold tracking-[0.25em] uppercase">India ke Top Libraries ka Bharosa</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-5">
            {['Gyan Mandir Library', 'Delhi Public Library', 'Knowledge Hub', 'Success Library', 'Vidya Sagar', 'City Book House'].map((name, i) => (
              <span
                key={i}
                className="font-black text-lg text-slate-700 hover:text-slate-400 transition-colors tracking-tight cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={12} />
              Features
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black mb-5 tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Sab Kuch Ek Jagah.{' '}
              <span className="gradient-text">Zero Jhanjhat.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Modern library chalane ke liye jo chahiye — sab LibraryOS mein hai. Alag alag tools ki zaroorat khatam.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`card-hover bg-gradient-to-br ${f.gradient} border ${f.border} bg-white/[0.02] p-7 rounded-2xl group cursor-default`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${f.gradient} border ${f.border} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/30 to-purple-900/20" />
        <div className="absolute inset-0 border-y border-cyan-500/10" />
        <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { end: 2500, suffix: '+', label: 'Libraries Using', color: 'gradient-text' },
            { end: 150000, suffix: '+', label: 'Books Managed', color: 'gradient-text-gold' },
            { end: 500000, suffix: '+', label: 'Members Served', color: 'gradient-text' },
            { end: 99, suffix: '.9%', label: 'Uptime Guaranteed', color: 'gradient-text-gold' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`text-5xl lg:text-6xl font-black mb-2 tracking-tighter ${s.color}`}>
                <CountUp end={s.end} duration={2.5} separator="," />
                {s.suffix}
              </div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={12} />
              Quick Setup
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Sirf <span className="gradient-text-gold">5 Steps</span> Mein Ready
            </h2>
            <p className="text-slate-400 mt-4 text-lg">1 ghante mein aapki library fully digital ho jaati hai.</p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-7 top-14 bottom-14 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/30 to-transparent hidden md:block" />

            <div className="space-y-5">
              {steps.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-6 bg-white/[0.02] border border-white/8 rounded-2xl p-6 hover:border-cyan-500/25 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-black shadow-lg group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1.5 text-white">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-cyan-500 ml-auto mt-1 transition-colors shrink-0" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#050D1A] to-[#030712]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full" />

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Star size={12} fill="currentColor" />
              Testimonials
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black mb-3 tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Library Owners Ki{' '}
              <span className="gradient-text-gold">Asli Kahani</span>
            </h2>
            <p className="text-slate-400 text-lg">Real results, real libraries, real librarians.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="card-hover bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 p-7 rounded-2xl relative"
              >
                {/* Quote mark */}
                <div className="text-6xl font-black text-cyan-500/15 absolute -top-2 left-5 leading-none select-none">"</div>

                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, k) => (
                    <Star key={k} size={15} fill="currentColor" className="text-amber-400" />
                  ))}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6 relative z-10">"{t.text}"</p>

                <div className="border-t border-white/8 pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-base">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{t.name}</div>
                      <div className="text-cyan-400 text-xs">{t.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-amber-400">{t.books}</div>
                    <div className="text-[10px] text-slate-600 uppercase tracking-wider">Books</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Award size={12} />
              Pricing
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black mb-3 tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Simple Pricing.{' '}
              <span className="gradient-text">Bada Return.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-14">Koi hidden charge nahi. 7 din free mein try karo. Pasand aaya toh raho.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 text-left transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-cyan-900/40 to-blue-900/30 border border-cyan-500/40 shadow-[0_0_50px_rgba(34,211,238,0.12)] scale-105 glow-cyan'
                    : 'bg-white/[0.03] border border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                    ⭐ Most Popular
                  </div>
                )}

                <h3 className="text-xl font-black mb-1 text-white">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-5">{plan.desc}</p>

                <div className="mb-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-base font-normal text-slate-500">{plan.period}</span>
                </div>
                {plan.savings && (
                  <p className="text-xs text-cyan-400 font-bold mb-7">{plan.savings}</p>
                )}
                {!plan.savings && <p className="text-xs text-transparent mb-7">—</p>}

                <ul className="space-y-3 mb-8 text-sm">
                  {plan.features.map((feat, j) => (
                    <li key={j} className={`flex items-center gap-2 ${plan.popular ? 'text-white' : 'text-slate-300'}`}>
                      <CheckCircle2 size={15} className={plan.popular ? 'text-cyan-400 shrink-0' : 'text-slate-500 shrink-0'} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={plan.popular ? handleDemo : undefined}
                  className={`w-full py-3.5 rounded-xl font-black text-sm transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 shadow-lg'
                      : 'border border-white/15 text-slate-300 hover:bg-white/5 hover:border-white/25'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 px-6 bg-[#050D1A]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <MessageCircle size={12} />
              FAQ
            </div>
            <h2
              className="text-4xl font-black mb-3"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Aksar Pooche Jaane Waale{' '}
              <span className="gradient-text">Sawaal</span>
            </h2>
            <p className="text-slate-400">Koi aur sawaal? WhatsApp pe puchho — 5 minute mein reply milega.</p>
          </motion.div>

          <Accordion.Root type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <Accordion.Item
                  value={`item-${i}`}
                  className="border border-white/8 rounded-xl bg-white/[0.02] overflow-hidden hover:border-cyan-500/25 transition-colors"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-sm hover:bg-white/3 transition group text-white">
                      {faq.q}
                      <ChevronDown
                        size={18}
                        className="text-cyan-400 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180"
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">
                    {faq.a}
                  </Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[#030712]" />
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-blue-600/12 blur-[80px] rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8">
              <GraduationCap size={12} />
              Start Today — It's Free
            </div>

            <h2
              className="text-5xl lg:text-6xl font-black mb-5 tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Apni Library Ko{' '}
              <span className="gradient-text">Transform Karo</span>
              <br />Aaj Se
            </h2>
            <p className="text-xl text-slate-400 mb-3">7 din ka free trial. Koi credit card nahi. Setup 1 ghante mein.</p>
            <p className="text-base text-slate-600 mb-12">2,500+ library owners pehle se LibraryOS use kar rahe hain.</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleDemo}
                className="group px-10 py-5 text-lg font-black bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:scale-105 transition-all shadow-2xl glow-btn flex items-center justify-center gap-3"
              >
                🚀 Free Demo Book Karo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 text-lg font-black bg-[#25D366] text-white rounded-2xl hover:bg-[#20c25e] transition-all flex items-center justify-center gap-2 shadow-2xl"
              >
                <MessageCircle size={20} />
                WhatsApp Karo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#020812] pt-16 pb-8 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Library<span className="gradient-text">OS</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
                India ka #1 library management software. Books, members, fees, WhatsApp alerts — sab ek jagah. Modern libraries ke liye modern solution.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'X (Twitter)' },
                  { icon: Youtube, href: '#', label: 'YouTube' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-black text-white mb-5 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                {['Features', 'Pricing', 'Book Catalog', 'WhatsApp Alerts'].map(link => (
                  <li key={link}>
                    <a href="#features" className="hover:text-cyan-400 transition">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-black text-white mb-5 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                {['Help Center', 'WhatsApp Support', 'FAQ', 'Contact Us'].map(link => (
                  <li key={link}>
                    <a href="#faq" className="hover:text-cyan-400 transition">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-black text-white mb-5 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                {['About Us', 'Blog', 'Privacy Policy', 'Terms of Service'].map(link => (
                  <li key={link}>
                    <a href="#" className="hover:text-cyan-400 transition">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/6 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} LibraryOS. All rights reserved. Made with ❤️ for Indian Libraries.</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-slate-300 transition">Terms</a>
              <a href="#" className="hover:text-slate-300 transition">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── SUCCESS TOAST ── */}
      <AnimatePresence>
        {demoBooked && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 text-base font-bold glow-btn"
          >
            <CheckCircle2 className="w-5 h-5" />
            Demo request mila! Hum jald call karenge. 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
