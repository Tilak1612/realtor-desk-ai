# Setup Instructions - Realtor Desk AI

## Prerequisites

Before launching, you need accounts with the following services:

1. **Google Analytics** (https://analytics.google.com)
2. **YouTube** (for demo video hosting)
3. **Resend** (https://resend.com - for email sending)
4. **HubSpot** (already configured)
5. **Stripe** (already configured)

## Configuration Steps

### 1. Google Analytics Setup

1. Go to https://analytics.google.com
2. Create a new GA4 property for your website
3. Copy your Measurement ID (format: G-XXXXXXXXXX)
4. Open `index.html` in your project
5. Find line 24 and replace both instances of `G-XXXXXXXXXX` with your Measurement ID:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID-HERE"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'YOUR-ID-HERE');
   </script>
   ```

### 2. Demo Video Upload

1. Record a professional walkthrough of your platform (3-5 minutes recommended)
2. Upload to YouTube
3. Click "Share" > "Embed" and copy the URL
4. Open `src/pages/Index.tsx`
5. Find line 31 and replace the video URL:
   ```typescript
   const DEMO_VIDEO_URL = "https://www.youtube.com/embed/YOUR_VIDEO_ID";
   ```

### 3. Resend Email Setup

1. Sign up at https://resend.com
2. Navigate to Domains and add your sending domain
3. Add the provided DNS records to verify your domain
4. Go to API Keys and create a new key
5. In Lovable, add the secret:
   - The system will automatically prompt you when email features are used
   - Or manually add via Lovable Cloud dashboard
   - Secret name: `RESEND_API_KEY`
   - Value: Your Resend API key

### 4. Update Testimonials

Open `src/pages/Index.tsx` and find the testimonials section (around line 210-228):

```typescript
<TestimonialCard
  quote="Replace with real customer quote"
  name="Customer Name"
  title="Their Title"
  company="Their Company"
/>
```

Replace with actual customer feedback. Get written permission before publishing.

## Testing Checklist

Before going live, test:

### ✅ User Flows
- [ ] Sign up new account
- [ ] Complete onboarding flow
- [ ] Add a contact
- [ ] Create a deal
- [ ] Schedule a task
- [ ] Submit demo request form
- [ ] Submit contact form
- [ ] Interact with AI chatbot

### ✅ Integrations
- [ ] HubSpot sync (check HubSpot dashboard for new contacts)
- [ ] Email automation (check Resend dashboard for sent emails)
- [ ] Lead scoring (verify scores appear in contact details)
- [ ] Stripe payments (test subscription upgrade)
- [ ] AI chatbot (verify responses are relevant)

### ✅ Analytics
- [ ] Verify Google Analytics tracking (check Real-Time report)
- [ ] Test conversion events
- [ ] Verify form submissions

## Post-Launch Monitoring

### Daily Tasks
1. Check Google Analytics for traffic
2. Review HubSpot for new leads
3. Monitor Resend for email delivery rates
4. Check Stripe dashboard for subscriptions
5. Review Lovable Cloud logs for errors

### Weekly Tasks
1. Analyze lead quality and conversion rates
2. Review AI chatbot conversations for improvements
3. Update email campaign content based on engagement
4. Optimize landing pages based on analytics

### Monthly Tasks
1. Conduct security audit
2. Review and update testimonials
3. Analyze feature usage patterns
4. Plan feature roadmap priorities

## Support Resources

### Documentation
- Lovable Docs: https://docs.lovable.dev
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Resend Docs: https://resend.com/docs

### Common Issues

**Issue**: Email automation not working
- **Solution**: Verify RESEND_API_KEY is set and domain is verified

**Issue**: HubSpot sync failing
- **Solution**: Check HUBSPOT_API_KEY is valid and has correct permissions

**Issue**: AI chatbot not responding
- **Solution**: Verify LOVABLE_API_KEY is configured (auto-configured with Lovable Cloud)

**Issue**: Lead scores not calculating
- **Solution**: Ensure contacts have sufficient data (tags, activities, notes)

**Issue**: Demo video not loading
- **Solution**: Verify YouTube URL is public and embeddable

## Environment Variables

Current configuration (managed automatically):
- `VITE_SUPABASE_URL` - Auto-configured
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Auto-configured
- `VITE_SUPABASE_PROJECT_ID` - Auto-configured

Secrets (set via Lovable Cloud):
- `HUBSPOT_API_KEY` - ✅ Configured
- `STRIPE_SECRET_KEY` - ✅ Configured
- `LOVABLE_API_KEY` - ✅ Auto-configured
- `RESEND_API_KEY` - ⚠️ Needs configuration
- `ENCRYPTION_KEY` - ✅ Auto-configured
- `ANTHROPIC_API_KEY` - ✅ Configured
- `SUPABASE_SERVICE_ROLE_KEY` - ✅ Auto-configured

## Launch Preparation

### 1 Week Before Launch
- [ ] Complete all configuration steps
- [ ] Test all user flows
- [ ] Prepare marketing materials
- [ ] Set up customer support channels
- [ ] Configure domain and SSL
- [ ] Test on multiple devices/browsers

### 1 Day Before Launch
- [ ] Final testing pass
- [ ] Verify all integrations working
- [ ] Check analytics tracking
- [ ] Prepare launch announcement
- [ ] Set up monitoring alerts
- [ ] Back up database

### Launch Day
- [ ] Deploy to production
- [ ] Monitor real-time analytics
- [ ] Watch error logs
- [ ] Be ready for support requests
- [ ] Send launch announcement
- [ ] Celebrate! 🎉

## Need Help?

- Lovable Support: support@lovable.dev
- Community Discord: [Join here]
- Documentation: https://docs.lovable.dev

---

**Ready to launch?** Complete the configuration steps above and you're good to go!
