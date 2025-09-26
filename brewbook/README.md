# Brewbook

A Next.js city guide app for developers, integrated with Storyblok CMS for content management and live editing.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Storyblok Visual Editor Integration

This app is fully integrated with Storyblok's Visual Editor for live preview and editing capabilities.

### Enabling Live Preview Mode

To enable live preview and see the green highlight borders around editable components:

1. **Via URL Parameter**: Add `?_storyblok` to any URL
   ```
   http://localhost:3000/?_storyblok
   ```

2. **Via Storyblok Visual Editor**:
   - In your Storyblok space, go to Content
   - Open any story (cafe, event, or page)
   - Click the "Visual Editor" tab
   - Set the preview URL to: `http://localhost:3000/[slug]`
   - For the home page, use: `http://localhost:3000/?_storyblok`

3. **Preview Route**: Use the dedicated preview route
   ```
   http://localhost:3000/preview?path=story-slug
   ```

### Live Editing Features

When in preview mode, you'll see:

**Green highlight borders** around all editable components (hero, cards, etc.)
**Real-time updates** when content is changed in the editor
**No page reload required** - changes appear instantly
**Component-level editing** for precise content control

### Supported Components

- **Page**: Main page wrapper with body blocks
- **Hero**: Homepage hero section with headline and subtitle
- **CardGrid**: Grid of cafe/event cards with optional title
- **Cafe**: Individual cafe content block
- **Event**: Individual event content block

### Environment Variables

Make sure these are set in your `.env` file:

```env
STORYBLOK_TOKEN=your_storyblok_api_token_here
NEXT_PUBLIC_STORYBLOK_TOKEN=your_storyblok_api_token_here
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
