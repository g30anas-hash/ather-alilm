import { motion } from "framer-motion";
import { BookOpen, Calendar, Map, Monitor, Swords, Video } from "lucide-react";
import { useUser, WeeklyPlanItem } from "@/context/UserContext";
import { cn } from "@/lib/utils";

export default function WeekMap() {
  const { weeklyPlan, role, name, allUsers } = useUser();
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  const currentUser = allUsers.find(u => u.name === name);

  return (
    <div className="bg-[#2A1B0E]/90 border-2 border-[#5D4037] rounded-xl p-6 relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] mb-6 flex items-center gap-3">
          <Map className="w-6 h-6" />
          خريطة الأسبوع
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.map((day, idx) => {
            const dayItems = weeklyPlan.filter(item => {
                if (item.day !== day) return false;
                if (role === 'student') {
                    return item.classId === currentUser?.classId;
                }
                return true;
            });
            
            return (
              <div key={day} className="flex flex-col gap-3">
                <div className="text-center bg-[#DAA520]/20 py-2 rounded-t-lg border-b border-[#DAA520]/30">
                  <span className="text-[#FFD700] font-bold font-[family-name:var(--font-cairo)]">{day}</span>
                </div>
                
                <div className="bg-[#000]/30 min-h-[200px] rounded-b-lg border border-[#5D4037] p-2 space-y-2">
                  {dayItems.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[#F4E4BC]/30 text-xs text-center">
                      لا توجد مهام
                    </div>
                  ) : (
                    dayItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "p-2 rounded border text-xs relative group cursor-pointer hover:scale-105 transition-transform",
                          item.type === 'exam' ? "bg-[#FF6B6B]/20 border-[#FF6B6B]" :
                          item.type === 'quest' ? "bg-[#DAA520]/20 border-[#DAA520]" :
                          "bg-[#4ECDC4]/20 border-[#4ECDC4]"
                        )}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={cn(
                            "font-bold",
                            item.type === 'exam' ? "text-[#FF6B6B]" :
                            item.type === 'quest' ? "text-[#DAA520]" :
                            "text-[#4ECDC4]"
                          )}>{item.title}</span>
                          {item.isRemote && <Monitor className="w-3 h-3 text-[#4ECDC4]" />}
                        </div>
                        <p className="text-[#F4E4BC]/70 line-clamp-2">{item.description}</p>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 bg-black/90 p-2 rounded border border-[#DAA520] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                           <p className="text-[#F4E4BC] text-xs">{item.description}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
