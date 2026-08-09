import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle,
} from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // In a real scenario, this would call an API endpoint
    await new Promise((r) => setTimeout(r, 800));
    console.log('Contact form:', data);
    setSubmitted(true);
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal mb-3">Contact Us</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Reach out for bulk orders, custom quotes, or any queries. We respond within 2 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-charcoal mb-5">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-wf-blue" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">Address</p>
                  <p className="text-gray-500 text-sm leading-relaxed mt-1">
                    Flat No. 302, Box 8 Building,<br />
                    Near Aaspire Heights, SGR Dental College Rd,<br />
                    Kasavanahalli Village, Marathahalli,<br />
                    Bengaluru, Karnataka – 560037
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-wf-blue" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">Phone</p>
                  <a
                    href="tel:+919972879599"
                    className="text-gray-500 text-sm hover:text-wf-blue transition-colors mt-1 block"
                  >
                    +91 99728 79599
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-wf-blue" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">Email</p>
                  <a
                    href="mailto:info@winflag.net"
                    className="text-gray-500 text-sm hover:text-wf-blue transition-colors mt-1 block"
                  >
                    info@winflag.net
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={18} className="text-wf-green" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">WhatsApp</p>
                  <a
                    href="https://wa.me/919972879599?text=Hi%20WINFLAG!%20I%20need%20flags%20for%20an%20event."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 text-sm hover:text-wf-green transition-colors mt-1 block"
                  >
                    Chat with us on WhatsApp
                  </a>
                  <a
                    href="https://wa.me/919972879599?text=Hi%20WINFLAG!%20I%20need%20flags%20for%20an%20event."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-[#25D366] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle size={14} />
                    Open WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-wf-blue" />
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">Business Hours</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Monday – Saturday: 9 AM – 7 PM<br />
                    Sunday: 10 AM – 4 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden h-56 border border-gray-200">
            <iframe
              title="WINFLAG Location"
              src="https://www.google.com/maps?q=Kasavanahalli+Village+Marathahalli+Bengaluru+Karnataka+560037&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Right: Contact Form */}
        <div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-charcoal mb-6">Send a Message</h2>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-wf-green mx-auto mb-4" />
                <h3 className="text-xl font-bold text-charcoal mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm mb-4">
                  We'll get back to you within 2 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-wf-blue font-semibold text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-1.5">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                      placeholder="+91 XXXXX XXXXX"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue resize-none"
                    placeholder="Tell us about your requirement…"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-wf-blue hover:bg-wf-blue-dark text-white font-bold rounded-xl transition-colors disabled:opacity-60 text-base"
                >
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

