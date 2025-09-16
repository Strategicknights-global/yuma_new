import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// ✅ Updated navLinks array
const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact' },
  { to: '/bulk-enquiry', label: 'Bulk Enquiry' }, // ✅ Added Bulk Enquiry
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ updated: using `user` from AuthContext
  const { totalCartItems } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout(); // from AuthContext
      setIsMobileMenuOpen(false);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      alert(error.message || 'Something went wrong while logging out.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="src/assets/logo.png" alt="Yuma Foods Logo" className="helo" />
          <span className="text-2xl font-bold text-red-600">Yuma Foods</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-red-600 font-bold border-b-2 border-red-600 transition-colors'
                  : 'text-gray-700 hover:text-red-600 font-medium transition-colors'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* User Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center border rounded-md overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search products..."
              className="px-3 py-1.5 focus:outline-none text-sm w-32 md:w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            <button
              type="submit"
              className="bg-gray-100 p-1.5 hover:bg-gray-200"
              aria-label="Submit search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </form>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 hover:bg-gray-100 rounded-full"
            aria-label="View wishlist"
          >
            <Heart className="w-6 h-6 text-gray-700" />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-full"
            aria-label="View cart"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>

          {/* Authenticated user */}
          {user ? (
            <div className="relative group">
              <button
                className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-full"
                aria-label="User menu"
              >
                <User className="w-6 h-6 text-gray-700" />
                <span className="text-sm text-gray-700">
                  {user.email?.split('@')[0] || 'User'}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />{' '}
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <Link to="/cart" className="relative p-1" aria-label="View cart">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 focus:outline-none"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <form onSubmit={handleSearch} className="flex px-6 mb-4">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-grow p-2 border rounded-l-md focus:outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            <button
              type="submit"
              className="bg-red-600 text-white p-2 rounded-r-md"
              aria-label="Submit search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
          <div className="flex flex-col px-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-gray-700 hover:text-red-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/wishlist"
              className="block text-gray-700 hover:text-red-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Wishlist
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-red-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block text-gray-700 hover:text-red-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="block w-full text-left text-gray-700 hover:text-red-600 font-medium disabled:opacity-50"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-red-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
