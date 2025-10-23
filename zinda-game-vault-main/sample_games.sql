-- SAMPLE GAMES DATA
-- Run this in Supabase SQL Editor to add test/sample games to your site
-- This helps you test the site before adding real games

-- Sample Game 1: Action Game
INSERT INTO public.games (
  title,
  description,
  banner_url,
  screenshots,
  min_requirements,
  recommended_requirements,
  download_link
) VALUES (
  'Cyber Legends',
  'Embark on an epic journey through a futuristic cyberpunk world. Fight against evil corporations, hack systems, and save humanity from digital tyranny. Features stunning graphics, intense combat, and a gripping storyline that will keep you on the edge of your seat.',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400',
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400'
  ],
  'OS: Windows 10 64-bit
Processor: Intel Core i5-6600K / AMD Ryzen 5 1600
Memory: 8 GB RAM
Graphics: NVIDIA GTX 1060 6GB / AMD RX 580 8GB
DirectX: Version 12
Storage: 50 GB available space',
  'OS: Windows 11 64-bit
Processor: Intel Core i7-9700K / AMD Ryzen 7 3700X
Memory: 16 GB RAM
Graphics: NVIDIA RTX 3060 Ti / AMD RX 6700 XT
DirectX: Version 12
Storage: 50 GB SSD',
  'https://mega.nz/file/example1'
);

-- Sample Game 2: Racing Game
INSERT INTO public.games (
  title,
  description,
  banner_url,
  screenshots,
  min_requirements,
  recommended_requirements,
  download_link
) VALUES (
  'Speed Rivals Ultimate',
  'Experience the thrill of high-speed racing with realistic physics and stunning graphics. Compete in various racing modes, customize your vehicles, and become the ultimate racing champion. Features over 100 licensed cars and 30+ racing tracks around the world.',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400'
  ],
  'OS: Windows 10
Processor: Intel Core i3-4160 / AMD FX-6300
Memory: 6 GB RAM
Graphics: NVIDIA GTX 750 Ti / AMD R7 260X
Storage: 30 GB available space',
  'OS: Windows 10/11
Processor: Intel Core i7-6700K / AMD Ryzen 5 2600
Memory: 12 GB RAM
Graphics: NVIDIA GTX 1070 / AMD RX Vega 56
Storage: 30 GB SSD',
  'https://mega.nz/file/example2'
);

-- Sample Game 3: Adventure Game
INSERT INTO public.games (
  title,
  description,
  banner_url,
  screenshots,
  min_requirements,
  recommended_requirements,
  download_link
) VALUES (
  'Lost Kingdoms: The Ancient Quest',
  'Discover ancient secrets in this epic adventure RPG. Explore vast open worlds, battle mythical creatures, and uncover the mysteries of lost civilizations. Make choices that shape your destiny and experience a story-driven adventure like no other.',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400'
  ],
  'OS: Windows 10 64-bit
Processor: Intel Core i5-4460 / AMD FX-8350
Memory: 8 GB RAM
Graphics: NVIDIA GTX 960 / AMD R9 280
Storage: 45 GB available space',
  'OS: Windows 10/11 64-bit
Processor: Intel Core i7-7700K / AMD Ryzen 5 3600
Memory: 16 GB RAM
Graphics: NVIDIA RTX 2060 / AMD RX 5700
Storage: 45 GB SSD',
  'https://mega.nz/file/example3'
);

-- Sample Game 4: Strategy Game
INSERT INTO public.games (
  title,
  description,
  banner_url,
  min_requirements,
  recommended_requirements,
  download_link
) VALUES (
  'Empire Builder: War Tactics',
  'Build your empire from scratch and lead your armies to victory! This real-time strategy game challenges you to manage resources, develop technologies, and conquer enemy territories. Form alliances, wage wars, and establish your dominance in this epic strategy experience.',
  'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800',
  'OS: Windows 7/8/10
Processor: Intel Core i3-2100 / AMD A8-5600K
Memory: 4 GB RAM
Graphics: NVIDIA GTX 650 / AMD HD 7750
Storage: 20 GB available space',
  'OS: Windows 10
Processor: Intel Core i5-6600 / AMD Ryzen 3 1300X
Memory: 8 GB RAM
Graphics: NVIDIA GTX 1050 Ti / AMD RX 570
Storage: 20 GB available space',
  'https://mega.nz/file/example4'
);

-- Sample Game 5: Horror Game
INSERT INTO public.games (
  title,
  description,
  banner_url,
  screenshots,
  min_requirements,
  recommended_requirements,
  download_link
) VALUES (
  'Shadows of Fear',
  'Enter a world of terror and suspense in this psychological horror masterpiece. Survive the night in an abandoned asylum filled with unspeakable horrors. Use stealth, solve puzzles, and uncover the dark secrets that lurk in the shadows. Can you make it until dawn?',
  'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400'
  ],
  'OS: Windows 10 64-bit
Processor: Intel Core i5-6600 / AMD Ryzen 3 1200
Memory: 8 GB RAM
Graphics: NVIDIA GTX 1050 / AMD RX 560
Storage: 25 GB available space',
  'OS: Windows 10/11 64-bit
Processor: Intel Core i7-8700 / AMD Ryzen 5 3600
Memory: 16 GB RAM
Graphics: NVIDIA GTX 1660 / AMD RX 590
Storage: 25 GB SSD',
  'https://mega.nz/file/example5'
);

-- Verify the games were added
SELECT 
  id,
  title,
  created_at,
  CASE 
    WHEN banner_url IS NOT NULL THEN '✅ Has banner'
    ELSE '❌ No banner'
  END as banner_status,
  array_length(screenshots, 1) as screenshot_count
FROM public.games
ORDER BY created_at DESC;

-- Success message
SELECT 
  '🎮 Sample games added successfully!' as message,
  COUNT(*) as total_games
FROM public.games;

-- NOTE: 
-- These are sample games with placeholder data and images from Unsplash.
-- Replace with your actual game data when ready.
-- Update download_link with real download URLs (Google Drive, Mega, etc.)
