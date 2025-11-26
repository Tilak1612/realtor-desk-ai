# Realtor Desk AI - Complete Technical Documentation

## 1. Project Overview

**Project Name:** Realtor Desk AI  
**Type:** SaaS Platform for Real Estate Professionals  
**Target Market:** Canadian Real Estate Agents, Teams, and Brokerages  
**Tech Stack:** React + TypeScript + Vite + Supabase + Stripe

### Purpose
An AI-powered CRM platform designed specifically for Canadian real estate professionals to manage contacts, deals, properties, tasks, and leverage AI for lead scoring and automation.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS with shadcn/ui components
- **State Management:** React Context API + TanStack React Query
- **Form Handling:** React Hook Form + Zod validation
- **UI Components:** Radix UI primitives + shadcn/ui
- **Icons:** Lucide React
- **Notifications:** Sonner (toast notifications)

### Backend & Database
- **Backend:** Lovable Cloud (Supabase)
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (Email/Password + OAuth)
- **Storage:** Supabase Storage (2 buckets: avatars, contact-documents)
- **Edge Functions:** Deno-based serverless functions
- **Real-time:** Supabase Realtime capabilities

### Third-Party Integrations
- **Payments:** Stripe (subscriptions & billing)
- **AI:** Anthropic Claude API + Lovable AI
- **CRM Integration:** HubSpot API (optional)
- **Email Automation:** Supabase Edge Functions

### Key Dependencies
```json
{
  "@anthropic-ai/sdk": "^0.65.0",
  "@stripe/stripe-js": "^8.0.0",
  "@supabase/supabase-js": "^2.58.0",
  "@tanstack/react-query": "^5.83.0",
  "react": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "date-fns": "^3.6.0",
  "lucide-react": "^0.462.0",
  "zod": "^3.25.76"
}
```

---

## 3. System Architecture

### Application Structure
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components (buttons, cards, etc.)
│   ├── dashboard/      # Dashboard-specific components
│   ├── contacts/       # Contact management components
│   ├── deals/          # Deal pipeline components
│   ├── tasks/          # Task management components
│   ├── properties/     # Property listing components
│   └── onboarding/     # User onboarding flow
├── pages/              # Route pages
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions & helpers
├── integrations/       # Supabase client & types
└── i18n/               # Internationalization (English/French)

supabase/
├── functions/          # Edge functions (serverless)
├── migrations/         # Database migrations
└── config.toml         # Supabase configuration
```

### Authentication Flow
1. User signs up via `/signup` (email/password or OAuth)
2. Profile created automatically via database trigger
3. User redirected to `/onboarding` (6-step process)
4. After onboarding completion, access to `/dashboard`
5. Session managed via Supabase Auth with localStorage persistence

### Data Flow
```
User Interaction → React Component → Supabase Client → PostgreSQL
                                    ↓
                              Edge Functions (for complex logic/AI)
                                    ↓
                              Third-party APIs (Stripe, Anthropic, etc.)
```

---

## 4. Database Schema

### Core Tables

#### profiles (User Profiles)
- `id` (uuid, PK) - Links to auth.users
- `email`, `full_name`, `phone`, `company_name`
- `subscription_tier` (agent/team/brokerage)
- `subscription_status` (trial/active/cancelled/expired)
- `trial_ends_at` - 60 days from signup
- `onboarding_completed`, `onboarding_step`
- `business_preferences` (jsonb)

#### contacts (CRM Contacts)
- `id` (uuid, PK)
- `user_id` (FK to profiles)
- `first_name`, `last_name`, `email`, `phone`
- `status` (lead/prospect/client)
- `source`, `tags[]`, `metadata` (jsonb)
- `ai_score`, `lead_score`, `best_contact_time`
- `last_contact_date`

#### deals (Sales Pipeline)
- `id` (uuid, PK)
- `user_id`, `contact_id` (FKs)
- `title`, `stage` (lead/viewing/offer/negotiation/closing)
- `value`, `probability`, `status` (active/won/lost)
- `client_type`, `property_type`, `property_address`
- `listing_price`, `commission_percentage`
- `expected_close_date`, `closing_date`

#### tasks (Task Management)
- `id` (uuid, PK)
- `user_id`, `contact_id`, `deal_id` (FKs)
- `title`, `description`, `priority` (low/medium/high/urgent)
- `status` (pending/completed)
- `due_date`, `due_time`, `completed_at`

#### properties (Property Listings)
- `id` (uuid, PK)
- `user_id`, `contact_id`, `deal_id` (FKs)
- `title`, `address`, `city`, `province`, `postal_code`
- `property_type`, `listing_type` (sale/rent)
- `price`, `bedrooms`, `bathrooms`, `square_feet`
- `status` (active/pending/sold/coming_soon/off_market)
- `images[]`, `features[]` (jsonb)

#### activities (Calendar Events)
- `id` (uuid, PK)
- `user_id`, `contact_id`, `deal_id`, `property_id` (FKs)
- `title`, `activity_type`, `description`
- `start_date`, `end_date`, `all_day`, `location`
- `status` (scheduled/completed/cancelled)
- `is_recurring`, `recurrence_rule`

#### ai_lead_scores (AI-Generated Lead Scores)
- `id` (uuid, PK)
- `contact_id` (FK)
- `score` (0-100)
- `factors` (jsonb) - breakdown of scoring factors
- `prediction_confidence`
- `recommended_actions[]`
- `optimal_contact_time`, `insights`

#### email_campaigns (Email Marketing)
- `id` (uuid, PK)
- `user_id` (FK)
- `name`, `subject`, `content`
- `status` (draft/scheduled/active/paused/completed)
- `segment_filters` (jsonb)
- `emails_sent`, `emails_opened`, `emails_clicked`, `emails_bounced`

### Supporting Tables
- `leads` - Lead tracking before conversion to contacts
- `notes` - Notes linked to contacts/deals/properties
- `documents` - File attachments
- `engagement_stats` - Contact engagement metrics
- `automation_workflows` - Marketing automation rules
- `email_templates` - Reusable email templates
- `integrations` - Third-party API credentials
- `demo_requests` - Demo booking submissions
- `contact_submissions` - Contact form submissions

---

## 5. Row-Level Security (RLS)

### Security Model
Every table has RLS enabled with policies ensuring:
- Users can only view/edit their own data (`user_id = auth.uid()`)
- Admins have special access via `is_admin()` function
- Service role has unrestricted access for automations
- Public can submit forms (demo_requests, contact_submissions)

### Example Policies (tasks table)
```sql
-- Users can view own tasks
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert own tasks
CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own tasks
CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete own tasks
CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 6. Features & Functionality

### Dashboard (`/dashboard`)
- Overview stats (leads, deals, revenue, tasks)
- Hot leads widget (AI score ≥ 80)
- Today's tasks with quick completion
- Deals pipeline visualization
- Market intelligence widget

### Contacts (`/contacts`)
- Full CRM with card/table views
- Bulk actions (import, export, delete)
- Advanced filtering (tags, status, lead score)
- Lead scoring (manual + AI-generated)
- Contact detail page with:
  - Activity timeline
  - Deal history
  - Property interests
  - Documents & notes
  - AI insights & recommendations

### Deals (`/deals`)
- Kanban board (5 stages: lead → viewing → offer → negotiation → closing)
- List view with sorting/filtering
- Deal statistics & pipeline value
- Drag-and-drop stage management
- Win/loss tracking with reasons

### Tasks (`/tasks`)
- List view with date grouping (overdue, today, tomorrow, this week, later)
- Calendar view with date selection
- Task stats (due today, overdue, completed, this week)
- Quick filters (all, today, week, overdue)
- Advanced filters (priority, type, status, contact)
- Bulk actions (complete, delete, change priority, reschedule)

### Properties (`/properties`)
- Grid and list views
- Property cards with image, price, details
- Filtering (price range, bedrooms, type, status)
- Property detail modal
- Link properties to contacts/deals

### AI Assistant (`/ai-assistant`)
- Conversational AI powered by Claude/Gemini
- Context-aware responses based on CRM data
- Lead insights and recommendations
- Email drafting assistance

### Campaigns (`/campaigns`)
- Email campaign creation
- Audience segmentation
- Template library
- Campaign analytics (open rates, click rates)

### Calendar (`/calendar`)
- Full calendar view of activities
- Event creation/editing
- Integration with tasks
- Recurring events support

### Reports (`/reports`)
- Sales analytics
- Lead conversion metrics
- Deal pipeline health
- Activity reports

### Settings (`/settings`)
- Profile management
- Business preferences
- Integration settings (HubSpot, calendar sync)
- Notification preferences

### Billing (`/billing`)
- Subscription management via Stripe
- Plan comparison (Agent/Team/Brokerage)
- Payment method management
- Billing history

---

## 7. Authentication & User Management

### Authentication Methods
1. **Email/Password** - Traditional signup/login
2. **Google OAuth** - Social login
3. **Microsoft OAuth** - Enterprise login

### Onboarding Flow (6 Steps)
1. **Profile Setup** - Name, email, phone, company
2. **Business Goals** - Transaction goals, focus areas
3. **Import Contacts** - CSV upload or manual entry
4. **Calendar Integration** - Google/Outlook sync
5. **Chatbot Setup** - Configure AI assistant
6. **Complete** - Welcome message, dashboard redirect

### User Roles
- **Agent** (default) - Individual realtor
- **Team** - Team lead with multiple agents
- **Brokerage** - Broker managing entire office
- **Admin** - Platform administrator (special access)

### Subscription Tiers
- **Agent Plan** - $79/month - Individual features
- **Team Plan** - $199/month - Team collaboration
- **Brokerage Plan** - Custom pricing - Enterprise features

### Trial System
- 60-day free trial on signup
- Full feature access during trial
- `trial_ends_at` timestamp in profiles table
- Auto-downgrade or payment required after trial

---

## 8. Edge Functions (Supabase Functions)

### Location: `supabase/functions/`

#### ai-chatbot
**Purpose:** AI assistant chat endpoint  
**Input:** User message, conversation history  
**Output:** AI-generated response  
**Uses:** Anthropic Claude API

#### calculate-lead-score
**Purpose:** Calculate AI lead score for contact  
**Input:** Contact ID  
**Output:** Score (0-100), factors, insights  
**Logic:** Analyzes engagement, recency, property match, demographics

#### check-subscription
**Purpose:** Verify user subscription status  
**Input:** User ID  
**Output:** Subscription details, trial status  
**Uses:** Stripe API

#### claude-chat
**Purpose:** General Claude API wrapper  
**Input:** Prompt, model, parameters  
**Output:** Claude response

#### create-checkout
**Purpose:** Stripe checkout session creation  
**Input:** Price ID, user email  
**Output:** Checkout session URL

#### customer-portal
**Purpose:** Stripe customer portal access  
**Input:** Customer ID  
**Output:** Portal session URL

#### email-automation
**Purpose:** Automated email sequences  
**Input:** Contact ID, template, trigger  
**Output:** Email sent confirmation  
**Logic:** Drip campaigns, follow-ups, nurturing

#### encrypt-integration-token
**Purpose:** Secure storage of third-party tokens  
**Input:** Plain token, provider  
**Output:** Encrypted token  
**Uses:** ENCRYPTION_KEY secret

#### hubspot-sync
**Purpose:** Sync contacts with HubSpot  
**Input:** Contact data  
**Output:** Sync status  
**Uses:** HUBSPOT_API_KEY secret

#### lead-score-calculator
**Purpose:** Manual lead scoring calculation  
**Input:** Contact ID  
**Output:** Traditional lead score

#### send-welcome-email
**Purpose:** Send welcome email to new users  
**Input:** User email, name  
**Output:** Email sent confirmation

---

## 9. Key Components

### Dashboard Sidebar (`DashboardSidebar.tsx`)
- Navigation menu with 12 links
- Trial badge with days remaining
- Mobile-responsive with toggle
- Active route highlighting

### Dashboard Navbar (`DashboardNavbar.tsx`)
- Search bar (global)
- Notifications dropdown (3 recent)
- User profile menu
- Sign out functionality

### Contact Filters (`ContactFilters.tsx`)
- Multi-select tag filtering
- Status filtering (lead/prospect/client)
- Lead score range slider
- Date range picker

### Deal Card (`DealCard.tsx`)
- Drag-and-drop enabled
- Stage indicator
- Value display with commission
- Contact avatar
- Quick actions menu

### Task Item (`TaskItem.tsx`)
- Checkbox for completion
- Priority indicator (color-coded)
- Due date/time display
- Contact link
- Edit/delete actions

### Add Task Modal (`AddTaskModal.tsx`)
- Title, description fields
- Date/time picker
- Priority selection (low/medium/high/urgent)
- Task type (call/email/meeting/viewing/followup)
- Contact/deal association
- Reminder settings

---

## 10. State Management

### Context Providers

#### SubscriptionContext
**Location:** `src/contexts/SubscriptionContext.tsx`  
**Purpose:** Global subscription state  
**Provides:**
- `subscribed` (boolean)
- `subscriptionTier` (agent/team/brokerage)
- `trialEndsAt` (date)
- `refreshSubscription()` function

**Usage:**
```typescript
const { subscribed, subscriptionTier } = useSubscription();
```

### React Query
Used for server state management:
- Automatic caching
- Background refetching
- Optimistic updates
- Pagination support

**Example:**
```typescript
const { data: contacts, refetch } = useQuery({
  queryKey: ['contacts'],
  queryFn: () => supabase.from('contacts').select('*')
});
```

---

## 11. Styling & Design System

### Tailwind Configuration
**File:** `tailwind.config.ts`

#### Custom Colors (HSL)
```javascript
colors: {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  destructive: "hsl(var(--destructive))",
  muted: "hsl(var(--muted))",
  // ... more semantic tokens
}
```

### CSS Variables
**File:** `src/index.css`

```css
:root {
  --primary: 222 47% 11%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  --destructive: 0 84% 60%;
  --muted: 210 40% 96%;
  /* ... more variables */
}
```

### Dark Mode Support
Toggle between light/dark themes via `next-themes` package.

---

## 12. Internationalization (i18n)

### Supported Languages
- English (default)
- French (Canadian)

### Configuration
**File:** `src/i18n/config.ts`

```typescript
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations }
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });
```

### Usage
```typescript
const { t, i18n } = useTranslation();
<h1>{t('dashboard.welcome')}</h1>
i18n.changeLanguage('fr');
```

---

## 13. Environment Variables

### Frontend (.env)
```bash
VITE_SUPABASE_URL=https://pseqajrtcgiphfnworii.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
VITE_SUPABASE_PROJECT_ID=pseqajrtcgiphfnworii
```

### Backend (Supabase Secrets)
- `SUPABASE_DB_URL` - Database connection string
- `ENCRYPTION_KEY` - For token encryption
- `HUBSPOT_API_KEY` - HubSpot integration
- `ANTHROPIC_API_KEY` - Claude AI
- `LOVABLE_API_KEY` - Lovable AI
- `STRIPE_SECRET_KEY` - Stripe payments
- `SUPABASE_SERVICE_ROLE_KEY` - Admin access

---

## 14. Deployment & Hosting

### Frontend
- **Platform:** Lovable Cloud (automatic deployment)
- **URL:** `https://[project-id].lovableproject.com`
- **Custom Domain:** Configurable via Project Settings

### Backend (Supabase)
- **Region:** US-West (or closest to users)
- **Database:** PostgreSQL 15
- **Edge Functions:** Globally distributed via Deno Deploy

### CI/CD
- Automatic deployment on code changes (via Lovable)
- Manual deployment via GitHub sync

### Monitoring
- Supabase Dashboard for database analytics
- Edge Function logs via Supabase CLI
- Stripe Dashboard for payment monitoring

---

## 15. Security Best Practices

### Implemented
✅ Row-Level Security (RLS) on all tables  
✅ Environment variables for sensitive data  
✅ HTTPS-only connections  
✅ JWT token authentication  
✅ Password hashing (via Supabase Auth)  
✅ API key encryption for integrations  
✅ CORS configuration  
✅ Rate limiting on edge functions  

### Recommended
⚠️ Regular security audits  
⚠️ Dependency updates  
⚠️ SQL injection prevention (use parameterized queries)  
⚠️ XSS protection (sanitize user inputs)  
⚠️ CSRF tokens for sensitive operations  

---

## 16. Performance Optimization

### Implemented
- Code splitting via Vite
- Lazy loading of routes
- Image optimization (next-gen formats)
- Database indexing on frequently queried columns
- React Query caching
- Memoization of expensive computations

### Recommendations
- Add Cloudflare CDN
- Implement service workers for offline support
- Use virtual scrolling for large lists
- Compress API responses (gzip)
- Database connection pooling

---

## 17. Testing Strategy

### Current State
⚠️ No automated tests implemented

### Recommended Testing Approach

#### Unit Tests (Jest + React Testing Library)
```bash
npm install --save-dev jest @testing-library/react
```
- Test individual components
- Test utility functions
- Test custom hooks

#### Integration Tests
- Test user flows (signup → onboarding → dashboard)
- Test API interactions
- Test authentication flow

#### E2E Tests (Playwright/Cypress)
- Test critical user journeys
- Test across browsers
- Test responsive design

---

## 18. Development Workflow

### Local Setup
```bash
# Clone repository (via GitHub sync)
git clone [repo-url]
cd realtordesk-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add Supabase credentials

# Run development server
npm run dev

# Open browser
http://localhost:5173
```

### Development Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Supabase CLI Commands
```bash
supabase login
supabase link --project-ref pseqajrtcgiphfnworii
supabase db pull     # Pull schema changes
supabase functions deploy [function-name]
supabase functions logs [function-name]
```

---

## 19. Common Issues & Solutions

### Issue: "Authentication Error: Auth session missing"
**Solution:** Check if user is logged in before accessing protected routes. Add auth guard to page component.

### Issue: 404 on dashboard routes
**Solution:** Verify routes in `App.tsx` match sidebar links in `DashboardSidebar.tsx`.

### Issue: Tasks not loading
**Solution:** Check RLS policies on tasks table. Ensure `user_id = auth.uid()` policy exists.

### Issue: Stripe checkout not working
**Solution:** Verify `STRIPE_SECRET_KEY` is set in Supabase secrets. Check edge function logs.

### Issue: Email automation not sending
**Solution:** Check email-automation edge function logs. Verify SMTP credentials or email service configuration.

---

## 20. Future Enhancements

### Planned Features
- [ ] Mobile app (React Native)
- [ ] Advanced reporting dashboard
- [ ] MLS integration (CREA DDF)
- [ ] Document e-signature (DocuSign integration)
- [ ] SMS automation (Twilio)
- [ ] WhatsApp integration
- [ ] Team collaboration features (shared pipeline, lead assignment)
- [ ] Advanced AI features (price predictions, market analysis)
- [ ] Video call integration (Zoom/Google Meet)
- [ ] Social media posting automation
- [ ] Transaction management system
- [ ] Commission calculator
- [ ] Open house management

### Technical Debt
- [ ] Add comprehensive test coverage
- [ ] Implement error boundary components
- [ ] Add performance monitoring (Sentry)
- [ ] Optimize bundle size
- [ ] Add API rate limiting
- [ ] Implement request caching
- [ ] Add database backups automation

---

## 21. Support & Maintenance

### Documentation Updates
This document should be updated when:
- New features are added
- Database schema changes
- New edge functions are created
- API integrations are modified
- Security policies are updated

### Code Review Checklist
- [ ] Follow TypeScript best practices
- [ ] Use semantic HTML
- [ ] Implement proper error handling
- [ ] Add comments for complex logic
- [ ] Test on multiple screen sizes
- [ ] Check for memory leaks
- [ ] Verify RLS policies
- [ ] Update this documentation

### Maintenance Tasks
- Weekly: Review error logs
- Monthly: Update dependencies
- Quarterly: Security audit
- Annually: Database optimization

---

## 22. Contact & Resources

### Key URLs
- **Production App:** https://[project-id].lovableproject.com
- **Supabase Dashboard:** https://supabase.com/dashboard/project/pseqajrtcgiphfnworii
- **Stripe Dashboard:** https://dashboard.stripe.com

### Documentation Links
- Lovable Docs: https://docs.lovable.dev
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com/docs

### Repository
- GitHub: [Connected via Lovable GitHub Integration]

---

## 23. Appendix

### Database Diagram
```
profiles ─┬─→ contacts ─┬─→ deals
          │             ├─→ tasks
          │             ├─→ activities
          │             ├─→ engagement_stats
          │             ├─→ ai_lead_scores
          │             └─→ contact_notes
          │
          ├─→ properties ─→ deals
          ├─→ email_campaigns
          ├─→ automation_workflows
          ├─→ calendar_settings
          └─→ integrations
```

### API Rate Limits
- Supabase: 500 requests/minute (free tier)
- Stripe: No limit (based on account)
- Anthropic: Based on API tier

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**Document Version:** 1.0  
**Last Updated:** November 26, 2025  
**Maintained By:** Realtor Desk AI Development Team
