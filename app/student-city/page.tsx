"use client";

import { useUser, Notification } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import GameCard from "@/components/GameCard";
import GoldButton from "@/components/GoldButton";
import SidebarWorld from "@/components/SidebarWorld";
import WeekMap from "@/components/WeekMap";
import JourneyHour from "@/components/JourneyHour";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Coins, Gift, ScrollText, X, Sparkles, Award, BrainCircuit, ShoppingBag, Crown, Megaphone, Calendar, Swords } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import MobileNav from "@/components/MobileNav";
import ProfileModal from "@/components/ProfileModal";
import NotificationCenter from "@/components/NotificationCenter";
import AtherMind from "@/components/AtherMind";

function StudentCityPageInner() {
  const { name, coins, spendCoins, addCoins, addXP, badges, broadcasts, notifications, markNotificationAsRead } = useUser();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Notification | null>(null);

  const activeView = searchParams?.get('view') || 'dashboard';

  const handleKnowledgeMaps = () => {
    router.push("/knowledge-maps");
  };

  const handleStartJourney = () => {
    showToast("جاري إعداد رحلتك... استعد للمغامرة!", "info");
    setTimeout(() => {
      router.push("/quests");
    }, 1500);
  };

  const handleBroadcastClick = (notification: Notification) => {
    setSelectedBroadcast(notification);
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  const renderContent = () => {
      if (activeView === 'planning') {
          return (
              <div className="space-y-8">
                  <header className="flex flex-col items-center mb-4 relative z-10">
                    <div className="absolute inset-0 bg-[#DAA520]/5 blur-3xl rounded-full transform -translate-y-1/2 pointer-events-none" />
                    <h1 className="text-4xl text-[#FFD700] font-[family-name:var(--font-amiri)] drop-shadow-lg mb-2 flex items-center gap-4">
                        <Calendar className="w-10 h-10" />
                        نظام التخطيط والزمن
                    </h1>
                    <p className="text-[#F4E4BC]/60 mt-2 text-lg">خريطتك للنجاح في الرحلة التعليمية</p>
                  </header>

                  <JourneyHour />
                  <WeekMap />
              </div>
          );
      }

      if (activeView === 'messages') {
          // Filter notifications that are broadcasts (Royal Decrees)
          const decrees = notifications.filter(n => n.title.includes('مرسوم') || n.title.includes('تعميم'));
          
          return (
              <div className="space-y-6">
                  <header className="flex flex-col items-center mb-8 relative z-10">
                    <div className="absolute inset-0 bg-[#DAA520]/5 blur-3xl rounded-full transform -translate-y-1/2 pointer-events-none" />
                    <h1 className="text-4xl text-[#FFD700] font-[family-name:var(--font-amiri)] drop-shadow-lg mb-2 flex items-center gap-4">
                        <Crown className="w-10 h-10" />
                        رسائل الحكام
                    </h1>
                    <p className="text-[#F4E4BC]/60 mt-2 text-lg">المراسيم والتعاميم الصادرة من قيادة المملكة</p>
                  </header>

                  <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
                      {decrees.length === 0 ? (
                          <div className="text-center py-20 bg-[#2A1B0E]/60 rounded-xl border border-[#5D4037]">
                              <Megaphone className="w-16 h-16 mx-auto text-[#F4E4BC]/20 mb-4" />
                              <p className="text-[#F4E4BC]/50 text-xl">لا توجد مراسيم ملكية جديدة حالياً</p>
                          </div>
                      ) : (
                          decrees.map((decree, idx) => (
                              <motion.div
                                key={decree.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => handleBroadcastClick(decree)}
                                className={cn(
                                    "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden flex gap-4 items-start",
                                    !decree.read 
                                        ? "bg-[#DAA520]/10 border-[#FFD700] shadow-[0_0_15px_rgba(218,165,32,0.1)]" 
                                        : "bg-[#2A1B0E]/60 border-[#5D4037] hover:border-[#DAA520]/50"
                                )}
                              >
                                  <div className="p-3 bg-[#DAA520]/20 rounded-full shrink-0">
                                      <ScrollText className="w-8 h-8 text-[#FFD700]" />
                                  </div>
                                  <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                          <h3 className={cn(
                                              "text-xl font-[family-name:var(--font-amiri)] mb-2",
                                              !decree.read ? "text-[#FFD700] font-bold" : "text-[#F4E4BC]"
                                          )}>
                                              {decree.title}
                                          </h3>
                                          <span className="text-[#F4E4BC]/40 text-xs bg-[#000]/30 px-2 py-1 rounded">{decree.date}</span>
                                      </div>
                                      <p className="text-[#F4E4BC]/70 leading-relaxed line-clamp-2">{decree.message}</p>
                                  </div>
                                  {!decree.read && (
                                      <div className="absolute top-4 left-4 w-3 h-3 bg-[#FF6B6B] rounded-full animate-pulse" />
                                  )}
                              </motion.div>
                          ))
                      )}
                  </div>
              </div>
          );
      }

      // Default Dashboard
      return (
          <div className="flex flex-col gap-8">
             {/* AI Suggestion Banner */}
             <div className="bg-gradient-to-l from-[#112240] to-[#2A1B0E] p-4 rounded-xl border border-[#4ECDC4]/30 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-[#4ECDC4]/20 p-3 rounded-full">
                    <BrainCircuit className="w-8 h-8 text-[#4ECDC4]" />
                  </div>
                  <div>
                    <h3 className="text-[#4ECDC4] font-bold font-[family-name:var(--font-cairo)]">اقتراح عقل أثير</h3>
                    <p className="text-[#F4E4BC] text-sm">لديك مهمة "المستكشف الخفي" تناسب مستواك الحالي، جربها الآن لرفع نقاطك!</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/knowledge-maps')}
                  className="bg-[#4ECDC4] hover:bg-[#3dbdb4] text-[#0a192f] px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  اذهب للمهمة
                </button>
             </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Ather Arena */}
              <GameCard 
                onClick={() => router.push('/ather-arena')}
                className="bg-[#2A1B0E]/90 h-64 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden border-[#DAA520] border-2"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-24 h-24 mb-4 rounded-full bg-[#DAA520]/20 flex items-center justify-center group-hover:bg-[#DAA520]/30 transition-colors relative z-10">
                  <Swords className="w-12 h-12 text-[#FFD700] animate-pulse" />
                </div>
                <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)] mb-2 relative z-10">ساحة أثير</h2>
                <p className="text-[#F4E4BC] font-[family-name:var(--font-cairo)] relative z-10">شارك في المنافسات الآن!</p>
              </GameCard>

              {/* Card 2: Gold/Rewards */}
              <GameCard 
                onClick={() => router.push('/treasures')}
                className="bg-[#2A1B0E]/90 h-64 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className="w-24 h-24 mb-4 rounded-full bg-[#FFD700]/20 flex items-center justify-center group-hover:bg-[#FFD700]/30 transition-colors">
                  <ShoppingBag className="w-12 h-12 text-[#FFD700]" />
                </div>
                <h2 className="text-2xl text-[#F4E4BC] font-[family-name:var(--font-amiri)] mb-2">السوق</h2>
                <p className="text-[#B8860B] font-[family-name:var(--font-cairo)]">أنفق الذهب هنا</p>
              </GameCard>

              {/* Card 2: Educational Cards */}
              <GameCard 
                onClick={handleKnowledgeMaps}
                className="bg-[#2A1B0E]/90 h-64 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div className="w-24 h-24 mb-4 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center group-hover:bg-[#4ECDC4]/30 transition-colors">
                  <ScrollText className="w-12 h-12 text-[#4ECDC4]" />
                </div>
                <h2 className="text-2xl text-[#F4E4BC] font-[family-name:var(--font-amiri)] mb-2">خرائط المعرفة</h2>
                <p className="text-[#4ECDC4] font-[family-name:var(--font-cairo)]">رحلة التعلم تبدأ هنا</p>
              </GameCard>

              {/* Card 3: Chests/Items */}
              <GameCard 
                onClick={() => router.push('/treasures')}
                className="bg-[#2A1B0E]/90 h-64 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B6B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-24 h-24 mb-4 rounded-full bg-[#FF6B6B]/20 flex items-center justify-center group-hover:bg-[#FF6B6B]/30 transition-colors relative z-10">
                  <Gift className="w-12 h-12 text-[#FF6B6B] animate-bounce" />
                </div>
                <h2 className="text-2xl text-[#F4E4BC] font-[family-name:var(--font-amiri)] mb-2 relative z-10">الكنوز والمكافآت</h2>
                <p className="text-[#FF6B6B] font-[family-name:var(--font-cairo)] relative z-10">افتح الصناديق السحرية</p>
              </GameCard>
            </div>

            {/* Badges Shelf */}
            <GameCard title="خزنة الكنوز والشارات" className="bg-[#2A1B0E]/90">
               <div className="flex gap-4 overflow-x-auto p-2 min-h-[120px] items-center">
                 {badges.length > 0 ? (
                   badges.map((badge) => (
                     <div key={badge.id} className="flex flex-col items-center gap-2 min-w-[100px] group relative cursor-help">
                       <div className="w-16 h-16 bg-[#000]/30 rounded-full border-2 border-[#FFD700] flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(255,215,0,0.2)] group-hover:scale-110 transition-transform">
                         {badge.icon}
                       </div>
                       <span className="text-[#F4E4BC] text-sm text-center font-[family-name:var(--font-cairo)]">{badge.name}</span>
                       
                       {/* Tooltip */}
                       <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-[#F4E4BC] text-xs p-2 rounded w-32 text-center pointer-events-none z-20 border border-[#DAA520]">
                         {badge.description}
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="w-full text-center text-[#F4E4BC]/50 font-[family-name:var(--font-cairo)]">
                     لا توجد أوسمة بعد... أكمل المهام لتحصل عليها!
                   </div>
                 )}
                 {/* Empty Slots for effect */}
                 {Array.from({ length: Math.max(0, 5 - badges.length) }).map((_, i) => (
                   <div key={`empty-${i}`} className="w-16 h-16 rounded-full border-2 border-[#5D4037] border-dashed flex items-center justify-center opacity-30">
                     <Award className="w-6 h-6 text-[#5D4037]" />
                   </div>
                 ))}
               </div>
            </GameCard>

            {/* Footer Action */}
            <div className="flex justify-center mt-8 pb-8">
                <GoldButton 
                className="px-16 py-4 text-2xl shadow-[0_0_30px_rgba(218,165,32,0.4)]"
                onClick={handleStartJourney}
                >
                ابدأ رحلات اليوم
                </GoldButton>
            </div>
          </div>
      );
  };

  return (
    <>
      <MobileNav />
      <PageTransition>
      <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2576&auto=format&fit=crop')] bg-cover bg-center overflow-hidden flex">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

        {/* Sidebar (Right side in RTL) */}
        <div className="relative z-10 hidden md:block h-screen">
          <SidebarWorld />
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 p-8 flex flex-col overflow-y-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-8 bg-[#2A1B0E]/80 p-4 rounded-xl border-2 border-[#8B4513] backdrop-blur-sm">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setShowProfileModal(true)}>
              <div className="w-16 h-16 rounded-full border-2 border-[#DAA520] bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')] bg-cover bg-center bg-white hover:scale-105 transition-transform" />
              <div>
                <h1 className="text-3xl text-[#FFD700] font-[family-name:var(--font-amiri)]">
                  مدينة المغامرين
                </h1>
                <p className="text-[#F4E4BC] font-[family-name:var(--font-scheherazade)] text-lg hover:text-[#DAA520] transition-colors">
                  مرحباً بك يا {name} في عالمك
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <NotificationCenter />
              <div className="flex items-center gap-2 bg-[#000]/50 px-4 py-2 rounded-full border border-[#DAA520]">
                <Coins className="text-[#FFD700] w-6 h-6" />
                <span className="text-[#FFD700] font-bold text-xl">{coins.toLocaleString('en-US')}</span>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
             <motion.div
                key={activeView}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
             >
                {renderContent()}
             </motion.div>
          </AnimatePresence>
        </div>

      </main>
      </PageTransition>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* Broadcast Details Modal */}
      <AnimatePresence>
         {selectedBroadcast && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                 onClick={() => setSelectedBroadcast(null)}
              />
              
              <motion.div
                 initial={{ scale: 0.9, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 className="relative z-50 bg-[#F4E4BC] text-[#2A1B0E] p-8 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden"
              >
                 {/* Paper Texture Overlay */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-50 pointer-events-none" />
                 
                 <div className="relative z-10">
                    <div className="text-center mb-6 border-b-2 border-[#2A1B0E]/20 pb-4">
                        <Crown className="w-12 h-12 mx-auto text-[#DAA520] mb-2" />
                        <h2 className="text-2xl font-[family-name:var(--font-amiri)] font-bold text-[#2A1B0E]">
                            {selectedBroadcast.title}
                        </h2>
                        <p className="text-[#2A1B0E]/60 text-sm mt-1">{selectedBroadcast.date}</p>
                    </div>

                    <div className="min-h-[100px] mb-6">
                        <p className="text-[#2A1B0E] text-lg leading-relaxed whitespace-pre-wrap font-[family-name:var(--font-cairo)]">
                            {selectedBroadcast.message}
                        </p>
                    </div>

                    <div className="flex justify-center pt-4 border-t border-[#2A1B0E]/10">
                        <button 
                            onClick={() => setSelectedBroadcast(null)}
                            className="bg-[#2A1B0E] text-[#F4E4BC] px-8 py-2 rounded-full font-bold hover:bg-[#2A1B0E]/90 transition-transform hover:scale-105 shadow-lg"
                        >
                            إغلاق المرسوم
                        </button>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
      <AtherMind />
    </>
  );
}

export default function StudentCityPage() {
  return (
    <Suspense fallback={null}>
      <StudentCityPageInner />
    </Suspense>
  );
}
