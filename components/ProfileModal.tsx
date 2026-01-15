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
    id, name, role, coins, xp, level, badges, avatar, frame,
    updateName, updateAvatar, updateFrame, allUsers, behaviorRecords, submissions, quests, schedule,
    classes, inventory
  } = useUser();
  
  const { showToast } = useToast();
  
  // Determine who we are viewing
  const isSelf = !targetUserId;
  const currentUser = isSelf 
    ? { id, name, role, coins, xp, level, badges, avatar, frame } 
    : allUsers.find(u => u.id === targetUserId) || { id: 0, name: "Unknown", role: "student" as UserRole, coins: 0, xp: 0, level: 1, badges: [], avatar: undefined, frame: undefined };

  // Use local state for editing
  const [newName, setNewName] = useState(currentUser.name);
  const [activeTab, setActiveTab] = useState("identity");
  const [showInventory, setShowInventory] = useState(false);

  const handleEquip = (type: 'avatar' | 'frame', value: string) => {
      if (type === 'avatar') {
          updateAvatar(value);
          showToast("تم تحديث الصورة الرمزية", "success");
      } else {
          updateFrame(value);
          showToast("تم تحديث الإطار", "success");
      }
      setShowInventory(false);
  };

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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#2A1B0E]/80 to-[#000]/80 p-6 rounded-2xl border border-[#DAA520]/30 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            {/* Avatar */}
            <div className="relative shrink-0">
                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-black shadow-[0_0_40px_rgba(218,165,32,0.4)] flex items-center justify-center relative z-10 group overflow-hidden" style={{
                     border: currentUser.frame ? 'none' : '4px solid #DAA520'
                 }}>
                    {/* Frame Layer */}
                    {currentUser.frame && (
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <img src={currentUser.frame} alt="Frame" className="w-full h-full object-cover scale-110" />
                        </div>
                    )}
                    
                    {/* Avatar Image */}
                    {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-20 h-20 text-[#F4E4BC]/20 group-hover:scale-110 transition-transform duration-500" />
                    )}
                 </div>
                 {/* Level Badge */}
                 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#DAA520] text-[#2A1B0E] px-4 py-1 rounded-full font-bold border-2 border-[#000] shadow-lg z-20 whitespace-nowrap flex items-center gap-2">
                    <Star className="w-4 h-4 fill-[#2A1B0E]" />
                    <span>LVL {currentUser.level || 1}</span>
                 </div>
                 {/* Edit Button */}
                 {isSelf && (
                    <button 
                        onClick={() => setShowInventory(true)}
                        className="absolute top-0 right-0 bg-[#2A1B0E] text-[#DAA520] p-2 rounded-full border border-[#DAA520] hover:scale-110 transition-transform z-20 shadow-lg"
                    >
                        <Palette className="w-4 h-4" />
                    </button>
                 )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-right space-y-3">
                 <div className="flex flex-col md:items-start items-center gap-2">
                    {isSelf ? (
                        <div className="relative group w-full md:w-auto">
                            <input 
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="bg-transparent text-4xl font-bold text-[#FFD700] text-center md:text-right outline-none w-full border-b border-transparent focus:border-[#DAA520] transition-colors placeholder-[#DAA520]/30"
                            />
                            <Save className="w-5 h-5 text-[#DAA520] absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleSave} />
                        </div>
                    ) : (
                        <h2 className="text-4xl font-bold text-[#FFD700] drop-shadow-md">{currentUser.name}</h2>
                    )}
                    
                    <div className="flex items-center gap-3 bg-[#DAA520]/10 px-4 py-1.5 rounded-full border border-[#DAA520]/20">
                        {currentUser.role === 'leader' && <Crown className="w-5 h-5 text-[#FFD700]" />}
                        {currentUser.role === 'teacher' && <BookOpen className="w-5 h-5 text-[#4ECDC4]" />}
                        {currentUser.role === 'student' && <GraduationCap className="w-5 h-5 text-[#FF6B6B]" />}
                        <span className="text-[#F4E4BC] font-[family-name:var(--font-cairo)]">{getRoleLabel(currentUser.role)}</span>
                    </div>
                 </div>

                 {/* XP Bar */}
                 <div className="w-full max-w-md bg-[#000]/50 h-4 rounded-full border border-[#5D4037] relative overflow-hidden mt-4">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressWidth()}%` }}
                        className="h-full bg-gradient-to-r from-[#DAA520] via-[#FFD700] to-[#DAA520] shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/80 drop-shadow-md">
                        {currentUser.xp || 0} / {(currentUser.level || 1) * 1000} XP
                    </div>
                 </div>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: 'الذهب', value: currentUser.coins || 0, icon: <Coins className="w-5 h-5" />, color: 'text-[#FFD700]', border: 'border-[#FFD700]/30' },
            { label: 'الخبرة', value: currentUser.xp || 0, icon: <Zap className="w-5 h-5" />, color: 'text-[#4ECDC4]', border: 'border-[#4ECDC4]/30' },
            { label: 'الشارات', value: currentUser.badges?.length || 0, icon: <Award className="w-5 h-5" />, color: 'text-[#FF6B6B]', border: 'border-[#FF6B6B]/30' },
            { label: 'الانضمام', value: '2024', icon: <Calendar className="w-5 h-5" />, color: 'text-[#E6C288]', border: 'border-[#E6C288]/30' },
        ].map((stat, i) => (
            <div key={i} className={`bg-[#1A1209]/80 p-4 rounded-xl border ${stat.border} flex flex-col items-center justify-center gap-2 hover:bg-[#2A1B0E] transition-colors group`}>
                <div className={`p-3 rounded-full bg-black/40 ${stat.color} group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                </div>
                <span className="text-2xl font-bold text-[#F4E4BC]">{stat.value}</span>
                <span className="text-xs text-[#F4E4BC]/50">{stat.label}</span>
            </div>
        ))}
      </div>

      {/* Bio / Description */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#DAA520]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-[#0F0A05] border border-[#DAA520]/30 rounded-xl p-6 text-center">
             <Scroll className="w-8 h-8 text-[#DAA520]/40 mx-auto mb-3" />
             <p className="text-[#F4E4BC]/80 text-lg leading-relaxed font-[family-name:var(--font-scheherazade)]">
               &quot;هنا يكتب وصف موجز عن الشخصية، اهتماماتها، أو حكمتها المفضلة في الحياة... المغامرة تبدأ بخطوة!&quot;
             </p>
        </div>
      </div>
      {/* Inventory/Customization Modal Overlay */}
      <AnimatePresence>
        {showInventory && (
           <div className="absolute inset-0 z-[80] bg-[#050B14]/95 backdrop-blur-md flex flex-col p-6 animate-in fade-in zoom-in-95 duration-300">
               <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)]">خزانة الملابس</h3>
                   <button onClick={() => setShowInventory(false)} className="text-[#F4E4BC]/50 hover:text-[#FF6B6B]">
                       <X className="w-6 h-6" />
                   </button>
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar">
                   <div className="mb-8">
                       <h4 className="text-[#4ECDC4] font-bold mb-4 flex items-center gap-2"><UserCircle className="w-5 h-5" /> الصور الرمزية</h4>
                       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                           {/* Default Avatars */}
                           {['https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', 'https://api.dicebear.com/7.x/bottts/svg?seed=Bot'].map((url, i) => (
                               <div key={i} onClick={() => handleEquip('avatar', url)} className="cursor-pointer bg-[#000]/40 p-2 rounded-xl border border-[#5D4037] hover:border-[#DAA520] hover:bg-[#DAA520]/10 transition-all text-center">
                                   <img src={url} alt="Avatar" className="w-16 h-16 mx-auto mb-2 rounded-full" />
                                   <span className="text-xs text-[#F4E4BC]/70">افتراضي {i+1}</span>
                               </div>
                           ))}
                           {/* Inventory Avatars */}
                           {inventory.filter(i => i.type === 'avatar').map(item => (
                               <div key={item.id} onClick={() => handleEquip('avatar', item.image)} className="cursor-pointer bg-[#000]/40 p-2 rounded-xl border border-[#5D4037] hover:border-[#DAA520] hover:bg-[#DAA520]/10 transition-all text-center">
                                   <img src={item.image} alt={item.name} className="w-16 h-16 mx-auto mb-2 rounded-full" />
                                   <span className="text-xs text-[#F4E4BC]/70">{item.name}</span>
                               </div>
                           ))}
                       </div>
                   </div>

                   <div>
                       <h4 className="text-[#FFD700] font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5" /> الإطارات</h4>
                       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                           <div onClick={() => handleEquip('frame', '')} className="cursor-pointer bg-[#000]/40 p-2 rounded-xl border border-[#5D4037] hover:border-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all text-center flex flex-col items-center justify-center min-h-[120px]">
                               <X className="w-8 h-8 text-[#FF6B6B] mb-2" />
                               <span className="text-xs text-[#F4E4BC]/70">إزالة الإطار</span>
                           </div>
                           {inventory.filter(i => i.type === 'frame').map(item => (
                               <div key={item.id} onClick={() => handleEquip('frame', item.image)} className="cursor-pointer bg-[#000]/40 p-2 rounded-xl border border-[#5D4037] hover:border-[#DAA520] hover:bg-[#DAA520]/10 transition-all text-center relative">
                                   <div className="w-16 h-16 mx-auto mb-2 relative">
                                       <div className="w-12 h-12 rounded-full bg-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                       <img src={item.image} alt={item.name} className="w-full h-full object-cover relative z-10" />
                                   </div>
                                   <span className="text-xs text-[#F4E4BC]/70">{item.name}</span>
                               </div>
                           ))}
                           {inventory.filter(i => i.type === 'frame').length === 0 && (
                               <div className="col-span-full text-center py-4 text-[#F4E4BC]/30">لا تملك إطارات بعد. قم بزيارة السوق!</div>
                           )}
                       </div>
                   </div>
               </div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderStudentSections = () => {
    switch(activeTab) {
      case 'journey':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
             {/* Active Quests */}
             <div className="bg-[#1A1209]/80 p-6 rounded-2xl border border-[#DAA520]/30 relative overflow-hidden group hover:border-[#DAA520] transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Map className="w-24 h-24 text-[#DAA520]" /></div>
                <h3 className="text-[#FFD700] mb-6 flex items-center gap-3 font-bold text-xl relative z-10">
                    <div className="p-2 bg-[#DAA520]/20 rounded-lg"><Map className="w-5 h-5" /></div>
                    المهام النشطة
                </h3>
                {quests.filter(q => q.status === 'approved').slice(0, 3).map(q => (
                  <div key={q.id} className="mb-3 p-3 bg-[#000]/40 rounded-xl border border-[#DAA520]/20 flex justify-between items-center hover:bg-[#DAA520]/10 transition-colors cursor-pointer">
                     <span className="text-[#F4E4BC] text-sm font-bold">{q.title}</span>
                     <span className="text-[#FFD700] text-xs bg-[#DAA520]/20 px-2 py-1 rounded border border-[#DAA520]/30">{q.rewardXP} XP</span>
                  </div>
                ))}
                {quests.length === 0 && <p className="text-[#F4E4BC]/30 text-sm text-center py-4 border-2 border-dashed border-[#DAA520]/20 rounded-xl">لا توجد مهام نشطة حالياً</p>}
             </div>

             {/* Daily Challenges */}
             <div className="bg-[#1A1209]/80 p-6 rounded-2xl border border-[#4ECDC4]/30 relative overflow-hidden group hover:border-[#4ECDC4] transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Activity className="w-24 h-24 text-[#4ECDC4]" /></div>
                <h3 className="text-[#4ECDC4] mb-6 flex items-center gap-3 font-bold text-xl relative z-10">
                     <div className="p-2 bg-[#4ECDC4]/20 rounded-lg"><Activity className="w-5 h-5" /></div>
                     التحديات اليومية
                </h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-sm text-[#F4E4BC]/90 bg-[#000]/40 p-3 rounded-xl border border-[#4ECDC4]/20">
                      <div className="w-5 h-5 rounded-full border-2 border-[#4ECDC4] flex items-center justify-center"><div className="w-2.5 h-2.5 bg-[#4ECDC4] rounded-full animate-pulse" /></div>
                      تسجيل الدخول اليومي
                   </div>
                   <div className="flex items-center gap-3 text-sm text-[#F4E4BC]/50 bg-[#000]/20 p-3 rounded-xl border border-[#4ECDC4]/10">
                      <div className="w-5 h-5 rounded-full border-2 border-[#4ECDC4]/30" />
                      إكمال مهمة واحدة
                   </div>
                </div>
             </div>
          </div>
        );
      case 'achievements':
        return (
           <div className="grid grid-cols-3 md:grid-cols-4 gap-6 animate-in fade-in">
              {(currentUser.badges || []).map((badge, idx) => (
                 <div key={idx} className="flex flex-col items-center text-center group relative p-4 bg-[#1A1209]/50 rounded-xl border border-[#DAA520]/10 hover:border-[#DAA520] hover:bg-[#DAA520]/10 transition-all">
                    <div className="w-20 h-20 bg-[#DAA520]/10 rounded-full flex items-center justify-center border-2 border-[#DAA520] mb-3 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(218,165,32,0.2)] relative z-10">
                       <span className="text-3xl">{badge.icon}</span>
                    </div>
                    <div className="absolute inset-0 bg-[#DAA520]/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[#F4E4BC] text-sm font-bold relative z-10">{badge.name}</span>
                    <span className="text-[#F4E4BC]/40 text-xs mt-1 relative z-10">{badge.dateEarned}</span>
                 </div>
              ))}
              {(!currentUser.badges || currentUser.badges.length === 0) && (
                 <div className="col-span-full text-center py-16 text-[#F4E4BC]/30 border-2 border-dashed border-[#DAA520]/20 rounded-2xl bg-[#000]/20">
                    <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">لم يتم الحصول على أوسمة بعد. انطلق في مغامرتك!</p>
                 </div>
              )}
           </div>
        );
      case 'behavior':
         return (
            <div className="space-y-4 animate-in fade-in">
               {behaviorRecords.filter(b => b.studentId === currentUser.id || isSelf).map(record => (
                  <div key={record.id} className={cn(
                     "p-4 rounded-xl border flex justify-between items-center relative overflow-hidden group",
                     record.type === 'positive' ? "bg-[#4ECDC4]/5 border-[#4ECDC4]/30 hover:bg-[#4ECDC4]/10" : "bg-[#FF6B6B]/5 border-[#FF6B6B]/30 hover:bg-[#FF6B6B]/10"
                  )}>
                     <div className={cn("absolute inset-y-0 right-0 w-1", record.type === 'positive' ? "bg-[#4ECDC4]" : "bg-[#FF6B6B]")} />
                     <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-full", record.type === 'positive' ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" : "bg-[#FF6B6B]/20 text-[#FF6B6B]")}>
                            {record.type === 'positive' ? <Star className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="text-[#F4E4BC] font-bold text-lg mb-1">{record.category}</p>
                            <p className="text-[#F4E4BC]/50 text-sm">{record.reason}</p>
                        </div>
                     </div>
                     <div className={cn("text-xl font-bold flex items-center gap-1", record.type === 'positive' ? "text-[#4ECDC4]" : "text-[#FF6B6B]")}>
                        {record.type === 'positive' ? '+' : '-'}{record.goldAmount} 
                        <Coins className="w-5 h-5" />
                     </div>
                  </div>
               ))}
               {behaviorRecords.length === 0 && (
                   <div className="text-center py-16 text-[#F4E4BC]/30 border-2 border-dashed border-[#5D4037] rounded-2xl bg-[#000]/20">
                       <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                       <p className="text-lg">السجل نظيف... صفحة بيضاء جديدة!</p>
                   </div>
               )}
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
       <div className="flex flex-col items-center justify-center py-20 text-[#F4E4BC]/50 border-2 border-dashed border-[#DAA520]/20 rounded-3xl bg-[#000]/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse" />
          <div className="p-6 bg-[#DAA520]/5 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500 border border-[#DAA520]/20">
              <Scroll className="w-16 h-16 opacity-50 text-[#DAA520]" />
          </div>
          <h3 className="text-xl font-bold text-[#DAA520] mb-2 font-[family-name:var(--font-amiri)]">محتوى قيد التطوير</h3>
          <p className="font-[family-name:var(--font-cairo)]">يقوم سحرة الكود ببناء هذا القسم حالياً...</p>
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
            className="relative z-50 bg-[#1A1209] border-2 border-[#DAA520] rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-[0_0_80px_rgba(218,165,32,0.2)]"
          >
            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#DAA520] rounded-tl-xl pointer-events-none opacity-50 z-[60]" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#DAA520] rounded-tr-xl pointer-events-none opacity-50 z-[60]" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#DAA520] rounded-bl-xl pointer-events-none opacity-50 z-[60]" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#DAA520] rounded-br-xl pointer-events-none opacity-50 z-[60]" />

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 left-4 z-[70] text-[#F4E4BC]/50 hover:text-[#FF6B6B] transition-colors bg-black/40 p-2 rounded-full border border-[#DAA520]/30 hover:border-[#FF6B6B]/50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sidebar Navigation */}
            <div className="w-full md:w-72 bg-[#0F0A05] border-l-2 border-[#DAA520]/30 p-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 pointer-events-none" />
               <h3 className="text-[#DAA520] font-bold mb-6 text-2xl text-center border-b-2 border-[#DAA520]/20 pb-4 relative z-10">الملف الشخصي</h3>
               
               <div className="space-y-2 relative z-10">
               {getTabs().map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                     "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-right group relative overflow-hidden",
                     activeTab === tab.id 
                       ? "bg-gradient-to-r from-[#DAA520]/20 to-transparent text-[#FFD700] border-r-4 border-[#FFD700]" 
                       : "text-[#F4E4BC]/60 hover:text-[#F4E4BC] hover:bg-[#DAA520]/5"
                   )}
                 >
                   <span className={cn("transition-transform group-hover:scale-110 relative z-10", activeTab === tab.id && "text-[#DAA520] drop-shadow-[0_0_5px_rgba(218,165,32,0.8)]")}>{tab.icon}</span>
                   <span className="font-[family-name:var(--font-cairo)] text-sm font-bold relative z-10">{tab.label}</span>
                   {activeTab === tab.id && <div className="absolute inset-0 bg-[#DAA520]/5 animate-pulse" />}
                 </button>
               ))}
               </div>

               {/* Help Button at bottom */}
               <div className="mt-auto pt-6 relative z-10">
                  <button className="w-full bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 text-[#4ECDC4] p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#4ECDC4]/20 transition-all hover:shadow-[0_0_15px_rgba(78,205,196,0.2)]">
                     <Bot className="w-5 h-5" />
                     <span>مرشد الأثير</span>
                  </button>
               </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] relative">
               <div className="absolute inset-0 bg-gradient-to-br from-[#1A1209]/90 via-[#050B14]/95 to-[#000]/90 pointer-events-none" />
               <div className="max-w-3xl mx-auto h-full relative z-10">
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
