import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StaggeredTextProps {
  text: string;
  className?: string;
  delay?: number;
  splitBy?: 'word' | 'char';
}

export default function StaggeredText({ 
  text, 
  className = '', 
  delay = 0,
  splitBy = 'word'
}: StaggeredTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const items = splitBy === 'word' ? text.split(' ') : text.split('');

  return (
    <span className={className} style={{ lineHeight: 'inherit' }}>
      {items.map((item, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{
            duration: 0.8,
            delay: index * (splitBy === 'char' ? 0.03 : 0.08),
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="inline-block whitespace-pre"
        >
          {item}
          {splitBy === 'word' && index < items.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </span>
  );
}