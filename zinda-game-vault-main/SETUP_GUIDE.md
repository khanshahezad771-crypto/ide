# Zinda Games - Setup Guide for Hostinger Deployment

## Prerequisites
- Node.js 18+ installed
- Supabase account (https://supabase.com)
- Hostinger hosting account

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/20251023165308_805b371a-c6cd-4190-abce-1da7c2999e92.sql`
4. Verify tables are created:
   - `games`
   - `user_roles`
   - `traffic_logs`
5. Verify storage bucket `game-assets` is created

## Step 3: Create Admin User

Run this SQL in Supabase SQL Editor:

```sql
-- Create admin user (replace with your email and generate a secure password)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@zindagames.com', -- Change this to your email
  crypt('YourSecurePassword123!', gen_salt('bf')), -- Change this password
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the admin user ID (run after above query)
SELECT id, email FROM auth.users WHERE email = 'admin@zindagames.com';

-- Assign admin role (replace 'USER_ID_HERE' with the ID from above query)
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'admin');
```

## Step 4: Environment Variables

Your `.env` file is already configured with:
```
VITE_SUPABASE_PROJECT_ID="gpgjeobsitmmuqprjscz"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://gpgjeobsitmmuqprjscz.supabase.co"
```

Make sure these match your Supabase project settings.

## Step 5: Build for Production

```bash
npm run build
```

This creates a `dist` folder with production-ready files.

## Step 6: Deploy to Hostinger

### Option A: File Manager Upload
1. Login to Hostinger control panel
2. Navigate to File Manager
3. Go to `public_html` directory (or your domain's root directory)
4. Upload all files from the `dist` folder
5. Create a `.htaccess` file in the root with the following content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
</IfModule>
```

### Option B: Git Deployment (Recommended)
1. Initialize git repository in your project
2. Connect to Hostinger's Git deployment feature
3. Push your code and it will auto-build and deploy

## Step 7: Access Admin Panel

1. Navigate to `https://yourdomain.com/admin/login`
2. Login with the admin credentials you created in Step 3
3. You can now upload games!

## Step 8: Upload Your First Game

1. Login to admin dashboard
2. Go to "Upload Game" tab
3. Fill in:
   - Game Title
   - Description
   - Upload banner image
   - Upload screenshots (optional)
   - Minimum system requirements
   - Recommended system requirements
   - Download link (external link like Google Drive, Mega, etc.)
4. Click "Upload Game"

## Troubleshooting

### Issue: Can't access admin panel
- Check Supabase SQL Editor and verify admin user exists in `user_roles` table
- Verify your email is confirmed in `auth.users` table

### Issue: Games not showing on homepage
- Check Supabase dashboard > Table Editor > games table
- Verify RLS policies are enabled (they should be by default)

### Issue: Can't upload images
- Check Supabase Storage > game-assets bucket exists
- Verify bucket is set to public
- Check RLS policies for storage

### Issue: 404 errors on page refresh
- Make sure `.htaccess` file is properly configured
- Verify mod_rewrite is enabled on your hosting

## Testing Locally

```bash
npm run dev
```

Visit: http://localhost:5173

Admin panel: http://localhost:5173/admin/login

## Security Notes

1. **Change default admin credentials** immediately after first login
2. Use strong passwords (min 12 characters with numbers, symbols, uppercase, lowercase)
3. Keep your `.env` file secure and never commit it to public repositories
4. Regularly backup your Supabase database
5. Monitor admin access logs in Supabase dashboard

## Support

For issues, check:
- Supabase logs: Dashboard > Logs
- Browser console for client-side errors
- Network tab to see failed API requests

## Features

✅ Public game browsing (no login required)
✅ Search functionality
✅ Pagination
✅ Admin panel for game uploads
✅ Traffic tracking
✅ Responsive design (works on all devices)
✅ SEO optimized
✅ Fast performance with Vite

## Admin Features

- Upload unlimited games
- Add banner images and screenshots
- Set system requirements
- Track daily and weekly traffic
- Manage all games from one dashboard

Enjoy your game downloading website! 🎮
