import s from "../anki.module.css";

export default function SlotRuler({ reviewed }: { reviewed: number }) {
  return <div className={s.ruler} aria-label={`${reviewed} of 30 sample daily slots used`}>
    {Array.from({ length: 30 }, (_, index) =>
      <span key={index} className={index < reviewed ? s.rulerDone : ""} />)}
  </div>;
}
