import logo from '../../assets/logo.png';
import { Link } from "react-router-dom";
import { MapPin, Mail, Instagram, Facebook, Youtube, Linkedin, Twitter } from "lucide-react";
import React from 'react';

const Footer = () => (
  <footer className="bg-[#234F1E] text-white py-12">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between">
      <div className="mb-8 md:mb-0 text-center md:text-left">
        <img
          src={logo}
          alt="Yuma's Fresh Foods Logo"
          className="w-32 mb-4 mx-auto md:mx-0"
        />

        <div className="flex items-start justify-center md:justify-start mb-2">
          <MapPin className="w-4 h-4 mr-2 mt-1" />
          <div className="text-sm text-left">
            <p>123 Street Address, Oil Nagar,</p>
            <p>Sample City - 123456, Tamil Nadu, India</p>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-start mb-2">
          <Mail className="w-4 h-4 mr-2" />
          <p className="text-sm">info@gmail.com</p>
        </div>

        <button className="bg-orange-500 text-white px-4 py-2 mt-4 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
          <a
            href="https://wa.me/91XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to chat on Whatsapp
          </a>
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row justify-around text-center md:text-left">
        <div className="mb-6 md:mb-0">
          <h4 className="font-bold text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/benefits" className="hover:underline">Benefits of Yuma</Link></li>
            <li><Link to="/testimonials" className="hover:underline">Testimonials</Link></li>
            <li><Link to="/journey" className="hover:underline">Our Journey</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/terms" className="hover:underline">Terms & Conditions</Link></li>
            <li><Link to="/delivery" className="hover:underline">Delivery Information</Link></li>
          </ul>
        </div>

        <div className="mb-6 md:mb-0">
          <h4 className="font-bold text-lg mb-4">Our Policy</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link to="/shipping-policy" className="hover:underline">Shipping Policy</Link></li>
            <li><Link to="/return-policy" className="hover:underline">Return Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:underline">Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4">Follow us on</h4>
          <div className="flex justify-center md:justify-start space-x-4 mb-6">
            <Instagram className="w-6 h-6 hover:text-gray-200" />
            <Facebook className="w-6 h-6 hover:text-gray-200" />
            <Youtube className="w-6 h-6 hover:text-gray-200" />
            <Linkedin className="w-6 h-6 hover:text-gray-200" />
            <Twitter className="w-6 h-6 hover:text-gray-200" />
          </div>
          <h4 className="font-bold text-lg mb-2">My Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/profile" className="hover:underline">My Profile</Link></li>
            <li><Link to="/orders" className="hover:underline">Order History</Link></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;