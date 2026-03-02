
# Uncontrollable — Product Requirements Document (PRD)

## 1. Product Overview
**Uncontrollable** is an experimental software application that deliberately removes full user control.  
Instead of deterministic responses, the system behaves as an autonomous entity with internal states, boundaries, and behavioral rules.

> You don’t operate it. You interact with it.

---

## 2. Problem Statement
Modern software assumes:
- Users are always in control
- Faster interaction is always better
- Repetition should yield consistent results

This removes friction, awareness, and intention.  
**Uncontrollable** challenges this assumption by introducing agency, resistance, and timing.

---

## 3. Goals
- Explore interaction where software has boundaries
- Respond to behavior, not commands
- Encourage slower, intentional interaction
- Spark discussion in UX, HCI, and software design

### Non-Goals
- Not productivity software
- Not a prank or rage app
- Not a game with scores
- Not therapy or self-help
- Not random chaos

---

## 4. Target Audience
**Primary**
- Designers (UX / Interaction)
- Developers interested in systems
- HCI & design students

**Secondary**
- Researchers
- Digital artists
- Educators

---

## 5. Core Interaction Model
Traditional:
```
Input → Output
```

Uncontrollable:
```
Input → Interpretation → State Change → Possible Response
```

The system never guarantees compliance.

---

## 6. Core Features (MVP)

### 6.1 Single Screen Interface
- One screen only
- No menus
- No navigation
- No onboarding

### 6.2 Autonomous UI Elements
- Buttons
- Sliders
- Toggles
- Text input
- Window container

Each element can:
- Refuse
- Delay
- Resist
- Partially comply

---

## 7. Internal State Engine (Hidden)

```json
{
  "patience": 0.0 – 1.0,
  "trust": 0.0 – 1.0,
  "fatigue": 0.0 – 1.0,
  "engagement": 0.0 – 1.0
}
```

State updates based on:
- Speed
- Repetition
- Pauses
- Aggression
- Idleness

---

## 8. UI Component Behavior

### Buttons
- Fast clicking → ignored
- Calm pacing → responds
- Repetition → refusal

### Sliders
- Aggressive drag → resistance
- Slow movement → compliance
- Overshoot → snap-back

### Text Input
- Frantic typing → ignored
- Pause before typing → accepted
- Repetition → clearing

### Window
- Early close attempts → resisted
- Idle state → cooperative

---

## 9. Determinism Rule
Behavior must be:
- State-driven
- Explainable in code
- Reproducible

Randomness may only modify outcomes, never define them.

---

## 10. Visual Design Principles
- Minimal
- Neutral colors
- Calm motion
- No gamification

Animations communicate:
- Resistance
- Hesitation
- Agreement
- Refusal

No tooltips. No explanations.

---

## 11. Accessibility
- Optional reduced-resistance mode
- Respect OS accessibility settings
- No permanent blocking states
- No motion traps

---

## 12. Technical Requirements
- Frontend only
- No backend
- No analytics
- No user data storage

### Suggested Stack
- Web (React / Svelte / Vue)
- Optional Tauri desktop build

---

## 13. Suggested Folder Structure
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

## 14. Open Source Strategy
**License:** MIT or Apache-2.0

Encourage:
- New behaviors
- New states
- Alternative personalities

Discourage:
- Tutorials
- Productivity framing
- Gamification

---

## 15. Success Metrics
- GitHub stars
- Forks
- Issues & discussions
- Academic or design usage
- Debate

---

## 16. Risks & Mitigation
**Looks broken**
→ Visual feedback must imply intention

**User frustration**
→ Resistance always decays

**Seen as prank**
→ Clear philosophy in README

---

## 17. Product Definition
> Uncontrollable is a software system that does not obey commands — it responds to behavior.
