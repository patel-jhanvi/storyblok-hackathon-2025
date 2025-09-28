# Brewbook

Coffee shops and events discovery app for developers. Built with Next.js, Storyblok CMS, and Algolia search.

## Quick Start

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd brewbook
   npm install
   ```

2. **Environment Setup**
   Create `.env` file:
   ```env
   STORYBLOK_TOKEN=your_preview_token
   NEXT_PUBLIC_STORYBLOK_TOKEN=your_public_token
   NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_algolia_app_id
   NEXT_PUBLIC_ALGOLIA_API_KEY=your_algolia_search_key
   NEXT_PUBLIC_ALGOLIA_INDEX_NAME=brewbook
   ```

3. **Seed Data**
   ```bash
   npm run seed:storyblok    # Seed Storyblok with sample data
   npm run seed:algolia      # Index content to Algolia
   ```

4. **Run Development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Features

- **Search & Filters**: Algolia-powered search with smart filters
- **Detail Pages**: Cafe and event detail pages with maps
- **CMS Integration**: Live editing with Storyblok Visual Editor
- **Responsive Design**: Mobile-first, coffee-themed UI

## Pages

- `/` - Homepage with search
- `/cafe/[slug]` - Cafe detail pages
- `/event/[slug]` - Event detail pages
- `/preview` - Storyblok preview mode

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## Storyblok CMS

Enable live editing by adding `?_storyblok` to any URL. Content types: Page, Hero, Cafe, Event.

## Algolia Search

Configure search index and synonyms:
```bash
npm run algolia:config     # Setup index
npm run algolia:test       # Test configuration
```
