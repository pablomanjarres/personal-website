      <section
        className="proj-preview load-rise"
        style={{ "--i": titleWords.length + 4 } as CSSProperties}
      >
        {project.embedUrl || project.cover || project.video ? (
          <DemoFrame
            label={demoLabel}
            title={project.title}
            embedUrl={project.embedUrl}
            cover={project.cover}
            openUrl={openUrl}
            plain={project.previewKind === "app"}
            video={project.video}
          />
        ) : (
          <PreviewPlate project={project} />
        )}
        <p className="proj-preview-note">
          {project.video
            ? "A recorded walkthrough of the real product."
            : project.embedUrl
            ? "Live demo. Click Run to load the real app and use it right here, or open it full-screen."
            : project.previewKind === "app"
              ? "The desktop app in action."
              : liveLink
                ? "Preview. Click it to open the live app."
                : project.cover
                  ? "Preview."
                  : "Runs as a local app. The full teardown is below."}
        </p>
      </section>

      <div className="proj-body">
        <section className="proj-section folio-reveal">
          <div className="h">
            <span className="n">01</span>Overview
          </div>
          <div className="proj-prose proj-prose--lead">
            {paragraphs(project.summary).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {project.problem && (
          <section className="proj-section folio-reveal">
            <div className="h">
              <span className="n">02</span>The problem
            </div>
            <div className="proj-prose">
              {paragraphs(project.problem).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {project.highlights.length > 0 && (
          <section className="proj-section folio-reveal">
            <div className="h">
              <span className="n">03</span>Highlights
            </div>
            <ul className="proj-highlights">
              {project.highlights.map((h, i) => (
                <li
                  key={i}
                  className="folio-reveal-item"
                  style={{ "--i": i } as CSSProperties}
                >
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.metrics && project.metrics.length > 0 && (
          <section className="proj-section folio-reveal">
            <div className="h">
              <span className="n">04</span>By the numbers
            </div>
            <div className="proj-metrics">
              {project.metrics.map((m, i) => {
                const { value, label } = splitMetric(m);
                return (
                  <div
                    className="metric folio-reveal-item"
                    key={i}
                    style={{ "--i": i } as CSSProperties}
                  >
                    {value && <div className="m-v">{value}</div>}
                    <div className={value ? "m-k" : "m-k m-k-lg"}>{label}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {project.subProjects && project.subProjects.length > 0 && (
          <section className="proj-section folio-reveal">
            <div className="h">
              <span className="n">◆</span>What&apos;s inside
              <span className="h-count">{project.subProjects.length} parts</span>
            </div>
            <ul className="subproj-list">
              {project.subProjects.map((s, i) => (
                <li
                  className="subproj folio-reveal-item"
                  key={s.name}
                  style={{ "--i": i } as CSSProperties}
                >
                  <div className="subproj-head">
                    <code className="subproj-name">{s.name}</code>
                    <span className="subproj-kind">{s.kind}</span>
                  </div>
                  <p className="subproj-one">{s.oneLiner}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="proj-section folio-reveal">
          <div className="h">
            <span className="n">·</span>Tags
          </div>
          <div className="proj-tags">
            {project.tags.map((t) => (
              <Chip key={t} label={t} />
            ))}
          </div>
          {project.stack.length > 0 && (
            <details className="stack-details">
              <summary>
                Full tech stack <span className="stack-count">{project.stack.length}</span>
              </summary>
              <div className="proj-tags proj-tags-stack">
                {project.stack.map((s) => (
                  <Chip key={s} label={s} accent />
                ))}
              </div>
            </details>
          )}
        </section>
      </div>

      <footer className="folio-foot">
        <Link href="/portfolio">← all work</Link>
        <span>
          {project.title} · pg. {project.num} / D
        </span>
      </footer>
    </div>
  );
}
