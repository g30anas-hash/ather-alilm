"use client";

import { useState, useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import SidebarWorld from "@/components/SidebarWorld";
import MobileNav from "@/components/MobileNav";
import GoldButton from "@/components/GoldButton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lock, Star, Map, BookOpen, ChevronRight, Award, Compass, Timer, BrainCircuit, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, type MapNode, type Question } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

const generateMockQuestions = (subject: string, count: number): Question[] => {
  const subjectName = subject === 'Math' ? 'الرياضيات' : subject === 'Arabic' ? 'اللغة العربية' : subject === 'Science' ? 'العلوم' : 'المعرفة العامة';
  const createdAt = new Date().toISOString();
  return Array.from({ length: count }).map((_, i) => {
    const correctIndex = Math.floor(Math.random() * 4);
    return {
      id: `mock-${Date.now()}-${i}`,
      text: `سؤال تجريبي ${i + 1} في مادة ${subjectName}؟`,
      type: 'mcq',
      options: ["الإجابة الأولى", "الإجابة الثانية", "الإجابة الثالثة", "الإجابة الرابعة"],
      correctAnswer: correctIndex.toString(),
      subject,
      grade: 'عام',
      difficulty: 'easy',
      status: 'approved',
      authorId: 0,
      authorName: 'عقل أثير',
      createdAt
    };
  });
};

export default function KnowledgeMapsPage() {
  const router = useRouter();
  const { addQuest, addXP, addCoins, mapNodes } = useUser();
  const { showToast } = useToast();
  
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Quiz State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);

  const handleNodeClick = (node: MapNode) => {
    if (isQuizActive) return; // Prevent clicking while quiz is active
    setSelectedNode(node);
  };

  const handleStartQuest = () => {
    if (selectedNode?.status !== 'locked') {
        setIsGenerating(true);
        
        // Use custom questions if available, otherwise generate mock
        setTimeout(() => {
            setIsGenerating(false);
            
            let quizQuestions: Question[] = [];
            
            if (selectedNode?.customQuestions && selectedNode.customQuestions.length > 0) {
                // Use custom questions added by admin
                quizQuestions = selectedNode.customQuestions;
            } else {
                // Fallback to AI Generation
                quizQuestions = generateMockQuestions(selectedNode?.subject || 'General', selectedNode?.questionsCount || 5);
            }
            
            setQuestions(quizQuestions);
            setCurrentQuestionIndex(0);
            setScore(0);
            setShowResults(false);
            setIsQuizActive(true);
            setStartTime(Date.now());
            // Close the drawer
            // setSelectedNode(null); 
        }, 1500);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (optionIndex.toString() === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz Finished
      const endTime = Date.now();
      setTimeTaken(Math.floor((endTime - startTime) / 1000)); // in seconds
      setShowResults(true);
      
      // Rewards
      const passed = score >= (questions.length / 2);
      if (passed) {
          addXP(50);
          addCoins(20);
      }
    }
  };

  const closeQuiz = () => {
    setIsQuizActive(false);
    setShowResults(false);
    setSelectedNode(null);
  };

  return (
    <>
      <MobileNav />
      <PageTransition>
        <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center flex overflow-hidden relative">
           {/* Atmospheric Overlays */}
           <div className="absolute inset-0 bg-[#1E120A]/90 mix-blend-multiply z-0 pointer-events-none" />
          
          {/* Quiz Overlay */}
          <AnimatePresence>
            {isQuizActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-[#1E120A]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
              >
                {!showResults ? (
                  <div className="w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-8 text-[#F4E4BC]">
                       <div className="text-xl font-bold">السؤال {currentQuestionIndex + 1} / {questions.length}</div>
                       <div className="flex items-center gap-2 text-[#DAA520]">
                          <Timer className="w-5 h-5" />
                          <span>جاري الاحتساب...</span>
                       </div>
                    </div>

                    <div className="bg-[#2A1B0E] border border-[#5D4037] rounded-2xl p-8 mb-8 shadow-2xl">
                       <h2 className="text-2xl md:text-3xl font-bold text-[#F4E4BC] text-center font-[family-name:var(--font-amiri)] leading-relaxed">
                          {questions[currentQuestionIndex]?.text}
                       </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {questions[currentQuestionIndex]?.options?.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className="bg-[#000]/40 hover:bg-[#DAA520]/20 border border-[#5D4037] hover:border-[#DAA520] text-[#F4E4BC] p-6 rounded-xl text-lg transition-all duration-200 text-right font-[family-name:var(--font-cairo)]"
                          >
                             {option}
                          </button>
                       ))}
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#2A1B0E] border border-[#DAA520] rounded-2xl p-8 md:p-12 max-w-lg w-full text-center shadow-[0_0_50px_rgba(218,165,32,0.2)]"
                  >
                     <div className="w-24 h-24 mx-auto bg-[#DAA520]/20 rounded-full flex items-center justify-center mb-6 border-2 border-[#DAA520]">
                        <Award className="w-12 h-12 text-[#FFD700]" />
                     </div>
                     
                     <h2 className="text-4xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] mb-2">
                        {score >= (questions.length / 2) ? "أحسنت يا بطل!" : "حاول مرة أخرى"}
                     </h2>
                     <p className="text-[#F4E4BC]/60 mb-8">
                        {score >= (questions.length / 2) ? "لقد أتممت التحدي بنجاح" : "لا تيأس، النجاح يأتي بالمحاولة"}
                     </p>

                     <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037]">
                           <div className="text-[#F4E4BC]/50 text-sm mb-1">النتيجة النهائية</div>
                           <div className="text-3xl font-bold text-[#4ECDC4]">{score} / {questions.length}</div>
                        </div>
                        <div className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037]">
                           <div className="text-[#F4E4BC]/50 text-sm mb-1">الوقت المستغرق</div>
                           <div className="text-3xl font-bold text-[#FFD700]">{timeTaken} ث</div>
                        </div>
                     </div>

                     <div className="bg-[#DAA520]/10 p-4 rounded-xl border border-[#DAA520]/30 mb-8">
                        <div className="flex items-center justify-center gap-2 text-[#F4E4BC] mb-2">
                           <Timer className="w-4 h-4 text-[#DAA520]" />
                           <span>سرعة الإنجاز</span>
                        </div>
                        <p className="text-[#F4E4BC]/80 text-sm">
                           أنت أسرع من <span className="text-[#4ECDC4] font-bold">85%</span> من المغامرين الآخرين!
                        </p>
                     </div>

                     <GoldButton fullWidth onClick={closeQuiz} className="text-xl py-4">
                        العودة للخريطة
                     </GoldButton>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <div className="relative z-20 hidden md:block h-screen">
            <SidebarWorld />
          </div>

          <div className="flex-1 relative overflow-hidden">
            {/* Map Background - Interactive Area */}
            <div className="absolute inset-0 bg-[#150c05] overflow-auto custom-scrollbar">
                {/* Background Image/Texture */}
                <div 
                    className="min-w-[150%] min-h-[150%] relative bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center"
                    style={{ filter: "sepia(0.6) brightness(0.6) contrast(1.2)" }}
                >
                    {/* Connection Lines (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <path 
                            d="M 10% 80% Q 20% 70% 30% 60% T 50% 40% T 80% 20%" 
                            fill="none" 
                            stroke="#DAA520" 
                            strokeWidth="4" 
                            strokeDasharray="10 5"
                            className="opacity-50"
                        />
                    </svg>

                    {/* Nodes */}
                    {mapNodes.map((node) => (
                        <motion.div
                            key={node.id}
                            className="absolute z-10"
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button
                                onClick={() => handleNodeClick(node)}
                                className={cn(
                                    "relative w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300",
                                    node.status === 'completed' ? "bg-[#DAA520] border-[#FFD700]" :
                                    node.status === 'unlocked' ? "bg-[#4ECDC4] border-[#2ECC71] animate-pulse" :
                                    "bg-[#2A1B0E] border-[#5D4037] grayscale"
                                )}
                            >
                                {node.status === 'locked' ? (
                                    <Lock className="w-8 h-8 text-[#F4E4BC]/50" />
                                ) : (
                                    <span className="text-2xl md:text-4xl">
                                        {node.type === 'island' ? '🏝️' : 
                                         node.type === 'forest' ? '🌲' : 
                                         node.type === 'cave' ? '🏔️' : '🏰'}
                                    </span>
                                )}
                                
                                {/* Stars Badge */}
                                {node.stars !== undefined && (
                                    <div className="absolute -bottom-2 flex gap-0.5 bg-black/50 rounded-full px-2 py-0.5 border border-[#DAA520]">
                                        {[1, 2, 3].map((star) => (
                                            <Star 
                                                key={star} 
                                                className={cn(
                                                    "w-3 h-3 md:w-4 md:h-4", 
                                                    star <= node.stars! ? "text-[#FFD700] fill-[#FFD700]" : "text-gray-500"
                                                )} 
                                            />
                                        ))}
                                    </div>
                                )}
                            </button>
                            <p className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/70 text-[#F4E4BC] text-xs md:text-sm px-3 py-1 rounded-full whitespace-nowrap border border-[#DAA520]/30 font-[family-name:var(--font-cairo)]">
                                {node.title}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* UI Overlay */}
            <div className="absolute top-0 left-0 w-full p-4 z-20 pointer-events-none">
                <div className="flex justify-between items-start">
                    <div className="pointer-events-auto bg-[#2A1B0E]/90 border border-[#DAA520] p-4 rounded-xl backdrop-blur-sm">
                        <h1 className="text-2xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] flex items-center gap-2">
                            <Compass className="w-6 h-6 animate-spin-slow" />
                            خرائط المعرفة
                        </h1>
                        <p className="text-[#F4E4BC]/60 text-sm">استكشف عوالم اللغة العربية</p>
                    </div>
                </div>
            </div>

            {/* Selected Node Drawer */}
            <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: selectedNode ? 0 : "100%" }}
                transition={{ type: "spring", damping: 25 }}
                className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-[#2A1B0E]/95 border-l-4 border-[#DAA520] z-30 p-6 shadow-2xl backdrop-blur-md overflow-y-auto"
            >
                {selectedNode && (
                    <div className="h-full flex flex-col">
                        <button 
                            onClick={() => setSelectedNode(null)}
                            className="absolute top-4 left-4 p-2 text-[#F4E4BC] hover:text-[#FFD700] transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        <div className="mt-8 text-center">
                            <div className="w-24 h-24 mx-auto bg-[#DAA520]/20 rounded-full flex items-center justify-center border-2 border-[#DAA520] mb-4 text-5xl">
                                {selectedNode.type === 'island' ? '🏝️' : 
                                 selectedNode.type === 'forest' ? '🌲' : 
                                 selectedNode.type === 'cave' ? '🏔️' : '🏰'}
                            </div>
                            <h2 className="text-3xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] mb-2">
                                {selectedNode.title}
                            </h2>
                            <p className="text-[#F4E4BC] text-lg font-[family-name:var(--font-scheherazade)]">
                                {selectedNode.description}
                            </p>
                        </div>

                        <div className="my-8 space-y-4">
                            <div className="bg-[#000]/30 p-4 rounded-lg border border-[#5D4037] flex items-center justify-between">
                                <span className="text-[#F4E4BC]/70">المستوى المطلوب</span>
                                <span className="text-[#DAA520] font-bold">{selectedNode.levelReq}</span>
                            </div>
                            
                            {selectedNode.timeLimit && (
                                <div className="bg-[#000]/30 p-4 rounded-lg border border-[#5D4037] flex items-center justify-between">
                                    <span className="text-[#F4E4BC]/70 flex items-center gap-2"><Timer className="w-4 h-4" /> الوقت المحدد</span>
                                    <span className="text-[#4ECDC4] font-bold">{selectedNode.timeLimit} دقيقة</span>
                                </div>
                            )}

                            {selectedNode.questionsCount && (
                                <div className="bg-[#000]/30 p-4 rounded-lg border border-[#5D4037] flex items-center justify-between">
                                    <span className="text-[#F4E4BC]/70 flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> عدد الأسئلة</span>
                                    <span className="text-[#FFD700] font-bold">{selectedNode.questionsCount} سؤال</span>
                                </div>
                            )}

                            <div className="bg-[#000]/30 p-4 rounded-lg border border-[#5D4037] flex items-center justify-between">
                                <span className="text-[#F4E4BC]/70">الحالة</span>
                                <span className={cn(
                                    "font-bold px-2 py-1 rounded text-sm",
                                    selectedNode.status === 'completed' ? "bg-[#DAA520]/20 text-[#DAA520]" :
                                    selectedNode.status === 'unlocked' ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" :
                                    "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                                )}>
                                    {selectedNode.status === 'completed' ? "مكتمل" :
                                     selectedNode.status === 'unlocked' ? "متاح" : "مغلق"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <GoldButton 
                                fullWidth 
                                disabled={selectedNode.status === 'locked' || isGenerating}
                                onClick={handleStartQuest}
                                className={cn(
                                    "py-4 text-xl",
                                    selectedNode.status === 'locked' && "opacity-50 grayscale cursor-not-allowed",
                                    isGenerating && "opacity-80 cursor-wait"
                                )}
                            >
                                {isGenerating ? (
                                    <span className="flex items-center justify-center gap-2 animate-pulse">
                                        <BrainCircuit className="w-5 h-5 animate-spin" /> جاري توليد الأسئلة...
                                    </span>
                                ) : selectedNode.status === 'locked' ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Lock className="w-5 h-5" /> مغلق
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Play className="w-5 h-5" /> ابدأ التحدي
                                    </span>
                                )}
                            </GoldButton>
                        </div>
                    </div>
                )}
            </motion.div>

          </div>
        </main>
      </PageTransition>
    </>
  );
}
