-- Create default users for each role if they don't exist

-- 1. Leader (Admin)
INSERT INTO public.users (id, name, email, role, level, xp, coins)
VALUES (
    1, 
    'القائد الملهم', 
    'admin@ather.com', 
    'leader', 
    99, 
    9999, 
    99999
) ON CONFLICT (email) DO NOTHING;

-- 2. Teacher
INSERT INTO public.users (id, name, email, role, subject, level, xp, coins)
VALUES (
    2, 
    'المعلم الحكيم', 
    'teacher@ather.com', 
    'teacher', 
    'العلوم', 
    10, 
    1000, 
    500
) ON CONFLICT (email) DO NOTHING;

-- 3. Student
INSERT INTO public.users (id, name, email, role, class_id, level, xp, coins)
VALUES (
    3, 
    'الطالب المغامر', 
    'student@ather.com', 
    'student', 
    '1-A', 
    1, 
    0, 
    100
) ON CONFLICT (email) DO NOTHING;

-- 4. Parent
INSERT INTO public.users (id, name, email, role, children_ids, level, xp, coins)
VALUES (
    4, 
    'ولي الأمر الداعم', 
    'parent@ather.com', 
    'parent', 
    '{3}', -- Links to student ID 3
    1, 
    0, 
    0
) ON CONFLICT (email) DO NOTHING;

-- Note: Password for all these accounts will be set upon first login via Auth Signup 
-- because we only insert into 'users' table here, not 'auth.users'.
-- The current flow allows them to "Sign Up" because their email exists in 'users'.
