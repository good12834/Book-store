import React, { useState, useMemo } from "react";
import { CartItem, Book } from "../types";
import { X, Plus, Minus, Trash2, ShieldCheck, Ticket, CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenBook: (book: Book) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenBook
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCodeName, setAppliedCodeName] = useState("");
  const [promoError, setPromoError] = useState("");
  
  // Custom shipping states
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  
  // Checkout sequence wizard state: "cart" | "submitting" | "success"
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "submitting" | "success">("cart");
  const [submittingStatus, setSubmittingStatus] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (code === "LUMINA26") {
      setDiscountPercent(15);
      setAppliedCodeName("LUMINA26 (15%)");
      setPromoCode("");
    } else if (code === "") {
      setPromoError("Enter a code first");
    } else {
      setPromoError("Invalid literature code");
    }
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
    const discountAmount = subtotal * (discountPercent / 100);
    const finalSubtotal = subtotal - discountAmount;
    
    // Free shipping above $60
    const shippingCost = finalSubtotal > 60 || finalSubtotal === 0 ? 0.00 : 4.99;
    const packagingCost = finalSubtotal > 0 ? 1.50 : 0.00; // Eco packing
    const grandTotal = finalSubtotal + shippingCost + packagingCost;

    return {
      subtotal,
      discountAmount,
      finalSubtotal,
      shippingCost,
      packagingCost,
      grandTotal
    };
  }, [cart, discountPercent]);

  const runSimulation = () => {
    if (cart.length === 0) return;

    const resolvedName = customerName.trim() || "Lumina Collector";
    const resolvedEmail = customerEmail.trim() || "collector@lumina.com";
    const resolvedAddress = shippingAddress.trim() || "742 Evergreen Terrace, Springfield, US";

    setCheckoutStep("submitting");
    
    const statuses = [
      "Securing payment gate...",
      "Registering coordinates...",
      "Packaging custom print volumes...",
      "Order consolidated!"
    ];

    let current = 0;
    setSubmittingStatus(statuses[0]);

    const interval = setInterval(() => {
      current++;
      if (current < statuses.length) {
        setSubmittingStatus(statuses[current]);
      } else {
        clearInterval(interval);

        // Record the transaction to local storage so it registers in the Admin Dashboard!
        try {
          const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
          const orderItems = cart.map((item) => ({
            title: item.book.title,
            quantity: item.quantity,
            price: item.book.price
          }));

          const newOrder = {
            id: orderId,
            customerName: resolvedName,
            customerEmail: resolvedEmail,
            shippingAddress: resolvedAddress,
            items: orderItems,
            grandTotal: totals.grandTotal,
            timestamp: new Date().toISOString(),
            status: "Pending"
          };

          const cachedOrders = localStorage.getItem("lumina_orders");
          let orderList = [];
          if (cachedOrders) {
            try {
              orderList = JSON.parse(cachedOrders);
            } catch (err) {}
          }
          orderList.unshift(newOrder);
          localStorage.setItem("lumina_orders", JSON.stringify(orderList));
        } catch (e) {
          console.error("Failed to write checkouts to logger", e);
        }

        // Reset shipping coordinates
        setCustomerName("");
        setCustomerEmail("");
        setShippingAddress("");

        setCheckoutStep("success");
        onClearCart();
      }
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop transparent window */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary-950/20 backdrop-blur-xs"
        />

        {/* Sliding card panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#1A1A1A]/10 bg-[#FDFBF7] shadow-xl"
        >
          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 p-6">
            <h3 className="font-serif text-lg font-light tracking-tight text-primary-950 italic">
              {checkoutStep === "success" ? "Invoice Summary" : "Your Literary Bag"}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-primary-950 hover:opacity-60 transition-opacity cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Cart main wizard display routing */}
          {checkoutStep === "cart" && (
            <>
              {/* Product items scrolling list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center h-full space-y-4">
                    <span className="text-[10px] font-mono tracking-[0.3em] text-[#1A1A1A]/40 uppercase">VACANT BAG</span>
                    <p className="text-xs text-primary-500 max-w-[220px] font-serif italic">
                      Browse our high-curated collections and add titles to begin checkout.
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-[#1A1A1A] hover:bg-[#333] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-none cursor-pointer"
                    >
                      Browse Books Catalog
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.book._id}
                      className="flex gap-4 items-center border-b border-primary-950/5 pb-4 last:border-0 last:pb-0"
                    >
                      {/* Thumbnail Cover image */}
                      <div
                        onClick={() => {
                          onOpenBook(item.book);
                          onClose();
                        }}
                        className="relative w-14 h-20 overflow-hidden bg-primary-100 border border-[#1A1A1A]/10 cursor-pointer flex-shrink-0 hover:opacity-90"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-black/15" />
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Info & action bars */}
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            onClick={() => {
                              onOpenBook(item.book);
                              onClose();
                            }}
                            className="font-serif font-bold text-xs text-primary-950 hover:opacity-60 transition-opacity truncate cursor-pointer"
                          >
                            {item.book.title}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.book._id)}
                            className="text-primary-400 hover:text-primary-950 cursor-pointer p-0.5"
                            title="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="text-[11px] text-primary-500 italic font-serif">by {item.book.author}</p>

                        <div className="flex items-center justify-between pt-1">
                          {/* Quantity selectors */}
                          <div className="flex items-center gap-1.5 bg-white border border-[#1A1A1A]/10 py-1 px-2 text-primary-800">
                            <button
                              onClick={() => onUpdateQuantity(item.book._id, item.quantity - 1)}
                              className="h-4 w-4 flex items-center justify-center hover:opacity-50 text-primary-800 disabled:opacity-20 cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-mono text-[10px] font-bold w-4 text-center text-primary-950">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.book._id, item.quantity + 1)}
                              className="h-4 w-4 flex items-center justify-center hover:opacity-50 text-primary-800 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Calculated price */}
                          <span className="font-serif font-bold text-xs text-primary-950">
                            ${(item.book.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart pricing summary and checkout actions */}
              {cart.length > 0 && (
                <div className="border-t border-[#1A1A1A]/10 bg-[#F5F1EA]/50 p-6 space-y-4">
                  {/* Promo code form */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2 pb-2">
                    <input
                      type="text"
                      placeholder="TRY 'LUMINA26'"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 rounded-none border border-primary-950/15 bg-white py-2 px-3 text-xs uppercase tracking-widest placeholder-primary-400 focus:outline-none focus:border-primary-950 font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-[#1A1A1A] hover:bg-[#333] text-white text-[10px] font-mono tracking-widest font-black px-4 py-2 rounded-none cursor-pointer uppercase"
                    >
                      Apply
                    </button>
                  </form>

                  {promoError && (
                    <p className="text-[10px] font-mono text-red-500 mt-1 uppercase tracking-wider">{promoError}</p>
                  )}

                  {appliedCodeName && (
                    <div className="flex justify-between items-center bg-white border border-[#1A1A1A]/10 p-2.5 text-[10px] font-mono text-primary-950 uppercase tracking-wider">
                      <span>Promo applied: {appliedCodeName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setDiscountPercent(0);
                          setAppliedCodeName("");
                        }}
                        className="text-xs font-bold hover:text-red-500 uppercase"
                      >
                        [Remove]
                      </button>
                    </div>
                  )}

                  {/* Calculations lines */}
                  <div className="space-y-2 text-xs text-primary-800">
                    <div className="flex justify-between">
                      <span className="uppercase tracking-widest text-[9px] text-primary-500">Subtotal</span>
                      <span className="font-serif font-black">${totals.subtotal.toFixed(2)}</span>
                    </div>

                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-primary-950 font-serif font-bold italic">
                        <span>Promo Code Discount</span>
                        <span>-${totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 uppercase tracking-widest text-[9px] text-primary-500">
                        Shipping
                        {totals.shippingCost === 0 && (
                          <span className="bg-white border border-[#1A1A1A]/10 text-[8px] font-bold tracking-widest px-1 py-0.5 ml-1">
                            FREE
                          </span>
                        )}
                      </span>
                      <span className="font-serif">
                        {totals.shippingCost === 0 ? "$0.00" : `$${totals.shippingCost.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="uppercase tracking-widest text-[9px] text-primary-500">Eco Custom Packaging</span>
                      <span className="font-serif">${totals.packagingCost.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between border-t border-[#1A1A1A]/10 pt-3 text-primary-950 font-bold uppercase tracking-widest text-[10px]">
                      <span>Total Price</span>
                      <span className="font-serif text-sm font-black text-[#1A1A1A] normal-case">${totals.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Optional Shipping input fields for transaction logger */}
                  <div className="border border-[#1A1A1A]/10 bg-white p-3 space-y-2.5">
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-primary-500">Shipping Coordinates (Optional)</span>
                    <div className="space-y-2 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Collector Name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-[#FDFBF7]/45 border border-[#1A1A1A]/10 py-2 px-2 text-[10px] uppercase tracking-wider focus:outline-none focus:border-[#1A1A1A] font-sans"
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-[#FDFBF7]/45 border border-[#1A1A1A]/10 py-2 px-2 text-[10px] uppercase tracking-wider focus:outline-none focus:border-[#1A1A1A] font-sans"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Shipment Address (Street, City, Zip)"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full bg-[#FDFBF7]/45 border border-[#1A1A1A]/10 py-2 px-2 text-[10px] uppercase tracking-wider focus:outline-none focus:border-[#1A1A1A] font-sans"
                      />
                    </div>
                    <span className="block text-[8px] font-mono font-medium text-primary-400 capitalize bg-neutral-50 p-1 leading-normal border-t border-[#1A1A1A]/5">
                      Leave blank to auto-dispatch with elegant custom monograph collector parameters.
                    </span>
                  </div>

                  {/* Submit checkout buttons */}
                  <button
                    onClick={runSimulation}
                    className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-4 px-4 rounded-none font-bold tracking-widest uppercase text-[11px] cursor-pointer transition-colors"
                  >
                    Consolidate Order
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest text-primary-550 text-center">
                    <ShieldCheck className="h-4.5 w-4.5" strokeWidth={1.5} />
                    <span>Encrypted Library checkout credentials.</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Submitting step loader */}
          {checkoutStep === "submitting" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
              <div className="h-10 w-10 border border-primary-950 border-t-transparent animate-spin" />
              <div>
                <h4 className="font-serif text-lg italic text-[#1A1A1A]">Consolidating books...</h4>
                <p className="text-[9px] font-mono uppercase tracking-widest text-primary-500 mt-2 bg-white border border-[#1A1A1A]/10 px-3 py-1.5 animate-pulse">
                  {submittingStatus}
                </p>
              </div>
            </div>
          )}

          {/* Success receipt summary card */}
          {checkoutStep === "success" && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between h-full">
              <div className="space-y-6 pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#1A1A1A] uppercase">SECURED</span>
                  <div className="space-y-1">
                    <h4 className="font-serif font-black text-2xl text-primary-950 italic">
                      Order Confirmed
                    </h4>
                    <p className="text-xs text-primary-600 font-serif italic">
                      Your literary dispatch is being prepared.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#1A1A1A]/10 p-6 space-y-4 font-sans">
                  <div className="flex justify-between text-[11px] pb-3 border-b border-[#1A1A1A]/10 uppercase tracking-widest text-primary-500">
                    <span>Invoice ref</span>
                    <span className="font-mono font-bold text-primary-950">#LUM-2026-9482</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="text-[8px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Estimated Arrival</div>
                    <p className="font-serif font-bold text-sm text-primary-900">
                      Thursday, June 4th, 2026
                    </p>
                    <p className="text-primary-600 text-xs leading-relaxed font-serif">
                      Your books arrive protected in our custom biodegradable monograph parcel wrap, minimizing global environmental impacts.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1A1A1A]/10 flex justify-between text-[9px] font-bold uppercase tracking-widest text-primary-800">
                    <span>Transacted via Secure Token</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <button
                  onClick={() => {
                    setCheckoutStep("cart");
                    setDiscountPercent(0);
                    setAppliedCodeName("");
                    onClose();
                  }}
                  className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-4 px-4 rounded-none font-bold tracking-widest uppercase text-[10px] cursor-pointer"
                >
                  Continue Browsing
                </button>
                <p className="text-[9px] uppercase tracking-widest text-center text-primary-400">
                  Transacted MMXXVI Lumina Co.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
