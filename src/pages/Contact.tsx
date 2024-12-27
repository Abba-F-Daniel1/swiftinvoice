import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone } from "lucide-react";
import FAQ from "./FAQ";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const Contact = () => {
  return (
    <motion.div
      className="page-container min-h-screen"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <div className="max-w-2xl mx-auto px-4">
        <motion.h1
          variants={fadeInUp}
          className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-12"
        >
          Get in Touch
        </motion.h1>

        <motion.div
          variants={fadeInUp}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90"
        >
          <form className="space-y-6">
            <motion.div variants={fadeInUp}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Name
              </label>
              <Input
                className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                required
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Email
              </label>
              <Input
                type="email"
                className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                required
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Message
              </label>
              <Textarea
                rows={5}
                className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                required
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Send Message
              </Button>
            </motion.div>
          </form>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-12 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full md:w-auto">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Email Us
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                support@swiftinvoice.com
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full md:w-auto">
              <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Call Us
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                +1 (555) 123-4567
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-16">
          <FAQ />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
