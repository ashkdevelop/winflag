import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Search, CheckCircle, Clock, Package, Truck, Star, MapPin, Home } from 'lucide-react';
import { ordersApi } from '../services/api';
import type { Order, OrderStatus } from '../types';

const schema = z.object({
  orderNumber: z.string().min(3, 'Enter a valid order number or phone'),
});
type FormData = z.infer<typeof schema>;

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'Pending', label: 'Order Placed', icon: <Clock size={18} />, desc: 'Your order has been received' },
  { key: 'Confirmed', label: 'Confirmed', icon: <CheckCircle size={18} />, desc: 'Payment verified and order confirmed' },
  { key: 'InProduction', label: 'In Production', icon: <Package size={18} />, desc: 'Flags are being printed and assembled' },
  { key: 'QualityCheck', label: 'Quality Check', icon: <Star size={18} />, desc: 'Final QC inspection underway' },
  { key: 'Dispatched', label: 'Dispatched', icon: <Truck size={18} />, desc: 'Order shipped to carrier' },
  { key: 'OutForDelivery', label: 'Out for Delivery', icon: <MapPin size={18} />, desc: 'Out for delivery to your location' },
  { key: 'Delivered', label: 'Delivered', icon: <Home size={18} />, desc: 'Order delivered successfully!' },
];

function StatusTimeline({ order }: { order: Order }) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="mt-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-charcoal text-lg">Order #{order.orderNumber}</h3>
            <p className="text-gray-500 text-sm">
              {order.customerName} · {order.deliveryCity}, {order.deliveryState}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Total Amount</p>
            <p className="font-bold text-wf-blue text-xl">₹{order.totalAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="bg-blue-50 rounded-xl px-4 py-3 mb-6 border border-orange-100">
            <p className="text-xs font-semibold text-gray-500 mb-0.5">Tracking Number</p>
            <p className="font-bold text-charcoal">{order.trackingNumber}</p>
          </div>
        )}

        <div className="space-y-0">
          {STATUS_STEPS.map((step, i) => {
            const isDone = i <= currentIndex;
            const isCurrent = i === currentIndex;
            const isLast = i === STATUS_STEPS.length - 1;

            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-wf-blue text-white ring-4 ring-orange-100'
                        : isDone
                        ? 'bg-wf-green text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step.icon}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 h-10 mt-1 ${isDone && !isCurrent ? 'bg-wf-green' : 'bg-gray-200'}`}
                    />
                  )}
                </div>
                <div className={`pb-6 ${isLast ? '' : ''}`}>
                  <p
                    className={`font-semibold text-sm ${
                      isCurrent ? 'text-wf-blue' : isDone ? 'text-charcoal' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-orange-100 text-wf-blue font-bold">
                        Current
                      </span>
                    )}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDone ? 'text-gray-500' : 'text-gray-300'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function TrackOrder() {
  const [order, setOrder] = useState<Order | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) => ordersApi.track(data.orderNumber),
    onSuccess: (data) => setOrder(data),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-2xl mb-4">
          <Truck size={28} className="text-wf-blue" />
        </div>
        <h1 className="text-3xl font-extrabold text-charcoal mb-2">Track Your Order</h1>
        <p className="text-gray-500 text-sm">Enter your order number to see real-time status</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1.5">
              Order Number or Phone
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('orderNumber')}
                className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                placeholder="e.g. WF-20250101-0001"
              />
            </div>
            {errors.orderNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.orderNumber.message}</p>
            )}
          </div>

          {mutation.isError && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm font-medium">
                Order not found. Please check the order number and try again.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-3.5 bg-wf-blue hover:bg-wf-blue-dark text-white font-bold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Tracking…
              </>
            ) : (
              <>
                <Search size={16} />
                Track Order
              </>
            )}
          </button>
        </form>
      </div>

      {order && <StatusTimeline order={order} />}
    </div>
  );
}
