# Contributing to NonCompliant

Thank you for your interest in contributing. Please read this guide before submitting changes.

## Philosophy First

Before contributing, understand what NonCompliant is:

- **It is an experiment**, not a product
- **It has opinions**, not features
- **It resists the user**, deliberately

Your contribution should respect this philosophy.

## What We Want

### Behaviors
New ways the system can respond to interaction:
- New compliance verdicts beyond COMPLY / DELAY / RESIST / REFUSE
- More nuanced resistance patterns (e.g., gradual, oscillating)
- Context-dependent behaviors (time of day, session duration)

### State Dimensions
New internal state variables:
- Curiosity, suspicion, empathy — anything that creates richer interaction dynamics
- Must be deterministic and clamped to [0, 1]

### Accessibility
- Better `prefers-reduced-motion` handling
- Improved screen reader support
- Reduced-resistance mode refinements

### Bug Fixes
- If something feels truly broken (not intentionally resistant), fix it
- State edge cases, clamping errors, timing bugs

## What We Don't Want

- ❌ Tutorials, tooltips, or onboarding
- ❌ Gamification (scores, XP, levels, achievements)
- ❌ Productivity framing
- ❌ Additional npm dependencies
- ❌ Backend services or persistence
- ❌ UI libraries or animation frameworks
- ❌ Making the interface "nicer" or "friendlier"

## Development Setup

```bash
git clone https://github.com/Alpha2935/NonCompliant.git
cd NonCompliant
npm install
npm run dev      # Development server
npm test         # Run tests
npm run lint     # Lint check
```

## Code Standards

- **TypeScript strict mode** — no `any`, no implicit `undefined`
- **Pure functions** for all state logic (rules, behaviors, decay)
- **No console.log** in production code
- **Vanilla CSS only** — no Tailwind, no CSS-in-JS
- **Tests required** for all state transitions and behavior logic

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b behavior/oscillating-resist`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Ensure TypeScript compiles (`npx tsc -b`)
6. Submit a pull request with a clear description

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add oscillating resistance behavior
fix: clamp fatigue recovery at baseline
test: add edge case for zero-idle interactions
docs: clarify cooperation window mechanics
```

---

> If your contribution makes the interface more obedient, it will be declined.
