import React from "react";
import { WHY_CHOOSE_US } from "../data";

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 border-t border-primary-950/10 bg-primary-100" id="about">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 space-y-16">
        {/* Title area */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-primary-950 uppercase">
            THE LUMINA BENCHMARK
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-primary-950 italic">
            Why Discerning Readers Choose Us
          </h2>
          <p className="text-sm text-primary-700 font-sans">
            We operate in the silent borders between conventional commerce and modern paper preservation, delivering exquisite books to enthusiasts globally.
          </p>
        </div>

        {/* Feature Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-[#1A1A1A]/10">
          {WHY_CHOOSE_US.map((item, index) => {
            const formattedIndex = String(index + 1).padStart(2, "0");
            return (
              <div
                key={item.title}
                className="group p-8 bg-[#FDFBF7] hover:bg-[#1A1A1A] hover:text-white border-r border-b border-[#1A1A1A]/10 transition-colors duration-300 flex flex-col justify-between min-h-[220px]"
              >
                {/* Number Indicator (luxurious editorial styling) */}
                <div className="text-[10px] font-mono font-bold text-primary-500 group-hover:text-white/40 transition-colors">
                  {formattedIndex} / INK
                </div>

                <div className="space-y-2 mt-6">
                  <h4 className="font-serif font-bold text-lg text-primary-950 group-hover:text-white transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-primary-700 group-hover:text-[#FDFBF7]/70 transition-colors leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
