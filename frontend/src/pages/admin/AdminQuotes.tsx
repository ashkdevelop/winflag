import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { MessageSquare } from 'lucide-react';
import { contentApi } from '../../services/api';
import { PageSpinner } from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import type { Quote } from '../../types';

function SetPriceModal({ quote, onClose }: { quote: Quote; onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: { quotedPrice: quote.quotedPrice || '' },
  });

  const mutation = useMutation({
    mutationFn: (data: { quotedPrice: number }) =>
      contentApi.updateQuote(quote.id, { quotedPrice: data.quotedPrice, status: 'Quoted' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-quotes'] });
      onClose();
    },
  });

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Customer</span>
          <span className="font-semibold text-charcoal">{quote.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Flag Type</span>
          <span className="font-semibold text-charcoal">{quote.flagType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Quantity</span>
          <span className="font-semibold text-charcoal">{quote.quantity} units</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((d) => mutation.mutate({ quotedPrice: Number(d.quotedPrice) }))}
        className="space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Quoted Price (₹ total, incl. GST)
          </label>
          <input
            {...register('quotedPrice')}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-wf-blue"
            placeholder="e.g. 12500.00"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-2.5 bg-wf-green hover:bg-wf-green-dark text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-60"
        >
          {mutation.isPending ? 'Saving…' : 'Submit Quote'}
        </button>
      </form>
    </div>
  );
}

export default function AdminQuotes() {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const { data: quotes = [], isPending } = useQuery({
    queryKey: ['admin-quotes'],
    queryFn: contentApi.getQuotes,
  });

  if (isPending) return <PageSpinner />;

  const statusVariant = (s: string) => {
    if (s === 'New') return 'blue' as const;
    if (s === 'Quoted') return 'green' as const;
    if (s === 'Converted') return 'charcoal' as const;
    return 'gray' as const;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Quote Requests</h1>
        <div className="text-sm text-gray-500">
          {quotes.filter((q) => q.status === 'New').length} new
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Contact</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Flag Type</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Qty</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Occasion</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                    No quote requests yet.
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-semibold text-charcoal">{quote.name}</td>
                    <td className="px-5 py-3">
                      <p className="text-gray-600 text-xs">{quote.email}</p>
                      <p className="text-gray-400 text-xs">{quote.phone}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{quote.flagType}</td>
                    <td className="px-5 py-3 font-semibold text-charcoal">{quote.quantity}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{quote.occasion || '—'}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {new Date(quote.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={statusVariant(quote.status)}>{quote.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {(quote.status === 'New' || quote.status === 'Reviewed') && (
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="px-3 py-1.5 bg-wf-green/10 text-wf-green hover:bg-wf-green hover:text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Set Price
                        </button>
                      )}
                      {quote.quotedPrice && (
                        <span className="ml-2 text-xs font-bold text-wf-green">
                          ₹{quote.quotedPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!selectedQuote}
        onClose={() => setSelectedQuote(null)}
        title="Set Quoted Price"
        size="sm"
      >
        {selectedQuote && (
          <SetPriceModal quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
        )}
      </Modal>
    </div>
  );
}
