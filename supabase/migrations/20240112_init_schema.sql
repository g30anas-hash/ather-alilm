
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT, -- In a real app, this should be hashed. For now, mirroring the mock.
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'leader', 'parent')),
    coins INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    parent_id INTEGER,
    class_id TEXT,
    subject TEXT,
    assigned_classes TEXT[], -- Array of class IDs
    children_ids INTEGER[], -- Array of student IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    capacity INTEGER NOT NULL
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    text TEXT NOT NULL,
    type TEXT NOT NULL,
    options TEXT[],
    correct_answer TEXT NOT NULL,
    image_url TEXT,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    author_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category TEXT
);

-- Behaviors Table
CREATE TABLE IF NOT EXISTS behaviors (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    student_id INTEGER NOT NULL,
    student_name TEXT NOT NULL,
    teacher_id INTEGER NOT NULL,
    teacher_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('positive', 'negative')),
    category TEXT NOT NULL,
    reason TEXT NOT NULL,
    gold_amount INTEGER NOT NULL,
    xp_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broadcasts Table
CREATE TABLE IF NOT EXISTS broadcasts (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    sender_name TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_role TEXT NOT NULL,
    type TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quests Table
CREATE TABLE IF NOT EXISTS quests (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    cost INTEGER NOT NULL,
    image TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
);

-- Quest Submissions Table
CREATE TABLE IF NOT EXISTS quest_submissions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    quest_id INTEGER NOT NULL,
    quest_title TEXT NOT NULL,
    student_name TEXT NOT NULL,
    answer TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending'
);

-- Support Messages Table
CREATE TABLE IF NOT EXISTS support_messages (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    sender_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE
);

-- Schedule Table
CREATE TABLE IF NOT EXISTS schedule (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    subject TEXT NOT NULL,
    type TEXT NOT NULL,
    duration INTEGER NOT NULL,
    meeting_url TEXT,
    class_id TEXT,
    teacher_id INTEGER
);

-- Weekly Plan Table
CREATE TABLE IF NOT EXISTS weekly_plan (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    day TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    is_remote BOOLEAN DEFAULT FALSE,
    schedule_item_id TEXT,
    class_id TEXT
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    student_id INTEGER NOT NULL,
    student_name TEXT NOT NULL,
    schedule_item_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT NOT NULL
);

-- Competitions Table
CREATE TABLE IF NOT EXISTS competitions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status TEXT NOT NULL,
    question_ids TEXT[],
    reward_gold INTEGER NOT NULL,
    reward_xp INTEGER NOT NULL,
    created_by INTEGER NOT NULL
);

-- Competition Participants Table
CREATE TABLE IF NOT EXISTS competition_participants (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    competition_id TEXT NOT NULL REFERENCES competitions(id),
    student_id INTEGER NOT NULL,
    student_name TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Map Nodes Table
CREATE TABLE IF NOT EXISTS map_nodes (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    stars INTEGER DEFAULT 0,
    description TEXT NOT NULL,
    level_req INTEGER NOT NULL,
    time_limit INTEGER,
    questions_count INTEGER,
    subject TEXT
);

-- Initial Data (Seed)
INSERT INTO classes (id, name, grade, capacity) VALUES
('1-A', '1-A', 'الأول الثانوي', 30),
('1-B', '1-B', 'الأول الثانوي', 28),
('2-A', '2-A', 'الثاني الثانوي', 32),
('2-B', '2-B', 'الثاني الثانوي', 25),
('3-A', '3-A', 'الثالث الثانوي', 30)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, password, role, class_id, parent_id, coins, xp, level) VALUES
(1, 'أحمد محمد', 'ahmed@school.com', '123', 'student', '1-A', 101, 2400, 1200, 5),
(2, 'سارة علي', 'sara@school.com', '123', 'student', '1-B', 102, 2150, 1100, 4),
(5, 'خالد عمر', 'khaled@school.com', '123', 'student', '1-A', NULL, 1980, 950, 3),
(6, 'نورة يوسف', 'nora@school.com', '123', 'student', '1-B', NULL, 1850, 800, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, password, role, subject, assigned_classes) VALUES
(3, 'أ. محمد عبد الله', 'm.abdullah@school.com', '123', 'teacher', 'الرياضيات', ARRAY['1-A', '2-B']),
(4, 'أ. خالد يوسف', 'k.yousef@school.com', '123', 'teacher', 'العلوم', ARRAY['1-B'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, password, role, children_ids) VALUES
(101, 'ولي أمر أحمد', 'parent1@gmail.com', '123', 'parent', ARRAY[1]),
(102, 'ولي أمر سارة', 'parent2@gmail.com', '123', 'parent', ARRAY[2])
ON CONFLICT (id) DO NOTHING;

INSERT INTO quests (id, title, subtitle, cost, image, type, status) VALUES
(1, 'المكافأة الثابتة', 'مدينة المغامرات الصيفية', 2000, 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2574&auto=format&fit=crop', 'daily', 'approved'),
(2, 'مهمة الليل الحقيقية', 'استكشاف الغابة المظلمة', 3500, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2568&auto=format&fit=crop', 'epic', 'approved'),
(3, 'المستكشف الخفي', 'أسرار المكتبة القديمة', 1500, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2670&auto=format&fit=crop', 'normal', 'approved')
ON CONFLICT (id) DO NOTHING;

-- Map Nodes Seed
INSERT INTO map_nodes (id, title, type, status, x, y, stars, description, level_req, time_limit, questions_count, subject) VALUES
('1', 'جزيرة الرياضيات', 'island', 'unlocked', 10, 80, 0, 'اختبار سريع في الحساب الذهني', 1, 10, 5, 'Math'),
('2', 'غابة النحو', 'forest', 'unlocked', 30, 60, 0, 'استكشف أنواع الكلمة والجملة الاسمية', 2, 15, 10, 'Arabic'),
('3', 'كهف الفيزياء', 'cave', 'locked', 50, 40, 0, 'تحدي قوانين الحركة والسرعة', 5, 20, 8, 'Physics'),
('4', 'قلعة التحدي', 'castle', 'locked', 80, 20, 0, 'الاختبار الشامل لجميع المواد', 10, 45, 20, 'General')
ON CONFLICT (id) DO NOTHING;
