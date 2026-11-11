# Signature Dish Photo Guidelines

> These rules apply to every photo used in the **Signature stage plate** on the Teenmaar website.
> Follow them for any new images, replacements, or AI-generated photos.

---

## 1. Subject Rules

| Rule | Detail |
|------|--------|
| **One dish only** | The hero food item — no papad, no extra bowls, no drinks, no garnish plates alongside |
| **No people** | No hands, no faces, no body parts in frame |
| **No text or logos** | No menu cards, packaging, stickers, restaurant branding visible in the photo |
| **Dish centred** | The dish should sit within the **central 70% of the frame** |

## 2. Framing & Margin

```
╔═══════════════════════╗  ← outer edge of photo
║  ░░░ 15% dead zone ░░ ║  ← nothing important here — clipped by the circle
║  ┌───────────────┐    ║
║  │               │    ║
║  │   DISH HERE   │    ║  ← dish + its full shadow within this inner 70%
║  │               │    ║
║  └───────────────┘    ║
║  ░░░░░░░░░░░░░░░░░░░  ║
╚═══════════════════════╝
```

- **At least 12% empty margin on all sides** between the dish and the photo edge.
- **Nothing important in the outer 15%** — the circular mask clips this zone.

## 3. Technical Specs

| Property | Requirement |
|----------|-------------|
| **Format** | JPG or WebP |
| **Minimum size** | 1 000 × 1 000 px |
| **File size** | Under 200 KB (use `npm run images:plates` to compress) |
| **Preferred ratio** | **1 : 1 square** — the plate component shows the full dish for other ratios, but square photos look best |
| **Colour space** | sRGB |
| **Bit depth** | 8-bit |

## 4. Auto Fit Detection

The plate component automatically picks a render mode based on the photo's natural ratio:

| Ratio | Auto mode | Behaviour |
|-------|-----------|-----------|
| 0.9 – 1.1 (square) | **cover** | Fills the circle; use `focus` + `zoom` in `signature.ts` to fine-tune |
| < 0.9 or > 1.1 (portrait / landscape) | **contain** | Full dish always visible; blurred dark copy fills the background |

Override with `fit: "cover" | "contain"` on a specific dish entry in `signature.ts`.

## 5. Processing Workflow

1. Put the raw, full-resolution photo in `incoming-images/signature/` named by dish slug:

   ```
   incoming-images/signature/paneer-butter-masala.jpg
   incoming-images/signature/chicken-fry-biryani.jpg
   ```

2. Run:

   ```bash
   npm run images:plates
   ```

   The script writes a 1 000 × 1 000 JPG to `public/images/signature/` and moves the original
   to `incoming-images/signature/done/`.

3. Check the output visually by running `npm run dev`.

4. If the crop point is off for a square photo, set `focus` and/or `zoom` in
   `src/data/signature.ts` for that dish and re-run.

> [!NOTE]
> `incoming-images/` is listed in `.gitignore`. Never commit raw, uncompressed photos.

## 6. Quick Checklist Before Submitting a Photo

- [ ] Only the main dish is in frame — no extra items
- [ ] Dish fills roughly the central 70%, with ≥ 12% margin on all sides
- [ ] Nothing important within the outer 15% of the frame
- [ ] No people, text, or logos
- [ ] Minimum 1 000 × 1 000 px, under 200 KB after processing
- [ ] Named by slug matching `src/data/signature.ts` (e.g. `chicken-fry-biryani.jpg`)
