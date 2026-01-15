"use client";

import { useState, Suspense } from "react";
import PageTransition from "@/components/PageTransition";
import SidebarWorld from "@/components/SidebarWorld";
import MobileNav from "@/components/MobileNav";
import GoldButton from "@/components/GoldButton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Coins, Gem, ShoppingBag, Package, Gift, Sparkles, Shield, Lock, Crown } from "lucide-react";
import { useUser, MarketItem } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

const fallbackMarketItems: MarketItem[] = [
  {
    id: "frame_gold",
    name: "إطار الملك",
    description: "إطار ذهبي فاخر يزين صورتك الرمزية",
    price: 500,
    type: "frame",
    image: "https://images.unsplash.com/photo-1614850523060-8da1d56e37ad?q=80&w=2670&auto=format&fit=crop",
    rarity: "legendary"
  },
  {
    id: "badge_explorer",
    name: "وسام المستكشف",
    description: "وسام شرف للمغامرين الشجعان",
    price: 300,
    type: "badge",
    image: "https://images.unsplash.com/photo-1615750035658-4f81c969966f?q=80&w=2670&auto=format&fit=crop",
    rarity: "rare"
  },
  {
    id: "mystery_box",
    name: "صندوق الغموض",
    description: "افتح الصندوق واحصل على جائزة عشوائية!",
    price: 150,
    type: "consumable",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2640&auto=format&fit=crop",
    rarity: "epic"
  },
  {
    id: "frame_silver",
    name: "الإطار الفضي",
    description: "أناقة وبساطة للمحترفين",
    price: 200,
    type: "frame",
    image: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=2576&auto=format&fit=crop",
    rarity: "common"
  },
  {
    id: "canteen_voucher",
    name: "قسيمة المقصف",
    description: "وجبة مجانية من مقصف المدرسة",
    price: 1000,
    type: "consumable",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2580&auto=format&fit=crop",
    rarity: "epic"
  },
  {
    id: "homework_pass",
    name: "إعفاء واجب",
    description: "بطاقة ذهبية للإعفاء من واجب واحد",
    price: 2000,
    type: "consumable",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2670&auto=format&fit=crop",
    rarity: "legendary"
  }
];

function TreasuresPageContent() {
  const { coins, spendCoins, addItemToInventory, inventory, recordPurchase, name, allUsers, role, marketItems: dbMarketItems } = useUser();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'market' | 'inventory'>('market');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const shopItems = dbMarketItems.length ? dbMarketItems : fallbackMarketItems;

  const handleBuy = (item: MarketItem) => {
    // Check if already owned (for non-consumables)
    if (item.type !== 'consumable' && inventory.some(i => i.id === item.id)) {
        showToast("أنت تمتلك هذا العنصر بالفعل!", "warning");
        return;
    }

    setPurchasingId(item.id);

    // Simulate Network Request
    setTimeout(() => {
        if (spendCoins(item.price)) {
            const currentUser = allUsers.find(u => u.name === name && u.role === role);
            recordPurchase({
                studentId: currentUser?.id || 0,
                studentName: name,
                itemId: item.id,
                itemName: item.name,
                price: item.price
            });

            addItemToInventory({
                id: item.id,
                name: item.name,
                type: item.type,
                image: item.image
            });
            showToast(`مبروك! تم شراء ${item.name} بنجاح`, "success");
        } else {
            showToast("عذراً، لا تملك ما يكفي من الذهب", "error");
        }
        setPurchasingId(null);
    }, 1000);
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
        case 'legendary': return 'أسطوري';
        case 'epic': return 'ملحمي';
        case 'rare': return 'نادر';
        default: return 'شائع';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
        case 'frame': return 'إطار';
        case 'badge': return 'وسام';
        case 'consumable': return 'استهلاكي';
        default: return type;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case 'legendary': return 'text-[#FFD700] border-[#FFD700] bg-[#FFD700]/10';
        case 'epic': return 'text-[#9B59B6] border-[#9B59B6] bg-[#9B59B6]/10';
        case 'rare': return 'text-[#4ECDC4] border-[#4ECDC4] bg-[#4ECDC4]/10';
        default: return 'text-[#F4E4BC] border-[#5D4037] bg-[#5D4037]/20';
    }
  };

  return (
    <>
      <MobileNav />
      <div className="hidden md:block fixed right-0 top-0 z-50 h-screen">
        <SidebarWorld />
      </div>
      <PageTransition>
        <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2568&auto=format&fit=crop')] bg-cover bg-center bg-fixed font-[family-name:var(--font-cairo)]">
          {/* Atmospheric Overlays */}
          <div className="absolute inset-0 bg-[#0a0502]/70 mix-blend-multiply z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E120A] via-transparent to-[#1E120A]/80 z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] opacity-50 z-0 pointer-events-none" />

          <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-12 md:mr-80 min-h-screen flex flex-col">
             {/* Header */}
             <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                   <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] font-[family-name:var(--font-amiri)] flex items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      <Gem className="w-10 h-10" />
                      الخزنة الملكية
                   </h1>
                   <p className="text-[#F4E4BC]/80 mt-2 text-lg font-[family-name:var(--font-scheherazade)]">أنفق ذهبك بحكمة واجمع النوادر لتزين مسيرتك</p>
                </div>

                <div className="bg-[#1E120A]/80 backdrop-blur-md px-6 py-3 rounded-xl border border-[#DAA520] flex items-center gap-4 shadow-[0_0_20px_rgba(218,165,32,0.2)]">
                   <div className="text-right">
                      <p className="text-[#F4E4BC]/60 text-xs font-[family-name:var(--font-cairo)]">رصيدك الحالي</p>
                      <p className="text-2xl font-bold text-[#FFD700] font-[family-name:var(--font-cairo)]">{coins.toLocaleString()}</p>
                   </div>
                   <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center border border-[#FFD700]">
                      <Coins className="w-6 h-6 text-[#FFD700]" />
                   </div>
                </div>
             </header>

            {/* Main Board Frame */}
            <div className="flex-1 bg-[#1E120A]/80 backdrop-blur-md rounded-[2rem] border-[3px] border-[#DAA520] shadow-[0_0_60px_rgba(0,0,0,0.6)] relative flex flex-col">
                {/* Frame Decorations */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-[#DAA520] rounded-tl-[1.5rem] opacity-60 pointer-events-none" />
                <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-[#DAA520] rounded-tr-[1.5rem] opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[#DAA520] rounded-bl-[1.5rem] opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-[#DAA520] rounded-br-[1.5rem] opacity-60 pointer-events-none" />

                {/* Tabs */}
                <div className="flex justify-center -mt-6 relative z-20 gap-4">
                    <button 
                       onClick={() => setActiveTab('market')}
                       className={cn(
                          "px-8 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 border-2 shadow-lg transform hover:-translate-y-1",
                          activeTab === 'market' 
                            ? "bg-gradient-to-b from-[#DAA520] to-[#B8860B] text-[#1E120A] border-[#FFD700]" 
                            : "bg-[#2A1B0E] text-[#F4E4BC]/60 hover:text-[#F4E4BC] border-[#5D4037]"
                       )}
                    >
                       <ShoppingBag className="w-5 h-5" /> السوق
                    </button>
                    <button 
                       onClick={() => setActiveTab('inventory')}
                       className={cn(
                          "px-8 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 border-2 shadow-lg transform hover:-translate-y-1",
                          activeTab === 'inventory' 
                            ? "bg-gradient-to-b from-[#DAA520] to-[#B8860B] text-[#1E120A] border-[#FFD700]" 
                            : "bg-[#2A1B0E] text-[#F4E4BC]/60 hover:text-[#F4E4BC] border-[#5D4037]"
                       )}
                    >
                       <Package className="w-5 h-5" /> مقتنياتي
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 relative z-10">
                <AnimatePresence mode="wait">
                   {activeTab === 'market' ? (
                      <motion.div 
                        key="market"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      >
                         {shopItems.map((item) => (
                            <div key={item.id} className="group bg-[#2A1B0E]/80 border border-[#5D4037] rounded-xl overflow-hidden hover:border-[#DAA520] transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.1)] flex flex-col">
                               <div className="relative h-48 overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B0E] to-transparent z-10" />
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                  <div className={cn("absolute top-3 right-3 z-20 px-2 py-1 rounded text-xs font-bold border backdrop-blur-md tracking-wider", getRarityColor(item.rarity))}>
                                     {getRarityText(item.rarity)}
                                  </div>
                               </div>
                               
                               <div className="p-5 flex-1 flex flex-col">
                                  <h3 className="text-xl font-bold text-[#F4E4BC] mb-2 font-[family-name:var(--font-amiri)]">{item.name}</h3>
                                  <p className="text-[#F4E4BC]/60 text-sm mb-4 flex-1">{item.description}</p>
                                  
                                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#5D4037]/50">
                                     <div className="flex items-center gap-1 text-[#FFD700] font-bold text-lg">
                                        <Coins className="w-5 h-5" />
                                        {item.price}
                                     </div>
                                     <GoldButton 
                                        className={cn("px-6 py-2 text-sm", purchasingId === item.id && "opacity-70 cursor-wait")}
                                        onClick={() => handleBuy(item)}
                                        disabled={!!purchasingId}
                                     >
                                        {purchasingId === item.id ? (
                                            <Sparkles className="w-4 h-4 animate-spin" />
                                        ) : (
                                            "شراء"
                                        )}
                                     </GoldButton>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </motion.div>
                   ) : (
                      <motion.div 
                        key="inventory"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                         {inventory.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-[#F4E4BC]/40">
                               <Package className="w-24 h-24 mb-4 opacity-50" />
                               <h3 className="text-2xl font-bold mb-2">خزنتك فارغة</h3>
                               <p>اذهب للسوق واشترِ بعض الكنوز!</p>
                            </div>
                         ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                               {inventory.map((item, idx) => (
                                  <div key={`${item.id}-${idx}`} className="bg-[#2A1B0E]/60 border border-[#5D4037] rounded-xl p-4 flex items-center gap-4">
                                     <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#DAA520]/30 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                     </div>
                                     <div>
                                        <h4 className="font-bold text-[#F4E4BC]">{item.name}</h4>
                                        <p className="text-[#F4E4BC]/50 text-xs mt-1">{getTypeText(item.type)}</p>
                                        <p className="text-[#DAA520] text-xs mt-2">{item.dateAcquired}</p>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         )}
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>

          </div>
          </div>
        </main>
      </PageTransition>
    </>
  );
}

export default function TreasuresPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-[#DAA520]">جاري التحميل...</div>}>
      <TreasuresPageContent />
    </Suspense>
  );
}
