# Doctor Testing Guide

Complete end-to-end testing guide to create a doctor account and verify it.

## Quick Setup (5 minutes)

### 1. Create Your Test Doctor Account (Frontend)

1. Start dev server:

```powershell
npm run dev
```

2. Visit http://localhost:3000
3. Click **"Sign Up Now"** button
4. Complete the Clerk sign-up form (use a test email like `doctor@test.com`)
5. After sign-up, you'll land on `/onboarding`

### 2. Fill Doctor Profile

On the onboarding page, select **"Doctor"** role and fill in:

- **Specialty**: `Cardiologist`
- **Years of Experience**: `10`
- **Link to Credential Document**: Copy one of these working URLs:
  ```
  https://www.w3.org/WAI/test-evaluate/sample-documents/act-rules-documents.html
  https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg
  https://via.placeholder.com/500x700/2563eb/ffffff?text=Medical+License
  ```
- **Service Description**: `I specialize in cardiac care and preventive cardiology with 10+ years of experience in hospital and private practice settings.`

Click **"Submit"** → You'll see "Waiting for verification" message.

Your doctor account is now `PENDING` verification.

---

### 3. Promote Your Account to Admin (Database)

You need admin access to verify yourself. Open Prisma Studio:

```powershell
npx prisma studio
```

This opens an interactive browser UI to your database.

**Steps:**

1. Click on **"User"** table
2. Find your test doctor account (search by email: `doctor@test.com`)
3. Click the row to edit
4. Change `role` from `DOCTOR` to `ADMIN`
5. Change `verificationStatus` to `VERIFIED` (optional, but speeds up testing)
6. Click **"Save"** (usually an auto-save field)

Close Prisma Studio.

---

### 4. Access Admin Dashboard & Verify Yourself

1. Go to http://localhost:3000/admin
2. You should now see the **Admin Dashboard**
3. Click on **"Pending Doctors"** section
4. You'll see your doctor profile in the pending list
5. Click **"View Details"**
6. Review your credentials (click the URL you provided earlier)
7. Click **"Approve"** button

Your doctor account is now `VERIFIED`!

---

### 5. Test Doctor Dashboard

1. Go to http://localhost:3000/doctor
2. You should see your **Doctor Dashboard** with:
   - View your profile
   - Set availability slots
   - View upcoming appointments
3. Go to **Availability Settings** and add time slots (e.g., 9 AM - 5 PM)

---

## Complete SQL Alternative (Without Prisma Studio)

If you prefer direct database commands, use this SQL to promote your account after signing up:

```sql
-- Replace 'user_xxxxx' with your actual Clerk user ID from the database
UPDATE "User"
SET
  role = 'ADMIN',
  verificationStatus = 'VERIFIED'
WHERE email = 'doctor@test.com';
```

To find your Clerk user ID, query:

```sql
SELECT id, "clerkUserId", email, role FROM "User" WHERE email = 'doctor@test.com';
```

---

## Test Credential URLs (All Working)

Use any of these as dummy credentials during signup:

1. **Placeholder Image (Recommended for quick testing)**

   ```
   https://via.placeholder.com/500x700/2563eb/ffffff?text=Medical+License+Verified
   ```

2. **Real PDF Sample**

   ```
   https://www.w3.org/WAI/test-evaluate/sample-documents/act-rules-documents.html
   ```

3. **Wikipedia Image**

   ```
   https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Sphynx03.jpg/1200px-Sphynx03.jpg
   ```

4. **Local file (if you have one)**
   ```
   Upload to /public folder and reference: /my-credentials.pdf
   ```

---

## Workflow Summary

```
Sign Up → Fill Doctor Profile → Promote to Admin → Access /admin → Approve Self → Access /doctor Dashboard
```

---

## Troubleshooting

### "Page not found" on /admin

- Make sure you promoted your account to `ADMIN` role in the database
- Restart dev server after database changes

### "Pending Doctors" is empty

- Make sure your account is still `PENDING` verification (not `VERIFIED` yet)
- Or check the database that `verificationStatus` is not already `VERIFIED`

### Credential link returns 404

- The URL you provided might be dead
- Use one of the provided working URLs above

### Can't see doctor dashboard on /doctor

- Make sure your doctor account `role` is `DOCTOR` (not `ADMIN`)
- Or set it to both roles (not a standard setup, but useful for testing)

---

## Next Steps

Once verified:

1. Create a patient test account on a different browser/incognito
2. Search for yourself in `/doctors`
3. Book an appointment
4. Test video call feature
5. Test payment/credits system

Enjoy testing! 🚀
