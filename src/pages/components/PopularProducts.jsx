import React, { useState } from "react";
import { Link } from "react-router-dom";

const PopularProducts = ({ products, categories, addToCart }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = products.filter(p =>
    activeCategory === "All" ? true : p.categoryId === activeCategory
  );

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#01796f]">Popular Products</h2>

        {/* Categories */}
        <div className="flex justify-center mb-8 space-x-4 flex-wrap">
          <button onClick={() => setActiveCategory("All")}
            className={`px-4 py-2 rounded-lg ${activeCategory === "All" ? "bg-[#01796f] text-white" : "bg-gray-200"}`}>
            All
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg ${activeCategory === cat.id ? "bg-[#01796f] text-white" : "bg-gray-200"}`}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-md">
              <Link to={`/products/${p.id}`}>
                <img src={p.images?.[0]} alt={p.name} className="w-full h-48 object-cover" />
                <div className="p-4 text-center">
                  <h3 className="text-md font-semibold">{p.name}</h3>
                  <div className="text-xl font-bold text-[#b85a00]">₹{p.price}</div>
                </div>
              </Link>
              <div className="flex justify-center p-4">
                <button onClick={() => addToCart(p)} className="bg-[#01796f] text-white px-4 py-2 rounded-lg">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
