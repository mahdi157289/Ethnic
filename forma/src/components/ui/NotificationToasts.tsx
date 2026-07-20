import { useStore } from '../../context/StoreContext';

export function NotificationToasts() {
  const { toasts } = useStore();

  return (
    <>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`fixed bottom-24 right-6 px-6 py-4 rounded-xl shadow-2xl z-[70] transition-all duration-500 text-white ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{ marginBottom: `${toasts.indexOf(toast) * 70}px` }}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </>
  );
}
