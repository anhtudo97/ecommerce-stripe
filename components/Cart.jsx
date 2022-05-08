import React, { useRef } from "react";
import Link from "next/link";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

import { useStateContext } from "../context/StateContext";
import { urlFor } from "../libs/client";
import getStripe from "../libs/getStripe";
import { useOutsideAlerter } from "../hooks/useClickoutside";

const variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.5,
    },
  },
  closed: {
    opacity: 0,
    x: "-100%",
    transition: {
      delay: 0.5,
    },
  },
};

const Cart = () => {
  const cartContainerRef = useRef(null);
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuanitity,
    onRemove,
    showCart,
  } = useStateContext();

  useOutsideAlerter(cartContainerRef, () => {
    setShowCart(false);
  });

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems),
    });

    if (response.statusCode === 500) return;

    const data = await response.json();

    toast.loading("Redirecting...");

    stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <AnimatePresence>
      {showCart && (
        <>
          <motion.div
            className="cart-wrapper"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
              ref={cartContainerRef}
              className="cart-container"
            >
              <button
                type="button"
                className="cart-heading"
                onClick={() => setShowCart(false)}
              >
                <AiOutlineLeft />
                <span className="heading">Your Cart</span>
                <span className="cart-num-items">
                  ({totalQuantities} items)
                </span>
              </button>

              {cartItems.length < 1 && (
                <div className="empty-cart">
                  <AiOutlineShopping size={150} />
                  <h3>Your shopping bag is empty</h3>
                  <Link href="/">
                    <button
                      type="button"
                      onClick={() => setShowCart(false)}
                      className="btn"
                    >
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              )}

              <div className="product-container">
                {cartItems.length >= 1 &&
                  cartItems.map((item) => (
                    <div className="product" key={item._id}>
                      <img
                        src={urlFor(item?.image[0])}
                        className="cart-product-image"
                      />
                      <div className="item-desc">
                        <div className="flex top">
                          <h5>{item.name}</h5>
                          <h4>${item.price}</h4>
                        </div>
                        <div className="flex bottom">
                          <div>
                            <p className="quantity-desc">
                              <span
                                className="minus"
                                onClick={() =>
                                  toggleCartItemQuanitity(item._id, "dec")
                                }
                              >
                                <AiOutlineMinus />
                              </span>
                              <span className="num" onClick="">
                                {item.quantity}
                              </span>
                              <span
                                className="plus"
                                onClick={() =>
                                  toggleCartItemQuanitity(item._id, "inc")
                                }
                              >
                                <AiOutlinePlus />
                              </span>
                            </p>
                          </div>
                          <button
                            type="button"
                            className="remove-item"
                            onClick={() => onRemove(item)}
                          >
                            <TiDeleteOutline />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {cartItems.length >= 1 && (
                <div className="cart-bottom">
                  <div className="total">
                    <h3>Subtotal:</h3>
                    <h3>${totalPrice}</h3>
                  </div>
                  <div className="btn-container">
                    <button
                      type="button"
                      className="btn"
                      onClick={handleCheckout}
                    >
                      Pay with Stripe
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{ type: "spring", bounce: 0, duration: 0.2 }}
              className="cart-wrapper-bg"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
