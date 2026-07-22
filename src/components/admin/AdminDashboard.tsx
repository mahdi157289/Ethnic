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
    <div id="admin-page-dashboard" className={`admin-page p-4 md:p-8${adminPage === 'dashboard' ? ' active' : ''}`}>
      <div className="mb-8 md:mb-12">
        <h3 className="section-title font-display text-lg md:text-xl text-[#0F0F0F] mb-4 md:mb-6">
          <span className="section-dot" />
          <span className="section-title-text">Platform Analytics</span>
          <span className="section-dot" />
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
            <p className="font-display text-xl md:text-3xl text-[#0F0F0F]">24,589</p>
            <p className="text-[#0F0F0F]/50 text-xs md:text-sm mt-1">Page Views</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
            <p id="analytics-revenue" className="font-display text-xl md:text-3xl text-[#0F0F0F]">
              {formatPrice(148290 + orderRevenue)}
            </p>
            <p className="text-[#0F0F0F]/50 text-xs md:text-sm mt-1">Revenue</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
            <p id="analytics-orders" className="font-display text-xl md:text-3xl text-[#0F0F0F]">
              {142 + orders.length}
            </p>
            <p className="text-[#0F0F0F]/50 text-xs md:text-sm mt-1">Orders</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
            <span className={productChange >= 0 ? 'text-green-500 text-xs md:text-sm' : 'text-red-500 text-xs md:text-sm'}>
              {productChange >= 0 ? `+${productChange}` : productChange}
            </span>
            <p id="analytics-products" className="font-display text-xl md:text-3xl text-[#0F0F0F]">
              {products.length}
            </p>
            <p className="text-[#0F0F0F]/50 text-xs md:text-sm mt-1">Products</p>
          </div>
        </div>
      </div>

      <div className="mb-8 md:mb-12">
        <h3 className="section-title font-display text-lg md:text-xl text-[#0F0F0F] mb-4 md:mb-6">
          <span className="section-dot" />
          <span className="section-title-text">Recent Orders</span>
          <span className="section-dot" />
        </h3>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-[#F5F1EB]">
                <tr>
                  <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Order ID</th>
                  <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Customer</th>
                  <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Contact</th>
                  <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Items</th>
                  <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Total</th>
                  <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Status</th>
                </tr>
              </thead>
              <tbody id="admin-orders-list">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 md:px-6 py-8 md:py-12 text-center text-[#0F0F0F]/50 text-sm">
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
      </div>

      <div className="mb-8 md:mb-12">
        <h3 className="section-title font-display text-lg md:text-xl text-[#0F0F0F] mb-4 md:mb-6">
          <span className="section-dot" />
          <span className="section-title-text">Manage Products</span>
          <span className="section-dot" />
        </h3>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px]">
              <thead className="bg-[#F5F1EB]">
                <tr>
                  <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Product</th>
                  <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Category</th>
                  <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Price</th>
                  <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Status</th>
                  <th className="text-right px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-[#0F0F0F]">Actions</th>
                </tr>
              </thead>
              <tbody id="admin-products-list">
                {allProducts.map((product) => {
                  const isFeatured = 'isFeatured' in product || product.type === 'featured';
                  const actualProduct = 'isFeatured' in product ? { ...product, isFeatured: undefined } : product;
                  return (
                    <tr key={product.id} className="border-t border-[#E8E0D5] hover:bg-[#F5F1EB]/50 transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt={product.name} className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg flex-shrink-0" />
                          <span className="font-medium text-[#0F0F0F] text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-[#0F0F0F]/70 text-sm">{product.category}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 font-display text-sm text-[#0F0F0F]">
                        {product.salePrice ? (
                          <>
                            <span className="text-red-500">{formatPrice(product.salePrice)}</span>{' '}
                            <span className="text-xs text-[#0F0F0F]/40 line-through">{formatPrice(product.price)}</span>
                          </>
                        ) : (
                          formatPrice(product.price)
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        {isFeatured ? (
                          <span className="px-2 md:px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Featured</span>
                        ) : (
                          <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <button
                            type="button"
                            onClick={() => { setEditingProduct(actualProduct); setAdminPage('products'); }}
                            className="px-2 py-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm transition-colors"
                          >
                            Edit
                          </button>
                          {isFeatured ? (
                            <button type="button" onClick={removeFeatured} className="px-2 py-1.5 md:p-2 text-orange-500 hover:bg-orange-50 rounded-lg text-sm transition-colors">
                              Remove
                            </button>
                          ) : (
                            <button type="button" onClick={() => deleteProduct(product.id)} className="px-2 py-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-lg text-sm transition-colors">
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-12">
        <h3 className="section-title font-display text-lg md:text-xl text-[#0F0F0F] mb-4 md:mb-6">
          <span className="section-dot" />
          <span className="section-title-text">Email Subscribers</span>
          <span className="section-dot" />
        </h3>
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <p id="subscribers-count" className="text-sm text-[#0F0F0F]/60 mb-4">
            {subscribers.length} people will be notified
          </p>
          <div id="subscribers-list" className="space-y-3">
            {subscribers.length === 0 ? (
              <p className="text-center text-[#0F0F0F]/50 py-6 text-sm">
                No subscribers yet. They&apos;ll appear here when users subscribe or make a purchase.
              </p>
            ) : (
              subscribers.map((sub) => (
                <div key={sub.email} className="flex items-center justify-between p-3 md:p-4 bg-[#F5F1EB] rounded-xl">
                  <div className="min-w-0">
                    <p className="font-medium text-[#0F0F0F] text-sm truncate">{sub.email}</p>
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
      <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-[#0F0F0F] text-sm">{order.id}</td>
      <td className="px-4 md:px-6 py-3 md:py-4 text-sm">{order.customerName}</td>
      <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#0F0F0F]/70">
        <p>{order.customerEmail}</p>
        <p>{order.customerPhone}</p>
      </td>
      <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm">{order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}</td>
      <td className="px-4 md:px-6 py-3 md:py-4 font-display text-sm">{formatPrice(order.total)}</td>
      <td className="px-4 md:px-6 py-3 md:py-4">
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
          className="px-2 md:px-3 py-1.5 md:py-1 rounded-lg border border-[#E8E0D5] text-xs md:text-sm min-w-[100px]"
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
