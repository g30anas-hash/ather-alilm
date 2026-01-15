"use client";

import { useState, useEffect, Suspense } from "react";
import GameCard from "@/components/GameCard";
import GoldButton from "@/components/GoldButton";
import SidebarWorld from "@/components/SidebarWorld";
import { 
  BookOpen, 
  Users, 
  FileText, 
  CheckSquare, 
  Plus, 
  MessageCircle, 
  X, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Bell, 
  Bot, 
  Calendar, 
  PieChart,
  TrendingUp,
  AlertCircle,
  Clock,
  LayoutDashboard,
  LogOut,
  Sword,
  Coins,
  Upload,
  Star,
  ShieldAlert,
  Scale,
  CheckCircle2,
  Mail,
  Smartphone,
  Brain,
  Image as ImageIcon,
  Crown,
  ScrollText,
  Trophy,
  Swords
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import MobileNav from "@/components/MobileNav";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import ProfileModal from "@/components/ProfileModal";
import NotificationCenter from "@/components/NotificationCenter";
import { useRouter, useSearchParams } from "next/navigation";
import AtherMind from "@/components/AtherMind";
import FantasyModal from "@/components/FantasyModal";

// --- Helper Components ---

const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2">
    <Info className="w-4 h-4 text-[#F4E4BC]/60 hover:text-[#DAA520] cursor-help" />
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-black/90 border border-[#DAA520] rounded text-xs text-[#F4E4BC] text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#DAA520]" />
    </div>
  </div>
);

const CollapsibleSection = ({ title, children, defaultOpen = false, icon }: { title: string, children: React.ReactNode, defaultOpen?: boolean, icon?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#5D4037] rounded-lg overflow-hidden bg-[#000]/20 mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#2A1B0E]/50 hover:bg-[#2A1B0E] transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-[#DAA520]">{icon}</span>}
          <h3 className="text-lg font-bold text-[#F4E4BC] font-[family-name:var(--font-cairo)]">{title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-[#DAA520]" /> : <ChevronDown className="w-5 h-5 text-[#F4E4BC]/50" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-t border-[#5D4037]/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function TeacherHallPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState(searchParams?.get('view') || 'overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBehaviorModal, setShowBehaviorModal] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<any>(null);
  const [activeMessageTab, setActiveMessageTab] = useState<'all' | 'students' | 'parents' | 'admin' | 'broadcasts'>('all');
  const { id, name, submissions, gradeQuest, allUsers, classes, logout, addQuest, role, acceptedQuests, acceptQuest, addCoins, submitQuest, quests, addBehaviorRequest, supportMessages, markSupportMessageAsRead, addToSchedule, addToWeeklyPlan, schedule, weeklyPlan, addQuestion, questionBank, behaviorRecords, broadcasts, addLesson, lessons, addCompetition } = useUser();
  const { showToast } = useToast();
  const [currentDate, setCurrentDate] = useState("");

  // Student specific state
  const [selectedQuestForSubmit, setSelectedQuestForSubmit] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null); // For teacher messages
  const [answerText, setAnswerText] = useState("");

  // Teacher Planning State
  const [planForm, setPlanForm] = useState({
      type: 'schedule' as 'schedule' | 'plan',
      day: 'الأحد',
      time: '08:00',
      subject: '',
      title: '',
      description: '',
      isRemote: false,
      meetingUrl: '',
      duration: 45,
      classId: ''
  });
  const [showPlanModal, setShowPlanModal] = useState(false);

  // Smart Lesson Chronicle State
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonForm, setLessonForm] = useState({
      classId: "",
      subject: "",
      summary: "",
      imageUrl: "",
      questions: [] as { text: string, type: 'mcq' | 'true_false' | 'image_question', options: string[], correctAnswer: string }[]
  });
  const [lessonAttendance, setLessonAttendance] = useState<{id: number, name: string, present: boolean}[]>([]);

  useEffect(() => {
      if (lessonForm.classId) {
          const classStudents = allUsers.filter(u => u.role === 'student' && u.classId === lessonForm.classId);
          setLessonAttendance(classStudents.map(s => ({ id: s.id, name: s.name, present: true })));
      } else {
          setLessonAttendance([]);
      }
  }, [lessonForm.classId, allUsers]);

  // Temp state for adding questions inside lesson form
  const [currentLessonQuestion, setCurrentLessonQuestion] = useState({
      text: "",
      type: 'mcq' as 'mcq' | 'true_false' | 'image_question',
      options: ["", "", "", ""],
      correctAnswer: "0"
  });

  const [behaviorForm, setBehaviorForm] = useState({
      studentId: 0,
      studentName: "",
      type: 'positive' as 'positive' | 'negative',
      category: "",
      reason: "",
      amount: 10 // Default Gold/XP amount
  });

  const [questForm, setQuestForm] = useState({
      title: "",
      description: "",
      classId: "",
      dueDate: "",
      gold: 100,
      xp: 50
  });

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionForm, setQuestionForm] = useState<{
      text: string;
      type: 'mcq' | 'true_false' | 'image_question';
      options: string[];
      correctAnswer: string;
      imageUrl: string;
      subject: string;
      grade: string;
      difficulty: 'easy' | 'medium' | 'hard';
  }>({
      text: "",
      type: 'mcq',
      options: ["", "", "", ""],
      correctAnswer: "0",
      imageUrl: "",
      subject: "",
      grade: "",
      difficulty: "medium"
  });

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  useEffect(() => {
    const view = searchParams?.get('view');
    if (view) {
      setActiveView(view);
    }
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Derived Data
  const currentTeacher = allUsers.find(u => u.name === name && u.role === 'teacher') || allUsers.find(u => u.role === 'teacher');
  const teacherClassesIds = currentTeacher?.assignedClasses || [];
  const teacherClasses = classes.filter(c => teacherClassesIds.includes(c.id));
  
  // Get students belonging to these classes
  const myStudents = allUsers.filter(u => u.role === 'student' && u.classId && teacherClassesIds.includes(u.classId));

  const [showCompetitionModal, setShowCompetitionModal] = useState(false);
  const [competitionForm, setCompetitionForm] = useState({
      title: "",
      description: "",
      subject: "",
      grade: "",
      startTime: "",
      durationMinutes: 30,
      rewardGold: 100,
      rewardXP: 200
  });

  const handleCreateCompetition = (e: React.FormEvent) => {
      e.preventDefault();
      addCompetition({
          title: competitionForm.title,
          description: competitionForm.description,
          subject: competitionForm.subject,
          grade: competitionForm.grade,
          startTime: competitionForm.startTime || new Date().toISOString(),
          durationMinutes: Number(competitionForm.durationMinutes),
          status: 'active', // Default to active for now
          questionIds: [], // In real app, select questions
          rewards: {
              gold: Number(competitionForm.rewardGold),
              xp: Number(competitionForm.rewardXP)
          },
          createdBy: id || 0
      });
      showToast("تم إطلاق المنافسة بنجاح! ساحة المعركة جاهزة.", "success");
      setShowCompetitionModal(false);
      setCompetitionForm({
          title: "",
          description: "",
          subject: "",
          grade: "",
          startTime: "",
          durationMinutes: 30,
          rewardGold: 100,
          rewardXP: 200
      });
  };

  const handleAction = (action: string) => {
    if (action === "إنشاء مهمة جديدة") {
        setShowCreateModal(true);
    } else if (action === "إنشاء منافسة") {
        setShowCompetitionModal(true);
    } else {
        showToast(`ميزة "${action}" قيد التطوير حالياً`, "info");
    }
  };

  const handleAccept = (id: number, cost: number) => {
    if (acceptedQuests.includes(id)) {
        setSelectedQuestForSubmit(id);
        return;
    }
    
    acceptQuest(id);
    const bonus = Math.floor(cost * 0.1);
    addCoins(bonus);
    showToast(`تم قبول المهمة! حصلت على ${bonus} عملة كمقدم`, 'success');
  };

  const handleSubmitQuest = (e: React.FormEvent) => {
      e.preventDefault();
      
      const quest = quests.find(q => q.id === selectedQuestForSubmit);
      if (quest && selectedQuestForSubmit) {
          submitQuest({
              questId: quest.id,
              questTitle: quest.title,
              answer: answerText
          });
          showToast("تم تسليم المهمة بنجاح! سيتم مراجعتها من قبل المعلم.", "success");
      }
      
      setSelectedQuestForSubmit(null);
      setAnswerText("");
  };

  const handleSubmitBehavior = (e: React.FormEvent) => {
      e.preventDefault();
      const teacher = allUsers.find(u => u.role === 'teacher' && u.name === name);
      addBehaviorRequest({
          studentId: behaviorForm.studentId,
          studentName: behaviorForm.studentName,
          teacherId: teacher?.id || 0,
          teacherName: name,
          type: behaviorForm.type,
          category: behaviorForm.category,
          reason: behaviorForm.reason,
          goldAmount: behaviorForm.amount,
          xpAmount: behaviorForm.type === 'positive' ? behaviorForm.amount * 2 : 0
      });
      showToast(behaviorForm.type === 'positive' ? "تم إرسال التعزيز بنجاح" : "تم تسجيل الملاحظة السلوكية", behaviorForm.type === 'positive' ? "success" : "info");
      setShowBehaviorModal(false);
  };

  const handleAddLessonQuestion = () => {
      if (!currentLessonQuestion.text) {
          showToast("الرجاء كتابة نص السؤال", "error");
          return;
      }
      setLessonForm({
          ...lessonForm,
          questions: [...lessonForm.questions, { ...currentLessonQuestion }]
      });
      setCurrentLessonQuestion({
          text: "",
          type: 'mcq',
          options: ["", "", "", ""],
          correctAnswer: "0"
      });
      showToast("تم إضافة السؤال للحصة", "success");
  };

  const handleCreateLesson = (e: React.FormEvent) => {
      e.preventDefault();
      if (!lessonForm.classId || !lessonForm.subject || !lessonForm.summary) {
          showToast("الرجاء تعبئة جميع الحقول المطلوبة", "error");
          return;
      }

      const selectedClass = classes.find(c => c.id === lessonForm.classId);
      const attendees = lessonAttendance.filter(s => s.present).map(s => s.id);
      
      addLesson({
          classId: lessonForm.classId,
          className: selectedClass?.name || "",
          subject: lessonForm.subject,
          date: new Date().toISOString(),
          summary: lessonForm.summary,
          imageUrl: lessonForm.imageUrl,
          attendees: attendees,
          questions: lessonForm.questions.map(q => ({
              ...q,
              id: Date.now().toString() + Math.random().toString(),
              status: 'approved', // Auto-approved as it's part of lesson
              subject: lessonForm.subject,
              grade: selectedClass?.grade || "",
              difficulty: 'medium',
              authorId: currentTeacher?.id || 0,
              authorName: name,
              createdAt: new Date().toISOString()
          })) as any
      });

      setShowLessonModal(false);
      setLessonForm({
          classId: "",
          subject: "",
          summary: "",
          imageUrl: "",
          questions: []
      });
      showToast("تم توثيق الحصة وإنشاء التحديات بنجاح! +20 XP", "success");
  };

  if (role === 'student') {
    const visibleQuests = quests.filter(q => q.status === 'approved' || q.status === undefined);

    return (
      <>
        <MobileNav />
        <PageTransition>
          <main className="min-h-screen bg-[#0a192f] flex overflow-hidden">
            {/* Sidebar */}
            <div className="relative z-20 hidden md:block h-screen">
              <SidebarWorld />
            </div>

            <div className="flex-1 relative overflow-hidden flex flex-col p-8">
               {/* Header */}
               <header className="flex flex-col items-center mb-12 relative z-10">
                  <div className="absolute inset-0 bg-[#DAA520]/5 blur-3xl rounded-full transform -translate-y-1/2 pointer-events-none" />
                  <h1 className="text-5xl text-[#FFD700] font-[family-name:var(--font-amiri)] drop-shadow-lg mb-2 flex items-center gap-4">
                    <Sword className="w-12 h-12" />
                    تحديات الرحلة
                  </h1>
                  <h2 className="text-2xl text-[#DAA520] font-[family-name:var(--font-scheherazade)] font-bold tracking-widest">
                    تكليفات المعلم
                  </h2>
                  <p className="text-[#F4E4BC]/60 mt-4 text-lg">هنا تجد المهام والواجبات التي كلفك بها المعلمون</p>
               </header>

               {/* Quests Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto pb-20 custom-scrollbar pr-4">
                  {visibleQuests.length === 0 ? (
                      <div className="col-span-full text-center py-20">
                          <CheckSquare className="w-24 h-24 mx-auto text-[#F4E4BC]/20 mb-4" />
                          <p className="text-[#F4E4BC]/50 text-xl">لا توجد مهام جديدة حالياً، استرح أيها البطل!</p>
                      </div>
                  ) : (
                      visibleQuests.map((quest, idx) => {
                        const isAccepted = acceptedQuests.includes(quest.id);
                        
                        return (
                          <motion.div
                            key={quest.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <GameCard className={cn(
                              "p-0 h-full group transition-all duration-300 relative overflow-hidden border-2",
                              isAccepted ? "bg-[#1A2F1A] border-[#4ECDC4]" : "bg-[#2A1B0E] border-[#5D4037] hover:border-[#DAA520] hover:-translate-y-2"
                            )}>
                              <div className="relative h-48 w-full border-b-2 border-[#5D4037]">
                                <div className={cn(
                                  "absolute inset-0 bg-cover bg-center transition-transform duration-700",
                                  isAccepted ? "grayscale" : "group-hover:scale-110"
                                )} style={{ backgroundImage: `url('${quest.image}')` }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B0E] to-transparent" />
                                
                                <div className="absolute top-4 right-4 bg-[#000]/60 backdrop-blur-sm px-3 py-1 rounded-full border border-[#DAA520] flex items-center gap-2">
                                  <Coins className="w-4 h-4 text-[#FFD700]" />
                                  <span className="text-[#FFD700] font-bold">{quest.cost}</span>
                                </div>

                                {isAccepted && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                    <div className="bg-[#4ECDC4]/20 border-2 border-[#4ECDC4] p-4 rounded-full">
                                      <CheckCircle2 className="w-12 h-12 text-[#4ECDC4]" />
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="p-6 text-center relative flex flex-col h-[calc(100%-12rem)]">
                                <h3 className={cn(
                                  "text-2xl font-[family-name:var(--font-amiri)] mb-2 transition-colors",
                                  isAccepted ? "text-[#4ECDC4]" : "text-[#F4E4BC] group-hover:text-[#FFD700]"
                                )}>
                                  {quest.title}
                                </h3>
                                <p className="text-[#F4E4BC]/60 font-[family-name:var(--font-cairo)] mb-6 text-sm flex-1">
                                  {quest.subtitle}
                                </p>

                                <GoldButton 
                                  fullWidth 
                                  className={cn("text-lg mt-auto", isAccepted && "bg-[#4ECDC4] border-[#4ECDC4] text-[#0a192f] hover:bg-[#4ECDC4]/80")}
                                  onClick={() => handleAccept(quest.id, quest.cost)}
                                  variant={isAccepted ? "secondary" : "primary"}
                                >
                                  {isAccepted ? "تسليم المهمة" : "قبول المهمة"}
                                </GoldButton>
                              </div>
                            </GameCard>
                          </motion.div>
                        );
                      })
                  )}
               </div>
            </div>
          </main>
        </PageTransition>

        {/* Submit Quest Modal */}
        <AnimatePresence>
            {selectedQuestForSubmit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  onClick={() => setSelectedQuestForSubmit(null)}
                />
                
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative z-50 bg-[#2A1B0E] border-2 border-[#4ECDC4] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
                >
                   <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                      <h2 className="text-2xl text-[#4ECDC4] font-[family-name:var(--font-amiri)]">تسليم المهمة</h2>
                      <button onClick={() => setSelectedQuestForSubmit(null)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                          <X className="w-6 h-6" />
                      </button>
                   </div>

                   <form onSubmit={handleSubmitQuest} className="space-y-4">
                      <div className="bg-[#4ECDC4]/10 p-4 rounded-lg border border-[#4ECDC4]/30 mb-4">
                          <p className="text-[#F4E4BC] text-sm">أرفق الحل أو اكتب الإجابة أدناه ليتم مراجعتها من قبل معلمك.</p>
                      </div>

                      <div>
                          <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">نص الإجابة</label>
                          <textarea 
                              rows={4} 
                              value={answerText}
                              onChange={(e) => setAnswerText(e.target.value)}
                              className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#4ECDC4] outline-none" 
                              placeholder="اكتب إجابتك هنا..."
                              required
                          ></textarea>
                      </div>

                      <div>
                          <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">المرفقات (اختياري)</label>
                          <div className="border-2 border-dashed border-[#5D4037] rounded-lg p-6 text-center hover:border-[#4ECDC4] transition-colors cursor-pointer">
                              <Upload className="w-8 h-8 text-[#F4E4BC]/50 mx-auto mb-2" />
                              <p className="text-[#F4E4BC]/50 text-sm">اضغط لرفع ملف (صورة، PDF)</p>
                          </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                          <button type="button" onClick={() => setSelectedQuestForSubmit(null)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                          <GoldButton type="submit" className="px-8 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-[#0a192f]">
                               إرسال للتقييم
                          </GoldButton>
                      </div>
                   </form>
                </motion.div>
              </div>
            )}
        </AnimatePresence>
      </>
    );
  }

  const handleSubmitPlan = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (planForm.type === 'schedule') {
          addToSchedule({
              day: planForm.day,
              time: planForm.time,
              subject: planForm.subject,
              type: planForm.isRemote ? 'remote' : 'in-person',
              duration: planForm.duration,
              meetingUrl: planForm.meetingUrl
          });
          showToast("تمت إضافة الحصة إلى الجدول", "success");
      } else {
          addToWeeklyPlan({
              day: planForm.day,
              title: planForm.title,
              description: planForm.description,
              type: 'lesson',
              isRemote: planForm.isRemote
          });
          showToast("تمت إضافة العنصر للخطة الأسبوعية", "success");
      }
      setShowPlanModal(false);
  };

  const handleCreateQuest = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newQuest = {
          id: Date.now(),
          title: questForm.title,
          description: questForm.description,
          subtitle: questForm.description || "مهمة دراسية جديدة",
          cost: Number(questForm.gold),
          image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2573&auto=format&fit=crop", // Default education image
          type: "normal"
      };

      addQuest(newQuest);
      setShowCreateModal(false);
      setQuestForm({ title: "", description: "", classId: "", dueDate: "", gold: 100, xp: 50 });
      showToast("تم إنشاء المهمة بنجاح! سيتم مراجعتها من قبل الإدارة قبل النشر.", "info");
  };

  const handleGrade = (id: string, status: 'approved' | 'rejected') => {
      gradeQuest(id, status);
      showToast(status === 'approved' ? "تم قبول المهمة ومنح المكافأة" : "تم رفض المهمة", status === 'approved' ? "success" : "info");
  };

  const handleAddQuestion = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentTeacher) return;
      
      addQuestion({
          text: questionForm.text,
          type: questionForm.type,
          options: questionForm.type === 'mcq' ? questionForm.options : undefined,
          correctAnswer: questionForm.correctAnswer,
          imageUrl: questionForm.imageUrl || undefined,
          subject: questionForm.subject,
          grade: questionForm.grade,
          difficulty: questionForm.difficulty,
          authorId: currentTeacher.id,
      });
      
      setShowQuestionModal(false);
      showToast("تم إرسال السؤال للاعتماد بنجاح", "success");
      setQuestionForm({
          text: "",
          type: 'mcq',
          options: ["", "", "", ""],
          correctAnswer: "0",
          imageUrl: "",
          subject: "",
          grade: "",
          difficulty: "medium"
      });
  };

  const navItems = [
    { id: 'overview', icon: <LayoutDashboard />, label: "قاعة العرش" },
    { id: 'lessons', icon: <ScrollText />, label: "سجل الحصة" },
    { id: 'planning', icon: <Calendar />, label: "تخطيط الزمن" },
    { id: 'questions', icon: <Brain />, label: "بنك الأسئلة" },
    { id: 'classes', icon: <BookOpen />, label: "كتائب الفرسان" },
    { id: 'tasks', icon: <CheckSquare />, label: "خرائط المهام" },
    { id: 'grading', icon: <FileText />, label: "ميزان العدل" },
    { id: 'behavior', icon: <Scale />, label: "ميزان السلوك" },
    { id: 'students', icon: <Users />, label: "الأبطال" },
    { id: 'reports', icon: <PieChart />, label: "كرة العراف" },
    { id: 'messages', icon: <MessageCircle />, label: "الحمام الزاجل" },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'leaderboard':
        const teachers = allUsers.filter(u => u.role === 'teacher').sort((a, b) => (b.xp || 0) - (a.xp || 0));
        const topTeacher = teachers[0];
        
        return (
            <div className="space-y-8">
                {/* Header Section */}
                <div className="text-center mb-8 relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#DAA520]/20 rounded-full blur-3xl -z-10" />
                     <h2 className="text-4xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                         لوحة شرف المعلمين
                     </h2>
                     <p className="text-[#F4E4BC]/70 max-w-2xl mx-auto text-lg">
                         هنا يتم تكريم فرسان العلم والمعرفة، الأكثر عطاءً وتأثيراً في بناء جيل المستقبل
                     </p>
                </div>

                {/* Top Teacher Card */}
                {topTeacher && (
                    <div className="bg-gradient-to-b from-[#DAA520]/20 to-[#2A1B0E]/80 border-2 border-[#DAA520] rounded-2xl p-8 relative overflow-hidden text-center max-w-3xl mx-auto shadow-[0_0_50px_rgba(218,165,32,0.3)]">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent animate-pulse" />
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#DAA520]/20 rounded-full blur-2xl" />
                        
                        <div className="relative inline-block mb-6">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl animate-bounce">👑</div>
                            <div className="w-32 h-32 rounded-full border-4 border-[#FFD700] p-1 bg-[#2A1B0E] relative z-10 shadow-xl">
                                <div className="w-full h-full rounded-full bg-[#DAA520] flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')] bg-cover bg-center" />
                                </div>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#FFD700] text-[#1E120A] px-6 py-1 rounded-full font-bold shadow-lg whitespace-nowrap border-2 border-[#1E120A]">
                                معلم الشهر المميز
                            </div>
                        </div>

                        <h3 className="text-3xl text-[#FFD700] font-bold font-[family-name:var(--font-amiri)] mb-2">
                            {topTeacher.name}
                        </h3>
                        <p className="text-[#F4E4BC] text-lg mb-6">{topTeacher.subject || "معلم عام"}</p>

                        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto bg-[#000]/30 rounded-xl p-4 border border-[#DAA520]/30">
                            <div className="text-center">
                                <div className="text-[#FFD700] font-bold text-2xl">{topTeacher.xp || 0}</div>
                                <div className="text-[#F4E4BC]/50 text-xs">نقاط الخبرة</div>
                            </div>
                            <div className="text-center border-x border-[#DAA520]/20">
                                <div className="text-[#4ECDC4] font-bold text-2xl">{topTeacher.level || 1}</div>
                                <div className="text-[#F4E4BC]/50 text-xs">المستوى</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[#FF6B6B] font-bold text-2xl">{topTeacher.coins || 0}</div>
                                <div className="text-[#F4E4BC]/50 text-xs">عملة ذهبية</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Table */}
                <div className="bg-[#2A1B0E]/60 rounded-2xl border border-[#5D4037] overflow-hidden">
                    <div className="p-6 border-b border-[#5D4037] flex justify-between items-center bg-[#000]/20">
                        <h3 className="text-xl text-[#F4E4BC] font-bold flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-[#DAA520]" />
                            ترتيب المعلمين
                        </h3>
                        <div className="text-sm text-[#F4E4BC]/50">يتم تحديث النقاط تلقائياً بناءً على التفاعل</div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#000]/30 text-[#F4E4BC]/60 text-sm">
                                <tr>
                                    <th className="py-4 px-6 text-right">#</th>
                                    <th className="py-4 px-6 text-right">المعلم</th>
                                    <th className="py-4 px-6 text-center">المستوى</th>
                                    <th className="py-4 px-6 text-center">نقاط التفاعل (XP)</th>
                                    <th className="py-4 px-6 text-center">الذهب المجمع</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#5D4037]/30">
                                {teachers.map((teacher, index) => (
                                    <tr key={teacher.id} className={cn(
                                        "hover:bg-[#DAA520]/5 transition-colors",
                                        teacher.name === name ? "bg-[#DAA520]/10" : ""
                                    )}>
                                        <td className="py-4 px-6">
                                            {index === 0 ? <span className="text-2xl">🥇</span> :
                                             index === 1 ? <span className="text-2xl">🥈</span> :
                                             index === 2 ? <span className="text-2xl">🥉</span> :
                                             <span className="font-bold text-[#F4E4BC]/50 w-8 inline-block text-center">{index + 1}</span>}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#DAA520]/20 flex items-center justify-center border border-[#DAA520]/50 text-[#DAA520] font-bold">
                                                    {teacher.name[0]}
                                                </div>
                                                <div>
                                                    <div className={cn("font-bold", teacher.name === name ? "text-[#FFD700]" : "text-[#F4E4BC]")}>
                                                        {teacher.name} {teacher.name === name && "(أنت)"}
                                                    </div>
                                                    <div className="text-xs text-[#F4E4BC]/50">{teacher.subject || "معلم"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="bg-[#4ECDC4]/10 text-[#4ECDC4] px-3 py-1 rounded-full text-xs font-bold border border-[#4ECDC4]/20">
                                                Lv. {teacher.level || 1}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-[#F4E4BC]">{teacher.xp || 0}</td>
                                        <td className="py-4 px-6 text-center text-[#FFD700] font-bold">{teacher.coins || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

      case 'overview':
        return (
          <div className="space-y-6">
             {/* Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "إجمالي الطلاب", value: 75, icon: <Users className="text-[#4ECDC4]" />, change: "+2" },
                  { label: "المهام النشطة", value: 3, icon: <CheckSquare className="text-[#FFD700]" />, change: "0" },
                  { label: "بانتظار التصحيح", value: submissions.filter(s => s.status === 'pending').length, icon: <FileText className="text-[#FF6B6B]" />, change: "جديد" },
                  { label: "متوسط الدرجات", value: "88%", icon: <TrendingUp className="text-[#DAA520]" />, change: "+1.5%" },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037] flex flex-col relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 bg-[#DAA520]/5 w-24 h-24 rounded-full" />
                    <div className="flex justify-between items-start mb-2 relative z-10">
                       <h3 className="text-[#F4E4BC]/70 text-sm font-[family-name:var(--font-cairo)]">{stat.label}</h3>
                       {stat.icon}
                    </div>
                    <div className="flex items-end gap-2 relative z-10">
                       <span className="text-3xl font-bold text-[#F4E4BC]">{stat.value}</span>
                       <span className="text-xs text-[#4ECDC4] bg-[#4ECDC4]/10 px-1 rounded">{stat.change}</span>
                    </div>
                  </div>
                ))}
             </div>

             {/* Schedule & Activity */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                   <CollapsibleSection title="الجدول الدراسي اليوم" defaultOpen={true} icon={<Calendar className="w-5 h-5" />}>
                      <div className="space-y-3">
                         {[
                           { time: "08:00 ص", subject: "رياضيات - الصف الأول أ", room: "قاعة الخوارزمي", status: "تم" },
                           { time: "09:30 ص", subject: "رياضيات - الصف الثاني ب", room: "قاعة ابن سينا", status: "جاري" },
                           { time: "11:00 ص", subject: "ساعة مكتبية", room: "مكتب المعلمين", status: "قادم" },
                         ].map((item, i) => (
                           <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-[#5D4037] bg-[#2A1B0E]/30">
                              <div className="bg-[#DAA520]/20 p-2 rounded text-[#DAA520] font-bold text-sm w-16 text-center">
                                {item.time}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-[#F4E4BC] font-bold font-[family-name:var(--font-amiri)]">{item.subject}</h4>
                                <p className="text-[#F4E4BC]/60 text-xs flex items-center gap-1">
                                  <Users className="w-3 h-3" /> {item.room}
                                </p>
                              </div>
                              <span className={cn(
                                "text-xs px-2 py-1 rounded",
                                item.status === "تم" ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" :
                                item.status === "جاري" ? "bg-[#FFD700]/20 text-[#FFD700] animate-pulse" :
                                "bg-[#F4E4BC]/20 text-[#F4E4BC]"
                              )}>{item.status}</span>
                           </div>
                         ))}
                      </div>
                   </CollapsibleSection>
                </div>

                <div>
                   <CollapsibleSection title="تنبيهات سريعة" defaultOpen={true} icon={<Bell className="w-5 h-5" />}>
                      <ul className="space-y-2 text-sm text-[#F4E4BC]/80">
                        <li className="flex gap-2 items-start">
                           <AlertCircle className="w-4 h-4 text-[#FF6B6B] shrink-0 mt-0.5" />
                           <span>آخر موعد لتسليم درجات الشهر الأول غداً</span>
                        </li>
                        <li className="flex gap-2 items-start">
                           <Info className="w-4 h-4 text-[#4ECDC4] shrink-0 mt-0.5" />
                           <span>اجتماع مجلس المعلمين يوم الخميس</span>
                        </li>
                      </ul>
                   </CollapsibleSection>
                </div>
             </div>
          </div>
        );

      case 'lessons':
        const myLessons = lessons.filter(l => l.teacherId === id);
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#000]/20 p-4 rounded-xl border border-[#5D4037]">
                    <div>
                        <h3 className="text-[#FFD700] text-2xl font-bold font-[family-name:var(--font-amiri)] flex items-center gap-3">
                            <ScrollText className="w-8 h-8" />
                            سجل الحصة الذكي
                        </h3>
                        <p className="text-[#F4E4BC]/60 mt-1 text-sm">توثيق الحصص وتحويلها لتحديات تلقائية للطلاب</p>
                    </div>
                    <GoldButton onClick={() => setShowLessonModal(true)} className="px-6 py-3 shadow-[0_0_20px_rgba(218,165,32,0.3)]">
                        <Plus className="w-5 h-5 ml-2 inline" />
                        توثيق حصة جديدة
                    </GoldButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myLessons.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-[#F4E4BC]/50 border border-dashed border-[#5D4037] rounded-xl bg-[#000]/20">
                            <ScrollText className="w-20 h-20 mx-auto mb-6 opacity-30" />
                            <h4 className="text-xl font-bold mb-2">لم يتم توثيق أي حصة بعد</h4>
                            <p>ابدأ بتوثيق حصتك الأولى ليتم إنشاء التحديات للطلاب تلقائياً</p>
                        </div>
                    ) : (
                        myLessons.map((lesson) => (
                            <div key={lesson.id} className="bg-[#2A1B0E]/60 rounded-xl border border-[#5D4037] overflow-hidden group hover:border-[#DAA520] transition-all duration-300 flex flex-col">
                                <div className="h-32 bg-[#000]/50 relative">
                                    {lesson.imageUrl ? (
                                        <img src={lesson.imageUrl} alt={lesson.subject} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-[#DAA520]/10">
                                            <BookOpen className="w-12 h-12 text-[#DAA520]/30" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-[#000]/60 backdrop-blur-sm px-3 py-1 rounded-full border border-[#DAA520]/30 text-xs text-[#FFD700]">
                                        {new Date(lesson.createdAt).toLocaleDateString('ar-SA')}
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-[#FFD700] font-bold text-lg font-[family-name:var(--font-amiri)]">{lesson.subject}</h4>
                                        <span className="text-[#4ECDC4] text-xs bg-[#4ECDC4]/10 px-2 py-1 rounded">{lesson.className}</span>
                                    </div>
                                    <p className="text-[#F4E4BC]/70 text-sm line-clamp-3 mb-4 flex-1">{lesson.summary}</p>
                                    
                                    <div className="border-t border-[#5D4037]/50 pt-3 flex justify-between items-center text-xs text-[#F4E4BC]/50">
                                        <div className="flex gap-3">
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {lesson.attendees?.length || 0} حضور</span>
                                            <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> {lesson.questions?.length || 0} أسئلة</span>
                                        </div>
                                        <button className="text-[#DAA520] hover:underline">التفاصيل</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );

      case 'planning':
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-[#FFD700] text-xl font-bold font-[family-name:var(--font-amiri)]">إدارة الوقت والخطط</h3>
                    <div className="flex gap-2">
                        <GoldButton onClick={() => { setPlanForm({...planForm, type: 'schedule'}); setShowPlanModal(true); }}>
                            + حصة في الجدول
                        </GoldButton>
                        <GoldButton variant="secondary" onClick={() => { setPlanForm({...planForm, type: 'plan'}); setShowPlanModal(true); }}>
                            + عنصر في الخطة
                        </GoldButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Schedule Preview */}
                    <div className="bg-[#000]/20 p-4 rounded-xl border border-[#5D4037]">
                        <h4 className="text-[#F4E4BC] font-bold mb-4 border-b border-[#5D4037] pb-2">جدول الحصص</h4>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {schedule.filter(s => s.teacherId === currentTeacher?.id).map((item, i) => (
                                <div key={i} className="flex justify-between items-center bg-[#2A1B0E]/50 p-2 rounded border border-[#5D4037]/50">
                                    <div>
                                        <div className="text-[#FFD700] font-bold text-sm">{item.subject}</div>
                                        <div className="text-[#F4E4BC]/50 text-xs">{item.day} - {item.time}</div>
                                        {item.classId && <div className="text-[#4ECDC4] text-xs">فصل {classes.find(c => c.id === item.classId)?.name}</div>}
                                    </div>
                                    <span className={cn(
                                        "text-xs px-2 py-1 rounded",
                                        item.type === 'remote' ? "bg-[#2ECC71]/20 text-[#2ECC71]" : "bg-[#4ECDC4]/20 text-[#4ECDC4]"
                                    )}>
                                        {item.type === 'remote' ? 'عن بُعد' : 'حضوري'}
                                    </span>
                                </div>
                            ))}
                            {schedule.filter(s => s.teacherId === currentTeacher?.id).length === 0 && (
                                <p className="text-center text-[#F4E4BC]/40 text-sm py-4">لا توجد حصص مسندة إليك</p>
                            )}
                        </div>
                    </div>

                    {/* Weekly Plan Preview */}
                    <div className="bg-[#000]/20 p-4 rounded-xl border border-[#5D4037]">
                        <h4 className="text-[#F4E4BC] font-bold mb-4 border-b border-[#5D4037] pb-2">خريطة الأسبوع</h4>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {weeklyPlan.map((item, i) => (
                                <div key={i} className="bg-[#2A1B0E]/50 p-2 rounded border border-[#5D4037]/50">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[#4ECDC4] font-bold text-sm">{item.title}</span>
                                        <span className="text-[#F4E4BC]/50 text-xs">{item.day}</span>
                                    </div>
                                    <p className="text-[#F4E4BC]/60 text-xs truncate">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );

      case 'questions':
        const myQuestions = questionBank.filter(q => q.authorId === currentTeacher?.id);
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-[#FFD700] text-xl font-bold font-[family-name:var(--font-amiri)]">بنك الأسئلة</h3>
                <GoldButton onClick={() => setShowQuestionModal(true)}>
                    <Plus className="w-4 h-4 ml-2 inline" />
                    سؤال جديد
                </GoldButton>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myQuestions.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-[#F4E4BC]/50 border border-dashed border-[#5D4037] rounded-xl bg-[#000]/20">
                        <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>لم تقم بإضافة أي أسئلة بعد. ساهم في إثراء بنك الأسئلة!</p>
                    </div>
                ) : (
                    myQuestions.map(q => (
                        <div key={q.id} className="bg-[#2A1B0E]/60 p-4 rounded-xl border border-[#5D4037] hover:border-[#DAA520] transition-all relative">
                             <div className="flex justify-between items-start mb-2">
                                 <span className={cn(
                                     "px-2 py-1 rounded text-xs border",
                                     q.status === 'approved' ? "bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/30" :
                                     q.status === 'rejected' ? "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30" :
                                     "bg-[#DAA520]/10 text-[#DAA520] border-[#DAA520]/30"
                                 )}>
                                     {q.status === 'approved' ? 'معتمد' : q.status === 'rejected' ? 'مرفوض' : 'بانتظار الاعتماد'}
                                 </span>
                                 <span className="text-[#F4E4BC]/40 text-xs">{q.subject} | {q.grade}</span>
                             </div>
                             <p className="text-[#F4E4BC] font-bold mb-2">{q.text}</p>
                             <div className="flex gap-2 text-xs text-[#F4E4BC]/60">
                                 <span>{q.type === 'mcq' ? 'اختيارات' : q.type === 'true_false' ? 'صح/خطأ' : 'صورة'}</span>
                                 <span>•</span>
                                 <span>{q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}</span>
                             </div>
                        </div>
                    ))
                )}
             </div>
          </div>
        );

      case 'classes':
        return (
          <div className="space-y-4">
             <div className="flex justify-between items-center">
               <div className="relative w-64">
                  <input type="text" placeholder="بحث عن صف..." className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg pl-10 pr-4 py-2 text-[#F4E4BC] focus:border-[#DAA520] outline-none" />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#F4E4BC]/50" />
               </div>
             </div>

             {teacherClasses.length === 0 ? (
                <div className="text-center py-10 text-[#F4E4BC]/50">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>لم يتم إسناد أي فصول لك بعد.</p>
                </div>
             ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teacherClasses.map((cls, i) => {
                  const studentCount = allUsers.filter(u => u.role === 'student' && u.classId === cls.id).length;
                  return (
                  <div key={cls.id} className="bg-[#2A1B0E]/80 p-5 rounded-xl border border-[#5D4037] hover:border-[#DAA520] transition-all group cursor-pointer hover:-translate-y-1">
                     <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#DAA520]/20 p-3 rounded-full text-[#DAA520]">
                           <BookOpen className="w-6 h-6" />
                        </div>
                        <button className="text-[#F4E4BC]/40 hover:text-[#F4E4BC]"><Filter className="w-4 h-4" /></button>
                     </div>
                     <h3 className="text-xl font-bold text-[#FFD700] mb-2 font-[family-name:var(--font-amiri)]">{cls.name}</h3>
                     <div className="space-y-2 text-sm text-[#F4E4BC]/70">
                        <div className="flex justify-between">
                           <span>الطلاب:</span>
                           <span className="text-[#F4E4BC]">{studentCount}/{cls.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                           <span>المرحلة:</span>
                           <span className="text-[#4ECDC4] font-bold">{cls.grade}</span>
                        </div>
                        <div className="flex justify-between">
                           <span>القادم:</span>
                           <span className="text-[#FF6B6B]">اختبار قصير</span>
                        </div>
                     </div>
                  </div>
                  );
                })}
             </div>
             )}
          </div>
        );

      case 'tasks':
        // Filter quests/tasks. For now we use all quests but calculate submissions.
        // In future: filter by teacher's created quests.
        return (
          <div className="space-y-4">
             <div className="flex justify-between items-center mb-4">
               <div className="flex gap-2">
                 <button className="px-4 py-2 bg-[#DAA520] text-[#2A1B0E] rounded-lg font-bold text-sm">الكل</button>
                 <button className="px-4 py-2 bg-[#000]/30 text-[#F4E4BC] rounded-lg border border-[#5D4037] hover:border-[#DAA520] text-sm">النشطة</button>
                 <button className="px-4 py-2 bg-[#000]/30 text-[#F4E4BC] rounded-lg border border-[#5D4037] hover:border-[#DAA520] text-sm">المسودات</button>
               </div>
               <GoldButton className="text-sm px-4" onClick={() => setShowCreateModal(true)}>
                 <Plus className="w-4 h-4 ml-2 inline" />
                 مهمة جديدة
               </GoldButton>
             </div>

             <div className="grid grid-cols-1 gap-4">
               {quests.length === 0 ? (
                    <div className="text-center py-10 text-[#F4E4BC]/50">
                        <p>لا توجد مهام منشأة.</p>
                    </div>
               ) : (
                quests.map((quest, i) => {
                    const submissionCount = submissions.filter(s => s.questId === quest.id).length;
                    return (
                 <div key={quest.id} className="bg-[#2A1B0E]/60 p-4 rounded-lg border border-[#5D4037] hover:border-[#DAA520] flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className={cn(
                         "w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
                         quest.status === 'approved' ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" : "bg-[#F4E4BC]/10 text-[#F4E4BC]/50"
                       )}>
                         {quest.status === 'approved' ? "📝" : "✏️"}
                       </div>
                       <div>
                          <h4 className="text-[#F4E4BC] font-bold text-lg">{quest.title}</h4>
                          <p className="text-[#F4E4BC]/60 text-sm flex gap-3">
                             <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {quest.grade || "عام"}</span>
                             <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {quest.type}</span>
                          </p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                       <div className="text-center">
                          <span className="block text-[#FFD700] font-bold text-xl">{submissionCount}</span>
                          <span className="text-[#F4E4BC]/40 text-xs">تم التسليم</span>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-[#DAA520]/20 rounded text-[#DAA520]" title="تعديل"><FileText className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-[#FF6B6B]/20 rounded text-[#FF6B6B]" title="حذف"><X className="w-4 h-4" /></button>
                       </div>
                    </div>
                 </div>
                )})
               )}
             </div>
          </div>
        );

      case 'behavior':
        const myBehaviorRecords = behaviorRecords.filter(r => r.teacherName === name);
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-[#FFD700] text-xl font-bold font-[family-name:var(--font-amiri)]">سجل السلوك والمواظبة</h3>
                    <div className="bg-[#DAA520]/10 px-4 py-2 rounded-lg border border-[#DAA520]/30 text-[#DAA520] text-sm font-[family-name:var(--font-cairo)]">
                       مجموع النقاط الممنوحة: {myBehaviorRecords.filter(r => r.type === 'positive').reduce((acc, curr) => acc + curr.goldAmount, 0)}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    {myBehaviorRecords.length === 0 ? (
                         <div className="col-span-full text-center py-10 text-[#F4E4BC]/50 border border-dashed border-[#5D4037] rounded-xl bg-[#000]/20">
                            <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>لم تقم بتسجيل أي ملاحظات سلوكية بعد.</p>
                        </div>
                    ) : (
                        myBehaviorRecords.map((record, i) => (
                            <div key={i} className="bg-[#2A1B0E]/60 p-4 rounded-xl border border-[#5D4037] flex items-center justify-between hover:border-[#DAA520] transition-colors">
                                 <div className="flex items-center gap-4">
                                     <div className={cn(
                                         "w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2",
                                         record.type === 'positive' ? "bg-[#4ECDC4]/20 border-[#4ECDC4] text-[#4ECDC4]" : "bg-[#FF6B6B]/20 border-[#FF6B6B] text-[#FF6B6B]"
                                     )}>
                                         {record.type === 'positive' ? <Star className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                                     </div>
                                     <div>
                                         <h4 className="text-[#F4E4BC] font-bold">{record.studentName}</h4>
                                         <p className="text-[#F4E4BC]/60 text-xs">{record.category} - {record.date}</p>
                                     </div>
                                 </div>
                                 
                                 <div className="flex items-center gap-4">
                                     <div className="text-center">
                                         <span className={cn("font-bold text-lg", record.type === 'positive' ? "text-[#FFD700]" : "text-[#FF6B6B]")}>
                                             {record.type === 'positive' ? '+' : '-'}{record.goldAmount}
                                         </span>
                                         <span className="text-[#F4E4BC]/40 text-xs block">ذهب</span>
                                     </div>
                                     <span className={cn(
                                         "px-3 py-1 rounded text-xs border",
                                         record.status === 'approved' ? "bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/30" :
                                         record.status === 'rejected' ? "bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30" :
                                         "bg-[#DAA520]/10 text-[#DAA520] border-[#DAA520]/30"
                                     )}>
                                         {record.status === 'approved' ? 'معتمد' : record.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                                     </span>
                                 </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );

      case 'students':
         return (
            <div className="space-y-4">
               <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                     <input type="text" placeholder="بحث عن طالب..." className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg pl-10 pr-4 py-2 text-[#F4E4BC] focus:border-[#DAA520] outline-none" />
                     <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#F4E4BC]/50" />
                  </div>
                  <select className="bg-[#000]/30 border border-[#5D4037] rounded-lg px-4 text-[#F4E4BC] outline-none focus:border-[#DAA520]">
                     <option>جميع الصفوف</option>
                     {teacherClasses.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myStudents.length === 0 ? (
                      <div className="col-span-full text-center py-10 text-[#F4E4BC]/50">
                          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>لا يوجد طلاب في فصولك حالياً.</p>
                      </div>
                  ) : (
                      myStudents.map((student, i) => (
                         <div key={i} className="bg-[#2A1B0E]/60 p-4 rounded-xl border border-[#5D4037] flex flex-col gap-4 hover:border-[#DAA520] transition-colors cursor-pointer group relative">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#5D4037] border-2 border-[#DAA520] flex items-center justify-center text-lg font-bold text-[#F4E4BC]">
                                   {student.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                   <div className="flex justify-between items-start">
                                      <h4 className="text-[#F4E4BC] font-bold">{student.name}</h4>
                                      <span className="w-2 h-2 rounded-full bg-[#4ECDC4]" />
                                   </div>
                                   <p className="text-[#F4E4BC]/60 text-xs">{classes.find(c => c.id === student.classId)?.name || 'غير محدد'}</p>
                                   <div className="flex gap-3 mt-2 text-xs">
                                      <span className="text-[#FFD700]">Lv.{student.level || 1}</span>
                                      <span className="text-[#4ECDC4]">{student.xp || 0} XP</span>
                                   </div>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-2 justify-end border-t border-[#5D4037]/50 pt-3">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setBehaviorForm({
                                            studentId: student.id,
                                            studentName: student.name,
                                            type: 'positive',
                                            category: 'تعاون مميز',
                                            reason: '',
                                            amount: 10
                                        });
                                        setShowBehaviorModal(true);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded-lg hover:bg-[#4ECDC4]/20 text-xs font-bold transition-colors"
                                    title="تعزيز إيجابي"
                                >
                                    <Star className="w-4 h-4" />
                                    تعزيز
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setBehaviorForm({
                                            studentId: student.id,
                                            studentName: student.name,
                                            type: 'negative',
                                            category: 'إزعاج الصف',
                                            reason: '',
                                            amount: 10
                                        });
                                        setShowBehaviorModal(true);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-lg hover:bg-[#FF6B6B]/20 text-xs font-bold transition-colors"
                                    title="ملاحظة سلوكية"
                                >
                                    <ShieldAlert className="w-4 h-4" />
                                    تنبيه
                                </button>
                            </div>
                         </div>
                      ))
                  )}
               </div>
            </div>
         );

      case 'grading':
         const pendingSubmissions = submissions.filter(s => s.status === 'pending');
         return (
            <div className="space-y-4">
               {pendingSubmissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-[#F4E4BC]/50">
                     <CheckSquare className="w-16 h-16 mb-4 opacity-50" />
                     <p className="text-xl font-[family-name:var(--font-cairo)]">رائع! لا توجد مهام بانتظار التصحيح</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-4">
                     {pendingSubmissions.map((sub) => (
                        <div key={sub.id} className="bg-[#000]/20 p-6 rounded-lg border border-[#5D4037] flex flex-col gap-4">
                           <div className="flex justify-between items-start border-b border-[#5D4037] pb-3">
                              <div>
                                 <h4 className="text-[#FFD700] font-bold font-[family-name:var(--font-amiri)] text-xl">{sub.questTitle}</h4>
                                 <p className="text-[#F4E4BC]/60 text-sm mt-1">الطالب: <span className="text-[#4ECDC4]">{sub.studentName}</span> | التاريخ: {sub.date}</p>
                              </div>
                              <span className="bg-[#FFD700]/10 text-[#FFD700] text-xs px-2 py-1 rounded">قيد المراجعة</span>
                           </div>
                           
                           <div className="bg-[#000]/40 p-4 rounded border border-[#5D4037]/50">
                              <p className="text-[#F4E4BC]/50 text-xs mb-2">إجابة الطالب:</p>
                              <p className="text-[#F4E4BC] font-[family-name:var(--font-cairo)] leading-relaxed">{sub.answer}</p>
                           </div>

                           <div className="flex justify-end gap-3 mt-2">
                              <button 
                                 onClick={() => handleGrade(sub.id, 'rejected')}
                                 className="px-6 py-2 rounded-lg border border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors text-sm font-bold"
                              >
                                 رفض وإعادة
                              </button>
                              <button 
                                 onClick={() => handleGrade(sub.id, 'approved')}
                                 className="px-6 py-2 rounded-lg bg-[#4ECDC4] text-[#0a192f] hover:bg-[#4ECDC4]/80 transition-colors text-sm font-bold shadow-[0_0_10px_rgba(78,205,196,0.3)]"
                              >
                                 قبول ومنح المكافأة
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         );

      case 'reports':
        return (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#000]/30 p-6 rounded-xl border border-[#5D4037]">
                 <h3 className="text-[#F4E4BC] font-bold mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#4ECDC4]" />
                    توزيع الدرجات
                 </h3>
                 <div className="h-48 flex items-end justify-center gap-4 px-4">
                    {[
                       { label: "ممتاز", h: "80%", c: "bg-[#4ECDC4]" },
                       { label: "جيد جداً", h: "60%", c: "bg-[#FFD700]" },
                       { label: "جيد", h: "40%", c: "bg-[#DAA520]" },
                       { label: "مقبول", h: "20%", c: "bg-[#FF6B6B]" },
                    ].map((bar, i) => (
                       <div key={i} className="flex flex-col items-center gap-2 w-12">
                          <div className={`w-full rounded-t ${bar.c} opacity-80 hover:opacity-100 transition-opacity`} style={{ height: bar.h }} />
                          <span className="text-[10px] text-[#F4E4BC]/60">{bar.label}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#000]/30 p-6 rounded-xl border border-[#5D4037]">
                 <h3 className="text-[#F4E4BC] font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#FFD700]" />
                    مستوى التقدم الأسبوعي
                 </h3>
                 <div className="space-y-4">
                    {[
                       { label: "الصف الأول - أ", val: 85 },
                       { label: "الصف الثاني - ب", val: 92 },
                       { label: "الصف الثالث - ج", val: 78 },
                    ].map((item, i) => (
                       <div key={i}>
                          <div className="flex justify-between text-xs text-[#F4E4BC]/80 mb-1">
                             <span>{item.label}</span>
                             <span>{item.val}%</span>
                          </div>
                          <div className="h-2 bg-[#000]/50 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-[#DAA520] to-[#FFD700]" style={{ width: `${item.val}%` }} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        );

      case 'messages':
         // Filter messages based on active tab
         const filteredMessages = supportMessages.filter(msg => {
             if (activeMessageTab === 'all') return true;
             if (activeMessageTab === 'students') return msg.type === 'student_msg';
             if (activeMessageTab === 'parents') return msg.type === 'parent_msg' || msg.type === 'parent';
             if (activeMessageTab === 'admin') return msg.type === 'admin_msg' || msg.type === 'admin';
             return false;
         });

         // Filter broadcasts
         const teacherBroadcasts = broadcasts.filter(b => b.targetRole === 'all' || b.targetRole === 'teacher');

         // Prepare display list
         let displayItems: any[] = [];
         
         if (activeMessageTab === 'broadcasts') {
             displayItems = teacherBroadcasts.map(b => ({ ...b, isBroadcast: true }));
         } else if (activeMessageTab === 'all') {
             displayItems = [
                 ...teacherBroadcasts.map(b => ({ ...b, isBroadcast: true })),
                 ...filteredMessages.map(m => ({ ...m, isBroadcast: false }))
             ];
             // Sort by date if possible, otherwise keep order
             displayItems.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
         } else {
             displayItems = filteredMessages.map(m => ({ ...m, isBroadcast: false }));
         }

         return (
            <div className="h-full flex flex-col">
               {/* Tabs Navigation */}
               <div className="flex gap-2 mb-6 border-b border-[#5D4037] pb-4 overflow-x-auto">
                  {[
                      { id: 'all', label: 'الكل' },
                      { id: 'broadcasts', label: 'مراسيم المملكة', icon: <Crown className="w-4 h-4" /> },
                      { id: 'students', label: 'الطلاب' },
                      { id: 'parents', label: 'أولياء الأمور' },
                      { id: 'admin', label: 'الإدارة' },
                  ].map((tab) => (
                      <button
                          key={tab.id}
                          onClick={() => setActiveMessageTab(tab.id as any)}
                          className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                              activeMessageTab === tab.id
                                  ? "bg-[#DAA520] text-[#2A1B0E] shadow-[0_0_10px_rgba(218,165,32,0.4)]"
                                  : "bg-[#000]/20 text-[#F4E4BC]/60 hover:text-[#F4E4BC] hover:bg-[#DAA520]/10"
                          )}
                      >
                          {tab.icon}
                          {tab.label}
                      </button>
                  ))}
               </div>

               {/* Content */}
               <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                  {displayItems.length === 0 ? (
                      <div className="text-center py-10 text-[#F4E4BC]/50">
                          {activeMessageTab === 'broadcasts' ? <Crown className="w-16 h-16 mx-auto mb-4 opacity-50" /> : <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />}
                          <p>لا توجد رسائل أو مراسيم في هذا التصنيف.</p>
                      </div>
                  ) : (
                      displayItems.map((item) => (
                          item.isBroadcast ? (
                              <motion.div
                                  key={`broadcast-${item.id}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  onClick={() => setSelectedBroadcast(item)}
                                  className="p-4 rounded-xl border border-[#DAA520]/50 bg-[#DAA520]/10 cursor-pointer hover:bg-[#DAA520]/20 transition-all group relative overflow-hidden"
                              >
                                  <div className="absolute top-0 right-0 p-2 opacity-10">
                                      <Crown className="w-24 h-24 text-[#FFD700]" />
                                  </div>
                                  <div className="flex items-start gap-4 relative z-10">
                                      <div className="bg-[#DAA520]/20 p-3 rounded-full shrink-0">
                                          <ScrollText className="w-6 h-6 text-[#FFD700]" />
                                      </div>
                                      <div className="flex-1">
                                          <div className="flex justify-between items-start mb-1">
                                              <h4 className="font-bold text-[#FFD700] text-lg font-[family-name:var(--font-amiri)]">{item.title}</h4>
                                              <span className="text-[#F4E4BC]/40 text-xs bg-[#000]/30 px-2 py-1 rounded">{item.date ? new Date(item.date).toLocaleDateString('ar-SA') : 'الآن'}</span>
                                          </div>
                                          <p className="text-[#F4E4BC]/80 text-sm line-clamp-2">{item.message}</p>
                                          <div className="mt-2 flex items-center gap-2 text-xs text-[#DAA520]/70">
                                              <Crown className="w-3 h-3" />
                                              <span>من: {item.senderName}</span>
                                          </div>
                                      </div>
                                  </div>
                              </motion.div>
                          ) : (
                             <div 
                                key={`msg-${item.id}`} 
                                onClick={() => {
                                    setSelectedMessage(item);
                                    if (!item.read) markSupportMessageAsRead(item.id);
                                }}
                                className={cn(
                                    "p-4 rounded-lg border cursor-pointer transition-colors flex gap-4",
                                    item.read 
                                        ? "bg-[#000]/20 border-[#5D4037] hover:border-[#DAA520]" 
                                        : "bg-[#DAA520]/10 border-[#DAA520]/50 hover:bg-[#DAA520]/20"
                                )}
                             >
                                <div className="w-10 h-10 rounded-full bg-[#5D4037] flex items-center justify-center text-[#F4E4BC] font-bold shrink-0 border border-[#DAA520]/30">
                                   {item.senderName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <div className="flex justify-between items-center mb-1">
                                      <h4 className={cn("font-bold text-sm truncate", !item.read && "text-[#FFD700]")}>{item.senderName}</h4>
                                      <span className="text-[#F4E4BC]/40 text-xs whitespace-nowrap">{item.date}</span>
                                   </div>
                                   <p className="text-[#F4E4BC]/60 text-xs truncate">{item.message}</p>
                                   <div className="mt-2 flex gap-2">
                                       {item.type === 'student_msg' && <span className="text-[10px] px-2 py-0.5 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded-full border border-[#4ECDC4]/20">طالب</span>}
                                       {item.type === 'parent_msg' && <span className="text-[10px] px-2 py-0.5 bg-[#FFD700]/10 text-[#FFD700] rounded-full border border-[#FFD700]/20">ولي أمر</span>}
                                       {item.type === 'admin_msg' && <span className="text-[10px] px-2 py-0.5 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full border border-[#FF6B6B]/20">إدارة</span>}
                                   </div>
                                </div>
                                {!item.read && <div className="w-2 h-2 rounded-full bg-[#FF6B6B] self-center animate-pulse" />}
                             </div>
                          )
                      ))
                  )}
               </div>
            </div>
         );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-[#F4E4BC]/50">
             <Info className="w-16 h-16 mb-4 opacity-50" />
             <p className="text-xl font-[family-name:var(--font-cairo)]">هذا القسم قيد التطوير</p>
          </div>
        );
    }
  };

  return (
    <>
      <MobileNav />
      <PageTransition>
        <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1507842217121-9e8712e2f344?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center overflow-hidden flex font-[family-name:var(--font-cairo)]">
          {/* Enhanced Atmospheric Overlays */}
          <div className="absolute inset-0 bg-[#0a0502]/70 mix-blend-multiply z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E120A] via-transparent to-[#1E120A]/50 z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] opacity-60 z-0 pointer-events-none" />

          {/* Sidebar - Creative Redesign */}
          <div className="relative z-20 hidden lg:block h-screen sticky top-0 w-80 p-6">
             <div className="h-full flex flex-col relative">
                {/* Sidebar Background */}
                <div className="absolute inset-0 bg-[#1E120A]/80 backdrop-blur-xl rounded-[2rem] border border-[#DAA520]/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 mix-blend-overlay" />
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#DAA520]/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#000] to-transparent" />
                </div>

                {/* Profile Section - Top */}
                <div className="relative z-10 pt-8 pb-6 px-4 text-center border-b border-[#DAA520]/10 mx-4 mb-2">
                    <div className="relative inline-block mb-4 group cursor-pointer" onClick={() => setShowProfileModal(true)}>
                        <div className="absolute inset-0 bg-[#DAA520] blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                        <div className="w-20 h-20 rounded-full bg-[#2A1B0E] border-2 border-[#DAA520] p-1 relative z-10 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-full rounded-full bg-[#DAA520] flex items-center justify-center text-[#2A1B0E] text-3xl font-bold font-[family-name:var(--font-amiri)]">
                                {name.charAt(0)}
                            </div>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#DAA520] text-[#1E120A] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2A1B0E] shadow-sm whitespace-nowrap">
                            Lv. {currentTeacher?.level || 15}
                        </div>
                    </div>
                    <h2 className="text-xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold tracking-wide">{name}</h2>
                    <p className="text-[#DAA520]/60 text-xs mt-1">المعلم الحكيم</p>
                </div>
                
                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-2 custom-scrollbar relative z-10">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={cn(
                                "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                activeView === item.id 
                                    ? "text-[#1E120A]" 
                                    : "text-[#F4E4BC]/70 hover:text-[#FFD700]"
                            )}
                        >
                            {/* Active Background */}
                            {activeView === item.id && (
                                <motion.div 
                                    layoutId="activeTabBg"
                                    className="absolute inset-0 bg-gradient-to-r from-[#DAA520] to-[#F4E4BC] rounded-xl z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            
                            {/* Hover Effect */}
                            {activeView !== item.id && (
                                <div className="absolute inset-0 bg-[#DAA520]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl z-0" />
                            )}

                            <span className={cn(
                                "relative z-10 transition-transform duration-300 group-hover:scale-110",
                                activeView === item.id ? "text-[#1E120A]" : "text-[#DAA520]"
                            )}>
                                {item.icon}
                            </span>
                            <span className={cn(
                                "relative z-10 font-bold text-sm transition-all duration-300",
                                activeView === item.id ? "translate-x-1" : "group-hover:translate-x-1"
                            )}>
                                {item.label}
                            </span>
                            
                            {/* Active Indicator Dot */}
                            {activeView === item.id && (
                                <motion.div 
                                    initial={{ scale: 0 }} 
                                    animate={{ scale: 1 }}
                                    className="absolute left-4 w-2 h-2 bg-[#1E120A] rounded-full z-10"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer / Logout */}
                <div className="p-6 relative z-10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-[#FF6B6B] hover:bg-[#FF6B6B]/10 hover:shadow-[0_0_20px_rgba(255,107,107,0.1)] transition-all duration-300 border border-[#FF6B6B]/20 group bg-[#000]/20"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">تسجيل الخروج</span>
                    </button>
                </div>
             </div>
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
                            {navItems.find(i => i.id === activeView)?.icon}
                        </div>
                        <div>
                          <h1 className="text-3xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold drop-shadow-sm">
                            {navItems.find(i => i.id === activeView)?.label}
                          </h1>
                          <div className="flex items-center gap-2 text-[#F4E4BC]/60 text-xs mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4] animate-pulse" />
                            <p>{currentDate}</p>
                          </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 items-center">
                      <NotificationCenter />
                      <div className="h-8 w-[1px] bg-[#DAA520]/20 mx-2 hidden md:block" />
                      <GoldButton variant="secondary" className="px-5 text-sm h-10 rounded-xl" onClick={() => handleAction("مراسلة ولي الأمر")}>
                        <MessageCircle className="w-4 h-4 ml-2 inline" />
                        مراسلة
                      </GoldButton>
                      <GoldButton className="px-5 text-sm h-10 rounded-xl shadow-[0_0_15px_rgba(218,165,32,0.3)]" onClick={() => handleAction("إنشاء منافسة")}>
                        <Swords className="w-4 h-4 ml-2 inline" />
                        منافسة جديدة
                      </GoldButton>
                      <GoldButton className="px-5 text-sm h-10 rounded-xl shadow-[0_0_15px_rgba(218,165,32,0.3)]" onClick={() => handleAction("إنشاء مهمة جديدة")}>
                        <Plus className="w-4 h-4 ml-2 inline" />
                        مهمة جديدة
                      </GoldButton>
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
                 
                 <div className="relative z-10 p-6 md:p-10 flex-1 overflow-hidden flex flex-col">
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 10, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.99 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="h-full"
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

      {/* Create Quest Modal */}
      <AnimatePresence>
          {showCreateModal && (
            <FantasyModal onClose={() => setShowCreateModal(false)} title="إنشاء مهمة جديدة">
                 <form onSubmit={handleCreateQuest} className="space-y-4">
                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">عنوان المهمة</label>
                        <input 
                            type="text" 
                            required 
                            value={questForm.title}
                            onChange={(e) => setQuestForm({...questForm, title: e.target.value})}
                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                            placeholder="مثال: حل مسائل الفصل الأول" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الصف المستهدف</label>
                            <select 
                                value={questForm.classId}
                                onChange={(e) => setQuestForm({...questForm, classId: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                            >
                                <option value="">اختر الصف...</option>
                                {teacherClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">تاريخ التسليم</label>
                            <input 
                                type="date" 
                                value={questForm.dueDate}
                                onChange={(e) => setQuestForm({...questForm, dueDate: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">وصف المهمة</label>
                        <textarea 
                            rows={3} 
                            value={questForm.description}
                            onChange={(e) => setQuestForm({...questForm, description: e.target.value})}
                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                            placeholder="اكتب تفاصيل المهمة هنا..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-[#FFD700] mb-2 font-[family-name:var(--font-cairo)]">مكافأة الذهب</label>
                             <input 
                                type="number" 
                                value={questForm.gold}
                                onChange={(e) => setQuestForm({...questForm, gold: Number(e.target.value)})}
                                className="w-full bg-[#000]/30 border border-[#DAA520]/50 rounded-lg p-3 text-[#FFD700] focus:border-[#DAA520] outline-none" 
                             />
                        </div>
                        <div>
                             <label className="block text-[#4ECDC4] mb-2 font-[family-name:var(--font-cairo)]">نقاط الخبرة (XP)</label>
                             <input 
                                type="number" 
                                value={questForm.xp}
                                onChange={(e) => setQuestForm({...questForm, xp: Number(e.target.value)})}
                                className="w-full bg-[#000]/30 border border-[#4ECDC4]/50 rounded-lg p-3 text-[#4ECDC4] focus:border-[#4ECDC4] outline-none" 
                             />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                        <GoldButton type="submit" className="px-8">نشر المهمة</GoldButton>
                    </div>
                 </form>
            </FantasyModal>
          )}
      </AnimatePresence>

      {/* Question Modal */}
      <AnimatePresence>
          {showQuestionModal && (
            <FantasyModal onClose={() => setShowQuestionModal(false)} title="إضافة سؤال جديد" className="max-h-[90vh] overflow-y-auto custom-scrollbar">
                 <form onSubmit={handleAddQuestion} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">المادة</label>
                            <input 
                                type="text" 
                                required
                                value={questionForm.subject}
                                onChange={(e) => setQuestionForm({...questionForm, subject: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                placeholder="مثال: الرياضيات"
                            />
                        </div>
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">المرحلة</label>
                            <select 
                                required
                                value={questionForm.grade}
                                onChange={(e) => setQuestionForm({...questionForm, grade: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                            >
                                <option value="">اختر المرحلة...</option>
                                <option value="الأول الثانوي">الأول الثانوي</option>
                                <option value="الثاني الثانوي">الثاني الثانوي</option>
                                <option value="الثالث الثانوي">الثالث الثانوي</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">نوع السؤال</label>
                            <select 
                                value={questionForm.type}
                                onChange={(e) => setQuestionForm({...questionForm, type: e.target.value as any})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                            >
                                <option value="mcq">اختيار من متعدد</option>
                                <option value="true_false">صح / خطأ</option>
                                <option value="image_question">سؤال صورة</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الصعوبة</label>
                            <select 
                                value={questionForm.difficulty}
                                onChange={(e) => setQuestionForm({...questionForm, difficulty: e.target.value as any})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                            >
                                <option value="easy">سهل</option>
                                <option value="medium">متوسط</option>
                                <option value="hard">صعب</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">نص السؤال</label>
                        <textarea 
                            rows={3} 
                            required
                            value={questionForm.text}
                            onChange={(e) => setQuestionForm({...questionForm, text: e.target.value})}
                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                            placeholder="اكتب نص السؤال هنا..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">صورة السؤال (اختياري)</label>
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                value={questionForm.imageUrl}
                                onChange={(e) => setQuestionForm({...questionForm, imageUrl: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                placeholder="رابط الصورة..."
                             />
                             <div className="p-3 bg-[#000]/30 border border-[#5D4037] rounded-lg text-[#F4E4BC]/50">
                                <ImageIcon className="w-6 h-6" />
                             </div>
                        </div>
                    </div>

                    {questionForm.type === 'mcq' && (
                        <div className="space-y-3">
                            <label className="block text-[#F4E4BC] font-[family-name:var(--font-cairo)]">الخيارات (حدد الإجابة الصحيحة)</label>
                            {questionForm.options.map((opt, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input 
                                        type="radio" 
                                        name="correctAnswer" 
                                        checked={questionForm.correctAnswer === i.toString()}
                                        onChange={() => setQuestionForm({...questionForm, correctAnswer: i.toString()})}
                                        className="w-4 h-4 accent-[#DAA520]"
                                    />
                                    <input 
                                        type="text" 
                                        required
                                        value={opt}
                                        onChange={(e) => {
                                            const newOptions = [...questionForm.options];
                                            newOptions[i] = e.target.value;
                                            setQuestionForm({...questionForm, options: newOptions});
                                        }}
                                        className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-2 text-[#F4E4BC] focus:border-[#DAA520] outline-none text-sm"
                                        placeholder={`الخيار ${i + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {questionForm.type === 'true_false' && (
                        <div className="flex gap-6 justify-center p-4 bg-[#000]/20 rounded-lg">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="correctAnswer" 
                                    value="true"
                                    checked={questionForm.correctAnswer === 'true'}
                                    onChange={() => setQuestionForm({...questionForm, correctAnswer: 'true'})}
                                    className="w-5 h-5 accent-[#4ECDC4]"
                                />
                                <span className="text-[#4ECDC4] font-bold">صح</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="correctAnswer" 
                                    value="false"
                                    checked={questionForm.correctAnswer === 'false'}
                                    onChange={() => setQuestionForm({...questionForm, correctAnswer: 'false'})}
                                    className="w-5 h-5 accent-[#FF6B6B]"
                                />
                                <span className="text-[#FF6B6B] font-bold">خطأ</span>
                            </label>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowQuestionModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                        <GoldButton type="submit" className="px-8">إرسال للاعتماد</GoldButton>
                    </div>
                 </form>
            </FantasyModal>
          )}
      </AnimatePresence>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* Plan/Schedule Modal */}
      <AnimatePresence>
          {showPlanModal && (
            <FantasyModal onClose={() => setShowPlanModal(false)} title={planForm.type === 'schedule' ? 'إضافة حصة للجدول' : 'إضافة عنصر للخطة'}>
                 <form onSubmit={handleSubmitPlan} className="space-y-4">
                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الفصل الدراسي</label>
                        <select 
                            required
                            value={planForm.classId}
                            onChange={(e) => setPlanForm({...planForm, classId: e.target.value})}
                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                        >
                            <option value="">اختر الفصل...</option>
                            {teacherClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">اليوم</label>
                            <select 
                                value={planForm.day}
                                onChange={(e) => setPlanForm({...planForm, day: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                            >
                                {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        {planForm.type === 'schedule' && (
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الوقت</label>
                                <input 
                                    type="time" 
                                    value={planForm.time}
                                    onChange={(e) => setPlanForm({...planForm, time: e.target.value})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">
                            {planForm.type === 'schedule' ? 'المادة' : 'العنوان'}
                        </label>
                        <input 
                            type="text" 
                            required
                            value={planForm.type === 'schedule' ? planForm.subject : planForm.title}
                            onChange={(e) => setPlanForm({
                                ...planForm, 
                                subject: planForm.type === 'schedule' ? e.target.value : planForm.subject,
                                title: planForm.type === 'plan' ? e.target.value : planForm.title
                            })}
                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                            placeholder={planForm.type === 'schedule' ? "مثال: الرياضيات" : "مثال: درس الجبر"} 
                        />
                    </div>

                    {planForm.type === 'plan' && (
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الوصف</label>
                            <textarea 
                                rows={3}
                                value={planForm.description}
                                onChange={(e) => setPlanForm({...planForm, description: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                placeholder="تفاصيل الدرس أو المهمة..."
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            id="isRemote"
                            checked={planForm.isRemote}
                            onChange={(e) => setPlanForm({...planForm, isRemote: e.target.checked})}
                            className="w-4 h-4 accent-[#DAA520]"
                        />
                        <label htmlFor="isRemote" className="text-[#F4E4BC] font-[family-name:var(--font-cairo)]">حصة عن بُعد</label>
                    </div>

                    {planForm.isRemote && planForm.type === 'schedule' && (
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">رابط الاجتماع</label>
                            <input 
                                type="url" 
                                value={planForm.meetingUrl}
                                onChange={(e) => setPlanForm({...planForm, meetingUrl: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                placeholder="https://zoom.us/..." 
                            />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowPlanModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                        <GoldButton type="submit" className="px-8">حفظ</GoldButton>
                    </div>
                 </form>
            </FantasyModal>
          )}
      </AnimatePresence>

      {/* Behavior Request Modal */}
      <AnimatePresence>
          {showBehaviorModal && (
            <FantasyModal 
                onClose={() => setShowBehaviorModal(false)}
                title={
                    <span className={cn("flex items-center gap-2", behaviorForm.type === 'positive' ? "text-[#4ECDC4]" : "text-[#FF6B6B]")}>
                        {behaviorForm.type === 'positive' ? <Star className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                        {behaviorForm.type === 'positive' ? "تسجيل تعزيز سلوكي" : "تسجيل ملاحظة سلوكية"}
                    </span>
                }
            >
                 <div className="mb-4 text-center">
                     <p className="text-[#F4E4BC] text-lg font-bold">{behaviorForm.studentName}</p>
                 </div>

                 <form onSubmit={handleSubmitBehavior} className="space-y-4">
                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">نوع السلوك</label>
                        <select 
                            required
                            value={behaviorForm.category}
                            onChange={(e) => setBehaviorForm({...behaviorForm, category: e.target.value})}
                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                        >
                            {behaviorForm.type === 'positive' ? (
                                <>
                                    <option value="تعاون مميز">🤝 تعاون مميز مع الزملاء</option>
                                    <option value="التزام بالوقت">⏰ التزام مثالي بالوقت</option>
                                    <option value="مشاركة فعالة">💡 مشاركة فعالة في الدرس</option>
                                    <option value="سلوك قيادي">👑 سلوك قيادي ومبادرة</option>
                                    <option value="أمانة وصدق">✨ أمانة وصدق</option>
                                </>
                            ) : (
                                <>
                                    <option value="إزعاج الصف">📢 إزعاج سير الدرس</option>
                                    <option value="تأخر متكرر">🏃 تأخر متكرر عن الحصة</option>
                                    <option value="عدم إحضار الأدوات">📚 عدم إحضار الأدوات المدرسية</option>
                                    <option value="مخالفة الزي">👕 مخالفة الزي المدرسي</option>
                                    <option value="سلوك غير لائق">🚫 سلوك غير لائق مع الزملاء</option>
                                </>
                            )}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">ملاحظات إضافية (اختياري)</label>
                        <textarea 
                            rows={3} 
                            value={behaviorForm.reason}
                            onChange={(e) => setBehaviorForm({...behaviorForm, reason: e.target.value})}
                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                            placeholder="اكتب تفاصيل إضافية حول السلوك..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className={cn("block mb-2 font-[family-name:var(--font-cairo)]", behaviorForm.type === 'positive' ? "text-[#FFD700]" : "text-[#FF6B6B]")}>
                                 {behaviorForm.type === 'positive' ? "مكافأة الذهب" : "خصم الذهب"}
                             </label>
                             <input 
                                type="number" 
                                min="1"
                                max="100"
                                value={behaviorForm.amount}
                                onChange={(e) => setBehaviorForm({...behaviorForm, amount: Number(e.target.value)})}
                                className={cn(
                                    "w-full bg-[#000]/30 border rounded-lg p-3 focus:outline-none",
                                    behaviorForm.type === 'positive' ? "border-[#DAA520]/50 text-[#FFD700] focus:border-[#DAA520]" : "border-[#FF6B6B]/50 text-[#FF6B6B] focus:border-[#FF6B6B]"
                                )}
                             />
                        </div>
                        {behaviorForm.type === 'positive' && (
                            <div>
                                <label className="block text-[#4ECDC4] mb-2 font-[family-name:var(--font-cairo)]">مكافأة XP</label>
                                <div className="w-full bg-[#000]/30 border border-[#4ECDC4]/50 rounded-lg p-3 text-[#4ECDC4]">
                                    {behaviorForm.amount * 2} XP
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowBehaviorModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                        <GoldButton 
                            type="submit" 
                            className={cn("px-8", behaviorForm.type === 'positive' ? "border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-[#0a192f]" : "border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-[#2A1B0E]")}
                        >
                            {behaviorForm.type === 'positive' ? "إرسال التعزيز" : "رفع التنبيه"}
                        </GoldButton>
                    </div>
                 </form>
            </FantasyModal>
          )}
      </AnimatePresence>

      {/* Message Details Modal */}
      <AnimatePresence>
        {selectedMessage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    onClick={() => setSelectedMessage(null)}
                />
                
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative z-50 w-full max-w-2xl max-h-[90vh] flex flex-col"
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

                        {/* Content Container - Scrollable */}
                        <div className="relative z-10 p-6 md:p-8 overflow-y-auto custom-scrollbar">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-[#DAA520]/30 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative shrink-0">
                                        <div className="absolute inset-0 bg-[#DAA520] blur-md opacity-40 rounded-full" />
                                        <div className="relative w-14 h-14 rounded-full bg-[#2A1B0E] border-2 border-[#DAA520] flex items-center justify-center text-[#FFD700] font-bold text-xl shadow-inner">
                                            {selectedMessage.senderName.charAt(0)}
                                        </div>
                                        {/* Status Indicator */}
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2A1B0E] rounded-full flex items-center justify-center border border-[#DAA520]">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#4ECDC4] animate-pulse" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold drop-shadow-sm">
                                            {selectedMessage.senderName}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1 text-[#F4E4BC]/60 text-xs">
                                            <span className="flex items-center gap-1 bg-[#000]/30 px-2 py-0.5 rounded">
                                                <Clock className="w-3 h-3 text-[#DAA520]" />
                                                {selectedMessage.date}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-[#DAA520]" />
                                            <span className="text-[#DAA520]">{selectedMessage.type === 'student_msg' ? 'طالب' : selectedMessage.type === 'parent_msg' ? 'ولي أمر' : 'إدارة'}</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setSelectedMessage(null)}
                                    className="group p-2 rounded-full hover:bg-[#FF6B6B]/20 transition-colors border border-transparent hover:border-[#FF6B6B]/50 absolute top-4 left-4 md:static md:top-auto md:left-auto"
                                    title="إغلاق"
                                >
                                    <X className="w-5 h-5 text-[#F4E4BC]/50 group-hover:text-[#FF6B6B]" />
                                </button>
                            </div>

                            {/* Contact Info Bar */}
                            {(selectedMessage.mobile || selectedMessage.email) && (
                                <div className="flex flex-wrap gap-3 mb-6 p-3 bg-[#000]/40 rounded-lg border border-[#DAA520]/20 shadow-inner text-sm">
                                    {selectedMessage.mobile && (
                                        <div className="flex items-center gap-2 text-[#F4E4BC]">
                                            <div className="p-1.5 bg-[#DAA520]/10 rounded-full">
                                                <Smartphone className="w-3.5 h-3.5 text-[#DAA520]" />
                                            </div>
                                            <span className="font-mono dir-ltr">{selectedMessage.mobile}</span>
                                        </div>
                                    )}
                                    {selectedMessage.email && (
                                        <div className="flex items-center gap-2 text-[#F4E4BC]">
                                            <div className="p-1.5 bg-[#DAA520]/10 rounded-full">
                                                <Mail className="w-3.5 h-3.5 text-[#DAA520]" />
                                            </div>
                                            <span className="font-mono truncate max-w-[200px]">{selectedMessage.email}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Message Body */}
                            <div className="relative mb-6">
                                <div className="absolute -left-2 -top-2 opacity-10 pointer-events-none">
                                    <MessageCircle className="w-24 h-24 text-[#DAA520]" />
                                </div>
                                <div className="bg-[#F4E4BC]/5 p-6 rounded-xl border border-[#DAA520]/20 min-h-[120px] shadow-inner backdrop-blur-sm relative z-10">
                                    <p className="text-[#F4E4BC] text-base leading-relaxed whitespace-pre-wrap font-[family-name:var(--font-cairo)] text-justify">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-[#DAA520]/30">
                                <button 
                                    onClick={() => handleAction("رد على الرسالة")}
                                    className="px-4 py-2 rounded-lg border border-[#DAA520] text-[#DAA520] hover:bg-[#DAA520] hover:text-[#1E120A] transition-all font-bold flex items-center gap-2 text-sm"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>رد على الرسالة</span>
                                </button>
                                <GoldButton onClick={() => setSelectedMessage(null)} className="px-6 py-2 text-sm min-w-[100px]">
                                    إغلاق
                                </GoldButton>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
      {/* Broadcast Details Modal (Reused from Student City for consistency) */}
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

                    {/* Content Container - Scrollable */}
                    <div className="relative z-10 p-6 md:p-8 overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-[#DAA520]/30 pb-4">
                            <div className="flex items-center gap-4">
                                <div className="relative shrink-0">
                                    <div className="absolute inset-0 bg-[#DAA520] blur-md opacity-40 rounded-full" />
                                    <div className="relative w-14 h-14 rounded-full bg-[#2A1B0E] border-2 border-[#DAA520] flex items-center justify-center text-[#FFD700] font-bold text-xl shadow-inner">
                                        <Crown className="w-8 h-8" />
                                    </div>
                                </div>
                                
                                <div>
                                    <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold drop-shadow-sm">
                                        {selectedBroadcast.title}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1 text-[#F4E4BC]/60 text-xs">
                                        <span className="flex items-center gap-1 bg-[#000]/30 px-2 py-0.5 rounded">
                                            <Calendar className="w-3 h-3 text-[#DAA520]" />
                                            {selectedBroadcast.date ? new Date(selectedBroadcast.date).toLocaleDateString('ar-SA') : ''}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-[#DAA520]" />
                                        <span className="text-[#DAA520]">مرسوم ملكي</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setSelectedBroadcast(null)}
                                className="group p-2 rounded-full hover:bg-[#FF6B6B]/20 transition-colors border border-transparent hover:border-[#FF6B6B]/50 absolute top-4 left-4 md:static md:top-auto md:left-auto"
                                title="إغلاق"
                            >
                                <X className="w-5 h-5 text-[#F4E4BC]/50 group-hover:text-[#FF6B6B]" />
                            </button>
                        </div>

                        {/* Message Body */}
                        <div className="relative mb-6">
                            <div className="absolute -left-2 -top-2 opacity-10 pointer-events-none">
                                <ScrollText className="w-24 h-24 text-[#DAA520]" />
                            </div>
                            <div className="bg-[#F4E4BC]/5 p-6 rounded-xl border border-[#DAA520]/20 min-h-[120px] shadow-inner backdrop-blur-sm relative z-10">
                                <p className="text-[#F4E4BC] text-base leading-relaxed whitespace-pre-wrap font-[family-name:var(--font-cairo)] text-justify">
                                    {selectedBroadcast.message}
                                </p>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-center pt-4 border-t border-[#DAA520]/30">
                            <GoldButton onClick={() => setSelectedBroadcast(null)} className="px-8 py-2 text-base">
                                علم
                            </GoldButton>
                        </div>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>

      {/* Smart Lesson Chronicle Modal */}
      <AnimatePresence>
          {showLessonModal && (
            <FantasyModal onClose={() => setShowLessonModal(false)} title="توثيق حصة جديدة" className="max-h-[90vh] overflow-y-auto custom-scrollbar">
                 <form onSubmit={handleCreateLesson} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الفصل الدراسي</label>
                            <select 
                                required
                                value={lessonForm.classId}
                                onChange={(e) => setLessonForm({...lessonForm, classId: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                            >
                                <option value="">اختر الفصل...</option>
                                {teacherClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">المادة / الموضوع</label>
                            <input 
                                type="text" 
                                required
                                value={lessonForm.subject}
                                onChange={(e) => setLessonForm({...lessonForm, subject: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                placeholder="مثال: الكسور العشرية" 
                            />
                        </div>
                    </div>

                    {/* Attendance Checklist - Interactive */}
                    <div className="bg-[#DAA520]/10 border border-[#DAA520]/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-[#DAA520]" />
                                <div>
                                    <h4 className="text-[#FFD700] font-bold">تحضير الطلاب</h4>
                                    <p className="text-[#F4E4BC]/60 text-xs">سجل الحضور والغياب لهذه الحصة</p>
                                </div>
                            </div>
                            <div className="text-[#F4E4BC]/60 text-xs">
                                {lessonAttendance.filter(s => s.present).length} / {lessonAttendance.length} حاضر
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                            {lessonAttendance.map((student, index) => (
                                <div key={student.id} className={cn(
                                    "flex items-center justify-between p-2 rounded border transition-colors",
                                    student.present ? "bg-[#4ECDC4]/10 border-[#4ECDC4]/30" : "bg-[#FF6B6B]/10 border-[#FF6B6B]/30"
                                )}>
                                    <span className="text-[#F4E4BC] text-sm">{student.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newAttendance = [...lessonAttendance];
                                            newAttendance[index].present = !newAttendance[index].present;
                                            setLessonAttendance(newAttendance);
                                        }}
                                        className={cn(
                                            "px-2 py-0.5 rounded text-xs font-bold transition-colors",
                                            student.present ? "bg-[#4ECDC4]/20 text-[#4ECDC4] hover:bg-[#4ECDC4]/30" : "bg-[#FF6B6B]/20 text-[#FF6B6B] hover:bg-[#FF6B6B]/30"
                                        )}
                                    >
                                        {student.present ? "حاضر" : "غائب"}
                                    </button>
                                </div>
                            ))}
                            {lessonAttendance.length === 0 && (
                                <p className="col-span-full text-center text-[#F4E4BC]/40 text-sm py-4">اختر الفصل أولاً لعرض قائمة الطلاب</p>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">ملخص الحصة</label>
                        <textarea 
                            rows={3} 
                            required
                            value={lessonForm.summary}
                            onChange={(e) => setLessonForm({...lessonForm, summary: e.target.value})}
                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                            placeholder="اكتب ملخصاً سريعاً لما تم شرحه..."
                        ></textarea>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">صورة من السبورة / النشاط (اختياري)</label>
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                value={lessonForm.imageUrl}
                                onChange={(e) => setLessonForm({...lessonForm, imageUrl: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                placeholder="رابط الصورة..."
                             />
                             <div className="p-3 bg-[#000]/30 border border-[#5D4037] rounded-lg text-[#F4E4BC]/50">
                                <ImageIcon className="w-6 h-6" />
                             </div>
                        </div>
                    </div>

                    {/* End of Day Questions */}
                    <div className="border-t border-[#5D4037] pt-6">
                        <h3 className="text-[#FFD700] font-bold text-lg mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            أسئلة نهاية اليوم (التحدي المسائي)
                        </h3>
                        
                        {/* Questions List */}
                        <div className="space-y-3 mb-4">
                            {lessonForm.questions.map((q, i) => (
                                <div key={i} className="bg-[#000]/30 p-3 rounded border border-[#5D4037] flex justify-between items-center">
                                    <span className="text-[#F4E4BC] text-sm truncate max-w-[80%]">{i + 1}. {q.text}</span>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const newQuestions = [...lessonForm.questions];
                                            newQuestions.splice(i, 1);
                                            setLessonForm({...lessonForm, questions: newQuestions});
                                        }}
                                        className="text-[#FF6B6B] hover:text-[#FF6B6B]/80"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {lessonForm.questions.length === 0 && (
                                <p className="text-[#F4E4BC]/40 text-sm text-center py-2">أضف 1-3 أسئلة لتظهر للطلاب كتحدي مسائي</p>
                            )}
                        </div>

                        {/* Add Question Form */}
                        {lessonForm.questions.length < 3 && (
                            <div className="bg-[#2A1B0E]/50 p-4 rounded-lg border border-[#5D4037]/50">
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        value={currentLessonQuestion.text}
                                        onChange={(e) => setCurrentLessonQuestion({...currentLessonQuestion, text: e.target.value})}
                                        className="w-full bg-[#000]/30 border border-[#5D4037] rounded p-2 text-[#F4E4BC] text-sm focus:border-[#DAA520] outline-none"
                                        placeholder="نص السؤال..."
                                    />
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        {currentLessonQuestion.options.map((opt, i) => (
                                            <input 
                                                key={i}
                                                type="text" 
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOpts = [...currentLessonQuestion.options];
                                                    newOpts[i] = e.target.value;
                                                    setCurrentLessonQuestion({...currentLessonQuestion, options: newOpts});
                                                }}
                                                className={`w-full bg-[#000]/30 border rounded p-2 text-[#F4E4BC] text-xs outline-none ${currentLessonQuestion.correctAnswer === i.toString() ? 'border-[#4ECDC4]' : 'border-[#5D4037]'}`}
                                                placeholder={`الخيار ${i + 1} ${currentLessonQuestion.correctAnswer === i.toString() ? '(الصحيح)' : ''}`}
                                            />
                                        ))}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-xs text-[#F4E4BC]/60">
                                        <span>الإجابة الصحيحة:</span>
                                        {[0, 1, 2, 3].map(i => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setCurrentLessonQuestion({...currentLessonQuestion, correctAnswer: i.toString()})}
                                                className={`w-6 h-6 rounded-full border ${currentLessonQuestion.correctAnswer === i.toString() ? 'bg-[#4ECDC4] text-[#0a192f] border-[#4ECDC4]' : 'border-[#5D4037]'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <GoldButton type="button" onClick={handleAddLessonQuestion} className="w-full py-2 text-sm mt-2" variant="secondary">
                                        <Plus className="w-4 h-4 ml-2 inline" />
                                        إضافة السؤال
                                    </GoldButton>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-[#DAA520]/30 mt-6">
                        <button type="button" onClick={() => setShowLessonModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                        <GoldButton type="submit" className="px-8 shadow-[0_0_20px_rgba(218,165,32,0.4)]">
                             حفظ وتوثيق
                        </GoldButton>
                    </div>
                 </form>
            </FantasyModal>
          )}
      </AnimatePresence>

      {/* Competition Modal */}
      <AnimatePresence>
          {showCompetitionModal && (
            <FantasyModal onClose={() => setShowCompetitionModal(false)} title="إطلاق منافسة جديدة">
                 <form onSubmit={handleCreateCompetition} className="space-y-4">
                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">عنوان المنافسة</label>
                        <input 
                            type="text" 
                            required
                            value={competitionForm.title}
                            onChange={(e) => setCompetitionForm({...competitionForm, title: e.target.value})}
                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                            placeholder="مثال: دوري فرسان الرياضيات" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">المادة</label>
                            <input 
                                type="text" 
                                required
                                value={competitionForm.subject}
                                onChange={(e) => setCompetitionForm({...competitionForm, subject: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                placeholder="الرياضيات" 
                            />
                        </div>
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الصف المستهدف</label>
                            <select 
                                required
                                value={competitionForm.grade}
                                onChange={(e) => setCompetitionForm({...competitionForm, grade: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                            >
                                <option value="">اختر الصف...</option>
                                {teacherClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">وصف قصير</label>
                        <textarea 
                            rows={3}
                            value={competitionForm.description}
                            onChange={(e) => setCompetitionForm({...competitionForm, description: e.target.value})}
                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                            placeholder="وصف قواعد المنافسة..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">المدة (دقيقة)</label>
                            <input 
                                type="number" 
                                required
                                value={competitionForm.durationMinutes}
                                onChange={(e) => setCompetitionForm({...competitionForm, durationMinutes: Number(e.target.value)})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-[#FFD700] mb-2 font-[family-name:var(--font-cairo)]">جائزة الذهب</label>
                            <input 
                                type="number" 
                                required
                                value={competitionForm.rewardGold}
                                onChange={(e) => setCompetitionForm({...competitionForm, rewardGold: Number(e.target.value)})}
                                className="w-full bg-[#000]/30 border border-[#FFD700] rounded-lg p-3 text-[#FFD700] focus:border-[#DAA520] outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-[#4ECDC4] mb-2 font-[family-name:var(--font-cairo)]">جائزة XP</label>
                            <input 
                                type="number" 
                                required
                                value={competitionForm.rewardXP}
                                onChange={(e) => setCompetitionForm({...competitionForm, rewardXP: Number(e.target.value)})}
                                className="w-full bg-[#000]/30 border border-[#4ECDC4] rounded-lg p-3 text-[#4ECDC4] focus:border-[#DAA520] outline-none" 
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-[#DAA520]/30 mt-2">
                        <button type="button" onClick={() => setShowCompetitionModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                        <GoldButton type="submit" className="px-8 shadow-[0_0_20px_rgba(218,165,32,0.4)]">
                             إطلاق المنافسة
                        </GoldButton>
                    </div>
                 </form>
            </FantasyModal>
          )}
      </AnimatePresence>

      <AtherMind />
    </>
  );
}

export default function TeacherHallPage() {
  return (
    <Suspense fallback={null}>
      <TeacherHallPageInner />
    </Suspense>
  );
}
