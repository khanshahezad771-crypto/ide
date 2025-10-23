-- DATABASE VERIFICATION SCRIPT
-- Run this in Supabase SQL Editor to verify your setup is correct

-- Check 1: Verify all tables exist
SELECT 
  'Tables Check' as check_name,
  CASE 
    WHEN COUNT(*) = 3 THEN '✅ PASS - All tables exist'
    ELSE '❌ FAIL - Missing tables'
  END as status,
  array_agg(tablename) as existing_tables
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('games', 'user_roles', 'traffic_logs');

-- Check 2: Verify storage bucket exists
SELECT 
  'Storage Bucket Check' as check_name,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ PASS - game-assets bucket exists'
    ELSE '❌ FAIL - game-assets bucket not found'
  END as status
FROM storage.buckets 
WHERE id = 'game-assets';

-- Check 3: Verify admin users exist
SELECT 
  'Admin Users Check' as check_name,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ PASS - ' || COUNT(*) || ' admin user(s) found'
    ELSE '❌ FAIL - No admin users found'
  END as status
FROM public.user_roles 
WHERE role = 'admin';

-- Check 4: List all admin users
SELECT 
  'Admin User Details' as info,
  u.email,
  u.created_at,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN 'Confirmed'
    ELSE 'Not Confirmed'
  END as email_status
FROM auth.users u
INNER JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';

-- Check 5: Verify RLS is enabled
SELECT 
  'RLS Check' as check_name,
  tablename,
  CASE 
    WHEN rowsecurity = true THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('games', 'user_roles', 'traffic_logs');

-- Check 6: Count existing games
SELECT 
  'Games Count' as info,
  COUNT(*) as total_games
FROM public.games;

-- Check 7: Verify storage policies
SELECT 
  'Storage Policies Check' as check_name,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ PASS - Storage policies exist'
    ELSE '❌ FAIL - Missing storage policies'
  END as status
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%game-assets%';

-- Check 8: Verify table policies
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- SUMMARY
SELECT 
  '===================' as separator,
  'SETUP VERIFICATION COMPLETE' as message,
  '===================' as separator2;

-- If all checks show ✅ PASS, your setup is complete!
-- If any checks show ❌ FAIL, re-run the migration file.
