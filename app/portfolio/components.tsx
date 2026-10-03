        {openUrl && (
          <a className="browser-open" href={openUrl} target="_blank" rel="noreferrer">
            open ↗
          </a>
        )}
      </div>
      <div className="browser-body">
        {video ? (
          <video
            className="browser-video"
            src={video}
            poster={cover}
            controls
            playsInline
            preload="metadata"
          />
        ) : embedUrl ? (
          <LiveEmbed embedUrl={embedUrl} cover={cover} title={title} />
        ) : cover && openUrl ? (
          <a href={openUrl} target="_blank" rel="noreferrer" className="browser-shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={`${title} preview`} loading="lazy" />
          </a>
        ) : cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={`${title} preview`} loading="lazy" />
        ) : null}
      </div>
    </div>
  );
}
