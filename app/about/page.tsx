"use client";

import PageTransition from "@/components/PageTransition";
import GoldButton from "@/components/GoldButton";
import Link from "next/link";
import { ArrowLeft, BookOpen, Crown, Lightbulb, Sparkles, Target, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-[#0a192f] text-[#F4E4BC] p-8 relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-12 border-b border-[#DAA520]/30 pb-6">
             <div>
                <h1 className="text-4xl md:text-5xl text-[#FFD700] font-[family-name:var(--font-amiri)] mb-2">عن أثير العلم</h1>
                <p className="text-[#F4E4BC]/60 font-[family-name:var(--font-scheherazade)] text-xl">قصة المملكة التي حولت العلم إلى مغامرة</p>
             </div>
             <Link href="/">
                <GoldButton variant="secondary" className="gap-2">
                   <ArrowLeft className="w-4 h-4" />
                   العودة للبوابة
                </GoldButton>
             </Link>
          </header>

          {/* Main Content */}
          <div className="space-y-12 font-[family-name:var(--font-cairo)]">
            
            {/* Story Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#DAA520]/10 rounded-full flex items-center justify-center text-[#FFD700]">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#F4E4BC]">القصة والبداية</h2>
                    </div>
                    <p className="leading-relaxed text-[#F4E4BC]/80 text-lg">
                        في عالم تسيطر عليه الطرق التقليدية، ولدت فكرة "أثير العلم". لم نرد أن يكون التعليم مجرد تلقين، بل أردناه رحلة ملحمية. هنا، الطالب ليس مجرد متلقٍ، بل هو "بطل" يسعى لجمع جواهر المعرفة، والمعلم هو "الحكيم" الذي يرشده، وولي الأمر هو "الداعم" الذي يراقب تطوره.
                    </p>
                </div>
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-[#DAA520]/30 shadow-[0_0_30px_rgba(218,165,32,0.1)]">
                    <img 
                        src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=magical%20fantasy%20library%20with%20glowing%20books%20and%20scrolls,%20warm%20mystical%20lighting,%20hogwarts%20style,%20highly%20detailed%20interior,%20cinematic&image_size=landscape_16_9" 
                        alt="Fantasy Library" 
                        className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent" />
                </div>
            </section>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#2A1B0E]/60 border border-[#5D4037] p-8 rounded-2xl backdrop-blur-sm hover:border-[#DAA520] transition-colors group">
                    <div className="w-14 h-14 bg-[#4ECDC4]/10 rounded-full flex items-center justify-center text-[#4ECDC4] mb-6 group-hover:scale-110 transition-transform">
                        <Target className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#FFD700] mb-3">رؤيتنا</h3>
                    <p className="text-[#F4E4BC]/70 leading-relaxed">
                        بناء جيل من المتعلمين الشغوفين الذين يرون في العلم سلاحاً للمستقبل، وفي المعرفة متعة لا تنتهي.
                    </p>
                </div>

                <div className="bg-[#2A1B0E]/60 border border-[#5D4037] p-8 rounded-2xl backdrop-blur-sm hover:border-[#DAA520] transition-colors group">
                    <div className="w-14 h-14 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center text-[#FF6B6B] mb-6 group-hover:scale-110 transition-transform">
                        <Lightbulb className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#FFD700] mb-3">رسالتنا</h3>
                    <p className="text-[#F4E4BC]/70 leading-relaxed">
                        تحويل العملية التعليمية الجامدة إلى تجربة تفاعلية حية (Gamification) تلمس عقول وقلوب الطلاب.
                    </p>
                </div>

                <div className="bg-[#2A1B0E]/60 border border-[#5D4037] p-8 rounded-2xl backdrop-blur-sm hover:border-[#DAA520] transition-colors group">
                    <div className="w-14 h-14 bg-[#A3CB38]/10 rounded-full flex items-center justify-center text-[#A3CB38] mb-6 group-hover:scale-110 transition-transform">
                        <Crown className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[#FFD700] mb-3">قيمنا</h3>
                    <p className="text-[#F4E4BC]/70 leading-relaxed">
                        الشغف، الابتكار، التعاون، والأمانة العلمية. هذه هي الركائز التي تقوم عليها مملكة أثير.
                    </p>
                </div>
            </div>

            {/* Team/Community Section */}
            <section className="bg-[#2A1B0E]/40 border border-[#5D4037] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DAA520]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4ECDC4]/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-[#DAA520]/20 rounded-full flex items-center justify-center text-[#FFD700] animate-pulse">
                            <Users className="w-8 h-8" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-[#F4E4BC] mb-4">مجتمع الأثير</h2>
                    <p className="text-[#F4E4BC]/80 text-lg mb-8">
                        نحن لسنا مجرد منصة، نحن مجتمع متكامل. من المطورين السحرة الذين يكتبون التعاويذ (الأكواد)، إلى المعلمين الحكماء، والطلاب الأبطال.
                    </p>
                    <div className="flex justify-center gap-4">
                        <div className="flex -space-x-4 rtl:space-x-reverse">
                            {[1,2,3,4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#2A1B0E] bg-[#DAA520] flex items-center justify-center text-[#000] font-bold text-xs">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                            ))}
                        </div>
                        <span className="flex items-center text-[#F4E4BC]/60 text-sm">
                            +1000 بطل انضموا إلينا
                        </span>
                    </div>
                </div>
            </section>

          </div>
          
          <footer className="mt-16 text-center text-[#F4E4BC]/40 text-sm border-t border-[#DAA520]/20 pt-8">
             صنع بكل حب وسحر في معامل أثير العلم © {new Date().getFullYear()}
          </footer>
        </div>
      </main>
    </PageTransition>
  );
}
