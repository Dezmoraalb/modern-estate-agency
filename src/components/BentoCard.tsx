import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface BentoCardProps {
  icon: React.ReactNode;
  title?: string;
  description: string;
  className?: string;
  span?: '1' | '2';
}

export default function BentoCard({ icon, title, description, className = '', span = '1' }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden rounded-xl border border-white/10 
        bg-white/5 backdrop-blur-md p-6 md:p-8
        transition-all duration-300
        hover:border-white/20 hover:bg-white/10
        ${span === '2' ? 'md:col-span-2' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
    >
      {/* Spotlight Effect */}
      {isHovered && (
        <div
          className="absolute pointer-events-none opacity-0 transition-opacity duration-300"
          style={{
            opacity: 1,
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center mb-4 md:mb-6 transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/10">
          {icon}
        </div>
        {title && (
          <h3 className="text-xl md:text-2xl text-white font-medium mb-3">{title}</h3>
        )}
        <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}


