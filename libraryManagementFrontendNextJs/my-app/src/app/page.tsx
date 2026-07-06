'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  Play, Star, ChevronDown, CheckCircle2,
  CreditCard, Clock, IdCard, CalendarCheck,
  MessageCircle, LayoutGrid, Users, Shield,
  MapPin, Bell, Instagram, Twitter, Facebook, Youtube, Linkedin,
} from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

const faqs = [
  {
    q: 'Kya main multiple shifts manage kar sakta hoon?',
    a: 'Haan! SeatFlow Pro mein unlimited shifts — Morning, Afternoon, Evening, Night. Har shift ke liye alag seat matrix aur fee structure.',
  },
  {
    q: 'WhatsApp alerts kaise kaam karte hain?',
    a: 'Fee due, seat expiry, attendance — sab pe automatic WhatsApp message. Koi manual kaam nahi.',
  },
  {
    q: 'Kya student ID card print ho sakta hai?',
    a: 'Bilkul! Photo, seat number, validity, QR code ke saath professional ID card ek click mein.',
  },
  {
    q: 'Agar student fee nahi deta toh?',
    a: '3 din pehle, 1 din pehle aur due date pe automatic reminder. Overdue hone par seat auto-block.',
  },
  {
    q: 'Kya ghar se manage kar sakte hain?',
    a: 'Haan! Cloud-based hai. Mobile se attendance, fee, seat status — sab dekh sakte hain.',
  },
];

const features = [
  {
    title: 'Seat Booking & Matrix',
    desc: 'Visual seat map — student apni seat choose kare. Booked, free, reserved sab ek nazar mein.',
    icon: LayoutGrid,
  },
  {
    title: 'Fee Collection & Receipt',
    desc: 'Monthly, quarterly, half-yearly plans. Cash ya online — dono track. Ek click mein WhatsApp receipt.',
    icon: CreditCard,
  },
  {
    title: 'WhatsApp Alerts',
    desc: 'Fee due, seat expiry, attendance — automatic WhatsApp. Aapko yaad dilane ki zaroorat nahi.',
    icon: MessageCircle,
  },
  {
    title: 'Multi-Shift Management',
    desc: 'Morning, Evening, Night — alag seats, fees, attendance. Ek dashboard se sab manage.',
    icon: Clock,
  },
  {
    title: 'Attendance Tracking',
    desc: 'QR scan se attendance mark. Monthly report ek click mein download.',
    icon: CalendarCheck,
  },
  {
    title: 'Student ID Cards',
    desc: 'Photo, seat number, validity, QR code — professional ID card ek click mein print.',
    icon: IdCard,
  },
  {
    title: 'Due Fee Reminders',
    desc: 'Auto reminder 3 din pehle, 1 din pehle. Overdue hone par seat auto-block ho jaati hai.',
    icon: Bell,
  },
  {
    title: 'Live Reports & Analytics',
    desc: 'Daily revenue, monthly collection, attendance trends — sab ek screen pe.',
    icon: Shield,
  },
  {
    title: 'Multi-Center Support',
    desc: 'Ek se zyada centers hain? Sab ek account se manage karo. Alag alag reports bhi.',
    icon: MapPin,
  },
];

const testimonials = [
  {
    name: 'Rajesh Sharma',
    role: 'Owner, Sharma Study Hub, Jaipur',
    text: 'Pehle fee collect karna aur yaad rakhna bahut mushkil tha. Ab WhatsApp pe automatic reminder jaata hai. Mera time bachta hai aur payment bhi time pe aati hai.',
  },
  {
    name: 'Sunita Verma',
    role: 'Owner, Vision Study Center, Lucknow',
    text: 'Seat matrix feature ne sab badal diya. Students khud seat book karte hain. Mujhe sirf dashboard dekhna hota hai. Kaafi professional lag raha hai ab.',
  },
  {
    name: 'Amit Patel',
    role: 'Owner, Lakshya Reading Room, Ahmedabad',
    text: 'ID card print karna, attendance track karna, monthly report — sab ek jagah. Pehle 3 alag registers the. Ab sirf ek screen.',
  },
];

export default function SeatFlowLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [demoBooked, setDemoBooked] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) return <div className="min-h-screen bg-[#07080F]" />;

  return (
    <div className="bg-[#07080F] text-white overflow-hidden font-sans">
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#07080F]/90 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight">SeatFlow</span>
              <span className="text-xl font-black text-violet-400 tracking-tight"> Pro</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#how" className="text-slate-400 hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden md:block px-5 py-2 text-sm font-medium border border-white/20 rounded-full hover:bg-white/5 transition">
              Login
            </Link>
            <button
              onClick={handleDemo}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold rounded-full text-sm hover:scale-105 transition-all active:scale-95 shadow-lg shadow-violet-500/25"
            >
              Free Demo
            </button>
          </div>
        </div>
      </nav>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(139,92,246,0.2),transparent_65%)] pointer-events-none" />
        <div className="absolute top-32 -right-32 w-[500px] h-[500px] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full relative z-10">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-400 text-sm font-semibold">
              <CheckCircle2 size={15} /> India ka #1 Self-Study Center Software
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tighter leading-[1.05]">
              Apna Self-Study Center<br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400 bg-clip-text text-transparent">
                Pro Ki Tarah Chalao.
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Seat booking, fee collection, WhatsApp alerts, attendance, ID cards —
              sab kuch ek jagah. Register karo, seat do, fee lo, report dekho.
              <span className="text-white font-semibold"> Bas itna hi kaam hai.</span>
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleDemo}
                className="px-8 py-4 text-base font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(139,92,246,0.35)]"
              >
                🚀 Free Demo Book Karo
              </button>
              <button className="px-8 py-4 border border-white/20 rounded-2xl text-base flex items-center gap-3 hover:bg-white/5 transition font-medium">
                <Play className="w-4 h-4" /> 2 Min Video Dekho
              </button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-violet-400" /> 7 Din Free Trial</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-violet-400" /> No Credit Card</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-violet-400" /> Setup in 1 Hour</span>
            </div>
          </motion.div>

          {/* Right — Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="hidden lg:block relative"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl">
              <div className="bg-[#0F1117] rounded-xl border border-white/10 overflow-hidden">

                {/* Header */}
                <div className="bg-[#161820] px-5 py-3 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                      <LayoutGrid size={12} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">SeatFlow Pro</div>
                      <div className="text-xs text-slate-500">Sharma Study Center, Jaipur</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold text-emerald-400">LIVE</span>
                  </div>
                </div>

                {/* Shift Tabs */}
                <div className="flex gap-2 px-5 pt-4">
                  {['Morning 6–12', 'Evening 12–6', 'Night 6–11'].map((s, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full text-xs font-bold ${
                      i === 0 ? 'bg-violet-600 text-white' : 'bg-white/10 text-slate-400'
                    }`}>{s}</span>
                  ))}
                </div>

                {/* Seat Grid */}
                <div className="p-5">
                  <div className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-widest">Seat Matrix — Morning Shift</div>
                  <div className="grid grid-cols-8 gap-1.5">
                    {Array.from({ length: 40 }).map((_, i) => {
                      const booked = [0,1,2,3,5,7,9,11,14,17,19,22,25,28,31].includes(i);
                      const reserved = i === 15;
                      return (
                        <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold border ${
                          booked ? 'bg-violet-500/25 border-violet-500/40 text-violet-300' :
                          reserved ? 'bg-orange-500/25 border-orange-500/40 text-orange-300' :
                          'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>{i + 1}</div>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 mt-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-violet-500/40" /> Booked (15)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/20" /> Free (24)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-500/30" /> Reserved (1)</span>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="grid grid-cols-3 border-t border-white/10">
                  {[
                    { val: '₹48,500', label: 'This Month', color: 'text-violet-400' },
                    { val: '38', label: 'Present Today', color: 'text-emerald-400' },
                    { val: '3', label: 'Fee Due', color: 'text-orange-400' },
                  ].map((s, i) => (
                    <div key={i} className="p-4 text-center border-r border-white/10 last:border-0">
                      <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating WhatsApp Card */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -right-5 bg-[#161820] border border-white/15 p-4 rounded-2xl shadow-2xl w-52"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <MessageCircle size={14} className="text-green-400" />
                <span className="text-xs font-bold text-green-400">WhatsApp Alert</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">"Rahul ji, aapki fee ₹1,200 due hai. Kal tak jama karein."</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* ── TRUSTED BY ── */}
      <section className="py-10 border-y border-white/8 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 mb-6 text-xs font-bold tracking-[0.25em] uppercase">India ke Top Self-Study Centers ka Bharosa</p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
            {['Sharma Study Hub', 'Rajput Reading Room', 'Vision Study Center', 'Lakshya Library', 'Success Point', "Topper's Den"].map((name, i) => (
              <span key={i} className="font-black text-lg text-slate-500 hover:text-slate-300 transition-colors tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">
              Sab Kuch Ek Jagah.
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"> Zero Jhanjhat.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Self-study center chalane ke liye jo chahiye — sab SeatFlow Pro mein hai.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="bg-white/[0.04] border border-white/10 p-7 rounded-2xl hover:border-violet-500/40 hover:bg-white/[0.07] transition-all duration-300 group cursor-default"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 rounded-xl flex items-center justify-center mb-5 border border-violet-500/20 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ── STATS ── */}
      <section className="py-20 bg-[#0B0C14] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { end: 1200, suffix: '+', label: 'Active Centers', color: 'text-violet-400' },
            { end: 48000, suffix: '+', label: 'Seats Managed', color: 'text-fuchsia-400' },
            { end: 95000, suffix: '+', label: 'Students Enrolled', color: 'text-orange-400' },
            { end: 99, suffix: '%', label: 'Uptime SLA', color: 'text-emerald-400' },
          ].map((s, i) => (
            <div key={i}>
              <div className={`text-5xl lg:text-6xl font-black mb-2 tracking-tighter ${s.color}`}>
                <CountUp end={s.end} duration={2.5} separator="," />{s.suffix}
              </div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">
              Sirf <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">5 Steps</span> Mein Setup
            </h2>
            <p className="text-slate-400 mt-3 text-lg">1 ghante mein aapka center fully digital.</p>
          </div>

          <div className="space-y-6">
            {[
              { step: '01', title: 'Center Setup Karo', desc: 'Naam, shifts, seat layout aur fee plans 10 minute mein configure karo.' },
              { step: '02', title: 'Seats & Shifts Banao', desc: 'Morning, Evening, Night shifts ke liye alag seat matrix. Har seat ka price alag ho sakta hai.' },
              { step: '03', title: 'Students Enroll Karo', desc: 'Naam, photo, phone add karo. ID card automatically generate.' },
              { step: '04', title: 'Fee Lo & Receipt Do', desc: 'Cash ya online record karo. WhatsApp pe receipt auto-send.' },
              { step: '05', title: 'Reports & Analytics Dekho', desc: 'Daily attendance, monthly revenue, due fees — kabhi bhi, kahin se bhi.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-6 bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-violet-500/30 transition-colors"
              >
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-xl font-black shadow-lg shadow-violet-500/20">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 bg-[#0B0C14] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-black mb-3 tracking-tight">Center Owners Ki Zubani</h2>
            <p className="text-slate-400 text-lg">Jinhoone apna center SeatFlow Pro se digital kiya.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 p-7 rounded-2xl hover:border-violet-500/30 transition-colors relative">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, k) => <Star key={k} size={16} fill="currentColor" className="text-yellow-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-black text-base">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-violet-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-3 tracking-tight">
            Simple Pricing.
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"> Bada Fayda.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-14">Koi hidden charge nahi. Aaj se shuru karo.</p>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {/* Monthly */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-black mb-1">Monthly</h3>
              <p className="text-slate-500 text-sm mb-5">Chhote centers ke liye</p>
              <div className="text-4xl font-black mb-1">₹799<span className="text-base font-normal text-slate-500">/mo</span></div>
              <p className="text-xs text-slate-600 mb-7">Billed monthly</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                {['Up to 50 seats', '2 shifts', 'WhatsApp alerts', 'Fee collection', 'Email support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle2 size={15} className="text-violet-400 shrink-0" />{item}</li>
                ))}
              </ul>
              <button className="w-full py-3 border border-white/20 rounded-xl font-bold text-sm hover:bg-white/5 transition">Choose Monthly</button>
            </div>

            {/* Quarterly — Popular */}
            <div className="relative bg-gradient-to-b from-violet-900/40 to-fuchsia-900/20 border border-violet-500/50 rounded-2xl p-8 text-left shadow-[0_0_40px_rgba(139,92,246,0.2)] scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xs font-black px-5 py-1.5 rounded-full uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-black mb-1">Quarterly</h3>
              <p className="text-violet-300 text-sm mb-5">Growing centers ke liye</p>
              <div className="text-4xl font-black mb-1">₹1,999<span className="text-base font-normal text-slate-400">/3mo</span></div>
              <p className="text-xs text-emerald-400 font-bold mb-7">Save ₹398 vs monthly</p>
              <ul className="space-y-3 mb-8 text-sm text-white">
                {['Unlimited seats', 'Unlimited shifts', 'WhatsApp + SMS alerts', 'Student ID cards', 'Attendance tracking', 'Priority support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle2 size={15} className="text-violet-400 shrink-0" />{item}</li>
                ))}
              </ul>
              <button onClick={handleDemo} className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-black text-sm rounded-xl hover:scale-105 transition-transform shadow-lg">Start 7-Day Free Trial</button>
            </div>

            {/* Half-Yearly */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-black mb-1">Half-Yearly</h3>
              <p className="text-slate-500 text-sm mb-5">Established centers ke liye</p>
              <div className="text-4xl font-black mb-1">₹3,499<span className="text-base font-normal text-slate-500">/6mo</span></div>
              <p className="text-xs text-emerald-400 font-bold mb-7">Save ₹1,295 vs monthly</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                {['Everything in Quarterly', 'Multi-center support', 'Advanced analytics', 'Dedicated onboarding'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle2 size={15} className="text-violet-400 shrink-0" />{item}</li>
                ))}
              </ul>
              <button className="w-full py-3 border border-white/20 rounded-xl font-bold text-sm hover:bg-white/5 transition">Choose Half-Yearly</button>
            </div>
          </div>
        </div>
      </section>
      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 bg-[#0B0C14] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">Aksar Pooche Jaane Waale Sawaal</h2>
            <p className="text-slate-400">Koi aur sawaal? WhatsApp karo — 5 minute mein reply.</p>
          </div>
          <Accordion.Root type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <Accordion.Item key={i} value={`item-${i}`} className="border border-white/10 rounded-xl bg-white/[0.03] overflow-hidden hover:border-violet-500/30 transition-colors">
                <Accordion.Header>
                  <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-base hover:bg-white/5 transition group">
                    {faq.q}
                    <ChevronDown size={18} className="text-violet-400 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">
                  {faq.a}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden text-center bg-gradient-to-br from-violet-900 via-[#0F0A1E] to-fuchsia-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.25),transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl lg:text-6xl font-black mb-5 tracking-tighter">Apna Center Aaj Se Digital Karo</h2>
          <p className="text-xl text-white/80 mb-3">7 din free trial. Koi credit card nahi. Setup 1 ghante mein.</p>
          <p className="text-base text-white/50 mb-10">1,200+ center owners pehle se SeatFlow Pro use kar rahe hain.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleDemo}
              className="px-10 py-5 text-lg font-black bg-white text-black rounded-2xl hover:scale-105 transition-all shadow-2xl"
            >
              🚀 Free Demo Book Karo
            </button>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 text-lg font-black bg-green-500 text-white rounded-2xl hover:bg-green-400 transition-all flex items-center justify-center gap-2 shadow-2xl"
            >
              <MessageCircle size={20} /> WhatsApp Karo
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#05060C] pt-16 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">

            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight">SeatFlow <span className="text-violet-400">Pro</span></span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
                Self-study centers ke liye India ka #1 management software. Seat booking, fee collection, WhatsApp alerts — sab ek jagah.
              </p>
              {/* Social Icons */}
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
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-500/20 hover:border-violet-500/40 transition-all"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-black text-white mb-5 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                {['Features', 'Pricing', 'Seat Matrix', 'WhatsApp Alerts'].map(link => (
                  <li key={link}><a href="#features" className="hover:text-violet-400 transition">{link}</a></li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-black text-white mb-5 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                {['Help Center', 'WhatsApp Support', 'FAQ', 'Contact Us'].map(link => (
                  <li key={link}><a href="#faq" className="hover:text-violet-400 transition">{link}</a></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-black text-white mb-5 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                {['About Us', 'Blog', 'Privacy Policy', 'Terms of Service'].map(link => (
                  <li key={link}><a href="#" className="hover:text-violet-400 transition">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>&copy; {new Date().getFullYear()} SeatFlow Pro. All rights reserved. Made with ❤️ for Indian Self-Study Centers.</span>
            <div className="flex gap-5">
              <a href="#" className="hover:text-slate-300 transition">Terms</a>
              <a href="#" className="hover:text-slate-300 transition">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {demoBooked && (
        <div className="fixed bottom-8 right-8 bg-violet-600 text-white px-8 py-5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 text-lg font-medium">
          <CheckCircle2 /> Demo request mila! Hum jald call karenge.
        </div>
      )}
    </div>
  );
}
