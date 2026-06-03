import React, { useState, useEffect, useRef } from "react";
import { Book } from "../types";
import { ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FeaturedSliderProps {
  books: Book[];
  onOpenBook: (book: Book) => void;
  onAddToCart: (book: Book) => void;
}

export default function FeaturedSlider({ books, onOpenBook, onAddToCart }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const featuredBooks = books.filter((b) => b.featured);

  useEffect(() => {
    if (isPlaying && featuredBooks.length > 0) {
      autoPlayTimer.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredBooks.length);
      }, 7000); // 7 seconds slide intervals
    }
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPlaying, featuredBooks.length]);

  if (featuredBooks.length === 0) return null;

  const currentBook = featuredBooks[currentIndex];

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? featuredBooks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % featuredBooks.length);
  };

  const selectSlide = (idx: number) => {
    setIsPlaying(false);
    setCurrentIndex(idx);
  };

  return (
    <div className="relative w-full rounded-none border border-primary-950/15 bg-[#FDFBF7] p-8 md:p-14 overflow-hidden shadow-none">
      {/* Absolute Decorative Watermark */}
      <div className="absolute right-4 top-2 text-6xl md:text-8xl font-serif italic text-[#1A1A1A]/5 pointer-events-none select-none">
        Featured Selection
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-center">
        {/* Left Side: Book Narrative Information */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase border border-primary-950/15 bg-white px-3 py-1.5 rounded-none">
              CURATED MASTERPIECE
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#1A1A1A]/50 uppercase">
              SELECTION {currentIndex + 1} OF {featuredBooks.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentBook._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-4"
            >
              <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight text-primary-950 leading-tight">
                {currentBook.title}
              </h2>
              <p className="text-sm font-serif italic text-primary-600 opacity-80">
                by {currentBook.author}
              </p>

              {/* Star Rating & Statistics */}
              <div className="flex items-center gap-4 py-1 text-[10px] font-mono uppercase tracking-widest text-primary-950/60">
                <div className="flex items-center gap-1 border border-primary-950/10 px-2 py-0.5 text-primary-950 font-bold bg-[#F5F1EA]">
                  <Star className="h-3 w-3 fill-[#1A1A1A] text-[#1A1A1A]" />
                  <span>{currentBook.rating.toFixed(1)}</span>
                </div>
                <span>{currentBook.pages} pages</span>
                <span>ISBN: {currentBook.isbn}</span>
              </div>

              {/* Dynamic synopsis */}
              <p className="text-xs sm:text-sm text-primary-700 leading-relaxed max-w-xl font-sans">
                {currentBook.description}
              </p>

              {/* Tags panel */}
              <div className="flex flex-wrap gap-2 pt-2">
                {currentBook.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono uppercase tracking-wider bg-primary-100 text-[#1A1A1A] px-2.5 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Slider action row */}
              <div className="flex flex-col sm:flex-row gap-6 pt-6 items-start sm:items-center">
                <div className="flex items-baseline gap-1 mr-4">
                  <span className="text-xs font-serif italic text-primary-500">$</span>
                  <span className="text-3xl font-serif font-black text-primary-950">
                    {currentBook.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => onAddToCart(currentBook)}
                    className="flex-1 sm:flex-none px-8 py-3.5 bg-[#1A1A1A] text-white text-[10px] uppercase font-bold tracking-widest rounded-none hover:bg-[#333] cursor-pointer transition-colors"
                  >
                    <span>Purchase Book</span>
                  </button>
                  <button
                    onClick={() => onOpenBook(currentBook)}
                    className="flex-1 sm:flex-none px-6 py-3.5 border border-primary-950/20 text-primary-950 text-[10px] uppercase font-bold tracking-widest rounded-none hover:bg-primary-950/5 cursor-pointer transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>View Outline</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Showcase Cover Image with elegant reflection shadows */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative md:my-0 my-4">
          {/* Layered Decorative Slate behind the book */}
          <div className="absolute w-[190px] sm:w-[240px] aspect-[3/3.8] bg-[#F5F1EA] -rotate-3 border border-primary-950/5 pointer-events-none z-0" />

          <div className="relative group z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBook._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-[180px] sm:w-[230px] aspect-[3/3.8] overflow-hidden bg-[#FDFBF7] border border-primary-950/10 cursor-pointer shadow-md"
                onClick={() => onOpenBook(currentBook)}
              >
                {/* Book spine line shader */}
                <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-black/15 z-20" />
                <img
                  src={currentBook.coverImage}
                  alt={currentBook.title}
                  className="w-full h-full object-cover grayscale-[10%] hover:scale-103 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>

            {/* Subtle floating high contrast discount tag */}
            <div className="absolute -bottom-2 -right-2 z-20 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5">
              Save 10%
            </div>
          </div>

          {/* Autoplay cycle line progress bar */}
          <div className="w-full max-w-[180px] sm:max-w-[230px] h-[1px] bg-primary-200 mt-8 overflow-hidden">
            <motion.div
              key={currentIndex + isPlaying.toString()}
              initial={{ width: "0%" }}
              animate={isPlaying ? { width: "100%" } : { width: "0%" }}
              transition={isPlaying ? { duration: 7, ease: "linear" } : { duration: 0 }}
              className="h-full bg-primary-950"
            />
          </div>
        </div>
      </div>

      {/* Manual Controls & Indicator lines */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center relative z-20 border-t border-primary-[#1A1A1A]/10 pt-6">
        <div className="flex gap-3">
          {featuredBooks.map((book, idx) => (
            <button
              key={book._id}
              onClick={() => selectSlide(idx)}
              className={`h-[2px] cursor-pointer transition-all duration-300 ${
                idx === currentIndex ? "w-10 bg-primary-950" : "w-3 bg-primary-300 hover:bg-primary-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="flex h-10 w-10 cursor-pointer items-center justify-center bg-white hover:bg-primary-100/50 text-[#1A1A1A] border border-[#1A1A1A]/10 transition-colors"
            title="Previous Curated"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="flex h-10 w-10 cursor-pointer items-center justify-center bg-[#1A1A1A] hover:bg-[#333] text-white transition-colors"
            title="Next Curated"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
