import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Clock, Globe } from 'lucide-react';

const productLinks = [
  { label: 'Single Table Flag', href: '/products?category=single-table-flag' },
  { label: 'Cross Table Flag', href: '/products?category=cross-table-flag' },
  { label: 'Car Flag', href: '/products?category=car-flag' },
  { label: 'Country Flag', href: '/products?category=country-flag' },
  { label: 'Feather & Teardrop Flags', href: '/products?category=feather-teardrop-flags' },
  { label: 'Advertising Flags', href: '/products?category=advertising-flags' },
  { label: 'Armed Forces Flag', href: '/products?category=armed-forces-flag' },
  { label: 'Sports Flag', href: '/products?category=sports-flag' },
  { label: 'Political Flag', href: '/products?category=political-flag' },
  { label: 'Custom / Logo Flag', href: '/products?category=custom' },
];

const occasionLinks = [
  { label: 'Political Events', href: '/gallery?occasion=Political' },
  { label: 'Sports Events', href: '/gallery?occasion=Sports' },
  { label: 'National Days', href: '/gallery?occasion=National' },
  { label: 'Corporate Events', href: '/gallery?occasion=Corporate' },
  { label: 'Cultural Festivals', href: '/gallery?occasion=Cultural' },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img
                src="/winflag-logo.png"
                alt="WINFLAG"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              India's trusted bulk flag supplier. Every flag type – table flags, car flags, feather flags,
              country flags – delivered fast with pride.
            </p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-wf-blue" />
                <span>
                  Flat No. 302, Box 8 Building, Near Aaspire Heights,
                  SGR Dental College Rd, Kasavanahalli Village,
                  Marathahalli, Bengaluru, Karnataka – 560037
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="flex-shrink-0 text-wf-blue" />
                <span>Mon–Sat: 10:00 AM – 7:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Products</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-wf-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Occasions */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Occasions</h3>
            <ul className="space-y-2">
              {occasionLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-wf-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-semibold mt-6 mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Gallery', href: '/gallery' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Blog', href: '/blog' },
                { label: 'Track Order', href: '/track' },
              ].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-gray-400 hover:text-wf-blue transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+919972879599"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-wf-blue transition-colors"
                >
                  <Phone size={14} className="text-wf-blue flex-shrink-0" />
                  +91 99728 79599
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@winflag.net"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-wf-blue transition-colors"
                >
                  <Mail size={14} className="text-wf-blue flex-shrink-0" />
                  info@winflag.net
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919972879599?text=Hi%20WINFLAG!%20I%20need%20flags%20for%20an%20event."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-wf-green-light transition-colors"
                >
                  <MessageCircle size={14} className="text-wf-green-light flex-shrink-0" />
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a
                  href="https://www.winflag.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-wf-blue transition-colors"
                >
                  <Globe size={14} className="text-wf-blue flex-shrink-0" />
                  www.winflag.net
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <Link
                to="/quote"
                className="inline-block px-5 py-2.5 bg-wf-blue hover:bg-wf-blue-dark text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Get Instant Quote
              </Link>
            </div>

            <div className="mt-5 p-3 bg-white/5 rounded-xl text-xs text-gray-500 leading-relaxed">
              GST No: 29AABFW1234A1Z5<br />
              CIN: U74999KA2024PTC000000
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} WINFLAG – www.winflag.net. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/faq" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              FAQ
            </Link>
            <Link to="/contact" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Contact
            </Link>
            <Link to="/blog" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Blog
            </Link>
            <Link to="/track" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

