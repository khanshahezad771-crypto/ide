# 📦 Complete Installation Guide

## Prerequisites Installation

### Step 1: Install Node.js

1. **Download Node.js**
   - Visit: https://nodejs.org/
   - Download the LTS (Long Term Support) version
   - Recommended: v18 or v20

2. **Install Node.js**
   - Run the downloaded installer
   - Follow the installation wizard
   - ✅ Check "Automatically install necessary tools"
   - Complete the installation

3. **Verify Installation**
   - Open a NEW Command Prompt or PowerShell window
   - Run these commands:
   ```bash
   node --version
   # Should show: v18.x.x or v20.x.x
   
   npm --version
   # Should show: 9.x.x or 10.x.x
   ```

   If you see version numbers, Node.js is installed correctly! ✅

### Step 2: Install Project Dependencies

```bash
# Navigate to your project folder
cd "d:\New folder\zinda-game-vault-main"

# Install all dependencies (this may take 2-5 minutes)
npm install
```

Wait for the installation to complete. You should see a progress bar and no errors.

## Project Setup

### Step 3: Configure Supabase

Your `.env` file is already configured, but verify it contains:

```env
VITE_SUPABASE_PROJECT_ID="gpgjeobsitmmuqprjscz"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://gpgjeobsitmmuqprjscz.supabase.co"
```

### Step 4: Setup Database

1. **Go to Supabase**
   - Visit: https://supabase.com/dashboard
   - Login or create free account
   - Open your project: `gpgjeobsitmmuqprjscz`

2. **Run Database Migration**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"
   - Open file: `supabase/migrations/20251023165308_805b371a-c6cd-4190-abce-1da7c2999e92.sql`
   - Copy ALL the content
   - Paste into Supabase SQL Editor
   - Click "Run" button
   - Wait for "Success" message

3. **Create Admin User**
   - In SQL Editor, click "New Query"
   - Open file: `create_admin_user.sql`
   - **IMPORTANT**: Edit these lines:
     ```sql
     'admin@zindagames.com', -- Change to your email
     crypt('Admin123!', gen_salt('bf')), -- Change to your password
     ```
   - Click "Run"
   - You should see: "Admin user created successfully"

4. **Verify Setup**
   - In SQL Editor, click "New Query"
   - Open file: `verify_setup.sql`
   - Paste and run
   - All checks should show ✅ PASS

5. **(Optional) Add Sample Games**
   - In SQL Editor, click "New Query"
   - Open file: `sample_games.sql`
   - Run to add 5 sample games
   - These help you test the site

## Running the Project

### Step 5: Start Development Server

```bash
# Make sure you're in the project directory
cd "d:\New folder\zinda-game-vault-main"

# Start the development server
npm run dev
```

You should see:

```
VITE v5.4.19  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Step 6: Test the Application

1. **Open Browser**
   - Visit: http://localhost:5173
   - You should see the Zinda Games homepage

2. **Test Public Features**
   - ✅ Homepage loads
   - ✅ Search bar works
   - ✅ Games display (if you added sample games)
   - ✅ Click on a game to see details

3. **Test Admin Panel**
   - Visit: http://localhost:5173/admin/login
   - Enter your admin email and password
   - ✅ Login successful
   - ✅ Dashboard loads
   - ✅ Can see "Upload Game" and "Traffic Stats" tabs

4. **Test Game Upload**
   - Go to "Upload Game" tab
   - Fill in game details
   - Upload banner image and screenshots
   - Add system requirements
   - Provide download link
   - Click "Upload Game"
   - ✅ Success message appears
   - ✅ Go to homepage and see your game

## Building for Production

### Step 7: Create Production Build

```bash
# Build the project
npm run build
```

This creates a `dist` folder with all optimized files ready for deployment.

### Step 8: Preview Production Build (Optional)

```bash
# Preview what users will see
npm run preview
```

Visit: http://localhost:4173

## Troubleshooting

### Node.js Not Found

**Error**: `'node' is not recognized` or `'npm' is not recognized`

**Solution**:
1. Close ALL Command Prompt/PowerShell windows
2. Restart your computer
3. Open a NEW terminal
4. Try again

If still not working:
- Reinstall Node.js
- Choose "Add to PATH" during installation

### Installation Errors

**Error**: `npm ERR! code ENOENT` or dependency errors

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Port Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:
- Close other programs using port 5173
- Or use a different port:
  ```bash
  npm run dev -- --port 3000
  ```

### Supabase Connection Error

**Error**: `Failed to fetch` or `Network error`

**Solution**:
1. Check `.env` file has correct values
2. Verify internet connection
3. Check Supabase dashboard is accessible
4. Verify project ID matches

### Admin Login Fails

**Error**: `Invalid credentials` or `Unauthorized`

**Solution**:
1. Run `verify_setup.sql` in Supabase
2. Check admin user exists:
   ```sql
   SELECT * FROM auth.users WHERE email = 'your-email@example.com';
   SELECT * FROM user_roles WHERE role = 'admin';
   ```
3. Re-run `create_admin_user.sql` if needed

### Images Won't Upload

**Error**: Upload fails or images don't show

**Solution**:
1. Check Supabase Storage dashboard
2. Verify `game-assets` bucket exists
3. Ensure bucket is public
4. Check storage policies:
   ```sql
   SELECT * FROM pg_policies 
   WHERE schemaname = 'storage' 
   AND tablename = 'objects';
   ```

## Next Steps

Once everything works locally:

1. ✅ Test all features thoroughly
2. ✅ Upload real game content
3. ✅ Review [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
4. ✅ Build for production: `npm run build`
5. ✅ Deploy to Hostinger

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Check code quality

# Testing
npm run dev              # Test locally
npm run build:dev        # Build with dev settings

# Cleaning
npm cache clean --force  # Clear npm cache
rm -rf node_modules      # Remove dependencies
npm install              # Reinstall dependencies
```

## File Structure Check

Ensure these files exist:

```
✅ .env (with Supabase credentials)
✅ package.json
✅ vite.config.ts
✅ src/main.tsx
✅ src/App.tsx
✅ supabase/migrations/ (SQL files)
✅ .htaccess (for deployment)
```

## Environment Variables

Your `.env` should have exactly these variables:

```env
VITE_SUPABASE_PROJECT_ID=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_URL=...
```

Note: All variables must start with `VITE_` to be accessible in React!

## Getting Help

1. Check error messages in terminal
2. Check browser console (F12)
3. Review Supabase logs
4. Check this guide again
5. Verify all prerequisites are installed

## Success Checklist

Before proceeding to deployment:

- [ ] Node.js installed (v18+)
- [ ] npm installed (v9+)
- [ ] Dependencies installed (`npm install`)
- [ ] Supabase database setup
- [ ] Admin user created
- [ ] Setup verified (all ✅ PASS)
- [ ] Development server runs
- [ ] Can access homepage
- [ ] Can login to admin panel
- [ ] Can upload games
- [ ] Games appear on homepage
- [ ] Production build works

Once all checked, you're ready for deployment! 🚀

---

## Quick Reference

**Start Development**: `npm run dev`
**Build Production**: `npm run build`
**Admin Panel**: http://localhost:5173/admin/login
**Homepage**: http://localhost:5173

Happy coding! 🎮✨
