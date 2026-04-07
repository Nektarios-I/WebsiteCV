# 📚 Quick Start Tutorial — WebsiteCV

> **Time to read:** 5 minutes  
> **Time to customize:** 15-30 minutes

Welcome! This guide will help you quickly understand and customize your portfolio website.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd WebsiteCV
pnpm install
```

### Step 2: Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

### Step 3: Edit Your Information

Open `site.config.ts` in the root folder and update your details!

---

## 📁 Understanding the Website

### Two Viewing Modes

Your portfolio has **two unique experiences**:

| Mode           | URL           | Description                                                      |
| -------------- | ------------- | ---------------------------------------------------------------- |
| **Hub**        | `/`           | Landing page where visitors choose their experience              |
| **Minimalist** | `/minimalist` | Clean, professional scrolling portfolio (like Brittany Chiang's) |
| **Immersive**  | `/immersive`  | Interactive 3D experience (explore a virtual room)               |
| **Gallery**    | `/gallery`    | 3D museum where your portfolio is displayed as art exhibits      |

### What Visitors See

1. **Hub (Landing Page)** — Name, tagline, social links, mode selector
2. **Mode A (Minimalist)** — Full CV: About, Experience, Projects, Skills, Education, Contact
3. **Mode B (Immersive)** — 3D room with clickable objects showing your CV content
4. **Mode C (Gallery)** — 3D museum you walk through in third-person, with your work displayed as paintings, statues, and exhibits

---

## ✏️ How to Edit Your Content

### The Easy Way: Edit `site.config.ts`

All your content is in **ONE FILE**: `site.config.ts` in the project root.

```
WebsiteCV/
├── site.config.ts    ← ⭐ EDIT THIS FILE
├── src/
├── docs/
└── ...
```

#### What's in `site.config.ts`?

| Section          | What to Edit                              |
| ---------------- | ----------------------------------------- |
| `PERSONAL`       | Your name, title, bio, location           |
| `CONTACT`        | Email, phone, social links                |
| `EXPERIENCE`     | Your job history (add/edit/remove jobs)   |
| `EDUCATION`      | Your education background                 |
| `PROJECTS`       | Your portfolio projects                   |
| `SKILLS`         | Your technical skills by category         |
| `CERTIFICATIONS` | Your professional certifications          |
| `SITE_CONFIG`    | Site title, description, enabled sections |

### Example: Adding a New Job

Open `site.config.ts` and find the `EXPERIENCE` array:

```typescript
export const EXPERIENCE = [
  {
    id: 'job-new', // Unique ID
    company: 'Awesome Company', // Company name
    role: 'Lead Developer', // Your title
    startDate: '2024-01', // Format: YYYY-MM
    endDate: 'Present', // Or 'YYYY-MM'
    location: 'Remote',
    description: 'Led the frontend team.',
    highlights: ['Shipped 5 major features', 'Grew team from 3 to 8 engineers'],
    technologies: ['React', 'TypeScript', 'AWS'],
    companyUrl: 'https://awesome.com',
  },
  // ... other jobs
];
```

### Example: Adding a New Project

```typescript
export const PROJECTS = [
  {
    id: 'project-new',
    title: 'My Cool App',
    description: 'A mobile app that does cool things.',
    longDescription: 'Extended description for detail view...',
    category: 'mobile', // web | mobile | fullstack | backend | design | other
    technologies: ['React Native', 'Firebase'],
    image: '/images/projects/cool-app.webp', // Put image in public/images/projects/
    liveUrl: 'https://app-store-link.com',
    githubUrl: 'https://github.com/you/cool-app',
    featured: true, // Shows prominently
    date: '2024-06',
  },
  // ... other projects
];
```

---

## 🖼 Adding Images

### Profile Photo

1. Place your photo in `public/images/profile.webp`
2. Update `PERSONAL.photo` in `site.config.ts`

### Project Screenshots

1. Place images in `public/images/projects/`
2. Reference in config: `image: '/images/projects/my-project.webp'`

### Best Practices

- Use WebP format for smaller file sizes
- Profile photos: ~400x400px
- Project images: ~1200x630px (2:1 ratio)

---

## 🎨 Customizing the Design

### Colors (Theme)

Edit `src/app/globals.css` and look for `@theme`:

```css
@theme inline {
  --color-accent: oklch(71.6% 0.152 194.8); /* Teal - change this! */
  --color-accent-light: oklch(85% 0.1 194.8);
  /* ... other colors ... */
}
```

### Fonts

Edit `src/app/layout.tsx` to change fonts:

```typescript
import { Geist, Geist_Mono } from 'next/font/google';

// Change to any Google Font:
// import { Inter, Fira_Code } from 'next/font/google';
```

---

## 📱 Common Tasks

### Adding a Resume Download Button

1. Place your PDF in `public/resume.pdf`
2. In `site.config.ts`:

```typescript
export const RESUME = {
  enabled: true,
  file: '/resume.pdf',
  buttonText: 'Download Resume',
};
```

### Hiding a Section

In `site.config.ts`:

```typescript
export const SITE_CONFIG = {
  // ...
  sections: {
    about: true,
    experience: true,
    projects: true,
    skills: true,
    education: false, // ← Hides education section
    contact: true,
  },
};
```

### Changing Social Links

In `site.config.ts`:

```typescript
export const CONTACT = {
  email: 'me@example.com',
  github: 'https://github.com/myusername',
  linkedin: 'https://linkedin.com/in/myprofile',
  twitter: 'https://twitter.com/myhandle', // Optional
  dribbble: '', // Empty = hidden
};
```

---

## 🚀 Deploying Your Site

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click Deploy!

### Custom Domain

1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `yourname.com`)
3. Update DNS records as instructed

---

## 📋 Commands Reference

| Command            | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `pnpm dev`         | Start development server                             |
| `pnpm build`       | Build for production                                 |
| `pnpm start`       | Run production build locally                         |
| `pnpm lint`        | Check for code issues                                |
| `pnpm type-check`  | Check TypeScript types                               |
| `pnpm test`        | Run unit tests (83 tests)                            |
| `pnpm test:e2e`    | Run E2E tests (needs `npx playwright install` first) |
| `pnpm analyze`     | Analyze bundle sizes                                 |
| `pnpm sync-config` | Sync site.config.ts → src/data/\*.json               |

---

## ❓ Troubleshooting

### "Module not found" error

```bash
pnpm install
```

### TypeScript errors after editing config

Make sure your dates are in `YYYY-MM` format and arrays are properly formatted.

### Images not showing

- Check the path starts with `/` (e.g., `/images/profile.webp`)
- Make sure the file exists in the `public/` folder

### Changes not appearing

1. Save the file
2. Check the terminal for errors
3. Hard refresh the browser (Ctrl+Shift+R)

---

## 📂 File Structure Overview

```
WebsiteCV/
├── site.config.ts      ← Your content (EDIT THIS!)
├── public/
│   ├── images/         ← Your images
│   │   ├── profile.webp
│   │   └── projects/
│   ├── resume.pdf      ← Your resume
│   └── robots.txt
├── src/
│   ├── app/            ← Page routes
│   │   ├── page.tsx            (Hub)
│   │   ├── minimalist/         (Mode A)
│   │   ├── immersive/          (Mode B)
│   │   └── gallery/            (Mode C — 3D Museum)
│   ├── components/     ← UI components
│   ├── data/           ← Legacy JSON data (optional)
│   ├── hooks/          ← React hooks
│   ├── lib/            ← Utilities
│   ├── modes/          ← Mode-specific code
│   ├── stores/         ← State management
│   └── types/          ← TypeScript types
└── docs/               ← Documentation
```

---

## 🎉 Next Steps

1. ✅ Edit `site.config.ts` with your real information
2. ✅ Add your profile photo and project images
3. ✅ Customize colors if desired
4. ✅ Test all four modes (Hub + Minimalist + Immersive + Gallery)
5. ✅ Deploy to Vercel
6. ✅ Share your portfolio!

---

**Need more help?** Check the other docs in the `docs/` folder:

- `Implementation_Plan.md` — Technical architecture
- `Structure.md` — File organization
- `Suggestions.md` — Ideas for what to add next
