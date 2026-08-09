import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { contentApi } from '../services/api';
import { PageSpinner } from '../components/ui/Spinner';
import type { Faq as FaqType } from '../types';

function FaqItem({ faq }: { faq: FaqType }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-charcoal pr-4">{faq.question}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

const DEFAULT_FAQS: FaqType[] = [
  { id: 'f1', question: 'What is the minimum order quantity (MOQ)?', answer: 'Our standard MOQ is 50 units for most flag types. For small table flags we can sometimes accommodate smaller quantities — contact us to discuss your specific needs.', category: 'Ordering', displayOrder: 1 },
  { id: 'f2', question: 'What flag types do you offer?', answer: 'We supply a comprehensive range: Single Table Flags, Cross Table Flags, Car Flags, Country Flags, Indian National Flags, Armed Forces Flags, Advertising Flags, Feather & Teardrop Flags, Sports Flags, Political Flags, Hand Flags, Wall Mount Flags, String Flags, Promotional Flags, and fully Custom Logo Flags.', category: 'Products', displayOrder: 2 },
  { id: 'f3', question: 'What stand types are available for table flags?', answer: 'We offer: Transparent Acrylic, Black Acrylic with Gold Top, Gold Acrylic, Gold Plastic, Brass, Stainless Steel (Round), Stainless Steel (Square), Wooden (10 inch), Wooden (15 inch), T-Shape, Y-Shape, and L-Shape stands. Each gives a different look to suit your setting.', category: 'Products', displayOrder: 3 },
  { id: 'f4', question: 'How long does production take?', answer: 'Standard production is 3–7 business days after design approval and payment confirmation. We offer a 48-hour Express production option for urgent orders at an additional charge.', category: 'Delivery', displayOrder: 4 },
  { id: 'f5', question: 'What materials do you use for flags?', answer: 'We use 100% Knitted Polyester, Woven Polyester, Spun Polyester, Satin, and Nylon depending on the flag type. All flags are printed using Die Sublimation — colours are vibrant, wash-resistant, and UV-stable for outdoor use.', category: 'Products', displayOrder: 5 },
  { id: 'f6', question: 'Do you provide GST invoices?', answer: 'Yes, we provide GST-compliant tax invoices for all orders. Our GST number is 29AABFW1234A1Z5. This is especially important for corporate and government clients who need to claim input tax credit.', category: 'Billing', displayOrder: 6 },
  { id: 'f7', question: 'What sizes are available for country and advertising flags?', answer: 'Country Flags: 2ft×3ft, 3ft×4.5ft, 4ft×6ft. Advertising Flags: 2ft×6ft, 3ft×7ft, 4ft×8ft and custom sizes. Table Flags: 6×4 inches and 9×6 inches (standard). All sizes can be customised on request.', category: 'Products', displayOrder: 7 },
  { id: 'f8', question: 'Can I get a custom design for my flag?', answer: 'Absolutely. Simply share your artwork (AI, EPS, PDF, or high-resolution PNG/JPG) when placing the order. Our design team can also create custom artwork at no extra charge for orders of 500+ units.', category: 'Ordering', displayOrder: 8 },
  { id: 'f9', question: 'Do you deliver across India?', answer: 'Yes. We ship to all states and union territories across India via trusted courier partners. Delivery charge depends on your location and is shown during checkout. Express delivery is available to major cities.', category: 'Delivery', displayOrder: 9 },
  { id: 'f10', question: 'How do I track my order?', answer: 'Once your order is dispatched, you will receive a tracking number via SMS and email. You can also use the Track Order page on our website to check your shipment status at any time.', category: 'Delivery', displayOrder: 10 },
  { id: 'f11', question: 'What payment methods do you accept?', answer: 'We accept UPI (GPay, PhonePe, Paytm), NEFT/RTGS bank transfer, cheques, and cash payments at our office. For large B2B orders, payment-on-delivery is available subject to prior approval.', category: 'Billing', displayOrder: 11 },
  { id: 'f12', question: 'What is your return and cancellation policy?', answer: 'Since flags are custom-printed, we do not accept returns for change-of-mind. If there is a manufacturing defect or wrong delivery, we will reprint or refund at no cost. Cancellations can be made before design approval without charge.', category: 'Ordering', displayOrder: 12 },
];

export default function Faq() {
  const { data: faqs = [], isPending } = useQuery({
    queryKey: ['faq'],
    queryFn: () => contentApi.getFaq(),
  });

  const displayFaqs = faqs.length > 0 ? faqs : DEFAULT_FAQS;

  const categories = useMemo(() => {
    const cats = [...new Set(displayFaqs.map((f) => f.category).filter(Boolean))] as string[];
    return cats;
  }, [displayFaqs]);

  const grouped = useMemo(() => {
    const uncategorised = displayFaqs.filter((f) => !f.category);
    const result: Record<string, FaqType[]> = {};
    if (uncategorised.length > 0) result['General'] = uncategorised;
    for (const cat of categories) {
      result[cat] = displayFaqs.filter((f) => f.category === cat);
    }
    return result;
  }, [displayFaqs, categories]);

  if (isPending) return <PageSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4">
          <HelpCircle size={28} className="text-wf-blue" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Everything you need to know about ordering flags from WINFLAG
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            {Object.keys(grouped).length > 1 && (
              <h2 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-wf-blue rounded-full inline-block" />
                {category}
              </h2>
            )}
            <div className="space-y-2">
              {items.map((faq) => (
                <FaqItem key={faq.id} faq={faq} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-blue-50 rounded-2xl p-6 text-center border border-blue-100">
        <p className="text-charcoal font-semibold mb-1">Still have questions?</p>
        <p className="text-gray-500 text-sm mb-4">Our team is happy to help with any query.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/919972879599"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#25D366] text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            WhatsApp Us
          </a>
          <a
            href="/contact"
            className="px-5 py-2.5 border-2 border-wf-blue text-wf-blue font-semibold rounded-xl text-sm hover:bg-wf-blue hover:text-white transition-colors"
          >
            Contact Page
          </a>
        </div>
      </div>
    </div>
  );
}
