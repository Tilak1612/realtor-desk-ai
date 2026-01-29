# 🌍 BILINGUAL QUICK REFERENCE

**Quick access guide for developers maintaining bilingual content**

---

## 📍 Key Files

### Translation Configuration
- **Main Config:** [/src/i18n/config.ts](src/i18n/config.ts) (2,545 lines)
- **Language Switcher:** [/src/components/LanguageSwitcher.tsx](src/components/LanguageSwitcher.tsx)

### AI Knowledge Bases
- **English JSON:** [/public/knowledge-base.json](public/knowledge-base.json)
- **French JSON:** [/public/knowledge-base-fr.json](public/knowledge-base-fr.json) ✨ NEW
- **English TXT:** [/public/ai-company-info.txt](public/ai-company-info.txt)
- **French TXT:** [/public/ai-company-info-fr.txt](public/ai-company-info-fr.txt) ✨ NEW

### SEO Files
- **Robots.txt:** [/public/robots.txt](public/robots.txt) - Allows AI crawlers to access French files
- **Sitemap:** [/public/sitemap.xml](public/sitemap.xml) - Lists all pages

---

## 🔧 How to Add New Translations

### 1. Add to Config File
Edit [/src/i18n/config.ts](src/i18n/config.ts):

```typescript
// Add to English section (resources.en.translation)
myFeature: {
  title: "My Feature Title",
  description: "My description"
}

// Add to French section (resources.fr.translation)
myFeature: {
  title: "Titre de Ma Fonctionnalité",
  description: "Ma description"
}
```

### 2. Use in Component
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <p>{t('myFeature.description')}</p>
    </div>
  );
};
```

---

## 📊 Current Translation Structure

```
resources
├── en (English)
│   ├── nav.*                  - Navigation
│   ├── hero.*                 - Hero sections
│   ├── features.*             - Features page
│   ├── pricing.*              - Pricing page
│   ├── faq.*                  - FAQ
│   ├── app.*                  - Dashboard
│   │   ├── sidebar.*          - Dashboard sidebar
│   │   ├── dashboard.*        - Main dashboard
│   │   ├── contacts.*         - Contacts page
│   │   ├── deals.*            - Deals page
│   │   ├── tasks.*            - Tasks page
│   │   ├── properties.*       - Properties page
│   │   └── modals.*           - All modals
│   ├── campaigns.*            - Campaigns page ✨ NEW
│   ├── switchFrom.*           - Comparison pages ✨ NEW
│   ├── placeholders.*         - Form inputs ✨ NEW
│   └── ...
└── fr (French) - Same structure
```

---

## ✅ Pages Already Translated

### Public Marketing Pages
✅ Homepage (/)
✅ Pricing (/pricing)
✅ Features (/features)
✅ FAQ (/faq)
✅ Contact (/contact)
✅ Demo (/demo)
✅ How It Works (/how-it-works)
✅ Integrations (/integrations)
✅ Resources (/resources)
✅ Canadian Market (/canadian-market)
✅ Switch From Pages (/switch-from/*) ✨ NEW

### App Dashboard
✅ Dashboard (/dashboard)
✅ Contacts (/contacts)
✅ Properties (/properties)
✅ Deals (/deals)
✅ Tasks (/tasks)
✅ Campaigns (/campaigns) ✨ NEW
✅ Settings (/settings)
✅ All Modals

### Authentication
✅ Login (/login)
✅ Signup (/signup)
✅ Forgot Password (/forgot-password)

---

## 🎯 Translation Keys Cheat Sheet

### Common Buttons
```typescript
t('app.common.save')          // Save / Enregistrer
t('app.common.cancel')        // Cancel / Annuler
t('app.common.delete')        // Delete / Supprimer
t('app.common.edit')          // Edit / Modifier
t('app.common.add')           // Add / Ajouter
t('app.common.close')         // Close / Fermer
```

### Navigation
```typescript
t('nav.features')             // Features / Fonctionnalités
t('nav.pricing')              // Pricing / Tarification
t('nav.bookDemo')             // Book Your Free Demo / Réserver Votre Démo Gratuite
```

### Form Placeholders ✨ NEW
```typescript
t('placeholders.email')       // your@email.com / votre@email.com
t('placeholders.name')        // John Smith / Jean Tremblay
t('placeholders.brokerage')   // Your Brokerage / Votre Courtage
```

### Campaigns ✨ NEW
```typescript
t('campaigns.title')          // Email Campaigns / Campagnes Email
t('campaigns.newCampaign')    // New Campaign / Nouvelle Campagne
t('campaigns.status.active')  // Active / Active
```

---

## 🌐 Language Switching

### User Changes Language
1. User clicks language switcher in navbar
2. Language changes immediately (no page reload)
3. Choice saved to localStorage: `preferred-language`
4. All text updates via i18n

### Default Language Detection
```typescript
// Automatic detection in config.ts
fallbackLng: 'en',  // Default if no preference

// LanguageDetector checks:
1. localStorage ('preferred-language')
2. Browser language setting
3. Falls back to English
```

---

## 🔍 Testing Translations

### Manual Testing
1. Open site in browser
2. Click language switcher (globe icon)
3. Select French
4. Navigate through pages
5. Verify all text is translated
6. Check form placeholders
7. Test error messages
8. Verify modals

### Check for Missing Translations
```bash
# Search for hardcoded English text
grep -r "placeholder=\"[A-Z]" src/
grep -r ">Get Started<" src/
grep -r ">Sign Up<" src/
```

### Verify Translation Keys
```typescript
// If you see [key.name] in the UI, the translation is missing
// Add it to config.ts in both EN and FR sections
```

---

## 📝 Best Practices

### DO ✅
- Use translation keys for ALL user-facing text
- Keep translations organized by feature
- Use descriptive key names: `campaigns.newCampaign`
- Test both languages after adding new features
- Use Canadian French terms (courriel, courtage)

### DON'T ❌
- Hardcode English text in JSX
- Mix languages in same component
- Use machine translation for production
- Forget to add BOTH EN and FR translations
- Use France French terms (email, agence)

---

## 🆘 Common Issues

### Issue: Text shows as `[key.name]`
**Fix:** Translation key missing. Add to config.ts

### Issue: Language doesn't persist on refresh
**Fix:** Check localStorage is enabled, verify LanguageDetector setup

### Issue: Some text doesn't translate
**Fix:** Component not using `t()` function. Import useTranslation

### Issue: Placeholder text in English
**Fix:** Use `t('placeholders.key')` instead of hardcoded string

---

## 📞 Need Help?

- **Documentation:** This file + [BILINGUAL_IMPLEMENTATION_COMPLETE.md](BILINGUAL_IMPLEMENTATION_COMPLETE.md)
- **Config File:** [/src/i18n/config.ts](src/i18n/config.ts) - 2,545 lines of translations
- **Examples:** See [/src/components/Navbar.tsx](src/components/Navbar.tsx) for proper usage

---

**Last Updated:** January 29, 2026  
**Translation Coverage:** 100%  
**Languages:** English + French  
**Status:** Production Ready ✅
