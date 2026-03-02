
# TECH STACK
## Project: Uncontrollable
## Philosophy: Minimal, Deterministic, Frontend-Only

---

## 1. Core Principles Behind the Stack

The tech stack must:
- Be deterministic (no hidden magic)
- Favor control over convenience
- Avoid unnecessary abstractions
- Be boring in infrastructure so behavior can be radical
- Support precise interaction timing

This project prioritizes **interaction correctness** over scalability or speed of development.

---

## 2. Platform Choice

### Primary Platform: Web (Browser)

**Why Web**
- Zero installation barrier
- Maximum reach (designers, researchers, students)
- Easy sharing and demos
- Perfect for interaction experiments

### Secondary (Optional)
- Desktop build via **Tauri**
- Same codebase
- No Electron-level bloat

---

## 3. Frontend Framework

### Framework: **React (with Vite)**

**Why React**
- Precise control over rendering
- Mature ecosystem
- Easy state isolation
- Excellent dev tooling
- Predictable component lifecycle

**Why NOT Next.js**
- No routing required
- No SSR benefits
- Unnecessary abstraction

---

## 4. Language

### Language: **TypeScript (Strict Mode)**

**Reasons**
- Enforces determinism
- Prevents accidental state mutation
- Improves contributor confidence
- Essential for complex state machines

Configuration:
- `"strict": true`
- No `any`
- No implicit `undefined`

---

## 5. State Management

### State System: **Custom State Machine (No Redux)**

**Why**
- Global stores hide causality
- Reducers add noise
- This project needs *explicit transitions*

Use:
- Plain TypeScript objects
- Explicit state transition functions
- Immutable updates

Example:
```ts
nextState = applyInteraction(previousState, interaction)
```

---

## 6. Timing & Interaction Control

### Timing APIs
- `requestAnimationFrame`
- `setTimeout` (controlled, minimal)
- Performance API (`performance.now()`)

**Reason**
Precise timing is critical to:
- Detect impatience
- Measure hesitation
- Apply resistance accurately

---

## 7. Animation System

### Animation Approach: **CSS + Minimal JS**

Use:
- CSS transitions for visual feedback
- JS only for timing orchestration

Avoid:
- Animation libraries
- Physics-based motion
- Spring systems

Easing:
- `linear`
- `steps()`
- Custom cubic-bezier only if necessary

---

## 8. Styling

### Styling Method: **Vanilla CSS (or CSS Modules)**

**Why**
- No design-system abstraction
- Full control over borders, spacing, and motion
- Prevents accidental prettification

Avoid:
- Tailwind
- Material UI
- Component libraries

---

## 9. Persistence

### Storage: **None (Session-only)**

**Rules**
- No localStorage by default
- No cookies
- No IndexedDB

State resets on reload.
Impermanence is intentional.

(Optional: developer flag for debugging persistence)

---

## 10. Accessibility

### Accessibility Tools
- Native HTML semantics
- `prefers-reduced-motion`
- ARIA only where necessary

No third-party accessibility libraries.

---

## 11. Build Tooling

### Bundler: **Vite**
- Fast
- Minimal
- Transparent output

### Package Manager
- npm or pnpm (no lock-in)

---

## 12. Linting & Quality

### Linting
- ESLint (strict rules)
- No unused variables
- No console.logs in production

### Formatting
- Prettier (minimal config)
- No stylistic bikeshedding

---

## 13. Testing Strategy

### Testing Scope: Minimal but Critical

Test:
- State transitions
- Deterministic behavior
- Edge cases

Tools:
- Vitest
- No snapshot testing

Avoid:
- UI screenshot tests
- End-to-end frameworks

---

## 14. What Is Explicitly NOT Used

- Backend services
- Databases
- Authentication
- Analytics
- Tracking pixels
- AI / ML
- Cloud dependencies

This is intentional.

---

## 15. Optional Extensions (Later)

- Tauri desktop wrapper
- Plugin API (behavior-only)
- Experimental Web Animations API usage

---

## 16. Tech Stack Summary

| Layer | Choice |
|-----|-------|
| Platform | Web |
| Framework | React |
| Language | TypeScript |
| State | Custom State Machine |
| Styling | Vanilla CSS |
| Animation | CSS + JS |
| Build | Vite |
| Storage | None |
| Backend | None |

---

## 17. Final Rule

> If a library hides how something works, it does not belong in this project.
