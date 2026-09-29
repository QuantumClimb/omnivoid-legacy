# Supabase Integration Plan

This plan outlines how we will use Supabase to completely remove the need to upload images to the `public` folder and manually edit files, providing a seamless CMS experience.

## User Review Required

> [!WARNING]
> Your `.env` file is currently **empty (0 bytes)**. Please make sure you have saved the file with your Supabase credentials before we begin! It should include:
> ```env
> SUPABASE_URL=your_project_url
> SUPABASE_ANON_KEY=your_anon_key
> ```
> Let me know once you've saved it so I can proceed.

## Open Questions

1. **Supabase Setup**: Have you already created a Storage bucket (e.g., `posters`) and a Database table (e.g., `content`) in your Supabase project, or would you like me to provide the SQL/dashboard instructions to set those up?

## Proposed Changes

### Supabase Integration
#### [NEW] `src/config/supabase.js`
- Initialize the Supabase client using `@supabase/supabase-js`.
- Provide helper functions to fetch content and URLs.

### Admin Dashboard
#### [NEW] `admin/index.html` (or separate admin portal)
- Create a secure admin page that uses Supabase Auth (or a simple password if you prefer to keep it lightweight) to allow the client to:
  1. **Upload new posters** directly to a Supabase Storage bucket.
  2. **Update YouTube links** in a Supabase Database row.
- The dashboard will automatically update the database with the public URL of the newly uploaded poster.

### Frontend Updates
#### [MODIFY] `src/App.js` & `src/AppMobile.js`
- Remove the hardcoded poster paths (`public/gigs/...`).
- Fetch the poster URLs and YouTube links directly from your Supabase Database/Storage on load.

### Configuration
#### [MODIFY] `package.json`
- Reverted the previous `node server.js` changes to stick to your preferred static server (or Vite/Next if you choose).
- Add `@supabase/supabase-js` as a dependency.

## Verification Plan

- Start the static server.
- Verify we can read the existing `.env` variables.
- Successfully upload an image to Supabase Storage via the admin dashboard and see the live site update without touching the `public/` folder.
