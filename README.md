# Cryptoriez Dashboard 2.0

Een moderne, schaalbare MVP webapplicatie voor cryptocurrency trading educatie met zwart/oranje design.

## 🚀 Features

- **Authentication**: Supabase auth met e-mail/wachtwoord login
- **Dashboard**: Overzicht van hoofdstukken met progress tracking
- **Hoofdstukken**: Video content (Vimeo) + Markdown content
- **Progress System**: Gamification met badges en progress bars
- **Resources**: Belangrijke links en tools
- **Responsive Design**: Mobile-first met SF Pro font
- **Dark Theme**: Zwarte achtergrond met oranje accenten
- **Toast Notifications**: Real-time feedback systeem
- **Error Handling**: Robuuste error boundaries
- **SEO Optimized**: Meta tags, sitemap, robots.txt
- **PWA Ready**: Web app manifest en service worker support

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS met SF Pro font
- **Backend**: Supabase (Auth + Database)
- **Deployment**: Netlify ready

## 📋 Setup Instructions

### 1. Supabase Setup

1. Maak een nieuw Supabase project aan
2. Run de SQL uit `supabase-schema.sql` in de SQL Editor
3. Run de SQL uit `seed-data.sql` voor voorbeelddata
4. Kopieer je project URL en anon key

### 2. Environment Variables

Maak een `.env.local` bestand aan:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## 📊 Database Schema

### Tables

- **chapters**: Hoofdstukken met titel, volgorde, video URL en content
- **progress**: User progress tracking per hoofdstuk
- **resources**: Belangrijke links gecategoriseerd
- **users**: Supabase auth users (automatisch)

### Key Features

- Row Level Security (RLS) enabled
- Progress calculation functions
- Next unlocked chapter logic
- Optimized indexes voor performance

## 🎨 Design System

### Colors
- **Background**: Dark-900 (zwart)
- **Cards**: Dark-800 (donkergrijs)
- **Primary**: Blue-500/600 (blauw)
- **Text**: White/Dark-300/400

### Typography
- **Font**: SF Pro Display (fallback: Inter)
- **Sizes**: Responsive typography scale

### Components
- **Cards**: Rounded-2xl met zachte schaduwen
- **Buttons**: Primary blue met hover states
- **Progress**: Gradient progress bars
- **Badges**: Completion indicators

## 🔧 Admin Functions

### User Management
- Handmatig users toevoegen via Supabase Dashboard
- Alleen toegevoegde users krijgen toegang

### Content Management
- Hoofdstukken toevoegen via database
- Video URLs (Vimeo private embeds)
- Markdown content support
- Resources beheren per categorie

## 🚀 Deployment

### Netlify
1. Connect je GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Environment Variables voor Production
```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

## 📱 Mobile Support

- Mobile-first responsive design
- Touch-friendly interface
- Optimized voor alle screen sizes
- Fast loading op mobile networks

## 🔒 Security

- Row Level Security (RLS) op alle tables
- Authenticated users only
- Secure API routes
- No sensitive data in client-side code

## 🎯 Future Extensions

De applicatie is gebouwd voor schaalbaarheid:

- **Quizzen**: Toevoegen van quiz functionaliteit
- **Certificaten**: Achievement system
- **Trading Journals**: Portfolio tracking
- **Community**: User interactions
- **Analytics**: User progress tracking
- **Notifications**: Email/SMS alerts

## 📝 Content Management

### Hoofdstukken Toevoegen
```sql
INSERT INTO chapters (title, description, order_index, video_url, content) 
VALUES ('Titel', 'Beschrijving', 6, 'vimeo_url', 'markdown_content');
```

### Resources Toevoegen
```sql
INSERT INTO resources (title, url, description, category) 
VALUES ('Titel', 'https://url.com', 'Beschrijving', 'categorie');
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication errors**: Check Supabase URL en keys
2. **Database errors**: Verify RLS policies
3. **Build errors**: Check TypeScript types
4. **Styling issues**: Verify TailwindCSS config

### Support

Voor vragen of problemen, neem contact op via:
- Email: support@cryptoriez.com
- Discord: [Crypto Community](https://discord.gg/cryptoriez)

## 📄 License

Dit project is eigendom van Cryptoriez. Alle rechten voorbehouden.

---

**Gemaakt met ❤️ voor de crypto community**
