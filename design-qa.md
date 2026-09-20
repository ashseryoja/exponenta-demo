# Exponenta demo — visual and interaction QA

final result: passed

## Scope and visual reference

This is an original promotional prototype derived from the brand's Instagram photography, not a pixel-for-pixel website clone. Source visual truth: `../research/instagram/01-pink-fitness.jpg` (1638×2048), `../research/instagram/03-lifestyle.jpg` (3072×4096), provided `../3d.glb`, and the brand avatar acquired from the Instagram page. Palette, original branding, product identity, and lifestyle imagery informed the design. Lime and large display typography are intentional additions.

Implementation: http://127.0.0.1:5173/ . Browser screenshots were inspected inline in the task, not saved to disk. Desktop CSS viewport 1280×720; mobile CSS viewport 390×844. Source photographs are assets rather than same-viewport screen designs, so an exact frame comparison/density normalization is not applicable.

## Observed results

- Desktop: introductory logo and typography sequence, reveal transition, floating GLB on lime hero, rotation/position change into pink product section, readable product details and controls.
- Mobile: full first-screen composition including model, label and CTA, no horizontal overflow; product information and photos are readable in a single column. Model fades before the content area; rotation controls return to the model's view.
- Photos retain source identity and are encoded to WebP for the site; they were observed loaded in the lifestyle section.
- Actual brand avatar used for the introductory emblem and header; provided geometry and texture used for the 3D product.
- Armenian typography: self-hosted Noto Sans Armenian at weight 900 for display headings and Montserrat Armenian for body/navigation. The Latin brand name retains its display style. Desktop and mobile Armenian wrapping inspected; no horizontal overflow at 1280×720 and 390×844.
- Pink, lime, and dark plum remain consistent through sections. Original turquoise emblem preserved.
- Product text uses the verified raspberry–banana SKU and 30 g protein per cup; no unsupported flavor-switching claims.

## Interaction checks

Verified in browser: navigation to taste section, scroll-driven 3D scene, drag interaction, auto-rotate toggled on, product details expanded, replay button showing intro again, automatic intro exit, valid Instagram destinations. Desktop and mobile layouts inspected. Browser error/warning logs were empty during final checks. DOM showed a canvas and no horizontal overflow. Production build passed.

## Fix history

- P2: fixed clipping region moving with the product between right/left scenes.
- P2: adjusted scale and entry timing so the model's entrance follows the intro reveal.
- P2: reduced model visibility before mobile text, added mobile return to model for rotation controls.
- P2: softened letter spacing and made mobile POWER text readable without relying on outline rendering.
- P2: changed automatic rotation to preserve orientation on pause.

No remaining actionable P0/P1/P2 findings observed within this demo's scope.

## Limitations / optional polish

The supplied GLB is about 12.6 MB and 240k triangles. It works in the tested desktop browser; lower-end physical phones were not tested. Mesh simplification and texture compression can follow for public launch. WebGL failure fallback and reduced-motion behavior exist in code but were not separately simulated during UI checks. All authored UI copy, metadata, alt text and accessible control labels are now Armenian. Original supplied packaging and brand photographs retain their original printed labels. Armenian copy has not received an independent native-speaker editorial review.

## Revision — Armenian and more active 3D (2026-09-21)

- Replaced interface copy with Armenian and set document language to `hy`.
- Choreographed seven scroll poses beginning at scroll zero. At approximately 130 px of desktop scroll, the model was visibly rotated from its initial front view.
- Added idle bobbing/tilting, stronger pointer response, tap/Enter/Space full rotation with lift, and a longer spinning entrance.
- Desktop tap response and expanded Armenian product description inspected in the browser; no error/warning logs.
- Corrected mobile fade thresholds to 0.86–1.10 viewport heights so the model is gone before the product copy; verified opacity 0 and readable text at scrollY 1181.5 in a 390×844 viewport.
- Mobile rotation button changes to Armenian stop label and returns to the model at the beginning of the page.
- Browser screenshots inspected inline, not saved as files. Production build passed.
