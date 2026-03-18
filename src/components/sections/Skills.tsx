import { motion } from 'framer-motion';
import { portfolioData } from '../../data/portfolio';
import { useRef, useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any },
  },
};

export function Skills() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Neural network canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      label: string;
      color: string;
    }

    const colors = ['#6366f1', '#a855f7', '#ec4899', '#22d3ee', '#10b981'];
    const nodes: Node[] = portfolioData.skills.map((skill, i) => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 4 + skill.level / 20,
      label: skill.name,
      color: colors[i % colors.length],
    }));

    let animId: number;
    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    const animate = () => {
      ctx.clearRect(0, 0, w(), h());

      // Update positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 20 || node.x > w() - 20) node.vx *= -1;
        if (node.y < 20 || node.y > h() - 20) node.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = node.color + '20';
        ctx.fill();

        // Label
        ctx.fillStyle = '#8888aa';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const categories = [...new Set(portfolioData.skills.map((s) => s.category))];

  return (
    <section id="skills" className="section">
      <div className="section-header">
        <div className="section-label">// 02 — Skills</div>
        <h2 className="section-title">Neural Network</h2>
      </div>

      {/* Neural network visualization */}
      <div className="neural-network-container">
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Skill cards grid */}
      <div className="skills-container" style={{ marginTop: '3rem' }}>
        {categories.map((cat) => (
          <div key={cat} style={{ marginBottom: '2rem' }}>
            <div
              className="section-label"
              style={{ textAlign: 'left', marginBottom: '1rem', fontSize: '0.6rem' }}
            >
              {cat.toUpperCase()}
            </div>
            <motion.div
              className="skills-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {portfolioData.skills
                .filter((s) => s.category === cat)
                .map((skill) => (
                  <motion.div key={skill.name} className="skill-card" variants={cardVariants}>
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-bar-container">
                      <motion.div
                        className="skill-bar"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as any }}
                      />
                    </div>
                    <div className="skill-category-tag">{skill.category}</div>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
