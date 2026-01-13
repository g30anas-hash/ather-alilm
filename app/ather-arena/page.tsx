"use client";

import { useState } from "react";
import { useUser, Competition } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Trophy, Users, Clock, ArrowRight, Shield, Crown } from "lucide-react";
import GoldButton from "@/components/GoldButton";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AtherArenaPage() {
  const { competitions, joinCompetition, name, role } = useUser();
  const { showToast } = useToast();
  const router = useRouter();
  const [selectedComp, setSelectedComp] = useState<Competition | null>(null);

  const activeCompetitions = competitions.filter(c => c.status === 'active' || c.status === 'upcoming');

  const handleJoin = (comp: Competition) => {
    // Check if already joined (Mock logic)
    const isJoined = comp.participants.some(p => p.studentName === name);
    
    if (isJoined) {
        showToast("أنت مسجل بالفعل في هذه المنافسة!", "info");
        return;
    }

    if (role !== 'student') {
        showToast("المنافسات متاحة للطلاب فقط أيها القائد!", "warning");
        return;
    }

    joinCompetition(comp.id, 123, name); // Using mock ID 123
    showToast(`تم تسجيلك في "${comp.title}" بنجاح! استعد للمعركة.`, "success");
  };

  return (
    <>
      <MobileNav />
      <PageTransition>
        <main className="min-h-screen bg-[#0f172a] bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center bg-fixed overflow-y-auto">
          <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-sm z-0" />
          
          <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-3 bg-[#DAA520]/10 rounded-full hover:bg-[#DAA520]/20 text-[#DAA520] transition-colors">
                        <ArrowRight className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] flex items-center gap-3">
                            <Swords className="w-12 h-12" />
                            ساحة أثير
                        </h1>
                        <p className="text-[#F4E4BC]/60 mt-2 font-[family-name:var(--font-cairo)]">
                            ميدان الشرف والمنافسة.. حيث يولد الأبطال
                        </p>
                    </div>
                </div>

                <div className="bg-[#DAA520]/10 px-6 py-3 rounded-xl border border-[#DAA520]/30 flex items-center gap-4">
                    <Trophy className="w-8 h-8 text-[#FFD700]" />
                    <div>
                        <p className="text-[#F4E4BC]/50 text-xs">البطولة الحالية</p>
                        <p className="text-[#F4E4BC] font-bold">دوري فرسان الرياضيات</p>
                    </div>
                </div>
            </header>

            {/* Active Competitions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeCompetitions.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-[#000]/40 rounded-2xl border-2 border-dashed border-[#5D4037]">
                        <Swords className="w-24 h-24 mx-auto text-[#F4E4BC]/20 mb-6" />
                        <h3 className="text-2xl text-[#F4E4BC]/60 font-[family-name:var(--font-amiri)]">لا توجد معارك نشطة حالياً</h3>
                        <p className="text-[#F4E4BC]/40 mt-2">استعد وتدرب جيداً، المعركة القادمة قريبة!</p>
                    </div>
                ) : (
                    activeCompetitions.map((comp, idx) => (
                        <motion.div
                            key={comp.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#1e293b]/80 border-2 border-[#334155] rounded-2xl overflow-hidden hover:border-[#DAA520] transition-all duration-300 group hover:-translate-y-2 relative"
                        >
                            <div className="absolute top-0 right-0 p-4 z-10">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border",
                                    comp.status === 'active' 
                                        ? "bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30" 
                                        : "bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30"
                                )}>
                                    {comp.status === 'active' ? 'جاري الآن 🔥' : 'قريباً ⏳'}
                                </span>
                            </div>

                            <div className="h-40 bg-gradient-to-br from-[#0f172a] to-[#334155] relative flex items-center justify-center">
                                <Shield className="w-20 h-20 text-[#F4E4BC]/10 absolute" />
                                <Trophy className="w-16 h-16 text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] z-10" />
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)] mb-2 group-hover:text-[#FFD700] transition-colors">
                                    {comp.title}
                                </h3>
                                <p className="text-[#94a3b8] text-sm mb-6 line-clamp-2 h-10">
                                    {comp.description}
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-sm text-[#cbd5e1]">
                                        <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#4ECDC4]" /> المشاركون</span>
                                        <span className="font-bold">{comp.participants.length} بطل</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-[#cbd5e1]">
                                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#FF6B6B]" /> المدة</span>
                                        <span className="font-bold">{comp.durationMinutes} دقيقة</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-[#cbd5e1]">
                                        <span className="flex items-center gap-2"><Crown className="w-4 h-4 text-[#FFD700]" /> الجائزة</span>
                                        <span className="font-bold text-[#FFD700]">{comp.rewards.gold} 🪙</span>
                                    </div>
                                </div>

                                <GoldButton 
                                    fullWidth 
                                    onClick={() => handleJoin(comp)}
                                    disabled={comp.status !== 'active'}
                                    className={cn(comp.status !== 'active' && "opacity-50 grayscale cursor-not-allowed")}
                                >
                                    {comp.status === 'active' ? "انضم للمعركة" : "انتظر الإشارة"}
                                </GoldButton>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Leaderboard Teaser */}
            <div className="mt-20">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)]">
                        لوحة الشرف (Top 3)
                    </h2>
                </div>
                
                <div className="flex flex-col md:flex-row justify-center items-end gap-6 h-64">
                    {/* 2nd Place */}
                    <div className="w-full md:w-48 bg-[#2A1B0E]/80 border border-[#C0C0C0] h-48 rounded-t-2xl flex flex-col items-center justify-end p-4 relative">
                        <div className="absolute -top-6 w-12 h-12 bg-[#C0C0C0] rounded-full flex items-center justify-center text-[#000] font-bold border-4 border-[#2A1B0E]">2</div>
                        <div className="w-16 h-16 rounded-full bg-[#C0C0C0]/20 mb-2" />
                        <p className="text-[#F4E4BC] font-bold">الفارس الشجاع</p>
                        <p className="text-[#C0C0C0] text-sm">4500 XP</p>
                    </div>

                    {/* 1st Place */}
                    <div className="w-full md:w-48 bg-[#2A1B0E] border-2 border-[#FFD700] h-64 rounded-t-2xl flex flex-col items-center justify-end p-4 relative shadow-[0_0_30px_rgba(255,215,0,0.2)] z-10">
                        <Crown className="absolute -top-8 w-12 h-12 text-[#FFD700] animate-bounce" />
                        <div className="w-20 h-20 rounded-full bg-[#FFD700]/20 mb-4 border-2 border-[#FFD700]" />
                        <p className="text-[#FFD700] font-bold text-lg">بطل الأبطال</p>
                        <p className="text-[#F4E4BC] text-sm">5200 XP</p>
                    </div>

                    {/* 3rd Place */}
                    <div className="w-full md:w-48 bg-[#2A1B0E]/80 border border-[#CD7F32] h-40 rounded-t-2xl flex flex-col items-center justify-end p-4 relative">
                        <div className="absolute -top-6 w-12 h-12 bg-[#CD7F32] rounded-full flex items-center justify-center text-[#000] font-bold border-4 border-[#2A1B0E]">3</div>
                        <div className="w-16 h-16 rounded-full bg-[#CD7F32]/20 mb-2" />
                        <p className="text-[#F4E4BC] font-bold">الحكيم الصغير</p>
                        <p className="text-[#CD7F32] text-sm">4100 XP</p>
                    </div>
                </div>
            </div>

          </div>
        </main>
      </PageTransition>
    </>
  );
}
