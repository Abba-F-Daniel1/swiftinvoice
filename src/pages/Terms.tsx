import React from "react";
import { motion } from "framer-motion";
import { Book } from "lucide-react";

export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-block p-3 rounded-full bg-purple-500/10 dark:bg-purple-500/20 mb-4">
          <Book className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Terms and Conditions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Welcome to our application. By using our service, you agree to the
          following terms and conditions.
        </p>
      </motion.div>
    </div>
  );
};

export default Terms;
