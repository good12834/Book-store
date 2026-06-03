import React, { useState, useEffect } from "react";
import { Book } from "../types";
import { 
  X, Lock, Key, TrendingUp, BookOpen, ShoppingBag, Mail, Plus, 
  Trash2, Edit, Search, Check, AlertCircle, DollarSign, Calendar, Layers, 
  ChevronRight, Filter, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onAddBook: (book: Book) => void;
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onResetCatalog: () => void;
}

interface OrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: { title: string; quantity: number; price: number }[];
  grandTotal: number;
  timestamp: string;
  status: "Pending" | "Dispatched" | "Delivered";
}

export default function AdminDashboard({
  isOpen,
  onClose,
  books,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onResetCatalog,
}: AdminDashboardProps) {
  // Authorization State
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "orders" | "subscribers">("overview");

  // Catalog CRUD States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState("Sci-Fi");
  const [formDescription, setFormDescription] = useState("");
  const [formPages, setFormPages] = useState("");
  const [formYear, setFormYear] = useState("2026");
  const [formIsbn, setFormIsbn] = useState("");
  const [formPublisher, setFormPublisher] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formError, setFormError] = useState("");

  // Subscriptions & Orders
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>([]);

  // Categories helper
  const categories = ["Sci-Fi", "Fiction", "Design & Art", "Self-Help", "Biography"];

  // Authenticate from session cache
  useEffect(() => {
    const isAuthed = sessionStorage.getItem("lumina_admin_authorized");
    if (isAuthed === "true") {
      setIsAuthorized(true);
    }
  }, []);

  // Fetch orders and subscribers on open
  useEffect(() => {
    if (isOpen) {
      // Fetch orders from Local Storage
      const cachedOrders = localStorage.getItem("lumina_orders");
      if (cachedOrders) {
        try {
          setOrders(JSON.parse(cachedOrders));
        } catch (e) {
          console.error("Failed to parse orders", e);
        }
      } else {
        // Pre-populate some realistic initial completed dispatches for high aesthetic starting state
        const demoOrders: OrderRecord[] = [
          {
            id: "ORD-9482",
            customerName: "Sarah Jenkins",
            customerEmail: "sarah.j@designco.com",
            shippingAddress: "452 Shibuyu Road, Tokyo, JP",
            items: [
              { title: "Modern Minimalism", quantity: 1, price: 45.00 },
              { title: "Creative Sparks", quantity: 2, price: 16.99 }
            ],
            grandTotal: 80.48,
            timestamp: "2026-06-02T16:45:00Z",
            status: "Dispatched"
          },
          {
            id: "ORD-1108",
            customerName: "Clara Oswald",
            customerEmail: "clara.o@vintagearchive.edu",
            shippingAddress: "Canal Grande 12, Venice, IT",
            items: [
              { title: "The Golden Gateway", quantity: 1, price: 18.50 }
            ],
            grandTotal: 24.99,
            timestamp: "2026-06-03T02:15:10Z",
            status: "Pending"
          }
        ];
        setOrders(demoOrders);
        localStorage.setItem("lumina_orders", JSON.stringify(demoOrders));
      }

      // Fetch newsletter subs
      const cachedSubs = localStorage.getItem("lumina_newsletter_subs");
      if (cachedSubs) {
        try {
          setSubscribers(JSON.parse(cachedSubs));
        } catch (e) {
          console.error("Failed to parse subs", e);
        }
      } else {
        const demoSubs = ["collector.vance@stellar.net", "archivist_kenji@minimal.co.jp", "lia.bookworm@oxford.edu"];
        setSubscribers(demoSubs);
        localStorage.setItem("lumina_newsletter_subs", JSON.stringify(demoSubs));
      }
    }
  }, [isOpen]);

  // Auth unlock submission
  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (passcode.toLowerCase() === "admin") {
      setIsAuthorized(true);
      sessionStorage.setItem("lumina_admin_authorized", "true");
      setPasscode("");
    } else {
      setAuthError("CRYPTOGRAPHIC REJECTION. INCORRECT PASSCODE.");
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem("lumina_admin_authorized");
  };

  // Setup form for creating
  const openNewBookForm = () => {
    setEditingBook(null);
    setFormTitle("");
    setFormAuthor("");
    setFormPrice("");
    setFormCategory("Sci-Fi");
    setFormDescription("");
    setFormPages("");
    setFormYear("2026");
    setFormIsbn(`978-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setFormPublisher("");
    setFormCoverImage("");
    setFormTags("");
    setFormFeatured(false);
    setFormError("");
    setIsFormOpen(true);
  };

  // Setup form for editing
  const openEditBookForm = (book: Book) => {
    setEditingBook(book);
    setFormTitle(book.title);
    setFormAuthor(book.author);
    setFormPrice(String(book.price));
    setFormCategory(book.category);
    setFormDescription(book.description);
    setFormPages(String(book.pages));
    setFormYear(String(book.publishedYear));
    setFormIsbn(book.isbn);
    setFormPublisher(book.publisher);
    setFormCoverImage(book.coverImage);
    setFormTags(book.tags.join(", "));
    setFormFeatured(book.featured);
    setFormError("");
    setIsFormOpen(true);
  };

  // Submit CRUD Save
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formTitle.trim()) return setFormError("Title is required");
    if (!formAuthor.trim()) return setFormError("Author is required");
    
    const parsedPrice = parseFloat(formPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) return setFormError("Price must be a positive number");

    const parsedPages = parseInt(formPages, 10);
    if (isNaN(parsedPages) || parsedPages <= 0) return setFormError("Pages must be a number");

    const parsedYear = parseInt(formYear, 10);
    if (isNaN(parsedYear)) return setFormError("Published year must be a valid number");

    const generatedCover = formCoverImage.trim() || "https://images.unsplash.com/photo-1543508282-6319a3e2621d?auto=format&fit=crop&w=600&q=80";
    const tagsArray = formTags.split(",").map(t => t.trim()).filter(Boolean);

    if (editingBook) {
      // Edit
      const updatedBook: Book = {
        ...editingBook,
        title: formTitle.trim(),
        author: formAuthor.trim(),
        price: parsedPrice,
        category: formCategory,
        description: formDescription.trim(),
        pages: parsedPages,
        publishedYear: parsedYear,
        isbn: formIsbn.trim() || editingBook.isbn,
        publisher: formPublisher.trim() || "Independent Press",
        coverImage: generatedCover,
        tags: tagsArray,
        featured: formFeatured
      };
      onUpdateBook(updatedBook);
    } else {
      // Add
      const newBook: Book = {
        _id: `book-${Date.now()}`,
        title: formTitle.trim(),
        author: formAuthor.trim(),
        price: parsedPrice,
        category: formCategory,
        description: formDescription.trim(),
        pages: parsedPages,
        publishedYear: parsedYear,
        isbn: formIsbn.trim() || `ISBN-${Date.now()}`,
        publisher: formPublisher.trim() || "Independent Press",
        coverImage: generatedCover,
        tags: tagsArray,
        featured: formFeatured,
        rating: 5.0,
        reviewsCount: 0
      };
      onAddBook(newBook);
    }

    setIsFormOpen(false);
  };

  // Order state toggling
  const handleToggleOrderStatus = (orderId: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        const nextStatus: Record<string, "Pending" | "Dispatched" | "Delivered"> = {
          "Pending": "Dispatched",
          "Dispatched": "Delivered",
          "Delivered": "Pending"
        };
        return { ...o, status: nextStatus[o.status] || "Pending" };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem("lumina_orders", JSON.stringify(updated));
  };

  // Delete Order log
  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem("lumina_orders", JSON.stringify(updated));
  };

  // Delete Newsletter Subscriber
  const handleDeleteSubscriber = (email: string) => {
    const updated = subscribers.filter(s => s !== email);
    setSubscribers(updated);
    localStorage.setItem("lumina_newsletter_subs", JSON.stringify(updated));
  };

  // Calculate high-quality analytics dynamically
  const stats = React.useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
    const totalSoldBooks = orders.reduce((sum, o) => sum + o.items.reduce((acc, item) => acc + item.quantity, 0), 0);
    const uniqueBuyers = new Set(orders.map(o => o.customerEmail)).size;
    const countCompletedOrders = orders.length;
    const averageOrderValue = countCompletedOrders > 0 ? (totalRevenue / countCompletedOrders) : 0;
    const inventoryValuation = books.reduce((sum, b) => sum + b.price, 0); // Cost of 1 of each asset

    // Calculate category distribution sales
    const genreSales: Record<string, number> = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        // Find genre of item
        const orig = books.find(b => b.title === item.title);
        const cat = orig ? orig.category : "Sci-Fi";
        genreSales[cat] = (genreSales[cat] || 0) + (item.price * item.quantity);
      });
    });

    return {
      totalRevenue,
      totalSoldBooks,
      uniqueBuyers,
      averageOrderValue,
      inventoryValuation,
      genreSales
    };
  }, [orders, books]);

  // Catalog filtered view list
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.isbn.includes(searchQuery);
    const matchesCategory = filterCategory === "All" || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-primary-950/40 backdrop-blur-md">
      
      {/* Outer wrapper panel */}
      <div className="bg-[#FDFBF7] text-primary-950 w-full h-full md:h-[90vh] md:max-w-6xl md:rounded-none md:border border-[#1A1A1A]/20 flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Absolute header frame details */}
        <div className="border-b border-[#1A1A1A]/10 px-6 py-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold tracking-tight uppercase">
              LUMINA CO. <span className="font-sans font-light italic text-primary-500 normal-case">/ lockbox control</span>
            </span>
            {isAuthorized && (
              <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-green-600 border border-green-600/30 px-2 py-0.5 bg-green-50 animate-pulse">
                AUTHORIZED
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isAuthorized && (
              <button 
                onClick={handleLogout}
                className="text-[9px] font-mono tracking-widest uppercase hover:underline opacity-60 hover:opacity-100 transition-opacity cursor-pointer border border-[#1A1A1A]/15 px-3 py-1 bg-white"
              >
                Logout
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1 px-1.5 border border-[#1A1A1A]/15 hover:bg-neutral-100 cursor-pointer text-[#1A1A1A]/60 hover:text-black transition-colors"
              title="Close Panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Inner Panel View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#FDFBF7]">
          
          {/* Unlocked Administration View Router */}
          {isAuthorized ? (
            <>
              {/* SIDEBAR NAVIGATION CONTROL CARDS */}
              <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#1A1A1A]/10 bg-white p-6 flex md:flex-col justify-start gap-2 md:space-y-1 md:space-x-0 overflow-x-auto md:overflow-x-visible flex-shrink-0">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 text-[10px] font-bold tracking-widest uppercase border transition-all cursor-pointer ${
                    activeTab === "overview"
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#FDFBF7]"
                      : "border-transparent text-primary-950/60 hover:text-primary-950 hover:bg-[#F5F1EA]"
                  }`}
                >
                  <TrendingUp className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Dispatch Ledger</span>
                </button>

                <button
                  onClick={() => setActiveTab("inventory")}
                  className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 text-[10px] font-bold tracking-widest uppercase border transition-all cursor-pointer ${
                    activeTab === "inventory"
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#FDFBF7]"
                      : "border-transparent text-primary-950/60 hover:text-primary-950 hover:bg-[#F5F1EA]"
                  }`}
                >
                  <Layers className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Monograph Stock</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 text-[10px] font-bold tracking-widest uppercase border transition-all cursor-pointer ${
                    activeTab === "orders"
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#FDFBF7]"
                      : "border-transparent text-primary-950/60 hover:text-primary-950 hover:bg-[#F5F1EA]"
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Order Queue ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("subscribers")}
                  className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-3 text-[10px] font-bold tracking-widest uppercase border transition-all cursor-pointer ${
                    activeTab === "subscribers"
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#FDFBF7]"
                      : "border-transparent text-primary-950/60 hover:text-primary-950 hover:bg-[#F5F1EA]"
                  }`}
                >
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Reader Dispatch ({subscribers.length})</span>
                </button>

                <div className="hidden md:block border-t border-[#1A1A1A]/10 mt-6 pt-6">
                  <div className="p-3.5 bg-[#F5F1EA] text-[9px] font-mono text-primary-600 leading-relaxed uppercase tracking-wider space-y-1 border border-[#1A1A1A]/5">
                    <p className="font-bold text-[#1A1A1A]">System status:</p>
                    <p>OK - SECURE GATE</p>
                    <p>TOTAL ASSETS: {books.length}</p>
                    <p className="pt-2">ESTABLISHED MMXXVI</p>
                  </div>
                </div>
              </div>

              {/* CENTER COMPONENT ROUTER PANEL */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                
                {/* 1. OVERVIEW & ANALYTICS TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold font-mono tracking-widest text-[#1A1A1A]/40 uppercase">LEDGER DATA OVERVIEW</span>
                      <h2 className="font-serif text-3xl font-light text-primary-950 italic">Financials & Asset Statistics</h2>
                    </div>

                    {/* KPI Gird layout */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white border border-[#1A1A1A]/10 p-5 space-y-2">
                        <span className="block text-[8px] font-bold uppercase tracking-widest text-primary-500">Gross Revenue</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-serif font-black text-primary-950">${stats.totalRevenue.toFixed(2)}</span>
                        </div>
                        <span className="block text-[9px] font-mono text-primary-400">ESTIMATED Transact Vault</span>
                      </div>

                      <div className="bg-white border border-[#1A1A1A]/10 p-5 space-y-2">
                        <span className="block text-[8px] font-bold uppercase tracking-widest text-primary-500">Monographs Sold</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-serif font-black text-primary-950">{stats.totalSoldBooks}</span>
                          <span className="text-[10px] text-primary-500 font-mono">pcs</span>
                        </div>
                        <span className="block text-[9px] font-mono text-primary-400">Total volumes shipped</span>
                      </div>

                      <div className="bg-white border border-[#1A1A1A]/10 p-5 space-y-2">
                        <span className="block text-[8px] font-bold uppercase tracking-widest text-primary-500">Avg Transaction Value</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-serif font-black text-primary-950">${stats.averageOrderValue.toFixed(2)}</span>
                        </div>
                        <span className="block text-[9px] font-mono text-primary-400">Order size conversion (AOV)</span>
                      </div>

                      <div className="bg-white border border-[#1A1A1A]/10 p-5 space-y-2">
                        <span className="block text-[8px] font-bold uppercase tracking-widest text-primary-500">Dispatch Reach</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-serif font-black text-primary-950">{subscribers.length + stats.uniqueBuyers}</span>
                          <span className="text-[10px] text-primary-500 font-mono">readers</span>
                        </div>
                        <span className="block text-[9px] font-mono text-primary-400">Active email & newsletter matrix</span>
                      </div>
                    </div>

                    {/* Chart & Distribution lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Genre Distribution (gorgeous styled bars instead of heavy d3 plots) */}
                      <div className="lg:col-span-7 bg-white border border-[#1A1A1A]/10 p-6 space-y-5">
                        <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-3">
                          <h4 className="font-serif font-bold text-base text-[#1A1A1A] italic">Genre Dispatch Allocation</h4>
                          <span className="text-[8px] font-mono text-primary-500 font-bold uppercase tracking-wider">BY TRANSACTED CAPITAL</span>
                        </div>
                        <div className="space-y-4">
                          {categories.map(cat => {
                            const sales = stats.genreSales[cat] || 0;
                            const salesValues = Object.values(stats.genreSales) as number[];
                            const maxSales = Math.max(...salesValues, 50.0);
                            const ratio = sales / maxSales;
                            const percentage = Math.round(ratio * 100);

                            return (
                              <div key={cat} className="space-y-1">
                                <div className="flex justify-between text-xs font-medium">
                                  <span className="text-primary-800">{cat}</span>
                                  <span className="font-mono text-[#1A1A1A]">${sales.toFixed(2)}</span>
                                </div>
                                <div className="h-2 w-full bg-neutral-105 overflow-hidden">
                                  <div 
                                    className="h-full bg-primary-950 transition-all duration-500"
                                    style={{ width: `${Math.max(3, percentage)}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stock summary matrix */}
                      <div className="lg:col-span-5 bg-white border border-[#1A1A1A]/10 p-6 space-y-5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-3">
                            <h4 className="font-serif font-bold text-base text-[#1A1A1A] italic">Monograph Library State</h4>
                            <span className="text-[8px] font-mono text-primary-500 font-bold uppercase">INVENTORY VALUE</span>
                          </div>
                          
                          <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-primary-500">Asset Cumulative Unique Unit Cost</span>
                            <span className="text-4xl font-serif font-black tracking-tight text-primary-950">${stats.inventoryValuation.toFixed(2)}</span>
                            <p className="text-[10px] text-primary-500 font-serif italic max-w-xs mt-1">
                              Valuation represents the acquisition cost of introducing one unique publication copy for each in active production.
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#1A1A1A]/10 flex justify-between text-[10px] font-mono text-primary-500 uppercase font-black">
                          <span>Total Titles: {books.length}</span>
                          <button 
                            onClick={onResetCatalog}
                            className="text-red-700/85 hover:text-red-700 hover:underline cursor-pointer flex items-center gap-1.5"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Reset Standard Catalog</span>
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Quick orders list */}
                    <div className="bg-white border border-[#1A1A1A]/10 p-6">
                      <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-3 mb-4">
                        <h4 className="font-serif font-bold text-base text-[#1A1A1A] italic">Latest Dispatches logs</h4>
                        <button 
                          onClick={() => setActiveTab("orders")}
                          className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A] hover:underline cursor-pointer font-sans"
                        >
                          Full queue →
                        </button>
                      </div>
                      {orders.length === 0 ? (
                        <p className="p-8 text-center text-xs font-serif italic text-primary-400">No active dispatches logs transacted yet.</p>
                      ) : (
                        <div className="divide-y divide-[#1A1A1A]/15">
                          {orders.slice(0, 3).map(order => (
                            <div key={order.id} className="py-3 flex justify-between items-center text-xs text-primary-700">
                              <div>
                                <span className="font-mono font-bold text-primary-950 block">{order.id} — {order.customerName}</span>
                                <span className="text-[10px] text-primary-500 block truncate max-w-sm">Items: {order.items.map(i => `${i.title} (x${i.quantity})`).join(", ")}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-serif font-black text-primary-950">${order.grandTotal.toFixed(2)}</span>
                                <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
                                  order.status === "Pending" ? "border-amber-600/30 text-amber-700 bg-amber-50" :
                                  order.status === "Dispatched" ? "border-blue-600/30 text-blue-700 bg-blue-50" :
                                  "border-green-600/30 text-green-700 bg-green-50"
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. INVENTORY CATALOG MANAGER TAB */}
                {activeTab === "inventory" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold font-mono tracking-widest text-[#1A1A1A]/40 uppercase">ACTIVE STOCK CORES</span>
                        <h2 className="font-serif text-3xl font-light text-primary-950 italic">Inventory Assets Manager</h2>
                      </div>
                      <button 
                        onClick={openNewBookForm}
                        className="bg-[#1A1A1A] hover:bg-[#333] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-none flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Inject Monograph</span>
                      </button>
                    </div>

                    {/* Filter and search bar controls */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white border border-[#1A1A1A]/10 p-4">
                      
                      {/* Search box */}
                      <div className="md:col-span-7 relative flex items-center">
                        <Search className="absolute left-3.5 h-4 w-4 text-primary-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Search books inventory by title, author, isbn..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-neutral-105/5 border border-[#1A1A1A]/15 py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-primary-950"
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery("")} className="absolute right-3.5 text-xs font-mono text-primary-400 hover:text-black">
                            Clear
                          </button>
                        )}
                      </div>

                      {/* Genre dropdown selector */}
                      <div className="md:col-span-5 flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wide text-primary-500 whitespace-nowrap">Genre Category</span>
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="flex-1 bg-white border border-[#1A1A1A]/15 py-2.5 px-3 text-xs focus:outline-none focus:border-primary-950 cursor-pointer uppercase tracking-wider font-sans font-bold"
                        >
                          <option value="All">--- ALL GENRES ---</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Books Table list */}
                    <div className="bg-white border border-[#1A1A1A]/10 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#1A1A1A]/5 border-b border-[#1A1A1A]/15 uppercase tracking-wider font-mono font-bold text-[#1A1A1A] opacity-80">
                              <th className="py-4 px-5">Monograph Cover / Asset Details</th>
                              <th className="py-4 px-4 hidden md:table-cell">ISBN / Publisher</th>
                              <th className="py-4 px-4">Price</th>
                              <th className="py-4 px-4">Pages / Year</th>
                              <th className="py-4 px-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1A1A1A]/10 text-primary-800">
                            {filteredBooks.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-12 text-center font-serif italic text-primary-400 p-8">
                                  No monographs recorded fitting these coordinate fields.
                                </td>
                              </tr>
                            ) : (
                              filteredBooks.map(book => (
                                <tr key={book._id} className="hover:bg-[#FDFBF7]/35 transition-colors">
                                  {/* Title & metadata */}
                                  <td className="py-4 px-5 flex items-center gap-4.5">
                                    <div className="relative w-12 h-16 bg-neutral-100 border border-[#1A1A1A]/15 flex-shrink-0">
                                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-black/15 z-10" />
                                      <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover grayscale-[10%]" referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="font-serif font-black text-[#1A1A1A] text-sm leading-tight inline-flex items-center gap-1.5 flex-wrap">
                                        {book.title}
                                        {book.featured && (
                                          <span className="text-[7px] font-mono tracking-widest font-black uppercase bg-[#1A1A1A] text-[#FDFBF7] px-1.5 py-0.5 rounded-none">
                                            SPOTLIGHT
                                          </span>
                                        )}
                                      </h4>
                                      <p className="text-primary-500 font-serif italic text-[11px] mt-0.5 leading-none">by {book.author}</p>
                                      <span className="inline-block mt-2.5 text-[8px] font-bold uppercase tracking-wider border border-primary-950/15 bg-neutral-100/50 px-2 py-0.5">
                                        {book.category}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Publisher info columns */}
                                  <td className="py-4 px-4 hidden md:table-cell text-[11px]">
                                    <span className="font-mono block truncate max-w-[200px]" title={book.isbn}>{book.isbn}</span>
                                    <span className="text-primary-400 font-medium block truncate max-w-[200px]" title={book.publisher}>
                                      {book.publisher}
                                    </span>
                                  </td>

                                  {/* Price */}
                                  <td className="py-4 px-4 font-serif font-black text-sm text-primary-950">
                                    ${book.price.toFixed(2)}
                                  </td>

                                  {/* Stats parameters */}
                                  <td className="py-4 px-4 font-sans leading-relaxed text-[11px]">
                                    <p><span className="text-primary-400 font-semibold font-mono">Pgs:</span> {book.pages}</p>
                                    <p><span className="text-primary-400 font-semibold font-mono">Year:</span> {book.publishedYear}</p>
                                  </td>

                                  {/* Control edit deletes */}
                                  <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2.5">
                                      <button 
                                        onClick={() => openEditBookForm(book)}
                                        className="p-1 px-1.5 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] bg-white text-[#1A1A1A] hover:opacity-100 cursor-pointer font-sans text-[10px] font-bold"
                                        title="Edit book file"
                                      >
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => {
                                          if (confirm(`Deprecate "${book.title}" completely from the archive?`)) {
                                            onDeleteBook(book._id);
                                          }
                                        }}
                                        className="p-1 px-1.5 border border-red-200 hover:border-red-600 bg-white text-red-700 font-sans text-[10px] font-bold cursor-pointer"
                                        title="Delete book"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. ORDER DISPATCH QUEUE LOGS */}
                {activeTab === "orders" && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold font-mono tracking-widest text-[#1A1A1A]/40 uppercase">ACTIVE CODES DISPATCH MATRIX</span>
                      <h2 className="font-serif text-3xl font-light text-primary-950 italic">Subscriber Shipment Logbook</h2>
                    </div>

                    <div className="bg-white border border-[#1A1A1A]/10 p-5 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-primary-500">Record total count: {orders.length} dispatches</span>
                        <p className="text-primary-400 font-serif italic text-[11px]">Click status tags to iterate dispatch conditions.</p>
                      </div>

                      {orders.length === 0 ? (
                        <div className="text-center py-16 font-serif italic text-primary-400">
                          Empty bag coordinates. No reader logs recorded yet.
                        </div>
                      ) : (
                        <div className="divide-y divide-[#1A1A1A]/15 border-t border-[#1A1A1A]/10">
                          {orders.map(order => (
                            <div key={order.id} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                              
                              {/* Order metadata */}
                              <div className="md:col-span-4 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-[#1A1A1A] tracking-wider text-sm">{order.id}</span>
                                  <span className="text-[10px] font-mono text-primary-400">
                                    {new Date(order.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                                <h5 className="font-serif font-bold text-xs text-primary-900">{order.customerName}</h5>
                                <p className="text-[10px] font-mono text-primary-500 font-medium truncate max-w-xs">{order.customerEmail}</p>
                                <p className="text-[11px] font-serif italic text-primary-600 max-w-xs leading-relaxed Pt-1">
                                  {order.shippingAddress}
                                </p>
                              </div>

                              {/* Order items details */}
                              <div className="md:col-span-5 space-y-1.5 font-sans">
                                <span className="block text-[8px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Assets packed</span>
                                <ul className="space-y-1.5 text-xs">
                                  {order.items.map((it, idx) => (
                                    <li key={idx} className="flex justify-between items-center bg-neutral-100/50 p-1.5 border border-[#1A1A1A]/5">
                                      <span className="font-semibold text-primary-950 tracking-tight">{it.title}</span>
                                      <span className="font-mono text-[11px] text-primary-500">
                                        {it.quantity}x @ ${it.price.toFixed(2)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Cost status summary */}
                              <div className="md:col-span-3 flex flex-col md:items-end justify-between self-stretch">
                                <div className="text-[11px] space-y-0.5 md:text-right">
                                  <span className="block text-[8px] font-bold uppercase tracking-widest text-primary-500">Capital transacted</span>
                                  <span className="font-serif font-black text-base text-primary-950 block">${order.grandTotal.toFixed(2)}</span>
                                </div>

                                <div className="flex items-center gap-2 pt-4 md:pt-0">
                                  {/* Toggle Dispatch Status button */}
                                  <button
                                    onClick={() => handleToggleOrderStatus(order.id)}
                                    className={`text-[9px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 border cursor-pointer ${
                                      order.status === "Pending" ? "border-amber-600 text-amber-900 bg-amber-50 hover:bg-amber-100" :
                                      order.status === "Dispatched" ? "border-blue-600 text-blue-900 bg-blue-50 hover:bg-blue-100" :
                                      "border-green-600 text-green-900 bg-green-50 hover:bg-green-100"
                                    }`}
                                  >
                                    {order.status}
                                  </button>

                                  {/* Delete Order record logs */}
                                  <button
                                    onClick={() => {
                                      if (confirm(`Remove transaction ${order.id} completely of history archives?`)) {
                                        handleDeleteOrder(order.id);
                                      }
                                    }}
                                    className="p-1.5 border border-red-200 hover:border-red-650 bg-white text-red-700 cursor-pointer"
                                    title="Erase transaction log"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                                  </button>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. NEWSLETTER DISPATCH SUBSCRIBERS */}
                {activeTab === "subscribers" && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold font-mono tracking-widest text-[#1A1A1A]/40 uppercase">SUBSCRIBERS DISPATCH AUDIENCE</span>
                      <h2 className="font-serif text-3xl font-light text-primary-950 italic">Lumina Dispatch Audience</h2>
                    </div>

                    <div className="bg-white border border-[#1A1A1A]/10 p-6 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-[#1A1A1A]">Registered Contacts Ledger: {subscribers.length} Emails</span>
                        <span className="text-primary-500 text-[10px] uppercase font-bold tracking-wider">Subscribed from Newsletter Portal</span>
                      </div>

                      {subscribers.length === 0 ? (
                        <p className="p-8 text-center text-xs font-serif italic text-primary-400">No subscriber diaries registered yet.</p>
                      ) : (
                        <div className="border border-[#1A1A1A]/10 p-1 divide-y divide-[#1A1A1A]/10">
                          {subscribers.map((sub, index) => (
                            <div key={sub} className="py-3 px-4 flex justify-between items-center text-xs text-[#1A1A1A] hover:bg-neutral-100/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-primary-400 w-5">{(index + 1).toString().padStart(2, "0")}</span>
                                <span className="font-sans font-medium text-[13px]">{sub}</span>
                              </div>
                              <button
                                onClick={() => handleDeleteSubscriber(sub)}
                                className="text-red-700/60 hover:text-red-700 text-[10px] font-mono tracking-widest uppercase cursor-pointer"
                              >
                                [ Deprecate ]
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </>
          ) : (
            
            /* CRYPTOGRAPHIC PASSCODE PORTAL PAGE */
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-[#F5F1EA]/30">
              <div className="max-w-md w-full bg-white border border-[#1A1A1A]/10 p-8 space-y-6">
                
                <div className="flex flex-col items-center space-y-3">
                  <div className="h-10 w-10 border border-[#1A1A1A]/10 flex items-center justify-center bg-[#FDFBF7] text-[#1A1A1A]/80 shadow-inner">
                    <Lock className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif font-black text-xl text-primary-950 uppercase tracking-tight">Authorization Required</h3>
                    <p className="text-[11px] font-serif italic text-primary-600 max-w-[300px] leading-relaxed mx-auto">
                      This locker governs inventory transactions, dispatch ledger balances, and active client parameters.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAuthorize} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[8px] font-mono uppercase tracking-widest text-primary-500 font-bold">Locker Gate Passcode</label>
                    <div className="relative flex items-center">
                      <Key className="absolute left-3.5 h-4 w-4 text-primary-450 opacity-40 pointer-events-none" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full rounded-none border border-[#1A1A1A]/15 bg-[#FDFBF7] py-3.5 pl-10 pr-4 text-xs font-mono placeholder-[#1A1A1A]/20 focus:outline-none focus:border-primary-950 uppercase tracking-widest"
                        autoFocus
                      />
                    </div>
                  </div>

                  {authError && (
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-red-500 uppercase tracking-wider bg-red-50 border border-red-200 p-2 text-left animate-pulse">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-4 px-4 rounded-none font-bold tracking-widest uppercase text-[11px] cursor-pointer transition-colors"
                  >
                    Authenticate Ledger
                  </button>
                </form>

                <div className="text-[10px] font-mono text-primary-500 uppercase flex items-center justify-center gap-2 border-t border-[#1A1A1A]/10 pt-4">
                  <span>Passcode: <strong className="text-black font-extrabold uppercase">admin</strong></span>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* COMPACT MODAL POPUP FORM FOR CREATING & UPDATING BOOKS */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-55 overflow-y-auto flex items-center justify-center bg-primary-950/40 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white border border-[#1A1A1A]/20 text-[#1A1A1A] w-full max-w-lg p-6 flex flex-col shadow-2xl space-y-6 relative rounded-none"
            >
              <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-3">
                <h3 className="font-serif font-black text-lg italic text-primary-950">
                  {editingBook ? `Edit: ${editingBook.title}` : "Inject New Monograph Asset"}
                </h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 border border-[#1A1A1A]/10 hover:bg-neutral-100 cursor-pointer text-[#1A1A1A]/50 hover:text-black"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-mono uppercase tracking-wide flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">Monograph Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Waves and Particles"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#1A1A1A]/15 py-2 px-3 text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Author */}
                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">Author Writer</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Ada Lovelace"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#1A1A1A]/15 py-2 px-3 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Genre */}
                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">Archive Genre</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#1A1A1A]/15 py-2 px-3 text-xs focus:outline-none focus:border-black uppercase tracking-wider font-bold"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">Retail Price ($USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 29.99"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#1A1A1A]/15 py-2 px-3 text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Pages */}
                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">Page Length</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 312"
                      value={formPages}
                      onChange={(e) => setFormPages(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#1A1A1A]/15 py-2 px-3 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {/* Release details */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">Release Year</label>
                    <input
                      type="number"
                      placeholder="2026"
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#1A1A1A]/15 py-2 px-3 text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">Publisher House</label>
                    <input
                      type="text"
                      placeholder="e.g. Zenith Press"
                      value={formPublisher}
                      onChange={(e) => setFormPublisher(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#1A1A1A]/15 py-2 px-3 text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">ISBN Registry</label>
                    <input
                      type="text"
                      placeholder="e.g. 978-3-16-148"
                      value={formIsbn}
                      onChange={(e) => setFormIsbn(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#1A1A1A]/15 py-2 px-3 text-xs focus:outline-none focus:border-black font-mono"
                    />
                  </div>
                </div>

                {/* Cover Image URL */}
                <div className="space-y-1">
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">Cover Image (Unsplash URL preferred)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#1A1A1A]/15 py-2 px-3 text-xs focus:outline-none focus:border-black font-mono"
                  />
                  <p className="text-[9px] text-[#1A1A1A]/40">Leave empty to auto-populate with a gorgeous default literary placeholder illustration.</p>
                </div>

                {/* Synopsis Description */}
                <div className="space-y-1">
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">Monograph Synopsis</label>
                  <textarea
                    rows={3}
                    placeholder="Enter short details detailing this publications thesis..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#1A1A1A]/15 py-2 px-3 text-xs focus:outline-none focus:border-black font-sans leading-relaxed"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1">
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">Monograph Tags (Separated by comma)</label>
                  <input
                    type="text"
                    placeholder="e.g. Cosmical, Astrophysics, Nobel"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#1A1A1A]/15 py-2 px-3 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                {/* Featured Spotlight Switch */}
                <div className="flex items-center gap-2 pt-1 pb-4">
                  <input
                    type="checkbox"
                    id="featured-checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="h-4 w-4 bg-[#FDFBF7] border border-[#1A1A1A]/15 accent-[#1A1A1A] cursor-pointer"
                  />
                  <label htmlFor="featured-checkbox" className="text-[10px] font-bold uppercase tracking-wide cursor-pointer text-[#1A1A1A]/70 select-none">
                    Spotlight Showcase inside Hero slider carousel
                  </label>
                </div>

                {/* Submission CTA bar */}
                <button
                  type="submit"
                  className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-3 px-4 rounded-none font-bold tracking-widest uppercase text-[10px] cursor-pointer"
                >
                  {editingBook ? "Apply Monograph Update Records" : "Inject Monograph into Archives"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
