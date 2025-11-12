-- Doctor Testing: Quick Setup SQL Script
-- Use this with your database client (psql, DBeaver, etc.)
-- Replace 'doctor@test.com' with your actual test email

-- Step 1: Find your test user (run this first to get the ID)
SELECT id, "clerkUserId", email, role, "verificationStatus" 
FROM "User" 
WHERE email = 'doctor@test.com';

-- Step 2: Promote to Admin and Verify Doctor (run after confirming the user exists)
UPDATE "User" 
SET 
  role = 'ADMIN',
  "verificationStatus" = 'VERIFIED'
WHERE email = 'doctor@test.com';

-- Step 3: Verify the update worked
SELECT id, "clerkUserId", email, role, "verificationStatus" 
FROM "User" 
WHERE email = 'doctor@test.com';

-- OPTIONAL: Create multiple test doctors at once
-- (run these individually after each doctor signup)

-- Doctor 2: Neurologist
UPDATE "User" 
SET 
  role = 'DOCTOR',
  specialty = 'Neurologist',
  experience = 8,
  "credentialUrl" = 'https://via.placeholder.com/500x700/2563eb/ffffff?text=Neuro+License',
  description = 'Specialized in neurological disorders and brain health',
  "verificationStatus" = 'VERIFIED'
WHERE email = 'neuro@test.com';

-- Doctor 3: Dentist
UPDATE "User" 
SET 
  role = 'DOCTOR',
  specialty = 'Dentist',
  experience = 12,
  "credentialUrl" = 'https://via.placeholder.com/500x700/059669/ffffff?text=Dental+License',
  description = 'Comprehensive dental care and cosmetic dentistry',
  "verificationStatus" = 'VERIFIED'
WHERE email = 'dental@test.com';
