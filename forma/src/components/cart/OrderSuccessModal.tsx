import { useStore } from '../../context/StoreContext';
import { Modal } from '../ui/Modal';

export function OrderSuccessModal() {
  const { successOpen, closeSuccessModal } = useStore();

  return (
    <Modal
      open={successOpen}
      onClose={closeSuccessModal}
      contentClassName="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 text-center"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-display text-3xl text-[#0F0F0F] mb-4">Order Placed!</h3>
      <p className="text-[#0F0F0F]/70 mb-8">
        Thank you for your order. We&apos;ll contact you shortly to confirm delivery details.
      </p>
      <button
        type="button"
        onClick={closeSuccessModal}
        className="forma-btn-primary rounded-xl"
      >
        Continue Shopping
      </button>
    </Modal>
  );
}
