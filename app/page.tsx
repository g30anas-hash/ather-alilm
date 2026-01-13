"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  GraduationCap, 
  Sword, 
  Scroll, 
  Crown, 
  Star, 
  Shield, 
  Brain, 
  Users, 
  Trophy,
  Target,
  ArrowDown,
  Sparkles,
  Bot,
  BrainCircuit
} from "lucide-react";
import GoldButton from "@/components/GoldButton";
import GameCard from "@/components/GameCard";
import PageTransition from "@/components/PageTransition";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

// --- Components ---

const StatItem = ({ value, label }: { value: string, label: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="text-center p-4 bg-[#DAA520]/5 rounded-xl border border-[#DAA520]/20 hover:border-[#DAA520] transition-colors"
  >
    <div className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-2 font-[family-name:var(--font-cairo)] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">{value}</div>
    <div className="text-[#F4E4BC]/60 text-sm font-[family-name:var(--font-amiri)]">{label}</div>
  </motion.div>
);

const FeatureCard = ({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="h-full"
  >
    <GameCard className="h-full bg-[#2A1B0E]/60 hover:bg-[#2A1B0E]/80 transition-all duration-300 border-[#5D4037] hover:border-[#DAA520] group hover:-translate-y-2">
      <div className="bg-[#DAA520]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto border border-[#DAA520]/30 shadow-[0_0_15px_rgba(218,165,32,0.1)] group-hover:shadow-[0_0_25px_rgba(218,165,32,0.3)]">
        <div className="text-[#FFD700]">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)] mb-3 text-center group-hover:text-[#FFD700] transition-colors">
        {title}
      </h3>
      <p className="text-[#F4E4BC]/60 text-center leading-relaxed font-[family-name:var(--font-cairo)] text-sm">
        {desc}
      </p>
    </GameCard>
  </motion.div>
);

export default function UnifiedLandingPage() {
  const { role, getDashboardPath } = useUser();
  const { scrollYProgress: pageScroll } = useScroll();

  const heroOpacity = useTransform(pageScroll, [0, 0.2], [1, 0]);
  const heroScale = useTransform(pageScroll, [0, 0.2], [1, 0.95]);

  // Fantasy Images
  const heroBg = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=epic%20fantasy%20magical%20floating%20islands%20city%20in%20the%20sky%20with%20golden%20bridges%20and%20waterfalls,%20cinematic%20lighting,%20unreal%20engine%205%20style,%20highly%20detailed&image_size=landscape_16_9";
  const studentImg = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=young%20fantasy%20hero%20student%20wearing%20magical%20armor%20and%20holding%20a%20glowing%20book,%20looking%20at%20a%20holographic%20map,%20anime%20style,%20fantasy%20background&image_size=landscape_4_3";
  const teacherImg = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=wise%20fantasy%20wizard%20teacher%20in%20a%20grand%20magical%20library%20with%20floating%20glowing%20books,%20mystical%20atmosphere,%20digital%20fantasy%20art&image_size=landscape_4_3";
  const parentImg = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=royal%20fantasy%20guardian%20king%20watching%20over%20a%20glowing%20crystal%20ball,%20warm%20protective%20lighting,%20throne%20room%20background,%20fantasy%20art&image_size=landscape_4_3";
  const ctaBg = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=majestic%20golden%20gate%20portal%20to%20a%20magical%20university,%20fantasy%20style,%20glowing%20runes,%20epic%20scale,%20night%20sky&image_size=landscape_16_9";

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a192f] overflow-x-hidden custom-scrollbar selection:bg-[#DAA520] selection:text-[#000]">
        
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2A1B0E]/90 backdrop-blur-md border-b border-[#DAA520]/50 h-20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#DAA520] rounded-lg rotate-45 flex items-center justify-center border-2 border-[#F4E4BC] shadow-[0_0_15px_#DAA520]">
                      <Crown className="w-6 h-6 text-[#2A1B0E] -rotate-45" />
                  </div>
                  <span className="text-2xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] mr-2 text-shadow-gold">أثير العلم</span>
              </div>
              
              <div className="hidden md:flex items-center gap-8">
                  <a href="#features" className="text-[#F4E4BC] hover:text-[#FFD700] font-[family-name:var(--font-cairo)] transition-colors">المميزات</a>
                  <a href="#roles" className="text-[#F4E4BC] hover:text-[#FFD700] font-[family-name:var(--font-cairo)] transition-colors">رحلة الأبطال</a>
                  {role ? (
                    <Link href={getDashboardPath()}>
                      <GoldButton className="px-6 py-2 text-sm">
                          لوحة القيادة
                      </GoldButton>
                    </Link>
                  ) : (
                    <Link href="/oath-room">
                      <GoldButton className="px-6 py-2 text-sm">
                          دخول البوابة
                      </GoldButton>
                    </Link>
                  )}
              </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
               <img src={heroBg} alt="Fantasy World" className="w-full h-full object-cover opacity-60" />
               <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/90 via-[#0a192f]/40 to-[#0a192f]" />
          </div>
          
          <motion.div 
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="relative z-10 text-center max-w-5xl px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8 inline-block"
            >
               <span className="px-6 py-2 rounded-full border border-[#FFD700] text-[#FFD700] bg-[#DAA520]/20 text-sm font-bold font-[family-name:var(--font-cairo)] shadow-[0_0_20px_rgba(255,215,0,0.3)] backdrop-blur-sm flex items-center gap-2 mx-auto w-fit">
                  <Sparkles className="w-4 h-4" />
                  المنصة التعليمية الأولى بأسلوب RPG
                  <Sparkles className="w-4 h-4" />
               </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] via-[#F4E4BC] to-[#DAA520] font-[family-name:var(--font-amiri)] mb-8 drop-shadow-[0_0_30px_rgba(218,165,32,0.5)] leading-tight py-2"
            >
              أثير العلم
              <span className="block text-3xl md:text-5xl text-[#F4E4BC] mt-6 font-[family-name:var(--font-scheherazade)] drop-shadow-none">
                حيث يتحول التعليم إلى مغامرة أسطورية
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl md:text-2xl text-[#F4E4BC]/90 mb-12 max-w-3xl mx-auto font-[family-name:var(--font-cairo)] leading-relaxed text-shadow-sm"
            >
              نظام تعليمي متكامل يجمع بين متعة الألعاب وقوة المعرفة. انطلق في رحلة لجمع الذهب، كسب نقاط الخبرة، والتنافس مع أقرانك في بيئة تعليمية آمنة ومحفزة.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link href={role ? getDashboardPath() : "/oath-room"}>
                  <GoldButton className="px-12 py-5 text-2xl shadow-[0_0_50px_rgba(218,165,32,0.6)] animate-pulse hover:animate-none border-2 border-[#FFD700]">
                     <Sword className="w-8 h-8 ml-3 inline" />
                     {role ? "أكمل مغامرتك" : "ابدأ المغامرة الآن"}
                  </GoldButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#FFD700]"
          >
              <div className="w-8 h-12 border-2 border-[#FFD700]/50 rounded-full flex justify-center pt-2 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                  <div className="w-1.5 h-3 bg-[#FFD700] rounded-full animate-bounce" />
              </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-[#DAA520]/30 bg-[#2A1B0E]/60 backdrop-blur-md relative z-20">
           <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem value="+500" label="مغامر نشط" />
              <StatItem value="1,250" label="مهمة منجزة" />
              <StatItem value="50K" label="عملة ذهبية" />
              <StatItem value="+12" label="قلعة (مدرسة)" />
           </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 bg-[#0a192f] relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#DAA520]/50 to-transparent shadow-[0_0_10px_#DAA520]" />
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)] mb-4">
                مميزات <span className="text-[#FFD700]">المملكة التعليمية</span>
              </h2>
              <p className="text-[#F4E4BC]/60 font-[family-name:var(--font-cairo)] text-lg">أدوات متطورة صممت خصيصاً لرفع مستوى التحصيل الدراسي بأسلوب ممتع</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                 icon={<Scroll className="w-8 h-8" />}
                 title="نظام المهام (Quests)"
                 desc="حول الواجبات المدرسية إلى مهام تفاعلية (Quests). كل واجب تنجزه يمنحك ذهباً ونقاط خبرة لترقية مستواك."
                 delay={0.1}
              />
              <FeatureCard 
                 icon={<Brain className="w-8 h-8" />}
                 title="بنك الأسئلة الذكي"
                 desc="آلاف الأسئلة المتدرجة الصعوبة، مدعومة بالذكاء الاصطناعي لتناسب مستواك وتساعدك على التفوق."
                 delay={0.2}
              />
              <FeatureCard 
                 icon={<Trophy className="w-8 h-8" />}
                 title="المنافسات والبطولات"
                 desc="نافس زملاءك في بطولات المعرفة، واحتل صدارة قائمة المتصدرين لتحصل على أوسمة نادرة."
                 delay={0.3}
              />
              <FeatureCard 
                 icon={<Shield className="w-8 h-8" />}
                 title="التقويم السلوكي"
                 desc="نظام متابعة سلوكي فوري يربط الطالب والمعلم وولي الأمر، يعزز السلوك الإيجابي ويقوم السلبي."
                 delay={0.4}
              />
              <FeatureCard 
                 icon={<Target className="w-8 h-8" />}
                 title="الخطط الأسبوعية"
                 desc="تنظيم متقن لجدولك الدراسي ومهامك الأسبوعية في لوحة قيادة واحدة تضمن لك عدم تفويت أي شيء."
                 delay={0.5}
              />
              <FeatureCard 
                 icon={<Users className="w-8 h-8" />}
                 title="مجتمع أولياء الأمور"
                 desc="بوابة خاصة لأولياء الأمور لمتابعة تقدم أبنائهم لحظة بلحظة والتواصل المباشر مع المعلمين."
                 delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* AI Showcase (Ather Mind) */}
        <section className="py-24 bg-gradient-to-r from-[#0f172a] to-[#1e293b] relative overflow-hidden border-y border-[#4ECDC4]/20">
           <div className="absolute top-0 right-0 p-10 opacity-5">
               <BrainCircuit className="w-96 h-96 text-[#4ECDC4]" />
           </div>
           
           <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-16 relative z-10">
              <div className="flex-1 text-right">
                 <div className="flex items-center gap-3 mb-4 justify-end">
                    <span className="text-[#4ECDC4] font-bold tracking-wider text-sm bg-[#4ECDC4]/10 px-3 py-1 rounded-full border border-[#4ECDC4]/30">الجيل القادم من التعليم</span>
                    <Bot className="text-[#4ECDC4] w-6 h-6" />
                 </div>
                 <h2 className="text-4xl md:text-5xl font-bold text-[#fff] mb-6 font-[family-name:var(--font-amiri)]">
                    عقل أثير <span className="text-[#4ECDC4] drop-shadow-[0_0_10px_rgba(78,205,196,0.5)]">Ather Mind</span>
                 </h2>
                 <p className="text-[#F4E4BC]/80 text-lg leading-relaxed mb-8 font-[family-name:var(--font-cairo)]">
                    مساعدك الذكي الذي يرافقك في كل خطوة. يحلل أداءك، يقترح عليك المهام المناسبة لمستواك، ويساعد المعلمين في تصميم دروس تفاعلية مذهلة. إنه ليس مجرد روبوت، إنه مستشارك التعليمي الشخصي.
                 </p>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { text: "تحليل ذكي للأداء", color: "border-[#4ECDC4]" },
                      { text: "توليد أسئلة تلقائي", color: "border-[#FFD700]" },
                      { text: "توجيه أكاديمي فوري", color: "border-[#FF6B6B]" },
                      { text: "دعم المعلم والطالب", color: "border-[#DAA520]" }
                    ].map((item, i) => (
                      <div key={i} className={`bg-[#000]/30 p-4 rounded-lg border-r-4 ${item.color} text-[#F4E4BC] text-sm backdrop-blur-sm hover:bg-[#000]/50 transition-colors`}>
                         {item.text}
                      </div>
                    ))}
                 </div>
              </div>

              <div className="flex-1">
                 <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative w-full aspect-square max-w-md mx-auto"
                 >
                    <div className="absolute inset-0 bg-[#4ECDC4]/10 rounded-full blur-3xl animate-pulse" />
                    <div className="relative z-10 bg-[#1a1a2e]/80 border-2 border-[#4ECDC4]/50 rounded-full p-8 flex items-center justify-center shadow-[0_0_50px_rgba(78,205,196,0.2)] w-full h-full backdrop-blur-md">
                       <BrainCircuit className="w-32 h-32 md:w-48 md:h-48 text-[#4ECDC4] drop-shadow-[0_0_20px_rgba(78,205,196,0.8)]" />
                       
                       {/* Orbiting Elements */}
                       {[0, 90, 180, 270].map((deg, i) => (
                          <motion.div
                            key={i}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: i * -5 }}
                            className="absolute inset-0"
                          >
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-8 h-8 bg-[#0a192f] border border-[#4ECDC4] rounded-full flex items-center justify-center shadow-[0_0_10px_#4ECDC4]">
                                <div className="w-2 h-2 bg-[#4ECDC4] rounded-full" />
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* Roles Showcase */}
        <section id="roles" className="py-32 px-6 bg-[#0f223d] relative">
          {/* Background Patterns */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#DAA520]/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4ECDC4]/5 rounded-full blur-3xl -z-10" />

          <div className="max-w-7xl mx-auto relative z-10">
               <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-[#F4E4BC] font-[family-name:var(--font-amiri)] mb-4">
                    اختر <span className="text-[#FFD700]">طريقك</span>
                  </h2>
                  <p className="text-[#F4E4BC]/60 font-[family-name:var(--font-cairo)] text-lg">كل دور في المملكة له مهام ومميزات خاصة.. من أنت؟</p>
               </div>

               {/* Mobile: Horizontal Scroll | Desktop: Grid */}
               <div className="flex flex-nowrap lg:grid lg:grid-cols-3 gap-8 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-12 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0 scrollbar-hide">
                  
                  {/* Student Role */}
                  <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="min-w-[85vw] md:min-w-[60vw] lg:min-w-0 snap-center group relative bg-[#1e293b]/50 border-2 border-[#FFD700]/30 rounded-3xl overflow-hidden hover:border-[#FFD700] transition-colors duration-500"
                  >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-transparent to-transparent z-10" />
                      <div className="h-80 lg:h-96 relative">
                          <img src={studentImg} alt="Student Hero" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                          <div className="w-16 h-16 bg-[#2A1B0E] rounded-full border-2 border-[#FFD700] flex items-center justify-center mb-4 shadow-[0_0_20px_#FFD700]">
                              <Sword className="w-8 h-8 text-[#FFD700]" />
                          </div>
                          <h3 className="text-3xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] mb-2">الطالب المغامر</h3>
                          <p className="text-[#F4E4BC]/80 font-[family-name:var(--font-cairo)] mb-6">اجمع الذهب، تنافس مع الأصدقاء، وابنِ مجدك الشخصي في عالم المعرفة.</p>
                          <ul className="space-y-2 mb-6">
                              <li className="flex items-center gap-2 text-sm text-[#F4E4BC]"><Star className="w-4 h-4 text-[#FFD700]" /> نظام مكافآت متطور</li>
                              <li className="flex items-center gap-2 text-sm text-[#F4E4BC]"><Star className="w-4 h-4 text-[#FFD700]" /> منافسات يومية</li>
                          </ul>
                      </div>
                  </motion.div>

                  {/* Teacher Role */}
                  <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="min-w-[85vw] md:min-w-[60vw] lg:min-w-0 snap-center group relative bg-[#1e293b]/50 border-2 border-[#4ECDC4]/30 rounded-3xl overflow-hidden hover:border-[#4ECDC4] transition-colors duration-500 lg:-mt-12"
                  >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-transparent to-transparent z-10" />
                      <div className="h-80 lg:h-96 relative">
                          <img src={teacherImg} alt="Teacher Wizard" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                          <div className="w-16 h-16 bg-[#2A1B0E] rounded-full border-2 border-[#4ECDC4] flex items-center justify-center mb-4 shadow-[0_0_20px_#4ECDC4]">
                              <Scroll className="w-8 h-8 text-[#4ECDC4]" />
                          </div>
                          <h3 className="text-3xl font-bold text-[#4ECDC4] font-[family-name:var(--font-amiri)] mb-2">المعلم الحكيم</h3>
                          <p className="text-[#F4E4BC]/80 font-[family-name:var(--font-cairo)] mb-6">أدر مملكتك التعليمية، وتابع تقدم أبطالك بأدوات سحرية ذكية.</p>
                          <ul className="space-y-2 mb-6">
                              <li className="flex items-center gap-2 text-sm text-[#F4E4BC]"><Star className="w-4 h-4 text-[#4ECDC4]" /> بنك أسئلة ذكي</li>
                              <li className="flex items-center gap-2 text-sm text-[#F4E4BC]"><Star className="w-4 h-4 text-[#4ECDC4]" /> تقارير فورية</li>
                          </ul>
                      </div>
                  </motion.div>

                  {/* Parent Role */}
                  <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="min-w-[85vw] md:min-w-[60vw] lg:min-w-0 snap-center group relative bg-[#1e293b]/50 border-2 border-[#FF6B6B]/30 rounded-3xl overflow-hidden hover:border-[#FF6B6B] transition-colors duration-500"
                  >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-transparent to-transparent z-10" />
                      <div className="h-80 lg:h-96 relative">
                          <img src={parentImg} alt="Parent Guardian" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                          <div className="w-16 h-16 bg-[#2A1B0E] rounded-full border-2 border-[#FF6B6B] flex items-center justify-center mb-4 shadow-[0_0_20px_#FF6B6B]">
                              <Shield className="w-8 h-8 text-[#FF6B6B]" />
                          </div>
                          <h3 className="text-3xl font-bold text-[#FF6B6B] font-[family-name:var(--font-amiri)] mb-2">ولي الأمر الداعم</h3>
                          <p className="text-[#F4E4BC]/80 font-[family-name:var(--font-cairo)] mb-6">كن العين الساهرة، وشارك أبطالك لحظات انتصارهم وتقدمهم.</p>
                          <ul className="space-y-2 mb-6">
                              <li className="flex items-center gap-2 text-sm text-[#F4E4BC]"><Star className="w-4 h-4 text-[#FF6B6B]" /> تنبيهات لحظية</li>
                              <li className="flex items-center gap-2 text-sm text-[#F4E4BC]"><Star className="w-4 h-4 text-[#FF6B6B]" /> تواصل مباشر</li>
                          </ul>
                      </div>
                  </motion.div>
               </div>

               {/* Mobile Swipe Hint */}
               <div className="lg:hidden text-center text-[#F4E4BC]/40 text-sm mt-4 animate-pulse">
                  اسحب لليسار لاستعراض الأبطال &larr;
               </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0">
               <img src={ctaBg} alt="Fantasy Gate" className="w-full h-full object-cover opacity-30" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/80 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h2 className="text-5xl md:text-7xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] mb-8 drop-shadow-lg">
                  هل أنت مستعد لبدء الرحلة؟
              </h2>
              <p className="text-2xl text-[#F4E4BC] font-[family-name:var(--font-cairo)] mb-12 drop-shadow-md">
                  انضم إلى آلاف الطلاب والمعلمين الذين يغيرون مستقبل التعليم اليوم.
              </p>
              <Link href={role ? getDashboardPath() : "/oath-room"}>
                  <GoldButton className="px-12 py-5 text-2xl shadow-[0_0_40px_rgba(218,165,32,0.5)] scale-110 hover:scale-125 transition-transform border-2 border-[#FFD700]">
                     <GraduationCap className="w-8 h-8 ml-3 inline" />
                     {role ? "العودة للقلعة" : "سجل دخولك الآن"}
                  </GoldButton>
              </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1A1109] border-t border-[#5D4037] py-12 px-6 relative z-10">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                      <Crown className="w-8 h-8 text-[#DAA520]" />
                      <span className="text-2xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)]">أثير العلم</span>
                  </div>
                  <p className="text-[#F4E4BC]/60 max-w-md text-sm leading-relaxed">
                      منصة تعليمية رائدة تدمج التكنولوجيا الحديثة مع أساليب التلعيب (Gamification) لخلق بيئة تعليمية جاذبة ومحفزة للجيل الجديد.
                  </p>
              </div>
              
              <div>
                  <h4 className="text-[#FFD700] font-bold mb-4 font-[family-name:var(--font-cairo)]">روابط سريعة</h4>
                  <ul className="space-y-2 text-sm text-[#F4E4BC]/70">
                      <li><Link href="/about" className="hover:text-[#DAA520]">عن المنصة</Link></li>
                      <li><Link href="/contact" className="hover:text-[#DAA520]">اتصل بنا</Link></li>
                      <li><Link href="/privacy-policy" className="hover:text-[#DAA520]">سياسة الخصوصية</Link></li>
                      <li><Link href="/terms" className="hover:text-[#DAA520]">الشروط والأحكام</Link></li>
                  </ul>
              </div>

              <div>
                  <h4 className="text-[#FFD700] font-bold mb-4 font-[family-name:var(--font-cairo)]">تواصل معنا</h4>
                  <ul className="space-y-2 text-sm text-[#F4E4BC]/70">
                      <li>info@ather-alilm.com</li>
                      <li>+966 50 000 0000</li>
                      <li>الرياض، المملكة العربية السعودية</li>
                  </ul>
              </div>
           </div>
           <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#5D4037]/50 text-center text-[#F4E4BC]/40 text-sm">
              © {new Date().getFullYear()} أثير العلم. جميع الحقوق محفوظة.
           </div>
        </footer>
      </div>
    </PageTransition>
  );
}