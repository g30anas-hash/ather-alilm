-- Seed Users
INSERT INTO public.users (id, name, email, password, role, coins, xp, level)
VALUES
(1001, 'الطالب المجتهد', 'student@ather.com', 'password123', 'student', 100, 50, 1),
(1002, 'المعلم الخبير', 'teacher@ather.com', 'password123', 'teacher', 0, 0, 10)
ON CONFLICT (email) DO NOTHING;

-- Seed Quests
INSERT INTO public.quests (title, subtitle, cost, image, type, status)
VALUES
('قراءة قصة قصيرة', 'اقرأ قصة من المكتبة ولخصها', 50, 'book-icon', 'daily', 'active'),
('حل مسألة رياضيات', 'حل المسألة رقم 5 ص 20', 100, 'math-icon', 'challenge', 'active')
ON CONFLICT DO NOTHING;

-- Seed Map Nodes
INSERT INTO public.map_nodes (id, title, type, status, x, y, stars, description, level_req, subject)
VALUES
('node-1', 'بوابة البداية', 'lesson', 'unlocked', 100, 300, 0, 'بداية رحلة المعرفة', 1, 'math'),
('node-2', 'قلعة الأرقام', 'quiz', 'locked', 250, 200, 0, 'اختبار في الجمع والطرح', 2, 'math')
ON CONFLICT (id) DO NOTHING;

-- Seed Behaviors
INSERT INTO public.behaviors (student_id, student_name, teacher_id, teacher_name, type, category, reason, gold_amount, xp_amount, status)
VALUES
(1001, 'الطالب المجتهد', 1002, 'المعلم الخبير', 'positive', 'participation', 'مشاركة فعالة في الدرس', 10, 20, 'approved')
ON CONFLICT DO NOTHING;
