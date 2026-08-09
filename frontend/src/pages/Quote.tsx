import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, Upload, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { contentApi } from '../services/api';

const STEPS = ['Flag Details', 'Design', 'Delivery', 'Review & Submit'];

const FLAG_TYPES = [
  // Table Flags
  'Single Table Flag',
  'Cross Table Flag',
  'Gold Acrylic Table Flag',
  'L-Shape Table Flag',
  'Wall Mount Flag',
  // Car & Vehicle
  'Car Flag (Inside the Car)',
  'Car Flag (Outside the Car)',
  'Car Dashboard Flag',
  // Country & National
  'Country Flag',
  'Indian National Flag',
  'Armed Forces Flag',
  // Outdoor & Event
  'Advertising Flag',
  'Feather Flag',
  'Teardrop Flag',
  'Sharkfin Flag',
  'Street Light Pole Banner',
  // Specialty
  'Sports Flag',
  'Political Flag',
  'Pride Flag',
  'Hand Flags',
  'String Flags',
  'Group Flag',
  'Pennants Flag',
  'Promotional Flag',
  'Hotel Flag',
  'School / University Flag',
  'Tour Guide Flag',
  'Plain / Solid Colour Flag',
  'Custom / Logo Flag',
];

const SIZES = [
  // Small (table flags, car flags)
  '6×4 inches',
  '9×6 inches',
  '12×8 inches',
  '18×12 inches',
  // Standard outdoor sizes
  '2ft × 3ft',
  '2ft × 3.5ft',
  '3ft × 4.5ft',
  '4ft × 6ft',
  // Large outdoor / advertising
  '2ft × 6ft',
  '3ft × 7ft',
  '4ft × 8ft',
  '6ft × 9ft',
  // Custom
  'Custom Size',
];

const MATERIALS = ['Polyester (Knitted)', 'Polyester (Woven)', 'Satin', 'Nylon', 'Cotton', 'Spun Polyester', 'Blockout Fabric'];

const step1Schema = z.object({
  flagType: z.string().min(1, 'Select a flag type'),
  size: z.string().min(1, 'Select a size'),
  material: z.string().min(1, 'Select a material'),
  quantity: z.coerce.number().min(50, 'Minimum 50 units required'),
  occasion: z.string().optional(),
});

const step3Schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required'),
  deliveryPincode: z.string().length(6, '6-digit pincode required'),
  deliveryCity: z.string().min(2, 'City is required'),
  deliveryState: z.string().min(2, 'State is required'),
  deliveryType: z.enum(['Standard', 'Express']),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step3Data = z.infer<typeof step3Schema>;

interface QuoteFormData extends Step1Data, Step3Data {
  designHelp: boolean;
  message?: string;
}

function StepperHeader({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                i < currentStep
                  ? 'bg-wf-green text-white'
                  : i === currentStep
                  ? 'bg-wf-blue text-white ring-4 ring-orange-100'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < currentStep ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span
              className={`text-xs mt-1 font-medium hidden sm:block ${
                i === currentStep ? 'text-wf-blue' : i < currentStep ? 'text-wf-green' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 w-8 sm:w-16 transition-colors ${
                i < currentStep ? 'bg-wf-green' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Quote() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [designHelp, setDesignHelp] = useState(false);
  const [designFiles, setDesignFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<Partial<QuoteFormData>>({
    flagType: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    material: searchParams.get('material') || '',
    quantity: Number(searchParams.get('quantity')) || 50,
  });
  const [submitted, setSubmitted] = useState<{ orderNumber: string } | null>(null);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      flagType: formData.flagType || '',
      size: formData.size || '',
      material: formData.material || '',
      quantity: formData.quantity || 50,
      occasion: '',
    },
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      deliveryType: 'Standard',
      name: '',
      email: '',
      phone: '',
      deliveryPincode: '',
      deliveryCity: '',
      deliveryState: '',
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDesignFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 3,
  });

  const mutation = useMutation({
    mutationFn: contentApi.submitQuote,
    onSuccess: (data) => {
      setSubmitted({ orderNumber: data.orderNumber || 'WF-' + Date.now() });
    },
  });

  const unitPrice = 15;
  const deliveryCharge = step3Form.watch('deliveryType') === 'Express' ? 499 : 149;
  const qty = step1Form.watch('quantity') || 50;
  const subtotal = unitPrice * qty;
  const gst = subtotal * 0.18;
  const total = subtotal + gst + deliveryCharge;

  const handleNext = async () => {
    if (step === 0) {
      const valid = await step1Form.trigger();
      if (!valid) return;
      setFormData((prev) => ({ ...prev, ...step1Form.getValues() }));
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      const valid = await step3Form.trigger();
      if (!valid) return;
      setFormData((prev) => ({ ...prev, ...step3Form.getValues() }));
      setStep(3);
    }
  };

  const handleSubmit = () => {
    const allData = { ...formData, ...step3Form.getValues() };
    mutation.mutate({
      flagType: allData.flagType,
      size: allData.size,
      material: allData.material,
      quantity: allData.quantity,
      occasion: allData.occasion,
      designHelp,
      name: allData.name,
      email: allData.email,
      phone: allData.phone,
      deliveryPincode: allData.deliveryPincode,
      deliveryCity: allData.deliveryCity,
      deliveryState: allData.deliveryState,
      deliveryType: allData.deliveryType,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-wf-green" />
          </div>
          <h2 className="text-3xl font-extrabold text-charcoal mb-3">Quote Submitted!</h2>
          <p className="text-gray-500 mb-2">
            Your quote request has been received. Reference:
          </p>
          <p className="text-2xl font-bold text-wf-blue mb-6">{submitted.orderNumber}</p>
          <p className="text-gray-500 mb-8">
            Our team will contact you within 2 business hours with pricing and production timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/919972879599?text=Hi!%20I%20just%20submitted%20a%20quote%20request."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
            <a
              href="/"
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-charcoal mb-2">Get an Instant Quote</h1>
        <p className="text-gray-500">Fill in the details below and we'll get back to you within 2 hours</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
        <StepperHeader currentStep={step} />

        {/* Step 0: Flag Details */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">
                Flag Type <span className="text-red-500">*</span>
              </label>
              <select
                {...step1Form.register('flagType')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
              >
                <option value="">Select type…</option>
                {FLAG_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {step1Form.formState.errors.flagType && (
                <p className="text-red-500 text-xs mt-1">{step1Form.formState.errors.flagType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  Size <span className="text-red-500">*</span>
                </label>
                <select
                  {...step1Form.register('size')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                >
                  <option value="">Select size…</option>
                  {SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {step1Form.formState.errors.size && (
                  <p className="text-red-500 text-xs mt-1">{step1Form.formState.errors.size.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  Material <span className="text-red-500">*</span>
                </label>
                <select
                  {...step1Form.register('material')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                >
                  <option value="">Select material…</option>
                  {MATERIALS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                {step1Form.formState.errors.material && (
                  <p className="text-red-500 text-xs mt-1">{step1Form.formState.errors.material.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">
                Quantity <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-gray-400 ml-1">(min. 50)</span>
              </label>
              <input
                type="number"
                min={50}
                {...step1Form.register('quantity')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                placeholder="e.g. 500"
              />
              {step1Form.formState.errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{step1Form.formState.errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">Occasion (optional)</label>
              <input
                type="text"
                {...step1Form.register('occasion')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                placeholder="e.g. Election rally, Sports event…"
              />
            </div>
          </div>
        )}

        {/* Step 1: Design */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-3">
                Upload Your Design Files (optional)
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-wf-blue bg-blue-50'
                    : 'border-gray-300 hover:border-wf-blue hover:bg-blue-50/30'
                }`}
              >
                <input {...getInputProps()} />
                <Upload size={32} className="mx-auto mb-3 text-gray-400" />
                {isDragActive ? (
                  <p className="text-wf-blue font-medium">Drop files here…</p>
                ) : (
                  <>
                    <p className="text-gray-600 font-medium">Drag & drop design files here</p>
                    <p className="text-gray-400 text-sm mt-1">or click to browse</p>
                    <p className="text-gray-400 text-xs mt-2">PNG, JPG, PDF · max 3 files</p>
                  </>
                )}
              </div>
              {designFiles.length > 0 && (
                <div className="mt-3 space-y-1">
                  {designFiles.map((f) => (
                    <div key={f.name} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                      <CheckCircle size={14} className="text-wf-green" />
                      {f.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={designHelp}
                onChange={(e) => setDesignHelp(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-wf-blue"
              />
              <div>
                <p className="text-sm font-semibold text-charcoal">I need design help</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Our design team will create a custom design for you at no extra charge (for orders 500+ units).
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Step 2: Delivery */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...step3Form.register('name')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                  placeholder="Your full name"
                />
                {step3Form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{step3Form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  {...step3Form.register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                  placeholder="+91 XXXXX XXXXX"
                />
                {step3Form.formState.errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{step3Form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...step3Form.register('email')}
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                placeholder="you@example.com"
              />
              {step3Form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">{step3Form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  {...step3Form.register('deliveryPincode')}
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                  placeholder="400001"
                />
                {step3Form.formState.errors.deliveryPincode && (
                  <p className="text-red-500 text-xs mt-1">{step3Form.formState.errors.deliveryPincode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  {...step3Form.register('deliveryCity')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                  placeholder="Mumbai"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  {...step3Form.register('deliveryState')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-wf-blue"
                  placeholder="Maharashtra"
                />
              </div>
            </div>

            {/* Delivery type */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-3">Delivery Type</label>
              <div className="grid grid-cols-2 gap-3">
                {(['Standard', 'Express'] as const).map((type) => (
                  <label
                    key={type}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      step3Form.watch('deliveryType') === type
                        ? 'border-wf-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      {...step3Form.register('deliveryType')}
                      className="sr-only"
                    />
                    <span className="font-bold text-charcoal">{type}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {type === 'Standard' ? '5–7 working days · ₹149' : '48 hours · ₹499'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="font-bold text-charcoal">Order Summary</h3>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Flag Type', step1Form.getValues('flagType')],
                    ['Size', step1Form.getValues('size')],
                    ['Material', step1Form.getValues('material')],
                    ['Quantity', `${qty} units`],
                    ['Occasion', step1Form.getValues('occasion') || '—'],
                    ['Design Help', designHelp ? 'Yes' : 'No'],
                    ['Delivery To', `${step3Form.getValues('deliveryCity')}, ${step3Form.getValues('deliveryState')} – ${step3Form.getValues('deliveryPincode')}`],
                    ['Delivery Type', step3Form.getValues('deliveryType')],
                    ['Contact', `${step3Form.getValues('name')} · ${step3Form.getValues('email')}`],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-2.5 font-medium text-gray-500 w-36">{label}</td>
                      <td className="px-4 py-2.5 text-charcoal font-medium">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price */}
            <div className="bg-blue-50 rounded-xl p-5 border border-orange-100">
              <h4 className="font-bold text-charcoal mb-3">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Base price (₹{unitPrice} × {qty})</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-medium">₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery ({step3Form.watch('deliveryType')})</span>
                  <span className="font-medium">₹{deliveryCharge}</span>
                </div>
                <div className="flex justify-between border-t border-orange-200 pt-2 font-bold text-charcoal text-base">
                  <span>Estimated Total</span>
                  <span className="text-wf-blue">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">* Final price confirmed in quote. Estimate only.</p>
            </div>

            {mutation.isError && (
              <p className="text-red-500 text-sm text-center">
                Something went wrong. Please try again or WhatsApp us.
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-charcoal disabled:opacity-0 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-wf-blue hover:bg-wf-blue-dark text-white font-bold rounded-xl transition-colors"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-wf-green hover:bg-wf-green-dark text-white font-bold rounded-xl transition-colors disabled:opacity-60"
            >
              {mutation.isPending ? 'Submitting…' : 'Submit Quote Request'}
              {!mutation.isPending && <CheckCircle size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

