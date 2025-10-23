# 🚀 Deployment Checklist for Zinda Games

## Pre-Deployment (Do these first!)

### 1. ✅ Install Dependencies
```bash
npm install
```

### 2. ✅ Setup Supabase Database

#### A. Run Database Migration
1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Open file: `supabase/migrations/20251023165308_805b371a-c6cd-4190-abce-1da7c2999e92.sql`
5. Copy all content and paste into SQL Editor
6. Click "Run"
7. Wait for success message

#### B. Verify Database Setup
1. Open `verify_setup.sql` in SQL Editor
2. Run it
3. Check that all items show ✅ PASS
4. If any show ❌ FAIL, re-run the migration

#### C. Create Admin User
1. Open `create_admin_user.sql`
2. **IMPORTANT**: Edit these lines:
   ```sql
   'admin@zindagames.com', -- CHANGE THIS EMAIL
   crypt('Admin123!', gen_salt('bf')), -- CHANGE THIS PASSWORD
   ```
3. Use a strong password (min 12 characters)
4. Run the SQL script
5. Verify admin user exists (script shows confirmation)

### 3. ✅ Verify Environment Variables

Check `.env` file contains:
```env
VITE_SUPABASE_PROJECT_ID="gpgjeobsitmmuqprjscz"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://gpgjeobsitmmuqprjscz.supabase.co"
```

### 4. ✅ Test Locally

```bash
npm run dev
```

Visit: http://localhost:5173

Test these:
- [ ] Homepage loads
- [ ] Search works
- [ ] Can access admin login: http://localhost:5173/admin/login
- [ ] Can login with admin credentials
- [ ] Can upload a test game
- [ ] Test game appears on homepage
- [ ] Can view game details
- [ ] Download button works

### 5. ✅ Build for Production

```bash
npm run build
```

This creates a `dist` folder.

## Deployment to Hostinger

### Option A: Manual Upload (Easier)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Access Hostinger**
   - Login to Hostinger control panel
   - Go to File Manager

3. **Upload Files**
   - Navigate to `public_html` (or your domain's directory)
   - Delete any existing files (if starting fresh)
   - Upload ALL files from `dist` folder
   - Upload `.htaccess` file from project root

4. **Set Permissions**
   - Right-click `.htaccess`
   - Set permissions to 644

5. **Test Your Site**
   - Visit your domain
   - Check all pages work
   - Test admin login

### Option B: Git Deployment (Advanced)

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Connect to Hostinger Git**
   - In Hostinger control panel, go to Git
   - Create new repository
   - Follow instructions to push code

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Deploy**
   - Push to master/main branch
   - Hostinger will auto-build and deploy

## Post-Deployment Verification

### ✅ Homepage Tests
- [ ] Homepage loads correctly
- [ ] Logo and branding visible
- [ ] Hero banner displays
- [ ] Games grid shows (if you uploaded games)
- [ ] Search functionality works
- [ ] Pagination works
- [ ] Mobile responsive (test on phone)

### ✅ Admin Panel Tests
- [ ] Can access `/admin/login`
- [ ] Can login with admin credentials
- [ ] Dashboard loads
- [ ] Traffic stats show
- [ ] Can upload game with:
  - [ ] Title and description
  - [ ] Banner image
  - [ ] Screenshots
  - [ ] System requirements
  - [ ] Download link
- [ ] Uploaded game appears on homepage
- [ ] Can logout

### ✅ Game Detail Tests
- [ ] Can click on game card
- [ ] Game detail page loads
- [ ] Banner image shows
- [ ] Screenshots display
- [ ] System requirements visible
- [ ] Download button works
- [ ] Opens download link in new tab

### ✅ SEO & Performance
- [ ] Page titles are correct
- [ ] Meta descriptions present
- [ ] Images load quickly
- [ ] Site loads in under 3 seconds
- [ ] Mobile friendly (test on Google Mobile-Friendly Test)

## Common Issues & Solutions

### Issue: 404 on page refresh
**Solution**: 
- Ensure `.htaccess` file is uploaded
- Verify Apache mod_rewrite is enabled
- Contact Hostinger support to enable it

### Issue: Admin can't login
**Solution**:
- Check Supabase SQL Editor
- Run: `SELECT * FROM auth.users WHERE email = 'your-email@example.com'`
- Run: `SELECT * FROM user_roles WHERE role = 'admin'`
- Verify user exists in both tables
- Re-run `create_admin_user.sql` if needed

### Issue: Images won't upload
**Solution**:
- Check Supabase Storage dashboard
- Verify `game-assets` bucket exists
- Check bucket is public
- Verify RLS policies (run `verify_setup.sql`)

### Issue: Games not showing
**Solution**:
- Check Supabase Table Editor > games table
- Verify games exist
- Check browser console for errors
- Verify Supabase URL and API key in `.env`

### Issue: Blank white screen
**Solution**:
- Check browser console (F12)
- Verify all environment variables are correct
- Rebuild project: `npm run build`
- Clear browser cache

## Security Checklist

- [ ] Changed default admin password to strong password (12+ chars)
- [ ] `.env` file is NOT in git repository (check `.gitignore`)
- [ ] Supabase RLS policies are enabled
- [ ] Admin credentials are saved securely
- [ ] Regular backups scheduled (Supabase auto-backups)

## Performance Optimization

- [ ] Images compressed (use TinyPNG before uploading)
- [ ] Gzip compression enabled (via `.htaccess`)
- [ ] Browser caching enabled (via `.htaccess`)
- [ ] CDN setup (optional, for faster global loading)

## Monitoring

### Track These Metrics:
1. **Traffic Stats** (in Admin Dashboard)
   - Daily page views
   - Weekly trends

2. **Supabase Dashboard**
   - Database size
   - Storage usage
   - API requests

3. **Hostinger Analytics**
   - Bandwidth usage
   - Visitor statistics

## Maintenance Tasks

### Weekly:
- [ ] Check Supabase logs for errors
- [ ] Review traffic stats
- [ ] Test admin login
- [ ] Test game upload

### Monthly:
- [ ] Backup database (Supabase auto-backups)
- [ ] Review storage usage
- [ ] Update dependencies if needed
- [ ] Check for Supabase updates

## Next Steps

1. **Add More Games**
   - Login to admin panel
   - Upload quality game content
   - Use clear descriptions
   - Provide accurate system requirements

2. **Promote Your Site**
   - Share on social media
   - Submit to game directories
   - SEO optimization
   - Create content/blog posts

3. **Monitor Performance**
   - Use Google Analytics (optional)
   - Track popular games
   - Respond to user feedback

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Hostinger Support**: https://www.hostinger.com/tutorials
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com

## Final Checklist

Before going live:
- [ ] All tests passed
- [ ] Admin login works
- [ ] At least 1 test game uploaded
- [ ] Mobile responsive
- [ ] Domain configured correctly
- [ ] SSL certificate active (HTTPS)
- [ ] Backup plan in place
- [ ] Admin credentials saved securely

---

## 🎮 You're Ready to Launch!

Once all checkboxes are complete, your Zinda Games website is ready for the world!

**Admin Panel URL**: `https://yourdomain.com/admin/login`

Remember to keep your admin credentials secure and regularly backup your database.

Good luck with your game downloading website! 🚀
