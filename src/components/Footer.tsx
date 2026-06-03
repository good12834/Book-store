import React, { useState } from "react";
import { BookOpen, Send, Check } from "lucide-react";

interface FooterProps {
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== "") {
      const emailTrimmed = email.trim().toLowerCase();
      // Fetch and update local subscribers registry so Admin Dashboard displays it in real-time
      const cached = localStorage.getItem("lumina_newsletter_subs");
      let list: string[] = [];
      if (cached) {
        try {
          list = JSON.parse(cached);
        } catch (err) {}
      }
      if (!list.includes(emailTrimmed)) {
        list.push(emailTrimmed);
        localStorage.setItem("lumina_newsletter_subs", JSON.stringify(list));
      }
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-[#FDFBF7] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-16 space-y-16">
        {/* Top bar with signups & logotypes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/10 pb-12">
          <div className="lg:col-span-5 space-y-3">
            <h4 className="font-serif text-2xl font-light text-white italic tracking-tight">
              Join the Circle
            </h4>
            <p className="text-xs text-[#FDFBF7]/60 font-light max-w-sm leading-relaxed">
              Receive limited dispatch notes regarding new micro-editions, alchemist covers, and author diaries.
            </p>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg lg:ml-auto">
              <input
                type="email"
                required
                placeholder="Your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-none border border-white/20 bg-white/5 py-3.5 px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white transition-all font-sans uppercase tracking-wider"
              />
              <button
                type="submit"
                className="bg-white hover:bg-[#F5F1EA] text-primary-950 font-bold px-8 py-3.5 rounded-none cursor-pointer transition-colors text-[10px] tracking-widest uppercase flex items-center justify-center"
              >
                {subscribed ? "SUBSCRIBED" : "JOIN DISPATCH"}
              </button>
            </form>
          </div>
        </div>

        {/* Links directory column matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[11px] font-sans text-[#FDFBF7]/70">
          <div className="space-y-4">
            <h5 className="font-mono font-bold text-white uppercase tracking-widest text-[9px] opacity-40">Collection categories</h5>
            <ul className="space-y-2.5">
              <li><a href="#explore-catalog" className="hover:text-white transition-colors">Speculative Sci-Fi</a></li>
              <li><a href="#explore-catalog" className="hover:text-white transition-colors">Japanese Design</a></li>
              <li><a href="#explore-catalog" className="hover:text-white transition-colors">Historical Fiction</a></li>
              <li><a href="#explore-catalog" className="hover:text-white transition-colors">Creative Self-Help</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-mono font-bold text-white uppercase tracking-widest text-[9px] opacity-40">Tactile Outposts</h5>
            <ul className="space-y-2.5">
              <li><span className="text-white">Sanctuary Tokyo</span> — Shibuya 2-Chome</li>
              <li><span className="text-white">Monastery Venice</span> — Canal Grande</li>
              <li><span className="text-white">Archive Portland</span> — Pearl District</li>
              <li><span className="text-white">Lumina London</span> — Chelsea Embankment</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-mono font-bold text-white uppercase tracking-widest text-[9px] opacity-40">Our integrity safeguards</h5>
            <ul className="space-y-2.5">
              <li><a href="#about" className="hover:text-white transition-colors">Biodegradable Wrapping policy</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Prerogated pristine conditions</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Carbon footprint offsets</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Paper Mill community funds</a></li>
            </ul>
          </div>

          <div className="space-y-4 md:text-right">
            <div className="inline-flex items-center gap-2 text-white pb-1">
              <span className="font-serif text-xl font-bold tracking-tighter uppercase text-white">LUMINA & CO.</span>
            </div>
            <p className="text-[#FDFBF7]/50 leading-relaxed max-w-[200px] md:ml-auto">
              Our libraries are active environments tailored for cognitive enrichment and paper preservation.
            </p>
          </div>
        </div>

        {/* Bottom copyright notice row */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-[#FDFBF7]/40 gap-4">
          <p>© 2026 Lumina Curation Group. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors cursor-pointer underline uppercase tracking-widest text-[9px]"
              title="Enter secure dashboard admin panel"
            >
              Admin Entrance
            </button>
            <p className="border-l border-white/20 pl-4">ESTABLISHED MMXXVI</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
