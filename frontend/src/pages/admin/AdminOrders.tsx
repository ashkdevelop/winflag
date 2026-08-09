import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ShoppingCart } from 'lucide-react';
import { ordersApi } from '../../services/api';
import { PageSpinner } from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import type { Order, OrderStatus } from '../../types';

const ALL_STATUSES: OrderStatus[] = [
  'Pending', 'Confirmed', 'InProduction', 'QualityCheck', 'Dispatched', 'OutForDelivery', 'Delivered',
];

const STATUS_BADGE: Record<OrderStatus, 'blue' | 'green' | 'gray' | 'yellow' | 'charcoal' | 'red'> = {
  Pending: 'yellow',
  Confirmed: 'blue',
  InProduction: 'blue',
  QualityCheck: 'blue',
  Dispatched: 'blue',
  OutForDelivery: 'blue',
  Delivered: 'green',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  InProduction: 'In Production',
  QualityCheck: 'Quality Check',
  Dispatched: 'Dispatched',
  OutForDelivery: 'Out for Delivery',
  Delivered: 'Delivered',
};

function UpdateStatusModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: { status: order.status, trackingNumber: order.trackingNumber || '' },
  });

  const mutation = useMutation({
    mutationFn: (data: { status: OrderStatus; trackingNumber: string }) =>
      ordersApi.update(order.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      onClose();
    },
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d as { status: OrderStatus; trackingNumber: string }))} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Order Status</label>
        <select
          {...register('status')}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Tracking Number</label>
        <input
          {...register('trackingNumber')}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
          placeholder="e.g. DTDC1234567890"
        />
      </div>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-2.5 bg-wf-blue hover:bg-wf-blue-dark text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-60"
      >
        {mutation.isPending ? 'Updating…' : 'Update Status'}
      </button>
    </form>
  );
}

export default function AdminOrders() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders = [], isPending } = useQuery({
    queryKey: ['admin-orders', filterStatus],
    queryFn: () => ordersApi.getAll(filterStatus !== 'all' ? { status: filterStatus } : undefined),
  });

  if (isPending) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Orders</h1>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['all', ...ALL_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filterStatus === s ? 'bg-wf-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'All' : STATUS_LABELS[s as OrderStatus]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Order #</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Customer</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Total</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Date</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <ShoppingCart size={32} className="mx-auto mb-2 text-gray-300" />
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-semibold text-charcoal">
                      #{order.orderNumber}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-charcoal">{order.customerName}</p>
                      <p className="text-gray-400 text-xs">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3 font-bold text-charcoal">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={STATUS_BADGE[order.status]}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-wf-blue/10 text-wf-blue hover:bg-wf-blue hover:text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Update Order #${selectedOrder?.orderNumber}`}
        size="sm"
      >
        {selectedOrder && (
          <UpdateStatusModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </Modal>
    </div>
  );
}
