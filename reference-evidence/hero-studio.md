# Hero studio and catalog — 28 September 2026

- Revisited https://boc.studio/work in browser: indexed project chapters, large and small adjacent image panels. Adapted to catalog category chapters with a clear all-items action and a standard grid toggle. Searches and filters display every match, not chapter excerpts.
- https://noho.ink provides product configuration by colour. Adaptation selects actual AK-47 catalog entries; background and zoom are viewing controls, never fabricated sellable finishes.
- Retrieved original Steam CDN PNG renders via image URLs in https://github.com/ByMykel/CSGO-API (public/api/en/skins.json); images live in public/hero. Names: AK-47 | Asiimov, Red Laminate, X-Ray. Valve product imagery, not generated assets.
- Both old and new canvases are 1920×1080. Steam source has an approximately 500×250 visible object with transparent margins. CSS centres that object and limits normal display width to 520 CSS pixels; this is not a claim of a native 1920-pixel weapon render. High-DPI source detail remains limited by the supplied render.
- Removed hero's wave, idle rotation, and cursor translation combination. Single 550 ms entry, reduced-motion bypass. User controls preview scale 80–115% and three neutral/orange display backgrounds.
- Real image load feedback plus route/catalog Suspense skeletons, without artificial loading delays or fabricated progress.
- QA: desktop first-screen boundary 800 px in 800 px viewport; mobile 844 px in 844 px viewport, no horizontal overflow. Red Laminate changes name/image/link together; background changes; keyboard range changes 100 to 101%. Knife chapter opens 29 actual items. Searches combine with category.

## 2026-09-28: real 3D replacement
- Replaced raster hero with Three.js WebGL geometry, OrbitControls, physically based material and studio environment lighting.
- Model: Valve CS2 workshop geometry, `weapon_rif_ak47.obj`, from https://media.steampowered.com/apps/csgo/images/workshop/workshop/cs2_weapon_model_geometry.zip (linked by https://www.counter-strike.net/workshop/workshopresources).
- Hero material is an original FLARE colour treatment, explicitly labelled as such, not sold as an exact Asiimov skin. Actual catalog images/prices are unchanged.
- Removed background selector and raster finish switching. Fixed orange scene, drag/keyboard rotation, reset, real model loading feedback and failure route to catalog.

## 3D interaction follow-up
- Reproduced desktop drag successfully before editing. The static initial pose and OrbitControls' inline default cursor made interaction unclear; touch pan-y also conflicted with vertical orbit gestures.
- Added delta-time auto orbit (paused on manual interaction), explicit pause/resume, smoothly interpolated detail zoom, ceramic/metal material switching, and grab cursor override. Canvas owns touch gestures; page scrolling remains available outside it.
- Reduced-motion preference starts with auto orbit disabled and removes the zoom easing. Offscreen/hidden scenes do not render.
- Verified actual mouse drag, reset, pause, zoom and material state changes in browser. Build, lint and TypeScript passed.
