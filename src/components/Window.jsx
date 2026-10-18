export default function Window({ title, onClose, wide = false, children }) {
  return (
    <section className={`window${wide ? ' window--wide' : ''}`} aria-label={title}>
      <header className="window__bar">
        <span className="window__title">{title}</span>
        <button className="window__close" onClick={onClose} aria-label="Close window">
          ×
        </button>
      </header>
      <div className="window__body">{children}</div>
    </section>
  );
}
