-- Clean up existing users to start fresh with clean IDs (Optional but good for clean slate if not in prod with real users)
-- TRUNCATE users CASCADE; 

-- Create default users for each role
-- Note: We are not setting IDs manually to avoid conflict with sequence if it exists, 
-- but we rely on email uniqueness.

-- 1. Leader (Admin)
INSERT INTO public.users (name, email, role, level, xp, coins)
VALUES (
    'القائد الملهم', 
    'admin@ather.com', 
    'leader', 
    99, 
    9999, 
    99999
) ON CONFLICT (email) DO NOTHING;

-- 2. Teacher
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

-- 3. Student
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

-- 4. Parent
INSERT INTO public.users (name, email, role, children_ids, level, xp, coins)
VALUES (
    'ولي الأمر الداعم', 
    'parent@ather.com', 
    'parent', 
    '{3}', -- Ideally this should link to the student's actual ID if known, or be updated later
    1, 
    0, 
    0
) ON CONFLICT (email) DO NOTHING;
