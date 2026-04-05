# Design System Specification: The Playful Curator

## 1. Overview & Creative North Star: "Structured Joy"
This design system moves away from the chaotic "toy box" aesthetic of the past and toward a **Playful Curator** approach. We are building a digital experience that feels like a high-end, boutique toy gallery: organized and trustworthy for parents, yet vibrant and energetic for children.

The "Creative North Star" is **Structured Joy**. We achieve this by breaking the traditional, rigid web grid through intentional asymmetry and "gravity-defying" layouts. We use overlapping elements, varying corner radii, and a sophisticated layering system to create a sense of movement and discovery, ensuring the interface feels like a physical playground rather than a static document.

---

## 2. Colors: Tonal Energy
Our palette uses high-chroma primaries balanced by a sophisticated "Air Blue" background system to ensure the UI feels breathable and premium.

### The Palette
*   **Primary (`#b9002c`):** Vibrant Red. Used for high-energy actions and brand anchors.
*   **Secondary (`#0055c4`):** Friendly Blue. The "trust" anchor, used for secondary navigation and reliable information.
*   **Tertiary (`#6d5a00` / `#fdd400`):** Sunny Yellow. Used sparingly as a "spark" for highlights and celebratory moments.
*   **Background (`#edf8ff`):** A soft, airy blue that prevents the "stark white" clinical feel.

### The "No-Line" Rule
**Standard 1px borders are strictly prohibited for sectioning.** We define boundaries through "Tonal Shifts." To separate content, transition from `surface` to `surface-container-low` or `surface-container-high`. This creates a soft, organic flow that mimics the physical curves of high-quality wooden or molded plastic toys.

### The "Glass & Gradient" Rule
To add "soul," use a subtle **Inner Glow Gradient** on primary buttons: a linear transition from `primary` to `primary_container`. For floating overlays (like cart previews or mobile menus), use **Glassmorphism**:
*   **Background:** `surface` at 70% opacity.
*   **Effect:** `backdrop-filter: blur(12px)`.

---

## 3. Typography: The Friendly Voice
We utilize a dual-font strategy to balance character with legibility.

*   **Display & Headlines (Plus Jakarta Sans):** A modern sans-serif with a wide stance and friendly apertures. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero sections to create a bold, editorial impact.
*   **Body & Titles (Be Vietnam Pro):** Chosen for its exceptional legibility and soft, rounded terminals. It mirrors the "rounded corner" language of the UI components.

**Hierarchy Tip:** Always pair a `display-sm` headline in `on_background` with a `title-md` sub-headline in `secondary` to create a "bouncing" visual rhythm that feels energetic.

---

## 4. Elevation & Depth: Tonal Layering
In this system, depth is a product of color, not just shadow.

*   **The Layering Principle:** Use the `surface-container` tiers to "stack" importance.
    *   *Base:* `surface`
    *   *Section:* `surface-container-low`
    *   *Card:* `surface-container-lowest` (pure white) to make it "pop" off the page.
*   **Ambient Shadows:** For elements that must float (e.g., Modals), use a "Toy Shadow":
    *   `box-shadow: 0 20px 40px rgba(28, 49, 59, 0.06);`
    *   The shadow is tinted with the `on_surface` color, never pure black, to keep the look soft and natural.
*   **The Ghost Border:** If a border is required for accessibility on inputs, use `outline_variant` at **15% opacity**. Never use a 100% opaque stroke.

---

## 5. Components

### Buttons: The "Squish" Interaction
*   **Primary:** Background `primary`, text `on_primary`. Use `xl` (3rem) corner radius. On hover, apply a subtle scale-down (0.98) to mimic the "squish" of a soft toy.
*   **Tertiary (Ghost):** No background. Use `primary` text. Never use a border; rely on the `surface-variant` hover state to define the hit area.

### Cards: The "Container-First" Approach
*   **Design:** Forbid divider lines. Separate the product image from the description using a color block of `surface_container`.
*   **Radius:** Use `lg` (2rem) for the outer container and `md` (1.5rem) for internal nested elements (like "Add to Cart" buttons).

### Input Fields: Soft Inputs
*   **Background:** `surface_container_highest` at 50% opacity.
*   **Corners:** `md` (1.5rem).
*   **Interaction:** On focus, the background shifts to `surface_container_lowest` (white) with a `secondary` 2px "Ghost Border."

### Specialized Component: The "Joy Badge"
Used for discounts or "New" arrivals. A circular or "blob" shaped element using `tertiary_container` with a slight rotation (±5 degrees) to break the verticality of the layout.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place a large product image overlapping the edge of a `surface-container-low` background section.
*   **Embrace White Space:** Use the `xl` spacing scale to give toys room to "breathe"—premium brands don't clutter.
*   **Use Rounded Everything:** Ensure even the smallest icons have rounded caps and joins.

### Don’t:
*   **Don't use 1px Dividers:** Use a 24px vertical gap or a background color shift instead.
*   **Don't use Sharp Corners:** Even "standard" buttons should have at least a `sm` (0.5rem) radius. Sharp corners feel "dangerous" in a child-focused context.
*   **Don't use Pure Black:** Use `on_surface` (`#1c313b`) for all text to maintain a soft, sophisticated contrast.

---

## 7. Roundedness Scale
*   **none:** `0px` (Forbidden for UI, reserved for full-bleed images only).
*   **sm:** `0.5rem` (Small badges, tags).
*   **DEFAULT:** `1rem` (Standard input fields).
*   **md:** `1.5rem` (Buttons, nested card elements).
*   **lg:** `2rem` (Main product cards, content blocks).
*   **xl:** `3rem` (Hero containers, large promotional banners).
*   **full:** `9999px` (Pill buttons, search bars).