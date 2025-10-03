import React from "react";
import { motion } from "framer-motion";

const text = "Special Festival Offers";

const OfferBanner = () => {
  // Split words for animation
  const words = text.split(" ");

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 text-center">
        {/* Animated Gradient Box */}
        <motion.div
          className="bg-gradient-to-r from-green-100 via-green-200 to-green-400 p-6 rounded-xl shadow-lg"
          animate={{
            scale: [1, 1.02, 1],
            boxShadow: [
              "0px 0px 10px rgba(0,0,0,0.1)",
              "0px 0px 20px rgba(0,0,0,0.2)",
              "0px 0px 10px rgba(0,0,0,0.1)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Don't miss the discounts
          </h3>

          <div className="flex justify-center items-center overflow-hidden">
            <motion.div
              className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
              animate={{
                rotate: [0, 1, -1, 0],
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              {/* Left Icon */}
              <motion.div
                className="text-4xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                🎉
              </motion.div>

              {/* Word-by-word animation */}
              <div className="text-left">
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.3 },
                    },
                  }}
                >
                  {words.map((word, i) => (
                    <motion.span
                      key={i}
                      className="text-lg font-semibold text-gray-800"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.p
                  className="text-sm text-gray-600 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  Up to 30% off on selected items
                </motion.p>
              </div>

              {/* Right Icon */}
              <motion.div
                className="text-4xl"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                🎁
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfferBanner;
