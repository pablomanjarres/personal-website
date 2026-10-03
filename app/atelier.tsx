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
