import React from "react";
import { BookOpen, ShoppingBag, Heart } from "lucide-react";
import { CartItem } from "../types";

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  favoritesCount: number;
  onScrollToExplore: () => void;
  onOpenAdmin: () => void;
}

export default function Header({ cart, onOpenCart, favoritesCount, onScrollToExplore, onOpenAdmin }: HeaderProps) {
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary-950/10 bg-primary-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        {/* Brand Logo - Editorial Serif Style */}
        <div className="flex items-center gap-3">
          <span className="font-serif text-2xl font-black tracking-tighter text-primary-950 uppercase">
            LUMINA<span className="font-sans font-light text-primary-500 text-lg lowercase tracking-normal"> & Co.</span>
          </span>
        </div>

        {/* Navigation - Editorial tracked-out links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-950">
          <button 
            onClick={onScrollToExplore}
            className="transition-colors hover:opacity-100 cursor-pointer border-b border-primary-950"
          >
            Store
          </button>
          <a href="#about" className="opacity-50 hover:opacity-100 transition-opacity">Why Lumina</a>
          <a href="#testimonials" className="opacity-50 hover:opacity-100 transition-opacity">Testimonials</a>
          <button 
            onClick={onOpenAdmin}
            className="opacity-50 hover:opacity-100 transition-opacity uppercase cursor-pointer"
          >
            Admin
          </button>
          <span className="h-3 w-[1px] bg-primary-950/20" />
          <span className="text-[9px] font-mono tracking-widest text-[#1A1A1A] flex items-center gap-1.5 bg-[#1A1A1A]/5 px-2.5 py-1">
            <span className="h-1 w-1 bg-[#1A1A1A]" />
            EDITION 2026
          </span>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-6">
          <button 
            title="Favorites"
            className="relative p-1 text-primary-950 hover:opacity-70 transition-opacity cursor-pointer flex items-center gap-1.5"
          >
            <Heart className="h-4.5 w-4.5" strokeWidth={1.5} />
            {favoritesCount > 0 && (
              <span className="text-[10px] font-bold font-mono">
                ({favoritesCount})
              </span>
            )}
          </button>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#333] transition-colors cursor-pointer"
          >
            <span>BAG ({totalCartItems})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
