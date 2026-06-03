import React, { useEffect, useState } from "react";
import { ArrowRight, Sparkles, MoveRight } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onScrollToExplore: () => void;
  featuredBookCount: number;
}

export default function Hero({ onScrollToExplore, featuredBookCount }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle high-performance scroll monitoring for parallax scroll speeds
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle refined cursor tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Parallax translating rates
  const bgTranslate = scrollY * 0.2;
  const textTranslate = scrollY * 0.05;

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[85vh] flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-hidden border-b border-primary-950/10 bg-[#FDFBF7]"
    >
      {/* Editorial Vertical Meta Tag (Elegant layout touch) */}
      <div className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[10px] font-bold uppercase tracking-[0.4em] text-primary-950/40 pointer-events-none select-none hidden sm:block">
        FEATURED COLLECTION • EDITION 2026
      </div>

      {/* Main Grid Content - Foreground */}
      <div 
        style={{ transform: `translateY(${textTranslate}px)` }}
        className="relative z-20 mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-8 pb-12 transition-transform duration-75"
      >
        {/* Left column text details */}
        <div className="lg:col-span-7 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left pl-0 sm:pl-10">
          {/* Tagline micro-label */}
          <div className="inline-flex items-center gap-2 border-b border-primary-950 pb-2 text-[10px] font-bold tracking-[0.3em] text-primary-950 uppercase">
            <span>EXQUISITE SPECULATIVE PUBLICATIONS</span>
            <span className="opacity-30">•</span>
            <span>{featuredBookCount} TITLES ACTIVE</span>
          </div>

          <div className="space-y-6">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-primary-950 tracking-tight leading-[1.1]">
              Where Every Page <br />
              Is a <span className="italic font-bold">Silent Space</span>
            </h1>
            <p className="text-sm leading-relaxed text-primary-700 font-sans max-w-lg">
              An exploration into minimalist print design, modern architectural journals, and elegant speculative science fiction monographs. Delivered globally with carbon-offset logistics and packaged in biodegradable craft custom wraps.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
            <button
              onClick={onScrollToExplore}
              className="w-full sm:w-auto px-10 py-4 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors cursor-pointer"
            >
              <span>Explore Catalog</span>
            </button>
            <button
              onClick={onScrollToExplore}
              className="w-full sm:w-auto px-8 py-4 border border-primary-950/20 text-primary-950 text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A]/5 transition-colors cursor-pointer"
            >
              <span>Browse Categories</span>
            </button>
          </div>

          {/* Editorial minimalist details bar */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-primary-950/15 w-full max-w-md text-left">
            <div>
              <span className="block font-serif text-2xl font-bold text-primary-950">99.8%</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-primary-500 font-bold">Integrity Rating</span>
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold text-primary-950">12k+</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-primary-500 font-bold">Loyal Collectors</span>
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold text-primary-950">100%</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-primary-500 font-bold">Carbon-Offset</span>
            </div>
          </div>
        </div>

        {/* Right column imagery with editorial overlay panels */}
        <div className="lg:col-span-5 flex justify-center relative mt-6 lg:mt-0">
          {/* Layered Decorative Background Slate */}
          <div 
            style={{
              transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -12}px) rotate(-3deg)`,
            }}
            className="absolute w-[290px] sm:w-[350px] aspect-[4/5] bg-primary-100 z-0 transition-transform duration-300 ease-out border border-[#1A1A1A]/5" 
          />

          {/* Main Visual Element */}
          <div 
            style={{
              transform: `rotateX(${mousePos.y * -8}deg) rotateY(${mousePos.x * 8}deg) translateZ(15px)`,
            }}
            className="relative z-10 w-[270px] sm:w-[330px] aspect-[4/5] bg-primary-50 shadow-xl border border-primary-950/10 group transition-all duration-300 ease-out transform-gpu overflow-hidden"
          >
            {/* Fine line border inset */}
            <div className="absolute inset-2 border border-primary-950/5 pointer-events-none z-10" />
            <img
              src="https://images.unsplash.com/photo-1573592371950-348a8f1d9f38?w=800&auto=format&fit=crop&q=70&ixlib=rb-4.1.0"
              alt="Artisanal Books collection"
              className="w-full h-full object-cover grayscale-[20%]"
              referrerPolicy="no-referrer"
            />

            {/* Parallax Offset Label floating block */}
            <div className="absolute -bottom-1 -right-1 bg-white p-5 border-l border-t border-primary-950/10 z-20 shadow-md text-left pr-8">
              <div className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-1">Inspirations</div>
              <div className="text-sm font-serif italic text-primary-950">Miland & Venice Archive</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
