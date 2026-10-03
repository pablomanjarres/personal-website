        s.my += (s.tmy - s.my) * 0.16;
        s.sc += ((s.eng ? 1.06 : 1) - s.sc) * 0.16;
        apply();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [index, apply]);

  const onMove = useCallback(
    (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const s = st.current;
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      if (!d.far && Math.hypot(dx, dy) > 4) d.far = true;
      s.x = d.bx + dx;
      s.y = d.by + dy;
      s.r = d.br + dx * 0.15;
      const now = performance.now();
      const dt = Math.max(8, now - d.lt);
      d.vx = (e.clientX - d.lx) / dt;
      d.lx = e.clientX;
      d.lt = now;
      apply();
    },
    [apply],
  );

  const onUp = useCallback(() => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    const d = drag.current;
    const s = st.current;
    if (d) s.spin = clamp(d.vx * 6, -22, 22);
    s.dragging = false;
    drag.current = null;
    ref.current?.classList.remove("grabbing");
  }, [onMove]);

  const onDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const s = st.current;
      s.dragging = true;
      s.moved = true;
      s.spin = 0;
      // drop any magnetic offset so the grab starts from the true position
      s.mx = 0;
      s.my = 0;
      s.tmx = 0;
      s.tmy = 0;
      s.eng = false;
      s.sc = 1;
      drag.current = {
        sx: e.clientX,
        sy: e.clientY,
        bx: s.x,
        by: s.y,
        br: s.r,
        lx: e.clientX,
        lt: performance.now(),
        vx: 0,
        far: false,
      };
      ref.current?.classList.add("grabbing");
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [onMove, onUp],
  );

  // magnetic lean: while hovering (not dragging), pull the pin toward the
  // cursor and lift it slightly — the idle loop eases + snaps it back.
  const onHover = useCallback((e: React.PointerEvent) => {
    const s = st.current;
    if (s.dragging || reduce.current) return;
    const el = ref.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    s.tmx = clamp((e.clientX - cx) * 0.3, -22, 22);
    s.tmy = clamp((e.clientY - cy) * 0.3, -22, 22);
    s.eng = true;
  }, []);

  const onHoverLeave = useCallback(() => {
    const s = st.current;
    s.tmx = 0;
    s.tmy = 0;
    s.eng = false;
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [onMove, onUp]);

  const pathId = `rim-${social.id}`;
  const rim = `PABLO MANJARRES · ${social.label.toUpperCase()} · ${social.handle.toUpperCase()} · `;

  return (
    <a
      ref={ref}
      className="badge"
      href={social.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${social.label}, ${social.handle}`}
      draggable={false}
      onPointerDown={onDown}
      onPointerMove={onHover}
      onPointerLeave={onHoverLeave}
      onClick={(e) => {
        if (drag.current?.far) e.preventDefault();
      }}
      style={{ width: size, height: size, opacity: 0, transition: "opacity .25s ease, filter .2s ease" }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <path id={pathId} d="M 50,50 m 0,-40 a 40,40 0 1,1 -0.01,0" fill="none" />
        </defs>

        {/* scalloped die-cut rim */}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={50 + Math.cos(a) * 48}
              cy={50 + Math.sin(a) * 48}
              r="2.6"
              fill={color.fill}
            />
          );
        })}

        <circle cx="50" cy="50" r="46" fill={color.fill} stroke={color.stroke} strokeWidth="0.8" />
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke={color.stroke}
          strokeWidth="0.5"
          strokeDasharray="0.6 1.4"
          opacity="0.55"
        />

        <text
          fontFamily="var(--ff-mono)"
          fontSize="4.5"
          fill={color.stroke}
          letterSpacing="0.5"
          style={{ textTransform: "uppercase" }}
        >
          <textPath href={`#${pathId}`} startOffset="0">
            {rim + rim}
          </textPath>
        </text>

        <text
          x="50"
          y="30"
          textAnchor="middle"
          fontFamily="var(--ff-mono)"
          fontSize="5"
          fill={color.stroke}
          opacity="0.7"
          letterSpacing="0.4"
        >
          № {social.num}
        </text>

        {/* brand icon replaces the center letter */}
        <image href={social.icon} x="35" y="37" width="30" height="30" preserveAspectRatio="xMidYMid meet" />

        <text
          x="50"
          y="74"
          textAnchor="middle"
          fontFamily="var(--ff-mono)"
          fontSize="3.6"
          fill={color.stroke}
          letterSpacing="0.7"
          style={{ textTransform: "uppercase" }}
        >
          {social.label}
        </text>
      </svg>
    </a>
  );
}

// ---- the page --------------------------------------------------------------
export default function Atelier() {
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  // The pinboard's own box. Pins are placed within it: on desktop it is the
  // fixed full-viewport layer; on mobile it is the in-flow sticker zone.
  const [board, setBoard] = useState({ w: 1280, h: 800 });
  const boardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let raf = 0;
    const measure = () => {
      setVp({ w: window.innerWidth, h: window.innerHeight });
      const el = boardRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setBoard({ w: r.width, h: r.height });
      }
    };
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const mobile = vp.w < 860;
  const size = mobile ? mobileBadgeSize(vp.w) : badgeSize(vp.w, vp.h);

  return (
    <main className="atelier" style={tokens}>
      <div className="paper" />
      <div className="corner-fold" />

      {/* paperclip flourish (positioned in CSS so it can hide on mobile) */}
      <svg aria-hidden className="paperclip" viewBox="0 0 56 110">
        <path
          d="M 16 8 Q 8 8 8 22 L 8 78 Q 8 96 28 96 Q 48 96 48 78 L 48 30 Q 48 18 36 18 Q 24 18 24 30 L 24 70"
          stroke="var(--fg)"
          strokeOpacity="0.5"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <div className="peel">※ pg. D · peel a pin, drop it anywhere</div>

      <div className="wrap">
        <SiteNav active="home" />

        <header className="meta">
          <span className="who">Notebook № 8 · Atelier · pablomanjarres</span>
          <span className="mid">
            {profile.location} · <Clock />
          </span>
          <span className="status">
            <span className="pulse">●</span> in studio
          </span>
        </header>

        <section className="hero">
          <div className="intro">
            <div className="kicker">¶ 01 · Who</div>
            <h1 className="headline">
              17 y/o,
              <br />
              solo
              <br />
              <span className="accent at-explode">
                <span className="at-sr">founder</span>
                <SplitChars text="founder" scatter />
              </span>
              .
            </h1>

            <p className="lede">
              Building <span className="brand">@{profile.building}</span>, the team you&apos;d hire
              if you had the budget, built from AI agents you run like a CEO. The pins come off the
              page. Drag one anywhere.
            </p>

            <a className="noelle-cta" href="https://trynoelle.com" target="_blank" rel="noreferrer">
              <span className="star" aria-hidden>
                ✶
              </span>
              Visit Noelle
              <span className="sep" aria-hidden>
                ·
              </span>
              trynoelle.com
              <span className="arr" aria-hidden>
                ↗
              </span>
            </a>

            <div className="email-row">
              <a className="email-pill" href={`mailto:${profile.email}`}>
                <svg className="email-circle" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden>
                  <path
                    d="M 11 7 C 38 3, 63 3, 89 6 C 97 7, 99 13, 96 18 C 93 27, 64 31, 39 30 C 16 29, 2 26, 5 16 C 6.5 10, 9 7.5, 15 6"
                    stroke="var(--accent)"
                    strokeWidth="1.2"
                    fill="none"
                    opacity="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                  />
                </svg>
                <span
                  style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }}
                />
                {profile.email}
                <span style={{ color: "var(--muted)" }}>↗</span>
              </a>
              <span className="email-note">
                <span className="arr-desk" aria-hidden>←</span>
                <span className="arr-mob" aria-hidden>↑</span> write me ✶
              </span>
            </div>
          </div>

          <div className="findme">¶ 02 · Find me · 6 pins · throw to spin</div>
        </section>
      </div>

      <div className="pageno">pg. 015 / D</div>

      {/* draggable pins layer */}
      <div className="pinboard" ref={boardRef}>
        {profile.socials.map((s, i) => (
          <Badge
            key={s.id}
            index={i}
            social={s}
            color={BADGE_COLORS[i] ?? BADGE_COLORS[0]}
            size={size}
            mobile={mobile}
            spaceW={board.w}
            spaceH={board.h}
          />
        ))}
      </div>
    </main>
  );
}
