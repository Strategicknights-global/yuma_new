import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Import all pages and components
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './components/ProductDetailPage';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderDetailPage from './pages/OrderDetailPage';
import Wishlist from './pages/Wishlist.jsx';

// Import common components
import OfferBanner from './components/OfferBanner';
import Footer from './components/Footer'; // Ensure Footer is imported
import { db } from '../firebase.js'; // Import db from firebase
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

function App() {
  const [siteConfig, setSiteConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        const configDocRef = doc(db, 'siteConfiguration', 'mainConfig');
        const configSnap = await getDoc(configDocRef);
        if (configSnap.exists()) {
          setSiteConfig(configSnap.data());
        } else {
          console.warn("No 'mainConfig' document found in 'siteConfiguration' collection.");
        }
      } catch (error) {
        console.error("Error fetching site configuration:", error);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchSiteConfig();
  }, []);

  if (loadingConfig) {
    // You can render a loading spinner or a blank page while config loads
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <OfferBanner /> 
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                <Route path="/wishlist" element ={<Wishlist />}/>
              </Routes>
            </main>
            {/* Pass the fetched siteConfig to the Footer */}
            <Footer siteConfig={siteConfig?.footerInfo || {}} />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;