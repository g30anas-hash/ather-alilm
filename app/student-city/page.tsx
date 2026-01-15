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
import { Coins, Gift, ScrollText, X, Sparkles, Award, BrainCircuit, ShoppingBag, Crown, Megaphone, Calendar, Swords, Landmark, Map as MapIcon, Shield, Mail, LogOut, Gem, GraduationCap, Home, MessageCircle, Send, MessageSquare, BookOpen, Moon, Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import MobileNav from "@/components/MobileNav";
import ProfileModal from "@/components/ProfileModal";
import NotificationCenter from "@/components/NotificationCenter";
import AtherMind from "@/components/AtherMind";
import FantasyModal from "@/components/FantasyModal";

import SchoolPulse from "@/components/SchoolPulse";

function StudentCityPageInner() {
  const { name, coins, spendCoins, addCoins, addXP, badges, broadcasts, notifications, markNotificationAsRead, addSupportMessage, allUsers, classes, logout, lessons } = useUser();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Notification | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  // Night Challenge State
  const [showNightChallenge, setShowNightChallenge] = useState(false);
  const [currentChallengeQuestion, setCurrentChallengeQuestion] = useState(0);
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, string>>({});
  const [challengeScore, setChallengeScore] = useState<number | null>(null);

  const [contactForm, setContactForm] = useState({
      teacherId: "",
      message: ""
  });

  const pathname = usePathname();
  const currentView = searchParams?.get('view');

  const navItems = [
    { icon: <Landmark className="w-5 h-5" />, label: "بوابة المدينة", href: "/student-city", isActive: pathname === "/student-city" && !currentView },
    { icon: <BookOpen className="w-5 h-5" />, label: "سجل الحصص", href: "/student-city?view=lessons", isActive: pathname === "/student-city" && currentView === 'lessons' },
    { icon: <ScrollText className="w-5 h-5" />, label: "خرائط المعرفة", href: "/knowledge-maps", isActive: pathname === "/knowledge-maps" },
    { icon: <MapIcon className="w-5 h-5" />, label: "خريطة الأسبوع", href: "/student-city?view=planning", isActive: pathname === "/student-city" && currentView === 'planning' },
    { icon: <Swords className="w-5 h-5" />, label: "تحديات الرحلة", href: "/teacher-hall", isActive: pathname === "/teacher-hall" },
    { icon: <Gem className="w-5 h-5" />, label: "الكنوز والمكافآت", href: "/treasures", isActive: pathname === "/treasures" },
    { icon: <Shield className="w-5 h-5" />, label: "برج الحكمة", href: "/wisdom-tower", isActive: pathname === "/wisdom-tower" },
    { icon: <Mail className="w-5 h-5" />, label: "رسائل الحكام", href: "/student-city?view=messages", isActive: pathname === "/student-city" && currentView === 'messages' },
  ];

  const handleLogout = () => {
      logout();
      router.push('/');
  };

  const activeView = currentView || 'dashboard';

  const student = allUsers.find(u => u.name === name && u.role === 'student');
  const myClassId = student?.classId;
  const myTeachers = allUsers.filter(u => u.role === 'teacher' && u.assignedClasses?.includes(myClassId || ''));

  const myLessons = lessons.filter(l => l.classId === myClassId);
  myLessons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const todayStr = new Date().toDateString();
  const todaysLessons = myLessons.filter(l => new Date(l.createdAt).toDateString() === todayStr);
  const nightQuestions = todaysLessons.flatMap(l => l.questions || []);

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!contactForm.teacherId || !contactForm.message.trim()) {
          showToast("الرجاء اختيار المعلم وكتابة الرسالة", "error");
          return;
      }

      const teacher = myTeachers.find(t => t.id.toString() === contactForm.teacherId);
      if (!teacher) return;

      addSupportMessage({
          senderName: name,
          mobile: "",
          email: "",
          type: "student_msg",
          message: contactForm.message,
          senderId: student?.id,
          targetId: teacher.id
      });

      showToast(`تم إرسال الرسالة للمعلم ${teacher.name} بنجاح`, "success");
      setShowContactModal(false);
      setContactForm({ teacherId: "", message: "" });
  };

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
      if (activeView === 'lessons') {
          return (
              <div className="space-y-8">
                  <header className="flex flex-col items-center mb-4 relative z-10">
                    <div className="absolute inset-0 bg-[#DAA520]/5 blur-3xl rounded-full transform -translate-y-1/2 pointer-events-none" />
                    <h1 className="text-4xl text-[#FFD700] font-[family-name:var(--font-amiri)] drop-shadow-lg mb-2 flex items-center gap-4">
                        <BookOpen className="w-10 h-10" />
                        سجل الحصص
                    </h1>
                    <p className="text-[#F4E4BC]/60 mt-2 text-lg">رحلتك التعليمية يوماً بيوم</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                      {myLessons.length === 0 ? (
                          <div className="col-span-full text-center py-20 bg-[#2A1B0E]/60 rounded-xl border border-[#5D4037]">
                              <BookOpen className="w-16 h-16 mx-auto text-[#F4E4BC]/20 mb-4" />
                              <p className="text-[#F4E4BC]/50 text-xl">لا توجد حصص مسجلة بعد</p>
                          </div>
                      ) : (
                          myLessons.map((lesson) => (
                              <div key={lesson.id} className="bg-[#2A1B0E]/60 rounded-xl border border-[#5D4037] overflow-hidden hover:border-[#DAA520] transition-all flex flex-col group">
                                  <div className="h-40 bg-[#000]/50 relative">
                                      {lesson.imageUrl ? (
                                          <img src={lesson.imageUrl} alt={lesson.subject} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                                      ) : (
                                          <div className="absolute inset-0 flex items-center justify-center bg-[#DAA520]/10">
                                              <BookOpen className="w-16 h-16 text-[#DAA520]/30" />
                                          </div>
                                      )}
                                      <div className="absolute top-3 right-3 bg-[#000]/60 backdrop-blur-sm px-3 py-1 rounded-full border border-[#DAA520]/30 text-xs text-[#FFD700]">
                                          {new Date(lesson.createdAt).toLocaleDateString('ar-SA')}
                                      </div>
                                  </div>
                                  <div className="p-6 flex-1 flex flex-col">
                                      <h3 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold mb-2">{lesson.subject}</h3>
                                      <div className="flex items-center gap-2 mb-4 text-[#F4E4BC]/60 text-xs">
                                          <span className="flex items-center gap-1"><Crown className="w-3 h-3 text-[#DAA520]" /> {lesson.teacherName}</span>
                                      </div>
                                      <p className="text-[#F4E4BC]/80 leading-relaxed mb-4 flex-1">{lesson.summary}</p>
                                      
                                      {lesson.questions && lesson.questions.length > 0 && (
                                          <div className="mt-auto pt-4 border-t border-[#5D4037]/50">
                                              <div className="flex items-center gap-2 text-[#4ECDC4] text-sm">
                                                  <Brain className="w-4 h-4" />
                                                  <span>تحدي الحصة: {lesson.questions.length} أسئلة</span>
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          );
      }

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
                    
                    <GoldButton className="mt-6 text-sm" onClick={() => setShowContactModal(true)}>
                        <MessageCircle className="w-4 h-4 ml-2 inline" />
                        مراسلة معلم
                    </GoldButton>
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
             <SchoolPulse />
             {/* Night Challenge Banner */}
             {nightQuestions.length > 0 && (
                 <div className="bg-gradient-to-r from-[#1E120A] to-[#2A1B0E] p-1 rounded-2xl border border-[#DAA520]/50 shadow-[0_0_30px_rgba(218,165,32,0.2)] relative overflow-hidden group cursor-pointer" onClick={() => setShowNightChallenge(true)}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse" />
                    <div className="bg-[#000]/40 backdrop-blur-sm p-6 rounded-xl flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-[#1E120A] rounded-full border-2 border-[#DAA520] flex items-center justify-center shadow-[0_0_20px_rgba(218,165,32,0.3)] group-hover:scale-110 transition-transform duration-500">
                                <Moon className="w-10 h-10 text-[#FFD700] drop-shadow-md" />
                            </div>
                            <div>
                                <h2 className="text-3xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold mb-1 flex items-center gap-2">
                                    تحدي نهاية اليوم
                                    <span className="text-sm bg-[#FFD700] text-[#1E120A] px-2 py-0.5 rounded-full font-bold animate-pulse">جديد</span>
                                </h2>
                                <p className="text-[#F4E4BC]/80 text-lg">لديك {nightQuestions.length} أسئلة من حصص اليوم. أجب عليها لتربح الذهب!</p>
                            </div>
                        </div>
                        <GoldButton className="px-8 py-3 text-lg animate-bounce">
                            ابدأ التحدي
                        </GoldButton>
                    </div>
                 </div>
             )}

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
              {/* Card 1: Treasures */}
              <GameCard 
                onClick={() => router.push('/treasures')}
                className="bg-[#2A1B0E]/90 h-64 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden border-[#DAA520]"
              >
                <div className="w-24 h-24 mb-4 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center group-hover:bg-[#FF6B6B]/20 transition-colors relative z-10">
                  <Gift className="w-10 h-10 text-[#FF6B6B]" />
                </div>
                <h2 className="text-xl text-[#F4E4BC] font-[family-name:var(--font-cairo)] font-bold mb-1 relative z-10">الكنوز والمكافآت</h2>
                <p className="text-[#FF6B6B] text-sm font-[family-name:var(--font-cairo)] relative z-10">افتح الصناديق السحرية</p>
              </GameCard>

              {/* Card 2: Knowledge Maps */}
              <GameCard 
                onClick={handleKnowledgeMaps}
                className="bg-[#2A1B0E]/90 h-64 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300 cursor-pointer border-[#DAA520]"
              >
                <div className="w-24 h-24 mb-4 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center group-hover:bg-[#4ECDC4]/20 transition-colors">
                  <ScrollText className="w-10 h-10 text-[#4ECDC4]" />
                </div>
                <h2 className="text-xl text-[#F4E4BC] font-[family-name:var(--font-cairo)] font-bold mb-1">خرائط المعرفة</h2>
                <p className="text-[#4ECDC4] text-sm font-[family-name:var(--font-cairo)]">رحلة التعلم تبدأ هنا</p>
              </GameCard>

              {/* Card 3: Market */}
              <GameCard 
                onClick={() => router.push('/treasures')}
                className="bg-[#2A1B0E]/90 h-64 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300 cursor-pointer border-[#DAA520]"
              >
                <div className="w-24 h-24 mb-4 rounded-full bg-[#FFD700]/10 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
                  <ShoppingBag className="w-10 h-10 text-[#FFD700]" />
                </div>
                <h2 className="text-xl text-[#F4E4BC] font-[family-name:var(--font-cairo)] font-bold mb-1">السوق</h2>
                <p className="text-[#FFD700] text-sm font-[family-name:var(--font-cairo)]">أنفق الذهب هنا</p>
              </GameCard>

              {/* Card 4: Arena */}
              <GameCard 
                onClick={() => router.push('/ather-arena')}
                className="bg-[#2A1B0E]/90 h-64 flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden border-[#DAA520]"
              >
                <div className="w-24 h-24 mb-4 rounded-full bg-[#FFD700]/10 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors relative z-10">
                  <Swords className="w-10 h-10 text-[#FFD700]" />
                </div>
                <h2 className="text-xl text-[#FFD700] font-[family-name:var(--font-cairo)] font-bold mb-1 relative z-10">ساحة أثير</h2>
                <p className="text-[#F4E4BC] text-sm font-[family-name:var(--font-cairo)] relative z-10">شارك في المنافسات الآن!</p>
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
      <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2568&auto=format&fit=crop')] bg-cover bg-center overflow-hidden flex font-[family-name:var(--font-cairo)]">
        {/* Enhanced Atmospheric Overlays */}
        <div className="absolute inset-0 bg-[#0a0502]/60 mix-blend-multiply z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E120A] via-transparent to-[#1E120A]/50 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] opacity-40 z-0 pointer-events-none" />

        {/* Sidebar - Using Shared Component */}
        <div className="relative z-20 hidden lg:block h-screen sticky top-0">
             <SidebarWorld />
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 h-screen overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="w-full max-w-7xl mx-auto flex flex-col min-h-full gap-6">
            {/* Top Bar - Transparent & Floating */}
            <header className="flex flex-col md:flex-row justify-between items-center bg-[#1E120A]/40 backdrop-blur-md px-8 py-5 rounded-[2rem] border border-[#DAA520]/20 shadow-lg relative overflow-hidden group hover:bg-[#1E120A]/60 transition-colors">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#DAA520]/5 to-transparent opacity-50" />
                 
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-center w-full gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-gradient-to-br from-[#DAA520] to-[#B8860B] rounded-2xl shadow-lg text-[#1E120A] transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                            {navItems.find(i => i.isActive)?.icon || <Landmark className="w-6 h-6" />}
                        </div>
                        <div>
                          <h1 className="text-3xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold drop-shadow-sm">
                            {navItems.find(i => i.isActive)?.label || "مدينة المغامرين"}
                          </h1>
                          <p className="text-[#F4E4BC]/60 text-xs mt-1">مرحباً بك يا {name} في عالمك</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 items-center">
                      <NotificationCenter />
                      <div className="h-8 w-[1px] bg-[#DAA520]/20 mx-2 hidden md:block" />
                      <div className="flex items-center gap-2 bg-[#000]/40 px-4 py-2 rounded-xl border border-[#DAA520]/30 shadow-inner">
                        <Coins className="text-[#FFD700] w-5 h-5" />
                        <span className="text-[#FFD700] font-bold text-lg">{coins.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                 </div>
            </header>

            {/* Main Content Card - The "Scroll/Tablet" */}
            <div className="relative flex-1 bg-[#1E120A]/80 backdrop-blur-md rounded-[2.5rem] border border-[#DAA520]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden group">
                 {/* Magical Glow Effects */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-[#DAA520] blur-sm opacity-50" />
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-[#DAA520] blur-sm opacity-30" />
                 
                 {/* Corner Accents */}
                 <svg className="absolute top-4 left-4 w-12 h-12 text-[#DAA520]/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20,20 L50,20 M20,20 L20,50" />
                 </svg>
                 <svg className="absolute top-4 right-4 w-12 h-12 text-[#DAA520]/40 transform rotate-90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20,20 L50,20 M20,20 L20,50" />
                 </svg>
                 
                 <div className="relative z-10 p-6 md:p-10 flex-1 overflow-hidden flex flex-col custom-scrollbar overflow-y-auto">
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 10, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.99 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="w-full"
                        >
                            {renderContent()}
                        </motion.div>
                     </AnimatePresence>
                 </div>
            </div>
          </div>
        </div>

      </main>
      </PageTransition>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* Contact Teacher Modal */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/90 backdrop-blur-md"
                 onClick={() => setShowContactModal(false)}
              />
              
              <motion.div
                 initial={{ scale: 0.95, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.95, opacity: 0, y: 20 }}
                 className="relative z-50 w-full max-w-lg max-h-[90vh] flex flex-col"
              >
                 {/* Fantasy Frame Structure */}
                 <div className="relative bg-[#1E120A] border-[3px] border-[#DAA520] rounded-lg shadow-[0_0_60px_rgba(218,165,32,0.2)] flex flex-col overflow-hidden max-h-full">
                    {/* Inner Decorative Border */}
                    <div className="absolute inset-1 border border-[#DAA520]/30 rounded-md pointer-events-none" />
                    
                    {/* Corner Ornaments */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#DAA520] rounded-tl-none z-20 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#DAA520] rounded-tr-none z-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#DAA520] rounded-bl-none z-20 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#DAA520] rounded-br-none z-20 pointer-events-none" />

                    {/* Background Texture */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-40 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#DAA520]/5 via-transparent to-[#DAA520]/5 pointer-events-none" />

                    {/* Content Container */}
                    <div className="relative z-10 p-6 md:p-8 overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center mb-6 border-b border-[#DAA520]/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#DAA520]/10 rounded-full border border-[#DAA520]">
                                    <ScrollText className="w-6 h-6 text-[#DAA520]" />
                                </div>
                                <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold">
                                    مراسلة معلم
                                </h2>
                            </div>
                            <button onClick={() => setShowContactModal(false)} className="text-[#F4E4BC]/50 hover:text-[#FF6B6B] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)] text-sm">إلى المعلم</label>
                                <select 
                                    required
                                    value={contactForm.teacherId}
                                    onChange={(e) => setContactForm({...contactForm, teacherId: e.target.value})}
                                    className="w-full bg-[#000]/30 border border-[#DAA520]/30 rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                >
                                    <option value="">اختر المعلم...</option>
                                    {myTeachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.subject || 'معلم'})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)] text-sm">الرسالة</label>
                                <textarea 
                                    rows={4} 
                                    required
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                    className="w-full bg-[#000]/30 border border-[#DAA520]/30 rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none resize-none placeholder-[#F4E4BC]/20" 
                                    placeholder="اكتب رسالتك هنا..."
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowContactModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors border border-[#DAA520]/30">إلغاء</button>
                                <GoldButton type="submit" className="px-8 py-2 text-base">
                                     إرسال
                                </GoldButton>
                            </div>
                        </form>
                    </div>
                 </div>
              </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Broadcast Details Modal */}
      <AnimatePresence>
         {selectedBroadcast && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/90 backdrop-blur-md"
                 onClick={() => setSelectedBroadcast(null)}
              />
              
              <motion.div
                 initial={{ scale: 0.95, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.95, opacity: 0, y: 20 }}
                 className="relative z-50 w-full max-w-2xl max-h-[90vh] flex flex-col"
              >
                 {/* Fantasy Frame Structure - Updated for Transparency */}
                 <div className="relative bg-[#1E120A]/70 backdrop-blur-xl border border-[#DAA520]/40 rounded-3xl shadow-[0_0_80px_rgba(218,165,32,0.2)] flex flex-col overflow-hidden max-h-full">
                    {/* Inner Decorative Border */}
                    <div className="absolute inset-2 border border-[#DAA520]/20 rounded-2xl pointer-events-none" />
                    
                    {/* Creative Corner Ornaments */}
                    <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#DAA520]/20 to-transparent rounded-br-[4rem] z-0 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#DAA520]/20 to-transparent rounded-tl-[4rem] z-0 pointer-events-none" />
                    
                    <svg className="absolute top-6 left-6 w-8 h-8 text-[#DAA520]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M0,0 L12,0 M0,0 L0,12" />
                    </svg>
                    <svg className="absolute top-6 right-6 w-8 h-8 text-[#DAA520]/60 transform rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M0,0 L12,0 M0,0 L0,12" />
                    </svg>
                    <svg className="absolute bottom-6 left-6 w-8 h-8 text-[#DAA520]/60 transform -rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M0,0 L12,0 M0,0 L0,12" />
                    </svg>
                    <svg className="absolute bottom-6 right-6 w-8 h-8 text-[#DAA520]/60 transform rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M0,0 L12,0 M0,0 L0,12" />
                    </svg>

                    {/* Background Texture - Subtle */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(218,165,32,0.05)_0%,_transparent_70%)] pointer-events-none" />

                    {/* Content Container - Scrollable */}
                    <div className="relative z-10 p-8 md:p-10 overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-[#DAA520]/20 pb-6">
                            <div className="flex items-center gap-5 w-full">
                                <div className="relative shrink-0 group">
                                    <div className="absolute inset-0 bg-[#DAA520] blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                                    <div className="relative w-20 h-20 rounded-full bg-[#1E120A]/80 border border-[#DAA520]/50 flex items-center justify-center text-[#FFD700] shadow-[0_0_20px_rgba(218,165,32,0.1)]">
                                        <Crown className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <h2 className="text-3xl md:text-4xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold drop-shadow-md flex items-center gap-3">
                                        {selectedBroadcast.title}
                                    </h2>
                                    <div className="flex items-center gap-3 mt-3 text-[#F4E4BC]/60 text-sm font-[family-name:var(--font-cairo)]">
                                        <span className="flex items-center gap-2 bg-[#DAA520]/10 px-4 py-1.5 rounded-full border border-[#DAA520]/10">
                                            <Calendar className="w-4 h-4 text-[#DAA520]" />
                                            {(() => {
                                                try {
                                                    const d = new Date(selectedBroadcast.date);
                                                    return isNaN(d.getTime()) ? selectedBroadcast.date : d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
                                                } catch {
                                                    return selectedBroadcast.date;
                                                }
                                            })()}
                                        </span>
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#DAA520]/50" />
                                        <span className="text-[#DAA520]">مرسوم ملكي</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setSelectedBroadcast(null)}
                                className="group p-2 rounded-full hover:bg-[#FF6B6B]/10 transition-colors border border-transparent hover:border-[#FF6B6B]/30 absolute top-6 left-6 md:static md:top-auto md:left-auto"
                                title="إغلاق"
                            >
                                <X className="w-8 h-8 text-[#F4E4BC]/30 group-hover:text-[#FF6B6B] transition-colors" />
                            </button>
                        </div>

                        {/* Message Body */}
                        <div className="relative mb-10">
                            <div className="absolute -left-8 -top-8 opacity-[0.03] pointer-events-none transform -rotate-12">
                                <ScrollText className="w-48 h-48 text-[#DAA520]" />
                            </div>
                            
                            <div className="relative z-10">
                                {/* Decorative Quotes */}
                                <div className="text-6xl text-[#DAA520]/20 font-serif absolute -top-6 -right-4">❝</div>
                                
                                <p className="text-[#F4E4BC] text-xl md:text-2xl leading-[2] whitespace-pre-wrap font-[family-name:var(--font-amiri)] text-justify drop-shadow-sm px-4">
                                    {selectedBroadcast.message}
                                </p>

                                <div className="text-6xl text-[#DAA520]/20 font-serif absolute -bottom-10 -left-4 transform rotate-180">❝</div>

                                {/* Signature / Footer Decoration */}
                                <div className="mt-12 pt-8 flex flex-col items-center gap-4 opacity-70">
                                    <div className="flex items-center gap-4 text-[#DAA520]/60">
                                        <div className="h-[1px] w-20 bg-gradient-to-l from-[#DAA520] to-transparent" />
                                        <div className="text-2xl">❖</div>
                                        <div className="h-[1px] w-20 bg-gradient-to-r from-[#DAA520] to-transparent" />
                                    </div>
                                    <p className="text-[#DAA520]/60 text-sm font-[family-name:var(--font-scheherazade)] italic tracking-wide">
                                        صدر عن الديوان الملكي لأثير العلم
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-center">
                            <GoldButton onClick={() => setSelectedBroadcast(null)} className="px-12 py-3 text-lg shadow-[0_0_30px_rgba(218,165,32,0.3)] hover:shadow-[0_0_50px_rgba(218,165,32,0.5)]">
                                سمعاً وطاعة
                            </GoldButton>
                        </div>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
      {/* Night Challenge Modal */}
      <AnimatePresence>
          {showNightChallenge && nightQuestions.length > 0 && (
            <FantasyModal onClose={() => setShowNightChallenge(false)} title="تحدي نهاية اليوم" className="max-w-3xl">
                 {challengeScore !== null ? (
                     <div className="text-center py-8">
                         <div className="w-32 h-32 mx-auto bg-[#DAA520]/20 rounded-full flex items-center justify-center mb-6 relative">
                             <div className="absolute inset-0 animate-ping bg-[#DAA520]/10 rounded-full" />
                             <Crown className="w-16 h-16 text-[#FFD700]" />
                         </div>
                         <h2 className="text-3xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] mb-4">
                             {challengeScore >= 50 ? "أداء أسطوري!" : "محاولة جيدة!"}
                         </h2>
                         <p className="text-[#F4E4BC] text-xl mb-8">
                             لقد حصلت على <span className="text-[#FFD700] font-bold">{challengeScore}</span> نقطة خبرة و <span className="text-[#DAA520] font-bold">{Math.floor(challengeScore / 2)}</span> عملة ذهبية!
                         </p>
                         <GoldButton onClick={() => {
                             setShowNightChallenge(false);
                             setChallengeScore(null);
                             setCurrentChallengeQuestion(0);
                             setChallengeAnswers({});
                             addXP(challengeScore);
                             addCoins(Math.floor(challengeScore / 2));
                         }} className="px-12 py-3 text-lg">
                             استلم الجائزة
                         </GoldButton>
                     </div>
                 ) : (
                     <div className="space-y-6">
                         {/* Progress Bar */}
                         <div className="w-full h-2 bg-[#000]/50 rounded-full overflow-hidden mb-6">
                             <div 
                                className="h-full bg-[#DAA520] transition-all duration-500" 
                                style={{ width: `${((currentChallengeQuestion) / nightQuestions.length) * 100}%` }}
                             />
                         </div>

                         <div className="bg-[#000]/30 p-6 rounded-xl border border-[#5D4037] min-h-[300px] flex flex-col">
                             <div className="flex justify-between items-start mb-6">
                                 <span className="bg-[#DAA520]/20 text-[#DAA520] px-3 py-1 rounded text-sm">
                                     سؤال {currentChallengeQuestion + 1} من {nightQuestions.length}
                                 </span>
                                 <span className="text-[#F4E4BC]/50 text-sm">
                                     {nightQuestions[currentChallengeQuestion].subject}
                                 </span>
                             </div>

                             <h3 className="text-2xl text-[#F4E4BC] font-bold mb-8 leading-relaxed">
                                 {nightQuestions[currentChallengeQuestion].text}
                             </h3>

                             <div className="space-y-3 mt-auto">
                                 {nightQuestions[currentChallengeQuestion].options?.map((opt, idx) => (
                                     <button
                                         key={idx}
                                         onClick={() => {
                                            const newAnswers = { ...challengeAnswers, [nightQuestions[currentChallengeQuestion].id]: idx.toString() };
                                            setChallengeAnswers(newAnswers);
                                            
                                            if (currentChallengeQuestion < nightQuestions.length - 1) {
                                                setCurrentChallengeQuestion(curr => curr + 1);
                                            } else {
                                                // Calculate Score
                                                let correctCount = 0;
                                                nightQuestions.forEach(q => {
                                                    if (newAnswers[q.id] === q.correctAnswer) correctCount++;
                                                });
                                                const score = Math.round((correctCount / nightQuestions.length) * 100);
                                                setChallengeScore(score);
                                            }
                                         }}
                                         className="w-full text-right p-4 rounded-lg bg-[#2A1B0E] border border-[#5D4037] text-[#F4E4BC] hover:bg-[#DAA520] hover:text-[#1E120A] hover:border-[#DAA520] transition-all font-bold"
                                     >
                                         {opt}
                                     </button>
                                 ))}
                             </div>
                         </div>
                     </div>
                 )}
            </FantasyModal>
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
