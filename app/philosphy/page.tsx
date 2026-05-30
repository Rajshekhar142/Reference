"use client";

import { useState, useEffect, useRef } from "react";

// ─── DEFAULT TEMPLATE DATA ───────────────────────────────────────────────────
// Edit this to personalize your content. Each mood has books, podcasts, ideas.
const DEFAULT_DATA = {
  focused: {
    books: [
      "Meditations — Marcus Aurelius",
      "The Republic — Plato",
      "Being and Time — Heidegger",
      "Critique of Pure Reason — Kant",
    ],
    podcasts: [
      "Philosophize This! — Hegel series",
      "The History of Philosophy — Peter Adamson",
      "Sean Carroll's Mindscape — consciousness ep",
    ],
    ideas: [
      "4 ears of Marduk",
      "The ship of Theseus and identity",
      "Eternal recurrence as a life test",
      "Gödel's incompleteness and truth",
    ],
  },
  curious: {
    books: [
      "Sophie's World — Jostein Gaarder",
      "The Doors of Perception — Huxley",
      "Zen and the Art of Motorcycle Maintenance",
    ],
    podcasts: [
      "Lex Fridman — Daniel Dennett ep",
      "Making Sense — Sam Harris on free will",
      "Philosophize This! — Camus series",
    ],
    ideas: [
      "Does language shape thought or follow it?",
      "Can a simulation know it is one?",
      "What makes an act truly original?",
      "The map is not the territory",
    ],
  },
  restless: {
    books: [
      "The Obstacle is the Way — Ryan Holiday",
      "Letters from a Stoic — Seneca",
      "Man's Search for Meaning — Frankl",
    ],
    podcasts: [
      "Daily Stoic — Ryan Holiday",
      "On Being — Krista Tippett",
      "Huberman x Robert Sapolsky — free will",
    ],
    ideas: [
      "You are not your thoughts",
      "Amor fati — love what is",
      "The dichotomy of control",
      "Suffering as signal, not sentence",
    ],
  },
};

type Mood = keyof typeof DEFAULT_DATA;
type Section = keyof (typeof DEFAULT_DATA)[Mood];
type ItemList = string[];
type MoodData = Record<Section, ItemList>;
type PhilosophyData = Record<Mood, MoodData>;
type DoneState = Record<Mood, Record<string, boolean>>;

const MOOD_META: Record<
  Mood,
  {
    label: string;
    hint: string;
    icon: string;
    color: string;
    activeBg: string;
    activeBorder: string;
    textColor: string;
  }
> = {
  focused: {
    label: "Focused",
    hint: "Deep in",
    icon: "🧠",
    color: "#a78bfa",
    activeBg: "rgba(167,139,250,0.10)",
    activeBorder: "#a78bfa",
    textColor: "#c4b5fd",
  },
  curious: {
    label: "Curious",
    hint: "Exploring",
    icon: "🔭",
    color: "#38bdf8",
    activeBg: "rgba(56,189,248,0.10)",
    activeBorder: "#38bdf8",
    textColor: "#7dd3fc",
  },
  restless: {
    label: "Restless",
    hint: "Ground me",
    icon: "🌬️",
    color: "#fb923c",
    activeBg: "rgba(251,146,60,0.10)",
    activeBorder: "#fb923c",
    textColor: "#fdba74",
  },
};

const SECTIONS = ["ideas", "books", "podcasts"] as const;
const SECTION_META: Record<Section, { label: string; icon: string }> = {
  ideas: { label: "Ideas to explore", icon: "💡" },
  books: { label: "Books", icon: "📚" },
  podcasts: { label: "Podcasts", icon: "🎙️" },
};

const STORAGE_KEY = "philosophy_data_v1";

function loadData(): PhilosophyData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PhilosophyData;
  } catch {}
  return JSON.parse(JSON.stringify(DEFAULT_DATA)) as PhilosophyData;
}

function saveData(data: PhilosophyData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ─── ARTICULATION OVERLAY ────────────────────────────────────────────────────
type ArticulateOverlayProps = {
  subject: string;
  onDone: (canExplain: boolean) => void;
};

function ArticulateOverlay({ subject, onDone }: ArticulateOverlayProps) {
  const [secs, setSecs] = useState(120);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecs((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(10,10,20,0.95)",
        borderRadius: 20,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        textAlign: "center",
        gap: "1rem",
      }}
    >
      <div style={{ fontSize: 32 }}>🎙️</div>
      <div style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>
        Articulation check
      </div>
      <div
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.6,
          maxWidth: 280,
        }}
      >
        Explain <strong style={{ color: "#c4b5fd" }}>{subject}</strong>{" "}
        {
          "out loud — like you're teaching it to someone for the first time. No notes."
        }
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 500,
          color: "#a78bfa",
          fontFamily: "monospace",
        }}
      >
        {mm}:{ss}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button
          onClick={() => onDone(true)}
          style={{
            padding: "9px 18px",
            borderRadius: 8,
            border: "1px solid #a78bfa",
            background: "rgba(167,139,250,0.15)",
            color: "#c4b5fd",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          ✓ I can explain it
        </button>
        <button
          onClick={() => onDone(false)}
          style={{
            padding: "9px 18px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.45)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          ⏱ Need more time
        </button>
      </div>
    </div>
  );
}

// ─── EDIT MODAL ───────────────────────────────────────────────────────────────
type EditModalProps = {
  mood: Mood;
  section: Section;
  items: ItemList;
  onSave: (mood: Mood, section: Section, items: ItemList) => void;
  onClose: () => void;
};

function EditModal({ mood, section, items, onSave, onClose }: EditModalProps) {
  const [text, setText] = useState(items.join("\n"));

  const handleSave = () => {
    const parsed = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean) as ItemList;
    onSave(mood, section, parsed);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "#1c1c2e",
          borderRadius: 16,
          border: "0.5px solid rgba(255,255,255,0.12)",
          width: "100%",
          maxWidth: 400,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "0.5px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>
            {SECTION_META[section].icon} Edit {SECTION_META[section].label} —{" "}
            {mood}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 14 }}>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              marginBottom: 8,
              letterSpacing: "0.05em",
            }}
          >
            ONE ITEM PER LINE
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.3)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              padding: "10px 12px",
              color: "#e2e8f0",
              fontSize: 13,
              fontFamily: "monospace",
              resize: "vertical",
              lineHeight: 1.6,
              outline: "none",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 10,
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "0.5px solid rgba(255,255,255,0.15)",
                background: "transparent",
                color: "rgba(255,255,255,0.4)",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: "#3b29cc",
                color: "#fff",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function PhilosophyPage() {
  const [data, setData] = useState<PhilosophyData>(() => loadData());
  const [mood, setMood] = useState<Mood>("focused");
  const [done, setDone] = useState<DoneState>({
    focused: {},
    curious: {},
    restless: {},
  });
  const [artSubject, setArtSubject] = useState<string | null>(null);
  const [pickedIdea, setPickedIdea] = useState<string | null>(null);
  const [footerMsg, setFooterMsg] = useState("Mark items done after consuming");
  const [editTarget, setEditTarget] = useState<{
    mood: Mood;
    section: Section;
  } | null>(null);

  const moodColor = MOOD_META[mood].color;

  const updateData = (m: Mood, section: Section, items: ItemList) => {
    const next: PhilosophyData = {
      ...data,
      [m]: { ...data[m], [section]: items },
    };
    setData(next);
    saveData(next);
  };

  const toggleDone = (section: Section, idx: number) => {
    const key = `${section}_${idx}`;
    const isDone = done[mood][key];
    if (isDone) {
      setDone((prev) => {
        const next = { ...prev[mood] };
        delete next[key];
        return { ...prev, [mood]: next };
      });
    } else {
      setDone((prev) => ({ ...prev, [mood]: { ...prev[mood], [key]: true } }));
      setArtSubject(data[mood][section][idx]);
    }
  };

  const handleArticulateDone = (canExplain: boolean) => {
    setArtSubject(null);
    const msg = canExplain
      ? "✓ Locked in. On to the next."
      : "Come back to it — no rush.";
    setFooterMsg(msg);
    setTimeout(() => setFooterMsg("Mark items done after consuming"), 3000);
  };

  const pickRandomIdea = () => {
    const ideas = data[mood].ideas;
    if (!ideas.length) return;
    const pick = ideas[Math.floor(Math.random() * ideas.length)];
    setPickedIdea(pick);
  };

  const doneCount = Object.keys(done[mood]).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "1.5rem 1rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#1c1c2e",
          borderRadius: 20,
          overflow: "hidden",
          border: "0.5px solid rgba(255,255,255,0.08)",
          position: "relative",
        }}
      >
        {/* Articulation overlay */}
        {artSubject && (
          <ArticulateOverlay
            subject={artSubject}
            onDone={handleArticulateDone}
          />
        )}

        {/* Edit modal */}
        {editTarget && (
          <EditModal
            mood={editTarget.mood}
            section={editTarget.section}
            items={data[editTarget.mood][editTarget.section]}
            onSave={updateData}
            onClose={() => setEditTarget(null)}
          />
        )}

        {/* Hero */}
        <div
          style={{
            background: "#13131f",
            padding: "1.25rem 1.25rem 1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 130,
              height: "100%",
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.07) 1.5px, transparent 1.5px)",
              backgroundSize: "14px 14px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "#a78bfa",
              textTransform: "uppercase",
              fontWeight: 500,
              marginBottom: 4,
            }}
          >
            Domain
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 22 }}>🧘</span> Philosophy
          </div>
          <div
            style={{
              marginTop: 10,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <span style={{ color: "#a78bfa" }}>✦</span>
            {doneCount} consumed today
          </div>
        </div>

        {/* Mood tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            padding: 12,
            background: "rgba(0,0,0,0.2)",
            borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          }}
        >
          {(Object.keys(MOOD_META) as Mood[]).map((m) => {
            const meta = MOOD_META[m];
            const isActive = mood === m;
            return (
              <button
                key={m}
                onClick={() => {
                  setMood(m);
                  setPickedIdea(null);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "9px 6px",
                  borderRadius: 10,
                  cursor: "pointer",
                  border: isActive
                    ? `1.5px solid ${meta.activeBorder}`
                    : "0.5px solid rgba(255,255,255,0.08)",
                  background: isActive
                    ? meta.activeBg
                    : "rgba(255,255,255,0.03)",
                  transition: "all 0.15s",
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 18 }}>{meta.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: isActive ? meta.textColor : "rgba(255,255,255,0.5)",
                  }}
                >
                  {meta.label}
                </span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                  {meta.hint}
                </span>
              </button>
            );
          })}
        </div>

        {/* Picked idea banner */}
        {pickedIdea && (
          <div
            style={{
              margin: "10px 10px 0",
              padding: "12px 14px",
              background: "rgba(167,139,250,0.08)",
              border: "0.5px solid rgba(167,139,250,0.25)",
              borderRadius: 10,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>✨</span>
            <div
              style={{
                flex: 1,
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.5,
              }}
            >
              How about:{" "}
              <strong style={{ color: "#c4b5fd" }}>{pickedIdea}</strong>
            </div>
            <button
              onClick={() => setPickedIdea(null)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.3)",
                cursor: "pointer",
                fontSize: 16,
                padding: 0,
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Sections */}
        {SECTIONS.map((section, si) => (
          <div key={section}>
            {si > 0 && (
              <div
                style={{
                  height: "0.5px",
                  background: "rgba(255,255,255,0.06)",
                  margin: "4px 12px",
                }}
              />
            )}
            <div style={{ padding: "10px 12px 4px" }}>
              {/* Section header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{SECTION_META[section].icon}</span>{" "}
                  {SECTION_META[section].label}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  {section === "ideas" && (
                    <button
                      onClick={pickRandomIdea}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        background: "rgba(255,255,255,0.05)",
                        border: "0.5px solid rgba(255,255,255,0.08)",
                        borderRadius: 20,
                        padding: "3px 10px",
                        cursor: "pointer",
                      }}
                    >
                      🎲 Pick
                    </button>
                  )}
                  <button
                    onClick={() => setEditTarget({ mood, section })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.4)",
                      background: "rgba(255,255,255,0.05)",
                      border: "0.5px solid rgba(255,255,255,0.08)",
                      borderRadius: 20,
                      padding: "3px 10px",
                      cursor: "pointer",
                    }}
                    title="Edit items"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>

              {/* Items */}
              {data[mood][section].length === 0 && (
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.2)",
                    padding: "8px 10px",
                    fontStyle: "italic",
                  }}
                >
                  Nothing here yet — hit Edit to add some.
                </div>
              )}
              {data[mood][section].map((text, idx) => {
                const key = `${section}_${idx}`;
                const isDone = !!done[mood][key];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDone(section, idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 10,
                      cursor: "pointer",
                      background: "transparent",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: moodColor,
                        opacity: isDone ? 0.2 : 0.55,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        color: isDone
                          ? "rgba(255,255,255,0.25)"
                          : "rgba(255,255,255,0.82)",
                        textDecoration: isDone ? "line-through" : "none",
                        flex: 1,
                        lineHeight: 1.4,
                      }}
                    >
                      {text}
                    </span>
                    {isDone && (
                      <span
                        style={{ fontSize: 13, color: moodColor, opacity: 0.7 }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div
          style={{
            borderTop: "0.5px solid rgba(255,255,255,0.06)",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            {footerMsg}
          </span>
          <button
            onClick={() => {
              if (window.confirm("Reset all content to template defaults?")) {
                const fresh = JSON.parse(JSON.stringify(DEFAULT_DATA));
                setData(fresh);
                saveData(fresh);
              }
            }}
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.2)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            reset
          </button>
        </div>
      </div>
    </div>
  );
}
