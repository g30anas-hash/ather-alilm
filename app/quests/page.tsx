"use client";

import { useState } from "react";
import { useUser, Quest } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, Star, Clock, CheckCircle2, AlertCircle, Send, X, ShieldAlert, Award, Coins } from "lucide-react";
import GoldButton from "@/components/GoldButton";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import SidebarWorld from "@/components/SidebarWorld";
import FantasyModal from "@/components/FantasyModal";
import { cn } from "@/lib/utils";

export default function QuestsPage() {
  const { quests, acceptQuest, submitQuest, acceptedQuests, submissions, name } = useUser();
  const { showToast } = useToast();
  
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [answer, setAnswer] = useState("");
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available');

  // Filter Quests
  const myAcceptedQuestIds = acceptedQuests ? acceptedQuests : [];
  const mySubmissions = submissions ? submissions.filter(s => s.studentName === name) : []; // Ideally filter by ID if available
  const myCompletedQuestIds = mySubmissions.filter(s => s.status === 'approved').map(s => s.questId);
  const myPendingQuestIds = mySubmissions.filter(s => s.status === 'pending').map(s => s.questId);

  const availableQuests = quests ? quests.filter(q => !myAcceptedQuestIds.includes(q.id) && !myCompletedQuestIds.includes(q.id)) : [];
  
  const activeQuests = quests?.filter(q => 
    myAcceptedQuestIds.includes(q.id) && 
    !myCompletedQuestIds.includes(q.id) &&
    !myPendingQuestIds.includes(q.id)
  ) ?? [];

  const pendingReviewQuests = quests?.filter(q => myPendingQuestIds.includes(q.id)) ?? [];
  
  const completedQuests = quests?.filter(q => myCompletedQuestIds.includes(q.id)) ?? [];

  const getQuestTypeText = (type: string) => {
      const lowerType = type.toLowerCase();
      if (lowerType.includes('daily')) return 'يومية';
      if (lowerType.includes('weekly')) return 'أسبوعية';
      if (lowerType.includes('main')) return 'رئيسية';
      if (lowerType.includes('side')) return 'جانبية';
      return type;
  };

  const handleAccept = (questId: number) => {
    acceptQuest(questId);
    showToast("تم قبول المهمة! حظاً موفقاً يا بطل", "success");
  };

  const handleSubmit = () => {
    if (!selectedQuest) return;
    if (!answer.trim()) {
        showToast("يرجى كتابة الإجابة أو إرفاق رابط العمل", "warning");
        return;
    }

    submitQuest({ questId: selectedQuest.id, questTitle: selectedQuest.title, answer });
    showToast("تم إرسال المهمة للمراجعة بنجاح", "success");
    setAnswer("");
    setSelectedQuest(null);
  };

  return (
    <>
      <MobileNav />
      <div className="hidden md:block fixed right-0 top-0 z-50 h-screen">
            <SidebarWorld />
      </div>
      <PageTransition>
        <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2568&auto=format&fit=crop')] bg-cover bg-center bg-fixed font-[family-name:var(--font-cairo)]">
          {/* Atmospheric Overlays */}
          <div className="absolute inset-0 bg-[#0a0502]/70 mix-blend-multiply z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E120A] via-transparent to-[#1E120A]/80 z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] opacity-50 z-0 pointer-events-none" />
          
          <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-12 md:mr-80 min-h-screen flex flex-col">
            {/* Header */}
            <header className="text-center mb-12 relative">
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[120%] h-32 bg-[#DAA520]/5 blur-3xl rounded-full pointer-events-none" />
                <h1 className="text-5xl md:text-6xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] flex items-center justify-center gap-4 mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                    <Scroll className="w-14 h-14 text-[#DAA520]" />
                    لوحة المهام الكبرى
                </h1>
                <p className="text-[#E6C288] font-[family-name:var(--font-scheherazade)] text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                    هنا تبدأ رحلة المجد.. اختر مهامك بعناية، ونفذها بإتقان لتحصل على الذهب والمكانة الرفيعة
                </p>
            </header>

            {/* Main Board Frame */}
            <div className="flex-1 bg-[#1E120A]/80 backdrop-blur-md rounded-[2rem] border-[3px] border-[#DAA520] shadow-[0_0_60px_rgba(0,0,0,0.6)] relative flex flex-col">
                {/* Frame Decorations */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-[#DAA520] rounded-tl-[1.5rem] opacity-60 pointer-events-none" />
                <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-[#DAA520] rounded-tr-[1.5rem] opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[#DAA520] rounded-bl-[1.5rem] opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-[#DAA520] rounded-br-[1.5rem] opacity-60 pointer-events-none" />

                {/* Tabs */}
                <div className="flex justify-center gap-4 p-6 border-b border-[#DAA520]/20 bg-[#000]/20 relative z-10">
                    {[
                        { id: 'available', label: 'المهام المتاحة', icon: <Star className="w-5 h-5" /> },
                        { id: 'active', label: 'مهامي الحالية', icon: <Clock className="w-5 h-5" /> },
                        { id: 'completed', label: 'سجل الإنجازات', icon: <CheckCircle2 className="w-5 h-5" /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 relative overflow-hidden group",
                                activeTab === tab.id 
                                    ? "text-[#1E120A] bg-gradient-to-r from-[#DAA520] to-[#F4E4BC] shadow-[0_0_20px_rgba(218,165,32,0.4)] transform -translate-y-1" 
                                    : "text-[#F4E4BC] bg-[#1E120A] border border-[#5D4037] hover:border-[#DAA520] hover:text-[#FFD700]"
                            )}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {tab.icon}
                                {tab.label}
                            </span>
                            {activeTab !== tab.id && <div className="absolute inset-0 bg-[#DAA520]/10 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-8 relative z-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'available' && (
                            <motion.div 
                                key="available"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {availableQuests.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-60">
                                        <Scroll className="w-20 h-20 text-[#DAA520] mb-4 opacity-50" />
                                        <p className="text-[#F4E4BC] text-xl font-[family-name:var(--font-scheherazade)]">لا توجد مهام جديدة في الأفق.. استرح قليلاً أيها المحارب</p>
                                    </div>
                                ) : (
                                    availableQuests.map(quest => (
                                        <div key={quest.id} className="group relative bg-[#1E120A] rounded-2xl overflow-hidden border border-[#5D4037] hover:border-[#DAA520] transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.2)] hover:-translate-y-1 flex flex-col h-full">
                                            {/* Image */}
                                            <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url('${quest.image}')` }}>
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E120A] via-transparent to-transparent opacity-90" />
                                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-[#DAA520]/30 text-[#FFD700] text-xs font-bold shadow-lg">
                                                    {getQuestTypeText(quest.type)}
                                                </div>
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="p-5 pt-2 flex-1 flex flex-col relative">
                                                <h3 className="text-xl font-bold text-[#F4E4BC] mb-2 font-[family-name:var(--font-amiri)] group-hover:text-[#FFD700] transition-colors line-clamp-1">
                                                    {quest.title}
                                                </h3>
                                                <p className="text-[#F4E4BC]/60 text-sm mb-4 line-clamp-2 flex-1 font-[family-name:var(--font-cairo)]">
                                                    {quest.subtitle}
                                                </p>
                                                
                                                <div className="mt-auto pt-4 border-t border-[#DAA520]/10 flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-[#DAA520]/60 text-xs">المكافأة</span>
                                                        <span className="text-[#FFD700] font-bold flex items-center gap-1">
                                                            {quest.cost} <span className="text-[10px]">عملة</span>
                                                        </span>
                                                    </div>
                                                    <GoldButton onClick={() => handleAccept(quest.id)} className="px-5 py-1.5 text-sm h-auto rounded-lg">
                                                        قبول
                                                    </GoldButton>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'active' && (
                            <motion.div 
                                key="active"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {/* Pending Review Section */}
                                {pendingReviewQuests.length > 0 && (
                                    <div className="bg-[#DAA520]/5 rounded-2xl p-6 border border-[#DAA520]/20">
                                        <h3 className="text-[#DAA520] font-bold mb-4 flex items-center gap-2 text-xl font-[family-name:var(--font-amiri)]">
                                            <Clock className="w-6 h-6" />
                                            قيد المراجعة ({pendingReviewQuests.length})
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {pendingReviewQuests.map(quest => (
                                                <div key={quest.id} className="bg-[#000]/40 rounded-xl p-4 flex items-center gap-4 border border-[#DAA520]/10">
                                                    <div className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 border border-[#DAA520]/20" style={{ backgroundImage: `url('${quest.image}')` }} />
                                                    <div>
                                                        <h4 className="text-[#F4E4BC] font-bold line-clamp-1">{quest.title}</h4>
                                                        <p className="text-[#DAA520]/70 text-xs mt-1 animate-pulse">بانتظار ختم المعلم...</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-[#4ECDC4] font-bold mb-6 flex items-center gap-2 text-xl font-[family-name:var(--font-amiri)]">
                                        <Star className="w-6 h-6" />
                                        جاري العمل عليها ({activeQuests.length})
                                    </h3>

                                    {activeQuests.length === 0 ? (
                                        <div className="text-center py-12 bg-[#000]/20 rounded-2xl border-2 border-dashed border-[#4ECDC4]/20">
                                            <p className="text-[#4ECDC4]/50 font-[family-name:var(--font-cairo)]">ليس لديك مهام نشطة. انطلق لساحة "المهام المتاحة" وابدأ مغامرة!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {activeQuests.map(quest => (
                                                <div key={quest.id} className="group relative bg-[#1E120A] border border-[#4ECDC4]/30 hover:border-[#4ECDC4] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 transition-all duration-300 shadow-lg">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-[#4ECDC4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                                                    
                                                    <div className="w-full md:w-64 h-40 rounded-xl bg-cover bg-center border border-[#4ECDC4]/20 shadow-inner shrink-0" style={{ backgroundImage: `url('${quest.image}')` }} />
                                                    
                                                    <div className="flex-1 text-center md:text-right z-10">
                                                        <h3 className="text-2xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)] mb-2 group-hover:text-[#4ECDC4] transition-colors">
                                                            {quest.title}
                                                        </h3>
                                                        <p className="text-[#F4E4BC]/70 mb-4 font-[family-name:var(--font-cairo)] leading-relaxed">
                                                            {quest.subtitle}
                                                        </p>
                                                        <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm">
                                                            <span className="bg-[#4ECDC4]/10 text-[#4ECDC4] px-3 py-1 rounded-lg border border-[#4ECDC4]/20">{getQuestTypeText(quest.type)}</span>
                                                            <span className="bg-[#FFD700]/10 text-[#FFD700] px-3 py-1 rounded-lg border border-[#FFD700]/20 flex items-center gap-1">
                                                                +{quest.cost} عملة
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="w-full md:w-auto z-10">
                                                        <GoldButton onClick={() => setSelectedQuest(quest)} className="w-full md:w-auto px-8 py-3 text-[#1E120A] bg-[#4ECDC4] hover:bg-[#3dbdb4] border-[#4ECDC4]">
                                                            تسليم المهمة
                                                        </GoldButton>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'completed' && (
                            <motion.div 
                                key="completed"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {completedQuests.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-50">
                                        <Award className="w-20 h-20 text-[#2ECC71] mb-4 opacity-50" />
                                        <p className="text-[#F4E4BC] text-xl">لم تنجز أي مهمة بعد. الطريق طويل يا بطل!</p>
                                    </div>
                                ) : (
                                    completedQuests.map(quest => (
                                        <div key={quest.id} className="bg-[#1E120A]/80 border border-[#2ECC71]/30 rounded-2xl p-6 relative overflow-hidden group hover:bg-[#2ECC71]/5 transition-colors">
                                            <div className="absolute top-0 right-0 p-3 bg-[#2ECC71]/20 rounded-bl-2xl border-b border-l border-[#2ECC71]/30 text-[#2ECC71]">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-[#2ECC71]" style={{ backgroundImage: `url('${quest.image}')` }} />
                                                <div>
                                                    <h3 className="font-bold text-[#F4E4BC] line-clamp-1">{quest.title}</h3>
                                                    <span className="text-[#2ECC71] text-xs bg-[#2ECC71]/10 px-2 py-0.5 rounded-full border border-[#2ECC71]/20">مكتملة</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-[#2ECC71]/20 flex justify-between items-center text-sm">
                                                <span className="text-[#F4E4BC]/60">المكافأة المكتسبة:</span>
                                                <span className="text-[#2ECC71] font-bold flex items-center gap-1">
                                                    +{quest.cost} <Coins className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
          </div>
        </main>
      </PageTransition>

      {/* Submission Modal */}
      <AnimatePresence>
        {selectedQuest && (
            <FantasyModal onClose={() => setSelectedQuest(null)} title={`تسليم المهمة: ${selectedQuest.title}`}>
                 <div className="space-y-6">
                    <div className="bg-[#DAA520]/5 p-4 rounded-xl border border-[#DAA520]/20 flex gap-4 items-start">
                        <div className="bg-[#DAA520]/10 p-2 rounded-lg shrink-0">
                            <ShieldAlert className="w-6 h-6 text-[#DAA520]" />
                        </div>
                        <div>
                            <h4 className="text-[#DAA520] font-bold mb-1 font-[family-name:var(--font-amiri)]">تعليمات التسليم</h4>
                            <p className="text-[#F4E4BC]/70 text-sm font-[family-name:var(--font-cairo)] leading-relaxed">
                                تأكد من مراجعة إجابتك جيداً. يمكنك كتابة الحل مباشرة في الصندوق أدناه، أو إرفاق رابط لملفك (Google Drive, OneDrive, ...). سيقوم المعلم بمراجعة العمل ومنحك المكافأة المستحقة.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#F4E4BC] text-sm mb-2 font-bold font-[family-name:var(--font-cairo)]">مساحة الإجابة</label>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="اكتب إجابتك هنا أو ألصق رابط ملفك..."
                            className="w-full h-40 bg-[#000]/40 border border-[#5D4037] rounded-xl p-4 text-[#F4E4BC] focus:border-[#DAA520] outline-none resize-none font-[family-name:var(--font-cairo)] placeholder-[#F4E4BC]/20 focus:bg-[#000]/60 transition-colors custom-scrollbar"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#DAA520]/20">
                        <button 
                            onClick={() => setSelectedQuest(null)}
                            className="px-6 py-2 rounded-xl text-[#F4E4BC]/70 hover:text-[#F4E4BC] hover:bg-[#5D4037]/30 transition-colors font-[family-name:var(--font-cairo)]"
                        >
                            إلغاء
                        </button>
                        <GoldButton onClick={handleSubmit} className="px-8 py-2 rounded-xl shadow-lg">
                            <span className="flex items-center gap-2">
                                <Send className="w-4 h-4" />
                                إرسال للمراجعة
                            </span>
                        </GoldButton>
                    </div>
                 </div>
            </FantasyModal>
        )}
      </AnimatePresence>
    </>
  );
}