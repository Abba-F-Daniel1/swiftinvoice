import React from "react";
import { motion } from "framer-motion";
import { Shield, User, Database, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const PolicySection = ({ icon: Icon, title, children }) => (
  <motion.div
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    variants={fadeIn}
    className="mb-8"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
    </div>
    <div className="pl-12">
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {children}
      </p>
    </div>
  </motion.div>
);

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-block p-3 rounded-full bg-blue-500/10 dark:bg-blue-500/20 mb-4">
          <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Your privacy is important to us. This policy outlines how we collect,
          use, and protect your information.
        </p>
      </motion.div>

      <Card className="border-0 shadow-lg bg-white dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <PolicySection icon={User} title="Information We Collect">
            We collect personal information that you provide to us when you
            register for an account or use our services.
          </PolicySection>

          <PolicySection icon={Database} title="How We Use Your Information">
            We use your information to provide and improve our services,
            communicate with you, and comply with legal obligations.
          </PolicySection>

          <PolicySection icon={Lock} title="Data Security">
            We implement reasonable security measures to protect your
            information from unauthorized access.
          </PolicySection>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
