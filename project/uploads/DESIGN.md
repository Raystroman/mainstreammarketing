# Radiant Obsidian Design System

### 1. Overview & Creative North Star
**Creative North Star: "The High-Performance Workshop"**
Radiant Obsidian is a design system crafted for luxury, precision, and raw power. It mimics the aesthetic of a high-end detailing studio at midnight: deep, obsidian surfaces illuminated by focused, amber-orange spotlights. It moves away from the "standard SaaS" look by embracing extreme typographic scales, intentional "dark-mode" depth, and cinematic lighting effects. 

The system rejects the flat grid in favor of **Tonal Fluidity**. Elements don't just sit on a page; they emerge from the shadows through gradients and glassmorphism, creating a sense of elite exclusivity.

---

### 2. Colors
The palette is built on a foundation of deep neutrals (`#0E0E0E`) punctuated by a high-energy "Radiant Orange" (`#FF9157`) and a technical "Electric Blue" (`#7999FF`).

*   **The "No-Line" Rule:** Sectioning is never achieved with 1px borders. Instead, use background shifts (e.g., moving from `surface` to `surface_container_low`) or subtle atmospheric gradients (`rgba(255, 145, 87, 0.08)`).
*   **Surface Hierarchy & Nesting:** Use `surface_container` variants to "stack" cards. A `surface_container_low` section should house `surface_container_highest` cards to create tactile depth without outlines.
*   **Glass & Gradient Rule:** Floating elements and navigation bars must use `backdrop-blur` (min 24px) and semi-transparent backgrounds (`rgba(26, 25, 25, 0.7)`).
*   **Signature Textures:** Apply radial gradients at 0.08% opacity of the `primary` color to hero sections to simulate studio lighting.

---

### 3. Typography
The system uses a high-contrast pairing: **Manrope** for headlines (authoritative, geometric) and **Inter** for body text (technical, legible).

**Typographic Rhythm (Based on Extracted Data):**
*   **Display (Hero):** 4rem to 5.5rem (64px - 88px), `font-black`, tracking-tighter. Leading should be tight (0.95).
*   **Headlines:** 3rem to 3.75rem (48px - 60px) for section starts.
*   **Sub-Headlines:** 1.5rem to 1.875rem (24px - 30px) for component titles.
*   **Body Text:** 1.125rem (18px) for primary reading, 0.875rem (14px) for secondary descriptions.
*   **Labels/Captions:** 10px to 13px, `font-bold`, uppercase, with extreme letter spacing (0.2em to 0.3em). This creates a "technical instrumentation" feel.

---

### 4. Elevation & Depth
Elevation is expressed through light emission rather than physical height.

*   **The Layering Principle:** Use the `surface-container` tiers to create a "recessed" or "protruding" effect. 
*   **Ambient Shadows:** Use `shadow-2xl` for large cards, but augment them with "Glow Shadows" for interactive elements. For example, a primary button should have a `0 20px 50px rgba(255, 145, 87, 0.3)` shadow to simulate a neon glow.
*   **Active Pulse:** Interactive status indicators (like "Live" tags) should use a CSS pulse animation: `0 0 0 10px rgba(34, 197, 94, 0)` to indicate real-time activity.
*   **The Ghost Border Fallback:** If a separation is strictly required, use `outline_variant` at 20% opacity.

---

### 5. Components

*   **Buttons:**
    *   **Primary:** Large, `rounded-2xl` or `rounded-full`, using a linear gradient from `primary` to `primary_fixed`. High-impact glow shadows are mandatory.
    *   **Ghost:** Use `on_surface_variant` text with a primary-color hover state and a scale-down transition (0.95) on click.
*   **Cards (Glass-Card):**
    *   `backdrop-filter: blur(24px)` with a `surface_container` base at 70% opacity. Borders should be `white/5`.
*   **Live Activity Feed:** Items should appear as `surface_container_lowest` tiles with high-contrast icons (Primary/Blue/Green) to denote different event types.
*   **Data Visualization:** Bars and charts should use `primary` with varying opacities and glow effects to mimic illuminated LEDs.

---

### 6. Do's and Don'ts

**Do:**
*   Use `italic` sparingly within headlines to emphasize key "action" words.
*   Apply `grayscale` to photography by default, revealing full color only on hover to maintain the "Dark Studio" aesthetic.
*   Use "staggered" entry animations (fade-in-up) for all grid-based content.

**Don't:**
*   Never use pure white (`#FFFFFF`) for large blocks of body text; use `on_surface_variant` (`#ADAAAA`) to reduce eye strain.
*   Avoid sharp corners; the minimum radius for any container should be `0.75rem` (xl), with hero containers reaching `2.5rem`.
*   Don't use traditional "Sidebar" navigation. Use floating, blurred headers or bottom-docked menus to maintain the editorial layout.