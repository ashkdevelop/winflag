import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, MessageSquare, Package, TrendingUp } from 'lucide-react';
import { ordersApi, contentApi, productsApi } from '../../services/api';
import { PageSpinner } from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import type { OrderStatus } from '../../types';

const statusBadge: Record<OrderStatus, { label: string; variant: 'blue' | 'green' | 'gray' | 'red' | 'yellow' | 'charcoal' }> = {
  Pending: { label: 'Pending', variant: 'yellow' },
  Confirmed: { label: 'Confirmed', variant: 'blue' },
  InProduction: { label: 'In Production', variant: 'blue' },
  QualityCheck: { label: 'QC', variant: 'blue' },
  Dispatched: { label: 'Dispatched', variant: 'blue' },
  OutForDelivery: { label: 'Out for Delivery', variant: 'blue' },
  Delivered: { label: 'Delivered', variant: 'green' },
};

export default function Dashboard() {
  const { data: orders = [], isPending: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => ordersApi.getAll(),
  });

  const { data: quotes = [], isPending: quotesLoading } = useQuery({
    queryKey: ['admin-quotes'],
    queryFn: contentApi.getQuotes,
  });

  const { data: products = [], isPending: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productsApi.getAll(),
  });

  if (ordersLoading || quotesLoading || productsLoading) return <PageSpinner />;

  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const newQuotes = quotes.filter((q) => q.status === 'New').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: <ShoppingCart size={22} />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending Orders', value: pendingOrders, icon: <ShoppingCart size={22} />, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'New Quotes', value: newQuotes, icon: <MessageSquare size={22} />, color: 'text-wf-blue bg-blue-50' },
    { label: 'Products', value: products.length, icon: <Package size={22} />, color: 'text-wf-green bg-green-50' },
  ];

  const recentOrders = orders.slice(0, 5);
  const recentQuotes = quotes.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp size={14} />
          Revenue: ₹{totalRevenue.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-extrabold text-charcoal">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-bold text-charcoal">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-wf-blue font-semibold hover:underline">
              View all
            </a>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No orders yet</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => {
                const s = statusBadge[order.status];
                return (
                  <div key={order.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-charcoal text-sm truncate">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-400 truncate">{order.customerName}</p>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-2">
                      <Badge variant={s.variant}>{s.label}</Badge>
                      <p className="text-sm font-bold text-charcoal">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-bold text-charcoal">Recent Quotes</h2>
            <a href="/admin/quotes" className="text-xs text-wf-blue font-semibold hover:underline">
              View all
            </a>
          </div>
          {recentQuotes.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No quote requests yet</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-charcoal text-sm truncate">{quote.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {quote.flagType} · {quote.quantity} units
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant={quote.status === 'New' ? 'blue' : quote.status === 'Quoted' ? 'green' : 'gray'}>
                      {quote.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
