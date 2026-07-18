import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';

const OPEN_DURATION = 3000; // stay open for 3s before auto-closing
const EXIT_MS = 300; // smooth close duration

export function CartSidebar() {
  const { cartOpen, toggleCart, cart, removeFromCart, cartTotal, toggleCheckout } = useStore();
  const [closing, setClosing] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!cartOpen) return;
    setClosing(false);
    // Open for OPEN_DURATION, then animate closed
    openTimer.current = setTimeout(() => {
      setClosing(true);
      closeTimer.current = setTimeout(() => {
        setClosing(false);
        toggleCart();
      }, EXIT_MS);
    }, OPEN_DURATION);
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartOpen]);

  if (!cartOpen) return null;

  return (
    <>
      <div
        id="cart-sidebar"
        style={{
          transition: `transform ${EXIT_MS}ms ease, opacity ${EXIT_MS}ms ease`,
          transform: closing ? 'translateX(100%)' : 'translateX(0)',
          opacity: closing ? 0 : 1,
        }}
        className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50"
      >
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display text-2xl text-[#0F0F0F]">Your Cart</h3>
            <button type="button" onClick={toggleCart} className="text-[#0F0F0F] hover:opacity-60 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <p className="text-[#0F0F0F]/50 text-center py-10">Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.name} className="cart-line-card flex justify-between items-center p-4 bg-[#F5F1EB] rounded-xl">
                  <div>
                    <p className="font-medium text-[#0F0F0F]">{item.name}</p>
                    <p className="text-sm text-[#0F0F0F]/60">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="pt-6 border-t border-[#E8E0D5]">
            <div className="flex justify-between mb-6">
              <span className="text-[#0F0F0F]/70">Total</span>
              <span className="font-display text-xl text-[#0F0F0F]">{formatPrice(cartTotal)}</span>
            </div>
            <button
              type="button"
              onClick={toggleCheckout}
              disabled={cart.length === 0}
              className="forma-btn-primary w-full text-center disabled:opacity-50"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <div
        id="cart-overlay"
        onClick={toggleCart}
        className="fixed inset-0 bg-black/40 z-40"
        role="presentation"
      />
    </>
  );
}
