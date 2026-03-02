/**
 * NonCompliant — Interaction Tracker (Rolling Window)
 *
 * Tracks events in a 2-second rolling window to compute
 * aggression, hesitation, burst rate, and repetition.
 * All computation is deterministic given the same event sequence.
 */

import type { InteractionType } from './state';

interface TimedEvent {
    type: InteractionType;
    timestamp: number;
    speed: number; // raw speed for this event
}

const WINDOW_MS = 2000;

export class InteractionTracker {
    private events: TimedEvent[] = [];
    private closeAttempts = 0;
    private keystrokeTimes: number[] = [];

    /** Prune events older than the rolling window */
    private prune(now: number): void {
        const cutoff = now - WINDOW_MS;
        while (this.events.length > 0 && this.events[0].timestamp < cutoff) {
            this.events.shift();
        }
        while (this.keystrokeTimes.length > 0 && this.keystrokeTimes[0] < cutoff) {
            this.keystrokeTimes.shift();
        }
    }

    /** Record any event */
    record(type: InteractionType, speed: number): void {
        const now = performance.now();
        this.prune(now);
        this.events.push({ type, timestamp: now, speed });
        if (type === 'type') {
            this.keystrokeTimes.push(now);
        }
        if (type === 'close') {
            this.closeAttempts++;
        }
    }

    /** Get the number of close attempts this session */
    getCloseAttempts(): number {
        return this.closeAttempts;
    }

    /** Reset close attempt counter */
    resetCloseAttempts(): void {
        this.closeAttempts = 0;
    }

    /** Get click count in the rolling window */
    getClickCount(): number {
        this.prune(performance.now());
        return this.events.filter(e => e.type === 'click').length;
    }

    /** Get average interval between events of a given type in the window (ms) */
    getAverageInterval(type: InteractionType): number {
        this.prune(performance.now());
        const typed = this.events.filter(e => e.type === type);
        if (typed.length < 2) return 2000; // assume slow
        let totalInterval = 0;
        for (let i = 1; i < typed.length; i++) {
            totalInterval += typed[i].timestamp - typed[i - 1].timestamp;
        }
        return totalInterval / (typed.length - 1);
    }

    /** Get keypress burst rate (keypresses per second) */
    getBurstRate(): number {
        this.prune(performance.now());
        if (this.keystrokeTimes.length < 2) return 0;
        const span = this.keystrokeTimes[this.keystrokeTimes.length - 1] - this.keystrokeTimes[0];
        if (span <= 0) return 0;
        return (this.keystrokeTimes.length - 1) / (span / 1000);
    }

    /** Get idle time since last event (ms) */
    getIdleTime(): number {
        if (this.events.length === 0) return 5000;
        return performance.now() - this.events[this.events.length - 1].timestamp;
    }

    /** Check if recent actions are repetitive (same type 3+ times in window) */
    isRepetitive(type: InteractionType): boolean {
        this.prune(performance.now());
        return this.events.filter(e => e.type === type).length >= 3;
    }

    /**
     * Compute aggression score (0..1) based on rolling window:
     * - High click frequency
     * - High average speed
     * - Many events in short time
     */
    computeAggression(): number {
        this.prune(performance.now());
        if (this.events.length === 0) return 0;

        const count = this.events.length;
        // Density: events/sec, mapped to 0..1. >5 events/2s is aggressive
        const density = Math.min(1, count / 5);

        // Average speed
        const avgSpeed = this.events.reduce((s, e) => s + e.speed, 0) / count;

        // Burst factor from keystrokes
        const burstFactor = Math.min(1, this.getBurstRate() / 12);

        return clamp01(density * 0.4 + avgSpeed * 0.35 + burstFactor * 0.25);
    }

    /**
     * Compute hesitation score (0..1):
     * - Long idle before action
     * - Slow interaction speed
     * - Low event density
     */
    computeHesitation(): number {
        this.prune(performance.now());
        const idle = this.getIdleTime();
        // Long idle (>1.5s) indicates hesitation
        const idleFactor = Math.min(1, idle / 3000);

        if (this.events.length === 0) return idleFactor;

        const avgSpeed = this.events.reduce((s, e) => s + e.speed, 0) / this.events.length;
        const slowness = 1 - avgSpeed;

        const sparsity = Math.max(0, 1 - this.events.length / 4);

        return clamp01(idleFactor * 0.4 + slowness * 0.35 + sparsity * 0.25);
    }

    /** Get max drag velocity spike in window (0..1) */
    getMaxDragVelocity(): number {
        this.prune(performance.now());
        const drags = this.events.filter(e => e.type === 'drag');
        if (drags.length === 0) return 0;
        return Math.max(...drags.map(d => d.speed));
    }

    /** Get total event count for a type within the window */
    getTypeCount(type: InteractionType): number {
        this.prune(performance.now());
        return this.events.filter(e => e.type === type).length;
    }
}

function clamp01(v: number): number {
    return v < 0 ? 0 : v > 1 ? 1 : v;
}
