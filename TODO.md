# Uncontrollable — Project To-Do List

> Derived from `Uncontrollable_PRD.md`, `DESIGN.md`, and `TECH_STACK.md`

---

## 🔧 Project Setup

- [ ] Initialize React project with **Vite** (`npx create-vite`)
- [ ] Configure **TypeScript** in strict mode (`"strict": true`, no `any`, no implicit `undefined`)
- [ ] Set up **ESLint** with strict rules (no unused variables, no `console.log` in prod)
- [ ] Set up **Prettier** with minimal config
- [ ] Set up **Vitest** for testing
- [ ] Install **pnpm** or **npm** as package manager
- [ ] Create project folder structure:
  ```
  src/
   ├─ engine/
   │   ├─ state.ts
   │   ├─ rules.ts
   │   └─ decay.ts
   ├─ components/
   │   ├─ Button.tsx
   │   ├─ Slider.tsx
   │   └─ Input.tsx
   ├─ behaviors/
   │   ├─ refuse.ts
   │   ├─ delay.ts
   │   └─ resist.ts
   └─ App.tsx
  ```

---

## 🧠 State Engine (`src/engine/`)

- [ ] Build internal state object with `patience`, `trust`, `fatigue`, `engagement` (all `0.0–1.0`)
- [ ] Implement `state.ts` — holds and exposes the current internal state
- [ ] Implement `rules.ts` — maps user interactions to state transitions
  - Track **speed**, **repetition**, **pauses**, **aggression**, **idleness**
- [ ] Implement `decay.ts` — handles natural decay/recovery of state over time
  - Resistance must always decay (mitigates frustration)
- [ ] Write explicit state transition function: `nextState = applyInteraction(prevState, interaction)`
- [ ] Ensure all state updates are **immutable**
- [ ] Ensure all behavior is **deterministic** — randomness may modify, never define

---

## ⏱ Timing & Interaction Detection

- [ ] Implement timing utilities using `performance.now()` and `requestAnimationFrame`
- [ ] Detect **click speed** (fast vs. calm pacing)
- [ ] Detect **drag speed** on sliders (aggressive vs. slow)
- [ ] Detect **typing cadence** (frantic vs. paused)
- [ ] Detect **repetition** of the same action
- [ ] Detect **idle time** between interactions

---

## 🎭 Behavior System (`src/behaviors/`)

- [ ] Implement `refuse.ts` — element completely ignores the action
- [ ] Implement `delay.ts` — element responds after a deliberate pause
- [ ] Implement `resist.ts` — element partially complies or fights back (e.g., snap-back)
- [ ] Add partial compliance behavior (element sort-of does what was asked)

---

## 🖼 UI Components (`src/components/`)

### Button (`Button.tsx`)
- [ ] Flat, rectangular, black-bordered, no shadows/glow
- [ ] Fast clicking → ignored
- [ ] Calm pacing → responds
- [ ] Repetition → refusal

### Slider (`Slider.tsx`)
- [ ] Thin track, hard edges, small handle
- [ ] Aggressive drag → resistance
- [ ] Slow movement → compliance
- [ ] Overshoot → snap-back

### Text Input (`Input.tsx`)
- [ ] Plain rectangle, black border, no focus glow
- [ ] Frantic typing → ignored
- [ ] Pause before typing → accepted
- [ ] Repetition → clearing

### Window / Container
- [ ] Flat borders, no elevation
- [ ] Close action not guaranteed
- [ ] Early close → resisted
- [ ] Idle state → cooperative

---

## 🎨 Styling & Design

- [ ] Create global CSS with the brutalist design system
  - Background: `#FFFFFF` or `#F4F4F4`
  - Primary text: `#000000`
  - Secondary text: `#333333`
  - Borders: `#000000`
  - Disabled: `#9A9A9A`
  - Accent (pick ONE): `#FF0000` or `#0000FF`
- [ ] Use system font stack only (no custom fonts)
- [ ] Apply type scale: Title 24–28px, Body 14–16px, Labels 12px
- [ ] Enforce brutalist layout rules:
  - Single screen, no scrolling
  - No menus, navigation, or onboarding
  - Avoid perfect centering; slight imbalance is intentional
  - Uneven padding allowed
- [ ] No gradients, shadows, rounded corners, glassmorphism
- [ ] No tooltips, toasts, error messages, helper text, or loading spinners

---

## 🎬 Animation & Motion

- [ ] Use CSS transitions for visual feedback
- [ ] JS only for timing orchestration
- [ ] Implement allowed motions:
  - **Shake** — communicates resistance
  - **Pause** — communicates hesitation
  - **Delay** — communicates consideration
  - **Snap** — communicates refusal
- [ ] No bounce, glow, spring effects, or decorative fades
- [ ] Use easing: `linear`, `steps()`, or custom `cubic-bezier` only if needed

---

## ♿ Accessibility

- [ ] Support `prefers-reduced-motion` (reduces resistance, doesn't remove it)
- [ ] Respect OS accessibility settings
- [ ] Use native HTML semantics + ARIA where necessary
- [ ] Ensure high contrast text
- [ ] Implement optional reduced-resistance mode
- [ ] No permanent blocking/lock-out states
- [ ] No motion traps — always allow escape

---

## 🧪 Testing

- [ ] Write tests for **state transitions** (Vitest)
- [ ] Write tests for **deterministic behavior** — same input + same state = same result
- [ ] Write tests for **edge cases** (e.g., rapid fire interactions, zero idle time)
- [ ] No snapshot testing or E2E frameworks

---

## 📝 Documentation & Open Source

- [ ] Write a clear README with project philosophy (avoid "prank" perception)
- [ ] Choose license: **MIT** or **Apache-2.0**
- [ ] Visual feedback must imply intention (mitigates "looks broken" risk)
- [ ] Encourage contributions: new behaviors, states, alternative personalities
- [ ] Discourage: tutorials, productivity framing, gamification

---

## 🚀 Optional / Later

- [ ] Tauri desktop wrapper
- [ ] Plugin API (behavior-only extensions)
- [ ] Experimental Web Animations API usage
- [ ] Developer flag for debugging persistence (session state survives reload)

---

## ❌ Explicit Non-Goals (Do NOT build)

- No backend services, databases, or authentication
- No analytics, tracking pixels, or user data storage
- No AI/ML or cloud dependencies
- No localStorage, cookies, or IndexedDB (state resets on reload)
- No third-party animation, UI, or accessibility libraries
