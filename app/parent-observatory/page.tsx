"use client";

import { useState, useEffect, Suspense } from "react";
import GameCard from "@/components/GameCard";
import GoldButton from "@/components/GoldButton";
import SidebarWorld from "@/components/SidebarWorld";
import { BookOpen, Calendar, GraduationCap, Heart, LineChart, Shield, Target, User, X, BrainCircuit, Users, LogOut, Map, Swords, Star, ScrollText, Brain } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import MobileNav from "@/components/MobileNav";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, UserData } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileModal from "@/components/ProfileModal";
import NotificationCenter from "@/components/NotificationCenter";
import WeekMap from "@/components/WeekMap";
import JourneyHour from "@/components/JourneyHour";

function ParentObservatoryContent() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { name, role, allUsers, logout, behaviorRecords, lessons } = useUser();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parent Logic
  const currentUser = allUsers.find(u => u.name === name && u.role === role);
  const childrenIds = currentUser?.childrenIds || [];
  const myChildren = allUsers.filter(u => childrenIds.includes(u.id));
  
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  useEffect(() => {
    const view = searchParams?.get('view');
    if (view) {
      setSelectedItem(view);
    }
  }, [searchParams]);

  useEffect(() => {
    if (myChildren.length > 0 && !selectedChildId) {
        setSelectedChildId(myChildren[0].id);
    }
  }, [myChildren, selectedChildId]);

  const selectedChild = myChildren.find(c => c.id === selectedChildId) || myChildren[0];

  // Real Stats from DB (via Context for now, assuming allUsers has updated data)
  const childStats = selectedChild ? {
      name: selectedChild.name,
      xp: selectedChild.xp || 0,
      level: selectedChild.level || 1,
      coins: selectedChild.coins || 0,
      attendance: 98, // Placeholder
      class: selectedChild.classId || "غير محدد"
  } : { name: "غير محدد", xp: 0, level: 1, coins: 0, attendance: 0, class: "" };

  // Filter Behavior Records for Selected Child
  const childBehaviors = behaviorRecords.filter(b => b.studentId === selectedChild?.id);
  const positiveBehaviors = childBehaviors.filter(b => b.type === 'positive');
  const negativeBehaviors = childBehaviors.filter(b => b.type === 'negative');

  const childLessons = lessons.filter(l => l.classId === selectedChild?.classId);
  childLessons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const handleSendMessage = () => {
    if (!contactMessage.trim()) return;
    showToast("تم إرسال رسالتك للمعلم بنجاح", "success");
    setContactMessage("");
    setShowContactModal(false);
  };

  const handleAction = (action: string) => {
      if (action === "تواصل مع المعلم") {
          setShowContactModal(true);
      } else {
        showToast(`سيتم تفعيل ميزة "${action}" قريباً`, "info");
      }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { id: 'performance', icon: <LineChart className="w-8 h-8" />, label: "مسار البطل", color: "text-[#4ECDC4]", detail: `مستوى ${childStats.name} في تقدم مستمر. نقاط الخبرة الحالية: ${childStats.xp} XP.` },
    { id: 'goals', icon: <Target className="w-8 h-8" />, label: "غايات الرحلة", color: "text-[#FF6B6B]", detail: "تم تحقيق 3 من أصل 5 أهداف لهذا الفصل الدراسي." },
    { id: 'attendance', icon: <Calendar className="w-8 h-8" />, label: "صحيفة الالتزام", color: "text-[#FFD700]", detail: `نسبة الحضور ${childStats.attendance}%. لا توجد واجبات متأخرة.` },
    { id: 'rewards', icon: <Heart className="w-8 h-8" />, label: "صندوق الغنائم", color: "text-[#FF9F43]", detail: `رصيد المكافآت الحالي: ${childStats.coins.toLocaleString()} نقطة ذهبية.` },
    { id: 'profile', icon: <User className="w-8 h-8" />, label: "لفافة الشخصية", color: "text-[#54A0FF]", detail: `الصف: ${childStats.class}. البيانات محدثة.` },
    { id: 'rank', icon: <GraduationCap className="w-8 h-8" />, label: "مستوى القوة", color: "text-[#A3CB38]", detail: `المستوى الحالي: ${childStats.level}. استمر في التقدم!` },
    { id: 'behavior', icon: <Shield className="w-8 h-8" />, label: "ميثاق الشرف", color: "text-[#EE5A24]", detail: `سجل السلوك: ${positiveBehaviors.length} إيجابي | ${negativeBehaviors.length} ملاحظات` },
    { id: 'subjects', icon: <BookOpen className="w-8 h-8" />, label: "فنون المعرفة", color: "text-[#12CBC4]", detail: "6 مواد مسجلة. المادة المفضلة: العلوم." },
    { id: 'lessons', icon: <ScrollText className="w-8 h-8" />, label: "سجل الحصص", color: "text-[#DAA520]", detail: `تم توثيق ${childLessons.length} حصة دراسية.` },
    { id: 'schedule', icon: <Map className="w-8 h-8" />, label: "خريطة الأسبوع", color: "text-[#FFD700]", detail: "جدول الحصص والخطط الأسبوعية." },
    { id: 'competitions', icon: <Swords className="w-8 h-8" />, label: "ساحة أثير", color: "text-[#FF4757]", detail: "شارك في 3 منافسات هذا الشهر. حقق المركز الأول في الرياضيات!" },
  ];

  const selectedData = menuItems.find(item => item.id === selectedItem);

  return (
    <>
      <MobileNav />
      <PageTransition>
        <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1497294815431-9365093b7331?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center overflow-hidden flex">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

          {/* Sidebar */}
          <div className="relative z-10 hidden md:block h-screen sticky top-0">
            <SidebarWorld />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 h-screen overflow-y-auto p-8 flex flex-col">
            <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center relative">
            
              <header className="text-center mb-8 relative">
                <div className="absolute top-0 right-0 hidden md:block">
                   <NotificationCenter />
                </div>
                <div className="absolute top-0 left-0 hidden md:block">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all duration-300 border border-[#FF6B6B]/20"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="font-[family-name:var(--font-cairo)] text-sm">تسجيل الخروج</span>
                    </button>
                </div>

                <div 
                  className="inline-block bg-[#2A1B0E]/90 border-2 border-[#DAA520] px-12 py-4 rounded-full shadow-[0_0_20px_rgba(218,165,32,0.3)] cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setShowProfileModal(true)}
                >
                  <h1 className="text-3xl text-[#FFD700] font-[family-name:var(--font-amiri)]">
                    مرصد المتابعة
                  </h1>
                  <p className="text-[#F4E4BC] font-[family-name:var(--font-scheherazade)] mt-2 hover:text-[#DAA520] transition-colors">
                    أهلاً بك يا {name}
                  </p>
                </div>

                {myChildren.length > 0 && (
                    <div className="mt-6 flex justify-center gap-4">
                        {myChildren.map(child => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedChildId(child.id)}
                                className={cn(
                                    "px-4 py-2 rounded-full border transition-all duration-300 flex items-center gap-2",
                                    selectedChildId === child.id 
                                        ? "bg-[#DAA520] border-[#DAA520] text-[#2A1B0E] font-bold shadow-[0_0_10px_rgba(218,165,32,0.5)] scale-110" 
                                        : "bg-[#000]/30 border-[#5D4037] text-[#F4E4BC] hover:border-[#DAA520]"
                                )}
                            >
                                <Users className="w-4 h-4" />
                                {child.name}
                            </button>
                        ))}
                    </div>
                )}
              </header>

              {/* AI Suggestion for Parents */}
              <div className="bg-[#112240]/90 p-4 rounded-xl border border-[#4ECDC4]/30 flex items-center gap-4 shadow-lg mb-8 max-w-3xl mx-auto w-full cursor-pointer hover:bg-[#112240] transition-colors" onClick={() => router.push('/ather-mind')}>
                  <div className="bg-[#4ECDC4]/20 p-3 rounded-full shrink-0">
                    <BrainCircuit className="w-8 h-8 text-[#4ECDC4]" />
                  </div>
                  <div>
                    <h3 className="text-[#4ECDC4] font-bold font-[family-name:var(--font-cairo)]">توصية عقل أثير</h3>
                    <p className="text-[#F4E4BC] text-sm">أداء {selectedChild?.name.split(' ')[0]} في "الرياضيات" متميز هذا الأسبوع. شجعه بمكافأة صغيرة!</p>
                  </div>
              </div>

              <GameCard className="bg-[#2A1B0E]/90 p-8 relative overflow-hidden min-h-[500px]">
                <AnimatePresence mode="wait">
                  {!selectedItem ? (
                    <motion.div 
                      key="grid"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                      {menuItems.map((item, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setSelectedItem(item.id)}
                          className="group flex flex-col items-center justify-center p-6 bg-[#5D4037]/50 border-2 border-[#8B4513] rounded-xl hover:bg-[#5D4037] hover:border-[#DAA520] hover:scale-105 transition-all duration-300 shadow-lg aspect-square"
                        >
                          <div className={`mb-4 p-4 rounded-full bg-[#2A1B0E] group-hover:bg-[#2A1B0E]/80 transition-colors ${item.color}`}>
                            {item.icon}
                          </div>
                          <span className="text-[#F4E4BC] font-[family-name:var(--font-cairo)] text-lg font-bold group-hover:text-[#FFD700]">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="detail"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col items-center justify-center h-full text-center py-12 w-full"
                    >
                      <button 
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-4 right-4 text-[#F4E4BC] hover:text-[#FF6B6B] transition-colors z-10"
                      >
                        <X className="w-8 h-8" />
                      </button>
                      
                      <div className={`p-6 rounded-full bg-[#2A1B0E] border-4 border-[#DAA520] mb-6 ${selectedData?.color}`}>
                        {selectedData?.icon}
                      </div>
                      
                      <h2 className="text-4xl text-[#FFD700] font-[family-name:var(--font-amiri)] mb-6">
                        {selectedData?.label}
                      </h2>
                      
                      {selectedItem === 'lessons' ? (
                          <div className="w-full max-w-4xl space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 text-right">
                              {childLessons.length === 0 ? (
                                  <p className="text-center text-[#F4E4BC]/50 py-8">لا توجد حصص مسجلة حتى الآن</p>
                              ) : (
                                  childLessons.map((lesson) => (
                                      <div key={lesson.id} className="bg-[#000]/30 border border-[#5D4037] p-6 rounded-xl flex gap-6 hover:border-[#DAA520] transition-colors">
                                          {lesson.imageUrl && (
                                              <img src={lesson.imageUrl} alt={lesson.subject} className="w-24 h-24 object-cover rounded-lg border border-[#5D4037]" />
                                          )}
                                          <div className="flex-1">
                                              <div className="flex justify-between items-start mb-2">
                                                  <h3 className="text-[#FFD700] font-bold text-xl font-[family-name:var(--font-amiri)]">{lesson.subject}</h3>
                                                  <span className="text-[#F4E4BC]/40 text-sm bg-[#DAA520]/10 px-2 py-1 rounded">{new Date(lesson.createdAt).toLocaleDateString('ar-SA')}</span>
                                              </div>
                                              <p className="text-[#F4E4BC]/80 mb-3 text-sm leading-relaxed">{lesson.summary}</p>
                                              <div className="flex gap-4 text-xs text-[#F4E4BC]/50">
                                                  <span>المعلم: {lesson.teacherName}</span>
                                                  <span>•</span>
                                                  <span>التحديات: {lesson.questions?.length || 0}</span>
                                              </div>
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                      ) : selectedItem === 'schedule' ? (
                          <div className="w-full max-w-4xl space-y-8 text-right">
                              <JourneyHour />
                              <WeekMap />
                          </div>
                      ) : selectedItem === 'behavior' ? (
                          <div className="w-full max-w-3xl space-y-4">
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                  <div className="bg-[#4ECDC4]/10 border border-[#4ECDC4] p-4 rounded-xl text-center">
                                      <h3 className="text-[#4ECDC4] font-bold text-xl mb-1">{positiveBehaviors.length}</h3>
                                      <p className="text-[#F4E4BC]/70 text-sm">سلوك إيجابي</p>
                                  </div>
                                  <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B] p-4 rounded-xl text-center">
                                      <h3 className="text-[#FF6B6B] font-bold text-xl mb-1">{negativeBehaviors.length}</h3>
                                      <p className="text-[#F4E4BC]/70 text-sm">ملاحظات</p>
                                  </div>
                              </div>
                              
                              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                  {childBehaviors.length === 0 ? (
                                      <p className="text-center text-[#F4E4BC]/50 py-8">لا توجد سجلات سلوكية حتى الآن</p>
                                  ) : (
                                      childBehaviors.map((b, i) => (
                                          <div key={i} className="bg-[#000]/30 border border-[#5D4037] p-4 rounded-lg flex items-center justify-between">
                                              <div className="flex items-center gap-3">
                                                  <div className={cn("p-2 rounded-full", b.type === 'positive' ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" : "bg-[#FF6B6B]/20 text-[#FF6B6B]")}>
                                                      {b.type === 'positive' ? <Star className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                                  </div>
                                                  <div className="text-right">
                                                      <h4 className="text-[#F4E4BC] font-bold">{b.category}</h4>
                                                      <p className="text-[#F4E4BC]/50 text-xs">{b.teacherName} • {b.date}</p>
                                                  </div>
                                              </div>
                                              <div className={cn("font-bold text-sm", b.type === 'positive' ? "text-[#FFD700]" : "text-[#FF6B6B]")}>
                                                  {b.type === 'positive' ? `+${b.goldAmount}` : `-${b.goldAmount}`} 🪙
                                              </div>
                                          </div>
                                      ))
                                  )}
                              </div>
                          </div>
                      ) : (
                          <div className="bg-[#000]/30 p-8 rounded-xl border border-[#5D4037] max-w-2xl">
                            <p className="text-2xl text-[#F4E4BC] font-[family-name:var(--font-scheherazade)] leading-relaxed">
                              {selectedData?.detail}
                            </p>
                          </div>
                      )}

                      <div className="mt-8">
                        <GoldButton onClick={() => setSelectedItem(null)} className="px-8">
                          العودة للقائمة
                        </GoldButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GameCard>

              <div className="mt-12 flex justify-center gap-6">
                <GoldButton className="px-10 text-xl" onClick={() => handleAction("تواصل مع المعلم")}>
                  تواصل مع المعلم
                </GoldButton>
                <GoldButton variant="secondary" className="px-10 text-xl" onClick={() => handleAction("سجل الملاحظات")}>
                  سجل الملاحظات
                </GoldButton>
              </div>

            </div>
          </div>
        </main>
      </PageTransition>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
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
                                        <Swords className="w-6 h-6 text-[#DAA520]" />
                                    </div>
                                    <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold">
                                        تواصل مع المعلم
                                    </h2>
                                </div>
                                <button onClick={() => setShowContactModal(false)} className="text-[#F4E4BC]/50 hover:text-[#FF6B6B] transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[#F4E4BC] text-sm mb-2 font-[family-name:var(--font-cairo)]">نص الرسالة</label>
                                    <textarea
                                        value={contactMessage}
                                        onChange={(e) => setContactMessage(e.target.value)}
                                        placeholder="اكتب استفسارك أو ملاحظتك هنا..."
                                        className="w-full h-32 bg-[#000]/30 border border-[#DAA520]/30 rounded-lg p-4 text-[#F4E4BC] focus:border-[#DAA520] outline-none resize-none font-[family-name:var(--font-cairo)] placeholder-[#F4E4BC]/20"
                                    />
                                </div>

                                <div className="pt-2">
                                    <GoldButton fullWidth onClick={handleSendMessage} className="py-3 text-base">
                                        إرسال
                                    </GoldButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ParentObservatoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a192f] flex items-center justify-center text-[#4ECDC4]">جاري تحميل المرصد...</div>}>
      <ParentObservatoryContent />
    </Suspense>
  );
}
