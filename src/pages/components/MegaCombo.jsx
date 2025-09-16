import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const MegaCombo = ({ products, addToCart, handleBuyNow }) => (
  <section className="py-12 bg-white">
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center bg-[#c8ffba] rounded-xl p-8 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full lg:w-3/4 mb-6 lg:mb-0">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center text-center">
              <img src={p.images[0]} alt={p.name} className="w-full h-40 object-contain" />
              <h3 className="font-semibold text-gray-800 mt-2">{p.name}</h3>
              <div className="text-lg font-bold text-[#b85a00] mb-4">₹{p.price}</div>
              <div className="flex space-x-2">
                <button onClick={() => addToCart(p)} className="flex items-center bg-[#f0c242] px-3 py-2 rounded-lg text-sm font-semibold hover:bg-[#e0b034]">
                  <ShoppingCart className="w-4 h-4 mr-1" /> Add
                </button>
                <button onClick={() => handleBuyNow(p)} className="bg-[#b85a00] text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-[#a14f00]">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-1/4 text-center lg:text-right">
          <h3 className="text-3xl font-bold text-[#b85a00] mb-4">Mega Combo Packs</h3>
          <Link to="/products?category=Combos" className="bg-[#b85a00] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a14f00] transition-colors">
            View all combos
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default MegaCombo;
