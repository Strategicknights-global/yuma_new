import React from "react";

const OfferBanner = () => (
  <section className="py-8 bg-white">
    <div className="container mx-auto px-4 text-center">
      <div className="bg-gradient-to-r from-green-100 via-green-200 to-green-400 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Don't miss the discounts</h3>
        <div className="flex justify-center items-center overflow-hidden">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
            <div className="text-4xl">🎉</div>
            <div>
              <p className="text-lg font-semibold text-gray-800">Special Festival Offers</p>
              <p className="text-sm text-gray-600">Up to 30% off on selected items</p>
            </div>
            <div className="text-4xl">🎁</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default OfferBanner;
