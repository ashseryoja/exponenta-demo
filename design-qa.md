# Hero redesign QA — 2026-09-21

final result: passed

## Current source and scope

Source before-state: `/var/folders/6j/zzbt25dx4w94qh7jsw7c_7fw0000gn/T/codex-clipboard-03529ec3-f912-40b3-bc9e-386e96cfb79f.png` (1125×2436, includes iOS and Safari chrome, approximately 375 CSS px wide at 3× density). The request is an intentional hero redesign with a readable full headline, not a pixel-for-pixel clone. Brand colors, original GLB, logo, Armenian fonts and copy remain the source.

Implementation: http://127.0.0.1:5173/ . Browser screenshots are inline task artifacts, not saved filesystem files. Source and revised screenshots were emitted together in one comparison input. Reviewed content regions, excluding the source's browser chrome; no exact pixel comparison is claimed. Viewports: 375×667, 390×844 and 1280×720 CSS px at 1× capture density. Full views show headline/product/CTA relationships clearly, so focused crops were unnecessary. DOM bounds supplement the short-screen capture.

## Current findings and iteration history

- [P1, resolved] Original final word was pale and hidden behind the cup. The complete headline now occupies two high-contrast lines above a separate mobile product stage, with a solid pink final word.
- [P2, resolved] Original mobile CTA fell below Safari's visible content. At 375×667 the new CTA occupies y569–620; the footer hint remains visible and document width equals viewport width.
- [P2, resolved in the second comparison] Initial short-screen cup placement was too close to the final line. Moved its stage down, reduced the compact scale/height and tap lift. The revised comparison shows clear separation between letters and lid.
- [P2, resolved] Mobile fading previously depended on viewport multiples. The canvas now transfers to the reserved pink-section product area using real section positions. At the taste anchor in 375×667, opacity is 1, canvas bounds y148–543, and copy begins at y669. A subsequent screenshot shows the cup leaving above the heading without crossing the body text.

## Required visual surfaces and checks

- Typography: retained real Noto Sans Armenian and local Montserrat Armenian, deliberate two-line hero wrapping, readable solid display lettering.
- Spacing/layout: centered mobile headline, separate cup area, full-width CTA; desktop uses headline/CTA left and cup right. Short/tall phones and desktop inspected.
- Colors: retained lime, plum and pink; pink circular background, plum protein badge and existing-library SVG accents provide focus.
- Images: authentic logo and original textured user GLB retained; no emoji or raster substitute for the model.
- Copy: Armenian content retained; visible CTA is “Բացահայտիր համը”.
- Interactions: hero CTA navigates to `#taste`; logo returns to hero; model responds to taps and scroll; entry animations observed. Browser error/warning log empty. Production build passes with the existing bundle-size advisory.

Physical iPhone Safari, reduced-motion emulation and WebGL failure were not tested in this pass. The supplied GLB remains 12.6 MB and about 240k triangles.

---

# Earlier QA history (superseded where described above)

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
