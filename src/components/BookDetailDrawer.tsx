import React, { useState, useEffect } from "react";
import { Book } from "../types";
import { X, Star, ShoppingCart, Tag, BookOpen, Clock, Globe, ShieldCheck, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BookDetailDrawerProps {
  book: Book | null;
  onClose: () => void;
  onAddToCart: (book: Book) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function BookDetailDrawer({ book, onClose, onAddToCart, favorites, onToggleFavorite }: BookDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"synopsis" | "snippet" | "reviews">("synopsis");
  const [pagesRead, setPagesRead] = useState<number | null>(null);

  useEffect(() => {
    if (book) {
      const cached = localStorage.getItem(`lumina_reading_progress_${book._id}`);
      setPagesRead(cached !== null ? parseInt(cached, 10) : null);
    }
  }, [book?._id]);

  if (!book) return null;

  const isFavorite = favorites.includes(book._id);

  const ratio = book.pages > 0 ? (pagesRead ?? 0) / book.pages : 0;
  const percentage = Math.round(ratio * 100);
  const isCompleted = pagesRead === book.pages;

  const handleUpdatePages = (newVal: number) => {
    const boundedVal = Math.max(0, Math.min(book.pages, newVal));
    setPagesRead(boundedVal);
    localStorage.setItem(`lumina_reading_progress_${book._id}`, String(boundedVal));
  };

  const handleStopReading = () => {
    setPagesRead(null);
    localStorage.removeItem(`lumina_reading_progress_${book._id}`);
  };

  const handleMarkCompleted = () => {
    handleUpdatePages(book.pages);
  };

  // Excerpt snippets
  const getExcerpt = () => {
    if (book.category === "Sci-Fi") {
      return `CHAPTER ONE: THE NEBULA’S COLD GRAVE\n\n` +
        `The command deck of the Polaris-IV fell silently cold. The light from standard solar cells had flickered into a faint amber hum six cycles ago. Outside, the great expanse of the Orion Arm lay stretched like an ink-splattered fabric across empty space.\n\n` +
        `"Thermals are dropping," Aria whispered, her breath forming small mist halos against her glowing visor. "If we do not fire the secondary ion injectors within sixty seconds, the ship’s hull will contract. We will become nothing but metal dust in the gravity well of that dead star."\n\n` +
        `Julian didn't answer. He stared out the viewing canopy where the gaseous spirals of a dark nebula churned. In their depth, he saw something else. A flicker. A beacon that shouldn't be there...`;
    }
    if (book.category === "Design & Art") {
      return `CHAPTER ONE: THE ESSENCE OF NOTHING\n\n` +
        `What is design? To define it is often to construct unnecessary walls. When we look at a canvas of pure cotton paper, we do not see an empty space to be aggressive filled. We see the white space as active potential. It is the silence between musical notes that gives the melody its shape.\n\n` +
        `Consider the handle of a pottery cup. It is shaped not merely to fit the finger of the maker, but to reflect the gravity of the liquid it holds and the morning warmth of the drinker’s palm. The finest design is that which goes unnoticed.\n\n` +
        `In this manual, we explore how to sweep away the excessive decorations of modern life to uncover the silent architecture underneath...`;
    }
    if (book.category === "Biography") {
      return `CHAPTER ONE: THE FORGE OF CHARACTER\n\n` +
        `He was born deep within an industrial sector where the sky was perpetually stained a metallic grey by the neighborhood coal furnaces. His grandmother always said he had the eyes of an engineer from the day he could crawl, always disassembling brass alarm clocks and resetting their tiny cogs.\n\n` +
        `"If you can understand how a watch keeps track of the sun," Alistair wrote in an early journal, "you can design a world where time never slips away from your fingers."\n\n` +
        `This is the story of how an insecure boy from Toledo became the legendary Architect of Tokyo...`;
    }
    if (book.category === "Self-Help") {
      return `CHAPTER ONE: THE ATOM PRINCIPLE\n\n` +
        `We are trapped in the myth of the giant leap. We believe that to build a lasting legacy, we must throw ourselves off a cliff and build wings on the descent. But true mastery is constructed in the quiet margins of the everyday.\n\n` +
        `One percent. That is the daily increment of growth we explore here. When you change your morning routine by just eighty seconds, you alter the entire momentum of your neural synapses.\n\n` +
        `Let us examine the concrete physics of habit forming, beginning with the simple spatial architecture of your desk...`;
    }
    // Fiction / Default
    return `CHAPTER ONE: THE LOCK AND CORRIDOR\n\n` +
      `The clocks in Venice were striking eleven in scattered, un-synchronized chimes when Clara stepped off the wooden dock into the damp shadow of the canal. The water lapped against ancient stone brickwork with a dark, heavy hum.\n\n` +
      `She was clutching a worn leather satchel tightly against her chest. Inside was the rusted brass key she had stolen from her uncle’s private museum cabinet only an hour before. It carried no markings, but her heart raced as she located the small gate in the wall.\n\n` +
      `"Everything they told you was a lie," a raspy voice whispered from the darkness of a waiting gondola. Clara froze...`;
  };

  // Reviews
  const getReviews = () => {
    return [
      {
        user: "Marcus D.",
        rating: 5,
        date: "2 weeks ago",
        comment: `Absolutely brilliant! The narrative pacing is incredible, and the tactile premium cover is a wonderful addition to my bookshelf.`
      },
      {
        user: "Eleanor Vance",
        rating: 4.8,
        date: "1 month ago",
        comment: `Excellent depth and wonderful prose. I've read this twice now and always find new underlying design metaphors.`
      }
    ];
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary-950/20 backdrop-blur-xs"
        />

        {/* Drawer container layout */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-[#1A1A1A]/10 bg-[#FDFBF7] shadow-xl"
        >
          {/* Drawer Sticky Header */}
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 p-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase border border-primary-950/15 bg-white px-2.5 py-1">
                {book.category}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary-500">ISBN: {book.isbn}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(book._id)}
                className="p-1.5 text-primary-950 hover:opacity-60 transition-opacity cursor-pointer active:scale-90"
                title={isFavorite ? "Remove favorite" : "Add favorite"}
              >
                <Heart className={`h-4.5 w-4.5 ${isFavorite ? "fill-[#1A1A1A] text-[#1A1A1A]" : ""}`} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-primary-950 hover:opacity-60 transition-opacity cursor-pointer"
                title="Close drawer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Visual Book Cover presentation & Core metrics */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b border-[#1A1A1A]/10 pb-6">
              <div className="relative w-32 h-44 overflow-hidden bg-primary-100 flex-shrink-0 border border-primary-950/10">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-black/15 z-10" />
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover grayscale-[10%]"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left self-center">
                <h3 className="font-serif text-2xl font-bold tracking-tight text-primary-950 leading-tight">
                  {book.title}
                </h3>
                <p className="text-primary-650 font-serif italic text-sm">by {book.author}</p>

                <div className="flex items-center justify-center sm:justify-start gap-1 text-[#1A1A1A] opacity-80">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(book.rating)
                            ? "fill-[#1A1A1A] text-[#1A1A1A]"
                            : "text-primary-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] font-bold text-primary-950 ml-1">
                    {book.rating.toFixed(1)}
                  </span>
                  <span className="text-[9px] font-mono text-primary-500 ml-1 uppercase tracking-widest">
                    ({book.reviewsCount} reviews)
                  </span>
                </div>

                <div className="text-xl font-serif font-black text-primary-950">
                  ${book.price.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Quick technical parameters list */}
            <div className="grid grid-cols-3 gap-4 p-4 border border-[#1A1A1A]/10 bg-[#F5F1EA]/50 text-center">
              <div className="space-y-1">
                <span className="block text-[8px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Pages</span>
                <span className="font-serif font-bold text-sm text-primary-900 flex items-center justify-center gap-1">
                  {book.pages}
                </span>
              </div>
              <div className="space-y-1 border-x border-[#1A1A1A]/10">
                <span className="block text-[8px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Release</span>
                <span className="font-serif font-bold text-sm text-primary-900 flex items-center justify-center gap-1">
                  {book.publishedYear}
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-[8px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Publisher</span>
                <span className="font-serif font-bold text-xs text-primary-900 truncate block px-1" title={book.publisher}>
                  {book.publisher}
                </span>
              </div>
            </div>

            {/* Reading progress selector */}
            {pagesRead === null ? (
              <div className="border border-[#1A1A1A]/10 bg-white p-5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Your Progress</span>
                  <h4 className="font-serif text-sm font-bold text-primary-950 italic">
                    Not started yet
                  </h4>
                </div>
                <button
                  onClick={() => {
                    handleUpdatePages(0);
                  }}
                  className="px-4 py-2 border border-[#1A1A1A] text-[#1A1A1A] text-[9px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
                >
                  Start Reading
                </button>
              </div>
            ) : (
              <div className="border border-[#1A1A1A]/10 bg-white p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Your Progress</span>
                    <h4 className="font-serif text-sm font-bold text-primary-950 italic flex items-center gap-1.5">
                      {isCompleted ? (
                        <>
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-600" />
                          <span>Journey Completed</span>
                        </>
                      ) : (
                        <>
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1A1A1A] animate-pulse" />
                          <span>Voyage In Progress</span>
                        </>
                      )}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    {!isCompleted && (
                      <button
                        onClick={handleMarkCompleted}
                        className="text-[9px] font-bold uppercase tracking-wider text-primary-950/60 hover:text-primary-950 underline px-1 cursor-pointer font-sans"
                      >
                        Finish
                      </button>
                    )}
                    <button
                      onClick={handleStopReading}
                      className="text-[9px] font-bold uppercase tracking-wider text-red-700/60 hover:text-red-700 underline px-1 cursor-pointer font-sans"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Progress bar and percentages */}
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full bg-[#1A1A1A]/5 overflow-hidden">
                    <div
                      className="h-full bg-[#1A1A1A] transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-primary-500">
                    <span>Read {pagesRead} of {book.pages} pages</span>
                    <span className="font-bold">{percentage}%</span>
                  </div>
                </div>

                {/* Micro slider adjusts */}
                <div className="flex items-center gap-4 pt-1">
                  <input
                    type="range"
                    min="0"
                    max={book.pages}
                    value={pagesRead}
                    onChange={(e) => handleUpdatePages(parseInt(e.target.value, 10))}
                    className="flex-1 h-1 bg-[#1A1A1A]/10 accent-[#1A1A1A] outline-none cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdatePages(pagesRead - 1)}
                      disabled={pagesRead <= 0}
                      className="h-7 w-7 flex items-center justify-center border border-[#1A1A1A]/10 hover:bg-[#F5F1EA] hover:border-[#1A1A1A] disabled:opacity-30 disabled:hover:bg-transparent text-xs hover:text-primary-950 transition-all cursor-pointer font-bold"
                      title="Previous Page"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleUpdatePages(pagesRead + 1)}
                      disabled={pagesRead >= book.pages}
                      className="h-7 w-7 flex items-center justify-center border border-[#1A1A1A]/10 hover:bg-[#F5F1EA] hover:border-[#1A1A1A] disabled:opacity-30 disabled:hover:bg-transparent text-xs hover:text-primary-950 transition-all cursor-pointer font-bold"
                      title="Next Page"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Drawer interactive switch Tabs */}
            <div className="space-y-4">
              <div className="flex border-b border-primary-950/10">
                {(["synopsis", "snippet", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 pb-2 text-[10px] font-bold tracking-widest uppercase cursor-pointer border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-primary-950 text-primary-950 font-black"
                        : "border-transparent text-primary-950/40 hover:text-primary-950"
                    }`}
                  >
                    {tab === "synopsis" ? "Synopsis" : tab === "snippet" ? "Look Inside" : "Reviews"}
                  </button>
                ))}
              </div>

              {/* Tab render switchbox */}
              <div className="min-h-[160px]">
                <AnimatePresence mode="wait">
                  {activeTab === "synopsis" && (
                    <motion.div
                      key="synopsis"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs sm:text-sm text-primary-700 leading-relaxed font-sans space-y-4"
                    >
                      <p>{book.description}</p>
                      <p className="font-serif italic text-primary-650">
                        This work is an exquisite literary asset tailored for enthusiasts requiring structured, deeply satisfying compositions. Delivered in tactile cover stock bindings.
                      </p>
                    </motion.div>
                  )}

                  {activeTab === "snippet" && (
                    <motion.div
                      key="snippet"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-5 bg-[#1A1A1A] text-[#FDFBF7] font-serif text-xs leading-relaxed whitespace-pre-line border border-[#1A1A1A] max-h-[280px] overflow-y-auto"
                    >
                      {getExcerpt()}
                    </motion.div>
                  )}

                  {activeTab === "reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {getReviews().map((review, i) => (
                        <div key={i} className="p-4 border border-[#1A1A1A]/10 bg-white space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-xs text-primary-950">{review.user}</span>
                            <span className="text-[9px] font-mono uppercase tracking-wider text-primary-400">{review.date}</span>
                          </div>
                          <div className="flex items-center text-primary-950 opacity-70">
                            {[...Array(5)].map((_, starIndex) => (
                              <Star key={starIndex} className="h-2.5 w-2.5 fill-[#1A1A1A] text-[#1A1A1A]" />
                            ))}
                          </div>
                          <p className="text-xs text-primary-800 italic leading-relaxed">
                            "{review.comment}"
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Reassurances seals block */}
            <div className="pt-4 border-t border-[#1A1A1A]/10 text-[10px] uppercase font-bold tracking-widest text-primary-600 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#1A1A1A]/60 flex-shrink-0" />
                <span>Pristine Edition Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#1A1A1A]/60 flex-shrink-0" />
                <span>Carbon-Offset Dispatches Wrap</span>
              </div>
            </div>
          </div>

          {/* Drawer Sticky Footer Action box */}
          <div className="border-t border-[#1A1A1A]/10 bg-[#F5F1EA]/50 p-6">
            <button
              onClick={() => {
                onAddToCart(book);
              }}
              className="w-full px-8 py-4 bg-[#1A1A1A] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#333] cursor-pointer transition-colors"
            >
              <span>Add to Literary Bag</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
