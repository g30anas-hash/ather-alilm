
-- Market Items Table
CREATE TABLE IF NOT EXISTS market_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    type TEXT NOT NULL,
    image TEXT NOT NULL,
    rarity TEXT NOT NULL
);

-- Add JSONB columns to users for nested data
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS inventory JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS notifications JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS accepted_quests INTEGER[] DEFAULT ARRAY[]::integer[];

-- Seed Market Items
INSERT INTO market_items (id, name, description, price, type, image, rarity) VALUES
('frame_gold', 'إطار الملك', 'إطار ذهبي فاخر يزين صورتك الرمزية', 500, 'frame', 'https://images.unsplash.com/photo-1614850523060-8da1d56e37ad?q=80&w=2670&auto=format&fit=crop', 'legendary'),
('badge_explorer', 'وسام المستكشف', 'وسام شرف للمغامرين الشجعان', 300, 'badge', 'https://images.unsplash.com/photo-1615750035658-4f81c969966f?q=80&w=2670&auto=format&fit=crop', 'rare'),
('mystery_box', 'صندوق الغموض', 'افتح الصندوق واحصل على جائزة عشوائية!', 150, 'consumable', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2640&auto=format&fit=crop', 'epic'),
('frame_silver', 'الإطار الفضي', 'أناقة وبساطة للمحترفين', 200, 'frame', 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=2576&auto=format&fit=crop', 'common'),
('canteen_voucher', 'قسيمة المقصف', 'وجبة مجانية من مقصف المدرسة', 1000, 'consumable', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2580&auto=format&fit=crop', 'epic'),
('homework_pass', 'إعفاء واجب', 'بطاقة ذهبية للإعفاء من واجب واحد', 2000, 'consumable', 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2670&auto=format&fit=crop', 'legendary')
ON CONFLICT (id) DO NOTHING;

-- Seed Badges for Initial Users (Example)
UPDATE users SET badges = '[
    {"id": "1", "name": "المستكشف الأول", "icon": "🌍", "description": "أتممت أول مهمة استكشاف", "dateEarned": "2024-01-01"},
    {"id": "2", "name": "صديق البيئة", "icon": "🌱", "description": "شاركت في حملة التشجير", "dateEarned": "2024-02-15"}
]'::jsonb WHERE id = 1;
