# Design System — Linecard

## Direction

Style: large-catalogue retail (Amazon / Flipkart class UX patterns)  
Mood: trustworthy, scannable, conversion-clear  
Principles: search always reachable; product cards for browse; strong price + rating; enquire CTA as primary action on detail

## Brand

**Name:** Linecard  
Wordmark in the primary header (always visible). Green accent for trust/actions.

## Color

```css
--color-ink: #131921;
--color-bg: #eaeded;
--color-surface: #ffffff;
--color-text: #0f1111;
--color-muted: #565959;
--color-border: #d5d9d9;
--color-primary: #067647;      /* Linecard green */
--color-primary-dark: #054f31;
--color-accent: #ffd814;       /* commerce CTA yellow */
--color-accent-hover: #f7ca00;
--color-error: #b12704;
--color-link: #007185;
```

Fonts: **IBM Plex Sans** (UI). **IBM Plex Serif** for brand wordmark, hero, and page titles.

## Layout patterns

- Sticky commerce header: logo · search · account  
- Secondary category strip  
- Product grid cards (image, title, stars, price)  
- Detail: media + buy-box (price, rating, Enquire)  

## Motion

Page enter fade/slide; card hover lift + image scale; staggered product reveal; shimmer skeletons; button busy spinner. Respect `prefers-reduced-motion`.
