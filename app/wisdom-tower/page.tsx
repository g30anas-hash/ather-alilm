"use client";

import { useState, useEffect } from "react";
import GameCard from "@/components/GameCard";
import SidebarWorld from "@/components/SidebarWorld";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, BookOpen, Clock, Trophy, Map, Star, Scale, Scroll, ShieldAlert } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import MobileNav from "@/components/MobileNav";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import NotificationCenter from "@/components/NotificationCenter";
import GoldButton from "@/components/GoldButton";

export default function WisdomTowerPage() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'journeys' | 'leaderboard' | 'behavior'>('achievements');
  const { xp, level, coins, name, behaviorRecords } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate progress to next level (simplified logic)
  const xpForNextLevel = level * 1000;
  const progressPercent = Math.min((xp / xpForNextLevel) * 100, 100);

  const leaderboardData = [
    { rank: 1, name: "عمر خالد", xp: 15400, level: 15, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar" },
    { rank: 2, name: "سارة أحمد", xp: 14200, level: 14, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { rank: 3, name: "يوسف علي", xp: 13800, level: 13, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yousef" },
    { rank: 4, name: "نورة محمد", xp: 12500, level: 12, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nora" },
    { rank: 5, name: "أحمد سالم", xp: 11000, level: 11, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" },
    // Current user rank (mocked)
    { rank: 12, name: name || "أنت", xp: xp || 0, level: level || 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", isCurrentUser: true }
  ];

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <>
      <MobileNav />
      <PageTransition>
        <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2690&auto=format&fit=crop')] bg-cover bg-center overflow-hidden flex">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

          {/* Sidebar */}
          <div className="relative z-10 hidden md:block h-screen sticky top-0">
            <SidebarWorld />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 h-screen overflow-y-auto p-8 custom-scrollbar">
            <div className="w-full max-w-6xl mx-auto flex flex-col min-h-full">
            
              {/* Header */}
              <header className="text-center mb-10 relative">
                 <div className="absolute top-0 right-0 hidden lg:block">
                   <NotificationCenter />
                 </div>
                <h1 className="text-5xl text-[#FFD700] font-[family-name:var(--font-amiri)] drop-shadow-lg mb-2">
                  برج الحكمة
                </h1>
                <p className="text-xl text-[#F4E4BC] font-[family-name:var(--font-scheherazade)]">
                  حيث تُقاس العقول وتُصنع الأمجاد
                </p>
              </header>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                
                {/* Left Column: Charts Area (Takes 2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Level Progress Card */}
                  <GameCard className="bg-[#2A1B0E]/90 border-[#4ECDC4]/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center border-2 border-[#4ECDC4]">
                           <span className="text-[#4ECDC4] font-bold text-xl">{level}</span>
                         </div>
                         <div>
                           <h3 className="text-[#F4E4BC] font-bold font-[family-name:var(--font-cairo)]">المستوى الحالي</h3>
                           <p className="text-sm text-[#F4E4BC]/60">مغامر متمرس</p>
                         </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[#4ECDC4] font-bold">{xp}</span>
                        <span className="text-[#F4E4BC]/60 text-sm"> / {xpForNextLevel} XP</span>
                      </div>
                    </div>
                    
                    <div className="h-4 bg-[#000]/40 rounded-full overflow-hidden border border-[#5D4037]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#2ECC71] relative"
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </motion.div>
                    </div>
                  </GameCard>

                  <GameCard className="bg-[#2A1B0E]/90 min-h-[300px]">
                    {/* Tabs */}
                    <div className="flex gap-4 border-b border-[#5D4037] pb-4 mb-6">
                      <button 
                        onClick={() => setActiveTab('achievements')}
                        className={cn(
                          "font-bold font-[family-name:var(--font-cairo)] pb-1 transition-colors",
                          activeTab === 'achievements' 
                            ? "text-[#FFD700] border-b-2 border-[#FFD700]" 
                            : "text-[#F4E4BC]/60 hover:text-[#F4E4BC]"
                        )}
                      >
                        الإنجازات
                      </button>
                      <button 
                        onClick={() => setActiveTab('journeys')}
                        className={cn(
                          "font-bold font-[family-name:var(--font-cairo)] pb-1 transition-colors",
                          activeTab === 'journeys' 
                            ? "text-[#FFD700] border-b-2 border-[#FFD700]" 
                            : "text-[#F4E4BC]/60 hover:text-[#F4E4BC]"
                        )}
                      >
                        الرحلات
                      </button>
                      <button 
                        onClick={() => setActiveTab('leaderboard')}
                        className={cn(
                          "font-bold font-[family-name:var(--font-cairo)] pb-1 transition-colors",
                          activeTab === 'leaderboard' 
                            ? "text-[#FFD700] border-b-2 border-[#FFD700]" 
                            : "text-[#F4E4BC]/60 hover:text-[#F4E4BC]"
                        )}
                      >
                        لوحة الشرف
                      </button>
                      <button 
                        onClick={() => setActiveTab('behavior')}
                        className={cn(
                          "font-bold font-[family-name:var(--font-cairo)] pb-1 transition-colors",
                          activeTab === 'behavior' 
                            ? "text-[#FFD700] border-b-2 border-[#FFD700]" 
                            : "text-[#F4E4BC]/60 hover:text-[#F4E4BC]"
                        )}
                      >
                        سجل السلوك
                      </button>
                    </div>

                    {/* Content Area */}
                    <AnimatePresence mode="wait">
                      {activeTab === 'achievements' ? (
                        <motion.div
                          key="achievements"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Chart Visualization */}
                          <div className="flex items-end justify-between h-64 px-4 gap-4">
                            {[40, 65, 30, 85, 55, 90, 75].map((height, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full relative h-full flex items-end">
                                  <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="w-full bg-gradient-to-t from-[#8B4513] to-[#DAA520] rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity relative"
                                  >
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity">
                                      {height}%
                                    </span>
                                  </motion.div>
                                </div>
                                <span className="text-xs text-[#F4E4BC]/70 font-[family-name:var(--font-cairo)]">
                                  {["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"][i]}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6 text-center text-[#F4E4BC]/50 text-sm">
                            مستوى الأداء الأسبوعي
                          </div>
                        </motion.div>
                      ) : activeTab === 'journeys' ? (
                        <motion.div
                          key="journeys"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="h-64 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2"
                        >
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-[#000]/20 p-4 rounded-lg flex items-center gap-4 border border-[#5D4037]">
                              <div className="p-3 bg-[#DAA520]/20 rounded-full">
                                <Map className="text-[#DAA520] w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-[#F4E4BC] font-bold font-[family-name:var(--font-cairo)]">رحلة الأندلس المفقودة</h4>
                                <p className="text-sm text-[#F4E4BC]/60">تم إكمال المرحلة {item} بنجاح</p>
                              </div>
                              <span className="text-[#4ECDC4] font-bold">100%</span>
                            </div>
                          ))}
                        </motion.div>
                      ) : activeTab === 'leaderboard' ? (
                        <motion.div
                          key="leaderboard"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="h-64 overflow-y-auto custom-scrollbar pr-2"
                        >
                          <div className="space-y-3">
                            {leaderboardData.map((user, idx) => (
                              <div 
                                key={idx} 
                                className={cn(
                                  "flex items-center gap-4 p-3 rounded-lg border",
                                  user.isCurrentUser 
                                    ? "bg-[#DAA520]/20 border-[#FFD700]" 
                                    : "bg-[#000]/20 border-[#5D4037]",
                                  idx < 3 ? "border-[#FFD700]/50" : ""
                                )}
                              >
                                <div className={cn(
                                  "w-8 h-8 flex items-center justify-center rounded-full font-bold font-[family-name:var(--font-cairo)]",
                                  idx === 0 ? "bg-[#FFD700] text-[#2A1B0E]" :
                                  idx === 1 ? "bg-[#C0C0C0] text-[#2A1B0E]" :
                                  idx === 2 ? "bg-[#CD7F32] text-[#2A1B0E]" :
                                  "bg-[#000]/40 text-[#F4E4BC]"
                                )}>
                                  {user.rank}
                                </div>
                                
                                <div className="w-10 h-10 rounded-full border border-[#DAA520]/50 bg-white bg-cover bg-center" style={{ backgroundImage: `url('${user.avatar}')` }} />
                                
                                <div className="flex-1">
                                  <h4 className={cn(
                                    "font-bold font-[family-name:var(--font-cairo)]",
                                    user.isCurrentUser ? "text-[#FFD700]" : "text-[#F4E4BC]"
                                  )}>
                                    {user.name} {user.isCurrentUser && "(أنت)"}
                                  </h4>
                                  <p className="text-xs text-[#F4E4BC]/60">المستوى {user.level}</p>
                                </div>
                                
                                <div className="text-right">
                                  <span className="text-[#4ECDC4] font-bold font-[family-name:var(--font-cairo)]">{user.xp.toLocaleString()}</span>
                                  <span className="text-[#F4E4BC]/60 text-xs block">XP</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ) : activeTab === 'behavior' ? (
                        <motion.div
                          key="behavior"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="h-64 overflow-y-auto custom-scrollbar pr-2"
                        >
                           {/* Filter for current user's behavior records (assuming mocked user name matches) */}
                           {(() => {
                               const myRecords = behaviorRecords.filter(r => r.studentName === name && r.status === 'approved');
                               return (
                                   <div className="space-y-4">
                                       <div className="grid grid-cols-2 gap-4 mb-4">
                                           <div className="bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 rounded-lg p-3 text-center">
                                               <h4 className="text-[#4ECDC4] font-bold text-lg">{myRecords.filter(r => r.type === 'positive').length}</h4>
                                               <span className="text-[#F4E4BC]/60 text-xs">لفائف الشرف</span>
                                           </div>
                                           <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-lg p-3 text-center">
                                               <h4 className="text-[#FF6B6B] font-bold text-lg">{myRecords.filter(r => r.type === 'negative').length}</h4>
                                               <span className="text-[#F4E4BC]/60 text-xs">تنبيهات الحكمة</span>
                                           </div>
                                       </div>

                                       <div className="space-y-3">
                                           {myRecords.length === 0 ? (
                                               <div className="text-center py-8 text-[#F4E4BC]/40">
                                                   <Scale className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                                   <p>سجلك نظيف كصفحة بيضاء، ابدأ بصنع مجدك!</p>
                                               </div>
                                           ) : (
                                               myRecords.map(record => (
                                                   <div key={record.id} className="bg-[#000]/20 p-3 rounded-lg border border-[#5D4037] flex items-center gap-3">
                                                       <div className={cn(
                                                           "p-2 rounded-full",
                                                           record.type === 'positive' ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" : "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                                                       )}>
                                                           {record.type === 'positive' ? <Scroll className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                                       </div>
                                                       <div className="flex-1">
                                                           <h4 className={cn("font-bold text-sm", record.type === 'positive' ? "text-[#4ECDC4]" : "text-[#FF6B6B]")}>
                                                               {record.category}
                                                           </h4>
                                                           <p className="text-[#F4E4BC]/60 text-xs">{record.date}</p>
                                                       </div>
                                                       <div className="text-right">
                                                            <span className={cn("font-bold text-sm", record.type === 'positive' ? "text-[#FFD700]" : "text-[#FF6B6B]")}>
                                                                {record.type === 'positive' ? "+" : "-"}{record.goldAmount} 🪙
                                                            </span>
                                                       </div>
                                                   </div>
                                               ))
                                           )}
                                       </div>
                                   </div>
                               );
                           })()}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </GameCard>
                </div>

                {/* Right Column: Daily Stats */}
                <div className="space-y-6">
                  <GameCard title="النظرة اليومية" className="bg-[#2A1B0E]/90 h-full">
                    <div className="space-y-6 mt-4">
                      
                      <div className="flex items-center gap-4 p-4 bg-[#000]/20 rounded-lg border border-[#5D4037]">
                        <div className="p-3 bg-[#DAA520]/20 rounded-full">
                          <Clock className="text-[#DAA520] w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-[#F4E4BC] font-[family-name:var(--font-cairo)] text-sm">ساعات التعلم</h3>
                          <p className="text-2xl font-bold text-[#FFD700]">4.5 <span className="text-sm font-normal text-[#F4E4BC]/60">ساعة</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-[#000]/20 rounded-lg border border-[#5D4037]">
                        <div className="p-3 bg-[#4ECDC4]/20 rounded-full">
                          <Trophy className="text-[#4ECDC4] w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-[#F4E4BC] font-[family-name:var(--font-cairo)] text-sm">النقاط المكتسبة (XP)</h3>
                          <p className="text-2xl font-bold text-[#4ECDC4]">{xp.toLocaleString()} <span className="text-sm font-normal text-[#F4E4BC]/60">نقطة</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-[#000]/20 rounded-lg border border-[#5D4037]">
                        <div className="p-3 bg-[#FF6B6B]/20 rounded-full">
                          <BookOpen className="text-[#FF6B6B] w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-[#F4E4BC] font-[family-name:var(--font-cairo)] text-sm">الدروس المنجزة</h3>
                          <p className="text-2xl font-bold text-[#FF6B6B]">3 <span className="text-sm font-normal text-[#F4E4BC]/60">دروس</span></p>
                        </div>
                      </div>

                       <div className="flex items-center gap-4 p-4 bg-[#000]/20 rounded-lg border border-[#5D4037]">
                        <div className="p-3 bg-[#FFD700]/20 rounded-full">
                          <Star className="text-[#FFD700] w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-[#F4E4BC] font-[family-name:var(--font-cairo)] text-sm">رصيد الذهب</h3>
                          <p className="text-2xl font-bold text-[#FFD700]">{coins.toLocaleString()} <span className="text-sm font-normal text-[#F4E4BC]/60">عملة</span></p>
                        </div>
                      </div>

                      <div className="pt-8 text-center">
                        <GoldButton className="text-lg w-full">
                          تقرير مفصل
                        </GoldButton>
                      </div>

                    </div>
                  </GameCard>
                </div>

              </div>
            </div>
          </div>
        </main>
      </PageTransition>
    </>
  );
}
