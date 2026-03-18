import { useUIStore } from '../../store/uiStore';

const sections = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

export function SectionIndicator() {
  const { activeSection, setActiveSection } = useUIStore();

  const scrollToSection = (index: number) => {
    setActiveSection(index);
    const sectionId = sections[index].toLowerCase();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="cinematic-indicator">
      {sections.map((_, i) => (
        <div
          key={i}
          className={`section-dot ${activeSection === i ? 'active' : ''}`}
          onClick={() => scrollToSection(i)}
        />
      ))}
    </div>
  );
}
