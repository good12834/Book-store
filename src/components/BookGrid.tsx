import React, { useState, useMemo } from "react";
import { Book } from "../types";
import { CATEGORIES } from "../data";
import { Search, Star, Eye, ShoppingCart, Heart, Tag, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BookGridProps {
  books: Book[];
  onOpenBook: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
}

type SortOption = "popular" | "price-asc" | "price-desc" | "published";

export default function BookGrid({ books, onOpenBook, onAddToCart, onToggleFavorite, favorites }: BookGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  // Filter and sort computation
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // 1. Category filter
    if (selectedCategory !== "All") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    // 2. Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 3. Sorting logic
    if (sortBy === "popular") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "published") {
      result.sort((a, b) => b.publishedYear - a.publishedYear);
    }

    return result;
  }, [books, searchQuery, selectedCategory, sortBy]);

  return (
    <section className="space-y-10" id="explore-catalog">
      {/* Search and Filters bar */}
      <div className="flex flex-col gap-6 bg-[#F5F1EA] p-8 rounded-none border border-primary-950/10">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-950/40" />
            <input
              type="text"
              placeholder="Search author, book, isbn title or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-none border border-primary-950/15 bg-white py-3.5 pl-11 pr-4 text-xs text-primary-950 placeholder-primary-950/40 focus:border-primary-950 focus:outline-none focus:ring-0 transition-all font-sans uppercase tracking-wider"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono tracking-widest uppercase text-primary-500 hover:text-[#1A1A1A]"
              >
                [clear]
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-primary-950/15 px-4 py-3.5 text-[10px] text-primary-950 uppercase font-bold tracking-widest">
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary-950/50" />
              <span>Sort by</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-none border border-primary-950/15 bg-white px-5 py-3.5 text-[10px] text-primary-950 font-bold tracking-widest uppercase focus:border-primary-950 focus:outline-none transition-all cursor-pointer"
            >
              <option value="popular">Popularity (Rating)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="published">New Releases</option>
            </select>
          </div>
        </div>

        {/* Category filtering tags */}
        <div className="flex flex-wrap items-center gap-6 overflow-x-auto pb-1 border-t border-primary-950/10 pt-4">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-1 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all border-b-2 ${
                  isActive
                    ? "border-primary-950 text-primary-950"
                    : "border-transparent text-primary-950/40 hover:text-primary-950 hover:border-primary-950/20"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid listing and counts */}
      <div className="flex items-center justify-between border-b border-primary-950/10 pb-4">
        <h3 className="font-serif text-2xl font-light text-primary-950 tracking-tight italic">
          {selectedCategory === "All" ? "The Archive Catalog" : selectedCategory}
          <span className="ml-3 font-sans text-[10px] not-italic font-bold uppercase tracking-widest text-[#1A1A1A]/40">
            /{filteredAndSortedBooks.length} titles
          </span>
        </h3>

        {searchQuery && (
          <span className="text-[10px] font-mono tracking-wider uppercase text-primary-600">
            Filtered results for "{searchQuery}"
          </span>
        )}
      </div>

      {/* Book cards grid with beautiful Entrance animations */}
      <AnimatePresence mode="popLayout">
        {filteredAndSortedBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-[#FDFBF7] rounded-none border border-dashed border-primary-950/25"
          >
            <div className="h-12 w-12 rounded-none bg-[#F5F1EA] flex items-center justify-center text-[#1A1A1A] mb-4">
              <Search className="h-5 w-5" />
            </div>
            <p className="text-[#1A1A1A] font-serif font-bold text-xl italic">No archives match the query</p>
            <p className="text-xs text-primary-600 mt-2 max-w-sm">Tweak your search parameters or check dynamic filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-6 bg-[#1A1A1A] text-white px-8 py-3 text-[10px] tracking-widest font-bold uppercase hover:bg-[#333] cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredAndSortedBooks.map((book, index) => {
              const isFavorite = favorites.includes(book._id);
              const formattedIndex = String(index + 1).padStart(2, "0");
              return (
                <motion.div
                  layout
                  key={book._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="group relative flex flex-col justify-between bg-[#FDFBF7] border border-[#1A1A1A]/10 p-5 hover:bg-[#F5F1EA] transition-colors cursor-pointer"
                  onClick={() => onOpenBook(book)}
                >
                  {/* Heart bookmark top button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(book._id);
                    }}
                    className="absolute right-8 top-8 z-20 h-7 w-7 flex items-center justify-center bg-white border border-[#1A1A1A]/10 text-primary-950 hover:bg-[#1A1A1A] hover:text-white transition-all cursor-pointer active:scale-95"
                    title={isFavorite ? "Remove bookmark" : "Bookmark this novel"}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 transition-all ${
                        isFavorite ? "fill-[#1A1A1A] text-[#1A1A1A] group-hover:fill-white group-hover:text-white" : ""
                      }`}
                    />
                  </button>

                  <div className="space-y-4">
                    {/* Index count and section (Editorial touch) */}
                    <div className="flex justify-between items-center text-[9px] font-bold tracking-[0.2em] text-[#1A1A1A]/40 uppercase">
                      <span>{formattedIndex} / {book.category}</span>
                      <div className="flex items-center gap-1 font-bold text-primary-950/80 mr-8">
                        <Star className="h-3 w-3 fill-primary-950 text-primary-950" />
                        <span>{book.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Cover view */}
                    <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-primary-100 shadow-container">
                      {/* Spine shading layer */}
                      <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-black/15 z-10" />

                      {/* elegant hover overlay block */}
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary-950/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="px-5 py-2.5 bg-white text-primary-950 text-[10px] font-bold uppercase tracking-widest shadow-lg">
                          INSPECT
                        </span>
                      </div>

                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-103 grayscale-[15%]"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Book Metadata details */}
                    <div className="space-y-1 pt-1">
                      <h4
                        className="font-serif text-lg leading-snug text-primary-950 group-hover:text-[#1A1A1A] font-medium transition-colors line-clamp-1"
                      >
                        {book.title}
                      </h4>
                      <p className="text-xs text-primary-600 line-clamp-1 font-serif italic opacity-75">by {book.author}</p>
                    </div>
                  </div>

                  {/* Price and actions bar */}
                  <div className="mt-4 pt-4 border-t border-[#1A1A1A]/10 flex items-center justify-between">
                    <span className="text-base font-serif font-black text-primary-950">
                      ${book.price.toFixed(2)}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(book);
                      }}
                      className="text-[10px] font-bold uppercase tracking-widest border-b border-primary-950 text-primary-950 hover:opacity-60 transition-opacity cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>ADD (+)</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
