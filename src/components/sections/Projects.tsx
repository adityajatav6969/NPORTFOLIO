import { motion } from 'framer-motion';
import { portfolioData } from '../../data/portfolio';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Projects() {
  return (
    <section id="projects" className="section">
      <div className="section-header">
        <div className="section-label">// 03 — Projects</div>
        <h2 className="section-title">Featured Work</h2>
      </div>

      <motion.div
        className="projects-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {portfolioData.projects.map((project, i) => (
          <motion.div
            key={project.id}
            className="project-card"
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              transition: { type: 'spring', stiffness: 300 },
            }}
            style={{ '--project-color': project.color } as React.CSSProperties}
          >
            <div className="project-number">
              {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            <div className="project-tech">
              {project.tech.map((t) => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <div className="project-links">
              <a href={project.link} className="project-link-btn" target="_blank" rel="noopener noreferrer">
                View Live →
              </a>
              <a href={project.github} className="project-link-btn" target="_blank" rel="noopener noreferrer">
                Source Code
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
