import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Instagram, Facebook, Youtube, Linkedin, Twitter } from 'lucide-react';

const Footer = ({ siteConfig }) => {
  const currentYear = new Date().getFullYear();
  const { address, email, phone, socials } = siteConfig || {};

  return (
    <footer className="bg-gray-800 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div className="col-span-1">
            <Link to="/" className="text-2xl font-bold text-red-600 mb-4 block">Yuma Foods</Link> {/* Updated to "Yuma Foods" */}
            <p className="text-gray-400 text-sm">Freshness, Quality, and Tradition Delivered to Your Doorstep.</p>
            {address && (
              <div className="flex items-center text-sm mt-4">
                <MapPin size={16} className="text-red-600 mr-2" />
                <span>{address}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center text-sm mt-2">
                <Mail size={16} className="text-red-600 mr-2" />
                <span>{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center text-sm mt-2">
                <Phone size={16} className="text-red-600 mr-2" />
                <span>{phone}</span>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="hover:text-red-600 transition-colors">Products</Link></li>
              <li><Link to="/about" className="hover:text-red-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-red-600 transition-colors">Contact</Link></li>
              <li><Link to="/profile" className="hover:text-red-600 transition-colors">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-red-600 transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=Fruits" className="hover:text-red-600 transition-colors">Fruits</Link></li>
              <li><Link to="/products?category=Vegetables" className="hover:text-red-600 transition-colors">Vegetables</Link></li>
              <li><Link to="/products?category=Grains" className="hover:text-red-600 transition-colors">Grains</Link></li>
              <li><Link to="/products?category=Spices" className="hover:text-red-600 transition-colors">Spices</Link></li>
              <li><Link to="/products?category=Dairy" className="hover:text-red-600 transition-colors">Dairy</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socials?.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                  <Instagram size={24} />
                </a>
              )}
              {socials?.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Facebook size={24} />
                </a>
              )}
              {socials?.youtube && (
                <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                  <Youtube size={24} />
                </a>
              )}
              {socials?.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Twitter size={24} />
                </a>
              )}
              {socials?.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors">
                  <Linkedin size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} <span className="text-red-600 font-semibold">Yuma Foods</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;