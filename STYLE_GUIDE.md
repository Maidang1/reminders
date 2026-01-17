# Blueprint Design System

A comprehensive style guide for creating technical, engineering-inspired web interfaces with a blueprint aesthetic.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Design Tokens](#design-tokens)
3. [Typography](#typography)
4. [Color System](#color-system)
5. [Spacing & Layout](#spacing--layout)
6. [Grid System](#grid-system)
7. [Borders & Lines](#borders--lines)
8. [Patterns & Textures](#patterns--textures)
9. [Components](#components)
10. [Icons & Illustrations](#icons--illustrations)
11. [Motion & Animation](#motion--animation)
12. [Responsive Design](#responsive-design)
13. [Accessibility](#accessibility)
14. [Code Examples](#code-examples)

---

## Design Philosophy

This design system draws inspiration from **engineering blueprints** and **technical drawings**, creating a unique aesthetic that communicates precision, reliability, and technical sophistication.

### Core Principles

| Principle     | Description                                             |
| ------------- | ------------------------------------------------------- |
| **Precision** | Clean lines, exact measurements, and structured layouts |
| **Clarity**   | High contrast, clear hierarchy, and readable typography |
| **Technical** | Engineering-inspired patterns and visual metaphors      |
| **Minimal**   | Reduced color palette, purposeful decoration            |

---

## Design Tokens

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-orange: #f6821f;
  --color-orange-light: #ffaa5b;
  --color-black: #1a1a1a;
  --color-gray-dark: #4a4a4a;
  --color-gray: #888888;
  --color-gray-light: #e5e5e5;
  --color-bg: #f5f5f0;
  --color-white: #ffffff;

  /* Typography */
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Borders */
  --border: 1px solid var(--color-black);
  --border-light: 1px solid var(--color-gray-light);

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 40px;
  --space-3xl: 64px;
  --space-4xl: 100px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 100px;
  --radius-circle: 50%;

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}
```

---

## Typography

### Font Stack

| Category      | Font Family      | Fallback                  | Usage                          |
| ------------- | ---------------- | ------------------------- | ------------------------------ |
| **Display**   | DM Serif Display | Georgia, serif            | Headlines, section titles      |
| **Body**      | Inter            | -apple-system, sans-serif | Body text, UI elements         |
| **Monospace** | JetBrains Mono   | monospace                 | Code, terminal, technical data |

### Type Scale

| Level             | Size                     | Line Height | Weight | Font      |
| ----------------- | ------------------------ | ----------- | ------ | --------- |
| **Hero**          | clamp(80px, 15vw, 200px) | 1.0         | 400    | Display   |
| **Section Title** | clamp(48px, 8vw, 80px)   | 1.1         | 400    | Display   |
| **H2**            | 20px                     | 1.4         | 600    | Body      |
| **H3**            | 16px                     | 1.4         | 600    | Body      |
| **Body**          | 14px                     | 1.6-1.7     | 400    | Body      |
| **Small**         | 13px                     | 1.6         | 400    | Body      |
| **Caption**       | 12px                     | 1.5         | 400    | Body/Mono |
| **Code**          | 12-13px                  | 1.7-1.8     | 400    | Mono      |
| **Micro**         | 10-11px                  | 1.4         | 400    | Mono      |

### Typography Examples

```css
/* Hero Title - Large watermark style */
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(80px, 15vw, 200px);
  font-weight: 400;
  letter-spacing: -0.02em;
  opacity: 0.15;
}

/* Section Title */
.section-title {
  font-family: var(--font-display);
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 400;
  text-align: center;
}

/* Body Text */
.body-text {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-gray-dark);
}

/* Code Block */
.code {
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.7;
}
```

---

## Color System

### Primary Palette

| Name             | Hex       | OKLCH                 | Usage                    |
| ---------------- | --------- | --------------------- | ------------------------ |
| **Orange**       | `#F6821F` | `oklch(0.72 0.17 50)` | Accent, highlights, CTAs |
| **Orange Light** | `#FFAA5B` | `oklch(0.80 0.14 60)` | Secondary accent         |
| **Black**        | `#1A1A1A` | `oklch(0.145 0 0)`    | Text, borders, primary   |
| **White**        | `#FFFFFF` | `oklch(1 0 0)`        | Backgrounds, cards       |

### Neutral Palette

| Name           | Hex       | Usage                   |
| -------------- | --------- | ----------------------- |
| **Gray Dark**  | `#4A4A4A` | Secondary text          |
| **Gray**       | `#888888` | Tertiary text, icons    |
| **Gray Light** | `#E5E5E5` | Light borders, dividers |
| **Background** | `#F5F5F0` | Page background         |

### Color Usage Guidelines

```
┌─────────────────────────────────────────────────────────┐
│  Background: #F5F5F0 (warm off-white)                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Card Background: #FFFFFF                         │  │
│  │  Border: #1A1A1A (1px solid)                      │  │
│  │                                                   │  │
│  │  Primary Text: #1A1A1A                            │  │
│  │  Secondary Text: #4A4A4A                          │  │
│  │  Tertiary Text: #888888                           │  │
│  │                                                   │  │
│  │  Accent: #F6821F (orange)                         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Code Syntax Colors

| Token        | Color        | Hex       |
| ------------ | ------------ | --------- |
| **Keyword**  | Black (bold) | `#1A1A1A` |
| **String**   | Orange       | `#F6821F` |
| **Comment**  | Gray         | `#888888` |
| **Variable** | Black        | `#1A1A1A` |

---

## Spacing & Layout

### Spacing Scale

| Token         | Value | Usage                    |
| ------------- | ----- | ------------------------ |
| `--space-xs`  | 4px   | Tight gaps, icon spacing |
| `--space-sm`  | 8px   | Small gaps, padding      |
| `--space-md`  | 16px  | Standard padding         |
| `--space-lg`  | 24px  | Section padding          |
| `--space-xl`  | 32px  | Large gaps               |
| `--space-2xl` | 40px  | Section headers          |
| `--space-3xl` | 64px  | Major sections           |
| `--space-4xl` | 100px | Section margins          |

### Container

```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### Section Spacing

```css
.section {
  padding: 0 24px 100px;
  max-width: 1400px;
  margin: 0 auto;
}
```

---

## Grid System

### Blueprint Grid Philosophy

The grid system mimics engineering drawings with:

- Precise column divisions
- Decorative side columns (60px)
- Visible grid lines (borders)

### Common Grid Patterns

#### 3-Column Header (with decoration)

```css
.header-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  border: var(--border);
}
```

```
┌──────────┬────────────────────┬──────────┐
│ diagonal │      Content       │ diagonal │
│  (1fr)   │       (2fr)        │  (1fr)   │
└──────────┴────────────────────┴──────────┘
```

#### 4-Column Feature Row

```css
.feature-row {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 60px;
}
```

```
┌────┬─────────────┬─────────────┬────┐
│ 60 │   Content   │   Visual    │ 60 │
│ px │    (1fr)    │   (1fr)     │ px │
└────┴─────────────┴─────────────┴────┘
```

#### 5-Column CTA Grid

```css
.cta-row {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 60px 60px;
}
```

#### Sidebar Layout

```css
.sidebar-layout {
  display: grid;
  grid-template-columns: 280px 1fr 60px;
}
```

---

## Borders & Lines

### Border Styles

| Type        | CSS                  | Usage               |
| ----------- | -------------------- | ------------------- |
| **Primary** | `1px solid #1A1A1A`  | Main borders, cards |
| **Light**   | `1px solid #E5E5E5`  | Subtle dividers     |
| **Dashed**  | `1px dashed #E5E5E5` | Decorative          |

### Border Management

To avoid double borders in grid layouts:

```css
/* Use border-top approach */
.row {
  border-top: var(--border);
}

.row:first-child {
  border-top: none;
}

/* Container handles outer borders */
.container {
  border: var(--border);
}

/* Cells handle right borders */
.cell {
  border-right: var(--border);
}

.cell:last-child {
  border-right: none;
}
```

---

## Patterns & Textures

### Diagonal Line Pattern

The signature blueprint texture using repeating diagonal lines.

```css
.diagonal-pattern {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 3px,
    oklch(0.145 0 0 / 0.1) 3px,
    oklch(0.145 0 0 / 0.1) 4px
  );
}
```

#### Pattern Variations

| Variant      | Opacity   | Line Width | Gap   |
| ------------ | --------- | ---------- | ----- |
| **Standard** | 0.06-0.08 | 1px        | 3-4px |
| **Subtle**   | 0.04      | 1px        | 3px   |
| **Bold**     | 0.1       | 1px        | 3px   |

### Grid Pattern (Background)

```css
.grid-pattern {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

---

## Components

### Cards

#### Basic Card

```css
.card {
  background: var(--color-white);
  border: var(--border);
  padding: 32px;
}
```

#### Window Card (with header)

```css
.window-card {
  background: var(--color-white);
  border: var(--border);
}

.window-card-header {
  padding: 8px 12px;
  border-bottom: var(--border);
  background: var(--color-bg);
}

.window-dots {
  display: flex;
  gap: 6px;
}

.window-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--color-gray);
}
```

### Buttons

#### Primary Button (Pill)

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 80px;
  background: var(--color-white);
  color: var(--color-black);
  text-decoration: none;
  font-size: 24px;
  font-weight: 500;
  border: var(--border);
  border-radius: 100px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--color-bg);
}
```

#### Command Button (Pill)

```css
.btn-command {
  display: inline-flex;
  align-items: center;
  padding: 16px 48px;
  background: var(--color-white);
  border: var(--border);
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--color-gray-dark);
}
```

#### Icon Button

```css
.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Navigation

#### Sidebar Navigation

```css
.nav-list {
  list-style: none;
}

.nav-item {
  border-bottom: var(--border);
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  text-decoration: none;
  color: var(--color-black);
  font-size: 14px;
  background: var(--color-white);
  transition: all 0.2s;
}

.nav-link::after {
  content: '›';
  font-size: 18px;
  color: var(--color-gray);
}

.nav-link:hover {
  background: var(--color-bg);
}

.nav-link.active {
  background: var(--color-black);
  color: var(--color-white);
}

.nav-link.active::after {
  color: var(--color-white);
}
```

### Code Blocks

```css
.code-block {
  background: var(--color-white);
  border: var(--border);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.7;
}

.code-block-header {
  padding: 8px 12px;
  border-bottom: var(--border);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.code-block-body {
  padding: 16px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
```

### Terminal

```css
.terminal {
  background: var(--color-white);
  border: var(--border);
  font-family: var(--font-mono);
  font-size: 12px;
}

.terminal-header {
  padding: 8px 12px;
  border-bottom: var(--border);
  background: var(--color-bg);
}

.terminal-body {
  padding: 12px;
}

.terminal-prompt {
  color: var(--color-gray);
}
```

### Testimonial Card

```css
.testimonial-card {
  padding: 32px;
  display: flex;
  flex-direction: column;
}

.testimonial-quote {
  font-size: 32px;
  line-height: 1;
  margin-bottom: 16px;
  font-family: Georgia, serif;
}

.testimonial-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-gray-dark);
  flex: 1;
}

.testimonial-divider {
  height: 1px;
  background: var(--color-black);
  margin: 24px 0;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
}

.author-title {
  font-size: 12px;
  color: var(--color-gray);
  font-family: var(--font-mono);
}
```

### Flow Nodes

```css
.node-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--color-black);
  background: var(--color-white);
  position: relative;
}

.node-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-orange);
}

.node-label {
  font-size: 12px;
  font-style: italic;
  color: var(--color-gray-dark);
}
```

### Icon Boxes

```css
.icon-box {
  width: 64px;
  height: 64px;
  border: var(--border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-white);
}

.icon-box.orange {
  background: var(--color-orange);
  border: none;
}

.icon-box.black {
  background: var(--color-black);
  border: none;
}

.icon-box.circle {
  border-radius: 50%;
}
```

### File Icon

```css
.file-icon {
  width: 48px;
  height: 56px;
  border: var(--border);
  background: var(--color-white);
  position: relative;
}

/* Dog-ear corner */
.file-icon::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: linear-gradient(
    -45deg,
    var(--color-bg) 50%,
    var(--color-gray-light) 50%
  );
}
```

### Chat Bubble

```css
.chat-bubble {
  background: var(--color-white);
  border: var(--border);
  padding: 12px 16px;
  font-size: 12px;
  line-height: 1.5;
  position: relative;
  max-width: 280px;
}

/* Arrow pointer */
.chat-bubble::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 12px;
  width: 8px;
  height: 8px;
  background: var(--color-white);
  border-left: var(--border);
  border-bottom: var(--border);
  transform: rotate(45deg);
}
```

---

## Icons & Illustrations

### Icon Style Guidelines

| Property         | Value                        |
| ---------------- | ---------------------------- |
| **Stroke Width** | 1.5-2px                      |
| **Style**        | Outline (stroke-based)       |
| **Color**        | `currentColor` or `#1A1A1A`  |
| **Size**         | 16px, 20px, 24px, 28px, 32px |

### SVG Icon Template

```html
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- paths here -->
</svg>
```

### Flow Pipe (SVG Path)

```html
<svg class="pipe-svg" viewBox="0 0 80 600" preserveAspectRatio="none">
  <path
    class="pipe-path"
    d="M 34 54 L 34 120 Q 34 140 54 140 L 70 140 Q 90 140 90 160 L 90 200 Q 90 220 70 220 L 54 220 Q 34 220 34 240 L 34 520"
  />
</svg>
```

```css
.pipe-path {
  fill: none;
  stroke: var(--color-orange);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

---

## Motion & Animation

### Transition Defaults

```css
/* Standard transition */
transition: all 0.2s ease;

/* Background only */
transition: background 0.2s ease;

/* Fast micro-interactions */
transition: all 0.15s ease;
```

### Spinner Animation

```css
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-gray-light);
  border-top-color: var(--color-black);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### Hover States

```css
/* Card hover */
.card:hover {
  background: var(--color-bg);
}

/* Link hover */
.link:hover {
  text-decoration: underline;
}

/* Button hover */
.btn:hover {
  background: var(--color-bg);
}
```

---

## Responsive Design

### Breakpoints

| Name        | Width          | Usage           |
| ----------- | -------------- | --------------- |
| **Desktop** | > 1024px       | Full layout     |
| **Tablet**  | 768px - 1024px | Simplified grid |
| **Mobile**  | < 768px        | Single column   |

### Responsive Patterns

#### Grid Collapse

```css
/* Desktop: Multi-column */
.grid {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 60px;
}

/* Tablet: Single column */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }

  /* Hide decorative columns */
  .decorative-column {
    display: none;
  }
}
```

#### Typography Scaling

```css
.hero-title {
  font-size: clamp(80px, 15vw, 200px);
}

.section-title {
  font-size: clamp(48px, 8vw, 80px);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 60px;
  }

  .section-title {
    font-size: 40px;
  }
}
```

#### Hide Decorative Elements

```css
@media (max-width: 1024px) {
  .diagonal-cell {
    display: none;
  }

  .side-column {
    display: none;
  }

  .decorative-icon {
    display: none;
  }
}
```

---

## Accessibility

### Color Contrast

| Combination        | Ratio  | Status             |
| ------------------ | ------ | ------------------ |
| Black on White     | 12.6:1 | ✅ AAA             |
| Gray Dark on White | 7.2:1  | ✅ AAA             |
| Gray on White      | 3.5:1  | ✅ AA              |
| Orange on White    | 3.1:1  | ⚠️ Large text only |
| White on Black     | 12.6:1 | ✅ AAA             |
| White on Orange    | 3.1:1  | ⚠️ Large text only |

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--color-black);
  outline-offset: 2px;
}

.btn:focus-visible {
  outline: 2px solid var(--color-orange);
  outline-offset: 2px;
}
```

### Screen Reader Considerations

```html
<!-- Decorative elements -->
<div class="diagonal-pattern" aria-hidden="true"></div>

<!-- Icon buttons -->
<button class="copy-btn" aria-label="Copy to clipboard">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Navigation state -->
<a href="#" class="nav-link active" aria-current="page"> File Operations </a>
```

---

## Code Examples

### Complete Section Template

```html
<section class="section">
  <!-- Header Row -->
  <div class="section-header-row">
    <div class="header-cell diagonal"></div>
    <div class="header-cell">
      <h2 class="section-title">Section Title</h2>
    </div>
    <div class="header-cell diagonal"></div>
  </div>

  <!-- Content Container -->
  <div class="section-container">
    <!-- Content here -->
  </div>
</section>
```

```css
.section {
  padding: 0 24px 100px;
  max-width: 1400px;
  margin: 0
```
 auto;
}

.section-header-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  border: var(--border);
  border-bottom: none;
}

.header-cell {
  padding: 40px;
  border-right: var(--border);
}

.header-cell:last-child {
  border-right: none;
}

.header-cell.diagonal {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 3px,
    oklch(0.145 0 0 / 0.1) 3px,
    oklch(0.145 0 0 / 0.1) 4px
  );
}

.section-container {
  border: var(--border);
  background: var(--color-white);
}
```

### Feature Row Template

```html
<div class="feature-row">
  <div class="feature-side feature-side-left"></div>
  <div class="feature-text">
    <h3>Feature Title</h3>
    <p>Feature description text goes here.</p>
  </div>
  <div class="feature-visual">
    <div class="feature-visual-cell diagonal">
      <!-- Visual content -->
    </div>
  </div>
  <div class="feature-side feature-side-right"></div>
</div>

<!-- Reversed layout -->
<div class="feature-row reverse">
  <div class="feature-side feature-side-right"></div>
  <div class="feature-text">
    <h3>Feature Title</h3>
    <p>Feature description text goes here.</p>
  </div>
  <div class="feature-visual">
    <div class="feature-visual-cell diagonal">
      <!-- Visual content -->
    </div>
  </div>
  <div class="feature-side feature-side-left"></div>
</div>
```

---

## Quick Reference

### CSS Variables Cheatsheet

```css
/* Copy this to your project */
:root {
  --color-orange: #F6821F;
  --color-black: #1A1A1A;
  --color-gray-dark: #4A4A4A;
  --color-gray: #888888;
  --color-gray-light: #E5E5E5;
  --color-bg: #F5F5F0;
  --color-white: #FFFFFF;
  
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  --border: 1px solid var(--color-black);
}
```

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Diagonal Pattern Snippet

```css
.diagonal {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 3px,
    oklch(0.145 0 0 / 0.1) 3px,
    oklch(0.145 0 0 / 0.1) 4px
  );
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-06 | Initial release |

---

*This style guide is based on the Cloudflare Sandbox website design and adapted for general use.*
