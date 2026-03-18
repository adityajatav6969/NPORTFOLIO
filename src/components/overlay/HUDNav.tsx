import { useUIStore } from '../../store/uiStore';

const sections = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

export function HUDNav() {
  const { activeSection, setActiveSection, toggleChat, toggleCinematicMode } = useUIStore();

  const scrollToSection = (index: number) => {
    setActiveSection(index);
    const sectionId = sections[index].toLowerCase();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="hud-nav">
      <div className="hud-logo" onClick={() => scrollToSection(0)}>
        {'<A/>'}
      </div>

      <div className="hud-links">
        {sections.map((name, i) => (
          <button
            key={name}
            className={`hud-link ${activeSection === i ? 'active' : ''}`}
            onClick={() => scrollToSection(i)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="hud-actions">
        <button className="hud-btn" onClick={toggleCinematicMode} title="Cinematic Mode">
          🎥
        </button>
        <button className="hud-btn" onClick={toggleChat} title="AI Brain">
          🧠
        </button>
      </div>
    </nav>
  );
}
