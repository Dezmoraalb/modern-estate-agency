import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface PhoneShowcaseProps {
  baseUrl: string;
}

export default function PhoneShowcase({ baseUrl }: PhoneShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  const springConfig = { damping: 25, stiffness: 200 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="lg:w-1/2 flex justify-center lg:justify-end fade-in-section">
      <motion.div
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-[290px] h-[580px] md:w-[340px] md:h-[680px] rounded-[3rem] md:rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] mx-auto"
      >
        <div className="absolute inset-0 rounded-[3rem] md:rounded-[3.5rem] bg-gradient-to-b from-[#4a4a4a] via-[#2a2a2a] to-[#1a1a1a] p-[1px]">
          <div className="absolute inset-[1px] rounded-[2.9rem] md:rounded-[3.4rem] bg-[#000] border-[4px] border-[#1a1a1a] shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] overflow-hidden">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
            </div>

            <div
              id="notification-badge"
              className="absolute top-12 right-8 z-50 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            >
              3
            </div>

            <div className="w-full h-full bg-[#0e1621] overflow-hidden relative">
              <div className="w-full h-full relative">
                <div
                  id="telegram-scroll"
                  className="w-full animate-scroll flex flex-col"
                >
                  <img
                    src={`${baseUrl}assets/message-from-channell.jpg`}
                    className="w-full block"
                    alt="Post 1"
                  />
                  <img
                    src={`${baseUrl}assets/message-from-channell_2.jpg`}
                    className="w-full block"
                    alt="Post 2"
                  />
                  <img
                    src={`${baseUrl}assets/message-from-channell_3.jpg`}
                    className="w-full block"
                    alt="Post 3"
                  />
                  <img
                    src={`${baseUrl}assets/message-from-channell_4.jpg`}
                    className="w-full block"
                    alt="Post 4"
                  />
                  <img
                    src={`${baseUrl}assets/message-from-channell.jpg`}
                    className="w-full block"
                    alt="Post 1 Dup"
                  />
                  <img
                    src={`${baseUrl}assets/message-from-channell_2.jpg`}
                    className="w-full block"
                    alt="Post 2 Dup"
                  />
                  <img
                    src={`${baseUrl}assets/message-from-channell_3.jpg`}
                    className="w-full block"
                    alt="Post 3 Dup"
                  />
                  <img
                    src={`${baseUrl}assets/message-from-channell_4.jpg`}
                    className="w-full block"
                    alt="Post 4 Dup"
                  />
                </div>
              </div>

              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0e1621] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0e1621] via-[#0e1621] to-transparent z-10 pointer-events-none"></div>

              <div className="absolute bottom-8 left-0 w-full px-6 z-50">
                <a
                  href="https://t.me/modern_estate_agency_ukraine"
                  target="_blank"
                  className="relative block group w-full py-4 bg-[#2AABEE] text-white text-center font-bold rounded-xl shadow-[0_10px_40px_-10px_rgba(42,171,238,0.5)] overflow-hidden hover:bg-[#3395cc] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  ПІДПИСАТИСЯ
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


