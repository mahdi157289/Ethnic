import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatPrice';
import type { Order } from '../../types';

export function AdminDashboard() {
  const {
    adminPage,
    products,
    orders,
    subscribers,
    featuredProduct,
    initialProductCount,
    updateOrderStatus,
    deleteProduct,
    removeFeatured,
    setAdminPage,
    setEditingProduct,
  } = useStore();

  const productChange = products.length - initialProductCount;
  const orderRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const allProducts = featuredProduct
    ? [{ ...featuredProduct, isFeatured: true as const }, ...products]
    : products;

  return (
    <div id="admin-page-dashboard" className={`admin-page p-8${adminPage === 'dashboard' ? ' active' : ''}`}>
      <div className="mb-12">
        <h3 className="section-title font-display text-xl text-[#0F0F0F] mb-6">
          <span className="section-dot" />
          <span className="section-title-text">Platform Analytics</span>
          <span className="section-dot" />
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="font-display text-3xl text-[#0F0F0F]">24,589</p>
            <p className="text-[#0F0F0F]/50 text-sm mt-1">Page Views</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p id="analytics-revenue" className="font-display text-3xl text-[#0F0F0F]">
              {formatPrice(148290 + orderRevenue)}
            </p>
            <p className="text-[#0F0F0F]/50 text-sm mt-1">Revenue</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p id="analytics-orders" className="font-display text-3xl text-[#0F0F0F]">
              {142 + orders.length}
            </p>
            <p className="text-[#0F0F0F]/50 text-sm mt-1">Orders</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <span className={productChange >= 0 ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
              {productChange >= 0 ? `+${productChange}` : productChange}
            </span>
            <p id="analytics-products" className="font-display text-3xl text-[#0F0F0F]">
              {products.length}
            </p>
            <p className="text-[#0F0F0F]/50 text-sm mt-1">Products</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="section-title font-display text-xl text-[#0F0F0F] mb-6">
          <span className="section-dot" />
          <span className="section-title-text">Recent Orders</span>
          <span className="section-dot" />
        </h3>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F5F1EB]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#0F0F0F]">Order ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#0F0F0F]">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#0F0F0F]">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#0F0F0F]">Items</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#0F0F0F]">Total</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#0F0F0F]">Status</th>
              </tr>
            </thead>
            <tbody id="admin-orders-list">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#0F0F0F]/50">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <OrderRow key={order.id} order={order} onStatusChange={updateOrderStatus} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="section-title font-display text-xl text-[#0F0F0F] mb-6">
          <span className="section-dot" />
          <span className="section-title-text">Manage Products</span>
          <span className="section-dot" />
        </h3>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F5F1EB]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#0F0F0F]">Product</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#0F0F0F]">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#0F0F0F]">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-[#0F0F0F]">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-[#0F0F0F]">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-products-list">
              {allProducts.map((product) => {
                const isFeatured = 'isFeatured' in product || product.type === 'featured';
                const actualProduct = 'isFeatured' in product ? { ...product, isFeatured: undefined } : product;
                return (
                  <tr key={product.id} className="border-t border-[#E8E0D5] hover:bg-[#F5F1EB]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                        <span className="font-medium text-[#0F0F0F]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#0F0F0F]/70">{product.category}</td>
                    <td className="px-6 py-4 font-display text-[#0F0F0F]">
                      {product.salePrice ? (
                        <>
                          <span className="text-red-500">{formatPrice(product.salePrice)}</span>{' '}
                          <span className="text-sm text-[#0F0F0F]/40 line-through">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isFeatured ? (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Featured</span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(actualProduct);
                          setAdminPage('products');
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        Edit
                      </button>
                      {isFeatured ? (
                        <button type="button" onClick={removeFeatured} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg">
                          Remove
                        </button>
                      ) : (
                        <button type="button" onClick={() => deleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="section-title font-display text-xl text-[#0F0F0F] mb-6">
          <span className="section-dot" />
          <span className="section-title-text">Email Subscribers</span>
          <span className="section-dot" />
        </h3>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p id="subscribers-count" className="text-sm text-[#0F0F0F]/60 mb-4">
            {subscribers.length} people will be notified
          </p>
          <div id="subscribers-list" className="space-y-3">
            {subscribers.length === 0 ? (
              <p className="text-center text-[#0F0F0F]/50 py-6">
                No subscribers yet. They&apos;ll appear here when users subscribe or make a purchase.
              </p>
            ) : (
              subscribers.map((sub) => (
                <div key={sub.email} className="flex items-center justify-between p-4 bg-[#F5F1EB] rounded-xl">
                  <div>
                    <p className="font-medium text-[#0F0F0F]">{sub.email}</p>
                    <p className="text-xs text-[#0F0F0F]/50">{sub.source} • {sub.subscribedAt}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderRow({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (id: string, status: Order['status']) => void;
}) {
  return (
    <tr className="border-t border-[#E8E0D5]">
      <td className="px-6 py-4 font-medium text-[#0F0F0F]">{order.id}</td>
      <td className="px-6 py-4">{order.customerName}</td>
      <td className="px-6 py-4 text-sm text-[#0F0F0F]/70">
        <p>{order.customerEmail}</p>
        <p>{order.customerPhone}</p>
      </td>
      <td className="px-6 py-4 text-sm">{order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}</td>
      <td className="px-6 py-4 font-display">{formatPrice(order.total)}</td>
      <td className="px-6 py-4">
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
          className="px-3 py-1 rounded-lg border border-[#E8E0D5] text-sm"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </td>
    </tr>
  );
}
