-- ADMIN USER SETUP SCRIPT
-- Run this in Supabase SQL Editor to create your admin account

-- Step 1: Create the admin user
-- IMPORTANT: Replace 'your-email@example.com' and 'YourSecurePassword123!' with your actual credentials

DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create the user in auth.users
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
    'admin@zindagames.com', -- CHANGE THIS EMAIL
    crypt('Admin123!', gen_salt('bf')), -- CHANGE THIS PASSWORD
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
  )
  RETURNING id INTO new_user_id;

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin');

  -- Output success message
  RAISE NOTICE 'Admin user created successfully with ID: %', new_user_id;
END $$;

-- Step 2: Verify the admin user was created
SELECT 
  u.id,
  u.email,
  u.created_at,
  ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@zindagames.com'; -- Use the same email as above

-- If you see a row with role 'admin', you're all set!
-- If not, check for errors in the SQL output above.

-- Step 3: (Optional) Create additional admin users
-- Copy the INSERT statements above and change the email/password

-- Step 4: (Optional) Remove admin access from a user
-- DELETE FROM public.user_roles WHERE user_id = 'USER_ID_HERE' AND role = 'admin';

-- Step 5: (Optional) Delete a user completely
-- DELETE FROM auth.users WHERE email = 'email@example.com';
