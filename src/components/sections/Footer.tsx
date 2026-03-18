import { portfolioData } from '../../data/portfolio';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-social">
        <a href={portfolioData.social.github} className="social-link" target="_blank" rel="noopener noreferrer" title="GitHub">
          ⌘
        </a>
        <a href={portfolioData.social.linkedin} className="social-link" target="_blank" rel="noopener noreferrer" title="LinkedIn">
          in
        </a>
        <a href={portfolioData.social.twitter} className="social-link" target="_blank" rel="noopener noreferrer" title="Twitter">
          𝕏
        </a>
        <a href={`mailto:${portfolioData.social.email}`} className="social-link" title="Email">
          @
        </a>
      </div>
      <p className="footer-text" style={{ marginTop: '1.5rem' }}>
        &copy; {new Date().getFullYear()} — {portfolioData.name} — Crafted with ❤️ and Three.js
      </p>
    </footer>
  );
}
