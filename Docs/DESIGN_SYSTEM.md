# Oyen — Design System

Nama aplikasi: **Oyen**

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#EA580C` | Buttons, links, active states, brand accent |
| Primary Hover | `#C2410C` | Button hover, pressed states |
| Background | `#FFF7ED` | Page background, app shell |
| Surface | `#FFFFFF` | Cards, modals, inputs, elevated containers |
| Border | `#FED7AA` | Card borders, dividers, input borders |
| Success | `#22C55E` | Success messages, positive status |
| Warning | `#F59E0B` | Warning banners, pending states |
| Error | `#EF4444` | Error messages, destructive actions, validation |
| Info | `#3B82F6` | Informational banners, tooltips |
| Text | `#0F172A` | Primary text, headings |
| Secondary | `#64748B` | Secondary text, labels, placeholders, muted content |

---

## CSS Variables (Tailwind / globals.css)

```css
:root {
  --color-primary: #EA580C;
  --color-primary-hover: #C2410C;
  --color-background: #FFF7ED;
  --color-surface: #FFFFFF;
  --color-border: #FED7AA;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  --color-text: #0F172A;
  --color-secondary: #64748B;
}
```

---

## Usage Guidelines

- **Primary** → CTA buttons, nav active indicator, brand elements
- **Primary Hover** → hover/pressed state for primary buttons
- **Background** → warm off-white for full page bg (gives warm pet-friendly feel)
- **Surface** → cards, panels, inputs sit on top of background
- **Border** → subtle warm borders matching the orange palette
- **Text** → dark slate for readability
- **Secondary** → muted labels, timestamps, helper text

---

## Typography

- Font: Geist Sans (already configured)
- Headings: `font-semibold`, color `Text`
- Body: `font-normal`, color `Text`
- Muted/labels: color `Secondary`

---

## Component Patterns

### Buttons

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Primary | `Primary` | white | none |
| Primary hover | `Primary Hover` | white | none |
| Outline | transparent | `Primary` | `Border` |
| Ghost | transparent | `Text` | none |
| Destructive | `Error/10%` | `Error` | none |

### Cards

- Background: `Surface`
- Border: `Border`
- Border radius: `rounded-xl`

### Inputs

- Background: `Surface`
- Border: `Border`
- Focus border: `Primary`
- Placeholder: `Secondary`

### Status Badges

| State | Color |
|-------|-------|
| Active/Success | `Success` |
| Pending/Warning | `Warning` |
| Error/Failed | `Error` |
| Info | `Info` |

---

## Brand Identity

- App name: **Oyen** (orange cat — hence the warm orange palette)
- Tone: warm, friendly, approachable
- The orange palette evokes pet warmth and playfulness
