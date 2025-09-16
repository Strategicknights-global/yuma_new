import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { Heart, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = { id: productSnap.id, ...productSnap.data() };
          setProduct(productData);
          if (productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0]);
          }
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWishlist(data.wishlist || []);
      } else {
        setWishlist([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!product?.inStock) {
      showNotification('This product is out of stock.');
      return;
    }

    addToCart(product, quantity, selectedVariant);
    const displayName = selectedVariant ? `${product.name} (${selectedVariant.size})` : product.name;
    showNotification(`${quantity} x ${displayName} added to cart!`);
  };

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      if (wishlist.includes(product.id)) {
        await updateDoc(userRef, {
          wishlist: arrayRemove(product.id),
        });
        showNotification(`${product.name} removed from wishlist`);
      } else {
        await updateDoc(userRef, {
          wishlist: arrayUnion(product.id),
        });
        showNotification(`${product.name} added to wishlist`);
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
      showNotification('Failed to update wishlist.');
    }
  };

  const incrementQuantity = () => {
    setQuantity((q) => q + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    </>
  );
  if (error) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">{error}</div>
    </>
  );
  if (!product) return null;

  const displayPrice = selectedVariant?.discountPrice ?? selectedVariant?.price ?? product.price;
  const originalPrice = selectedVariant?.price ?? product.originalPrice;

  // Stock status simplified
  const stockStatus = product.inStock ? "in" : "out";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {notification && (
        <div className="fixed top-20 right-4 z-[100] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          {notification}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[200]">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center relative animate-fadeIn">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6">
              You are not signed in. Please login to continue.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Login Now
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-red-600">₹{displayPrice}</span>
              {originalPrice && displayPrice < originalPrice && (
                <span className="text-2xl text-gray-500 line-through">₹{originalPrice}</span>
              )}
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Select Size:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedVariant?.size === variant.size
                          ? 'bg-red-600 text-white border-red-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 flex items-center gap-2">
              {stockStatus === "out" ? (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-600">Out of Stock</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-600">In Stock</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="p-3 text-gray-500 hover:text-gray-800"
                >
                  -
                </button>
                <span className="px-4 text-md font-medium text-gray-800">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-3 text-gray-500 hover:text-gray-800"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={stockStatus !== "in"}
                className="flex-1 bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-bold text-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={handleWishlistToggle}
                className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                <Heart
                  className={`w-6 h-6 ${
                    wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;