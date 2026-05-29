"use client";

import { useState, useCallback } from "react";

type SlotKey = "MINI" | "MEDIUM" | "LARGE";
const SLOTS: SlotKey[] = ["MINI", "MEDIUM", "LARGE"];

const TASKS: Record<SlotKey, string[]> = {
  MINI: [
    "Vim practice",
    "Linux CLI practice",
    "Quiz",
    "Structure GitHub",
    "Doodle pipelines",
    "Make a short education video",
    "Comment GitHub and create issues and feature ideas",
    "Create file structure and install dependency for some project",
    "Setup env",
  ],
  MEDIUM: [
    "Study pipeline and make one",
    "Study repos (DevOps part)",
    "Take a task from side project",
    "Read text book",
    "Work on issue or feature on GitHub",
    "Read docs and code",
    "Take serious test",
    "Document your work",
  ],
  LARGE: [
    "Build side project",
    "Make AWS architecture",
    "Read units",
    "Create feature and resolve issues",
    "Explore new tech",
    "Write article and share document",
    "Open source project exploration",
    "Brainstorm for idea",
  ],
};

const SLOT_META: Record<SlotKey, { label: string; duration: string; color: string; activeBg: string; activeText: string; activeBorder: string }> = {
  MINI:   { label: "Mini",   duration: "< 10 min", color: "#22c55e", activeBg: "rgba(34,197,94,0.10)",   activeText: "#4ade80",   activeBorder: "#22c55e" },
  MEDIUM: { label: "Medium", duration: "< 1 hr",   color: "#f59e0b", activeBg: "rgba(245,158,11,0.10)", activeText: "#fbbf24",   activeBorder: "#f59e0b" },
  LARGE:  { label: "Large",  duration: "< 3 hr",   color: "#f43f5e", activeBg: "rgba(244,63,94,0.10)",  activeText: "#fb7185",   activeBorder: "#f43f5e" },
};

const SLOT_ICONS: Record<SlotKey, string> = { MINI: "⚡", MEDIUM: "🔥", LARGE: "🚀" };

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Dashboard() {
  const [activeSlot, setActiveSlot] = useState<SlotKey>("MINI");
  const [done, setDone] = useState<Record<SlotKey, Set<number>>>({ MINI: new Set(), MEDIUM: new Set(), LARGE: new Set() });
  const [order, setOrder] = useState<Record<SlotKey, number[]>>({
    MINI:   [...Array(TASKS.MINI.length).keys()],
    MEDIUM: [...Array(TASKS.MEDIUM.length).keys()],
    LARGE:  [...Array(TASKS.LARGE.length).keys()],
  });
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const meta = SLOT_META[activeSlot];
  const tasks = TASKS[activeSlot];
  const doneSet = done[activeSlot];
  const currentOrder = order[activeSlot];

  const toggleDone = useCallback((idx: number) => {
    setDone((prev) => {
      const next = new Set(prev[activeSlot]);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return { ...prev, [activeSlot]: next };
    });
  }, [activeSlot]);

  const handleShuffle = () => {
    setOrder((prev) => ({ ...prev, [activeSlot]: shuffle(prev[activeSlot]) }));
    setBanner(null);
    setHighlighted(null);
  };

  const handlePick = () => {
    const undone = currentOrder.filter((i) => !doneSet.has(i));
    const pool = undone.length ? undone : currentOrder;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setHighlighted(pick);
    setBanner(tasks[pick]);
  };

  const handleSlot = (slot: SlotKey) => {
    setActiveSlot(slot);
    setBanner(null);
    setHighlighted(null);
  };

  const doneCount = doneSet.size;
  const total = tasks.length;
  const footerMsg =
    doneCount === total
      ? "🎉 All done!"
      : doneCount > 0
      ? `${doneCount} of ${total} completed`
      : "Tap a task to mark done";

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "1.5rem 1rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#1c1c2e", borderRadius: 20, overflow: "hidden", border: "0.5px solid rgba(255,255,255,0.08)" }}>

        {/* Hero */}
        <div style={{ background: "#13131f", padding: "1.25rem 1.25rem 1rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 130, height: "100%", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1.5px, transparent 1.5px)", backgroundSize: "14px 14px", pointerEvents: "none" }} />
          <div style={{ fontSize: 10, letterSpacing: "0.14em", color: "#7c7cff", textTransform: "uppercase", fontWeight: 500, marginBottom: 4 }}>Domain</div>
          <div style={{ fontSize: 26, fontWeight: 500, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🖥️</span> DevOps
          </div>
          <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "3px 10px", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
            <span style={{ color: "#7c7cff" }}>✓</span>
            {doneCount} done &nbsp;·&nbsp; {total} tasks
          </div>
        </div>

        {/* Slot Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: 12, background: "rgba(0,0,0,0.2)", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
          {SLOTS.map((slot) => {
            const m = SLOT_META[slot];
            const isActive = activeSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => handleSlot(slot)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "9px 6px", borderRadius: 10, cursor: "pointer",
                  border: isActive ? `1.5px solid ${m.activeBorder}` : "0.5px solid rgba(255,255,255,0.08)",
                  background: isActive ? m.activeBg : "rgba(255,255,255,0.03)",
                  transition: "all 0.15s", gap: 2,
                }}
              >
                <span style={{ fontSize: 18 }}>{SLOT_ICONS[slot]}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: isActive ? m.activeText : "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>{m.label}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{m.duration}</span>
              </button>
            );
          })}
        </div>

        {/* List Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 6px" }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Action items</span>
          <button
            onClick={handleShuffle}
            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "4px 10px", cursor: "pointer" }}
          >
            🔀 Shuffle
          </button>
        </div>

        {/* Banner */}
        {banner && (
          <div style={{ margin: "0 10px 8px", padding: "10px 12px", background: "rgba(99,102,241,0.12)", border: "0.5px solid rgba(99,102,241,0.3)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>✨</span>
            <span style={{ fontSize: 13, color: "#a5b4fc", flex: 1, lineHeight: 1.4 }}>How about: <strong style={{ color: "#c7d2fe" }}>{banner}</strong></span>
            <button onClick={() => { setBanner(null); setHighlighted(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "rgba(255,255,255,0.3)", padding: 0 }}>×</button>
          </div>
        )}

        {/* Task List */}
        <div style={{ padding: "0 10px 10px" }}>
          {currentOrder.map((idx, position) => {
            const isDone = doneSet.has(idx);
            const isHighlighted = highlighted === idx;
            return (
              <div
                key={idx}
                onClick={() => toggleDone(idx)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 10px", borderRadius: 10, cursor: "pointer",
                  background: isHighlighted ? "rgba(99,102,241,0.1)" : "transparent",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => { if (!isHighlighted) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isHighlighted ? "rgba(99,102,241,0.1)" : "transparent"; }}
              >
                <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.25)", minWidth: 20, textAlign: "right" }}>
                  {String(position + 1).padStart(2, "0")}
                </span>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color, opacity: isDone ? 0.2 : 0.6, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: isDone ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.85)", textDecoration: isDone ? "line-through" : "none", flex: 1, lineHeight: 1.4 }}>
                  {tasks[idx]}
                </span>
                {isDone && <span style={{ fontSize: 14, color: meta.color, opacity: 0.7 }}>✓</span>}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.2)" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{footerMsg}</span>
          <button
            onClick={handlePick}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#fff", background: "#3b29cc", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}
          >
            🎲 Pick for me
          </button>
        </div>

      </div>
    </div>
  );
}
