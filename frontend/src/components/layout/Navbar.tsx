import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const productGroups = [
  {
    heading: 'Table Flags',
    items: [
      { label: 'Single Table Flag', href: '/products?category=single-table-flag' },
      { label: 'Cross Table Flag', href: '/products?category=cross-table-flag' },
      { label: 'Gold Acrylic Table Flag', href: '/products?category=gold-acrylic-table-flag' },
      { label: 'L-Shape Table Flag', href: '/products?category=l-shape-table-flag' },
      { label: 'Wall Mount Flag', href: '/products?category=wall-mount-flag' },
    ],
  },
  {
    heading: 'Country & National',
    items: [
      { label: 'Country Flag', href: '/products?category=country-flag' },
      { label: 'Indian National Flag', href: '/products?category=indian-national-flag' },
      { label: 'Armed Forces Flag', href: '/products?category=armed-forces-flag' },
    ],
  },
  {
    heading: 'Car & Vehicle',
    items: [
      { label: 'Car Flag (Inside)', href: '/products?category=car-flag-inside' },
      { label: 'Car Flag (Outside)', href: '/products?category=car-flag-outside' },
      { label: 'Car Dashboard Flag', href: '/products?category=car-dashboard-flag' },
    ],
  },
  {
    heading: 'Outdoor & Event',
    items: [
      { label: 'Advertising Flags', href: '/products?category=advertising-flags' },
      { label: 'Feather Flags', href: '/products?category=feather-flags' },
      { label: 'Teardrop Flags', href: '/products?category=teardrop-flags' },
      { label: 'Sharkfin Flags', href: '/products?category=sharkfin-flags' },
      { label: 'Street Light Pole Banner', href: '/products?category=street-pole-banner' },
    ],
  },
  {
    heading: 'Specialty',
    items: [
      { label: 'Sports Flag', href: '/products?category=sports-flag' },
      { label: 'Political Flag', href: '/products?category=political-flag' },
      { label: 'Pride Flags', href: '/products?category=pride-flags' },
      { label: 'Hand Flags', href: '/products?category=hand-flags' },
      { label: 'String Flags', href: '/products?category=string-flags' },
      { label: 'Promotional Flags', href: '/products?category=promotional-flags' },
      { label: 'Custom / Logo Flag', href: '/products?category=custom' },
    ],
  },
];

const occasionLinks = [
  { label: 'Political Events', href: '/gallery?occasion=Political' },
  { label: 'Sports Events', href: '/gallery?occasion=Sports' },
  { label: 'National Days', href: '/gallery?occasion=National' },
  { label: 'Corporate Events', href: '/gallery?occasion=Corporate' },
  { label: 'Cultural Festivals', href: '/gallery?occasion=Cultural' },
];

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, callback: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) callback();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, callback]);
}

function ProductsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useOutsideClick(ref, () => setOpen(false));

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 180);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-700 hover:text-wf-blue font-medium text-sm transition-colors py-5"
      >
        Products
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white rounded-b-2xl shadow-2xl border border-t-0 border-gray-100 py-6 px-6 z-50"
          style={{ width: '700px' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid grid-cols-3 gap-6">
            {productGroups.slice(0, 3).map((group) => (
              <div key={group.heading}>
                <p className="text-xs font-bold text-wf-blue uppercase tracking-wider mb-3 pb-1 border-b border-blue-100">
                  {group.heading}
                </p>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="block text-sm text-gray-600 hover:text-wf-blue hover:translate-x-1 transition-all"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6 mt-5 pt-5 border-t border-gray-100">
            {productGroups.slice(3).map((group) => (
              <div key={group.heading}>
                <p className="text-xs font-bold text-wf-blue uppercase tracking-wider mb-3 pb-1 border-b border-blue-100">
                  {group.heading}
                </p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="block text-sm text-gray-600 hover:text-wf-blue transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">Not sure what you need?</p>
            <Link
              to="/quote"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-wf-blue hover:underline"
            >
              Get a free quote →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function OccasionsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useOutsideClick(ref, () => setOpen(false));

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 180);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-700 hover:text-wf-blue font-medium text-sm transition-colors py-5"
      >
        Occasions
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-52 bg-white rounded-b-xl shadow-xl border border-t-0 border-gray-100 py-2 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {occasionLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-wf-blue transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileOccasionsOpen, setMobileOccasionsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors py-5 border-b-2 ${
      isActive
        ? 'text-wf-blue border-wf-blue'
        : 'text-gray-700 hover:text-wf-blue border-transparent'
    }`;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/winflag-logo.png"
              alt="WINFLAG"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <ProductsDropdown />
            <OccasionsDropdown />
            <NavLink to="/gallery" className={navLinkClass}>
              Gallery
            </NavLink>
            <NavLink to="/faq" className={navLinkClass}>
              FAQ
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'Admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-sm font-medium text-wf-green hover:text-wf-green-dark transition-colors"
                  >
                    <LayoutDashboard size={15} />
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                  <User size={14} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-wf-blue transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/quote"
                  className="px-5 py-2 bg-wf-blue hover:bg-wf-blue-dark text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Get Quote
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {/* Products accordion */}
            <button
              className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 py-2"
              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
            >
              Products
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileProductsOpen && (
              <div className="pl-3 space-y-4 pb-2">
                {productGroups.map((group) => (
                  <div key={group.heading}>
                    <p className="text-xs font-bold text-wf-blue uppercase tracking-wider mb-1">
                      {group.heading}
                    </p>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block text-sm text-gray-600 hover:text-wf-blue transition-colors py-0.5"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Occasions accordion */}
            <button
              className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 py-2"
              onClick={() => setMobileOccasionsOpen(!mobileOccasionsOpen)}
            >
              Occasions
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${mobileOccasionsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileOccasionsOpen && (
              <div className="pl-3 space-y-1 pb-2">
                {occasionLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-gray-600 hover:text-wf-blue transition-colors py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            <NavLink
              to="/gallery"
              className="block text-sm font-semibold text-gray-700 py-2 hover:text-wf-blue"
              onClick={() => setMobileOpen(false)}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/faq"
              className="block text-sm font-semibold text-gray-700 py-2 hover:text-wf-blue"
              onClick={() => setMobileOpen(false)}
            >
              FAQ
            </NavLink>
            <NavLink
              to="/blog"
              className="block text-sm font-semibold text-gray-700 py-2 hover:text-wf-blue"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </NavLink>

            <div className="pt-3 mt-2 border-t border-gray-100">
              {user ? (
                <>
                  {user.role === 'Admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-sm font-medium text-wf-green mb-3"
                    >
                      <LayoutDashboard size={14} />
                      Admin Panel
                    </Link>
                  )}
                  <p className="text-sm text-gray-600 mb-2">{user.name}</p>
                  <button onClick={handleLogout} className="text-sm text-red-600 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/quote"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-2.5 bg-wf-blue text-white text-sm font-semibold rounded-lg"
                  >
                    Get Quote
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
