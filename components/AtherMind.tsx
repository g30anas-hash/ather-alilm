"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, BrainCircuit, User, Lightbulb, GraduationCap, ChevronRight } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  type?: 'text' | 'suggestion' | 'action';
  timestamp: Date;
}

export default function AtherMind() {
  const { name, role, coins, xp, level, allUsers, classes, quests, behaviorRecords, questionBank, supportMessages, competitions } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `مرحباً بك يا ${name}! أنا "عقل أثير"، مساعدك الذكي في هذه الرحلة. كيف يمكنني مساعدتك اليوم؟`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const generateResponse = async (input: string) => {
    setIsTyping(true);
    
    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let responseText = "";
    const lowerInput = input.toLowerCase();

    // Helper to get random item from array
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // Knowledge Base
    const greetings = ["مرحباً", "اهلا", "السلام عليكم", "هلا", "هاي", "صباح", "مساء"];
    const thanks = ["شكرا", "تسلم", "يعطيك العافية", "ما قصرت", "ثانك"];
    const identity = ["من انت", "من أنت", "عرفني بنفسك", "شنو انت", "وش انت", "ما هي وظيفتك"];
    const help = ["مساعدة", "تعليمات", "كيف استخدم", "شرح المنصة"];

    // --- Universal Logic ---
    if (greetings.some(w => lowerInput.includes(w))) {
        responseText = pick([
            `أهلاً بك يا ${name}! كيف يمكنني مساعدتك اليوم في رحلتك التعليمية؟ ✨`,
            `وعليكم السلام ورحمة الله! جاهز للمساعدة، ماذا يدور في ذهنك؟ 🚀`,
            `يا مرحباً! يومك سعيد ومليء بالإنجازات. تفضل بسؤالك.`
        ]);
    }
    else if (thanks.some(w => lowerInput.includes(w))) {
        responseText = pick([
            "على الرحب والسعة! أنا هنا دائماً لخدمتك. ✨",
            "سعيد جداً بمساعدتك! هل هناك شيء آخر؟",
            "عفواً يا بطل! بالتوفيق في مهامك."
        ]);
    }
    else if (identity.some(w => lowerInput.includes(w))) {
        responseText = "أنا 'عقل أثير'، نظام ذكاء اصطناعي متطور تم بنائي لمساعدة طلاب ومعلمي مملكة أثير العلم. أستطيع تحليل البيانات، اقتراح المهام، والإجابة على استفساراتك الدراسية.";
    }
    else if (help.some(w => lowerInput.includes(w))) {
        responseText = `أنا هنا لمساعدتك! يمكنك سؤالي عن:
        1. **حالتك:** "كم رصيدي؟"، "مستواي الحالي"
        2. **المهام:** "ما هي مهامي اليوم؟"، "اقترح مهمة"
        3. **الدراسة:** "اشرح لي القسمة"، "معلومات عن الفضاء"
        4. **الدعم:** "كيف أرسل واجب؟"`;
    }

    // --- Role-Based Logic ---
    else if (role === 'student') {
        if (lowerInput.includes("نقاط") || lowerInput.includes("ذهب") || lowerInput.includes("رصيد") || lowerInput.includes("مستوى")) {
            const nextLevelXP = (level || 1) * 1000;
            const progress = Math.floor(((xp || 0) / nextLevelXP) * 100);
            responseText = `📊 **تقرير حالتك:**\n\n- المستوى: **${level || 1}**\n- الذهب: **${coins}** 🪙\n- الخبرة: **${xp || 0} XP**\n\nأنت قطعت **${progress}%** من الطريق نحو المستوى التالي! استمر في العمل الجاد. 💪`;
        } 
        else if (lowerInput.includes("مهمة") || lowerInput.includes("واجب") || lowerInput.includes("تحدي")) {
            const activeQuests = quests.filter(q => !q.status);
            if (activeQuests.length > 0) {
                const topQuest = activeQuests[0];
                responseText = `لديك **${activeQuests.length}** مهام نشطة حالياً. 📝\n\nأنصحك بالبدء بمهمة: **"${topQuest.title}"** (المكافأة: ${topQuest.cost} ذهب). هل تريد مني أن أدلك على مكانها؟`;
            } else {
                responseText = "أنت بطل! لقد أنهيت جميع مهامك الحالية. 🎉\nلماذا لا تذهب إلى 'ساحة أثير' لتجربة بعض التحديات التنافسية؟";
            }
        } 
        else if (lowerInput.includes("ساعدني") || lowerInput.includes("نصيحة") || lowerInput.includes("خطة")) {
            responseText = "💡 **خطة مقترحة لك اليوم:**\n1. ابدأ بمراجعة 'خريطة المعرفة' لمدة 15 دقيقة.\n2. قم بحل 'تحدي اليوم' في الرياضيات.\n3. شارك في منافسة واحدة في الساحة لرفع نقاطك.\n\nتذكر: الاستمرارية هي سر النجاح!";
        } 
        else if (lowerInput.includes("شرح") || lowerInput.includes("فهم") || lowerInput.includes("درس")) {
             responseText = "أستطيع مساعدتك في شرح الدروس! 🧠\n\nمن فضلك اكتب اسم الدرس أو الموضوع تحديداً (مثال: 'شرح قانون نيوتن الأول' أو 'كيفية إعراب الفاعل').";
        }
        // Fallback for Student
        else {
            responseText = pick([
                "سؤال مثير! لكنني أحتاج لتفاصيل أكثر لأجيبك بدقة. هل تسأل عن **المهام**، **الدرجات**، أم تريد **شرحاً لدرس** معين؟",
                "لست متأكداً أنني فهمت تماماً. هل يمكنك إعادة الصياغة؟ يمكنني مساعدتك في معرفة رصيدك أو متابعة واجباتك.",
                "هممم... يبدو أن هذا خارج نطاق بياناتي الحالية. جرب أن تسألني: 'ما هي مهامي اليوم؟'"
            ]);
        }
    } 
    else if (role === 'teacher') {
        if (lowerInput.includes("طالب") || lowerInput.includes("طلاب") || lowerInput.includes("فصل")) {
            const studentCount = allUsers.filter(u => u.role === 'student').length;
            responseText = `لديك حالياً **${studentCount}** طالب مسجل في النظام. 👨‍🎓\n\nتشير البيانات إلى أن الفصل "3-A" هو الأكثر نشاطاً هذا الأسبوع. هل ترغب في إرسال مكافأة جماعية لهم؟`;
        } 
        else if (lowerInput.includes("سؤال") || lowerInput.includes("اختبار") || lowerInput.includes("كويز")) {
            responseText = "✅ **اقتراح سؤال ذكي:**\n\nالمادة: علوم\nالمستوى: متوسط\nالسؤال: 'ما هي الوظيفة الأساسية للميتوكوندريا في الخلية؟'\nالخيارات: [إنتاج الطاقة، تخزين الماء، حماية النواة، صنع البروتين]\n\nهل تريد اعتماد هذا السؤال وإضافته لبنك الأسئلة؟";
        } 
        else if (lowerInput.includes("خطة") || lowerInput.includes("درس") || lowerInput.includes("تحضير")) {
             responseText = "لتحضير درس تفاعلي، أقترح عليك استخدام استراتيجية 'التعلم باللعب'. 🎮\n\nيمكنني إنشاء مسابقة سريعة لطلابك في نهاية الحصة لمراجعة المفاهيم الأساسية. ما رأيك؟";
        }
        // Fallback for Teacher
        else {
             responseText = pick([
                 "أهلاً بك يا زميلي. بصفتي مساعدك الرقمي، يمكنني مساعدتك في **إدارة الفصول**، **اقتراح الأسئلة**، أو **تحليل النتائج**. ماذا تفضل؟",
                 "هل تبحث عن شيء محدد في سجلات الطلاب؟ حدد طلبك وسأقوم بالبحث فوراً."
             ]);
        }
    }
    else if (role === 'leader') {
        const pendingQuestCount = quests.filter(q => q.status === 'pending').length;
        const pendingBehaviorCount = behaviorRecords.filter(r => r.status === 'pending').length;
        const pendingQuestionCount = questionBank.filter(q => q.status === 'pending').length;
        const unreadSupportCount = supportMessages.filter(m => !m.read).length;
        const upcomingCompetitionCount = competitions.filter(c => c.status === 'upcoming').length;
        const studentCount = allUsers.filter(u => u.role === 'student').length;
        const teacherCount = allUsers.filter(u => u.role === 'teacher').length;

        if (
          lowerInput.includes("معلق") ||
          lowerInput.includes("اعتماد") ||
          lowerInput.includes("طلبات") ||
          lowerInput.includes("قيد")
        ) {
          responseText = `✅ **ملخص المعلّقات الآن:**\n\n- أسئلة بانتظار الاعتماد: **${pendingQuestionCount}**\n- مهام بانتظار الاعتماد: **${pendingQuestCount}**\n- سجلات سلوك بانتظار الاعتماد: **${pendingBehaviorCount}**\n- رسائل دعم غير مقروءة: **${unreadSupportCount}**\n- منافسات قادمة: **${upcomingCompetitionCount}**\n\nإذا رغبت، قل: "افتح اعتماد الأسئلة" أو "افتح اعتماد المهام" وسأرشدك بسرعة داخل اللوحات.`;
        }
        else if (lowerInput.includes("تقرير") || lowerInput.includes("أداء") || lowerInput.includes("إحصائيات")) {
          responseText = `📊 **موجز الإدارة:**\n\n- إجمالي الطلاب: **${studentCount}**\n- إجمالي المعلمين: **${teacherCount}**\n- المعلّقات: **${pendingQuestionCount + pendingQuestCount + pendingBehaviorCount}**\n\nأفضل خطوة الآن: معالجة المعلّقات أولاً ثم إعداد منافسة أسبوعية محفّزة.`;
        }
        else if (lowerInput.includes("رسالة") || lowerInput.includes("إعلان") || lowerInput.includes("مرسوم")) {
          responseText = "✍️ **مسودة إعلان جاهزة:**\n\nالعنوان: تهنئة وإشادة\nالنص: 'تفتخر إدارة المملكة بجهود طلابها ومعلميها هذا الأسبوع. نهيب بالجميع الاستمرار على هذا النهج، وسيتم تكريم المتميزين قريباً.'\n\nهل تود أن أجعل النص موجهاً للطلاب فقط أم للمعلمين أم للجميع؟";
        }
        else {
          responseText = pick([
            "تحت أمرك أيها القائد. يمكنني تلخيص المعلّقات، أو استخراج موجز الأداء، أو صياغة تعميم سريع. ماذا تريد الآن؟",
            "هل ترغب في رؤية: (1) المعلّقات (2) موجز الأداء (3) مسودة إعلان؟ اكتب رقم الخيار."
          ]);
        }
    }
    else {
        responseText = "أنا هنا للمساعدة! اسألني عن أي شيء يتعلق بالمنصة وسأبذل جهدي لإجابتك.";
    }

    // Specific Knowledge Checks (Mock Database)
    if (lowerInput.includes("رياضيات") || lowerInput.includes("قسمة") || lowerInput.includes("ضرب")) {
        responseText = "الرياضيات هي لغة الكون! 🧮\nإذا كنت تواجه صعوبة في مسألة معينة، اكتبها لي (مثال: 'كم ناتج 5 * 12') وسأشرح لك الحل.";
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'ai',
      text: responseText,
      timestamp: new Date()
    }]);
    
    setIsTyping(false);
  };

  const sendText = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    generateResponse(text);
  };

  const handleSendMessage = (e?: FormEvent) => {
    e?.preventDefault();
    sendText(inputText);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-[#4ECDC4] to-[#2A9D8F] rounded-full shadow-[0_0_20px_rgba(78,205,196,0.5)] flex items-center justify-center border-2 border-[#fff]/20 group"
      >
        <BrainCircuit className="w-8 h-8 text-white animate-pulse" />
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF6B6B] rounded-full border border-white animate-bounce" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 bg-black/80 text-[#4ECDC4] px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            عقل أثير
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:px-6 pointer-events-none">
            {/* Backdrop for mobile */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/50 sm:bg-transparent pointer-events-auto"
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="w-full sm:w-[400px] h-[80vh] sm:h-[600px] bg-[#1a1a2e] border-2 border-[#4ECDC4] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden relative"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#4ECDC4]/20 to-[#2A9D8F]/20 p-4 border-b border-[#4ECDC4]/30 flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center border border-[#4ECDC4]">
                      <BrainCircuit className="w-6 h-6 text-[#4ECDC4]" />
                   </div>
                   <div>
                      <h3 className="text-[#fff] font-bold font-[family-name:var(--font-amiri)]">عقل أثير</h3>
                      <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
                          <span className="text-[#4ECDC4] text-xs">متصل الآن</span>
                      </div>
                   </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-[#fff]/50 hover:text-[#fff] transition-colors">
                    <X className="w-6 h-6" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0a192f]/50">
                {messages.map((msg) => (
                    <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex gap-3 max-w-[85%]",
                            msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                            msg.sender === 'user' ? "bg-[#DAA520] text-[#2A1B0E]" : "bg-[#4ECDC4] text-[#0a192f]"
                        )}>
                            {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                            "p-3 rounded-2xl text-sm leading-relaxed",
                            msg.sender === 'user' 
                                ? "bg-[#DAA520] text-[#2A1B0E] rounded-tr-none" 
                                : "bg-[#4ECDC4]/10 border border-[#4ECDC4]/20 text-[#E0E0E0] rounded-tl-none"
                        )}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
                
                {isTyping && (
                    <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-[#4ECDC4] text-[#0a192f] flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-[#4ECDC4]/10 border border-[#4ECDC4]/20 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                            <span className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[#1a1a2e] border-t border-[#4ECDC4]/30">
                  {/* Suggestions Pills */}
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2 custom-scrollbar">
                      {(role === 'student' ? [
                          "💰 رصيدي", "📚 مهامي", "🚀 نصيحة", "❓ شرح درس"
                      ] : role === 'teacher' ? [
                          "📝 اقتراح سؤال", "📊 نشاط الطلاب", "💡 فكرة درس"
                      ] : [
                          "✅ المعلّقات", "📈 تقرير الأداء", "📢 صياغة إعلان", "📬 الدعم"
                      ]).map((sugg, i) => (
                          <button 
                            key={i}
                            onClick={() => sendText(sugg)}
                            className="whitespace-nowrap px-3 py-1 rounded-full bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 text-[#4ECDC4] text-xs hover:bg-[#4ECDC4] hover:text-[#0a192f] transition-colors"
                          >
                              {sugg}
                          </button>
                      ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="relative">
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        className="w-full bg-[#0a192f] border border-[#4ECDC4]/30 rounded-xl pl-4 pr-12 py-3 text-[#fff] focus:border-[#4ECDC4] outline-none placeholder:text-[#fff]/20"
                      />
                      <button 
                        type="submit"
                        disabled={!inputText.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#4ECDC4] text-[#0a192f] rounded-lg hover:bg-[#3dbdb4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                          <Send className="w-4 h-4" />
                      </button>
                  </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
