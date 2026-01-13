"use client";

import { useState, useRef, useEffect } from "react";
import GameCard from "@/components/GameCard";
import GoldButton from "@/components/GoldButton";
import SidebarWorld from "@/components/SidebarWorld";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, BrainCircuit, MessageSquare, Send } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import MobileNav from "@/components/MobileNav";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import NotificationCenter from "@/components/NotificationCenter";
import ProfileModal from "@/components/ProfileModal";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

export default function AtherMindPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { name, role, quests, behaviorRecords, questionBank, supportMessages, competitions, allUsers } = useUser();

  const roleGreetings: Record<string, string> = {
    student: "كيف يمكنني مساعدتك في دراستك اليوم؟",
    teacher: "هل تبحث عن مصادر تعليمية جديدة لطلابك؟",
    leader: "هل ترغب في تقرير عن أداء المدرسة؟",
    parent: "هل تود الاطمئنان على مستوى طفلك؟"
  };
  const greeting = roleGreetings[role || 'student'] || roleGreetings['student'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = { id: Date.now(), text: inputValue, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const text = inputValue;
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "أنا هنا لمساعدتك دائماً. هل يمكنك توضيح المزيد؟";

      if (role === 'leader') {
        const pendingQuestCount = quests.filter(q => q.status === 'pending').length;
        const pendingBehaviorCount = behaviorRecords.filter(r => r.status === 'pending').length;
        const pendingQuestionCount = questionBank.filter(q => q.status === 'pending').length;
        const unreadSupportCount = supportMessages.filter(m => !m.read).length;
        const upcomingCompetitionCount = competitions.filter(c => c.status === 'upcoming').length;
        const studentCount = allUsers.filter(u => u.role === 'student').length;
        const teacherCount = allUsers.filter(u => u.role === 'teacher').length;

        if (lower.includes('معلق') || lower.includes('اعتماد') || lower.includes('طلبات') || lower.includes('قيد')) {
          reply = `✅ ملخص المعلّقات الآن:\n- أسئلة: ${pendingQuestionCount}\n- مهام: ${pendingQuestCount}\n- سلوك: ${pendingBehaviorCount}\n- دعم غير مقروء: ${unreadSupportCount}\n- منافسات قادمة: ${upcomingCompetitionCount}`;
        } else if (lower.includes('تقرير') || lower.includes('أداء') || lower.includes('إحصائيات')) {
          reply = `📊 موجز الإدارة:\n- الطلاب: ${studentCount}\n- المعلمين: ${teacherCount}\n- المعلّقات: ${pendingQuestionCount + pendingQuestCount + pendingBehaviorCount}\n\nقل: "المعلقات" أو "صياغة إعلان".`;
        } else if (lower.includes('إعلان') || lower.includes('مرسوم') || lower.includes('رسالة')) {
          reply = "✍️ مسودة إعلان:\nالعنوان: إشادة أسبوعية\nالنص: 'تفتخر إدارة المملكة بجهود طلابها ومعلميها هذا الأسبوع، ونشجع الجميع على الاستمرار.'";
        }
      } else {
        const responses = [
          `أهلاً بك يا ${name}! هذا سؤال ممتاز، دعنا نفكر فيه سوياً.`,
          `سؤال رائع يا ${name}. الإجابة تعتمد على السياق، لكن بشكل عام...`,
          "أنا هنا لمساعدتك دائماً. هل يمكنك توضيح المزيد؟",
          `حسب بياناتي، الحل الأمثل هو مراجعة الدرس السابق يا ${name}.`
        ];
        reply = responses[Math.floor(Math.random() * responses.length)];
      }

      const aiMsg = { id: Date.now() + 1, text: reply, isUser: false };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      <MobileNav />
      <PageTransition>
        <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2694&auto=format&fit=crop')] bg-cover bg-center overflow-hidden flex">
          {/* Dark Overlay with blue tint */}
          <div className="absolute inset-0 bg-[#0a192f]/80 z-0 pointer-events-none" />

          {/* Sidebar */}
          <div className="relative z-10 hidden md:block h-screen sticky top-0">
            <SidebarWorld />
          </div>

          {/* Particles/Stars Effect */}
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />
            <div className="absolute top-3/4 left-1/3 w-3 h-3 bg-blue-200 rounded-full animate-pulse delay-700" />
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-200 rounded-full animate-pulse delay-300" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 h-screen overflow-y-auto p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl flex flex-col items-center min-h-full relative">
            
              <header className="mb-8 text-center mt-8 w-full relative">
                <div className="absolute top-0 right-0 hidden md:flex items-center gap-4">
                  <NotificationCenter />
                  <div 
                    className="w-10 h-10 rounded-full border border-[#4ECDC4] bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')] bg-cover bg-center cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setShowProfileModal(true)}
                  />
                </div>
                <h1 className="text-5xl text-[#4ECDC4] font-[family-name:var(--font-amiri)] drop-shadow-[0_0_15px_rgba(78,205,196,0.5)]">
                  عقل أثير
                </h1>
                <p className="text-[#F4E4BC] font-[family-name:var(--font-scheherazade)] text-xl mt-2">
                  الرفيق الذكي في رحلة العلم
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-start flex-1">
                
                {/* Left Panel: Quick Actions */}
                <div className="hidden md:flex flex-col gap-4 mt-20">
                  <GameCard className="bg-[#112240]/80 border-[#4ECDC4]/50">
                    <h3 className="text-[#4ECDC4] font-bold mb-4 font-[family-name:var(--font-cairo)]">مسائل الذكاء</h3>
                    <ul className="space-y-2 text-[#F4E4BC]/80 text-sm">
                      <li className="flex items-center gap-2 cursor-pointer hover:text-[#FFD700]">
                        <Sparkles className="w-4 h-4" />
                        <span>تحدي اليوم: الخوارزميات</span>
                      </li>
                      <li className="flex items-center gap-2 cursor-pointer hover:text-[#FFD700]">
                        <Sparkles className="w-4 h-4" />
                        <span>لغز الفيزياء</span>
                      </li>
                    </ul>
                  </GameCard>
                </div>

                {/* Center: AI Chat & Avatar */}
                <div className="flex flex-col items-center h-full max-h-[600px]">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="relative w-48 h-48 mb-6 shrink-0"
                  >
                    <div className="absolute inset-0 bg-[#4ECDC4] blur-[60px] opacity-20 rounded-full" />
                    <div className="w-full h-full rounded-full border-4 border-[#4ECDC4] shadow-[0_0_30px_rgba(78,205,196,0.3)] overflow-hidden bg-[#0a192f] relative z-10">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2550&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <BrainCircuit className="w-20 h-20 text-[#4ECDC4] opacity-80" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Chat Area */}
                  <div className="w-full max-w-lg flex flex-col gap-4 flex-1 min-h-0">
                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto bg-[#112240]/50 rounded-xl p-4 border border-[#4ECDC4]/20 custom-scrollbar h-64">
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-[#F4E4BC]/30 text-center font-[family-name:var(--font-cairo)] gap-2">
                          <span className="text-lg text-[#4ECDC4]">{greeting}</span>
                          <span>ابدأ المحادثة مع عقل أثير...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {messages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn(
                                "max-w-[80%] p-3 rounded-lg text-sm font-[family-name:var(--font-cairo)]",
                                msg.isUser 
                                  ? "self-start bg-[#4ECDC4]/20 text-[#4ECDC4] rounded-tr-none" 
                                  : "self-end bg-[#2A1B0E]/80 text-[#F4E4BC] rounded-tl-none border border-[#DAA520]/30"
                              )}
                            >
                              {msg.text}
                            </motion.div>
                          ))}
                          {isTyping && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="self-end bg-[#2A1B0E]/80 p-3 rounded-lg rounded-tl-none border border-[#DAA520]/30"
                            >
                              <div className="flex gap-1">
                                <span className="w-2 h-2 bg-[#F4E4BC]/50 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-[#F4E4BC]/50 rounded-full animate-bounce delay-100" />
                                <span className="w-2 h-2 bg-[#F4E4BC]/50 rounded-full animate-bounce delay-200" />
                              </div>
                            </motion.div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="w-full bg-[#112240]/90 border-2 border-[#4ECDC4]/50 rounded-xl p-2 flex items-center gap-2 shadow-2xl shrink-0">
                      <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={`اسأل عقل أثير بصفتك ${name}...`} 
                        className="flex-1 bg-transparent border-none outline-none text-[#F4E4BC] px-4 font-[family-name:var(--font-cairo)] placeholder:text-[#F4E4BC]/30"
                      />
                      <button 
                        onClick={handleSend}
                        className="bg-[#4ECDC4] hover:bg-[#3dbdb4] text-[#0a192f] p-3 rounded-lg transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Knowledge Gate */}
                <div className="hidden md:flex flex-col gap-4 mt-20">
                  <GameCard className="bg-[#112240]/80 border-[#4ECDC4]/50">
                    <h3 className="text-[#4ECDC4] font-bold mb-4 font-[family-name:var(--font-cairo)]">بوابة المعرفة</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-[#4ECDC4]/10 rounded border border-[#4ECDC4]/20">
                        <span className="text-xs text-[#4ECDC4] block mb-1">تم التحليل</span>
                        <p className="text-[#F4E4BC] text-sm">مستواك في الرياضيات تقدم بنسبة 15%</p>
                      </div>
                      <div className="p-3 bg-[#FF6B6B]/10 rounded border border-[#FF6B6B]/20">
                        <span className="text-xs text-[#FF6B6B] block mb-1">تنبيه</span>
                        <p className="text-[#F4E4BC] text-sm">لديك اختبار فيزياء غداً</p>
                      </div>
                    </div>
                  </GameCard>
                </div>

              </div>

              <div className="mt-8 flex gap-4">
                <GoldButton className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-[#0a192f]">
                  تحليل الأداء
                </GoldButton>
                <GoldButton variant="secondary" className="border-[#4ECDC4] text-[#4ECDC4]">
                   اطلب مساعدة
                </GoldButton>
              </div>

            </div>
          </div>
        </main>
      </PageTransition>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </>
  );
}
