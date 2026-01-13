"use client";

import { useState, useEffect } from "react";
import GameCard from "@/components/GameCard";
import GoldButton from "@/components/GoldButton";
import SidebarWorld from "@/components/SidebarWorld";
import { 
  BarChart3, 
  FileText, 
  LayoutDashboard, 
  Users, 
  Settings, 
  X, 
  Save, 
  Home, 
  Layers, 
  Bell, 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Search,
  Filter,
  MoreVertical,
  Plus,
  Trash2,
  Edit2,
  Link as LinkIcon,
  School,
  LogOut,
  CheckSquare,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Mail,
  Smartphone,
  Gem,
  Coins,
  Crown,
  Scale,
  Send,
  Scroll,
  Megaphone,
  Clock,
  Calendar,
  Brain,
  Swords,
  Map as MapIcon,
  BrainCircuit,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  FileDown,
  Printer
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import MobileNav from "@/components/MobileNav";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, UserData, ClassData, SupportMessage, ScheduleItem } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import ProfileModal from "@/components/ProfileModal";
import NotificationCenter from "@/components/NotificationCenter";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

const CollapsibleSection = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#5D4037] rounded-lg overflow-hidden bg-[#000]/20 mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#2A1B0E]/50 hover:bg-[#2A1B0E] transition-colors"
      >
        <h3 className="text-lg font-bold text-[#F4E4BC] font-[family-name:var(--font-cairo)]">{title}</h3>
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

export default function LeadershipPalacePage() {
  const [activeView, setActiveView] = useState('home');
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('ar-SA'));
  }, []);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [advisorClassId, setAdvisorClassId] = useState<string>('all');
  const [monitorTeacherId, setMonitorTeacherId] = useState<string>('all');
  const [advisorRange, setAdvisorRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  
  const router = useRouter();

  // User Modal States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [activeUserTab, setActiveUserTab] = useState<'student' | 'teacher' | 'parent'>('student');
  const [searchQuery, setSearchQuery] = useState("");
  const [newUser, setNewUser] = useState<Partial<UserData>>({ role: 'student' });
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // Class Modal States
  const [showClassModal, setShowClassModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [classForm, setClassForm] = useState<{name: string, grade: string, capacity: number, teacherId: string}>({ name: "", grade: "", capacity: 30, teacherId: "" });

  const { name, allUsers: users, classes, stages, addUser, removeUser, updateUser, addClass, removeClass, updateClass, addStage, removeStage, logout, quests, updateQuestStatus, supportMessages, marketItems, addMarketItem, removeMarketItem, behaviorRecords, processBehaviorRequest, markSupportMessageAsRead, broadcasts, sendBroadcast, schedule, addToSchedule, updateScheduleItem, removeScheduleItem, weeklyPlan, attendanceRecords, questionBank, addQuestion, updateQuestionStatus: updateBankQuestionStatus, deleteQuestion, competitions, addCompetition, submissions, mapNodes, addMapNode, updateMapNode, deleteMapNode, purchaseLogs } = useUser();
  const { showToast } = useToast();

  // Knowledge Map States
  const [showMapNodeModal, setShowMapNodeModal] = useState(false);
  const [editingMapNode, setEditingMapNode] = useState<any | null>(null);
  const [mapNodeForm, setMapNodeForm] = useState({
      title: "",
      type: "island",
      x: 50,
      y: 50,
      description: "",
      levelReq: 1,
      questionsCount: 5,
      subject: "General",
      status: "locked",
      // New: Manual Questions for Map Node
      customQuestions: [] as any[]
  });

  // State for adding a single question to the map node
  const [mapQuestionForm, setMapQuestionForm] = useState({
      text: "",
      correctAnswer: "",
      options: ["", "", "", ""],
      difficulty: "medium"
  });

  const handleAddMapQuestion = () => {
      if (!mapQuestionForm.text || !mapQuestionForm.correctAnswer) return;
      setMapNodeForm(prev => ({
          ...prev,
          customQuestions: [...prev.customQuestions, {
              ...mapQuestionForm,
              id: `mq_${Date.now()}_${Math.random()}`,
              type: 'mcq'
          }]
      }));
      setMapQuestionForm({
          text: "",
          correctAnswer: "",
          options: ["", "", "", ""],
          difficulty: "medium"
      });
  };

  const handleSaveMapNode = (e: React.FormEvent) => {
      e.preventDefault();
      
      const nodeData = {
          ...mapNodeForm,
          x: parseInt(mapNodeForm.x as any),
          y: parseInt(mapNodeForm.y as any),
          levelReq: parseInt(mapNodeForm.levelReq as any),
          questionsCount: parseInt(mapNodeForm.questionsCount as any),
          status: mapNodeForm.status as any,
          type: mapNodeForm.type as any,
          // Save custom questions if any
          customQuestions: mapNodeForm.customQuestions
      };

      if (editingMapNode) {
          updateMapNode({ ...editingMapNode, ...nodeData });
          showToast("تم تحديث المحطة بنجاح", "success");
      } else {
          addMapNode({
              id: Date.now().toString(),
              ...nodeData
          });
          showToast("تم إضافة المحطة الجديدة", "success");
      }
      setShowMapNodeModal(false);
      setEditingMapNode(null);
      setMapNodeForm({ title: "", type: "island", x: 50, y: 50, description: "", levelReq: 1, questionsCount: 5, subject: "General", status: "locked", customQuestions: [] });
  };

  const openMapNodeModal = (node?: any) => {
      if (node) {
          setEditingMapNode(node);
          setMapNodeForm({
              title: node.title,
              type: node.type,
              x: node.x,
              y: node.y,
              description: node.description,
              levelReq: node.levelReq,
              questionsCount: node.questionsCount || 5,
              subject: node.subject || "General",
              status: node.status,
              customQuestions: node.customQuestions || []
          });
      } else {
          setEditingMapNode(null);
          setMapNodeForm({ title: "", type: "island", x: 50, y: 50, description: "", levelReq: 1, questionsCount: 5, subject: "General", status: "locked", customQuestions: [] });
      }
      setShowMapNodeModal(true);
  };

  const handleSaveMapNode = (e: React.FormEvent) => {
      e.preventDefault();
      const nodeData = {
          title: mapNodeForm.title,
          type: mapNodeForm.type as any,
          x: Number(mapNodeForm.x),
          y: Number(mapNodeForm.y),
          description: mapNodeForm.description,
          levelReq: Number(mapNodeForm.levelReq),
          questionsCount: Number(mapNodeForm.questionsCount),
          subject: mapNodeForm.subject,
          status: mapNodeForm.status as any,
          customQuestions: mapNodeForm.customQuestions || []
      };

      if (editingMapNode) {
          updateMapNode({ ...editingMapNode, ...nodeData });
          showToast("تم تحديث المحطة بنجاح", "success");
      } else {
          addMapNode({
              id: Date.now().toString(),
              ...nodeData
          });
          showToast("تم إضافة المحطة بنجاح", "success");
      }
      setShowMapNodeModal(false);
  };

  // Market Modal States
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [editingMarketItem, setEditingMarketItem] = useState<any | null>(null);
  const [marketItemForm, setMarketItemForm] = useState({
      name: "",
      description: "",
      price: 100,
      rarity: "common",
      image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=magical%20item%20treasure&image_size=square",
      type: "item"
  });

  const handleSaveMarketItem = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingMarketItem) {
          // Update Logic (Assuming updateMarketItem exists or using remove/add)
          // Since updateMarketItem is not exposed in destructuring above, I might need to add it or simulate it
          // But looking at destructuring: marketItems, addMarketItem, removeMarketItem are there.
          // Let's implement update by removing and re-adding for now or checking context
          removeMarketItem(editingMarketItem.id);
          addMarketItem({ ...editingMarketItem, ...marketItemForm, price: parseInt(marketItemForm.price as any) });
          showToast("تم تحديث الكنز بنجاح", "success");
      } else {
          addMarketItem({
              id: Date.now().toString(),
              ...marketItemForm,
              price: parseInt(marketItemForm.price as any),
              rarity: marketItemForm.rarity as any,
              type: marketItemForm.type as any
          });
          showToast("تم إضافة الكنز الجديد", "success");
      }
      setShowMarketModal(false);
      setEditingMarketItem(null);
      setMarketItemForm({ name: "", description: "", price: 100, rarity: "common", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=magical%20item%20treasure&image_size=square", type: "item" });
  };

  const handleDeleteMarketItem = (id: string) => {
      if (confirm("هل أنت متأكد من حذف هذا الكنز؟")) {
          removeMarketItem(id);
          showToast("تم حذف الكنز", "info");
      }
  };

  // Schedule Modal States
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState<{day: string, time: string, subject: string, teacherId: string, type: 'in-person' | 'remote', duration: number, meetingUrl: string}>({
      day: "الأحد", time: "08:00", subject: "", teacherId: "", type: "in-person", duration: 45, meetingUrl: ""
  });
  const [editingScheduleItem, setEditingScheduleItem] = useState<ScheduleItem | null>(null);

  // Question Bank State
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [questionCategory, setQuestionCategory] = useState<'accuracy' | 'speed' | 'intelligence'>('accuracy');

  // Competition State
  const [showCompModal, setShowCompModal] = useState(false);
  const [compForm, setCompForm] = useState({
      title: "",
      description: "",
      subject: "",
      grade: "",
      startTime: "",
      durationMinutes: 10,
      rewards: { gold: 100, xp: 50 },
      questionCount: 5,
      source: 'bank' as 'bank' | 'manual',
      manualQuestions: [] as any[]
  });

  const [newQuestionForm, setNewQuestionForm] = useState({
      text: "",
      correctAnswer: "",
      options: ["", "", "", ""],
      difficulty: "medium"
  });

  const handleAddManualQuestion = () => {
      if (!newQuestionForm.text || !newQuestionForm.correctAnswer) return;
      setCompForm(prev => ({
          ...prev,
          manualQuestions: [...prev.manualQuestions, {
              ...newQuestionForm,
              id: `temp_${Date.now()}_${Math.random()}`,
              type: 'mcq'
          }]
      }));
      setNewQuestionForm({
          text: "",
          correctAnswer: "",
          options: ["", "", "", ""],
          difficulty: "medium"
      });
  };

  const handleCreateCompetition = (e: React.FormEvent) => {
      e.preventDefault();
      
      let finalQuestionIds: string[] = [];

      if (compForm.source === 'bank') {
          // Select random approved questions for the subject/grade
          const eligibleQuestions = questionBank.filter(q => 
              q.status === 'approved' && 
              q.subject === compForm.subject && 
              q.grade === compForm.grade
          );
          
          if (eligibleQuestions.length < compForm.questionCount) {
              showToast(`عذراً، يوجد فقط ${eligibleQuestions.length} سؤال معتمد لهذا المسار. الرجاء تقليل عدد الأسئلة أو اعتماد المزيد.`, "error");
              return;
          }

          // Shuffle and slice
          finalQuestionIds = eligibleQuestions
              .sort(() => 0.5 - Math.random())
              .slice(0, compForm.questionCount)
              .map(q => q.id);
      } else {
          // Manual Questions
          if (compForm.manualQuestions.length === 0) {
              showToast("الرجاء إضافة سؤال واحد على الأقل", "error");
              return;
          }

          // Generate IDs for manual questions
          finalQuestionIds = compForm.manualQuestions.map(mq => {
              // Use consistent ID generation
              // Since we are inside a loop, Date.now() might be same, so use random
              return `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          });

          // Add manual questions to bank first
          compForm.manualQuestions.forEach((mq, index) => {
              addQuestion({
                  id: finalQuestionIds[index], // Pass the pre-generated ID
                  text: mq.text,
                  type: 'mcq',
                  options: mq.options,
                  correctAnswer: mq.correctAnswer,
                  subject: compForm.subject,
                  grade: compForm.grade,
                  difficulty: mq.difficulty as any,
                  category: 'accuracy', // Default
                  authorId: 1 // Admin ID
              });
              // Auto-approve these manual questions since Admin added them
              // We need a small timeout or assume context update is fast enough for next step, 
              // but context updates are async. However, since we pass IDs to competition directly,
              // it doesn't matter if they are in bank state immediately for this function, 
              // as long as they are there when student loads them.
              // We should also update their status to 'approved'
              setTimeout(() => {
                  updateBankQuestionStatus(finalQuestionIds[index], 'approved', 'accuracy');
              }, 100);
          });
      }

      addCompetition({
          title: compForm.title,
          description: compForm.description,
          subject: compForm.subject,
          grade: compForm.grade,
          startTime: new Date(compForm.startTime).toISOString(),
          durationMinutes: compForm.durationMinutes,
          status: 'upcoming',
          questionIds: finalQuestionIds,
          rewards: compForm.rewards,
          createdBy: 1 // Admin ID placeholder
      });
      
      setShowCompModal(false);
      showToast("تم إنشاء المنافسة بنجاح!", "success");
      setCompForm({
          title: "",
          description: "",
          subject: "",
          grade: "",
          startTime: "",
          durationMinutes: 10,
          rewards: { gold: 100, xp: 50 },
          questionCount: 5,
          source: 'bank',
          manualQuestions: []
      });
  };

  const [selectedCompetition, setSelectedCompetition] = useState<any | null>(null);

  // --- Schedule Handlers ---
  const handleOpenScheduleModal = (item?: ScheduleItem, day?: string, time?: string) => {
      if (item) {
          setEditingScheduleItem(item);
          setScheduleForm({
              day: item.day,
              time: item.time,
              subject: item.subject,
              teacherId: item.teacherId ? item.teacherId.toString() : "",
              type: item.type,
              duration: item.duration,
              meetingUrl: item.meetingUrl || ""
          });
      } else {
          setEditingScheduleItem(null);
          setScheduleForm({
              day: day || "الأحد",
              time: time || "08:00",
              subject: "",
              teacherId: "",
              type: "in-person",
              duration: 45,
              meetingUrl: ""
          });
      }
      setShowScheduleModal(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedClassId) {
          showToast("الرجاء اختيار الفصل الدراسي أولاً", "error");
          return;
      }

      const teacherId = parseInt(scheduleForm.teacherId);
      
      // Conflict Detection
      const conflict = schedule.find(s => 
          s.day === scheduleForm.day && 
          s.time === scheduleForm.time && 
          s.id !== (editingScheduleItem?.id || "") // Ignore self when editing
      );

      if (conflict) {
          // Check for Teacher Conflict
          if (conflict.teacherId === teacherId) {
             const conflictClass = classes.find(c => c.id === conflict.classId)?.name || "فصل آخر";
             showToast(`تنبيه: المعلم لديه حصة في نفس الوقت مع ${conflictClass}`, "error");
             return;
          }
          
          // Check for Class Conflict
          if (conflict.classId === selectedClassId) {
              showToast("تنبيه: هذا الفصل لديه حصة مسجلة بالفعل في هذا التوقيت", "error");
              return;
          }
      }

      const itemData: any = {
          day: scheduleForm.day,
          time: scheduleForm.time,
          subject: scheduleForm.subject,
          type: scheduleForm.type,
          duration: scheduleForm.duration,
          meetingUrl: scheduleForm.meetingUrl,
          classId: selectedClassId,
          teacherId: teacherId || undefined
      };

      if (editingScheduleItem) {
          updateScheduleItem({ ...editingScheduleItem, ...itemData });
          showToast("تم تحديث الحصة بنجاح", "success");
      } else {
          addToSchedule(itemData);
          showToast("تم إضافة الحصة للجدول", "success");
      }

      setShowScheduleModal(false);
  };

  const handleDeleteScheduleItem = (id: string) => {
      if (confirm("هل أنت متأكد من حذف هذه الحصة من الجدول؟")) {
          removeScheduleItem(id);
          showToast("تم حذف الحصة", "info");
      }
  };


  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);

  const handleMessageClick = (msg: SupportMessage) => {
      setSelectedMessage(msg);
      if (!msg.read) {
          markSupportMessageAsRead(msg.id);
      }
  };

  const [activeMessageTab, setActiveMessageTab] = useState<'inbox' | 'compose' | 'history'>('inbox');
  const [broadcastForm, setBroadcastForm] = useState<{title: string, message: string, target: string, type: string}>({
      title: "", message: "", target: "all", type: "info"
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
      e.preventDefault();
      sendBroadcast({
          senderName: name,
          title: broadcastForm.title,
          message: broadcastForm.message,
          targetRole: broadcastForm.target as any,
          type: broadcastForm.type as any
      });
      showToast("تم إصدار المرسوم وإرساله بنجاح", "success");
      setBroadcastForm({ title: "", message: "", target: "all", type: "info" });
      setActiveMessageTab('history');
  };

  const handleLogout = () => {
    logout();
    router.push('/gate');
  };

  const handleOpenUserModal = (user?: UserData) => {
      if (user) {
          setEditingUser(user);
          setNewUser({ ...user }); // Populate form
      } else {
          setEditingUser(null);
          setNewUser({ role: activeUserTab, password: "123" }); // Default password for new users
      }
      setShowAddUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (editingUser) {
          // Update existing
          updateUser({ ...editingUser, ...newUser } as UserData);
          showToast("تم تحديث بيانات المستخدم بنجاح", "success");
      } else {
          // Add new
          const id = Math.floor(Math.random() * 10000);
          const userToAdd = { ...newUser, id, role: activeUserTab } as UserData;
          addUser(userToAdd);
          showToast("تم إضافة المستخدم بنجاح", "success");
      }
      
      setShowAddUserModal(false);
      setNewUser({});
      setEditingUser(null);
  };

  const handleDeleteUser = (id: number) => {
      if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
          removeUser(id);
          showToast("تم حذف المستخدم", "info");
      }
  };

  // --- Class Handlers ---
  const handleOpenClassModal = (cls?: ClassData) => {
      if (cls) {
          setEditingClass(cls);
          // Find current teacher
          const teacher = users.find(u => u.role === 'teacher' && u.assignedClasses?.includes(cls.id));
          setClassForm({
              name: cls.name,
              grade: cls.grade,
              capacity: cls.capacity,
              teacherId: teacher ? teacher.id.toString() : ""
          });
      } else {
          setEditingClass(null);
          setClassForm({ name: "", grade: stages[0] || "", capacity: 30, teacherId: "" });
      }
      setShowClassModal(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
      e.preventDefault();
      
      let currentClassId = editingClass ? editingClass.id : classForm.name; // Simple ID generation

      if (editingClass) {
          updateClass({ id: editingClass.id, name: classForm.name, grade: classForm.grade, capacity: classForm.capacity });
      } else {
          if (classes.some(c => c.id === currentClassId)) {
              showToast("يوجد فصل بهذا الاسم بالفعل", "error");
              return;
          }
          addClass({ id: currentClassId, name: classForm.name, grade: classForm.grade, capacity: classForm.capacity });
      }

      // Handle Teacher Assignment
      if (classForm.teacherId) {
          const teacherId = parseInt(classForm.teacherId);
          const teacher = users.find(u => u.id === teacherId);
          
          if (teacher) {
             const assigned = teacher.assignedClasses || [];
             if (!assigned.includes(currentClassId)) {
                 updateUser({ ...teacher, assignedClasses: [...assigned, currentClassId] });
             }
          }
      }

      setShowClassModal(false);
      showToast(editingClass ? "تم تحديث بيانات الفصل" : "تم إضافة الفصل بنجاح", "success");
  };

  const handleDeleteClass = (id: string) => {
      if (confirm("هل أنت متأكد من حذف هذا الفصل؟ سيتم فك ارتباط الطلاب والمعلمين به.")) {
          removeClass(id);
          showToast("تم حذف الفصل", "info");
      }
  };

  const getParentName = (parentId?: number | null) => {
      if (!parentId) return "غير مرتبط";
      const parent = users.find(u => u.id === Number(parentId));
      return parent ? parent.name : "غير معروف";
  };

  const getStudentCount = (classId: string) => {
      return users.filter(u => u.role === 'student' && u.classId === classId).length;
  };

  const handleAction = (action: string) => {
    if (action === "الإعدادات") {
        setShowSettingsModal(true);
    } else if (action === "إصدار التقارير") {
        showToast("جاري إنشاء التقرير الشامل...", "info");
        setTimeout(() => {
            showToast("تم إصدار التقرير وإرساله للبريد الإلكتروني", "success");
        }, 2000);
    } else if (action === "تصدير PDF") {
        showToast("جاري تحضير ملف PDF...", "info");
    } else {
        showToast(`ميزة "${action}" قيد التطوير حالياً`, "info");
    }
  };

  const navItems = [
    { id: 'home', icon: <Home />, label: "بوابة القصر" },
    { id: 'users', icon: <Users />, label: "سجل المواطنين" },
    { id: 'classes', icon: <Layers />, label: "تنظيم القاعات" },
    { id: 'schedule', icon: <Calendar />, label: "نسج الرحلات" },
    { id: 'monitoring', icon: <LayoutDashboard />, label: "المتابعة الأكاديمية" },
    { id: 'competitions', icon: <Swords />, label: "إدارة المنافسات" },
    { id: 'approvals', icon: <CheckSquare />, label: "اعتماد المهام" },
    { id: 'behavior', icon: <Scale />, label: "ميزان السلوك" },
    { id: 'questions-approval', icon: <Brain />, label: "اعتماد الأسئلة" },
    { id: 'treasures', icon: <Gem />, label: "خزنة الكنوز" },
    { id: 'market_logs', icon: <ShoppingBag />, label: "سجل المبيعات" },
    { id: 'reports', icon: <BarChart3 />, label: "مرصد الأداء" },
    { id: 'messages', icon: <Bell />, label: "إشعارات المملكة" },
    { id: 'ai', icon: <Bot />, label: "مستشار المملكة" },
    { id: 'settings', icon: <Settings />, label: "أدوات القصر" },
    { id: 'knowledge-maps', icon: <MapIcon />, label: "خرائط المعرفة" },
  ];

  // --- Mock Data ---
  const stats = [
    { label: "إجمالي الطلاب", value: users.filter(u => u.role === 'student').length, change: "+5%", color: "text-[#4ECDC4]" },
    { label: "المعلمون", value: users.filter(u => u.role === 'teacher').length, change: "+2%", color: "text-[#FFD700]" },
    { label: "نسبة الحضور", value: "94%", change: "-1%", color: "text-[#FF6B6B]" },
    { label: "المهام المنجزة", value: 3400, change: "+12%", color: "text-[#DAA520]" },
  ];

  const reportsData = [
    { id: 1, title: "تقرير الأداء الأكاديمي", type: "أكاديمي", color: "bg-[#4ECDC4]/20 border-[#4ECDC4]", desc: "تحليل شامل لدرجات الطلاب ومستويات التقدم في جميع المواد." },
    { id: 2, title: "تقرير السلوك والمواظبة", type: "سلوكي", color: "bg-[#FF6B6B]/20 border-[#FF6B6B]", desc: "رصد حالات الغياب والتأخر والمخالفات السلوكية." },
    { id: 3, title: "تقرير النشاط اللاصفي", type: "نشاط", color: "bg-[#FFD700]/20 border-[#FFD700]", desc: "مشاركة الطلاب في الأندية والفعاليات المدرسية." },
    { id: 4, title: "التقرير المالي", type: "مالي", color: "bg-[#DAA520]/20 border-[#DAA520]", desc: "الميزانية المصروفة على الأنشطة والمكافآت." },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037] flex flex-col items-center">
                  <h4 className="text-[#F4E4BC]/70 text-sm mb-2 font-[family-name:var(--font-cairo)]">{stat.label}</h4>
                  <span className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</span>
                  <span className="text-xs text-[#F4E4BC]/50">{stat.change} عن الشهر الماضي</span>
                </div>
              ))}
            </div>

            <CollapsibleSection title="آخر النشاطات" defaultOpen={true}>
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar p-1">
                {Array.from({ length: 7 }, (_, i) => i + 1).map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#DAA520]/5 rounded border border-[#DAA520]/20 hover:bg-[#DAA520]/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#DAA520]/20 flex items-center justify-center text-[#DAA520]">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[#F4E4BC] text-sm">
                            {i % 3 === 0 ? "قام المعلم أحمد بنشر مهمة جديدة" : 
                             i % 3 === 1 ? "تم تسجيل طالب جديد في النظام" : 
                             "تم تحديث بيانات الفصل الدراسي"}
                        </p>
                        <p className="text-[#F4E4BC]/40 text-xs">منذ {i * 15 + 2} دقيقة</p>
                      </div>
                    </div>
                    <button className="text-[#DAA520] text-xs hover:underline">التفاصيل</button>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="تنبيهات النظام">
              <p className="text-[#F4E4BC]/60 text-sm">لا توجد تنبيهات حرجة في النظام حالياً.</p>
            </CollapsibleSection>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
               <div className="flex bg-[#000]/30 p-1 rounded-lg border border-[#5D4037]">
                   <button 
                     onClick={() => setActiveUserTab('student')}
                     className={cn("px-4 py-2 rounded-md text-sm transition-colors", activeUserTab === 'student' ? "bg-[#DAA520] text-[#2A1B0E] font-bold" : "text-[#F4E4BC] hover:text-[#DAA520]")}
                   >الطلاب</button>
                   <button 
                     onClick={() => setActiveUserTab('teacher')}
                     className={cn("px-4 py-2 rounded-md text-sm transition-colors", activeUserTab === 'teacher' ? "bg-[#DAA520] text-[#2A1B0E] font-bold" : "text-[#F4E4BC] hover:text-[#DAA520]")}
                   >المعلمون</button>
                   <button 
                     onClick={() => setActiveUserTab('parent')}
                     className={cn("px-4 py-2 rounded-md text-sm transition-colors", activeUserTab === 'parent' ? "bg-[#DAA520] text-[#2A1B0E] font-bold" : "text-[#F4E4BC] hover:text-[#DAA520]")}
                   >أولياء الأمور</button>
               </div>
               
               <div className="flex gap-2 w-full md:w-auto">
                   <div className="relative flex-1 md:w-64">
                        <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="بحث بالاسم أو البريد..." 
                        className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg pl-10 pr-4 py-2 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#F4E4BC]/50" />
                    </div>
                    <GoldButton className="text-sm px-4 py-2" onClick={() => handleOpenUserModal()}>
                        <Plus className="w-4 h-4 ml-2 inline" />
                        إضافة
                    </GoldButton>
               </div>
            </div>
            
            <CollapsibleSection title={`قائمة ${activeUserTab === 'student' ? 'الطلاب' : activeUserTab === 'teacher' ? 'المعلمين' : 'أولياء الأمور'}`} defaultOpen={true}>
              <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead>
                    <tr className="text-[#F4E4BC]/60 border-b border-[#5D4037]">
                        <th className="pb-2 p-2">الاسم</th>
                        <th className="pb-2 p-2">البريد الإلكتروني</th>
                        {activeUserTab === 'student' && <th className="pb-2 p-2">الفصل</th>}
                        {activeUserTab === 'student' && <th className="pb-2 p-2">ولي الأمر</th>}
                        {activeUserTab === 'teacher' && <th className="pb-2 p-2">المادة</th>}
                        {activeUserTab === 'teacher' && <th className="pb-2 p-2">الفصول المسندة</th>}
                        {activeUserTab === 'parent' && <th className="pb-2 p-2">الأبناء</th>}
                        <th className="pb-2 p-2">الإجراءات</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#5D4037]/50">
                    {users.filter(u => u.role === activeUserTab && (u.name.includes(searchQuery) || u.email.includes(searchQuery))).map((user) => (
                        <tr key={user.id} className="text-[#F4E4BC] hover:bg-[#DAA520]/5 transition-colors">
                            <td className="py-3 p-2 font-bold">{user.name}</td>
                            <td className="py-3 p-2 text-[#F4E4BC]/70">{user.email}</td>
                            
                            {/* Student Columns */}
                            {user.role === 'student' && <td className="py-3 p-2"><span className="bg-[#4ECDC4]/10 text-[#4ECDC4] px-2 py-1 rounded text-xs">{user.classId || '-'}</span></td>}
                            {user.role === 'student' && <td className="py-3 p-2 flex items-center gap-1 text-[#FFD700]"><LinkIcon className="w-3 h-3" /> {getParentName(user.parentId)}</td>}
                            
                            {/* Teacher Columns */}
                            {user.role === 'teacher' && <td className="py-3 p-2">{user.subject}</td>}
                            {user.role === 'teacher' && <td className="py-3 p-2">
                                <div className="flex gap-1 flex-wrap">
                                    {user.assignedClasses?.map(c => <span key={c} className="bg-[#FFD700]/10 text-[#FFD700] px-1 rounded text-xs">{c}</span>)}
                                </div>
                            </td>}

                             {/* Parent Columns */}
                             {user.role === 'parent' && <td className="py-3 p-2">
                                <div className="flex gap-1 flex-wrap">
                                    {users.filter(s => s.role === 'student' && s.parentId === user.id).map(s => (
                                         <span key={s.id} className="bg-[#4ECDC4]/10 text-[#4ECDC4] px-1 rounded text-xs">{s.name}</span>
                                    ))}
                                </div>
                            </td>}

                            <td className="py-3 p-2">
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenUserModal(user)} className="text-[#DAA520] hover:bg-[#DAA520]/20 p-1 rounded"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-[#FF6B6B] hover:bg-[#FF6B6B]/20 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.filter(u => u.role === activeUserTab).length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-[#F4E4BC]/40">لا يوجد بيانات لعرضها</td>
                        </tr>
                    )}
                    </tbody>
                </table>
              </div>
            </CollapsibleSection>
          </div>
        );

      case 'schedule':
        const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
        const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];

        return (
          <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full md:w-1/3">
                    <label className="block text-[#F4E4BC] mb-2 font-bold">اختر الفصل الدراسي للجدولة</label>
                    <select 
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                    >
                        <option value="">-- اختر الفصل --</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>)}
                    </select>
                </div>
                
                {selectedClassId && (
                    <div className="flex gap-2">
                        <GoldButton onClick={() => showToast("تم حفظ الجدول كمسودة", "info")} className="bg-[#5D4037] border-[#F4E4BC]/20">
                            <Save className="w-4 h-4 ml-2 inline" />
                            حفظ مسودة
                        </GoldButton>
                        <GoldButton onClick={() => showToast("تم اعتماد الجدول ونشره للمعلمين والطلاب", "success")}>
                            <CheckCircle2 className="w-4 h-4 ml-2 inline" />
                            اعتماد الجدول
                        </GoldButton>
                    </div>
                )}
             </div>

             {selectedClassId ? (
                 <div className="bg-[#2A1B0E]/80 border border-[#5D4037] rounded-xl overflow-hidden overflow-x-auto">
                     <table className="w-full min-w-[800px] text-center">
                         <thead>
                             <tr className="bg-[#000]/40 text-[#FFD700] border-b border-[#5D4037]">
                                 <th className="p-4 w-32">التوقيت / اليوم</th>
                                 {timeSlots.map(time => (
                                     <th key={time} className="p-4 border-r border-[#5D4037]/30">{time}</th>
                                 ))}
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-[#5D4037]/30">
                             {days.map(day => (
                                 <tr key={day} className="hover:bg-[#DAA520]/5 transition-colors">
                                     <td className="p-4 font-bold text-[#F4E4BC] border-l border-[#5D4037]/30 bg-[#000]/20">{day}</td>
                                     {timeSlots.map(time => {
                                         const item = schedule.find(s => s.classId === selectedClassId && s.day === day && s.time === time);
                                         return (
                                             <td key={`${day}-${time}`} className="p-2 border-r border-[#5D4037]/30 relative h-32 align-top">
                                                 {item ? (
                                                     <div className={cn(
                                                         "w-full h-full rounded-lg p-2 text-right relative group transition-all cursor-pointer border",
                                                         item.type === 'remote' ? "bg-[#4ECDC4]/10 border-[#4ECDC4]/30 hover:bg-[#4ECDC4]/20" : "bg-[#DAA520]/10 border-[#DAA520]/30 hover:bg-[#DAA520]/20"
                                                     )}>
                                                         <div className="flex justify-between items-start mb-1">
                                                             <span className={cn("text-xs px-1.5 rounded", item.type === 'remote' ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" : "bg-[#DAA520]/20 text-[#DAA520]")}>
                                                                 {item.type === 'remote' ? 'عن بُعد' : 'حضوري'}
                                                             </span>
                                                             <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                 <button onClick={(e) => { e.stopPropagation(); handleOpenScheduleModal(item); }} className="text-[#F4E4BC] hover:text-[#DAA520]"><Edit2 className="w-3 h-3" /></button>
                                                                 <button onClick={(e) => { e.stopPropagation(); handleDeleteScheduleItem(item.id); }} className="text-[#FF6B6B] hover:text-[#FF6B6B]/80"><Trash2 className="w-3 h-3" /></button>
                                                             </div>
                                                         </div>
                                                         <p className="font-bold text-[#F4E4BC] text-sm mb-1">{item.subject}</p>
                                                         <p className="text-[#F4E4BC]/50 text-xs">
                                                             {item.teacherId ? users.find(u => u.id === item.teacherId)?.name : "لم يحدد معلم"}
                                                         </p>
                                                     </div>
                                                 ) : (
                                                     <button 
                                                         onClick={() => handleOpenScheduleModal(undefined, day, time)}
                                                         className="w-full h-full rounded-lg border border-dashed border-[#5D4037] flex items-center justify-center text-[#F4E4BC]/20 hover:text-[#DAA520] hover:border-[#DAA520] hover:bg-[#DAA520]/5 transition-all"
                                                     >
                                                         <Plus className="w-6 h-6" />
                                                     </button>
                                                 )}
                                             </td>
                                         );
                                     })}
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             ) : (
                 <div className="text-center py-20 bg-[#000]/20 rounded-xl border border-[#5D4037]">
                     <Calendar className="w-20 h-20 mx-auto mb-4 text-[#F4E4BC]/20" />
                     <h3 className="text-xl text-[#F4E4BC] font-bold mb-2">نسج الرحلات (إعداد الجدول)</h3>
                     <p className="text-[#F4E4BC]/50 max-w-md mx-auto">يرجى اختيار الفصل الدراسي من القائمة أعلاه للبدء في إعداد أو تعديل الجدول الدراسي.</p>
                 </div>
             )}
          </div>
        );

      case 'monitoring':
        // Calculate Stats
        const teachersList = users.filter(u => u.role === 'teacher');
        const filteredTeachers = monitorTeacherId === 'all' 
            ? teachersList 
            : teachersList.filter(t => t.id.toString() === monitorTeacherId);

        const totalTeachers = teachersList.length;
        
        // Mock Activation Logic (replace with real checks if data available)
        const activeTeachers = filteredTeachers.filter(t => {
            return Math.random() > 0.2;
        }).length;

        const activationRate = totalTeachers > 0 ? Math.round((activeTeachers / totalTeachers) * 100) : 0;
        
        const totalRemoteClasses = schedule.filter(s => s.type === 'remote' && (monitorTeacherId === 'all' || s.teacherId?.toString() === monitorTeacherId)).length;
        const totalWeeklyPlans = weeklyPlan.length; 
        
        const handlePrintReport = () => {
             window.print();
        };

        return (
          <div className="space-y-6 print:space-y-4">
             {/* Header & Controls */}
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
                 <div>
                    <h3 className="text-[#FFD700] text-xl font-bold font-[family-name:var(--font-amiri)]">المتابعة الأكاديمية الذكية</h3>
                    <p className="text-[#F4E4BC]/60 text-sm">تحليل شامل لأداء المعلمين والعملية التعليمية</p>
                 </div>
                 
                 <div className="flex gap-2 w-full md:w-auto">
                     <div className="relative flex-1 md:w-64">
                         <select 
                            value={monitorTeacherId}
                            onChange={(e) => setMonitorTeacherId(e.target.value)}
                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg px-4 py-2 text-[#F4E4BC] focus:border-[#DAA520] outline-none appearance-none"
                         >
                             <option value="all">جميع المعلمين</option>
                             {teachersList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                         </select>
                         <ChevronDown className="absolute left-3 top-3 w-4 h-4 text-[#F4E4BC]/50 pointer-events-none" />
                     </div>
                     <GoldButton onClick={handlePrintReport} className="whitespace-nowrap">
                         <Printer className="w-4 h-4 ml-2 inline" />
                         تصدير PDF
                     </GoldButton>
                 </div>
             </div>

             {/* Smart Insight Card */}
             <div className="bg-gradient-to-r from-[#2A1B0E] to-[#1a1008] p-6 rounded-xl border border-[#DAA520]/30 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DAA520] to-transparent opacity-50" />
                 <div className="flex items-start gap-4 relative z-10">
                     <div className="bg-[#DAA520]/20 p-3 rounded-full border border-[#DAA520]/50 shrink-0">
                         <BrainCircuit className="w-8 h-8 text-[#DAA520]" />
                     </div>
                     <div>
                         <h4 className="text-[#FFD700] font-bold text-lg mb-2 flex items-center gap-2">
                             تحليل المساعد الذكي
                             <span className="text-xs bg-[#DAA520] text-[#000] px-2 py-0.5 rounded-full font-bold">BETA</span>
                         </h4>
                         <p className="text-[#F4E4BC] leading-relaxed text-sm">
                             {monitorTeacherId === 'all' 
                                ? `بناءً على البيانات الحالية، هناك نشاط ملحوظ في تفعيل الحصص عن بُعد بنسبة ${Math.round((totalRemoteClasses / (schedule.length || 1)) * 100)}%. يوصى بتكثيف خطط المتابعة للمعلمين ذوي النشاط المنخفض في "ميزان السلوك".`
                                : `المعلم ${teachersList.find(t => t.id.toString() === monitorTeacherId)?.name} يظهر التزاماً عالياً في الحضور، لكن يحتاج إلى تفعيل أكبر لأدوات "ميزان السلوك". نسبة إنجاز المهام لديه جيدة جداً.`
                             }
                         </p>
                     </div>
                 </div>
                 {/* Background decoration */}
                 <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-[#DAA520]/5 pointer-events-none" />
             </div>
             {/* Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4">
                <div className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037] flex flex-col items-center print:border-black print:bg-white">
                   <h4 className="text-[#F4E4BC]/70 text-sm mb-2 print:text-black">نسبة التفعيل</h4>
                   <span className="text-3xl font-bold text-[#4ECDC4] mb-1 print:text-black">{monitorTeacherId === 'all' ? activationRate : 100}%</span>
                   <span className="text-xs text-[#F4E4BC]/50 print:text-gray-500">{monitorTeacherId === 'all' ? `${activeTeachers} من ${totalTeachers} معلم` : 'نشط'}</span>
                </div>
                <div className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037] flex flex-col items-center print:border-black print:bg-white">
                   <h4 className="text-[#F4E4BC]/70 text-sm mb-2 print:text-black">الحصص عن بُعد</h4>
                   <span className="text-3xl font-bold text-[#FFD700] mb-1 print:text-black">{totalRemoteClasses}</span>
                   <span className="text-xs text-[#F4E4BC]/50 print:text-gray-500">حصة مجدولة</span>
                </div>
                <div className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037] flex flex-col items-center print:border-black print:bg-white">
                   <h4 className="text-[#F4E4BC]/70 text-sm mb-2 print:text-black">الأنشطة السلوكية</h4>
                   <span className="text-3xl font-bold text-[#DAA520] mb-1 print:text-black">
                       {behaviorRecords.filter(r => monitorTeacherId === 'all' || r.teacherId.toString() === monitorTeacherId).length}
                   </span>
                   <span className="text-xs text-[#F4E4BC]/50 print:text-gray-500">سجل مرصود</span>
                </div>
                <div className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037] flex flex-col items-center print:border-black print:bg-white">
                   <h4 className="text-[#F4E4BC]/70 text-sm mb-2 print:text-black">بنك الأسئلة</h4>
                   <span className="text-3xl font-bold text-[#FF6B6B] mb-1 print:text-black">
                       {questionBank.filter(q => monitorTeacherId === 'all' || q.authorId.toString() === monitorTeacherId).length}
                   </span>
                   <span className="text-xs text-[#F4E4BC]/50 print:text-gray-500">سؤال مضاف</span>
                </div>
             </div>

             {/* Detailed Report Table */}
             <div className="border border-[#5D4037] rounded-lg overflow-hidden bg-[#000]/20 print:border-black print:bg-white">
                <div className="p-4 bg-[#2A1B0E]/50 border-b border-[#5D4037] flex justify-between items-center print:bg-gray-100 print:border-black">
                    <h3 className="text-lg font-bold text-[#F4E4BC] font-[family-name:var(--font-cairo)] print:text-black">تقرير الأداء التفصيلي</h3>
                    <span className="text-xs text-[#F4E4BC]/50 print:text-black">{new Date().toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-right text-sm">
                      <thead className="bg-[#000]/40 text-[#F4E4BC]/60 border-b border-[#5D4037] print:bg-gray-200 print:text-black print:border-black">
                         <tr>
                            <th className="pb-2 p-3">المعلم</th>
                            <th className="pb-2 p-3">المادة</th>
                            <th className="pb-2 p-3 text-center">الجدول الدراسي</th>
                            <th className="pb-2 p-3 text-center">نقاط السلوك</th>
                            <th className="pb-2 p-3 text-center">الأسئلة المضافة</th>
                            <th className="pb-2 p-3 text-center">التقييم العام</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#5D4037]/50 print:divide-gray-300">
                         {filteredTeachers.map(teacher => {
                            const teacherSchedule = schedule.filter(s => s.teacherId === teacher.id).length;
                            const teacherBehaviors = behaviorRecords.filter(r => r.teacherId === teacher.id).length;
                            const teacherQuestions = questionBank.filter(q => q.authorId === teacher.id).length;
                            
                            // Simple score calculation
                            const score = Math.min(100, (teacherSchedule * 2) + (teacherBehaviors * 5) + (teacherQuestions * 3));
                            
                            return (
                            <tr key={teacher.id} className="text-[#F4E4BC] hover:bg-[#DAA520]/5 print:text-black print:hover:bg-transparent">
                               <td className="py-3 p-3 font-bold">{teacher.name}</td>
                               <td className="py-3 p-3">{teacher.subject || '-'}</td>
                               <td className="py-3 p-3 text-center">
                                  <span className="bg-[#4ECDC4]/10 text-[#4ECDC4] px-2 py-1 rounded print:bg-transparent print:text-black print:border print:border-black">
                                     {teacherSchedule} حصص
                                  </span>
                               </td>
                               <td className="py-3 p-3 text-center">
                                  <span className="bg-[#FFD700]/10 text-[#FFD700] px-2 py-1 rounded print:bg-transparent print:text-black print:border print:border-black">
                                     {teacherBehaviors}
                                  </span>
                               </td>
                               <td className="py-3 p-3 text-center">
                                  <span className="bg-[#FF6B6B]/10 text-[#FF6B6B] px-2 py-1 rounded print:bg-transparent print:text-black print:border print:border-black">
                                     {teacherQuestions}
                                  </span>
                               </td>
                               <td className="py-3 p-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                      <div className="w-16 h-2 bg-[#000] rounded-full overflow-hidden print:border print:border-black">
                                          <div className="h-full bg-gradient-to-r from-[#DAA520] to-[#FFD700]" style={{ width: `${score}%` }} />
                                      </div>
                                      <span className="text-xs font-bold">{score}%</span>
                                  </div>
                               </td>
                            </tr>
                         )})}
                         {filteredTeachers.length === 0 && (
                             <tr>
                                 <td colSpan={6} className="text-center py-8 text-[#F4E4BC]/40 print:text-black">لا توجد بيانات للمعلمين المحددين</td>
                             </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* Attendance Log - Hidden in Print */}
             <div className="print:hidden">
                 <CollapsibleSection title="سجل الحضور المباشر (الطلاب)" defaultOpen={true}>
                     {attendanceRecords.length === 0 ? (
                         <div className="text-center py-8 text-[#F4E4BC]/40">
                             <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                             <p>لم يتم تسجيل أي حضور اليوم بعد</p>
                         </div>
                     ) : (
                         <div className="space-y-2">
                             {attendanceRecords.map((record, i) => (
                                 <div key={i} className="flex items-center justify-between p-3 bg-[#2A1B0E]/50 rounded border border-[#5D4037]">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center text-[#4ECDC4] font-bold">
                                             {record.studentName.charAt(0)}
                                         </div>
                                         <div>
                                             <p className="text-[#F4E4BC] font-bold text-sm">{record.studentName}</p>
                                             <p className="text-[#F4E4BC]/50 text-xs">درس: {record.subject}</p>
                                         </div>
                                     </div>
                                     <div className="text-left">
                                         <span className="block text-[#FFD700] font-bold text-sm">{record.time}</span>
                                         <span className="text-[#F4E4BC]/30 text-xs">{record.date}</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     )}
                 </CollapsibleSection>
             </div>
          </div>
        );

      case 'classes':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
               <div className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037] flex items-center justify-between">
                 <div>
                   <h3 className="text-[#F4E4BC]/70 text-sm font-[family-name:var(--font-cairo)]">عدد الفصول</h3>
                   <p className="text-2xl font-bold text-[#FFD700]">{classes.length}</p>
                 </div>
                 <Layers className="w-8 h-8 text-[#FFD700]/50" />
               </div>
               <div className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037] flex items-center justify-between">
                 <div>
                   <h3 className="text-[#F4E4BC]/70 text-sm font-[family-name:var(--font-cairo)]">إجمالي الطلاب</h3>
                   <p className="text-2xl font-bold text-[#4ECDC4]">{users.filter(u => u.role === 'student').length}</p>
                 </div>
                 <Users className="w-8 h-8 text-[#4ECDC4]/50" />
               </div>
               <div className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037] flex items-center justify-between">
                 <div>
                   <h3 className="text-[#F4E4BC]/70 text-sm font-[family-name:var(--font-cairo)]">القاعات المتاحة</h3>
                   <p className="text-2xl font-bold text-[#FF6B6B]">5</p>
                 </div>
                 <Home className="w-8 h-8 text-[#FF6B6B]/50" />
               </div>
            </div>

            <div className="flex justify-between items-center mb-4">
               <div className="relative w-64">
                 <input 
                   type="text" 
                   placeholder="بحث عن فصل..." 
                   className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg pl-10 pr-4 py-2 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                 />
                 <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#F4E4BC]/50" />
               </div>
               <div className="flex gap-2">
                   <GoldButton className="text-sm px-4 py-2 bg-[#5D4037] hover:bg-[#5D4037]/80 border-[#F4E4BC]/20" onClick={() => setShowStageModal(true)}>
                     <Settings className="w-4 h-4 ml-2 inline" />
                     المراحل الدراسية
                   </GoldButton>
                   <GoldButton className="text-sm px-4 py-2" onClick={() => handleOpenClassModal()}>
                     <Plus className="w-4 h-4 ml-2 inline" />
                     إضافة فصل جديد
                   </GoldButton>
               </div>
            </div>

            <div className="space-y-4">
               {stages.map((grade) => {
                   const gradeClasses = classes.filter(c => c.grade === grade);
                   return (
                   <CollapsibleSection key={grade} title={grade} defaultOpen={true}>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {gradeClasses.length > 0 ? gradeClasses.map((cls) => {
                             const studentCount = getStudentCount(cls.id);
                             const teacher = users.find(u => u.role === 'teacher' && u.assignedClasses?.includes(cls.id));
                             const isFull = studentCount >= cls.capacity;
                             
                             return (
                                <div key={cls.id} className="bg-[#2A1B0E] p-4 rounded-lg border border-[#5D4037] hover:border-[#DAA520] transition-colors group relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-[#F4E4BC] text-lg font-[family-name:var(--font-amiri)]">
                                            <School className="w-4 h-4 inline ml-2 text-[#DAA520]" />
                                            فصل {cls.name}
                                        </h4>
                                        <span className={cn("text-xs px-2 py-1 rounded", isFull ? "bg-[#FF6B6B]/20 text-[#FF6B6B]" : "bg-[#4ECDC4]/20 text-[#4ECDC4]")}>
                                            {isFull ? "ممتلئ" : "متاح"}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-[#F4E4BC]/70">
                                        <div className="flex justify-between items-center">
                                            <span>المعلم المسؤول:</span>
                                            <span className={cn("text-[#F4E4BC]", !teacher && "text-[#FF6B6B] italic")}>
                                                {teacher ? teacher.name : "غير معين"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>الطلاب:</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-[#000] rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn("h-full", isFull ? "bg-[#FF6B6B]" : "bg-[#4ECDC4]")} 
                                                        style={{ width: `${(studentCount / cls.capacity) * 100}%` }} 
                                                    />
                                                </div>
                                                <span className="text-[#F4E4BC] text-xs">{studentCount}/{cls.capacity}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-[#5D4037]/50 flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleOpenClassModal(cls)}
                                            className="text-[#DAA520] hover:bg-[#DAA520]/10 p-1.5 rounded text-xs flex items-center gap-1"
                                        >
                                            <Edit2 className="w-3 h-3" /> تعديل
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClass(cls.id)}
                                            className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10 p-1.5 rounded text-xs flex items-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" /> حذف
                                        </button>
                                    </div>
                                </div>
                             )
                         }) : (
                            <div className="col-span-full text-center text-[#F4E4BC]/40 py-8 border border-dashed border-[#5D4037] rounded-lg">
                                لا توجد فصول دراسية في هذه المرحلة حالياً
                            </div>
                         )}
                       </div>
                   </CollapsibleSection>
               )})}
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="h-full flex flex-col">
            <div className="flex gap-4 mb-6 border-b border-[#5D4037] pb-4">
               <button 
                 onClick={() => setActiveMessageTab('inbox')}
                 className={cn(
                   "pb-1 transition-colors font-bold flex items-center gap-2",
                   activeMessageTab === 'inbox' ? "text-[#FFD700] border-b-2 border-[#FFD700]" : "text-[#F4E4BC]/60 hover:text-[#F4E4BC]"
                 )}
               >
                 <Mail className="w-4 h-4" />
                 البريد الوارد ({supportMessages.filter(m => !m.read).length})
               </button>
               <button 
                 onClick={() => setActiveMessageTab('compose')}
                 className={cn(
                   "pb-1 transition-colors font-bold flex items-center gap-2",
                   activeMessageTab === 'compose' ? "text-[#FFD700] border-b-2 border-[#FFD700]" : "text-[#F4E4BC]/60 hover:text-[#F4E4BC]"
                 )}
               >
                 <Scroll className="w-4 h-4" />
                 إصدار مرسوم (رسالة جماعية)
               </button>
               <button 
                 onClick={() => setActiveMessageTab('history')}
                 className={cn(
                   "pb-1 transition-colors font-bold flex items-center gap-2",
                   activeMessageTab === 'history' ? "text-[#FFD700] border-b-2 border-[#FFD700]" : "text-[#F4E4BC]/60 hover:text-[#F4E4BC]"
                 )}
               >
                 <Megaphone className="w-4 h-4" />
                 سجل المراسيم
               </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
               {activeMessageTab === 'inbox' && (
                 <div className="space-y-2">
                   {supportMessages.length === 0 ? (
                       <div className="text-center py-12 text-[#F4E4BC]/40">
                           <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                           <p>لا توجد رسائل واردة حالياً</p>
                       </div>
                   ) : (
                       supportMessages.map((msg, i) => (
                        <div 
                            key={i} 
                            onClick={() => handleMessageClick(msg)}
                            className={cn(
                          "flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-colors border border-transparent",
                          msg.read ? "bg-[#000]/20 hover:bg-[#000]/30" : "bg-[#DAA520]/10 border-[#DAA520]/30 hover:bg-[#DAA520]/20"
                        )}>
                            <div className={cn(
                              "w-2 h-2 rounded-full shrink-0 mt-2",
                              msg.read ? "bg-transparent" : "bg-[#FF6B6B]"
                            )} />
                            <div className="w-10 h-10 rounded-full bg-[#5D4037] flex items-center justify-center text-[#F4E4BC] font-bold shrink-0">
                               {msg.senderName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex justify-between items-start mb-1">
                                   <h4 className={cn("truncate text-sm", !msg.read && "font-bold text-[#F4E4BC]")}>{msg.senderName}</h4>
                                   <span className="text-[#F4E4BC]/40 text-xs whitespace-nowrap">{msg.date}</span>
                               </div>
                               <div className="flex gap-2 mb-2 text-xs text-[#F4E4BC]/60">
                                    {msg.mobile && <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> {msg.mobile}</span>}
                                    {msg.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.email}</span>}
                                    <span className="bg-[#DAA520]/20 px-1.5 rounded text-[#DAA520]">{msg.type}</span>
                               </div>
                               <p className="text-[#F4E4BC]/80 text-sm leading-relaxed">{msg.message}</p>
                            </div>
                         </div>
                       ))
                   )}
                 </div>
               )}

               {activeMessageTab === 'compose' && (
                 <div className="max-w-2xl mx-auto">
                    <div className="bg-[#F4E4BC] text-[#2A1B0E] p-8 rounded-lg shadow-xl relative overflow-hidden">
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-50 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="text-center mb-6 border-b-2 border-[#2A1B0E]/20 pb-4">
                                <Crown className="w-12 h-12 mx-auto text-[#DAA520] mb-2" />
                                <h2 className="text-3xl font-[family-name:var(--font-amiri)] font-bold text-[#2A1B0E]">مرسوم ملكي</h2>
                                <p className="text-[#2A1B0E]/60 text-sm">من مكتب قيادة المملكة</p>
                            </div>

                            <form onSubmit={handleSendBroadcast} className="space-y-6">
                                <div>
                                    <label className="block text-[#2A1B0E] font-bold mb-2">عنوان المرسوم</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={broadcastForm.title}
                                        onChange={e => setBroadcastForm({...broadcastForm, title: e.target.value})}
                                        className="w-full bg-transparent border-b-2 border-[#2A1B0E]/30 focus:border-[#DAA520] outline-none py-2 text-lg font-bold placeholder-[#2A1B0E]/30"
                                        placeholder="اكتب عنواناً مهيباً..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-[#2A1B0E] font-bold mb-2">نوع المرسوم</label>
                                    <select 
                                        value={broadcastForm.type}
                                        onChange={e => setBroadcastForm({...broadcastForm, type: e.target.value})}
                                        className="w-full bg-[#2A1B0E]/5 border border-[#2A1B0E]/20 rounded p-2 outline-none focus:border-[#DAA520]"
                                    >
                                        <option value="info">إعلان عام (معلومة)</option>
                                        <option value="success">تهنئة / تكريم (نجاح)</option>
                                        <option value="warning">تنبيه هام (تحذير)</option>
                                        <option value="urgent">أمر ملكي عاجل (طوارئ)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[#2A1B0E] font-bold mb-2">الفئة المستهدفة</label>
                                    <select 
                                        value={broadcastForm.target}
                                        onChange={e => setBroadcastForm({...broadcastForm, target: e.target.value})}
                                        className="w-full bg-[#2A1B0E]/5 border border-[#2A1B0E]/20 rounded p-2 outline-none focus:border-[#DAA520]"
                                    >
                                        <option value="all">كافة مواطني المملكة (الكل)</option>
                                        <option value="student">الفرسان (الطلاب)</option>
                                        <option value="teacher">الحكماء (المعلمون)</option>
                                        <option value="parent">المجلس الاستشاري (أولياء الأمور)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[#2A1B0E] font-bold mb-2">نص الرسالة</label>
                                    <textarea 
                                        required
                                        value={broadcastForm.message}
                                        onChange={e => setBroadcastForm({...broadcastForm, message: e.target.value})}
                                        rows={6}
                                        className="w-full bg-transparent border border-[#2A1B0E]/20 rounded p-4 outline-none focus:border-[#DAA520] placeholder-[#2A1B0E]/30"
                                        placeholder="اكتب نص المرسوم هنا..."
                                    ></textarea>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button 
                                        type="submit" 
                                        className="bg-[#2A1B0E] text-[#FFD700] px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#2A1B0E]/90 transition-transform hover:scale-105 shadow-lg"
                                    >
                                        <Send className="w-5 h-5" />
                                        إصدار المرسوم
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                 </div>
               )}

               {activeMessageTab === 'history' && (
                  <div className="space-y-4">
                      {broadcasts.length === 0 ? (
                          <div className="text-center py-12 text-[#F4E4BC]/40">
                              <Scroll className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p>لم يتم إصدار أي مراسيم سابقة</p>
                          </div>
                      ) : (
                          broadcasts.map(msg => (
                              <div key={msg.id} className="bg-[#2A1B0E]/60 p-6 rounded-xl border border-[#DAA520]/30 flex gap-4">
                                  <div className={cn(
                                      "p-3 rounded-full h-fit",
                                      msg.type === 'urgent' ? "bg-[#FF6B6B]/20" : 
                                      msg.type === 'success' ? "bg-[#2ECC71]/20" : 
                                      msg.type === 'warning' ? "bg-[#F1C40F]/20" : "bg-[#DAA520]/10"
                                  )}>
                                      <Megaphone className={cn(
                                          "w-6 h-6",
                                          msg.type === 'urgent' ? "text-[#FF6B6B]" : 
                                          msg.type === 'success' ? "text-[#2ECC71]" : 
                                          msg.type === 'warning' ? "text-[#F1C40F]" : "text-[#DAA520]"
                                      )} />
                                  </div>
                                  <div className="flex-1">
                                      <div className="flex justify-between items-start mb-2">
                                          <h4 className="text-xl text-[#FFD700] font-[family-name:var(--font-amiri)] font-bold">
                                              {msg.type === 'urgent' && "🚨 "}{msg.title}
                                          </h4>
                                          <span className="text-[#F4E4BC]/40 text-xs bg-[#000]/20 px-2 py-1 rounded">{msg.date}</span>
                                      </div>
                                      <p className="text-[#F4E4BC]/80 mb-3">{msg.message}</p>
                                      <div className="flex items-center gap-2 text-xs text-[#F4E4BC]/50">
                                          <span>المستلمون:</span>
                                          <span className="text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded">
                                              {msg.targetRole === 'all' ? 'الجميع' : 
                                               msg.targetRole === 'student' ? 'الطلاب' : 
                                               msg.targetRole === 'teacher' ? 'المعلمون' : 'أولياء الأمور'}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
               )}
            </div>
          </div>
        );

      case 'settings':
        return (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* General Settings */}
                 <div className="bg-[#000]/30 p-6 rounded-xl border border-[#5D4037]">
                    <h3 className="text-[#FFD700] font-bold text-lg mb-4 flex items-center gap-2 font-[family-name:var(--font-amiri)]">
                       <Settings className="w-5 h-5" />
                       الإعدادات العامة
                    </h3>
                    <div className="space-y-4">
                       <div>
                          <label className="block text-[#F4E4BC] text-sm mb-2">اسم المدرسة</label>
                          <input type="text" defaultValue="مدرسة أثير العلم الافتراضية" className="w-full bg-[#2A1B0E] border border-[#5D4037] rounded p-2 text-[#F4E4BC] text-sm" />
                       </div>
                       <div>
                          <label className="block text-[#F4E4BC] text-sm mb-2">الشعار</label>
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-[#DAA520] rounded-full" />
                             <button className="text-[#4ECDC4] text-xs hover:underline">تغيير الشعار</button>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 mt-2">
                          <input type="checkbox" id="maintenance" className="accent-[#DAA520]" />
                          <label htmlFor="maintenance" className="text-[#F4E4BC] text-sm cursor-pointer">تفعيل وضع الصيانة</label>
                       </div>
                    </div>
                 </div>

                 {/* Academic Settings */}
                 <div className="bg-[#000]/30 p-6 rounded-xl border border-[#5D4037]">
                    <h3 className="text-[#4ECDC4] font-bold text-lg mb-4 flex items-center gap-2 font-[family-name:var(--font-amiri)]">
                       <Layers className="w-5 h-5" />
                       الإعدادات الأكاديمية
                    </h3>
                    <div className="space-y-4">
                       <div>
                          <label className="block text-[#F4E4BC] text-sm mb-2">العام الدراسي</label>
                          <select className="w-full bg-[#2A1B0E] border border-[#5D4037] rounded p-2 text-[#F4E4BC] text-sm">
                             <option>1445 هـ</option>
                             <option>1446 هـ</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[#F4E4BC] text-sm mb-2">الفصل الدراسي</label>
                          <select className="w-full bg-[#2A1B0E] border border-[#5D4037] rounded p-2 text-[#F4E4BC] text-sm">
                             <option>الفصل الأول</option>
                             <option>الفصل الثاني</option>
                             <option>الفصل الثالث</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-[#5D4037]">
                 <GoldButton onClick={() => showToast("تم حفظ جميع الإعدادات", "success")} className="px-8">
                    حفظ التغييرات
                 </GoldButton>
              </div>
           </div>
        );

      case 'competitions':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-[#FFD700] text-xl font-bold font-[family-name:var(--font-amiri)]">ساحة أثير - إدارة المنافسات</h3>
                    <p className="text-[#F4E4BC]/60 text-sm">إنشاء وإدارة المنافسات التعليمية بين الطلاب</p>
                 </div>
                 <GoldButton onClick={() => setShowCompModal(true)}>
                    <Plus className="w-4 h-4 ml-2 inline" />
                    منافسة جديدة
                 </GoldButton>
             </div>

             <div className="grid grid-cols-1 gap-4">
                {competitions.length === 0 ? (
                    <div className="text-center py-12 bg-[#000]/20 rounded-xl border border-[#5D4037]">
                        <Swords className="w-16 h-16 mx-auto mb-4 text-[#F4E4BC]/30" />
                        <p className="text-[#F4E4BC]/60">لا توجد منافسات حالياً. ابدأ بإنشاء واحدة!</p>
                    </div>
                ) : (
                    competitions.map(comp => (
                        <div key={comp.id} className="bg-[#2A1B0E]/80 p-6 rounded-xl border border-[#5D4037] flex flex-col md:flex-row justify-between items-center gap-4 hover:border-[#DAA520] transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-[#FFD700] font-bold text-lg">{comp.title}</h4>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-xs",
                                        comp.status === 'active' ? "bg-[#2ECC71]/20 text-[#2ECC71]" :
                                        comp.status === 'upcoming' ? "bg-[#DAA520]/20 text-[#DAA520]" :
                                        "bg-[#F4E4BC]/20 text-[#F4E4BC]"
                                    )}>
                                        {comp.status === 'active' ? 'نشطة' : comp.status === 'upcoming' ? 'مجدولة' : 'منتهية'}
                                    </span>
                                </div>
                                <p className="text-[#F4E4BC]/60 text-sm mb-2">{comp.description}</p>
                                <div className="flex gap-4 text-xs text-[#F4E4BC]/50">
                                    <span>المادة: {comp.subject}</span>
                                    <span>المرحلة: {comp.grade}</span>
                                    <span>الوقت: {new Date(comp.startTime).toLocaleString('ar-SA')}</span>
                                    <span>المدة: {comp.durationMinutes} دقيقة</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-center px-4 border-r border-[#5D4037]">
                                    <span className="block text-[#4ECDC4] font-bold text-xl">{comp.participants.length}</span>
                                    <span className="text-[#F4E4BC]/40 text-xs">مشارك</span>
                                </div>
                                <button 
                                    className="p-2 hover:bg-[#DAA520]/10 rounded text-[#DAA520]" 
                                    title="التفاصيل"
                                    onClick={() => setSelectedCompetition(comp)}
                                >
                                    <BarChart3 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
             </div>
          </div>
        );

      case 'questions-approval':
        const pendingQuestions = questionBank.filter(q => q.status === 'pending');
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-[#FFD700] text-xl font-bold font-[family-name:var(--font-amiri)]">ساحة أثير - اعتماد الأسئلة</h3>
                    <p className="text-[#F4E4BC]/60 text-sm">مراجعة واعتماد الأسئلة الواردة من المعلمين لبنك الأسئلة</p>
                 </div>
                 <div className="flex gap-2 text-sm text-[#F4E4BC]/60 bg-[#000]/20 p-2 rounded-lg border border-[#5D4037]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FFD700]"></span> قيد الانتظار: {pendingQuestions.length}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4ECDC4]"></span> معتمد: {questionBank.filter(q => q.status === 'approved').length}</span>
                 </div>
             </div>

             {pendingQuestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-[#F4E4BC]/50 border border-dashed border-[#5D4037] rounded-xl bg-[#000]/20">
                    <Brain className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-xl font-[family-name:var(--font-cairo)]">جميع الأسئلة تمت مراجعتها!</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingQuestions.map(q => (
                        <div key={q.id} className="bg-[#2A1B0E]/60 p-4 rounded-xl border border-[#5D4037] hover:border-[#DAA520] transition-all relative group">
                             <div className="flex justify-between items-start mb-3 border-b border-[#5D4037]/50 pb-2">
                                 <div>
                                     <span className="text-[#FFD700] font-bold text-sm">{q.subject}</span>
                                     <span className="text-[#F4E4BC]/40 mx-2">|</span>
                                     <span className="text-[#4ECDC4] text-xs">{q.grade}</span>
                                 </div>
                                 <span className="text-[#F4E4BC]/40 text-xs">{q.authorName}</span>
                             </div>
                             
                             <p className="text-[#F4E4BC] font-bold mb-4 min-h-[3rem]">{q.text}</p>
                             
                             <div className="flex flex-wrap gap-2 mb-4">
                                 <span className="px-2 py-1 bg-[#000]/30 rounded text-xs text-[#F4E4BC]/60 border border-[#5D4037]">
                                    {q.type === 'mcq' ? 'اختيارات' : q.type === 'true_false' ? 'صح/خطأ' : 'صورة'}
                                 </span>
                                 <span className={cn(
                                     "px-2 py-1 rounded text-xs border",
                                     q.difficulty === 'easy' ? "bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/30" :
                                     q.difficulty === 'medium' ? "bg-[#F1C40F]/10 text-[#F1C40F] border-[#F1C40F]/30" :
                                     "bg-[#E74C3C]/10 text-[#E74C3C] border-[#E74C3C]/30"
                                 )}>
                                    {q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                                 </span>
                             </div>

                             <div className="flex justify-end gap-2 mt-2">
                                 <button 
                                    onClick={() => deleteQuestion(q.id)}
                                    className="px-3 py-1.5 rounded bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B]/20 text-xs border border-[#FF6B6B]/30"
                                 >
                                    رفض وحذف
                                 </button>
                                 <GoldButton 
                                    onClick={() => setSelectedQuestion(q)}
                                    className="px-4 py-1.5 text-xs"
                                 >
                                    مراجعة واعتماد
                                 </GoldButton>
                             </div>
                        </div>
                    ))}
                </div>
             )}
          </div>
        );

      case 'approvals':
        const pendingQuests = quests.filter(q => q.status === 'pending');
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)]">طلبات اعتماد المهام</h3>
                <span className="bg-[#DAA520]/20 text-[#DAA520] px-3 py-1 rounded-full text-sm">{pendingQuests.length} طلبات جديدة</span>
             </div>

             {pendingQuests.length === 0 ? (
                <div className="text-center py-12 bg-[#000]/20 rounded-xl border border-[#5D4037]">
                   <CheckSquare className="w-16 h-16 mx-auto mb-4 text-[#F4E4BC]/30" />
                   <p className="text-[#F4E4BC]/60">لا توجد مهام بانتظار الاعتماد حالياً</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 gap-4">
                   {pendingQuests.map(quest => (
                      <div key={quest.id} className="bg-[#2A1B0E]/80 p-6 rounded-xl border border-[#5D4037] flex flex-col md:flex-row gap-6 items-start md:items-center">
                         <div className="w-full md:w-48 h-32 rounded-lg bg-cover bg-center border border-[#DAA520]/30 shrink-0" style={{ backgroundImage: `url('${quest.image}')` }} />
                         
                         <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                               <span className="bg-[#4ECDC4]/10 text-[#4ECDC4] text-xs px-2 py-1 rounded border border-[#4ECDC4]/20">{quest.type}</span>
                               <span className="text-[#F4E4BC]/40 text-xs">ID: {quest.id}</span>
                            </div>
                            <h4 className="text-xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] mb-2">{quest.title}</h4>
                            <p className="text-[#F4E4BC]/70 text-sm mb-4">{quest.subtitle}</p>
                            
                            <div className="flex gap-4 text-xs text-[#F4E4BC]/60">
                               <span className="flex items-center gap-1"><span className="text-[#FFD700]">💰</span> {quest.cost} عملة</span>
                               {/* We could add more details here if available in Quest object */}
                            </div>
                         </div>

                         <div className="flex md:flex-col gap-2 w-full md:w-auto">
                            <button 
                                onClick={() => {
                                    updateQuestStatus(quest.id, 'approved');
                                    showToast("تم اعتماد المهمة ونشرها للطلاب", "success");
                                }}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#4ECDC4] hover:bg-[#4ECDC4]/80 text-[#0a192f] px-6 py-2 rounded-lg font-bold transition-colors"
                            >
                                <CheckCircle2 className="w-4 h-4" /> قبول
                            </button>
                            <button 
                                onClick={() => {
                                    updateQuestStatus(quest.id, 'rejected');
                                    showToast("تم رفض المهمة", "info");
                                }}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30 px-6 py-2 rounded-lg font-bold transition-colors"
                            >
                                <XCircle className="w-4 h-4" /> رفض
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>
        );

      case 'behavior':
        const pendingBehavior = behaviorRecords.filter(r => r.status === 'pending');
        const historyBehavior = behaviorRecords.filter(r => r.status !== 'pending');
        
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)]">ميزان السلوك</h3>
                <span className="bg-[#DAA520]/20 text-[#DAA520] px-3 py-1 rounded-full text-sm">{pendingBehavior.length} طلبات جديدة</span>
             </div>

             <CollapsibleSection title="طلبات بانتظار الاعتماد" defaultOpen={true}>
                 {pendingBehavior.length === 0 ? (
                    <div className="text-center py-8 text-[#F4E4BC]/40">
                       <Scale className="w-12 h-12 mx-auto mb-3 opacity-50" />
                       <p>لا توجد طلبات سلوك معلقة حالياً</p>
                    </div>
                 ) : (
                    <div className="space-y-3">
                        {pendingBehavior.map(record => (
                            <div key={record.id} className="bg-[#2A1B0E]/60 p-4 rounded-lg border border-[#5D4037] flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                                        record.type === 'positive' ? "bg-[#4ECDC4]/20 text-[#4ECDC4]" : "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                                    )}>
                                        {record.type === 'positive' ? "+" : "-"}
                                    </div>
                                    <div>
                                        <h4 className="text-[#F4E4BC] font-bold text-sm">
                                            {record.studentName} 
                                            <span className="text-[#F4E4BC]/40 font-normal mx-2">|</span>
                                            <span className={record.type === 'positive' ? "text-[#4ECDC4]" : "text-[#FF6B6B]"}>{record.category}</span>
                                        </h4>
                                        <p className="text-[#F4E4BC]/60 text-xs">من المعلم: {record.teacherName} - {record.reason || "لا توجد ملاحظات"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex gap-2">
                                        <span className="text-[#FFD700] text-xs font-bold">{record.type === 'positive' ? '+' : '-'}{record.goldAmount} ذهب</span>
                                        {record.xpAmount > 0 && <span className="text-[#4ECDC4] text-xs font-bold">+{record.xpAmount} XP</span>}
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <button 
                                            onClick={() => {
                                                processBehaviorRequest(record.id, 'approved');
                                                showToast("تم اعتماد السلوك وتطبيق الأثر", "success");
                                            }}
                                            className="text-[#4ECDC4] hover:bg-[#4ECDC4]/10 p-1 rounded transition-colors text-xs border border-[#4ECDC4]/30 px-2"
                                        >
                                            اعتماد
                                        </button>
                                        <button 
                                            onClick={() => {
                                                processBehaviorRequest(record.id, 'rejected');
                                                showToast("تم رفض الطلب", "info");
                                            }}
                                            className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10 p-1 rounded transition-colors text-xs border border-[#FF6B6B]/30 px-2"
                                        >
                                            رفض
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 )}
             </CollapsibleSection>

             <CollapsibleSection title="سجل التاريخ (Audit Log)">
                 <div className="max-h-60 overflow-y-auto custom-scrollbar">
                     <table className="w-full text-right text-xs">
                         <thead className="text-[#F4E4BC]/40 border-b border-[#5D4037]">
                             <tr>
                                 <th className="pb-2">التاريخ</th>
                                 <th className="pb-2">الطالب</th>
                                 <th className="pb-2">السلوك</th>
                                 <th className="pb-2">المعلم</th>
                                 <th className="pb-2">الحالة</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-[#5D4037]/30 text-[#F4E4BC]/70">
                             {historyBehavior.map(record => (
                                 <tr key={record.id}>
                                     <td className="py-2">{record.date}</td>
                                     <td className="py-2">{record.studentName}</td>
                                     <td className={cn("py-2", record.type === 'positive' ? "text-[#4ECDC4]" : "text-[#FF6B6B]")}>{record.category}</td>
                                     <td className="py-2">{record.teacherName}</td>
                                     <td className="py-2">
                                         <span className={cn(
                                             "px-2 py-0.5 rounded",
                                             record.status === 'approved' ? "bg-[#4ECDC4]/10 text-[#4ECDC4]" : "bg-[#FF6B6B]/10 text-[#FF6B6B]"
                                         )}>
                                             {record.status === 'approved' ? "معتمد" : "مرفوض"}
                                         </span>
                                     </td>
                                 </tr>
                             ))}
                             {historyBehavior.length === 0 && (
                                 <tr>
                                     <td colSpan={5} className="text-center py-4 text-[#F4E4BC]/30">لا يوجد سجل سابق</td>
                                 </tr>
                             )}
                         </tbody>
                     </table>
                 </div>
             </CollapsibleSection>
          </div>
        );

      case 'treasures':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)]">إدارة السوق والكنوز</h3>
                <GoldButton className="text-sm px-4 py-2" onClick={() => setShowMarketModal(true)}>
                    <Plus className="w-4 h-4 ml-2 inline" />
                    إضافة كنز جديد
                </GoldButton>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketItems.map(item => (
                   <div key={item.id} className="bg-[#2A1B0E]/80 p-4 rounded-xl border border-[#5D4037] flex gap-4 hover:border-[#DAA520] transition-colors group relative">
                      <div className="relative w-20 h-20 rounded-lg border border-[#DAA520]/30 shrink-0 overflow-hidden">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                             <h4 className="font-bold text-[#FFD700] font-[family-name:var(--font-amiri)]">{item.name}</h4>
                             <button onClick={() => handleDeleteMarketItem(item.id)} className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10 p-1 rounded transition-colors opacity-0 group-hover:opacity-100">
                                 <Trash2 className="w-4 h-4" />
                             </button>
                         </div>
                         <p className="text-[#F4E4BC]/60 text-xs mb-2 line-clamp-2">{item.description}</p>
                         <div className="flex justify-between items-center text-xs">
                             <span className={cn("px-2 py-0.5 rounded border", 
                                 item.rarity === 'legendary' ? "text-[#FFD700] border-[#FFD700] bg-[#FFD700]/10" :
                                 item.rarity === 'epic' ? "text-[#9B59B6] border-[#9B59B6] bg-[#9B59B6]/10" :
                                 item.rarity === 'rare' ? "text-[#4ECDC4] border-[#4ECDC4] bg-[#4ECDC4]/10" :
                                 "text-[#F4E4BC] border-[#5D4037] bg-[#5D4037]/20"
                             )}>{item.rarity}</span>
                             <span className="text-[#FFD700] font-bold flex items-center gap-1"><Coins className="w-3 h-3" /> {item.price}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );

      case 'market_logs':
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)]">سجل المبيعات والمشتريات</h3>
                    <div className="bg-[#DAA520]/10 px-4 py-2 rounded-lg border border-[#DAA520]/30 text-[#DAA520] text-sm font-[family-name:var(--font-cairo)]">
                       إجمالي المبيعات: {purchaseLogs.reduce((acc, curr) => acc + curr.price, 0)} عملة
                    </div>
                </div>

                <div className="bg-[#000]/20 rounded-xl border border-[#5D4037] overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-[#2A1B0E]/80 text-[#F4E4BC] font-[family-name:var(--font-cairo)] text-sm">
                            <tr>
                                <th className="p-4">الطالب</th>
                                <th className="p-4">العنصر</th>
                                <th className="p-4">السعر</th>
                                <th className="p-4">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#5D4037]/30">
                            {purchaseLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-[#F4E4BC]/50">
                                        لا توجد عمليات شراء مسجلة حتى الآن
                                    </td>
                                </tr>
                            ) : (
                                purchaseLogs.map((log) => (
                                    <tr key={log.id} className="text-[#F4E4BC]/80 hover:bg-[#DAA520]/5 transition-colors">
                                        <td className="p-4 font-bold text-[#F4E4BC]">{log.studentName}</td>
                                        <td className="p-4 text-[#4ECDC4]">{log.itemName}</td>
                                        <td className="p-4 text-[#FFD700] font-bold">{log.price}</td>
                                        <td className="p-4 text-xs text-[#F4E4BC]/50">{log.date}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );

      case 'questions-approval':
        const pendingBankQuestions = questionBank.filter(q => q.status === 'pending');
        const approvedBankQuestions = questionBank.filter(q => q.status === 'approved');
        
        return (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                 <div className="bg-[#DAA520]/10 p-4 rounded-xl border border-[#DAA520]/30 text-center">
                     <h4 className="text-[#DAA520] font-bold text-2xl">{pendingBankQuestions.length}</h4>
                     <p className="text-[#F4E4BC]/60 text-sm">قيد المراجعة</p>
                 </div>
                 <div className="bg-[#4ECDC4]/10 p-4 rounded-xl border border-[#4ECDC4]/30 text-center">
                     <h4 className="text-[#4ECDC4] font-bold text-2xl">{approvedBankQuestions.length}</h4>
                     <p className="text-[#F4E4BC]/60 text-sm">تم اعتمادها</p>
                 </div>
                 <div className="bg-[#FF6B6B]/10 p-4 rounded-xl border border-[#FF6B6B]/30 text-center">
                     <h4 className="text-[#FF6B6B] font-bold text-2xl">{questionBank.length}</h4>
                     <p className="text-[#F4E4BC]/60 text-sm">إجمالي بنك الأسئلة</p>
                 </div>
             </div>

             <CollapsibleSection title="طلبات الاعتماد الواردة" defaultOpen={true}>
                 {pendingBankQuestions.length === 0 ? (
                     <div className="text-center py-8 text-[#F4E4BC]/40">
                         <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                         <p>لا توجد أسئلة معلقة حالياً. أحسنت!</p>
                     </div>
                 ) : (
                     <div className="space-y-4">
                         {pendingBankQuestions.map(q => (
                             <div key={q.id} className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037] hover:border-[#DAA520] transition-all">
                                 <div className="flex justify-between items-start mb-3">
                                     <div>
                                         <div className="flex items-center gap-2 mb-1">
                                             <span className="bg-[#DAA520]/20 text-[#DAA520] text-xs px-2 py-0.5 rounded">{q.subject}</span>
                                             <span className="text-[#F4E4BC]/40 text-xs">•</span>
                                             <span className="text-[#F4E4BC]/60 text-xs">{q.authorName}</span>
                                         </div>
                                         <h4 className="text-[#F4E4BC] font-bold text-lg">{q.text}</h4>
                                     </div>
                                     <div className="flex gap-2">
                                         <button 
                                            onClick={() => updateBankQuestionStatus(q.id, 'rejected')}
                                            className="p-2 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] rounded transition-colors"
                                            title="رفض"
                                         >
                                             <X className="w-5 h-5" />
                                         </button>
                                         <button 
                                            onClick={() => {
                                                setSelectedQuestion(q);
                                                // Default category
                                                setQuestionCategory('accuracy');
                                            }}
                                            className="p-2 hover:bg-[#4ECDC4]/20 text-[#4ECDC4] rounded transition-colors"
                                            title="مراجعة واعتماد"
                                         >
                                             <CheckSquare className="w-5 h-5" />
                                         </button>
                                     </div>
                                 </div>
                                 
                                 <div className="grid grid-cols-2 gap-2 mt-3">
                                    {q.options?.map((opt: string, i: number) => (
                                         <div key={i} className={cn(
                                             "px-3 py-2 rounded text-sm text-right",
                                             i.toString() === q.correctAnswer 
                                                ? "bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30" 
                                                : "bg-[#000]/20 text-[#F4E4BC]/60 border border-[#5D4037]/30"
                                         )}>
                                             {opt}
                                             {i.toString() === q.correctAnswer && <CheckCircle2 className="w-3 h-3 inline mr-2" />}
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
             </CollapsibleSection>

             <CollapsibleSection title="بنك الأسئلة المعتمد">
                 <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                     {approvedBankQuestions.map(q => (
                         <div key={q.id} className="flex items-center justify-between p-3 bg-[#000]/20 rounded border border-[#5D4037]/30 hover:bg-[#000]/40">
                             <div className="flex items-center gap-3 overflow-hidden">
                                 <div className={cn(
                                     "w-2 h-2 rounded-full shrink-0",
                                     q.category === 'speed' ? "bg-[#FFD700]" :
                                     q.category === 'intelligence' ? "bg-[#9B59B6]" :
                                     "bg-[#4ECDC4]"
                                 )} />
                                 <span className="text-[#F4E4BC] text-sm truncate">{q.text}</span>
                             </div>
                             <div className="flex items-center gap-2 shrink-0">
                                 <span className="text-[#F4E4BC]/40 text-xs">{q.subject}</span>
                                 <button 
                                    onClick={() => deleteQuestion(q.id)}
                                    className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10 p-1 rounded"
                                 >
                                     <Trash2 className="w-4 h-4" />
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
             </CollapsibleSection>
          </div>
        );

      case 'reports':
        // --- Dynamic Calculations for Reports ---
        const studentUsers = users.filter(u => u.role === 'student');
        const totalStudents = studentUsers.length || 1; // Prevent division by zero
        
        // 1. Participation Rate (based on Attendance)
        const attendedStudentIds = new Set(attendanceRecords.map(a => a.studentId));
        const participationRate = Math.round((attendedStudentIds.size / totalStudents) * 100);

        // 2. Task Completion Rate (based on Submissions)
        // Proxy: Unique Students with Submissions / Total Students
        const submittingStudentNames = new Set((submissions || []).map(s => s.studentName));
        const activeTaskStudents = studentUsers.filter(u => submittingStudentNames.has(u.name)).length;
        const taskCompletionRate = Math.round((activeTaskStudents / totalStudents) * 100);

        // 3. Struggling Students (Level < 3 or No XP)
        const strugglingStudents = studentUsers.filter(u => (u.level || 0) < 3).length;
        const strugglingRate = Math.round((strugglingStudents / totalStudents) * 100);

        // 4. Distributed Gold
        const totalDistributedGold = studentUsers.reduce((sum, u) => sum + (u.coins || 0), 0);
        const formattedGold = totalDistributedGold >= 1000 ? `${(totalDistributedGold / 1000).toFixed(1)}K` : totalDistributedGold;

        // Top Performers (Sorted by XP)
        const topPerformers = [...studentUsers]
            .sort((a, b) => (b.xp || 0) - (a.xp || 0))
            .slice(0, 5);

        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)]">مرصد الأداء المتقدم</h3>
                <div className="flex gap-2">
                    <select className="bg-[#000]/30 border border-[#5D4037] rounded-lg px-3 py-1 text-[#F4E4BC] text-sm outline-none focus:border-[#DAA520]">
                        <option>جميع الفصول</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <GoldButton className="text-xs px-3 py-1">تحديث البيانات</GoldButton>
                </div>
             </div>

             {/* Top Level KPIs */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#2A1B0E]/80 p-4 rounded-xl border border-[#DAA520]/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-16 h-16 text-[#DAA520]" />
                    </div>
                    <h4 className="text-[#F4E4BC]/60 text-xs font-bold mb-1">المشاركة الطلابية (حضور)</h4>
                    <p className="text-2xl font-bold text-[#FFD700]">{participationRate}%</p>
                    <div className="w-full bg-[#000]/50 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#FFD700] h-full rounded-full" style={{ width: `${participationRate}%` }} />
                    </div>
                </div>
                <div className="bg-[#2A1B0E]/80 p-4 rounded-xl border border-[#4ECDC4]/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CheckCircle2 className="w-16 h-16 text-[#4ECDC4]" />
                    </div>
                    <h4 className="text-[#F4E4BC]/60 text-xs font-bold mb-1">التفاعل مع المهام</h4>
                    <p className="text-2xl font-bold text-[#4ECDC4]">{taskCompletionRate}%</p>
                    <div className="w-full bg-[#000]/50 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#4ECDC4] h-full rounded-full" style={{ width: `${taskCompletionRate}%` }} />
                    </div>
                </div>
                <div className="bg-[#2A1B0E]/80 p-4 rounded-xl border border-[#FF6B6B]/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <XCircle className="w-16 h-16 text-[#FF6B6B]" />
                    </div>
                    <h4 className="text-[#F4E4BC]/60 text-xs font-bold mb-1">الطلاب المتعثرين (مستوى منخفض)</h4>
                    <p className="text-2xl font-bold text-[#FF6B6B]">{strugglingStudents}</p>
                    <div className="w-full bg-[#000]/50 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#FF6B6B] h-full rounded-full" style={{ width: `${Math.min(100, strugglingRate)}%` }} />
                    </div>
                </div>
                <div className="bg-[#2A1B0E]/80 p-4 rounded-xl border border-[#9B59B6]/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Gem className="w-16 h-16 text-[#9B59B6]" />
                    </div>
                    <h4 className="text-[#F4E4BC]/60 text-xs font-bold mb-1">الذهب الموزع</h4>
                    <p className="text-2xl font-bold text-[#9B59B6]">{formattedGold}</p>
                    <div className="w-full bg-[#000]/50 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#9B59B6] h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                </div>
             </div>

             {/* Detailed Charts Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Activity Chart */}
                <div className="lg:col-span-2 bg-[#000]/20 p-6 rounded-xl border border-[#5D4037]">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[#F4E4BC] font-bold flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#DAA520]" />
                            تحليل النشاط الأكاديمي (أسبوعي)
                        </h4>
                        <div className="flex gap-2 text-xs">
                            <span className="flex items-center gap-1 text-[#F4E4BC]/60"><div className="w-2 h-2 rounded-full bg-[#4ECDC4]" /> حل الواجبات</span>
                            <span className="flex items-center gap-1 text-[#F4E4BC]/60"><div className="w-2 h-2 rounded-full bg-[#FFD700]" /> الحضور</span>
                        </div>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        {['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map((day, i) => {
                            // Mock dynamic data based on day index + some randomness to look alive but consistent
                            const h1 = Math.floor(Math.random() * 60) + 20;
                            const h2 = Math.floor(Math.random() * 40) + 10;
                            return (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-1 group cursor-pointer">
                                    <div className="relative w-full bg-[#4ECDC4]/50 rounded-t hover:bg-[#4ECDC4] transition-colors" style={{ height: `${h1}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#000] text-[#4ECDC4] text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">{h1}%</div>
                                    </div>
                                    <div className="relative w-full bg-[#FFD700]/50 rounded-t hover:bg-[#FFD700] transition-colors" style={{ height: `${h2}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#000] text-[#FFD700] text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">{h2}%</div>
                                    </div>
                                    <span className="text-[10px] text-[#F4E4BC]/40 text-center mt-2">{day}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Top Performers */}
                <div className="bg-[#000]/20 p-6 rounded-xl border border-[#5D4037]">
                    <h4 className="text-[#F4E4BC] font-bold flex items-center gap-2 mb-6">
                        <Crown className="w-5 h-5 text-[#FFD700]" />
                        فرسان المملكة (الأعلى نقاطاً)
                    </h4>
                    <div className="space-y-4">
                        {topPerformers.length === 0 ? (
                             <p className="text-center text-[#F4E4BC]/40 text-sm">لا يوجد بيانات للطلاب بعد</p>
                        ) : (
                            topPerformers.map((student, i) => (
                                <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#DAA520]/10 transition-colors">
                                    <div className="font-bold text-[#DAA520] w-6">{i + 1}</div>
                                    <div className="w-10 h-10 rounded-full bg-[#2A1B0E] border border-[#DAA520]/30 flex items-center justify-center text-[#F4E4BC] font-bold">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="text-[#F4E4BC] text-sm font-bold">{student.name}</h5>
                                        <p className="text-[#F4E4BC]/40 text-xs">{classes.find(c => c.id === student.classId)?.name || student.classId || "غير محدد"}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[#FFD700] font-bold text-sm">{student.xp || 0}</span>
                                        <p className="text-[#F4E4BC]/30 text-[10px]">XP</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button className="w-full mt-4 text-xs text-[#DAA520] hover:underline">عرض القائمة الكاملة</button>
                </div>
             </div>

             {/* Reports List */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportsData.map((report) => (
                  <div 
                    key={report.id} 
                    className={`p-4 rounded-xl border-r-4 ${report.color.replace('bg-', 'border-').split(' ')[1]} bg-[#2A1B0E]/60 hover:bg-[#2A1B0E] transition-colors group cursor-pointer flex justify-between items-center`}
                  >
                    <div>
                        <h3 className="text-lg font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)] mb-1">
                            {report.title}
                        </h3>
                        <p className="text-[#F4E4BC]/50 text-xs max-w-xs">{report.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-xs px-2 py-1 rounded bg-[#000]/30 text-[#F4E4BC]/60 border border-[#5D4037]">
                         {report.type}
                       </span>
                       <button className="w-8 h-8 rounded-full bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520] hover:bg-[#DAA520] hover:text-[#2A1B0E] transition-all">
                           <FileText className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'ai': {
        const isInRange = (dateStr: string) => {
          if (advisorRange === 'all') return true;
          const date = new Date(dateStr);
          if (Number.isNaN(date.getTime())) return true;

          const now = new Date();
          let start = new Date(now);
          if (advisorRange === 'today') {
            start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          } else if (advisorRange === '7d') {
            start.setDate(now.getDate() - 7);
          } else if (advisorRange === '30d') {
            start.setDate(now.getDate() - 30);
          }

          return date.getTime() >= start.getTime();
        };

        const pendingQuestCount = quests.filter(q => q.status === 'pending').length;
        const pendingBehaviorCount = behaviorRecords.filter(r => r.status === 'pending').length;
        const pendingQuestionCount = questionBank.filter(q => q.status === 'pending').length;
        const unreadSupportCount = supportMessages.filter(m => !m.read).length;
        const upcomingCompetitionCount = competitions.filter(c => c.status === 'upcoming').length;

        const students = users.filter(u => u.role === 'student') as any[];
        const filteredStudents = advisorClassId === 'all' ? students : students.filter(s => s.classId === advisorClassId);
        const teachers = users.filter(u => u.role === 'teacher');
        const totalStudentCoins = filteredStudents.reduce((sum, s) => sum + (s.coins || 0), 0);
        const totalStudentXP = filteredStudents.reduce((sum, s) => sum + (s.xp || 0), 0);
        const averageStudentXP = filteredStudents.length ? Math.round(totalStudentXP / filteredStudents.length) : 0;
        const topStudents = [...filteredStudents].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5);

        const newQuestionsInRange = questionBank.filter(q => isInRange(q.createdAt)).length;
        const newBehaviorsInRange = behaviorRecords.filter(r => isInRange(r.date)).length;
        const newBroadcastsInRange = broadcasts.filter(b => isInRange(b.date)).length;

        const actionItems = [
          {
            id: 'questions',
            title: 'اعتماد الأسئلة',
            desc: pendingQuestionCount ? `يوجد ${pendingQuestionCount} سؤال/أسئلة بانتظار الاعتماد.` : 'لا توجد أسئلة معلقة.',
            count: pendingQuestionCount,
            color: 'text-[#4ECDC4]',
            border: 'border-[#4ECDC4]'
          },
          {
            id: 'approvals',
            title: 'اعتماد المهام والسلوك',
            desc: (pendingQuestCount + pendingBehaviorCount) ? `يوجد ${pendingQuestCount} مهام و ${pendingBehaviorCount} سلوكيات معلقة.` : 'لا توجد طلبات اعتماد معلقة.',
            count: pendingQuestCount + pendingBehaviorCount,
            color: 'text-[#FFD700]',
            border: 'border-[#FFD700]'
          },
          {
            id: 'support',
            title: 'رسائل الدعم',
            desc: unreadSupportCount ? `يوجد ${unreadSupportCount} رسالة غير مقروءة.` : 'لا توجد رسائل غير مقروءة.',
            count: unreadSupportCount,
            color: 'text-[#FF6B6B]',
            border: 'border-[#FF6B6B]'
          }
        ];

        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#112240] to-[#2A1B0E] p-6 rounded-xl border border-[#4ECDC4]/30 flex flex-col lg:flex-row items-start lg:items-center gap-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <BrainCircuit className="w-64 h-64 text-[#4ECDC4]" />
              </div>

              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-[#4ECDC4]/20 rounded-full border border-[#4ECDC4]">
                    <Bot className="w-8 h-8 text-[#4ECDC4]" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#fff] font-[family-name:var(--font-amiri)]">مستشار المملكة</h2>
                    <p className="text-[#F4E4BC]/70 text-sm">موجز قابل للتنفيذ + اختصارات مباشرة لأقسام الإدارة</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4 items-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#F4E4BC]/60 text-xs">الفصل</span>
                    <select
                      value={advisorClassId}
                      onChange={e => setAdvisorClassId(e.target.value)}
                      className="bg-[#000]/30 border border-[#5D4037] rounded-lg px-3 py-2 text-[#F4E4BC] text-sm focus:border-[#4ECDC4] outline-none"
                    >
                      <option value="all">كل الفصول</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#F4E4BC]/60 text-xs">الفترة</span>
                    <select
                      value={advisorRange}
                      onChange={e => setAdvisorRange(e.target.value as any)}
                      className="bg-[#000]/30 border border-[#5D4037] rounded-lg px-3 py-2 text-[#F4E4BC] text-sm focus:border-[#4ECDC4] outline-none"
                    >
                      <option value="today">اليوم</option>
                      <option value="7d">آخر 7 أيام</option>
                      <option value="30d">آخر 30 يوم</option>
                      <option value="all">الكل</option>
                    </select>
                  </div>
                  <GoldButton className="px-6 text-sm" onClick={() => router.push('/ather-mind')}>
                    فتح عقل أثير
                  </GoldButton>
                  <button
                    onClick={() => setActiveView('questions-approval')}
                    className="px-4 py-2 rounded-lg border border-[#4ECDC4]/30 bg-[#000]/30 text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-[#0a192f] transition-colors text-sm"
                  >
                    اعتماد الأسئلة
                  </button>
                  <button
                    onClick={() => setActiveView('approvals')}
                    className="px-4 py-2 rounded-lg border border-[#FFD700]/30 bg-[#000]/30 text-[#FFD700] hover:bg-[#FFD700] hover:text-[#2A1B0E] transition-colors text-sm"
                  >
                    اعتماد المهام والسلوك
                  </button>
                  <button
                    onClick={() => setActiveView('messages')}
                    className="px-4 py-2 rounded-lg border border-[#FF6B6B]/30 bg-[#000]/30 text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-[#2A1B0E] transition-colors text-sm"
                  >
                    رسائل الدعم
                  </button>
                </div>
              </div>

              <div className="relative z-10 w-full lg:w-[360px] bg-[#0a192f]/80 p-5 rounded-xl border border-[#4ECDC4]/30 backdrop-blur-sm">
                <h3 className="text-[#4ECDC4] font-bold mb-4 border-b border-[#4ECDC4]/20 pb-2">مؤشرات سريعة</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#000]/30 p-3 rounded-lg border border-[#5D4037]/40">
                    <div className="text-[#F4E4BC]/60 text-xs">الطلاب</div>
                    <div className="text-[#fff] font-bold text-xl">{students.length}</div>
                  </div>
                  <div className="bg-[#000]/30 p-3 rounded-lg border border-[#5D4037]/40">
                    <div className="text-[#F4E4BC]/60 text-xs">المعلمين</div>
                    <div className="text-[#fff] font-bold text-xl">{teachers.length}</div>
                  </div>
                  <div className="bg-[#000]/30 p-3 rounded-lg border border-[#5D4037]/40">
                    <div className="text-[#F4E4BC]/60 text-xs">متوسط XP</div>
                    <div className="text-[#4ECDC4] font-bold text-xl">{averageStudentXP}</div>
                  </div>
                  <div className="bg-[#000]/30 p-3 rounded-lg border border-[#5D4037]/40">
                    <div className="text-[#F4E4BC]/60 text-xs">ذهب الطلاب</div>
                    <div className="text-[#FFD700] font-bold text-xl">{totalStudentCoins}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-[#000]/30 p-2 rounded border border-[#5D4037]/40 text-center">
                    <div className="text-[#F4E4BC]/50 text-[10px]">جديد (أسئلة)</div>
                    <div className="text-[#4ECDC4] font-bold text-sm">{newQuestionsInRange}</div>
                  </div>
                  <div className="bg-[#000]/30 p-2 rounded border border-[#5D4037]/40 text-center">
                    <div className="text-[#F4E4BC]/50 text-[10px]">جديد (سلوك)</div>
                    <div className="text-[#FFD700] font-bold text-sm">{newBehaviorsInRange}</div>
                  </div>
                  <div className="bg-[#000]/30 p-2 rounded border border-[#5D4037]/40 text-center">
                    <div className="text-[#F4E4BC]/50 text-[10px]">جديد (مراسيم)</div>
                    <div className="text-[#F4E4BC] font-bold text-sm">{newBroadcastsInRange}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-[#F4E4BC]/60">
                  <span>منافسات قادمة</span>
                  <span className="text-[#F4E4BC] font-bold">{upcomingCompetitionCount}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {actionItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'questions') setActiveView('questions-approval');
                    if (item.id === 'approvals') setActiveView('approvals');
                    if (item.id === 'support') setActiveView('messages');
                  }}
                  className={cn(
                    "text-right bg-[#000]/30 p-5 rounded-xl border transition-all",
                    `${item.border}/30 hover:border-opacity-100 hover:bg-[#000]/40`
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[#F4E4BC] font-bold text-base">{item.title}</h3>
                      <p className="text-[#F4E4BC]/60 text-xs mt-1">{item.desc}</p>
                    </div>
                    <div className={cn(
                      "min-w-10 h-10 rounded-full flex items-center justify-center border bg-[#000]/20",
                      item.border,
                      item.color
                    )}>
                      <span className="font-bold">{item.count}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#000]/30 rounded-xl border border-[#5D4037] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#FFD700] font-bold text-lg">توصيات تنفيذية</h3>
                  <span className="text-[#F4E4BC]/40 text-xs">مُحدّث</span>
                </div>
                <div className="space-y-3">
                  {(pendingQuestionCount > 0) && (
                    <div className="flex items-center justify-between bg-[#4ECDC4]/10 border border-[#4ECDC4]/20 p-3 rounded-lg">
                      <div className="text-sm text-[#F4E4BC]">اعتماد الأسئلة المعلقة لتمكين المنافسات.</div>
                      <button onClick={() => setActiveView('questions-approval')} className="text-xs px-3 py-1 rounded bg-[#4ECDC4] text-[#0a192f]">فتح</button>
                    </div>
                  )}
                  {(pendingQuestCount + pendingBehaviorCount > 0) && (
                    <div className="flex items-center justify-between bg-[#FFD700]/10 border border-[#FFD700]/20 p-3 rounded-lg">
                      <div className="text-sm text-[#F4E4BC]">اعتماد طلبات المهام/السلوك لتحديث أرصدة الطلاب.</div>
                      <button onClick={() => setActiveView('approvals')} className="text-xs px-3 py-1 rounded bg-[#FFD700] text-[#2A1B0E]">فتح</button>
                    </div>
                  )}
                  {(unreadSupportCount > 0) && (
                    <div className="flex items-center justify-between bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 p-3 rounded-lg">
                      <div className="text-sm text-[#F4E4BC]">مراجعة رسائل الدعم غير المقروءة لتفادي التعطّل.</div>
                      <button onClick={() => setActiveView('messages')} className="text-xs px-3 py-1 rounded bg-[#FF6B6B] text-[#2A1B0E]">فتح</button>
                    </div>
                  )}
                  {(pendingQuestionCount + pendingQuestCount + pendingBehaviorCount + unreadSupportCount === 0) && (
                    <div className="text-center py-8 text-[#F4E4BC]/40">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>لا توجد عناصر عاجلة الآن. يمكنك متابعة التقارير أو إعداد منافسة.</p>
                      <div className="mt-4">
                        <button onClick={() => setActiveView('competitions')} className="px-4 py-2 rounded-lg border border-[#DAA520]/30 bg-[#000]/30 text-[#DAA520] hover:bg-[#DAA520] hover:text-[#2A1B0E] transition-colors text-sm">إدارة المنافسات</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#000]/30 rounded-xl border border-[#5D4037] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#4ECDC4] font-bold text-lg">أفضل الطلاب (XP)</h3>
                  <span className="text-[#F4E4BC]/40 text-xs">Top 5</span>
                </div>
                <div className="space-y-3">
                  {topStudents.map((s) => (
                    <div key={s.id} className="flex items-center justify-between bg-[#000]/20 border border-[#5D4037]/40 p-3 rounded-lg">
                      <div>
                        <div className="text-[#F4E4BC] font-bold text-sm">{s.name}</div>
                        <div className="text-[#F4E4BC]/40 text-xs">{classes.find(c => c.id === s.classId)?.name || s.classId || "غير محدد"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#4ECDC4] font-bold">{s.xp || 0}</div>
                        <div className="text-[#F4E4BC]/30 text-[10px]">XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'knowledge-maps':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-[#000]/20 p-4 rounded-xl border border-[#5D4037]">
                 <div>
                     <h3 className="text-[#F4E4BC] font-bold text-lg">إدارة خرائط المعرفة</h3>
                     <p className="text-[#F4E4BC]/60 text-sm">أضف محطات تعليمية، تحديات، وكنوز للمغامرين</p>
                 </div>
                 <GoldButton onClick={() => openMapNodeModal()} className="px-6 py-2 text-sm">
                     <Plus className="w-4 h-4 ml-2 inline" />
                     إضافة محطة
                 </GoldButton>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {mapNodes.map(node => (
                     <div key={node.id} className="bg-[#000]/40 border border-[#DAA520]/30 rounded-xl overflow-hidden group hover:border-[#DAA520] transition-all">
                         <div className="h-32 bg-gradient-to-b from-[#1a2c4e] to-[#000]/50 relative flex items-center justify-center">
                             <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                {node.type === 'island' ? '🏝️' : 
                                 node.type === 'forest' ? '🌲' : 
                                 node.type === 'cave' ? '🏔️' : '🏰'}
                             </div>
                             <div className="absolute top-2 right-2 bg-[#000]/60 px-2 py-1 rounded text-xs text-[#F4E4BC] border border-[#5D4037]">
                                 {node.status === 'locked' ? 'مغلق 🔒' : 'مفتوح 🔓'}
                             </div>
                         </div>
                         <div className="p-4">
                             <h4 className="text-[#FFD700] font-bold text-lg mb-1">{node.title}</h4>
                             <p className="text-[#F4E4BC]/60 text-sm h-10 overflow-hidden">{node.description}</p>
                             
                             <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                 <span className="bg-[#4ECDC4]/10 text-[#4ECDC4] px-2 py-1 rounded">مستوى {node.levelReq}</span>
                                 <span className="bg-[#DAA520]/10 text-[#DAA520] px-2 py-1 rounded">{node.questionsCount} سؤال</span>
                             </div>

                             <div className="mt-4 pt-4 border-t border-[#5D4037]/50 flex justify-end gap-2">
                                 <button 
                                    onClick={() => deleteMapNode(node.id)}
                                    className="p-2 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded transition-colors"
                                 >
                                     <Trash2 className="w-4 h-4" />
                                 </button>
                                 <button 
                                    onClick={() => openMapNodeModal(node)}
                                    className="p-2 text-[#4ECDC4] hover:bg-[#4ECDC4]/10 rounded transition-colors"
                                 >
                                     <Edit2 className="w-4 h-4" />
                                 </button>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
          </div>
        );

      default:
        return (
           <div className="flex flex-col items-center justify-center h-64 text-[#F4E4BC]/50">
             <Settings className="w-16 h-16 mb-4 opacity-50" />
             <p className="text-xl font-[family-name:var(--font-cairo)]">هذا القسم قيد التطوير ({navItems.find(i => i.id === activeView)?.label})</p>
           </div>
        );
    }
  };

  return (
    <>
      <MobileNav />
      <PageTransition>
        <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2576&auto=format&fit=crop')] bg-cover bg-center overflow-hidden flex">
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />

          {/* Sidebar */}
          <div className="relative z-10 hidden lg:block h-screen sticky top-0 w-64 p-4">
             <div className="bg-[#2A1B0E]/95 h-full rounded-2xl border-2 border-[#DAA520] shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-[#DAA520]/30 text-center">
                    <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">قصر القيادة</h2>
                    <p className="text-[#F4E4BC]/60 text-xs mt-1">لوحة تحكم الإدارة</p>
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
                            <p className="text-[#F4E4BC]/50 text-xs">مدير النظام</p>
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
                    آخر تحديث: {currentDate}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <NotificationCenter />
                  <GoldButton className="px-6 text-sm" onClick={() => handleAction("تصدير PDF")}>
                     تصدير التقرير
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

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowAddUserModal(false)}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">
                            {editingUser 
                                ? `تعديل بيانات ${activeUserTab === 'student' ? 'الطالب' : activeUserTab === 'teacher' ? 'المعلم' : 'ولي الأمر'}`
                                : `إضافة ${activeUserTab === 'student' ? 'طالب' : activeUserTab === 'teacher' ? 'معلم' : 'ولي أمر'} جديد`
                            }
                        </h2>
                        <button onClick={() => setShowAddUserModal(false)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSaveUser} className="space-y-4">
                        {editingUser && (
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الرقم الخاص (ID)</label>
                                <input 
                                    type="text" 
                                    value={editingUser.id}
                                    disabled
                                    className="w-full bg-[#000]/10 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC]/50 cursor-not-allowed outline-none" 
                                />
                            </div>
                        )}
                        <div>
                             <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الاسم الكامل</label>
                             <input 
                                type="text" 
                                required 
                                value={newUser.name || ''}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                onChange={e => setNewUser({...newUser, name: e.target.value})}
                             />
                        </div>
                        <div>
                             <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">البريد الإلكتروني</label>
                             <input 
                                type="email" 
                                required 
                                value={newUser.email || ''}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                onChange={e => setNewUser({...newUser, email: e.target.value})}
                             />
                        </div>
                        <div>
                             <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">كلمة المرور</label>
                             <input 
                                type="text" 
                                required 
                                value={newUser.password || ''}
                                placeholder="تعيين كلمة مرور جديدة"
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                onChange={e => setNewUser({...newUser, password: e.target.value})}
                             />
                        </div>

                        {/* Student Specific Fields */}
                        {activeUserTab === 'student' && (
                            <>
                                <div>
                                    <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الفصل الدراسي</label>
                                    <select 
                                        className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                        value={newUser.classId || ''}
                                        onChange={e => setNewUser({...newUser, classId: e.target.value})}
                                    >
                                        <option value="">اختر الفصل</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">ربط بولي الأمر</label>
                                    <select 
                                        className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                        onChange={e => setNewUser({...newUser, parentId: Number(e.target.value)})}
                                    >
                                        <option value="">اختر ولي الأمر</option>
                                        {users.filter(u => u.role === 'parent').map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الذهب</label>
                                        <input 
                                            type="number" 
                                            value={newUser.coins || 0}
                                            onChange={e => setNewUser({...newUser, coins: parseInt(e.target.value)})}
                                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#FFD700] focus:border-[#DAA520] outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">نقاط XP</label>
                                        <input 
                                            type="number" 
                                            value={newUser.xp || 0}
                                            onChange={e => setNewUser({...newUser, xp: parseInt(e.target.value)})}
                                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#4ECDC4] focus:border-[#DAA520] outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">المستوى</label>
                                        <input 
                                            type="number" 
                                            value={newUser.level || 1}
                                            onChange={e => setNewUser({...newUser, level: parseInt(e.target.value)})}
                                            className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Teacher Specific Fields */}
                        {activeUserTab === 'teacher' && (
                            <>
                                <div>
                                    <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">المادة</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                        onChange={e => setNewUser({...newUser, subject: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">تعيين الفصول (يمكنك اختيار أكثر من فصل)</label>
                                    <select 
                                        multiple
                                        value={newUser.assignedClasses || []}
                                        className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none h-24"
                                        onChange={e => {
                                            const options = Array.from(e.target.selectedOptions, option => option.value);
                                            setNewUser({...newUser, assignedClasses: options});
                                        }}
                                    >
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="pt-8 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowAddUserModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                            <GoldButton type="submit" className="px-8">
                                <Save className="w-4 h-4 ml-2 inline" />
                                حفظ
                            </GoldButton>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Class Modal */}
      <AnimatePresence>
        {showClassModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowClassModal(false)}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">
                            {editingClass ? "تعديل الفصل" : "إضافة فصل جديد"}
                        </h2>
                        <button onClick={() => setShowClassModal(false)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSaveClass} className="space-y-4">
                        <div>
                             <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">اسم الفصل</label>
                             <input 
                                type="text" 
                                required 
                                value={classForm.name}
                                onChange={e => setClassForm({...classForm, name: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                placeholder="مثال: 1-A"
                             />
                        </div>
                        <div>
                             <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">المرحلة الدراسية</label>
                             <select 
                                value={classForm.grade}
                                onChange={e => setClassForm({...classForm, grade: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                             >
                                <option value="">اختر المرحلة</option>
                                {stages.map(stage => (
                                    <option key={stage} value={stage}>{stage}</option>
                                ))}
                             </select>
                        </div>
                        <div>
                             <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">الطاقة الاستيعابية</label>
                             <input 
                                type="number" 
                                required 
                                value={classForm.capacity}
                                onChange={e => setClassForm({...classForm, capacity: parseInt(e.target.value)})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                             />
                        </div>
                        <div>
                             <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">تعيين معلم مسؤول (رائد الفصل)</label>
                             <select 
                                value={classForm.teacherId}
                                onChange={e => setClassForm({...classForm, teacherId: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                             >
                                <option value="">اختر معلم</option>
                                {users.filter(u => u.role === 'teacher').map(t => (
                                    <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                                ))}
                             </select>
                        </div>

                        <div className="pt-8 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowClassModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                            <GoldButton type="submit" className="px-8">
                                <Save className="w-4 h-4 ml-2 inline" />
                                حفظ
                            </GoldButton>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Stage Modal */}
      <AnimatePresence>
        {showStageModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowStageModal(false)}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">إدارة المراحل الدراسية</h2>
                        <button onClick={() => setShowStageModal(false)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={newStageName}
                                onChange={(e) => setNewStageName(e.target.value)}
                                placeholder="أضف مرحلة جديدة..." 
                                className="flex-1 bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                            />
                            <GoldButton 
                                onClick={() => {
                                    if (newStageName.trim()) {
                                        addStage(newStageName.trim());
                                        setNewStageName("");
                                        showToast("تم إضافة المرحلة بنجاح", "success");
                                    }
                                }}
                                className="px-6"
                            >
                                <Plus className="w-4 h-4" />
                            </GoldButton>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                            {stages.map(stage => (
                                <div key={stage} className="flex justify-between items-center p-3 bg-[#000]/30 rounded-lg border border-[#5D4037] hover:border-[#DAA520] transition-colors">
                                    <span className="text-[#F4E4BC]">{stage}</span>
                                    <button 
                                        onClick={() => {
                                            if (confirm(`هل أنت متأكد من حذف مرحلة "${stage}"؟ سيتم التأثير على الفصول المرتبطة.`)) {
                                                removeStage(stage);
                                                showToast("تم حذف المرحلة", "info");
                                            }
                                        }}
                                        className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10 p-2 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {stages.length === 0 && (
                                <p className="text-center text-[#F4E4BC]/40 py-4">لا توجد مراحل مضافة</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <GoldButton onClick={() => setShowStageModal(false)} className="px-8">
                            إغلاق
                        </GoldButton>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Question Review Modal */}
      <AnimatePresence>
        {selectedQuestion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSelectedQuestion(null)}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">مراجعة واعتماد السؤال</h2>
                        <button onClick={() => setSelectedQuestion(null)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#000]/30 p-4 rounded-lg border border-[#5D4037]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-[#DAA520]/20 text-[#DAA520] text-xs px-2 py-0.5 rounded">{selectedQuestion.subject}</span>
                                <span className="text-[#F4E4BC]/40 text-xs">بواسطة: {selectedQuestion.authorName}</span>
                            </div>
                            <h3 className="text-[#F4E4BC] font-bold text-lg mb-4">{selectedQuestion.text}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {selectedQuestion.options?.map((opt: string, i: number) => (
                                    <div key={i} className={cn(
                                        "px-3 py-2 rounded text-sm text-right",
                                        i.toString() === selectedQuestion.correctAnswer 
                                        ? "bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30" 
                                        : "bg-[#000]/20 text-[#F4E4BC]/60 border border-[#5D4037]/30"
                                    )}>
                                        {opt}
                                        {i.toString() === selectedQuestion.correctAnswer && <CheckCircle2 className="w-3 h-3 inline mr-2" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">تصنيف السؤال (للمسابقات)</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'accuracy', label: 'الدقة', icon: '🎯' },
                                    { id: 'speed', label: 'السرعة', icon: '⚡' },
                                    { id: 'intelligence', label: 'الذكاء', icon: '🧠' }
                                ].map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setQuestionCategory(cat.id as any)}
                                        className={cn(
                                            "p-3 rounded-lg border transition-all text-center",
                                            questionCategory === cat.id 
                                                ? "bg-[#DAA520]/20 border-[#DAA520] text-[#DAA520]" 
                                                : "bg-[#000]/30 border-[#5D4037] text-[#F4E4BC]/60 hover:border-[#DAA520]/50"
                                        )}
                                    >
                                        <div className="text-xl mb-1">{cat.icon}</div>
                                        <div className="text-sm">{cat.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button 
                                onClick={() => setSelectedQuestion(null)}
                                className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors"
                            >
                                إلغاء
                            </button>
                            <GoldButton 
                                onClick={() => {
                                    updateBankQuestionStatus(selectedQuestion.id, 'approved', questionCategory);
                                    showToast("تم اعتماد السؤال وإضافته للبنك", "success");
                                    setSelectedQuestion(null);
                                }}
                                className="px-8"
                            >
                                <CheckSquare className="w-4 h-4 ml-2 inline" />
                                اعتماد السؤال
                            </GoldButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Question Review Modal */}
      <AnimatePresence>
        {selectedQuestion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSelectedQuestion(null)}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">مراجعة واعتماد السؤال</h2>
                        <button onClick={() => setSelectedQuestion(null)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#000]/30 p-4 rounded-lg border border-[#5D4037]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-[#DAA520]/20 text-[#DAA520] text-xs px-2 py-0.5 rounded">{selectedQuestion.subject}</span>
                                <span className="text-[#F4E4BC]/40 text-xs">بواسطة: {selectedQuestion.authorName}</span>
                            </div>
                            <h3 className="text-[#F4E4BC] font-bold text-lg mb-4">{selectedQuestion.text}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {selectedQuestion.options?.map((opt: string, i: number) => (
                                    <div key={i} className={cn(
                                        "px-3 py-2 rounded text-sm text-right",
                                        i.toString() === selectedQuestion.correctAnswer 
                                        ? "bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/30" 
                                        : "bg-[#000]/20 text-[#F4E4BC]/60 border border-[#5D4037]/30"
                                    )}>
                                        {opt}
                                        {i.toString() === selectedQuestion.correctAnswer && <CheckCircle2 className="w-3 h-3 inline mr-2" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">تصنيف السؤال (للمسابقات)</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'accuracy', label: 'الدقة', icon: '🎯' },
                                    { id: 'speed', label: 'السرعة', icon: '⚡' },
                                    { id: 'intelligence', label: 'الذكاء', icon: '🧠' }
                                ].map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setQuestionCategory(cat.id as any)}
                                        className={cn(
                                            "p-3 rounded-lg border transition-all text-center",
                                            questionCategory === cat.id 
                                                ? "bg-[#DAA520]/20 border-[#DAA520] text-[#DAA520]" 
                                                : "bg-[#000]/30 border-[#5D4037] text-[#F4E4BC]/60 hover:border-[#DAA520]/50"
                                        )}
                                    >
                                        <div className="text-xl mb-1">{cat.icon}</div>
                                        <div className="text-sm">{cat.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button 
                                onClick={() => setSelectedQuestion(null)}
                                className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors"
                            >
                                إلغاء
                            </button>
                            <GoldButton 
                                onClick={() => {
                                    updateBankQuestionStatus(selectedQuestion.id, 'approved', questionCategory);
                                    showToast("تم اعتماد السؤال وإضافته للبنك", "success");
                                    setSelectedQuestion(null);
                                }}
                                className="px-8"
                            >
                                <CheckSquare className="w-4 h-4 ml-2 inline" />
                                اعتماد السؤال
                            </GoldButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Market Modal */}
      <AnimatePresence>
        {showMarketModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowMarketModal(false)}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">
                            {editingMarketItem ? "تعديل الكنز" : "إضافة كنز جديد"}
                        </h2>
                        <button onClick={() => setShowMarketModal(false)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSaveMarketItem} className="space-y-4">
                        <div>
                             <label className="block text-[#F4E4BC] mb-2 text-sm">اسم الكنز</label>
                             <input 
                                type="text" 
                                required 
                                value={marketItemForm.name}
                                onChange={e => setMarketItemForm({...marketItemForm, name: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                placeholder="مثال: سيف العدالة"
                             />
                        </div>
                        
                        <div>
                             <label className="block text-[#F4E4BC] mb-2 text-sm">الوصف</label>
                             <textarea 
                                required 
                                value={marketItemForm.description}
                                onChange={e => setMarketItemForm({...marketItemForm, description: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none h-24 resize-none" 
                                placeholder="وصف الكنز..."
                             />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 text-sm">السعر (ذهبية)</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={marketItemForm.price}
                                    onChange={e => setMarketItemForm({...marketItemForm, price: parseInt(e.target.value)})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#FFD700] focus:border-[#DAA520] outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 text-sm">النوع</label>
                                <select 
                                    value={marketItemForm.type}
                                    onChange={e => setMarketItemForm({...marketItemForm, type: e.target.value})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                >
                                    <option value="item">أداة</option>
                                    <option value="badge">وسام</option>
                                    <option value="background">خلفية</option>
                                    <option value="avatar">شخصية</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#F4E4BC] mb-2 text-sm">الندرة</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['common', 'rare', 'epic', 'legendary'].map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setMarketItemForm({...marketItemForm, rarity: r})}
                                        className={cn(
                                            "p-2 rounded border text-xs capitalize transition-all",
                                            marketItemForm.rarity === r 
                                                ? r === 'legendary' ? "bg-[#FFD700]/20 border-[#FFD700] text-[#FFD700]" :
                                                  r === 'epic' ? "bg-[#9B59B6]/20 border-[#9B59B6] text-[#9B59B6]" :
                                                  r === 'rare' ? "bg-[#4ECDC4]/20 border-[#4ECDC4] text-[#4ECDC4]" :
                                                  "bg-[#F4E4BC]/20 border-[#F4E4BC] text-[#F4E4BC]"
                                                : "bg-[#000]/30 border-[#5D4037] text-[#F4E4BC]/40"
                                        )}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowMarketModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                            <GoldButton type="submit" className="px-8">
                                <Save className="w-4 h-4 ml-2 inline" />
                                حفظ
                            </GoldButton>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowSettingsModal(false)}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">إعدادات النظام</h2>
                        <button onClick={() => setShowSettingsModal(false)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-[#000]/30 rounded-lg border border-[#5D4037]">
                            <div>
                                <h3 className="text-[#F4E4BC] font-bold mb-1">تفعيل التسجيل الجديد</h3>
                                <p className="text-xs text-[#F4E4BC]/60">السماح للطلاب الجدد بإنشاء حسابات</p>
                            </div>
                            <div className="w-12 h-6 bg-[#4ECDC4] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>

                        {/* Stage Management */}
                         <div className="p-4 bg-[#000]/30 rounded-lg border border-[#5D4037]">
                            <h3 className="text-[#F4E4BC] font-bold mb-4">إدارة المراحل الدراسية</h3>
                            <div className="flex gap-2 mb-4">
                                <input 
                                    type="text" 
                                    id="newStageInput"
                                    placeholder="أضف مرحلة جديدة..." 
                                    className="flex-1 bg-[#2A1B0E] border border-[#5D4037] rounded p-2 text-[#F4E4BC] text-sm focus:border-[#DAA520] outline-none"
                                />
                                <GoldButton 
                                    onClick={() => {
                                        const input = document.getElementById('newStageInput') as HTMLInputElement;
                                        if (input.value.trim()) {
                                            addStage(input.value.trim());
                                            input.value = "";
                                            showToast("تم إضافة المرحلة بنجاح", "success");
                                        }
                                    }}
                                    className="px-4 py-1 text-xs"
                                >
                                    <Plus className="w-4 h-4" />
                                </GoldButton>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {stages.map(stage => (
                                    <div key={stage} className="bg-[#DAA520]/10 border border-[#DAA520]/30 rounded px-3 py-1 flex items-center gap-2">
                                        <span className="text-[#F4E4BC] text-sm">{stage}</span>
                                        <button 
                                            onClick={() => {
                                                if (confirm(`هل أنت متأكد من حذف مرحلة "${stage}"؟`)) {
                                                    removeStage(stage);
                                                    showToast("تم حذف المرحلة", "info");
                                                }
                                            }}
                                            className="text-[#FF6B6B] hover:text-[#FF6B6B]/80"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                         </div>

                        <div className="flex items-center justify-between p-4 bg-[#000]/30 rounded-lg border border-[#5D4037]">
                            <div>
                                <h3 className="text-[#F4E4BC] font-bold mb-1">وضع الصيانة</h3>
                                <p className="text-xs text-[#F4E4BC]/60">إيقاف النظام مؤقتاً للتحديثات</p>
                            </div>
                            <div className="w-12 h-6 bg-[#5D4037] rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-[#F4E4BC] rounded-full shadow-sm" />
                            </div>
                        </div>

                         <div>
                             <label className="block text-[#F4E4BC] mb-2 font-[family-name:var(--font-cairo)]">عنوان الفصل الدراسي الحالي</label>
                             <input type="text" defaultValue="الفصل الدراسي الثاني 1445هـ" className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" />
                        </div>
                    </div>

                    <div className="pt-8 flex justify-end gap-3">
                        <button onClick={() => setShowSettingsModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                        <GoldButton onClick={() => { setShowSettingsModal(false); showToast("تم حفظ الإعدادات بنجاح", "success"); }} className="px-8">
                            <Save className="w-4 h-4 ml-2 inline" />
                            حفظ التغييرات
                        </GoldButton>
                    </div>
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
                            <span className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-[#DAA520]" />
                                {selectedMessage.type}
                            </span>
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

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowScheduleModal(false)}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">
                            {editingScheduleItem ? "تعديل حصة" : "إضافة حصة جديدة"}
                        </h2>
                        <button onClick={() => setShowScheduleModal(false)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSaveSchedule} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 text-sm">اليوم</label>
                                <select 
                                    value={scheduleForm.day}
                                    onChange={e => setScheduleForm({...scheduleForm, day: e.target.value})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                >
                                    {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 text-sm">التوقيت</label>
                                <input 
                                    type="time" 
                                    value={scheduleForm.time}
                                    onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                />
                            </div>
                        </div>

                        <div>
                             <label className="block text-[#F4E4BC] mb-2 text-sm">المادة (مسار المعرفة)</label>
                             <input 
                                type="text" 
                                required 
                                value={scheduleForm.subject}
                                onChange={e => setScheduleForm({...scheduleForm, subject: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                placeholder="مثال: الرياضيات"
                             />
                        </div>

                        <div>
                             <label className="block text-[#F4E4BC] mb-2 text-sm">المعلم المسؤول</label>
                             <select 
                                required
                                value={scheduleForm.teacherId}
                                onChange={e => setScheduleForm({...scheduleForm, teacherId: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                             >
                                <option value="">-- اختر المعلم --</option>
                                {users.filter(u => u.role === 'teacher').map(t => (
                                    <option key={t.id} value={t.id}>{t.name} - {t.subject}</option>
                                ))}
                             </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 text-sm">نوع الحصة</label>
                                <select 
                                    value={scheduleForm.type}
                                    onChange={e => setScheduleForm({...scheduleForm, type: e.target.value as any})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                >
                                    <option value="in-person">حضوري (في القاعة)</option>
                                    <option value="remote">عن بُعد (بوابة اللقاء)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 text-sm">المدة (دقيقة)</label>
                                <input 
                                    type="number" 
                                    value={scheduleForm.duration}
                                    onChange={e => setScheduleForm({...scheduleForm, duration: parseInt(e.target.value)})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                />
                            </div>
                        </div>

                        {scheduleForm.type === 'remote' && (
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 text-sm">رابط الاجتماع (Zoom/Teams)</label>
                                <input 
                                    type="url" 
                                    value={scheduleForm.meetingUrl}
                                    onChange={e => setScheduleForm({...scheduleForm, meetingUrl: e.target.value})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#4ECDC4] focus:border-[#4ECDC4] outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                        )}

                        <div className="pt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowScheduleModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                            <GoldButton type="submit" className="px-8">
                                <Save className="w-4 h-4 ml-2 inline" />
                                حفظ
                            </GoldButton>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Question Review Modal */}
      <AnimatePresence>
          {selectedQuestion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setSelectedQuestion(null)}
              />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                 <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                    <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">مراجعة السؤال</h2>
                    <button onClick={() => setSelectedQuestion(null)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                        <X className="w-6 h-6" />
                    </button>
                 </div>

                 <div className="space-y-6">
                     <div className="bg-[#000]/30 p-4 rounded-lg border border-[#5D4037]">
                         <div className="flex justify-between text-xs text-[#F4E4BC]/50 mb-2">
                             <span>المادة: {selectedQuestion.subject}</span>
                             <span>المعلم: {selectedQuestion.authorName}</span>
                         </div>
                         <h3 className="text-lg font-bold text-[#F4E4BC] mb-4">{selectedQuestion.text}</h3>
                         
                         {selectedQuestion.imageUrl && (
                             <img src={selectedQuestion.imageUrl} alt="Question" className="w-full h-48 object-cover rounded-lg mb-4 border border-[#5D4037]" />
                         )}

                         {selectedQuestion.type === 'mcq' && (
                             <div className="space-y-2">
                                 {selectedQuestion.options?.map((opt: string, i: number) => (
                                     <div key={i} className={cn(
                                         "p-2 rounded border text-sm",
                                         selectedQuestion.correctAnswer === i.toString() 
                                            ? "bg-[#4ECDC4]/10 border-[#4ECDC4] text-[#4ECDC4]" 
                                            : "bg-[#2A1B0E] border-[#5D4037] text-[#F4E4BC]/70"
                                     )}>
                                         {opt} {selectedQuestion.correctAnswer === i.toString() && "✓"}
                                     </div>
                                 ))}
                             </div>
                         )}

                        {selectedQuestion.type === 'true_false' && (
                             <div className="flex gap-4">
                                 <div className={cn(
                                     "flex-1 p-2 rounded border text-center text-sm",
                                     selectedQuestion.correctAnswer === 'true' 
                                        ? "bg-[#4ECDC4]/10 border-[#4ECDC4] text-[#4ECDC4]" 
                                        : "bg-[#2A1B0E] border-[#5D4037] text-[#F4E4BC]/70"
                                 )}>صح {selectedQuestion.correctAnswer === 'true' && "✓"}</div>
                                 <div className={cn(
                                     "flex-1 p-2 rounded border text-center text-sm",
                                     selectedQuestion.correctAnswer === 'false' 
                                        ? "bg-[#FF6B6B]/10 border-[#FF6B6B] text-[#FF6B6B]" 
                                        : "bg-[#2A1B0E] border-[#5D4037] text-[#F4E4BC]/70"
                                 )}>خطأ {selectedQuestion.correctAnswer === 'false' && "✓"}</div>
                             </div>
                         )}
                     </div>

                     <div>
                         <label className="block text-[#FFD700] mb-2 font-[family-name:var(--font-cairo)]">تصنيف السؤال (للذكاء الاصطناعي)</label>
                         <div className="grid grid-cols-3 gap-2">
                             <button 
                                onClick={() => setQuestionCategory('speed')}
                                className={cn(
                                    "p-2 rounded border transition-colors text-sm font-bold",
                                    questionCategory === 'speed' ? "bg-[#FFD700] text-[#2A1B0E] border-[#FFD700]" : "bg-[#000]/30 text-[#F4E4BC] border-[#5D4037]"
                                )}
                             >
                                 سرعة ⚡
                             </button>
                             <button 
                                onClick={() => setQuestionCategory('accuracy')}
                                className={cn(
                                    "p-2 rounded border transition-colors text-sm font-bold",
                                    questionCategory === 'accuracy' ? "bg-[#4ECDC4] text-[#2A1B0E] border-[#4ECDC4]" : "bg-[#000]/30 text-[#F4E4BC] border-[#5D4037]"
                                )}
                             >
                                 دقة 🎯
                             </button>
                             <button 
                                onClick={() => setQuestionCategory('intelligence')}
                                className={cn(
                                    "p-2 rounded border transition-colors text-sm font-bold",
                                    questionCategory === 'intelligence' ? "bg-[#9B59B6] text-white border-[#9B59B6]" : "bg-[#000]/30 text-[#F4E4BC] border-[#5D4037]"
                                )}
                             >
                                 ذكاء 🧠
                             </button>
                         </div>
                     </div>

                     <div className="pt-4 flex justify-end gap-3 border-t border-[#5D4037]">
                         <button 
                            onClick={() => {
                                deleteQuestion(selectedQuestion.id);
                                setSelectedQuestion(null);
                                showToast("تم رفض السؤال وحذفه", "info");
                            }} 
                            className="px-6 py-2 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors border border-[#FF6B6B]/30"
                         >
                             رفض
                         </button>
                         <GoldButton 
                            onClick={() => {
                                updateBankQuestionStatus(selectedQuestion.id, 'approved', questionCategory);
                                setSelectedQuestion(null);
                                showToast("تم اعتماد السؤال وإضافته لبنك الأسئلة المركزي", "success");
                            }} 
                            className="px-8"
                         >
                             اعتماد ونشر
                         </GoldButton>
                     </div>
                 </div>
              </motion.div>
            </div>
          )}
      </AnimatePresence>

      {/* Competition Modal */}
      <AnimatePresence>
        {showCompModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowCompModal(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
               <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)] mb-6 border-b border-[#5D4037] pb-4 flex items-center gap-2">
                   <Swords className="w-6 h-6" />
                   إنشاء منافسة جديدة
               </h2>
               
               <form onSubmit={handleCreateCompetition} className="space-y-4">
                  <div>
                      <label className="block text-[#F4E4BC]/70 text-sm mb-2">عنوان المنافسة</label>
                      <input 
                         type="text" 
                         required
                         value={compForm.title}
                         onChange={e => setCompForm({...compForm, title: e.target.value})}
                         className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                         placeholder="مثال: تحدي الرياضيات الكبرى"
                      />
                  </div>

                  <div>
                      <label className="block text-[#F4E4BC]/70 text-sm mb-2">الوصف</label>
                      <textarea 
                         required
                         value={compForm.description}
                         onChange={e => setCompForm({...compForm, description: e.target.value})}
                         className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none h-20 resize-none"
                         placeholder="وصف مختصر للمنافسة..."
                      />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-[#F4E4BC]/70 text-sm mb-2">المادة</label>
                          <input 
                             type="text" 
                             required
                             value={compForm.subject}
                             onChange={e => setCompForm({...compForm, subject: e.target.value})}
                             className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                             placeholder="الرياضيات"
                          />
                      </div>
                      <div>
                          <label className="block text-[#F4E4BC]/70 text-sm mb-2">المرحلة</label>
                          <select 
                             required
                             value={compForm.grade}
                             onChange={e => setCompForm({...compForm, grade: e.target.value})}
                             className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                          >
                              <option value="">اختر...</option>
                              {stages.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-[#F4E4BC]/70 text-sm mb-2">وقت البدء</label>
                          <input 
                             type="datetime-local" 
                             required
                             value={compForm.startTime}
                             onChange={e => setCompForm({...compForm, startTime: e.target.value})}
                             className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-[#F4E4BC]/70 text-sm mb-2">المدة (دقيقة)</label>
                          <input 
                             type="number" 
                             required
                             min="1"
                             value={compForm.durationMinutes}
                             onChange={e => setCompForm({...compForm, durationMinutes: Number(e.target.value)})}
                             className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                          />
                      </div>
                  </div>

                  <div>
                      <label className="block text-[#F4E4BC]/70 text-sm mb-2">عدد الأسئلة</label>
                      <input 
                         type="number" 
                         required
                         min="1"
                         max="50"
                         value={compForm.questionCount}
                         onChange={e => setCompForm({...compForm, questionCount: Number(e.target.value)})}
                         className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                      />
                      <p className="text-xs text-[#F4E4BC]/40 mt-1">سيتم اختيار الأسئلة عشوائياً من بنك الأسئلة المعتمد</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-[#FFD700]/70 text-sm mb-2">جائزة الذهب</label>
                          <input 
                             type="number" 
                             required
                             min="0"
                             value={compForm.rewards.gold}
                             onChange={e => setCompForm({...compForm, rewards: {...compForm.rewards, gold: Number(e.target.value)}})}
                             className="w-full bg-[#000]/30 border border-[#DAA520]/50 rounded-lg p-3 text-[#FFD700] focus:border-[#DAA520] outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-[#4ECDC4]/70 text-sm mb-2">جائزة XP</label>
                          <input 
                             type="number" 
                             required
                             min="0"
                             value={compForm.rewards.xp}
                             onChange={e => setCompForm({...compForm, rewards: {...compForm.rewards, xp: Number(e.target.value)}})}
                             className="w-full bg-[#000]/30 border border-[#4ECDC4]/50 rounded-lg p-3 text-[#4ECDC4] focus:border-[#4ECDC4] outline-none"
                          />
                      </div>
                  </div>

                  <div>
                      <label className="block text-[#F4E4BC]/70 text-sm mb-2">مصدر الأسئلة</label>
                      <div className="flex gap-4">
                          <button
                              type="button"
                              onClick={() => setCompForm(prev => ({ ...prev, source: 'bank' }))}
                              className={cn(
                                  "flex-1 p-3 rounded-lg border transition-all",
                                  compForm.source === 'bank' ? "bg-[#DAA520] text-[#2A1B0E] border-[#DAA520]" : "bg-[#000]/30 text-[#F4E4BC] border-[#5D4037]"
                              )}
                          >
                              بنك الأسئلة (تلقائي)
                          </button>
                          <button
                              type="button"
                              onClick={() => setCompForm(prev => ({ ...prev, source: 'manual' }))}
                              className={cn(
                                  "flex-1 p-3 rounded-lg border transition-all",
                                  compForm.source === 'manual' ? "bg-[#DAA520] text-[#2A1B0E] border-[#DAA520]" : "bg-[#000]/30 text-[#F4E4BC] border-[#5D4037]"
                              )}
                          >
                              بناء أسئلة جديدة
                          </button>
                      </div>
                  </div>

                  {compForm.source === 'bank' ? (
                      <div>
                          <label className="block text-[#F4E4BC]/70 text-sm mb-2">عدد الأسئلة</label>
                          <input 
                             type="number" 
                             required
                             min="1"
                             max="50"
                             value={compForm.questionCount}
                             onChange={e => setCompForm({...compForm, questionCount: Number(e.target.value)})}
                             className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                          />
                          <p className="text-xs text-[#F4E4BC]/40 mt-1">سيتم اختيار الأسئلة عشوائياً من بنك الأسئلة المعتمد</p>
                      </div>
                  ) : (
                      <div className="space-y-4 border border-[#5D4037] rounded-lg p-4 bg-[#000]/20">
                          <div className="flex justify-between items-center">
                              <h4 className="text-[#F4E4BC] font-bold text-sm">قائمة الأسئلة ({compForm.manualQuestions.length})</h4>
                          </div>
                          
                          {compForm.manualQuestions.map((q, i) => (
                              <div key={i} className="bg-[#2A1B0E] p-3 rounded border border-[#5D4037] flex justify-between items-center">
                                  <span className="text-[#F4E4BC] text-sm truncate max-w-[200px]">{q.text}</span>
                                  <button 
                                      type="button"
                                      onClick={() => setCompForm(prev => ({ ...prev, manualQuestions: prev.manualQuestions.filter((_, idx) => idx !== i) }))}
                                      className="text-[#FF6B6B]"
                                  >
                                      <X className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}

                          <div className="space-y-3 pt-4 border-t border-[#5D4037]/50">
                              <input 
                                  type="text" 
                                  placeholder="نص السؤال" 
                                  value={newQuestionForm.text}
                                  onChange={e => setNewQuestionForm(prev => ({ ...prev, text: e.target.value }))}
                                  className="w-full bg-[#000]/30 border border-[#5D4037] rounded p-2 text-[#F4E4BC] text-sm"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                  {newQuestionForm.options.map((opt, i) => (
                                      <div key={i} className="flex gap-2">
                                          <input 
                                              type="text" 
                                              placeholder={`خيار ${i + 1}`}
                                              value={opt}
                                              onChange={e => {
                                                  const newOptions = [...newQuestionForm.options];
                                                  newOptions[i] = e.target.value;
                                                  setNewQuestionForm(prev => ({ ...prev, options: newOptions }));
                                              }}
                                              className="flex-1 bg-[#000]/30 border border-[#5D4037] rounded p-2 text-[#F4E4BC] text-sm"
                                          />
                                          <input 
                                              type="radio" 
                                              name="correctAnswer" 
                                              checked={newQuestionForm.correctAnswer === i.toString()} 
                                              onChange={() => setNewQuestionForm(prev => ({ ...prev, correctAnswer: i.toString() }))}
                                              className="mt-2"
                                          />
                                      </div>
                                  ))}
                              </div>
                              <GoldButton type="button" onClick={handleAddManualQuestion} className="w-full text-xs py-2">
                                  <Plus className="w-3 h-3 ml-1 inline" /> إضافة السؤال
                              </GoldButton>
                          </div>
                      </div>
                  )}

                  <div className="flex gap-4 mt-6">
                      <GoldButton type="submit" fullWidth>إطلاق المنافسة</GoldButton>
                      <button 
                         type="button"
                         onClick={() => setShowCompModal(false)}
                         className="flex-1 border border-[#5D4037] text-[#F4E4BC] rounded-lg hover:bg-[#5D4037]/20 transition-colors"
                      >
                          إلغاء
                      </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Competition Details Modal */}
      <AnimatePresence>
        {selectedCompetition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedCompetition(null)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
               <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                    <div>
                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)] flex items-center gap-2">
                            <Swords className="w-6 h-6" />
                            {selectedCompetition.title}
                        </h2>
                        <span className={cn(
                            "text-xs px-2 py-0.5 rounded mt-1 inline-block",
                            selectedCompetition.status === 'active' ? "bg-[#2ECC71]/20 text-[#2ECC71]" :
                            selectedCompetition.status === 'upcoming' ? "bg-[#DAA520]/20 text-[#DAA520]" :
                            "bg-[#F4E4BC]/20 text-[#F4E4BC]"
                        )}>
                            {selectedCompetition.status === 'active' ? 'نشطة حالياً' : selectedCompetition.status === 'upcoming' ? 'مجدولة' : 'منتهية'}
                        </span>
                    </div>
                    <button onClick={() => setSelectedCompetition(null)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                        <X className="w-6 h-6" />
                    </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   <div className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037]">
                       <h4 className="text-[#F4E4BC]/60 text-sm mb-4">تفاصيل المنافسة</h4>
                       <div className="space-y-2 text-sm">
                           <div className="flex justify-between">
                               <span className="text-[#F4E4BC]/50">المادة:</span>
                               <span className="text-[#F4E4BC]">{selectedCompetition.subject}</span>
                           </div>
                           <div className="flex justify-between">
                               <span className="text-[#F4E4BC]/50">المرحلة:</span>
                               <span className="text-[#F4E4BC]">{selectedCompetition.grade}</span>
                           </div>
                           <div className="flex justify-between">
                               <span className="text-[#F4E4BC]/50">وقت البدء:</span>
                               <span className="text-[#F4E4BC]">{new Date(selectedCompetition.startTime).toLocaleString('ar-SA')}</span>
                           </div>
                           <div className="flex justify-between">
                               <span className="text-[#F4E4BC]/50">المدة:</span>
                               <span className="text-[#F4E4BC]">{selectedCompetition.durationMinutes} دقيقة</span>
                           </div>
                           <div className="flex justify-between">
                               <span className="text-[#F4E4BC]/50">عدد الأسئلة:</span>
                               <span className="text-[#F4E4BC]">{selectedCompetition.questionIds.length}</span>
                           </div>
                       </div>
                   </div>

                   <div className="bg-[#000]/30 p-4 rounded-xl border border-[#5D4037]">
                       <h4 className="text-[#F4E4BC]/60 text-sm mb-4">الجوائز</h4>
                       <div className="flex items-center justify-around h-full pb-4">
                           <div className="text-center">
                               <div className="text-[#FFD700] font-bold text-2xl">{selectedCompetition.rewards.gold}</div>
                               <div className="text-[#F4E4BC]/40 text-xs">عملة ذهبية</div>
                           </div>
                           <div className="w-px h-10 bg-[#5D4037]" />
                           <div className="text-center">
                               <div className="text-[#4ECDC4] font-bold text-2xl">{selectedCompetition.rewards.xp}</div>
                               <div className="text-[#F4E4BC]/40 text-xs">نقطة خبرة</div>
                           </div>
                       </div>
                   </div>
               </div>

               <div>
                   <h4 className="text-[#F4E4BC] font-bold mb-4 flex items-center gap-2">
                       <Users className="w-5 h-5 text-[#DAA520]" />
                       المشاركون ({selectedCompetition.participants.length})
                   </h4>
                   
                   <div className="bg-[#000]/20 rounded-xl border border-[#5D4037] overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                       {selectedCompetition.participants.length === 0 ? (
                           <div className="p-8 text-center text-[#F4E4BC]/30">
                               لم ينضم أحد للمنافسة بعد
                           </div>
                       ) : (
                           <table className="w-full text-right text-sm">
                               <thead className="text-[#F4E4BC]/40 bg-[#000]/20 sticky top-0">
                                   <tr>
                                       <th className="p-3">الطالب</th>
                                       <th className="p-3">النتيجة</th>
                                       <th className="p-3">وقت الإكمال</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-[#5D4037]/30">
                                   {selectedCompetition.participants
                                       .sort((a: any, b: any) => b.score - a.score)
                                       .map((p: any, i: number) => (
                                       <tr key={i} className="text-[#F4E4BC] hover:bg-[#DAA520]/5">
                                           <td className="p-3 flex items-center gap-2">
                                               {i < 3 && <span className="text-[#DAA520] font-bold">#{i + 1}</span>}
                                               {p.studentName}
                                           </td>
                                           <td className="p-3 font-bold text-[#FFD700]">{p.score}</td>
                                           <td className="p-3 text-[#F4E4BC]/50 text-xs">
                                               {p.completedAt ? new Date(p.completedAt).toLocaleTimeString('ar-SA') : '-'}
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       )}
                   </div>
               </div>

               <div className="mt-8 flex justify-end">
                   <GoldButton onClick={() => setSelectedCompetition(null)}>
                       إغلاق
                   </GoldButton>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Map Node Modal */}
      <AnimatePresence>
        {showMapNodeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowMapNodeModal(false)}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative z-50 bg-[#2A1B0E] border-2 border-[#DAA520] p-8 rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                >
                    <div className="flex justify-between items-center mb-6 border-b border-[#5D4037] pb-4">
                        <h2 className="text-2xl text-[#FFD700] font-[family-name:var(--font-amiri)]">
                            {editingMapNode ? "تعديل المحطة" : "إضافة محطة جديدة"}
                        </h2>
                        <button onClick={() => setShowMapNodeModal(false)} className="text-[#F4E4BC] hover:text-[#FF6B6B]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSaveMapNode} className="space-y-4">
                        <div>
                             <label className="block text-[#F4E4BC] mb-2 text-sm">عنوان المحطة</label>
                             <input 
                                type="text" 
                                required 
                                value={mapNodeForm.title}
                                onChange={e => setMapNodeForm({...mapNodeForm, title: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                placeholder="مثال: جزيرة الرياضيات"
                             />
                        </div>
                        
                        <div>
                             <label className="block text-[#F4E4BC] mb-2 text-sm">الوصف</label>
                             <textarea 
                                required 
                                value={mapNodeForm.description}
                                onChange={e => setMapNodeForm({...mapNodeForm, description: e.target.value})}
                                className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none h-24 resize-none" 
                                placeholder="وصف قصير للتحدي..."
                             />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 text-sm">نوع المحطة</label>
                                <select 
                                    value={mapNodeForm.type}
                                    onChange={e => setMapNodeForm({...mapNodeForm, type: e.target.value})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                >
                                    <option value="island">جزيرة 🏝️</option>
                                    <option value="forest">غابة 🌲</option>
                                    <option value="cave">كهف 🏔️</option>
                                    <option value="castle">قلعة 🏰</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 text-sm">الحالة</label>
                                <select 
                                    value={mapNodeForm.status}
                                    onChange={e => setMapNodeForm({...mapNodeForm, status: e.target.value})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none"
                                >
                                    <option value="locked">مغلق 🔒</option>
                                    <option value="unlocked">مفتوح 🔓</option>
                                    <option value="completed">مكتمل ✅</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 text-sm">المستوى المطلوب</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={mapNodeForm.levelReq}
                                    onChange={e => setMapNodeForm({...mapNodeForm, levelReq: parseInt(e.target.value)})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-[#F4E4BC] mb-2 text-sm">عدد الأسئلة</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={mapNodeForm.questionsCount}
                                    onChange={e => setMapNodeForm({...mapNodeForm, questionsCount: parseInt(e.target.value)})}
                                    className="w-full bg-[#000]/30 border border-[#5D4037] rounded-lg p-3 text-[#F4E4BC] focus:border-[#DAA520] outline-none" 
                                />
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-[#5D4037]/50 pt-4 mt-4">
                            <h4 className="text-[#DAA520] font-bold text-sm">إضافة أسئلة مخصصة (اختياري)</h4>
                            <p className="text-xs text-[#F4E4BC]/50">إذا لم تضف أسئلة هنا، سيقوم الذكاء الاصطناعي بتوليدها تلقائياً.</p>
                            
                            <div className="bg-[#000]/20 p-4 rounded-lg border border-[#5D4037]">
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        value={mapQuestionForm.text}
                                        onChange={e => setMapQuestionForm({...mapQuestionForm, text: e.target.value})}
                                        placeholder="نص السؤال..."
                                        className="w-full bg-[#000]/30 border border-[#5D4037] rounded p-2 text-[#F4E4BC] text-sm focus:border-[#DAA520] outline-none"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        {mapQuestionForm.options.map((opt, idx) => (
                                            <input 
                                                key={idx}
                                                type="text" 
                                                value={opt}
                                                onChange={e => {
                                                    const newOpts = [...mapQuestionForm.options];
                                                    newOpts[idx] = e.target.value;
                                                    setMapQuestionForm({...mapQuestionForm, options: newOpts});
                                                }}
                                                placeholder={`الخيار ${idx + 1}`}
                                                className="bg-[#000]/30 border border-[#5D4037] rounded p-2 text-[#F4E4BC] text-xs focus:border-[#DAA520] outline-none"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <select 
                                            value={mapQuestionForm.correctAnswer}
                                            onChange={e => setMapQuestionForm({...mapQuestionForm, correctAnswer: e.target.value})}
                                            className="bg-[#000]/30 border border-[#5D4037] rounded p-2 text-[#F4E4BC] text-xs focus:border-[#DAA520] outline-none flex-1"
                                        >
                                            <option value="">الإجابة الصحيحة</option>
                                            {mapQuestionForm.options.map((opt, idx) => (
                                                opt && <option key={idx} value={idx}>الخيار {idx + 1}: {opt}</option>
                                            ))}
                                        </select>
                                        <button 
                                            type="button"
                                            onClick={handleAddMapQuestion}
                                            className="bg-[#DAA520]/20 text-[#DAA520] border border-[#DAA520] px-4 rounded hover:bg-[#DAA520]/40 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* List of added questions */}
                                {mapNodeForm.customQuestions.length > 0 && (
                                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                        {mapNodeForm.customQuestions.map((q, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-[#DAA520]/10 p-2 rounded border border-[#DAA520]/30">
                                                <span className="text-[#F4E4BC] text-xs truncate max-w-[200px]">{q.text}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const newQs = mapNodeForm.customQuestions.filter((_, i) => i !== idx);
                                                        setMapNodeForm(prev => ({ ...prev, customQuestions: newQs }));
                                                    }}
                                                    className="text-[#FF6B6B] hover:text-[#FF6B6B]/80"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-[#5D4037]/50 pt-4 mt-4">
                            <h4 className="text-[#DAA520] font-bold text-sm">الموقع على الخريطة</h4>
                            <div>
                                <label className="block text-[#F4E4BC]/70 text-xs mb-1">الإحداثي الأفقي (X): {mapNodeForm.x}%</label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={mapNodeForm.x}
                                    onChange={e => setMapNodeForm({...mapNodeForm, x: parseInt(e.target.value)})}
                                    className="w-full accent-[#DAA520]" 
                                />
                            </div>
                            <div>
                                <label className="block text-[#F4E4BC]/70 text-xs mb-1">الإحداثي العمودي (Y): {mapNodeForm.y}%</label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={mapNodeForm.y}
                                    onChange={e => setMapNodeForm({...mapNodeForm, y: parseInt(e.target.value)})}
                                    className="w-full accent-[#DAA520]" 
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowMapNodeModal(false)} className="px-6 py-2 text-[#F4E4BC] hover:bg-[#5D4037]/50 rounded-lg transition-colors">إلغاء</button>
                            <GoldButton type="submit" className="px-8">
                                <Save className="w-4 h-4 ml-2 inline" />
                                حفظ
                            </GoldButton>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <AtherMind />
    </>
  );
}
