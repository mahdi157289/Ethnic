import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Modal } from '../ui/Modal';
import { formatPrice } from '../../utils/formatPrice';

export function CheckoutModal() {
  const { checkoutOpen, toggleCheckout, cartTotal, placeOrder } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder({ name, email, phone, address });
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  return (
    <Modal
      open={checkoutOpen}
      onClose={toggleCheckout}
      contentClassName="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
    >
      <div className="bg-[#0F0F0F] p-8 text-center">
        <h3 className="font-display text-2xl text-white mb-2">Complete Your Order</h3>
        <p className="text-white/60 text-sm">Fill in your details for delivery</p>
      </div>
      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        <div className="relative">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full pl-12 pr-4 py-4 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#0F0F0F] focus:bg-white transition-all duration-300 text-[#0F0F0F]"
          />
        </div>
        <div className="relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full pl-12 pr-4 py-4 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#0F0F0F] focus:bg-white transition-all duration-300 text-[#0F0F0F]"
          />
        </div>
        <div className="relative">
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full pl-12 pr-4 py-4 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#0F0F0F] focus:bg-white transition-all duration-300 text-[#0F0F0F]"
          />
        </div>
        <div className="relative">
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Delivery Address"
            rows={2}
            className="w-full pl-12 pr-4 py-4 bg-[#F5F1EB] border-2 border-transparent rounded-xl focus:outline-none focus:border-[#0F0F0F] focus:bg-white transition-all duration-300 text-[#0F0F0F] resize-none"
          />
        </div>
        <div className="flex justify-between items-center py-4 border-t border-[#E8E0D5]">
          <span className="text-[#0F0F0F]/70">Order Total</span>
          <span className="font-display text-xl text-[#0F0F0F]">{formatPrice(cartTotal)}</span>
        </div>
        <button
          type="submit"
          className="forma-btn-primary w-full rounded-xl"
        >
          Place Order
        </button>
      </form>
    </Modal>
  );
}
