GamersOnline Supabase Player Insert Patch

Steps:

1) Replace this file in your repo:
apps/web/app/api/auth/steam/callback/route.js

2) Add dependency to:
apps/web/package.json

Add:
"@supabase/supabase-js": "^2.49.1"

3) Add Vercel environment variable:

SUPABASE_SERVICE_ROLE_KEY

(Value = Secret key from Supabase dashboard → API Keys)

Push to GitHub → Vercel auto redeploys

Login again with Steam → check Supabase players table
