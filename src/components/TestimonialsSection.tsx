import React from "react";
import { TESTIMONIALS } from "../data";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="py-20 border-t border-primary-950/10 bg-[#FDFBF7]" id="testimonials">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 space-y-16">
        {/* Title details */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#1A1A1A] uppercase">
            READER TESTIMONIES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-primary-950 italic">
            What Our Collectors Think
          </h2>
          <p className="text-sm text-primary-700 font-sans">
            Read what designers, theorists, and literature lovers from around the world have to say about our unique, carbon-neutral bookstore.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <div
              key={index}
              className="relative flex flex-col justify-between p-8 bg-[#F5F1EA]/40 border border-[#1A1A1A]/10 rounded-none transition-all duration-300"
            >
              {/* Double quotation watermark */}
              <Quote className="absolute right-8 top-8 h-8 w-8 text-[#1A1A1A]/5 pointer-events-none" />

              <div className="space-y-4">
                <div className="flex text-primary-950 gap-0.5 opacity-80">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-[#1A1A1A] text-[#1A1A1A]" />
                  ))}
                </div>

                <p className="text-sm text-primary-950 font-serif leading-relaxed italic opacity-95">
                  "{t.quote}"
                </p>
              </div>

              {/* Author profile indicators */}
              <div className="flex items-center gap-4 pt-6 border-t border-[#1A1A1A]/10 mt-8">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="h-10 w-10 rounded-none border border-[#1A1A1A]/10 object-cover grayscale"
                />
                <div>
                  <h5 className="font-serif font-bold text-sm text-primary-950">{t.author}</h5>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-primary-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
