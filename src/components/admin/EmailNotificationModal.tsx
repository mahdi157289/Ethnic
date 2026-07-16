import { useStore } from '../../context/StoreContext';
import { Modal } from '../ui/Modal';
import { formatPrice } from '../../utils/formatPrice';

export function EmailNotificationModal() {
  const { emailModalOpen, emailModalProduct, notifiedSubscribers, closeEmailModal } = useStore();

  if (!emailModalProduct) return null;

  const price = emailModalProduct.salePrice ?? emailModalProduct.price;

  return (
    <Modal
      open={emailModalOpen}
      onClose={closeEmailModal}
      overlayClassName="z-[60]"
      contentClassName="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6 border-b border-[#E8E0D5] flex items-center justify-between">
        <div>
          <p className="font-medium text-[#0F0F0F]">Emails Sent</p>
          <p className="text-sm text-[#0F0F0F]/60">{notifiedSubscribers.length} subscribers notified</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
          {notifiedSubscribers.length}
        </span>
      </div>
      <div className="p-6">
        <div className="bg-[#F5F1EB] rounded-2xl p-6 border border-[#E8E0D5] text-center">
          <h4 className="font-display text-2xl text-[#0F0F0F] mb-4">Nouvelle Création Pour Vous !</h4>
          <div className="bg-white rounded-xl p-4 my-4">
            <img
              src={emailModalProduct.images[0]}
              alt={emailModalProduct.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h5 className="font-display text-lg text-[#0F0F0F]">{emailModalProduct.name}</h5>
            <p className="text-[#0F0F0F]/70">{formatPrice(price)}</p>
          </div>
        </div>
      </div>
      <div className="p-6 border-t border-[#E8E0D5]">
        <button
          type="button"
          onClick={closeEmailModal}
          className="w-full py-3 bg-[#0F0F0F] text-white rounded-xl hover:bg-[#0F0F0F]/80"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
