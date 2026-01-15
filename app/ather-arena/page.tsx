"use client";

import { useState, useEffect } from "react";
import { useUser, Competition, Question } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Trophy, Users, Clock, ArrowRight, Shield, Crown, CheckCircle2, XCircle, Timer, AlertCircle } from "lucide-react";
import GoldButton from "@/components/GoldButton";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AtherArenaPage() {
  const { competitions, joinCompetition, submitCompetitionResult, name, role, id: userId, questionBank } = useUser();
  const { showToast } = useToast();
  const router = useRouter();
  
  // Battle State
  const [activeBattle, setActiveBattle] = useState<Competition | null>(null);
  const [battleQuestions, setBattleQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [battleFinished, setBattleFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const activeCompetitions = competitions.filter(c => c.status === 'active' || c.status === 'upcoming');

  const handleJoin = async (comp: Competition) => {
    if (role !== 'student') {
        showToast("المنافسات متاحة للطلاب فقط أيها القائد!", "warning");
        return;
    }

    if (!userId) {
        showToast("يجب عليك تسجيل الدخول أولاً", "error");
        return;
    }

    const isJoined = comp.participants.some(p => p.studentId === userId);
    
    if (!isJoined) {
        await joinCompetition(comp.id, userId, name);
        showToast(`تم تسجيلك في "${comp.title}" بنجاح!`, "success");
    }
    
    // Prepare Battle
    const questions = questionBank.filter(q => comp.questionIds?.includes(q.id));
    if (questions.length === 0) {
        showToast("عذراً، لا توجد أسئلة متاحة لهذه المنافسة حالياً.", "error");
        return;
    }

    setBattleQuestions(questions);
    setTimeLeft(comp.durationMinutes * 60);
    setActiveBattle(comp);
    setCurrentQIndex(0);
    setAnswers({});
    setBattleFinished(false);
  };

  // Timer Logic
  useEffect(() => {
      if (!activeBattle || battleFinished || timeLeft <= 0) return;

      const timer = setInterval(() => {
          setTimeLeft(prev => {
              if (prev <= 1) {
                  clearInterval(timer);
                  finishBattle();
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);

      return () => clearInterval(timer);
  }, [activeBattle, battleFinished, timeLeft]);

  const handleAnswer = (optionIndex: number) => {
      if (!activeBattle) return;
      const currentQ = battleQuestions[currentQIndex];
      setAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex.toString() }));
  };

  const nextQuestion = () => {
      if (currentQIndex < battleQuestions.length - 1) {
          setCurrentQIndex(prev => prev + 1);
      } else {
          finishBattle();
      }
  };

  const finishBattle = async () => {
      if (!activeBattle || !userId) return;
      setBattleFinished(true);

      // Calculate Score
      let correctCount = 0;
      battleQuestions.forEach(q => {
          if (answers[q.id] === q.correctAnswer) {
              correctCount++;
          }
      });

      // Score Formula: (Correct Answers / Total Questions) * 100
      const score = Math.round((correctCount / battleQuestions.length) * 100);
      setFinalScore(score);

      await submitCompetitionResult(activeBattle.id, userId, score);
      showToast(`انتهت المعركة! نتيجتك: ${score}`, "success");
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // If in Battle Mode
  if (activeBattle) {
      return (
        <main className="min-h-screen bg-[#0f172a] text-[#F4E4BC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
            
            {/* Battle Header */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-[#DAA520]/20 p-3 rounded-full border border-[#DAA520]">
                        <Swords className="w-8 h-8 text-[#FFD700]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#FFD700]">{activeBattle.title}</h2>
                        <p className="text-sm opacity-60">السؤال {currentQIndex + 1} من {battleQuestions.length}</p>
                    </div>
                </div>
                <div className={cn(
                    "text-3xl font-mono font-bold px-6 py-2 rounded-xl border-2 shadow-lg flex items-center gap-3",
                    timeLeft < 60 ? "bg-[#FF6B6B]/20 border-[#FF6B6B] text-[#FF6B6B] animate-pulse" : "bg-[#000]/40 border-[#DAA520] text-[#DAA520]"
                )}>
                    <Timer className="w-6 h-6" />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Question Card */}
            <div className="w-full max-w-4xl bg-[#1e293b]/90 backdrop-blur-xl border-2 border-[#334155] rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 min-h-[400px] flex flex-col">
                {!battleFinished ? (
                    <>
                        <div className="flex-1">
                            <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 leading-relaxed">
                                {battleQuestions[currentQIndex]?.text}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {battleQuestions[currentQIndex]?.options?.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className={cn(
                                            "p-6 rounded-xl border-2 text-lg font-bold transition-all duration-200 hover:scale-[1.02]",
                                            answers[battleQuestions[currentQIndex].id] === idx.toString()
                                                ? "bg-[#DAA520] border-[#DAA520] text-[#1E120A] shadow-[0_0_20px_rgba(218,165,32,0.4)]"
                                                : "bg-[#0f172a]/50 border-[#334155] hover:border-[#DAA520]/50 hover:bg-[#DAA520]/10"
                                        )}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <GoldButton onClick={nextQuestion} className="px-12 py-3 text-lg">
                                {currentQIndex < battleQuestions.length - 1 ? "التالي" : "إنهاء المعركة"}
                                <ArrowRight className="w-5 h-5 mr-2 inline" />
                            </GoldButton>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mb-6"
                        >
                            {finalScore >= 50 ? (
                                <div className="w-32 h-32 bg-[#22c55e]/20 rounded-full flex items-center justify-center border-4 border-[#22c55e] shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                                    <Trophy className="w-16 h-16 text-[#22c55e]" />
                                </div>
                            ) : (
                                <div className="w-32 h-32 bg-[#FF6B6B]/20 rounded-full flex items-center justify-center border-4 border-[#FF6B6B] shadow-[0_0_40px_rgba(255,107,107,0.4)]">
                                    <XCircle className="w-16 h-16 text-[#FF6B6B]" />
                                </div>
                            )}
                        </motion.div>
                        
                        <h2 className="text-4xl font-bold text-[#FFD700] mb-2 font-[family-name:var(--font-amiri)]">
                            {finalScore >= 50 ? "نصر عظيم!" : "حظاً أوفر!"}
                        </h2>
                        <p className="text-[#F4E4BC]/60 text-xl mb-8">
                            لقد حققت <span className={finalScore >= 50 ? "text-[#22c55e]" : "text-[#FF6B6B]"}>{finalScore}%</span> في هذه المعركة
                        </p>

                        <div className="grid grid-cols-2 gap-8 mb-8 w-full max-w-md">
                            <div className="bg-[#000]/30 p-4 rounded-xl border border-[#334155] text-center">
                                <p className="text-[#F4E4BC]/50 text-sm">الذهب المكتسب</p>
                                <p className="text-2xl font-bold text-[#FFD700]">{finalScore > 0 ? Math.floor(finalScore / 2) : 0}</p>
                            </div>
                            <div className="bg-[#000]/30 p-4 rounded-xl border border-[#334155] text-center">
                                <p className="text-[#F4E4BC]/50 text-sm">نقاط الخبرة XP</p>
                                <p className="text-2xl font-bold text-[#4ECDC4]">{finalScore > 0 ? finalScore : 0}</p>
                            </div>
                        </div>

                        <GoldButton onClick={() => setActiveBattle(null)} className="px-12">
                            العودة للساحة
                        </GoldButton>
                    </div>
                )}
            </div>
        </main>
      );
  }

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
                    activeCompetitions.map((comp, idx) => {
                        const myParticipation = comp.participants.find(p => p.studentId === userId);
                        const isCompleted = myParticipation && myParticipation.score !== undefined; // Assuming score is set only after completion

                        return (
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

                                {isCompleted ? (
                                    <div className="bg-[#22c55e]/10 border border-[#22c55e] rounded-xl p-3 text-center">
                                        <p className="text-[#22c55e] font-bold text-sm mb-1">لقد أنهيت المعركة</p>
                                        <p className="text-[#F4E4BC] font-bold">النتيجة: {myParticipation?.score}%</p>
                                    </div>
                                ) : (
                                    <GoldButton 
                                        fullWidth 
                                        onClick={() => handleJoin(comp)}
                                        disabled={comp.status !== 'active'}
                                        className={cn(comp.status !== 'active' && "opacity-50 grayscale cursor-not-allowed")}
                                    >
                                        {comp.status === 'active' ? "انضم للمعركة" : "انتظر الإشارة"}
                                    </GoldButton>
                                )}
                            </div>
                        </motion.div>
                    )})
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
