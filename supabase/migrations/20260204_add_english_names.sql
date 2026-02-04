-- Add name_en column to exercises table
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS name_en text;

-- Update existing exercises with English names
UPDATE exercises SET name_en = 'Squat' WHERE name = '스쿼트';
UPDATE exercises SET name_en = 'Leg Press' WHERE name = '레그 프레스';
UPDATE exercises SET name_en = 'Deadlift' WHERE name = '데드리프트';
UPDATE exercises SET name_en = 'Bench Press' WHERE name = '벤치 프레스';
UPDATE exercises SET name_en = 'Overhead Press' WHERE name = '오버헤드 프레스';
UPDATE exercises SET name_en = 'Lat Pulldown' WHERE name = '래트 풀다운';
UPDATE exercises SET name_en = 'Seated Row' WHERE name = '시티드 로우';
UPDATE exercises SET name_en = 'Dumbbell Curl' WHERE name = '덤벨 컬';
UPDATE exercises SET name_en = 'Triceps Extension' WHERE name = '트라이셉스 익스텐션';
UPDATE exercises SET name_en = 'Leg Extension' WHERE name = '레그 익스텐션';
UPDATE exercises SET name_en = 'Leg Curl' WHERE name = '레그 컬';
UPDATE exercises SET name_en = 'Lunge' WHERE name = '런지';
UPDATE exercises SET name_en = 'Pull Up' WHERE name = '풀업';
UPDATE exercises SET name_en = 'Push Up' WHERE name = '푸시업';
UPDATE exercises SET name_en = 'Plank' WHERE name = '플랭크';
