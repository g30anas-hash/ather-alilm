-- 1. Sync the ID sequence to ensure we don't get "duplicate key value" errors on ID
SELECT setval('public.users_id_seq', COALESCE((SELECT MAX(id) FROM public.users), 0) + 1, false);

-- 2. Insert the seed users (if they don't exist by email)
-- We must ensure all VALUES rows match the columns list exactly or use separate INSERTs
-- Columns: name, email, role, level, xp, coins, subject, class_id

INSERT INTO public.users (name, email, role, level, xp, coins)
VALUES (
    'القائد الملهم', 
    'admin@ather.com', 
    'leader', 
    99, 
    9999, 
    99999
) ON CONFLICT (email) DO NOTHING;

INSERT INTO public.users (name, email, role, subject, level, xp, coins)
VALUES (
    'المعلم الحكيم', 
    'teacher@ather.com', 
    'teacher', 
    'العلوم', 
    10, 
    1000, 
    500
) ON CONFLICT (email) DO NOTHING;

INSERT INTO public.users (name, email, role, class_id, level, xp, coins)
VALUES (
    'الطالب المغامر', 
    'student@ather.com', 
    'student', 
    '1-A', 
    1, 
    0, 
    100
) ON CONFLICT (email) DO NOTHING;

INSERT INTO public.users (name, email, role, level, xp, coins)
VALUES (
    'ولي الأمر الداعم', 
    'parent@ather.com', 
    'parent', 
    1, 
    0, 
    0
) ON CONFLICT (email) DO NOTHING;
