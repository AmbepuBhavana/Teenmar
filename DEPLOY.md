# Teenmaar Telugu Kitchen production deployment

## Cloudflare Pages

```sh
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name teenmaar-telugu-kitchen
```

## Netlify

```sh
npm run build
```

Then drag the `dist` folder to [app.netlify.com/drop](https://app.netlify.com/drop).

## Production checklist

- Confirm real photos, the WhatsApp number, and Google review consent.
- Verify the menu, hours, and contact details are current.
- Ensure the site is not blocked from indexing and the canonical / `og:url` metadata is live.
- Publish `sitemap.xml` and point the real domain.
