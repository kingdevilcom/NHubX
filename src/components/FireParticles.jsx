import React, { useEffect, useRef } from 'react';

const FireParticles = ({ zIndex = 1 }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const maxParticles = 20; // sparse count for clean background aesthetics

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    resizeCanvas();

    class Particle {
      constructor(fromMouse = false) {
        this.reset(true, fromMouse);
      }

      reset(init = false, fromMouse = false) {
        if (fromMouse && mouseRef.current.active) {
          // Spark spawning around current mouse position
          this.x = mouseRef.current.x + (Math.random() * 8 - 4);
          this.y = mouseRef.current.y + (Math.random() * 8 - 4);
          this.size = Math.random() * 1.5 + 0.6; // smaller interactive particles
          this.speedY = -(Math.random() * 0.9 + 0.4); // upward force
          this.speedX = (Math.random() * 1.2 - 0.6); // outward spark drift
          this.alpha = Math.random() * 0.7 + 0.3; // bright when spawned
          this.decay = Math.random() * 0.009 + 0.006; // fast decay for short trails
          this.isMouseSpark = true;
        } else {
          // Regular background rising fire ember
          this.x = Math.random() * canvas.width;
          this.y = init ? Math.random() * canvas.height : canvas.height + Math.random() * 50;
          this.size = Math.random() * 2 + 1; // 1px to 3px
          this.speedY = -(Math.random() * 0.5 + 0.2); // slower drift
          this.speedX = (Math.random() * 0.4 - 0.2); // drift direction
          this.alpha = Math.random() * 0.4 + 0.1;
          this.decay = Math.random() * 0.0015 + 0.0008; // slow decay
          this.isMouseSpark = false;
        }
        
        // Glow hues from deep red-orange to bright amber
        const hues = [12, 24, 36, 48];
        this.hue = hues[Math.floor(Math.random() * hues.length)];
      }

      update() {
        // Attraction physics: draw passing ambient background particles to the mouse
        if (!this.isMouseSpark && mouseRef.current.active) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const distance = Math.hypot(dx, dy);
          
          if (distance < 200) {
            const force = (200 - distance) / 200; // gravity scaling factor
            this.speedX += (dx / distance) * force * 0.06;
            this.speedY += (dy / distance) * force * 0.06;
          }
        }

        this.y += this.speedY;
        this.x += this.speedX;
        this.alpha -= this.decay;

        // Subtle heat currents (wobble vectors)
        this.speedX += (Math.random() * 0.05 - 0.025);
        
        // Speed clamps
        const maxV = this.isMouseSpark ? 1.6 : 0.8;
        this.speedX = Math.max(-maxV, Math.min(maxV, this.speedX));
        this.speedY = Math.max(-maxV, Math.min(0.2, this.speedY)); // let them drift down slightly if attracted

        if (this.alpha <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          if (this.isMouseSpark) {
            return false; // mouse sparks delete themselves
          } else {
            this.reset(false);
          }
        }
        return true;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 55%, ${this.alpha})`;
        ctx.shadowBlur = this.size * (this.isMouseSpark ? 4.5 : 3.5);
        ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.85)`;
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize regular ambient particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle(false));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dynamic mouse pointer trailing emission
      if (mouseRef.current.active) {
        const movedDist = Math.hypot(
          mouseRef.current.x - mouseRef.current.lastX, 
          mouseRef.current.y - mouseRef.current.lastY
        );
        
        // If mouse moves, spawn interactive trailing sparks
        if (movedDist > 1 && particles.filter(p => p.isMouseSpark).length < 35) {
          particles.push(new Particle(true));
          if (movedDist > 12) {
            particles.push(new Particle(true)); // spawn double on quick sweeps
          }
        }
        
        mouseRef.current.lastX = mouseRef.current.x;
        mouseRef.current.lastY = mouseRef.current.y;
      }

      // Update & render particles
      particles = particles.filter((particle) => {
        const keep = particle.update();
        if (keep) {
          particle.draw();
        }
        return keep;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen', zIndex: zIndex }}
    />
  );
};

export default FireParticles;
