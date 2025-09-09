import React, { createContext, useState, useContext, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, loading } = useAuth(); // ✅ updated: using user
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    const manageUserData = async () => {
      if (loading) return; // wait until auth finishes
      setLoadingCart(true);

      if (user?.uid) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setCart(userData.cart || []);
            setWishlist(userData.wishlist || []);
          } else {
            setCart([]);
            setWishlist([]);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setCart([]);
          setWishlist([]);
        }
      } else {
        setCart([]);
        setWishlist([]);
      }

      setLoadingCart(false);
    };

    manageUserData();
  }, [user, loading]);

  const updateFirestore = async (newData) => {
    if (user?.uid) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, newData);
      } catch (error) {
        console.error("Failed to update Firestore:", error);
      }
    }
  };

  const addToCart = (product, quantity = 1, variant = null) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const cartKey = variant ? `${product.id}-${variant.size}` : product.id;

      const existingItemIndex = updatedCart.findIndex(
        (item) => item.cartKey === cartKey
      );

      if (existingItemIndex > -1) {
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        const price =
          variant?.discountPrice ?? variant?.price ?? product.price;
        const displayName = variant
          ? `${product.name} (${variant.size})`
          : product.name;

        updatedCart.push({
          ...product,
          cartKey,
          quantity,
          price,
          variant,
          displayName,
        });
      }

      updateFirestore({ cart: updatedCart });
      return updatedCart;
    });
  };

  const updateQuantity = (cartKey, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartKey);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.cartKey === cartKey ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    updateFirestore({ cart: updatedCart });
  };

  const removeFromCart = (cartKey) => {
    const updatedCart = cart.filter((item) => item.cartKey !== cartKey);
    setCart(updatedCart);
    updateFirestore({ cart: updatedCart });
  };

  const clearCart = async () => {
    setCart([]);
    await updateFirestore({ cart: [] });
  };

  const toggleWishlist = (productId) => {
    const updatedWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(updatedWishlist);
    updateFirestore({ wishlist: updatedWishlist });
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalCartValue = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    cart,
    wishlist,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    totalCartItems,
    totalCartValue,
    loadingCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};
