"use client";

import { useState } from "react";
import { useUser, Quest } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, Star, Clock, CheckCircle2, AlertCircle, Send, X, ShieldAlert } from "lucide-react";
import GoldButton from "@/components/GoldButton";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import SidebarWorld from "@/components/SidebarWorld";
import { cn } from "@/lib/utils";

export default function QuestsPage() {
  const { quests, acceptQuest, submitQuest, acceptedQuests, submissions, name } = useUser();
  const { showToast } = useToast();
  
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [answer, setAnswer] = useState("");
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available');

  // Filter Quests
  const myAcceptedQuestIds = acceptedQuests ? acceptedQuests.map(q => q.id) : [];
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

    submitQuest(selectedQuest.id, selectedQuest.title, answer);
    showToast("تم إرسال المهمة للمراجعة بنجاح", "success");
    setAnswer("");
    setSelectedQuest(null);
  };

  return (
    <>
      <MobileNav />
      <PageTransition>
        <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2568&auto=format&fit=crop')] bg-cover bg-center bg-fixed overflow-y-auto">
          <div className="absolute inset-0 bg-[#2A1B0E]/90 backdrop-blur-sm z-0" />
          
          <div className="relative z-10 hidden md:block h-screen fixed right-0 top-0">
            <SidebarWorld />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-12 md:mr-24">
            {/* Header */}
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] flex items-center justify-center gap-3 mb-4">
                    <Scroll className="w-12 h-12" />
                    لوحة المهام الكبرى
                </h1>
                <p className="text-[#F4E4BC]/60 font-[family-name:var(--font-cairo)] text-lg max-w-2xl mx-auto">
                    هنا تبدأ رحلة المجد.. اختر مهامك بعناية، ونفذها بإتقان لتحصل على الذهب والمكانة الرفيعة
                </p>
            </header>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-8">
                {[
                    { id: 'available', label: 'المهام المتاحة', icon: <Star className="w-4 h-4" /> },
                    { id: 'active', label: 'مهامي الحالية', icon: <Clock className="w-4 h-4" /> },
                    { id: 'completed', label: 'سجل الإنجازات', icon: <CheckCircle2 className="w-4 h-4" /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 border-2",
                            activeTab === tab.id 
                                ? "bg-[#DAA520] text-[#2A1B0E] border-[#DAA520] shadow-[0_0_15px_rgba(218,165,32,0.4)]" 
                                : "bg-[#000]/30 text-[#F4E4BC] border-[#5D4037] hover:border-[#DAA520]"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'available' && (
                        <motion.div 
                            key="available"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {availableQuests.length === 0 ? (
                                <div className="col-span-full text-center py-20 bg-[#000]/20 rounded-xl border border-dashed border-[#5D4037]">
                                    <p className="text-[#F4E4BC]/50 text-xl">لا توجد مهام جديدة متاحة حالياً</p>
                                </div>
                            ) : (
                                availableQuests.map(quest => (
                                    <div key={quest.id} className="bg-[#2A1B0E] border border-[#5D4037] rounded-xl overflow-hidden hover:border-[#DAA520] transition-colors group flex flex-col">
                                        <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url('${quest.image}')` }}>
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B0E] to-transparent" />
                                            <span className="absolute top-4 right-4 bg-[#000]/60 backdrop-blur-sm text-[#FFD700] px-3 py-1 rounded-full text-xs border border-[#FFD700]/30">
                                                {quest.type}
                                            </span>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)] mb-2 group-hover:text-[#FFD700] transition-colors">
                                                {quest.title}
                                            </h3>
                                            <p className="text-[#F4E4BC]/60 text-sm mb-4 flex-1">
                                                {quest.subtitle}
                                            </p>
                                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#5D4037]/50">
                                                <div className="text-[#FFD700] font-bold flex items-center gap-1">
                                                    <span>+{quest.cost}</span>
                                                    <span className="text-xs font-normal opacity-70">عملة</span>
                                                </div>
                                                <GoldButton onClick={() => handleAccept(quest.id)} className="text-sm px-6">
                                                    قبول المهمة
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Pending Review Section */}
                            {pendingReviewQuests.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-[#DAA520] font-bold mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        قيد المراجعة ({pendingReviewQuests.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pendingReviewQuests.map(quest => (
                                            <div key={quest.id} className="bg-[#DAA520]/10 border border-[#DAA520]/30 rounded-xl p-4 flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 border border-[#DAA520]/20" style={{ backgroundImage: `url('${quest.image}')` }} />
                                                <div>
                                                    <h4 className="text-[#F4E4BC] font-bold">{quest.title}</h4>
                                                    <p className="text-[#DAA520] text-xs mt-1">بانتظار اعتماد المعلم...</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <h3 className="text-[#4ECDC4] font-bold mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                جاري العمل عليها ({activeQuests.length})
                            </h3>

                            {activeQuests.length === 0 ? (
                                <div className="text-center py-12 bg-[#000]/20 rounded-xl border border-dashed border-[#5D4037]">
                                    <p className="text-[#F4E4BC]/50">ليس لديك مهام نشطة. اذهب لتبويب "المهام المتاحة" وابدأ مغامرة!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {activeQuests.map(quest => (
                                        <div key={quest.id} className="bg-[#2A1B0E] border border-[#5D4037] rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                                            <div className="w-full md:w-48 h-32 rounded-lg bg-cover bg-center border border-[#5D4037]" style={{ backgroundImage: `url('${quest.image}')` }} />
                                            <div className="flex-1 text-center md:text-right">
                                                <h3 className="text-2xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] mb-2">
                                                    {quest.title}
                                                </h3>
                                                <p className="text-[#F4E4BC]/70 mb-4">
                                                    {quest.subtitle}
                                                </p>
                                                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-[#F4E4BC]/50">
                                                    <span className="bg-[#000]/30 px-3 py-1 rounded">النوع: {quest.type}</span>
                                                    <span className="bg-[#000]/30 px-3 py-1 rounded text-[#FFD700]">المكافأة: {quest.cost} عملة</span>
                                                </div>
                                            </div>
                                            <div className="w-full md:w-auto">
                                                <GoldButton onClick={() => setSelectedQuest(quest)} className="w-full md:w-auto px-8">
                                                    تسليم المهمة
                                                </GoldButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'completed' && (
                        <motion.div 
                            key="completed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {completedQuests.length === 0 ? (
                                <div className="col-span-full text-center py-20 bg-[#000]/20 rounded-xl border border-dashed border-[#5D4037]">
                                    <p className="text-[#F4E4BC]/50">لم تنجز أي مهمة بعد. الطريق طويل يا بطل!</p>
                                </div>
                            ) : (
                                completedQuests.map(quest => (
                                    <div key={quest.id} className="bg-[#2A1B0E]/60 border border-[#2ECC71]/30 rounded-xl p-6 relative overflow-hidden group">
                                        <div className="absolute top-2 right-2 text-[#2ECC71]">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-[#2ECC71]" style={{ backgroundImage: `url('${quest.image}')` }} />
                                            <div>
                                                <h3 className="font-bold text-[#F4E4BC]">{quest.title}</h3>
                                                <span className="text-[#2ECC71] text-xs">مكتملة</span>
                                            </div>
                                        </div>
                                        <div className="bg-[#2ECC71]/10 text-[#2ECC71] text-center py-2 rounded font-bold text-sm">
                                            تم اكتساب {quest.cost} عملة
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

          </div>
        </main>
      </PageTransition>

      {/* Submission Modal */}
      <AnimatePresence>
        {selectedQuest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSelectedQuest(null)}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl w-full max-w-lg shadow-2xl"
                >
                    <button 
                        onClick={() => setSelectedQuest(null)}
                        className="absolute top-4 left-4 text-[#F4E4BC] hover:text-[#FF6B6B]"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-2xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] mb-6 text-center">
                        تسليم المهمة: {selectedQuest.title}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[#F4E4BC] text-sm mb-2">إجابتك أو رابط العمل</label>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="اكتب إجابتك هنا أو ألصق رابط ملفك..."
                                className="w-full h-32 bg-[#000]/30 border border-[#5D4037] rounded-lg p-4 text-[#F4E4BC] focus:border-[#DAA520] outline-none resize-none font-[family-name:var(--font-cairo)]"
                            />
                        </div>

                        <div className="bg-[#DAA520]/10 p-4 rounded-lg flex gap-3 items-start">
                            <ShieldAlert className="w-5 h-5 text-[#DAA520] shrink-0 mt-0.5" />
                            <p className="text-[#F4E4BC]/70 text-xs">
                                تأكد من صحة إجابتك قبل الإرسال. سيقوم المعلم بمراجعة عملك ومنحك المكافأة إذا كان صحيحاً.
                            </p>
                        </div>

                        <GoldButton fullWidth onClick={handleSubmit} className="mt-4">
                            <Send className="w-4 h-4 ml-2" />
                            إرسال للمراجعة
                        </GoldButton>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </>
  );
}