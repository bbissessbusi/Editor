import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Constants ────────────────────────────────────────────────────────────────
const W = 1080;
const H = 1920;

// Safe-zone vertical bounds (text lives between these)
const SAFE_TOP = Math.round(H * 0.13); // 249 px
const SAFE_BOTTOM = Math.round(H * 0.87); // 1670 px

const CYAN = "#00d4ff";
const GOLD = "#f5c518";
const RED = "#ff3b30";
const BG = "#04050c";

// ─── Primitives ───────────────────────────────────────────────────────────────

/** Animated dark background with faint grid lines */
const AnimBG: React.FC<{ tint?: string }> = ({ tint = "#08091a" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${BG} 0%, ${tint} 100%)`,
      }}
    >
      {/* Vertical grid lines */}
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: ((i + 1) / 10) * W,
            top: 0,
            width: 1,
            height: H,
            background: `rgba(0,212,255,${
              0.025 + Math.sin(frame * 0.04 + i * 0.7) * 0.012
            })`,
          }}
        />
      ))}
      {/* Horizontal grid lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: ((i + 1) / 13) * H,
            left: 0,
            width: W,
            height: 1,
            background: `rgba(0,212,255,${
              0.015 + Math.sin(frame * 0.03 + i * 0.9) * 0.008
            })`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Frosted-glass card */
const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: string;
}> = ({ children, style, glow = CYAN }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.065)",
      border: "1.5px solid rgba(255,255,255,0.2)",
      borderRadius: 32,
      position: "relative",
      overflow: "hidden",
      boxShadow: `0 12px 48px rgba(0,0,0,0.7), inset 0 1.5px 0 rgba(255,255,255,0.14), 0 0 64px ${glow}18`,
      ...style,
    }}
  >
    {/* Top glass sheen */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "45%",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 100%)",
        borderRadius: "32px 32px 0 0",
        pointerEvents: "none",
      }}
    />
    {children}
  </div>
);

/** 3D reflective glass heading */
const GlassHeading: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  glow?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 100, color = "#fff", glow = CYAN, style }) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 900,
      fontFamily: '"Arial Black", Impact, sans-serif',
      letterSpacing: -2,
      lineHeight: 1.05,
      color,
      textShadow: `
        0 1px 0 rgba(255,255,255,0.35),
        0 -1px 0 rgba(0,0,0,0.7),
        0 2px 6px rgba(0,0,0,0.9),
        0 0 24px ${glow}55,
        0 0 72px ${glow}28
      `,
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Scene 1 · Viral Hook (frames 0-89) ───────────────────────────────────────
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flash on cut
  const flash = interpolate(frame, [0, 2, 5, 8], [1, 1, 0.4, 0], {
    extrapolateRight: "clamp",
  });

  // "AI just wrote" — smash cut in
  const l1Opacity = interpolate(frame, [1, 7], [0, 1], {
    extrapolateRight: "clamp",
  });
  const l1Scale = interpolate(frame, [1, 9], [1.5, 1], {
    extrapolateRight: "clamp",
  });

  // "a 19-page legal doc" — slight delay
  const l2Progress = spring({
    fps,
    frame: Math.max(0, frame - 12),
    config: { damping: 18, stiffness: 220 },
  });

  // Sub-badge
  const badgeProgress = spring({
    fps,
    frame: Math.max(0, frame - 30),
    config: { damping: 14, stiffness: 200 },
  });
  const badgeY = interpolate(badgeProgress, [0, 1], [80, 0]);

  // Bottom stat strip
  const stripOpacity = interpolate(frame, [48, 58], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AnimBG tint="#06080f" />

      {/* White flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#ffffff",
          opacity: flash,
          pointerEvents: "none",
          zIndex: 20,
        }}
      />

      {/* Scanline texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg,rgba(0,0,0,0.12) 0px,rgba(0,0,0,0.12) 1px,transparent 1px,transparent 4px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Content in safe zone */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: SAFE_TOP,
          bottom: H - SAFE_BOTTOM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          zIndex: 5,
        }}
      >
        {/* "WAIT WHAT" label */}
        <div
          style={{
            transform: `translateY(${badgeY}px)`,
            opacity: badgeProgress,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: RED,
              color: "#fff",
              fontSize: 30,
              fontWeight: 800,
              fontFamily: "Arial, sans-serif",
              padding: "10px 28px",
              borderRadius: 50,
              letterSpacing: 3,
              textTransform: "uppercase",
              boxShadow: `0 0 32px ${RED}60`,
            }}
          >
            ⚡ HOLD ON
          </div>
        </div>

        {/* Main hook */}
        <div
          style={{
            opacity: l1Opacity,
            transform: `scale(${l1Scale})`,
            transformOrigin: "left center",
          }}
        >
          <GlassHeading size={106} color="#ffffff" glow="#ffffff">
            AI just wrote
          </GlassHeading>
          <GlassHeading size={106} color={RED} glow={RED}>
            a 19-page
          </GlassHeading>
          <GlassHeading size={106} color="#ffffff" glow="#ffffff">
            legal doc...
          </GlassHeading>
        </div>

        {/* Sub badge */}
        <div style={{ transform: `scale(${l2Progress})` }}>
          <GlassCard glow={CYAN} style={{ padding: "24px 40px" }}>
            <div
              style={{
                color: CYAN,
                fontSize: 46,
                fontWeight: 700,
                fontFamily: "Arial, sans-serif",
                textShadow: `0 0 20px ${CYAN}80`,
              }}
            >
              🆓 Free. In 4 minutes.
            </div>
          </GlassCard>
        </div>

        {/* Bottom stat row */}
        <div
          style={{
            opacity: stripOpacity,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {["$0 lawyers", "19 pages", "0 sign-up"].map((s) => (
            <div
              key={s}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 40,
                padding: "10px 24px",
                color: "rgba(255,255,255,0.7)",
                fontSize: 28,
                fontFamily: "Arial, sans-serif",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Numbered Transition Card ──────────────────────────────────────────────────
const NumberedTransition: React.FC<{
  num: string;
  title: string;
  color?: string;
}> = ({ num, title, color = CYAN }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in/out with scale
  const inProgress = spring({
    fps,
    frame,
    config: { damping: 20, stiffness: 200 },
  });
  const fade = interpolate(frame, [0, 6, 20, 28], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  // Circle pulse
  const circleScale = spring({
    fps,
    frame: Math.max(0, frame - 3),
    config: { damping: 10, stiffness: 300 },
  });

  // Line expand
  const lineW = interpolate(frame, [6, 22], [0, 400], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: "rgba(4,5,12,0.97)", opacity: fade }}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          transform: `scale(${interpolate(inProgress, [0, 1], [0.75, 1])})`,
        }}
      >
        {/* Number circle */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle at 32% 28%, ${color}50, ${color}12)`,
            border: `2.5px solid ${color}70`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${circleScale})`,
            boxShadow: `0 0 80px ${color}40, inset 0 0 40px ${color}12`,
          }}
        >
          <GlassHeading
            size={100}
            color={color}
            glow={color}
            style={{ letterSpacing: 0 }}
          >
            {num}
          </GlassHeading>
        </div>

        {/* Title */}
        <GlassHeading size={78} color="#fff" glow={color}>
          {title}
        </GlassHeading>

        {/* Expanding line */}
        <div
          style={{
            width: lineW,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            borderRadius: 3,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2 · GitHub Skills Reveal (frames 110-234) ─────────────────────────
const GitHubScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    fps,
    frame,
    config: { damping: 22, stiffness: 180 },
  });
  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const skills = [
    {
      icon: "🎬",
      name: "/remotion",
      desc: "Render videos with React",
      delay: 12,
    },
    {
      icon: "🔧",
      name: "/session-start-hook",
      desc: "Auto-install deps on startup",
      delay: 22,
    },
    {
      icon: "📜",
      name: "/policy-writer",
      desc: "Generate legal docs in minutes",
      delay: 32,
    },
    {
      icon: "🤖",
      name: "/claude-api",
      desc: "Build Claude-powered apps",
      delay: 42,
    },
  ];

  return (
    <AbsoluteFill>
      <AnimBG tint="#090d1f" />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CYAN}12 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: SAFE_TOP,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Header */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${interpolate(
              titleProgress,
              [0, 1],
              [60, 0]
            )}px)`,
          }}
        >
          <div
            style={{
              color: CYAN,
              fontSize: 30,
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 12,
              textShadow: `0 0 16px ${CYAN}80`,
            }}
          >
            ★ Free on GitHub
          </div>
          <GlassHeading size={96} color="#fff" glow={CYAN}>
            Claude Code
          </GlassHeading>
          <GlassHeading size={96} color={CYAN} glow={CYAN}>
            Skills
          </GlassHeading>
          <div
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 30,
              fontFamily: "Arial, sans-serif",
              marginTop: 12,
            }}
          >
            Prebuilt AI superpowers — zero cost
          </div>
        </div>

        {/* Skill cards */}
        {skills.map((skill, i) => {
          const cardProg = spring({
            fps,
            frame: Math.max(0, frame - skill.delay),
            config: { damping: 18, stiffness: 200 },
          });
          return (
            <div
              key={i}
              style={{
                transform: `translateX(${interpolate(
                  cardProg,
                  [0, 1],
                  [-W * 0.9, 0]
                )}px)`,
                opacity: interpolate(
                  frame,
                  [skill.delay, skill.delay + 8],
                  [0, 1],
                  { extrapolateRight: "clamp" }
                ),
              }}
            >
              <GlassCard glow={CYAN} style={{ padding: "26px 36px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                  }}
                >
                  <div style={{ fontSize: 48, flexShrink: 0 }}>{skill.icon}</div>
                  <div>
                    <div
                      style={{
                        color: CYAN,
                        fontSize: 32,
                        fontWeight: 700,
                        fontFamily: "monospace",
                        textShadow: `0 0 12px ${CYAN}60`,
                      }}
                    >
                      {skill.name}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        fontSize: 26,
                        fontFamily: "Arial, sans-serif",
                        marginTop: 4,
                      }}
                    >
                      {skill.desc}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3 · Phone Proof (frames 240-364) ───────────────────────────────────
const PhoneProofScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneIn = spring({
    fps,
    frame,
    config: { damping: 22, stiffness: 140 },
  });
  const phoneOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Content scroll inside phone
  const scrollY = interpolate(frame, [18, 95], [0, -520], {
    extrapolateRight: "clamp",
  });

  const statsOpacity = interpolate(frame, [20, 34], [0, 1], {
    extrapolateRight: "clamp",
  });
  const statsY = interpolate(frame, [20, 34], [40, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimBG tint="#0a0c18" />

      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: SAFE_TOP,
          bottom: H - SAFE_BOTTOM,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        {/* Top label */}
        <div style={{ opacity: statsOpacity, width: "100%" }}>
          <GlassCard glow={GOLD} style={{ padding: "20px 36px", textAlign: "center" }}>
            <div
              style={{
                color: GOLD,
                fontSize: 34,
                fontWeight: 700,
                fontFamily: "Arial, sans-serif",
                textShadow: `0 0 20px ${GOLD}70`,
              }}
            >
              📄 The actual output — 19 pages
            </div>
          </GlassCard>
        </div>

        {/* Phone shell */}
        <div
          style={{
            transform: `scale(${phoneIn})`,
            opacity: phoneOpacity,
            width: 420,
            height: 700,
            background: "linear-gradient(160deg, #1c1f2e 0%, #101220 100%)",
            borderRadius: 52,
            border: "8px solid rgba(255,255,255,0.14)",
            boxShadow: `0 48px 96px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.18), 0 0 80px ${CYAN}22`,
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              width: 110,
              height: 26,
              background: "#000",
              borderRadius: 20,
              zIndex: 10,
            }}
          />

          {/* Screen */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#fff",
              borderRadius: 44,
              overflow: "hidden",
            }}
          >
            {/* Status bar */}
            <div
              style={{
                height: 44,
                background: "#f7f7f7",
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "flex-end",
                padding: "0 16px 6px",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#444",
                  fontFamily: "sans-serif",
                  fontWeight: 600,
                }}
              >
                📑 1 of 19
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  background: "#fff0e8",
                  color: "#c44a00",
                  fontSize: 9,
                  padding: "2px 8px",
                  borderRadius: 20,
                  border: "1px solid #c44a00",
                  fontFamily: "sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Confidential
              </div>
            </div>

            {/* Scrolling content */}
            <div
              style={{
                transform: `translateY(${scrollY}px)`,
                padding: "16px 18px",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  fontFamily: "Georgia, serif",
                  color: "#111",
                  lineHeight: 1.2,
                  marginBottom: 10,
                }}
              >
                Church Purchasing Policy & Procurement Procedures
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#666",
                  fontFamily: "sans-serif",
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                Protecting Church funds, preventing fraud, ensuring legal
                compliance, and honoring our biblical call to faithful
                stewardship.
              </div>

              {[
                {
                  n: "01",
                  t: "Purpose & Scope",
                  s: "Goals, who it applies to, guiding principles",
                },
                {
                  n: "02",
                  t: "Roles & Thresholds",
                  s: "Who approves what at which dollar levels",
                },
                {
                  n: "03",
                  t: "Procedures & Vendors",
                  s: "Step-by-step purchasing and vendor selection",
                },
                {
                  n: "04",
                  t: "Payments & Records",
                  s: "Payment methods, documentation, fixed assets",
                },
                {
                  n: "05",
                  t: "Contracts & Compliance",
                  s: "Conflicts of interest, enforcement, adoption",
                },
              ].map((row) => (
                <div
                  key={row.n}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      color: "#c44a00",
                      fontSize: 10,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      minWidth: 20,
                      paddingTop: 2,
                    }}
                  >
                    {row.n}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "Georgia, serif",
                        color: "#111",
                      }}
                    >
                      {row.t}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#888",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {row.s}
                    </div>
                  </div>
                </div>
              ))}

              {/* Thresholds table excerpt */}
              <div
                style={{
                  marginTop: 10,
                  background: "#fff8f2",
                  border: "1px solid #f0c8a0",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#c44a00",
                    fontFamily: "sans-serif",
                    marginBottom: 8,
                  }}
                >
                  Section 4 — Purchase Approval Thresholds
                </div>
                {[
                  ["Up to $250", "Ministry Leader"],
                  ["$251–$999", "Treasurer"],
                  ["$1,000–$2,999", "Senior Pastor"],
                  ["$3,000+", "Board of Directors"],
                ].map(([amt, who]) => (
                  <div
                    key={amt}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 10,
                      fontFamily: "sans-serif",
                      color: "#444",
                      paddingBottom: 4,
                      marginBottom: 4,
                      borderBottom: "1px solid #f0d8c0",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{amt}</span>
                    <span>{who}</span>
                  </div>
                ))}
              </div>

              {/* Roles section */}
              <div
                style={{
                  marginTop: 20,
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "Georgia, serif",
                  color: "#111",
                  marginBottom: 10,
                }}
              >
                Section 3 — Roles and Responsibilities
              </div>
              {[
                "Board of Directors",
                "Senior Pastor (President / CEO)",
                "Treasurer (Finance Officer)",
                "Ministry Leaders & Dept. Heads",
                "Staff & Authorized Volunteers",
              ].map((role, ri) => (
                <div
                  key={ri}
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 8,
                    padding: "8px 10px",
                    background: "#f9f9f9",
                    borderRadius: 6,
                    border: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#c44a00",
                      color: "#fff",
                      fontSize: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      flexShrink: 0,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {ri + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: "sans-serif",
                      color: "#333",
                      fontWeight: 500,
                    }}
                  >
                    {role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div
          style={{
            opacity: statsOpacity,
            transform: `translateY(${statsY}px)`,
            width: "100%",
          }}
        >
          <GlassCard glow={GOLD} style={{ padding: "28px 40px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              {[
                { val: "19", label: "Pages" },
                { val: "$0", label: "Cost" },
                { val: "4m", label: "Time" },
              ].map(({ val, label }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 56,
                      fontWeight: 900,
                      fontFamily: '"Arial Black", sans-serif',
                      color: GOLD,
                      textShadow: `0 0 24px ${GOLD}70`,
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: 26,
                      fontFamily: "Arial, sans-serif",
                      marginTop: 4,
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4 · CTA (frames 380-449) ──────────────────────────────────────────
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ fps, frame, config: { damping: 16, stiffness: 160 } });
  const titleOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ctaIn = spring({
    fps,
    frame: Math.max(0, frame - 22),
    config: { damping: 18 },
  });
  const ctaOpacity = interpolate(frame, [20, 32], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Breathing pulse for CTA button
  const pulse = 1 + Math.sin(frame * 0.18) * 0.025;

  return (
    <AbsoluteFill>
      <AnimBG tint="#07102a" />

      {/* Central glow */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${CYAN}18 0%, transparent 68%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: SAFE_TOP,
          bottom: H - SAFE_BOTTOM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 52,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            opacity: titleOpacity,
            color: "rgba(255,255,255,0.4)",
            fontSize: 30,
            fontFamily: "Arial, sans-serif",
            letterSpacing: 4,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          You can do this too
        </div>

        {/* Main CTA text */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${interpolate(titleIn, [0, 1], [0.8, 1])})`,
            textAlign: "center",
          }}
        >
          <GlassHeading size={104} color="#fff" glow={CYAN}>
            Get the Free
          </GlassHeading>
          <GlassHeading size={104} color={CYAN} glow={CYAN}>
            Claude Skills
          </GlassHeading>
        </div>

        {/* CTA button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${interpolate(
              ctaIn,
              [0, 1],
              [60, 0]
            )}px) scale(${pulse})`,
            width: "100%",
          }}
        >
          <GlassCard
            glow={CYAN}
            style={{
              padding: "36px 52px",
              textAlign: "center",
              background: `linear-gradient(135deg, ${CYAN}28, ${CYAN}08)`,
              borderColor: `${CYAN}55`,
            }}
          >
            <div
              style={{
                color: CYAN,
                fontSize: 42,
                fontWeight: 700,
                fontFamily: "Arial, sans-serif",
                textShadow: `0 0 24px ${CYAN}90`,
                marginBottom: 10,
              }}
            >
              🔗 Link in bio
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 26,
                fontFamily: "monospace",
                letterSpacing: 1,
              }}
            >
              github.com/anthropics/claude-code
            </div>
          </GlassCard>
        </div>

        {/* Trust pills */}
        <div
          style={{
            opacity: ctaOpacity,
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["✨ Free forever", "⚡ Open source", "🚀 No sign-up"].map((t) => (
            <div
              key={t}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 40,
                padding: "10px 26px",
                color: "rgba(255,255,255,0.6)",
                fontSize: 28,
                fontFamily: "Arial, sans-serif",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Root Composition ─────────────────────────────────────────────────────────
export const SocialReel: React.FC = () => {
  //
  // Timeline (30 fps, 450 frames = 15 s)
  //
  // 0   – 89   Hook           (3 s)
  // 85  – 114  Transition 01  (1 s)  ← overlays tail of Hook
  // 110 – 229  GitHub Scene   (~4 s)
  // 225 – 254  Transition 02  (1 s)  ← overlays tail of GitHub
  // 250 – 374  Phone Proof    (~4 s)
  // 370 – 399  Transition 03  (1 s)  ← overlays tail of Proof
  // 395 – 449  CTA            (~1.8 s)
  //
  return (
    <AbsoluteFill>
      {/* ── Scenes (rendered bottom-up) ── */}
      <Sequence from={0} durationInFrames={115}>
        <HookScene />
      </Sequence>

      <Sequence from={110} durationInFrames={120}>
        <GitHubScene />
      </Sequence>

      <Sequence from={250} durationInFrames={125}>
        <PhoneProofScene />
      </Sequence>

      <Sequence from={395} durationInFrames={55}>
        <CTAScene />
      </Sequence>

      {/* ── Transitions (rendered on top) ── */}
      <Sequence from={85} durationInFrames={30}>
        <NumberedTransition num="01" title="The Tool" color={CYAN} />
      </Sequence>

      <Sequence from={225} durationInFrames={30}>
        <NumberedTransition num="02" title="The Output" color={GOLD} />
      </Sequence>

      <Sequence from={370} durationInFrames={30}>
        <NumberedTransition num="03" title="Your Turn" color={RED} />
      </Sequence>
    </AbsoluteFill>
  );
};
