import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../context/AuthContext';
import { User, Package, ChevronRight, MapPin, Edit3 } from 'lucide-react';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Address states
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !user?.uid) {
      navigate('/login?redirect=/profile');
      return;
    }

    // Fetch Orders
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        setOrders(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user profile (address/pincode)
    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.address) setAddress(data.address);
          if (data.pincode) setPincode(data.pincode);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchOrders();
    fetchUserProfile();
  }, [user, isLoggedIn, navigate]);

  // Auto fetch current location → pincode
  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported on this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        setAddress(data.display_name || '');
        setPincode(data.address?.postcode || '');
      } catch (err) {
        console.error('Error fetching location:', err);
      }
    });
  };

  // Save to Firestore under `users` collection
  const saveAddress = async () => {
    if (!user?.uid) return;
    try {
      setSaving(true);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { address, pincode });
      setEditMode(false);
      alert('Address updated!');
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Account</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details + Address */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              {!address && !pincode ? (
                // No address set → show form
                <>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Address</span>
                    <textarea
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      rows="2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Pincode</span>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter Pincode"
                    />
                  </label>

                  <div className="flex space-x-2">
                    <button
                      onClick={fetchLocation}
                      className="flex items-center px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      <MapPin className="w-4 h-4 mr-2" /> Use Current Location
                    </button>
                    <button
                      onClick={saveAddress}
                      disabled={saving}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </>
              ) : editMode ? (
                // Edit mode → show form
                <>
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Address</span>
                    <textarea
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      rows="2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700">Pincode</span>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </label>

                  <div className="flex space-x-2">
                    <button
                      onClick={fetchLocation}
                      className="flex items-center px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      <MapPin className="w-4 h-4 mr-2" /> Use Current Location
                    </button>
                    <button
                      onClick={saveAddress}
                      disabled={saving}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                // View mode → show saved address
                <div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    <strong>Address:</strong> {address}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Pincode:</strong> {pincode}
                  </p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-3 flex items-center px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date:{' '}
                        {order.createdAt?.toDate
                          ? order.createdAt.toDate().toLocaleDateString()
                          : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total: ₹{order.totalAmount?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-red-600 hover:text-red-800"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No Orders Yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't placed any orders with us yet.
                </p>
                <div className="mt-6">
                  <Link
                    to="/products"
                    className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
