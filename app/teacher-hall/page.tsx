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
  Image as ImageIcon
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
  const { name, submissions, gradeQuest, allUsers, classes, logout, addQuest, role, acceptedQuests, acceptQuest, addCoins, submitQuest, quests, addBehaviorRequest, supportMessages, markSupportMessageAsRead, addToSchedule, addToWeeklyPlan, schedule, weeklyPlan, addQuestion, questionBank, behaviorRecords } = useUser();
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

  const handleAction = (action: string) => {
    if (action === "إنشاء مهمة جديدة") {
        setShowCreateModal(true);
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
                    Teacher's Assignments
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
               {[
                 { title: "حل مسائل القسمة المطولة", class: "الصف الأول - أ", due: "غداً", submitted: "15/25", status: "active" },
                 { title: "مشروع تاريخ الأندلس", class: "الصف الثاني - ب", due: "بعد 3 أيام", submitted: "5/22", status: "active" },
                 { title: "اختبار العلوم القصير", class: "الصف الثالث - ج", due: "الأسبوع القادم", submitted: "0/28", status: "draft" },
               ].map((task, i) => (
                 <div key={i} className="bg-[#2A1B0E]/60 p-4 rounded-lg border border-[#5D4037] hover:border-[#DAA520] flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className={cn(
                         "w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
                         task.status === 'active' ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" : "bg-[#F4E4BC]/10 text-[#F4E4BC]/50"
                       )}>
                         {task.status === 'active' ? "📝" : "✏️"}
                       </div>
                       <div>
                          <h4 className="text-[#F4E4BC] font-bold text-lg">{task.title}</h4>
                          <p className="text-[#F4E4BC]/60 text-sm flex gap-3">
                             <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {task.class}</span>
                             <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.due}</span>
                          </p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                       <div className="text-center">
                          <span className="block text-[#FFD700] font-bold text-xl">{task.submitted}</span>
                          <span className="text-[#F4E4BC]/40 text-xs">تم التسليم</span>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-[#DAA520]/20 rounded text-[#DAA520]" title="تعديل"><FileText className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-[#FF6B6B]/20 rounded text-[#FF6B6B]" title="حذف"><X className="w-4 h-4" /></button>
                       </div>
                    </div>
                 </div>
               ))}
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
         return (
            <div className="h-full flex flex-col">
               <div className="flex gap-4 mb-4 border-b border-[#5D4037] pb-4">
                  <button className="text-[#FFD700] font-bold border-b-2 border-[#FFD700] pb-1">الكل</button>
                  <button className="text-[#F4E4BC]/60 hover:text-[#F4E4BC] pb-1">أولياء الأمور</button>
                  <button className="text-[#F4E4BC]/60 hover:text-[#F4E4BC] pb-1">الإدارة</button>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                  {supportMessages.length === 0 ? (
                      <div className="text-center py-10 text-[#F4E4BC]/50">
                          <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>لا توجد رسائل جديدة.</p>
                      </div>
                  ) : (
                      supportMessages.map((msg) => (
                         <div 
                            key={msg.id} 
                            onClick={() => {
                                setSelectedMessage(msg);
                                if (!msg.read) markSupportMessageAsRead(msg.id);
                            }}
                            className={cn(
                                "p-4 rounded-lg border cursor-pointer transition-colors flex gap-4",
                                msg.read 
                                    ? "bg-[#000]/20 border-[#5D4037] hover:border-[#DAA520]" 
                                    : "bg-[#DAA520]/10 border-[#DAA520]/50 hover:bg-[#DAA520]/20"
                            )}
                         >
                            <div className="w-10 h-10 rounded-full bg-[#5D4037] flex items-center justify-center text-[#F4E4BC] font-bold shrink-0">
                               {msg.senderName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex justify-between items-center mb-1">
                                  <h4 className={cn("font-bold text-sm truncate", !msg.read && "text-[#FFD700]")}>{msg.senderName}</h4>
                                  <span className="text-[#F4E4BC]/40 text-xs whitespace-nowrap">{msg.date}</span>
                               </div>
                               <p className="text-[#F4E4BC]/60 text-xs truncate">{msg.message}</p>
                            </div>
                            {!msg.read && <div className="w-2 h-2 rounded-full bg-[#FF6B6B] self-center" />}
                         </div>
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
        <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center overflow-hidden flex">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />

          {/* Sidebar */}
          <div className="relative z-10 hidden lg:block h-screen sticky top-0 w-64 p-4">
             <div className="bg-[#2A1B0E]/95 h-full rounded-2xl border-2 border-[#DAA520] shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-[#DAA520]/30 text-center">
                    <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">قصر المعلمين</h2>
                    <p className="text-[#F4E4BC]/60 text-xs mt-1">بوابة المعلم</p>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-right",
                                activeView === item.id 
                                    ? "bg-[#DAA520] text-[#2A1B0E] font-bold shadow-[0_0_15px_rgba(218,165,32,0.4)]" 
                                    : "text-[#F4E4BC] hover:bg-[#DAA520]/10 hover:text-[#FFD700]"
                            )}
                        >
                            {item.icon}
                            <span className="font-[family-name:var(--font-cairo)] text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#DAA520]/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#DAA520] flex items-center justify-center text-[#2A1B0E] font-bold">
                            {name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[#F4E4BC] font-bold truncate text-sm">{name}</p>
                            <p className="text-[#F4E4BC]/50 text-xs">معلم رياضيات</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all duration-300 border border-[#FF6B6B]/20"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="font-[family-name:var(--font-cairo)] text-sm">تسجيل الخروج</span>
                    </button>
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 h-screen overflow-y-auto p-4 lg:p-8">
            <div className="w-full max-w-6xl mx-auto flex flex-col min-h-full">
              {/* Header */}
              <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-[#2A1B0E]/80 px-6 py-4 rounded-xl border border-[#DAA520]/30 backdrop-blur-md gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl text-[#FFD700] font-[family-name:var(--font-amiri)]">
                    {navItems.find(i => i.id === activeView)?.label}
                  </h1>
                  <p className="text-[#F4E4BC]/60 text-sm mt-1">
                    {currentDate}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <NotificationCenter />
                  <GoldButton variant="secondary" className="px-6 text-sm" onClick={() => handleAction("مراسلة ولي الأمر")}>
                    <MessageCircle className="w-4 h-4 ml-2 inline" />
                    مراسلة
                  </GoldButton>
                  <GoldButton className="px-6 text-sm" onClick={() => handleAction("إنشاء مهمة جديدة")}>
                    <Plus className="w-4 h-4 ml-2 inline" />
                    مهمة جديدة
                  </GoldButton>
                </div>
              </header>

              {/* Dynamic Content Area */}
              <GameCard className="bg-[#2A1B0E]/90 min-h-[500px] border-[#DAA520]/30">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderContent()}
                    </motion.div>
                 </AnimatePresence>
              </GameCard>
            </div>
          </div>
        </main>
      </PageTransition>

      {/* Create Quest Modal */}
      <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowCreateModal(false)}
              />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
              >
                 <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                    <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">إنشاء مهمة جديدة</h2>
                    <button onClick={() => setShowCreateModal(false)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                        <X className="w-6 h-6" />
                    </button>
                 </div>

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
              </motion.div>
            </div>
          )}
      </AnimatePresence>

      {/* Question Modal */}
      <AnimatePresence>
          {showQuestionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowQuestionModal(false)}
              />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                 <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                    <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">إضافة سؤال جديد</h2>
                    <button onClick={() => setShowQuestionModal(false)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                        <X className="w-6 h-6" />
                    </button>
                 </div>

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
              </motion.div>
            </div>
          )}
      </AnimatePresence>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* Plan/Schedule Modal */}
      <AnimatePresence>
          {showPlanModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowPlanModal(false)}
              />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
              >
                 <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                    <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">
                        {planForm.type === 'schedule' ? 'إضافة حصة للجدول' : 'إضافة عنصر للخطة'}
                    </h2>
                    <button onClick={() => setShowPlanModal(false)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                        <X className="w-6 h-6" />
                    </button>
                 </div>

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
              </motion.div>
            </div>
          )}
      </AnimatePresence>

      {/* Behavior Request Modal */}
      <AnimatePresence>
          {showBehaviorModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowBehaviorModal(false)}
              />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className={cn(
                    "relative z-50 bg-[#2A1B0E] border-2 p-8 rounded-2xl max-w-lg w-full shadow-2xl",
                    behaviorForm.type === 'positive' ? "border-[#4ECDC4]" : "border-[#FF6B6B]"
                )}
              >
                 <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                    <h2 className={cn(
                        "text-2xl font-[family-name:var(--font-amiri)] flex items-center gap-2",
                        behaviorForm.type === 'positive' ? "text-[#4ECDC4]" : "text-[#FF6B6B]"
                    )}>
                        {behaviorForm.type === 'positive' ? <Star className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                        {behaviorForm.type === 'positive' ? "تسجيل تعزيز سلوكي" : "تسجيل ملاحظة سلوكية"}
                    </h2>
                    <button onClick={() => setShowBehaviorModal(false)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                        <X className="w-6 h-6" />
                    </button>
                 </div>

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
              </motion.div>
            </div>
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
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSelectedMessage(null)}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full bg-[#5D4037] flex items-center justify-center text-[#F4E4BC] font-bold text-xl">
                                {selectedMessage.senderName.charAt(0)}
                             </div>
                             <div>
                                 <h2 className="text-xl text-[#FFD700] font-[family-name:var(--font-amiri)]">
                                     {selectedMessage.senderName}
                                 </h2>
                                 <p className="text-[#F4E4BC]/50 text-xs">{selectedMessage.date}</p>
                             </div>
                        </div>
                        <button onClick={() => setSelectedMessage(null)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-4 text-sm text-[#F4E4BC]/70 bg-[#000]/20 p-4 rounded-lg">
                            {selectedMessage.mobile && (
                                <span className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-[#DAA520]" />
                                    {selectedMessage.mobile}
                                </span>
                            )}
                            {selectedMessage.email && (
                                <span className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-[#DAA520]" />
                                    {selectedMessage.email}
                                </span>
                            )}
                            {selectedMessage.type && (
                                <span className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-[#DAA520]" />
                                    {selectedMessage.type}
                                </span>
                            )}
                        </div>

                        <div className="bg-[#F4E4BC]/5 p-6 rounded-xl border border-[#DAA520]/20 min-h-[150px]">
                            <p className="text-[#F4E4BC] leading-relaxed whitespace-pre-wrap">
                                {selectedMessage.message}
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 flex justify-end">
                        <GoldButton onClick={() => setSelectedMessage(null)} className="px-8">
                            إغلاق
                        </GoldButton>
                    </div>
                </motion.div>
            </div>
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
