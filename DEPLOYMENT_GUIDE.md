# Quick Deployment Guide & Known Issues

## ⚠️ Pre-Deployment Steps Required

### 1. Run Database Migration

**IMPORTANT:** Must be done BEFORE deploying the frontend code.

```bash
cd supabase
supabase migration up
```

This creates the new tables:
- `adoption_events`
- `contact_activities`
- `user_feedback`

### 2. Update Supabase Types

After running the migration, regenerate TypeScript types:

```bash
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

This will fix all TypeScript errors related to the new tables.

### 3. Update Contacts Table Schema

The `contacts` table needs these additional columns (if not present):

```sql
-- Add missing columns to contacts table
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'new_lead';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS next_followup_date TIMESTAMPTZ;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_contacts_next_followup ON contacts(next_followup_date);
CREATE INDEX IF NOT EXISTS idx_contacts_stage ON contacts(stage);
```

Run this SQL in Supabase SQL Editor or create a new migration file.

### 4. Deploy Edge Function

```bash
# Set OpenAI API key (if not already set)
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here

# Deploy the function
supabase functions deploy generate-call-summary
```

### 5. Frontend Build & Deploy

```bash
npm install
npm run build
netlify deploy --prod
```

---

## 🐛 Known Issues & Workarounds

### Issue 1: TypeScript Errors on New Tables

**Symptom:** Errors like "Property 'adoption_events' does not exist"

**Fix:** After running migration, regenerate types:
```bash
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Issue 2: Missing Contact Fields

**Symptom:** Errors about `stage`, `notes`, `next_followup_date` missing

**Fix:** Run the ALTER TABLE commands above to add these fields.

### Issue 3: Deno Type Errors in Edge Function

**Symptom:** Red squiggles in `generate-call-summary/index.ts`

**Status:** These are IDE-only errors. The function will work when deployed.

**Why:** Edge functions use Deno runtime, which isn't recognized by the TypeScript compiler in the main project.

**Workaround:** Ignore these errors or add a `// @ts-nocheck` at the top of the file.

---

## 📝 Deployment Checklist

### Pre-Deployment:
- [ ] Run database migration
- [ ] Regenerate Supabase types
- [ ] Add missing columns to contacts table
- [ ] Set OPENAI_API_KEY secret
- [ ] Deploy edge function
- [ ] Test edge function with curl

### Deployment:
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors in frontend
- [ ] Deploy to staging first
- [ ] Test Today page loads
- [ ] Test Call Workflow with sample contact
- [ ] Test AI summary generation
- [ ] Test feedback submission
- [ ] Deploy to production

### Post-Deployment Verification:
- [ ] Login redirects to /today (not /dashboard)
- [ ] "Make Today's Calls" button works
- [ ] Call Workflow loads contact data
- [ ] Can save call notes and outcomes
- [ ] "Save & Next Contact" advances queue
- [ ] AI summary generates successfully
- [ ] Feedback widgets appear
- [ ] Navigation shows "Today" as first item
- [ ] "Start Call Session" button works from Contacts

---

## 🧪 Testing Edge Function Locally

Before deploying, test the edge function:

```bash
# Start local Supabase
supabase start

# Invoke function locally
supabase functions serve generate-call-summary --env-file .env.local

# Test with curl (in another terminal)
curl -i --location --request POST 'http://localhost:54321/functions/v1/generate-call-summary' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"notes":"Had a great call with John. He is interested in seeing properties in downtown. Budget is around $500k. Will follow up next week.","contactName":"John Smith","currentStage":"hot_lead"}'
```

Expected response:
```json
{
  "summary": [
    "John expressed interest in downtown properties",
    "Budget range: $500,000",
    "Scheduled follow-up for next week"
  ],
  "intent": "ready to see properties",
  "tone": "positive",
  "suggestedAction": "Send downtown listing recommendations within 24 hours + schedule showings for next week"
}
```

---

## 🔧 Quick Fixes for Common Errors

### Error: "Cannot query table adoption_events"

**Cause:** Migration not run yet

**Fix:**
```bash
supabase migration up
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Error: "Property 'stage' does not exist on type Contact"

**Cause:** Database schema out of sync

**Fix:** Run the ALTER TABLE commands from step 3 above

### Error: "OpenAI API returned 401"

**Cause:** API key not set or invalid

**Fix:**
```bash
supabase secrets set OPENAI_API_KEY=sk-...your-key
supabase functions deploy generate-call-summary
```

### Error: "Cannot read properties of null (reading 'first_name')"

**Cause:** Contact doesn't exist or wasn't loaded

**Fix:** Ensure contacts have required fields (first_name, last_name, phone)

---

## 🚀 Fast Track Deployment (If Database Already Migrated)

If you've already run migrations and just need to deploy code:

```bash
# 1. Regenerate types (just in case)
supabase gen types typescript --local > src/integrations/supabase/types.ts

# 2. Build frontend
npm run build

# 3. Deploy
netlify deploy --prod

# 4. Deploy edge function (if changed)
supabase functions deploy generate-call-summary
```

---

## 📊 Post-Deployment Monitoring

### Check Adoption Events:
```sql
SELECT 
  event_type, 
  COUNT(*) as count,
  DATE(created_at) as date
FROM adoption_events
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY event_type, DATE(created_at)
ORDER BY date DESC, count DESC;
```

### Check User Feedback:
```sql
SELECT 
  feedback_type,
  was_helpful,
  COUNT(*) as count
FROM user_feedback
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY feedback_type, was_helpful;
```

### Check Edge Function Logs:
```bash
supabase functions logs generate-call-summary --tail
```

---

## 💡 Beta Tester Onboarding

Send to beta testers:

**Subject:** Welcome to RealtorDesk AI Beta - Your New Daily Command Center

**Body:**
Hi [Name],

Welcome to the RealtorDesk AI beta! We've completely rebuilt the app to help you answer one question every morning: "Who do I talk to now?"

**Quick Start:**
1. Log in at [your-app-url]
2. You'll land on your "Today" screen
3. Click "Make Today's Calls"
4. Complete your first call using the guided workflow
5. Try the AI Call Summary feature (optional)

**We Need Your Feedback:**
- Click "Give Feedback" in the top menu anytime
- After each call session, you'll see "Was this helpful?"
- Be brutally honest - we want to know what works and what doesn't

**What to Test:**
- Use the Today screen as your daily starting point
- Complete at least 5-10 calls using the Call Workflow
- Try the AI call summaries
- Let us know: Does this save you time vs. your old CRM?

Questions? Hit reply.

Let's build something you'll actually use every day.

Cheers,
[Your Name]

---

## 🎯 Success Metrics to Track Post-Launch

### Week 1:
- % of users who click "Make Today's Calls" on first login
- Average time from login to first call logged
- % of users who complete 5+ calls in first session

### Week 2:
- Daily active users (returning to Today screen)
- Average calls logged per user per day
- % of calls with AI summary generated

### Week 3:
- Retention rate (users still logging in daily)
- Feedback sentiment (thumbs up vs. down)
- Feature requests from feedback
- Average contacts processed per session

---

## 🔒 Security Checklist

- [ ] RLS policies enabled on all new tables
- [ ] Edge function validates user authentication
- [ ] OpenAI API key stored as secret (not in code)
- [ ] User feedback sanitized before storage
- [ ] Adoption events only accessible by user_id

---

## 📞 Support & Troubleshooting

If you encounter issues:

1. **Check Supabase Logs:**
   - Go to Supabase Dashboard > Logs
   - Filter by time of error
   - Look for SQL errors or auth issues

2. **Check Browser Console:**
   - F12 > Console tab
   - Look for red errors
   - Share screenshot if asking for help

3. **Check Edge Function Logs:**
   ```bash
   supabase functions logs generate-call-summary
   ```

4. **Rollback if Needed:**
   - Keep old version accessible
   - Revert DNS to old version
   - Fix issues before re-deploying

---

## ✅ Everything Works When You See:

- [ ] Login → lands on Today screen
- [ ] "Make Today's Calls" → opens Call Workflow
- [ ] Can click phone numbers to dial
- [ ] Can save call notes and outcomes
- [ ] "Save & Next Contact" loads next person
- [ ] AI summary button appears and works
- [ ] Feedback widgets appear and submit
- [ ] Navigation shows "Today" first
- [ ] No console errors
- [ ] Page loads in < 2 seconds

If all above work: **You're live! 🎉**

---

## 🎉 Celebrating Launch

Once deployed successfully:

1. **Send Launch Email to Beta Testers**
2. **Post in Team Slack/Discord**
3. **Update Status Page** (if you have one)
4. **Monitor Analytics Dashboard**
5. **Schedule Daily Check-ins** for first week
6. **Collect Feedback Actively**
7. **Iterate Based on Real Usage**

Remember: This is V1. The goal is to learn from real Realtors using it daily.

Ship it, learn from it, improve it. 🚀
