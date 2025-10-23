# 🔧 Common Admin Tasks - Quick Reference

## Admin Account Management

### Create a New Admin User

```sql
-- Run in Supabase SQL Editor
-- Replace email and password with actual values

DO $$
DECLARE
  new_user_id UUID;
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'newadmin@example.com',  -- CHANGE THIS
    crypt('SecurePassword123!', gen_salt('bf')),  -- CHANGE THIS
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW()
  )
  RETURNING id INTO new_user_id;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin');
END $$;
```

### Remove Admin Access

```sql
-- Remove admin role from a user
DELETE FROM public.user_roles 
WHERE user_id = 'USER_ID_HERE' 
AND role = 'admin';
```

### List All Admins

```sql
-- See all admin users
SELECT 
  u.email,
  u.created_at as registered_on,
  ur.role
FROM auth.users u
INNER JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY u.created_at DESC;
```

### Change Admin Password

```sql
-- Update admin password
UPDATE auth.users
SET encrypted_password = crypt('NewPassword123!', gen_salt('bf'))
WHERE email = 'admin@example.com';
```

## Game Management

### Upload a Game (via Admin Panel)

1. Login at `/admin/login`
2. Go to "Upload Game" tab
3. Fill in:
   - **Title**: Game name
   - **Description**: Detailed game description
   - **Banner**: Main game image (recommended: 1920x400px)
   - **Screenshots**: Additional images (optional, max 10)
   - **Min Requirements**: Minimum system specs
   - **Recommended Requirements**: Optimal system specs
   - **Download Link**: External link (Google Drive, Mega, etc.)
4. Click "Upload Game"

### View All Games

```sql
-- List all games
SELECT 
  id,
  title,
  created_at,
  download_link,
  CASE 
    WHEN banner_url IS NOT NULL THEN 'Yes'
    ELSE 'No'
  END as has_banner
FROM public.games
ORDER BY created_at DESC;
```

### Delete a Game

```sql
-- Delete a specific game
DELETE FROM public.games 
WHERE id = 'GAME_ID_HERE';

-- Or by title
DELETE FROM public.games 
WHERE title = 'Game Title Here';
```

### Update Game Information

```sql
-- Update game details
UPDATE public.games
SET 
  title = 'New Title',
  description = 'New description',
  download_link = 'https://new-link.com'
WHERE id = 'GAME_ID_HERE';
```

### Count Total Games

```sql
-- See how many games are uploaded
SELECT COUNT(*) as total_games 
FROM public.games;
```

## Traffic Statistics

### View Traffic Stats (via Admin Panel)

1. Login at `/admin/login`
2. Go to "Traffic Stats" tab
3. See:
   - Daily page views
   - Weekly traffic trends

### View Traffic Data (SQL)

```sql
-- Last 7 days traffic
SELECT 
  visit_date,
  page_views
FROM public.traffic_logs
WHERE visit_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY visit_date DESC;

-- Total all-time views
SELECT SUM(page_views) as total_views
FROM public.traffic_logs;

-- Average daily views
SELECT AVG(page_views)::INTEGER as avg_daily_views
FROM public.traffic_logs;
```

### Reset Traffic Data

```sql
-- Clear all traffic logs (use with caution!)
DELETE FROM public.traffic_logs;
```

## Storage Management

### View Storage Usage

```sql
-- See total storage used
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  pg_size_pretty(SUM(metadata->>'size')::bigint) as total_size
FROM storage.objects
WHERE bucket_id = 'game-assets'
GROUP BY bucket_id;
```

### List All Uploaded Images

```sql
-- See all images in storage
SELECT 
  name,
  created_at,
  pg_size_pretty((metadata->>'size')::bigint) as file_size
FROM storage.objects
WHERE bucket_id = 'game-assets'
ORDER BY created_at DESC
LIMIT 50;
```

### Delete Unused Images

```sql
-- Find images not used by any game
SELECT name
FROM storage.objects
WHERE bucket_id = 'game-assets'
AND name NOT IN (
  SELECT UNNEST(screenshots) FROM games
  UNION
  SELECT banner_url FROM games
);

-- Then delete them manually in Supabase Storage dashboard
```

## Database Maintenance

### Check Database Health

```sql
-- Verify all tables exist
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Backup Database

1. Go to Supabase Dashboard
2. Project Settings > Database
3. Click "Download Backup"
4. Save the file securely

### View Recent Activity

```sql
-- Recently uploaded games
SELECT title, created_at
FROM public.games
ORDER BY created_at DESC
LIMIT 10;

-- Recent traffic
SELECT visit_date, page_views
FROM public.traffic_logs
ORDER BY visit_date DESC
LIMIT 7;
```

## Troubleshooting

### Can't Login to Admin Panel

**Check if admin user exists:**
```sql
SELECT u.email, ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'your-email@example.com';
```

**If no role found, add it:**
```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'your-email@example.com';
```

### Game Upload Fails

**Check storage bucket exists:**
```sql
SELECT id, name, public
FROM storage.buckets
WHERE id = 'game-assets';
```

**If not found, create it:**
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('game-assets', 'game-assets', true);
```

### Images Not Showing

**Check image URLs:**
```sql
SELECT title, banner_url
FROM public.games
WHERE banner_url IS NOT NULL
LIMIT 5;
```

URLs should start with `https://` and be accessible.

### Search Not Working

**Rebuild search index (if needed):**
```sql
-- Games are automatically searchable by title and description
-- Test search
SELECT title
FROM public.games
WHERE title ILIKE '%search term%'
OR description ILIKE '%search term%';
```

## Best Practices

### Image Guidelines
- **Banner**: 1920x400px, JPEG/PNG, max 2MB
- **Screenshots**: 1280x720px, JPEG/PNG, max 1MB each
- Compress images before uploading (use TinyPNG.com)

### Game Upload Guidelines
1. **Title**: Clear and accurate
2. **Description**: Detailed, engaging, with keywords
3. **Requirements**: Accurate system specs
4. **Download Link**: Test before publishing
5. **Images**: High quality, relevant

### Security Best Practices
1. Use strong admin passwords (12+ chars)
2. Don't share admin credentials
3. Regularly backup database
4. Monitor traffic logs for unusual activity
5. Keep dependencies updated

### Performance Tips
1. Compress images before upload
2. Use CDN for large files (optional)
3. Regularly clean unused storage
4. Monitor database size
5. Test site speed regularly

## Quick Commands Reference

### Development
```bash
npm run dev          # Start local server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Database
```bash
# Access Supabase SQL Editor
https://supabase.com/dashboard/project/gpgjeobsitmmuqprjscz/sql
```

### Admin URLs
```bash
# Local
http://localhost:5173/admin/login

# Production
https://yourdomain.com/admin/login
```

## Monthly Maintenance Checklist

- [ ] Check traffic stats
- [ ] Review uploaded games
- [ ] Clear unused images
- [ ] Backup database
- [ ] Test admin login
- [ ] Test game upload
- [ ] Check site performance
- [ ] Update dependencies (if needed)

## Support Resources

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Documentation**: See INSTALL_GUIDE.md, SETUP_GUIDE.md
- **SQL Scripts**: create_admin_user.sql, verify_setup.sql
- **Support**: Check Supabase logs for errors

---

**Pro Tip**: Bookmark this page for quick reference to common admin tasks!
