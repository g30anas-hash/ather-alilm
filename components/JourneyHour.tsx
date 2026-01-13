import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Monitor, Users, Video, Play, ExternalLink } from "lucide-react";
import { useUser, ScheduleItem } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import GoldButton from "./GoldButton";
import { useToast } from "@/context/ToastContext";

export default function JourneyHour() {
  const { schedule, markAttendance, role, name, allUsers } = useUser();
  const { showToast } = useToast();
  const [activeDay, setActiveDay] = useState("الأحد");
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  
  // Mock current time for demo (in a real app, use new Date())
  // We'll simulate that it's 08:55 AM to show the countdown for the 09:00 class
  const currentTime = "08:55"; 

  const currentUser = allUsers.find(u => u.name === name);

  const handleEnterMeeting = (item: ScheduleItem) => {
    if (item.type !== 'remote' || !item.meetingUrl) return;
    
    // Mark attendance automatically
    if (role === 'student' && currentUser) {
        markAttendance({
            studentId: currentUser.id,
            scheduleItemId: item.id,
            subject: item.subject,
            status: 'present'
        });
        showToast("تم تسجيل حضورك بنجاح ✅", "success");
    }

    showToast(`جاري الاتصال بـ بوابة اللقاء لدرس ${item.subject}...`, "info");
    
    // Simulate opening meeting
    setTimeout(() => {
        window.open(item.meetingUrl, '_blank');
    }, 1500);
  };

  const getStatus = (time: string) => {
     // Simple logic for demo
     if (time === '09:00') return 'upcoming'; // Starts in 5 mins
     if (time === '08:00') return 'completed';
     return 'future';
  };

  const currentSchedule = schedule.filter(s => {
      // Day Filter
      if (s.day !== activeDay) return false;

      // Role Filter
      if (role === 'student') {
          return s.classId === currentUser?.classId;
      }
      if (role === 'teacher') {
          return s.teacherId === currentUser?.id;
      }
      return true; // Admin or others see all
  }).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="bg-[#2A1B0E]/90 border-2 border-[#5D4037] rounded-xl p-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] flex items-center gap-3">
          <Clock className="w-6 h-6" />
          ساعة الرحلة
        </h2>

        {/* Day Selector */}
        <div className="flex bg-[#000]/30 rounded-lg p-1 overflow-x-auto max-w-full">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={cn(
                "px-4 py-1 rounded-md text-sm font-bold transition-all whitespace-nowrap",
                activeDay === day 
                  ? "bg-[#DAA520] text-[#2A1B0E]" 
                  : "text-[#F4E4BC]/60 hover:text-[#F4E4BC]"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {currentSchedule.length === 0 ? (
           <div className="text-center py-10 text-[#F4E4BC]/40">
               <p>لا توجد حصص في هذا اليوم</p>
           </div>
        ) : (
           currentSchedule.map((item) => {
             const status = getStatus(item.time);
             
             return (
               <motion.div
                 key={item.id}
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 className={cn(
                   "flex items-center gap-4 p-4 rounded-lg border-l-4 transition-all",
                   item.type === 'in-person' 
                     ? "bg-[#2A1B0E] border-l-[#4ECDC4] border-y border-r border-[#5D4037]" 
                     : "bg-[#1A2F1A] border-l-[#2ECC71] border-y border-r border-[#2ECC71]/30" // Remote style
                 )}
               >
                 <div className="w-16 text-center shrink-0">
                   <span className="block text-[#F4E4BC] font-bold">{item.time}</span>
                   <span className="text-[#F4E4BC]/40 text-xs">{item.duration} د</span>
                 </div>

                 <div className="flex-1">
                    <h3 className="text-[#FFD700] font-bold font-[family-name:var(--font-amiri)] text-lg">
                        {item.subject}
                    </h3>
                    <div className="flex items-center gap-2 text-xs mt-1">
                        {item.type === 'in-person' ? (
                            <span className="flex items-center gap-1 text-[#4ECDC4] bg-[#4ECDC4]/10 px-2 py-0.5 rounded">
                                <Users className="w-3 h-3" /> حضوري
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[#2ECC71] bg-[#2ECC71]/10 px-2 py-0.5 rounded">
                                <Monitor className="w-3 h-3" /> عن بُعد
                            </span>
                        )}
                    </div>
                 </div>

                 {/* Action Button */}
                 <div className="shrink-0">
                    {item.type === 'remote' ? (
                        status === 'upcoming' ? (
                             <GoldButton 
                                onClick={() => handleEnterMeeting(item)}
                                className="px-4 py-2 text-sm flex items-center gap-2 animate-pulse"
                             >
                                <Video className="w-4 h-4" />
                                بوابة اللقاء
                             </GoldButton>
                        ) : status === 'completed' ? (
                             <span className="text-[#F4E4BC]/40 text-sm">انتهت</span>
                        ) : (
                             <button disabled className="px-4 py-2 bg-[#000]/20 text-[#F4E4BC]/40 rounded-lg text-sm border border-[#5D4037] cursor-not-allowed flex items-center gap-2">
                                <Video className="w-4 h-4" />
                                لم تبدأ
                             </button>
                        )
                    ) : (
                        <span className="text-[#F4E4BC]/40 text-sm">قاعة الصف</span>
                    )}
                 </div>
               </motion.div>
             );
           })
        )}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex gap-4 text-xs text-[#F4E4BC]/60 border-t border-[#5D4037] pt-4">
          <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#2A1B0E] border border-[#4ECDC4] rounded-sm"></span>
              <span>حصص حضورية</span>
          </div>
          <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#1A2F1A] border border-[#2ECC71] rounded-sm"></span>
              <span>حصص عن بُعد</span>
          </div>
      </div>
    </div>
  );
}
