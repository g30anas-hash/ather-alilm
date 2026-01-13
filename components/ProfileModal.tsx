"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Save, User, UserCircle, Star, Shield, Award, Scroll, 
  Map, Activity, BookOpen, Crown, Zap, BarChart3, MessageSquare,
  Users, Bot, GraduationCap, School, Coins, Gem, Calendar
} from "lucide-react";
import GoldButton from "./GoldButton";
import { useUser, UserRole } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId?: number; // Optional: To view other profiles (for Admin/Teacher)
}

export default function ProfileModal({ isOpen, onClose, targetUserId }: ProfileModalProps) {
  const { 
    name, role, coins, xp, level, badges, 
    updateName, allUsers, behaviorRecords, submissions, quests, schedule,
    classes
  } = useUser();
  
  const { showToast } = useToast();
  
  // Determine who we are viewing
  const isSelf = !targetUserId;
  const currentUser = isSelf 
    ? { name, role, coins, xp, level, badges } 
    : allUsers.find(u => u.id === targetUserId) || { name: "Unknown", role: "student" as UserRole, coins: 0, xp: 0, level: 1, badges: [] };

  // Use local state for editing
  const [newName, setNewName] = useState(currentUser.name);
  const [activeTab, setActiveTab] = useState("identity");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      updateName(newName);
      showToast("تم تحديث الهوية الأثيرية بنجاح", "success");
      // onClose(); // Keep open to see changes
    }
  };

  // --- Helper Functions ---
  const getRoleLabel = (r: string | null) => {
    switch(r) {
      case 'student': return "طالب مغامر";
      case 'teacher': return "معلم حكيم";
      case 'leader': return "قائد ملهم";
      case 'parent': return "ولي أمر داعم";
      default: return "زائر";
    }
  };

  const getProgressWidth = () => {
    const currentLevelXP = (currentUser.level || 1) * 1000;
    const progress = ((currentUser.xp || 0) / currentLevelXP) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // --- Tabs Configuration ---
  const getTabs = () => {
    const common = [
      { id: "identity", label: "الهوية الأثيرية", icon: <UserCircle className="w-5 h-5" /> },
    ];

    switch(currentUser.role) {
      case 'student':
        return [
          ...common,
          { id: "journey", label: "مسار الرحلة", icon: <Map className="w-5 h-5" /> },
          { id: "wisdom", label: "برج الحكمة", icon: <School className="w-5 h-5" /> },
          { id: "achievements", label: "سجل الأمجاد", icon: <Award className="w-5 h-5" /> },
          { id: "behavior", label: "صحيفة السلوك", icon: <Shield className="w-5 h-5" /> },
        ];
      case 'teacher':
        return [
          ...common,
          { id: "tasks", label: "سجل المهام", icon: <Scroll className="w-5 h-5" /> },
          { id: "impact", label: "أثر التعليم", icon: <Activity className="w-5 h-5" /> },
          { id: "assistant", label: "مساعد الأثير", icon: <Bot className="w-5 h-5" /> },
        ];
      case 'parent':
        return [
          ...common,
          { id: "tracking", label: "بطاقة المتابعة", icon: <Activity className="w-5 h-5" /> },
          { id: "reports", label: "تقارير الرحلة", icon: <BarChart3 className="w-5 h-5" /> },
          { id: "communication", label: "همزة الوصل", icon: <MessageSquare className="w-5 h-5" /> },
        ];
      case 'leader':
        return [
          ...common,
          { id: "dashboard", label: "لوحة التأثير", icon: <BarChart3 className="w-5 h-5" /> },
          { id: "balance", label: "ميزان السلوك", icon: <ScaleIcon className="w-5 h-5" /> },
          { id: "insight", label: "بصيرة الأثير", icon: <Bot className="w-5 h-5" /> },
        ];
      default:
        return common;
    }
  };

  // --- Render Sections ---

  const renderIdentityCard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Avatar Section */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-[#DAA520] bg-gradient-to-br from-[#2A1B0E] to-black flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(218,165,32,0.3)]">
             {/* Dynamic Avatar based on role/level could go here */}
             <User className="w-16 h-16 text-[#F4E4BC]/50" />
          </div>
          {isSelf && (
            <button className="absolute bottom-0 right-0 bg-[#DAA520] text-[#2A1B0E] p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
              <Scroll className="w-4 h-4" />
            </button>
          )}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#2A1B0E] border border-[#DAA520] px-3 py-1 rounded-full text-xs text-[#FFD700] whitespace-nowrap">
            LVL {currentUser.level || 1}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-right space-y-4 w-full">
           <div>
              {isSelf ? (
                 <div className="flex items-center gap-2 justify-center md:justify-start">
                    <input 
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-transparent border-b border-[#DAA520]/30 text-2xl font-bold text-[#FFD700] text-center md:text-right focus:border-[#DAA520] outline-none w-full md:w-auto"
                    />
                    <button onClick={handleSave} className="text-[#DAA520] hover:text-[#F4E4BC]"><Save className="w-5 h-5" /></button>
                 </div>
              ) : (
                <h2 className="text-3xl font-bold text-[#FFD700]">{currentUser.name}</h2>
              )}
              <p className="text-[#F4E4BC]/60 flex items-center justify-center md:justify-start gap-2 mt-1">
                {currentUser.role === 'leader' && <Crown className="w-4 h-4 text-[#FFD700]" />}
                {currentUser.role === 'teacher' && <BookOpen className="w-4 h-4 text-[#4ECDC4]" />}
                {currentUser.role === 'student' && <GraduationCap className="w-4 h-4 text-[#FF6B6B]" />}
                {getRoleLabel(currentUser.role)}
              </p>
           </div>

           {/* Stats Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#000]/30 p-3 rounded-lg border border-[#5D4037] text-center">
                 <div className="text-[#FFD700] font-bold text-xl">{currentUser.coins || 0}</div>
                 <div className="text-[#F4E4BC]/50 text-xs flex items-center justify-center gap-1"><Coins className="w-3 h-3" /> الذهب</div>
              </div>
              <div className="bg-[#000]/30 p-3 rounded-lg border border-[#5D4037] text-center">
                 <div className="text-[#4ECDC4] font-bold text-xl">{currentUser.xp || 0}</div>
                 <div className="text-[#F4E4BC]/50 text-xs flex items-center justify-center gap-1"><Zap className="w-3 h-3" /> الخبرة</div>
              </div>
              <div className="bg-[#000]/30 p-3 rounded-lg border border-[#5D4037] text-center">
                 <div className="text-[#FF6B6B] font-bold text-xl">{currentUser.badges?.length || 0}</div>
                 <div className="text-[#F4E4BC]/50 text-xs flex items-center justify-center gap-1"><Award className="w-3 h-3" /> الشارات</div>
              </div>
              <div className="bg-[#000]/30 p-3 rounded-lg border border-[#5D4037] text-center">
                 <div className="text-[#E6C288] font-bold text-xl">2024</div>
                 <div className="text-[#F4E4BC]/50 text-xs flex items-center justify-center gap-1"><Calendar className="w-3 h-3" /> الانضمام</div>
              </div>
           </div>

           {/* XP Bar */}
           <div className="relative pt-2">
              <div className="flex justify-between text-xs text-[#F4E4BC]/70 mb-1">
                 <span>مستوى {currentUser.level || 1}</span>
                 <span>{(currentUser.level || 1) + 1}</span>
              </div>
              <div className="h-3 bg-[#000] rounded-full overflow-hidden border border-[#5D4037]">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${getProgressWidth()}%` }}
                   className="h-full bg-gradient-to-r from-[#DAA520] to-[#FFD700]"
                 />
              </div>
              <p className="text-center text-[10px] text-[#F4E4BC]/30 mt-1">تبقى {((currentUser.level || 1) * 1000) - (currentUser.xp || 0)} XP للمستوى القادم</p>
           </div>
        </div>
      </div>
      
      {/* Bio / Description */}
      <div className="bg-[#DAA520]/5 border border-[#DAA520]/20 rounded-xl p-4 text-[#F4E4BC]/80 text-sm leading-relaxed text-center font-[family-name:var(--font-scheherazade)] text-lg">
        "هنا يكتب وصف موجز عن الشخصية، اهتماماتها، أو حكمتها المفضلة في الحياة..."
      </div>
    </div>
  );

  const renderStudentSections = () => {
    switch(activeTab) {
      case 'journey':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-[#000]/20 p-4 rounded-xl border border-[#5D4037]">
                <h3 className="text-[#FFD700] mb-3 flex items-center gap-2 font-bold"><Map className="w-4 h-4" /> المهام النشطة</h3>
                {quests.filter(q => q.status === 'approved').slice(0, 3).map(q => (
                  <div key={q.id} className="mb-2 p-2 bg-[#DAA520]/10 rounded border border-[#DAA520]/20 flex justify-between">
                     <span className="text-[#F4E4BC] text-sm">{q.title}</span>
                     <span className="text-[#FFD700] text-xs">{q.rewardXP} XP</span>
                  </div>
                ))}
                {quests.length === 0 && <p className="text-[#F4E4BC]/30 text-sm text-center">لا توجد مهام نشطة</p>}
             </div>
             <div className="bg-[#000]/20 p-4 rounded-xl border border-[#5D4037]">
                <h3 className="text-[#4ECDC4] mb-3 flex items-center gap-2 font-bold"><Activity className="w-4 h-4" /> التحديات اليومية</h3>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-sm text-[#F4E4BC]/80">
                      <div className="w-4 h-4 rounded-full border border-[#4ECDC4] flex items-center justify-center"><div className="w-2 h-2 bg-[#4ECDC4] rounded-full" /></div>
                      تسجيل الدخول اليومي
                   </div>
                   <div className="flex items-center gap-2 text-sm text-[#F4E4BC]/50">
                      <div className="w-4 h-4 rounded-full border border-[#4ECDC4]/50" />
                      إكمال مهمة واحدة
                   </div>
                </div>
             </div>
          </div>
        );
      case 'achievements':
        return (
           <div className="grid grid-cols-3 md:grid-cols-4 gap-4 animate-in fade-in">
              {(currentUser.badges || []).map((badge, idx) => (
                 <div key={idx} className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 bg-[#DAA520]/10 rounded-full flex items-center justify-center border-2 border-[#DAA520] mb-2 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(218,165,32,0.2)]">
                       <span className="text-2xl">{badge.icon}</span>
                    </div>
                    <span className="text-[#F4E4BC] text-xs font-bold">{badge.name}</span>
                    <span className="text-[#F4E4BC]/40 text-[10px]">{badge.dateEarned}</span>
                 </div>
              ))}
              {(!currentUser.badges || currentUser.badges.length === 0) && (
                 <div className="col-span-full text-center py-10 text-[#F4E4BC]/30">
                    <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>لم يتم الحصول على أوسمة بعد. انطلق في مغامرتك!</p>
                 </div>
              )}
           </div>
        );
      case 'behavior':
         return (
            <div className="space-y-3 animate-in fade-in">
               {behaviorRecords.filter(b => b.studentId === currentUser.id || isSelf).map(record => (
                  <div key={record.id} className={cn(
                     "p-3 rounded-lg border flex justify-between items-center",
                     record.type === 'positive' ? "bg-[#4ECDC4]/10 border-[#4ECDC4]/30" : "bg-[#FF6B6B]/10 border-[#FF6B6B]/30"
                  )}>
                     <div>
                        <p className="text-[#F4E4BC] font-bold text-sm">{record.category}</p>
                        <p className="text-[#F4E4BC]/50 text-xs">{record.reason}</p>
                     </div>
                     <div className={cn("text-sm font-bold", record.type === 'positive' ? "text-[#4ECDC4]" : "text-[#FF6B6B]")}>
                        {record.type === 'positive' ? '+' : '-'}{record.goldAmount} 🪙
                     </div>
                  </div>
               ))}
               {behaviorRecords.length === 0 && <p className="text-center text-[#F4E4BC]/30 py-8">السجل نظيف... صفحة بيضاء جديدة!</p>}
            </div>
         );
      default: return null;
    }
  };

  const renderContent = () => {
    if (activeTab === 'identity') return renderIdentityCard();
    if (currentUser.role === 'student') return renderStudentSections();
    // Placeholder for other roles
    return (
       <div className="text-center py-12 text-[#F4E4BC]/50">
          <Scroll className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>محتوى هذا القسم قيد الإنشاء من قبل سحرة الكود...</p>
       </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 font-[family-name:var(--font-amiri)]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#050B14]/90 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative z-50 bg-[#1A1209] border border-[#DAA520] rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(218,165,32,0.15)]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 left-4 z-50 text-[#F4E4BC]/50 hover:text-[#FF6B6B] transition-colors bg-black/20 p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-[#0F0A05] border-l border-[#DAA520]/20 p-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
               <h3 className="text-[#DAA520] font-bold mb-4 text-lg border-b border-[#DAA520]/10 pb-2">الملف الشخصي</h3>
               {getTabs().map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                     "flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-right group",
                     activeTab === tab.id 
                       ? "bg-[#DAA520]/20 text-[#FFD700] border border-[#DAA520]/30 shadow-[0_0_15px_rgba(218,165,32,0.1)]" 
                       : "text-[#F4E4BC]/60 hover:text-[#F4E4BC] hover:bg-[#DAA520]/5"
                   )}
                 >
                   <span className={cn("transition-transform group-hover:scale-110", activeTab === tab.id && "text-[#DAA520]")}>{tab.icon}</span>
                   <span className="font-[family-name:var(--font-cairo)] text-sm">{tab.label}</span>
                 </button>
               ))}

               {/* Help Button at bottom */}
               <div className="mt-auto pt-6">
                  <button className="w-full bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 text-[#4ECDC4] p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#4ECDC4]/20 transition-colors">
                     <Bot className="w-5 h-5" />
                     <span>مرشد الأثير</span>
                  </button>
               </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
               <div className="max-w-2xl mx-auto h-full">
                  {renderContent()}
               </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Icon helper
const ScaleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
  </svg>
);
