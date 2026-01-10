-- Teen Academy Tables Migration
-- Run this in your Supabase SQL Editor

-- ============================================
-- TEEN COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  estimated_hours INTEGER,
  xp_reward INTEGER NOT NULL DEFAULT 100,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEEN LESSONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES teen_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  xp_reward INTEGER NOT NULL DEFAULT 25,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, slug)
);

-- ============================================
-- TEEN FLASHCARD SETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_flashcard_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES teen_lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEEN FLASHCARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id UUID REFERENCES teen_flashcard_sets(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  hint TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEEN QUIZZES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES teen_lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  time_limit_minutes INTEGER,
  passing_score INTEGER NOT NULL DEFAULT 70,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEEN QUIZ QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES teen_quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEEN MATCHING GAMES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_matching_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES teen_lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  time_limit_seconds INTEGER,
  xp_reward INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEEN MATCHING PAIRS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_matching_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES teen_matching_games(id) ON DELETE CASCADE,
  left_text TEXT NOT NULL,
  right_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEEN PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES teen_courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES teen_lessons(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL DEFAULT 'lesson',
  activity_id UUID,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  score INTEGER,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id, activity_type)
);

-- ============================================
-- TEEN COMMUNITY POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEEN COMMUNITY LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES teen_community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- ============================================
-- TEEN COMMUNITY COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teen_community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES teen_community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEEN PROFILES TABLE (for XP tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS teen_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE teen_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_matching_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_matching_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for courses and content
CREATE POLICY "Public can view published courses" ON teen_courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published lessons" ON teen_lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view flashcard sets" ON teen_flashcard_sets FOR SELECT USING (true);
CREATE POLICY "Public can view flashcards" ON teen_flashcards FOR SELECT USING (true);
CREATE POLICY "Public can view quizzes" ON teen_quizzes FOR SELECT USING (true);
CREATE POLICY "Public can view quiz questions" ON teen_quiz_questions FOR SELECT USING (true);
CREATE POLICY "Public can view matching games" ON teen_matching_games FOR SELECT USING (true);
CREATE POLICY "Public can view matching pairs" ON teen_matching_pairs FOR SELECT USING (true);

-- Progress: users can only see/modify their own
CREATE POLICY "Users can view own progress" ON teen_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON teen_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON teen_progress FOR UPDATE USING (auth.uid() = user_id);

-- Community posts: public read, auth write
CREATE POLICY "Public can view approved posts" ON teen_community_posts FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create posts" ON teen_community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON teen_community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON teen_community_posts FOR DELETE USING (auth.uid() = user_id);

-- Likes: users can manage their own
CREATE POLICY "Public can view likes" ON teen_community_likes FOR SELECT USING (true);
CREATE POLICY "Users can like" ON teen_community_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON teen_community_likes FOR DELETE USING (auth.uid() = user_id);

-- Comments: public read, auth write
CREATE POLICY "Public can view comments" ON teen_community_comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON teen_community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON teen_community_comments FOR DELETE USING (auth.uid() = user_id);

-- Profiles: users can see all, modify own
CREATE POLICY "Public can view profiles" ON teen_profiles FOR SELECT USING (true);
CREATE POLICY "Users can create own profile" ON teen_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON teen_profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- FUNCTION TO INCREMENT XP
-- ============================================
CREATE OR REPLACE FUNCTION increment_teen_points(p_user_id UUID, p_points INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO teen_profiles (id, total_xp)
  VALUES (p_user_id, p_points)
  ON CONFLICT (id) DO UPDATE
  SET total_xp = teen_profiles.total_xp + p_points,
      updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DATA (Optional - uncomment to add)
-- ============================================

-- Sample SAT Prep Course
INSERT INTO teen_courses (title, slug, description, category, difficulty, xp_reward, is_featured, is_published, order_index)
VALUES
  ('SAT Math Fundamentals', 'sat-math-fundamentals', 'Master the essential math concepts for the SAT exam. From algebra to geometry, build a strong foundation.', 'sat-prep', 'intermediate', 500, true, true, 1),
  ('SAT Reading Strategies', 'sat-reading-strategies', 'Learn proven strategies to improve your reading comprehension and critical analysis skills.', 'sat-prep', 'intermediate', 500, true, true, 2),
  ('College Application Guide', 'college-application-guide', 'Step-by-step guide to crafting winning college applications, essays, and interviews.', 'college-prep', 'beginner', 400, true, true, 3),
  ('Study Skills Mastery', 'study-skills-mastery', 'Develop effective study habits, time management, and test-taking strategies.', 'study-skills', 'beginner', 300, false, true, 4),
  ('Oromo History & Culture', 'oromo-history-culture', 'Explore the rich history, traditions, and cultural heritage of the Oromo people.', 'oromo-culture', 'beginner', 350, false, true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Sample Lessons for SAT Math Course
INSERT INTO teen_lessons (course_id, title, slug, description, content, duration_minutes, xp_reward, order_index, is_published)
SELECT
  c.id,
  lesson.title,
  lesson.slug,
  lesson.description,
  lesson.content,
  lesson.duration,
  lesson.xp,
  lesson.idx,
  true
FROM teen_courses c,
(VALUES
  ('Algebra Basics', 'algebra-basics', 'Review fundamental algebra concepts including equations and expressions.', '<h2>Introduction to Algebra</h2><p>Algebra is the foundation of SAT math. In this lesson, we will review key concepts including variables, expressions, and equations.</p><h3>Key Topics</h3><ul><li>Variables and expressions</li><li>Solving linear equations</li><li>Word problems</li></ul>', 30, 50, 1),
  ('Linear Functions', 'linear-functions', 'Understanding slope, intercepts, and graphing linear equations.', '<h2>Linear Functions</h2><p>Linear functions are one of the most tested topics on the SAT. Learn how to work with slope-intercept form and graph lines.</p>', 35, 50, 2),
  ('Quadratic Equations', 'quadratic-equations', 'Master factoring, the quadratic formula, and graphing parabolas.', '<h2>Quadratic Equations</h2><p>Quadratics appear frequently on the SAT. Learn multiple methods to solve them.</p>', 40, 60, 3),
  ('Geometry Essentials', 'geometry-essentials', 'Key geometry concepts: angles, triangles, circles, and area/perimeter.', '<h2>Geometry on the SAT</h2><p>Review essential geometry formulas and problem-solving strategies.</p>', 45, 60, 4),
  ('Data Analysis', 'data-analysis', 'Interpret graphs, tables, and statistics for SAT problem solving.', '<h2>Data Analysis</h2><p>Learn to read and interpret various data representations.</p>', 30, 50, 5)
) AS lesson(title, slug, description, content, duration, xp, idx)
WHERE c.slug = 'sat-math-fundamentals'
ON CONFLICT (course_id, slug) DO NOTHING;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teen_lessons_course_id ON teen_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_teen_progress_user_id ON teen_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_teen_community_posts_user_id ON teen_community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_teen_community_posts_created_at ON teen_community_posts(created_at DESC);
