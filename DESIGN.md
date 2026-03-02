
# DESIGN DOCUMENT
## Project: Uncontrollable
## Design System: Brutalist Interaction Design

---

## 1. Design Philosophy

### Core Principle
**The interface must look simple enough that resistance feels intentional, not broken.**

Brutalism is not ugliness.  
It is honesty, friction, and refusal to please.

The UI must:
- Look functional
- Feel rigid
- Resist polish
- Avoid friendliness

Behavior is expressive.  
Visuals are restrained.

---

## 2. Visual Direction

This project follows **Brutalist / Anti-UX** design principles.

Key characteristics:
- Hard edges
- Minimal color
- Uneven spacing
- Visual tension
- Deliberate awkwardness

Avoid decorative or trendy brutalism.

---

## 3. Color System

### Palette Rules
- Monochrome first
- No gradients
- No beauty shadows
- Color only when absolutely required

### Base Colors
```
Background: #FFFFFF or #F4F4F4
Primary Text: #000000
Secondary Text: #333333
Borders: #000000
Disabled: #9A9A9A
```

### Accent (Optional – Pick ONE)
```
State Shift: #FF0000  (or #0000FF, not both)
```

---

## 4. Typography

### Font Rules
- System fonts only
- No custom fonts
- No rounded or playful typefaces

### Font Stack
```css
font-family:
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Helvetica,
  Arial,
  sans-serif;
```

### Type Scale
```
Title: 24–28px (regular)
Body: 14–16px (regular)
Labels: 12px (uppercase optional)
```

---

## 5. Layout Rules

- Single-screen interface
- No scrolling by default
- Avoid perfect centering
- Slight imbalance is intentional

Spacing:
- Uneven padding allowed
- Misalignment is deliberate
- Symmetry discouraged

The layout should feel *functional*, not designed.

---

## 6. UI Components

### Buttons
**Appearance**
- Flat
- Rectangular
- Black border
- No shadows
- No glow

**Behavior**
- Fast clicking → ignored
- Repetition → refusal
- Calm pacing → response

---

### Sliders
**Appearance**
- Thin track
- Hard edges
- Small handle

**Behavior**
- Aggressive drag → resistance
- Slow movement → compliance
- Overshoot → snap-back

---

### Text Input
**Appearance**
- Plain rectangle
- Black border
- No focus glow

**Behavior**
- Frantic typing → ignored
- Pause before typing → accepted
- Input may delay or clear

---

### Window / Container
- Flat borders
- No elevation
- Close action not guaranteed
- May resist premature closure

---

## 7. Motion & Animation

### Motion Philosophy
Motion communicates **intent**, not delight.

### Rules
- Slow animations
- Abrupt stops
- No bounce
- No elastic easing

### Allowed Motions
- Shake (resistance)
- Pause (hesitation)
- Delay (consideration)
- Snap (refusal)

### Forbidden Motions
- Bounce
- Glow
- Spring effects
- Decorative fades

---

## 8. Feedback Without Explanation

Absolutely NO:
- Tooltips
- Toasts
- Error messages
- Helper text
- Loading spinners

Feedback must be:
- Visual
- Physical
- Temporal

Users must feel what happened, not read it.

---

## 9. Accessibility

Brutalist does not mean hostile.

Requirements:
- High contrast text
- Reduced-motion mode
- No permanent lock-outs
- Always allow escape

Accessibility reduces resistance, not removes it.

---

## 10. Do / Don’t Summary

### DO
- Flat UI
- Hard edges
- Monochrome
- Deliberate friction
- Uneven layouts

### DON’T
- Glassmorphism
- Neon colors
- Rounded corners
- Cute microcopy
- Startup polish

---

## 11. North Star

If the interface looks **nice**, it is wrong.  
If it looks **broken**, it is also wrong.  

It should look **inevitable**.
