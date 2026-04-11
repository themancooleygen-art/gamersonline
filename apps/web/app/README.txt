GamersOnline Ranked Queue Patch

What this adds:
- Queue join API route
- Ranked Queue page with Join Queue button
- SQL file to create the queue_entries table in Supabase

Before using:
1. Run the SQL in supabase_queue_entries.sql inside Supabase SQL Editor
2. Upload/replace these files in your GitHub repo
3. Commit changes and let Vercel redeploy

This patch expects these env vars to already exist in Vercel:
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- NEXTAUTH_SECRET
