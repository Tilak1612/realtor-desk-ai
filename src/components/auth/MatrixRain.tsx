import { useEffect, useRef } from 'react';

interface MatrixLetter {
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
}

const MatrixRain = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<MatrixLetter[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    const columns = Math.floor(window.innerWidth / 30);
    
    // Initialize letters
    lettersRef.current = Array.from({ length: columns }, (_, i) => ({
      x: i * 30 + Math.random() * 10,
      y: Math.random() * -500,
      char: chars[Math.floor(Math.random() * chars.length)],
      speed: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.4,
    }));

    const animate = () => {
      lettersRef.current.forEach((letter, i) => {
        letter.y += letter.speed;
        
        if (letter.y > window.innerHeight) {
          letter.y = Math.random() * -200;
          letter.char = chars[Math.floor(Math.random() * chars.length)];
          letter.speed = 1 + Math.random() * 2;
          letter.opacity = 0.1 + Math.random() * 0.4;
        }
      });

      // Update DOM elements
      const elements = container.querySelectorAll('.matrix-char');
      elements.forEach((el, i) => {
        const letter = lettersRef.current[i];
        if (letter) {
          (el as HTMLElement).style.transform = `translate(${letter.x}px, ${letter.y}px)`;
          (el as HTMLElement).style.opacity = String(letter.opacity);
          el.textContent = letter.char;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const columns = Math.floor(typeof window !== 'undefined' ? window.innerWidth / 30 : 40);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {Array.from({ length: columns }).map((_, i) => (
        <span
          key={i}
          className="matrix-char absolute text-sm font-semibold text-white/30 select-none"
          style={{
            textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
          }}
        >
          A
        </span>
      ))}
    </div>
  );
};

export default MatrixRain;
