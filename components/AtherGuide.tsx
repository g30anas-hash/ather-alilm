"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, X, ChevronLeft, Shield, Scroll, Crown, GraduationCap, ArrowRight, Sword } from "lucide-react";
import GoldButton from "./GoldButton";
import { cn } from "@/lib/utils";

type AtherGuideProps = {
  role: 'student' | 'teacher' | 'parent' | 'admin' | 'leader' | null;
  onComplete: () => void;
};

const guideContent = {
  student: {
    title: "حارس الأثير",
    message: "مرحبًا أيها الحارس الصغير... لقد وصلتنا طاقتك من بعيد، وعالم أثير يحتاج إلى علمك. كل درس تتعلمه يعيد النور، وكل مهمة تنجزها تقوّي الأثير.",
    icon: <Sword className="w-12 h-12 text-[#FFD700]" />,
    color: "from-[#FFD700] to-[#DAA520]",
    actions: [
      { id: 'start', label: "ابدأ الرحلة 🚀", primary: true },
      { id: 'explore', label: "عرفني على العالم 🧭", primary: false }
    ]
  },
  teacher: {
    title: "مرشد الحكمة",
    message: "مرحبًا بك يا مرشد الحكمة... في أثير العلم، دورك لا يقتصر على التعليم، بل على إحياء العقول. أنت من تصنع المهام، وتوازن الميزان، وتبني الأبطال.",
    icon: <Scroll className="w-12 h-12 text-[#4ECDC4]" />,
    color: "from-[#4ECDC4] to-[#2cb5ac]",
    actions: [
      { id: 'tools', label: "استعرض أدواتي 📜", primary: true },
      { id: 'ai', label: "فعّل مساعدي الذكي 🤖", primary: false }
    ]
  },
  parent: {
    title: "حارس الرحلة",
    message: "أهلًا بك... طفلك بدأ رحلة في عالم أثير، حيث يُقاس التقدم بالعلم والقيم. دورك هو الحماية والدعم، ونحن سنكون عيونك في كل مرحلة.",
    icon: <Shield className="w-12 h-12 text-[#FF6B6B]" />,
    color: "from-[#FF6B6B] to-[#ee5253]",
    actions: [
      { id: 'track', label: "تابع رحلة طفلي 👦", primary: true },
      { id: 'understand', label: "افهم النظام 📊", primary: false }
    ]
  },
  admin: {
    title: "مجلس الأثير",
    message: "مرحبًا بعضو مجلس الأثير... هنا تُدار المعرفة، ويُحفظ التوازن، وتُصنع القرارات الذكية. كل رقم تحلله، وكل نظام تضبطه، يصنع أثرًا حقيقيًا.",
    icon: <Crown className="w-12 h-12 text-[#A3CB38]" />,
    color: "from-[#A3CB38] to-[#009432]",
    actions: [
      { id: 'dashboard', label: "لوحة القيادة 📊", primary: true },
      { id: 'reports', label: "التقارير 📑", primary: false }
    ]
  },
  leader: {
    title: "مجلس الأثير",
    message: "مرحبًا بعضو مجلس الأثير... هنا تُدار المعرفة، ويُحفظ التوازن، وتُصنع القرارات الذكية. كل رقم تحلله، وكل نظام تضبطه، يصنع أثرًا حقيقيًا.",
    icon: <Crown className="w-12 h-12 text-[#A3CB38]" />,
    color: "from-[#A3CB38] to-[#009432]",
    actions: [
      { id: 'dashboard', label: "لوحة القيادة 📊", primary: true },
      { id: 'reports', label: "التقارير 📑", primary: false }
    ]
  },
  guest: {
    title: "زائر الأثير",
    message: "مرحبًا بك في بوابة أثير العلم. عالم من المعرفة والمغامرة بانتظارك. هل أنت مستعد لاكتشاف ما يخبئه لك هذا العالم؟",
    icon: <Sparkles className="w-12 h-12 text-[#F4E4BC]" />,
    color: "from-[#F4E4BC] to-[#DAA520]",
    actions: [
      { id: 'login', label: "سجل دخولك 🔐", primary: true },
      { id: 'tour', label: "جولة سريعة 🚶", primary: false }
    ]
  }
};

export default function AtherGuide({ role, onComplete }: AtherGuideProps) {
  const [step, setStep] = useState<'intro' | 'dialog'>('intro');
  const [isVisible, setIsVisible] = useState(true);
  
  const currentRole = role || 'guest';
  const content = guideContent[currentRole];

  useEffect(() => {
    // Play sound effect on mount (optional)
    const audio = new Audio('/sounds/magic-chime.mp3'); // Mock path
    audio.volume = 0.2;
    // audio.play().catch(() => {}); 
  }, []);

  const handleAction = (actionId: string) => {
    // Logic for actions can go here
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a192f]/90 backdrop-blur-md p-4"
      >
        <div className="max-w-2xl w-full relative">
          
          {/* Guide Character */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 z-20"
          >
             <div className={cn(
               "w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-[0_0_50px_rgba(255,255,255,0.2)] bg-[#1a1a2e]",
               `border-[${content.color.split(' ')[1].replace('to-[', '').replace(']', '')}]`
             )}>
                <div className={cn("absolute inset-0 rounded-full opacity-20 animate-pulse bg-gradient-to-br", content.color)} />
                <Bot className="w-16 h-16 text-[#F4E4BC]" />
             </div>
             <div className="text-center mt-4">
                <span className="bg-[#000]/60 px-4 py-1 rounded-full text-[#F4E4BC] text-sm border border-[#DAA520]/30 backdrop-blur-sm">
                   ✨ مرشد الأثير
                </span>
             </div>
          </motion.div>

          {/* Dialog Box */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1e293b] border-2 border-[#DAA520]/30 rounded-3xl p-8 pt-16 shadow-2xl relative overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#DAA520] to-transparent opacity-50" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#DAA520]/5 rounded-full blur-3xl" />

            <div className="text-center space-y-6 relative z-10">
               <h2 className="text-3xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)]">
                 {content.title}
               </h2>
               
               <p className="text-xl text-[#F4E4BC]/90 leading-relaxed font-[family-name:var(--font-cairo)]">
                 {content.message}
               </p>

               <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                 {content.actions.map((action, idx) => (
                   <motion.button
                     key={action.id}
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => handleAction(action.id)}
                     className={cn(
                       "px-8 py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2",
                       action.primary 
                         ? "bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-[#1a1a2e] shadow-[0_0_20px_rgba(218,165,32,0.4)]" 
                         : "bg-[#000]/30 border border-[#DAA520]/30 text-[#DAA520] hover:bg-[#DAA520]/10"
                     )}
                   >
                     {action.label}
                   </motion.button>
                 ))}
               </div>
            </div>

            {/* Close Button (Optional) */}
            <button 
              onClick={() => handleAction('close')}
              className="absolute top-4 right-4 text-[#F4E4BC]/30 hover:text-[#F4E4BC] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
