# Brewbook

Our coffee shops and events discovery app for developers. We built it with Next.js, Storyblok CMS, and Algolia search.

## Quick Start

1. **Let's Clone & Install**

   ```bash
   git clone <repo-url>
   cd brewbook
   npm install
   ```

2. **Environment Setup**
   We need to create a `.env` file:

   ```env
   STORYBLOK_TOKEN=your_preview_token
   NEXT_PUBLIC_STORYBLOK_TOKEN=your_public_token
   NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_algolia_app_id
   NEXT_PUBLIC_ALGOLIA_API_KEY=your_algolia_search_key
   NEXT_PUBLIC_ALGOLIA_INDEX_NAME=brewbook
   ```

3. **Let's Seed Our Data**

   ```bash
   npm run seed:storyblok    # We seed Storyblok with sample data
   npm run seed:algolia      # We index content to Algolia
   ```

4. **Run Development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Features We Built

- **Search & Filters**: Our Algolia-powered search with smart filters
- **Detail Pages**: Cafe and event detail pages with maps
- **CMS Integration**: Live editing with Storyblok Visual Editor
- **Responsive Design**: Our mobile-first, coffee-themed UI

## Pages

- `/` - Homepage with search
- `/cafe/[slug]` - Cafe detail pages
- `/event/[slug]` - Event detail pages

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## Storyblok CMS

We can enable live editing by adding `?_storyblok` to any URL. Content types: Page, Hero, Cafe, Event.

## Algolia Search

Let's configure our search index and synonyms:

```bash
npm run algolia:config     # We setup the index
npm run algolia:test       # We test our configuration
```
