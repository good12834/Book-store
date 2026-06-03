import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeaturedSlider from "./components/FeaturedSlider";
import BookGrid from "./components/BookGrid";
import WhyChooseUsSection from "./components/WhyChooseUsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import BookDetailDrawer from "./components/BookDetailDrawer";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import { MOCK_BOOKS } from "./data";
import { Book, CartItem } from "./types";
import { Sparkles, Check, Heart, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => {
    const cached = localStorage.getItem("lumina_books");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (err) {
        console.error("Failed to parse cached stock books list", err);
      }
    }
    return MOCK_BOOKS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Custom toast notification states
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState<"success" | "favorite">("success");

  // Load cart and favorites from Local Storage for standard client persistence
  useEffect(() => {
    const cachedCart = localStorage.getItem("lumina_cart");
    const cachedFavs = localStorage.getItem("lumina_favs");
    if (cachedCart) {
      try {
        setCart(JSON.parse(cachedCart));
      } catch (e) {
        console.error("Failed to parse cached cart", e);
      }
    }
    if (cachedFavs) {
      try {
        setFavorites(JSON.parse(cachedFavs));
      } catch (e) {
        console.error("Failed to parse cached favorites", e);
      }
    }
  }, []);

  // Sync state modifications to Local Storage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("lumina_cart", JSON.stringify(newCart));
  };

  const saveFavorites = (newFavs: string[]) => {
    setFavorites(newFavs);
    localStorage.setItem("lumina_favs", JSON.stringify(newFavs));
  };

  // Toast notifier helper
  const triggerToast = (msg: string, iconType: "success" | "favorite" = "success") => {
    setToastMessage(msg);
    setToastIcon(iconType);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Actions
  const handleAddToCart = (book: Book) => {
    const existingIndex = cart.findIndex((item) => item.book._id === book._id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      const updated = [...cart, { book, quantity: 1 }];
      saveCart(updated);
    }
    triggerToast(`Added "${book.title}" to your Bag!`, "success");
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    const updated = cart
      .map((item) => {
        if (item.book._id === id) {
          return { ...item, quantity: qty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    saveCart(updated);
  };

  const handleRemoveItem = (id: string) => {
    const task = cart.find((i) => i.book._id === id);
    const updated = cart.filter((item) => item.book._id !== id);
    saveCart(updated);
    if (task) {
      triggerToast(`Removed "${task.book.title}" from your Bag.`, "success");
    }
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  // CRUD actions for the custom stocks
  const handleAddBook = (newBook: Book) => {
    const updated = [newBook, ...books];
    setBooks(updated);
    localStorage.setItem("lumina_books", JSON.stringify(updated));
    triggerToast(`"${newBook.title}" was injected to active stock!`, "success");
  };

  const handleUpdateBook = (updatedBook: Book) => {
    const updated = books.map(b => b._id === updatedBook._id ? updatedBook : b);
    setBooks(updated);
    localStorage.setItem("lumina_books", JSON.stringify(updated));
    triggerToast(`"${updatedBook.title}" records updated successfully!`, "success");
  };

  const handleDeleteBook = (id: string) => {
    const target = books.find(b => b._id === id);
    const updated = books.filter(b => b._id !== id);
    setBooks(updated);
    localStorage.setItem("lumina_books", JSON.stringify(updated));
    if (target) {
      triggerToast(`Depreceted "${target.title}" from active stock.`, "success");
    }
  };

  const handleResetCatalog = () => {
    setBooks(MOCK_BOOKS);
    localStorage.setItem("lumina_books", JSON.stringify(MOCK_BOOKS));
    triggerToast("Injected standard library stock defaults.", "success");
  };

  const handleToggleFavorite = (id: string) => {
    const exists = favorites.includes(id);
    let updated: string[];
    const targetBook = books.find((b) => b._id === id);
    
    if (exists) {
      updated = favorites.filter((favId) => favId !== id);
      if (targetBook) {
        triggerToast(`Removed bookmark from "${targetBook.title}"`, "favorite");
      }
    } else {
      updated = [...favorites, id];
      if (targetBook) {
        triggerToast(`Bookmarked "${targetBook.title}" to favorites!`, "favorite");
      }
    }
    saveFavorites(updated);
  };

  const handleScrollToExplore = () => {
    const element = document.getElementById("explore-catalog");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 text-primary-950 font-sans selection:bg-accent-500/25 relative flex flex-col justify-between">
      
      {/* Sticky Header Navigation */}
      <Header
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        favoritesCount={favorites.length}
        onScrollToExplore={handleScrollToExplore}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1 w-full space-y-16 pb-20">
        
        {/* Parallax Hero Board */}
        <Hero 
          onScrollToExplore={handleScrollToExplore}
          featuredBookCount={books.length}
        />

        {/* Home body wrapper */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Main image slider for featured products */}
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-mono font-bold tracking-widest text-accent-700 uppercase">
                SPOTLIGHT EDITIONS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary-950 mt-1">
                Featured Literary Masterpieces
              </h2>
            </div>
            
            <FeaturedSlider
              books={books}
              onOpenBook={(book) => setSelectedBook(book)}
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* Catalog BookGrid list */}
          <BookGrid
            books={books}
            onOpenBook={(book) => setSelectedBook(book)}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        </div>

        {/* Why Choose Us marketing indicators */}
        <WhyChooseUsSection />

        {/* Client Testimonials Carousel */}
        <TestimonialsSection />
      </main>

      {/* Footer copyright rows */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Book Detail Overlay Drawer */}
      <BookDetailDrawer
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onAddToCart={(book) => {
          handleAddToCart(book);
          setSelectedBook(null);
        }}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Shopping Cart Drawer Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenBook={(b) => setSelectedBook(b)}
      />

      {/* Secure Cryptographic Admin Portal Locker Panel */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        books={books}
        onAddBook={handleAddBook}
        onUpdateBook={handleUpdateBook}
        onDeleteBook={handleDeleteBook}
        onResetCatalog={handleResetCatalog}
      />

      {/* Dynamic Visual Toast Micro-feedback Popup notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-primary-950 text-primary-100 border border-primary-800/40 px-5 py-4 rounded-xl shadow-lg shadow-black/25 max-w-sm"
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              toastIcon === "success" ? "bg-accent-150 text-accent-700" : "bg-accent-100 text-accent-700"
            }`}>
              {toastIcon === "success" ? (
                <Check className="h-4.5 w-4.5" />
              ) : (
                <Heart className="h-4.5 w-4.5 fill-accent-500" />
              )}
            </div>
            <p className="text-xs font-mono font-medium leading-relaxed flex-1">
              {toastMessage}
            </p>
            <button
              onClick={() => setToastMessage("")}
              className="text-primary-500 hover:text-primary-200 cursor-pointer p-0.5 ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
