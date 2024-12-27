import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  CreditCard,
  Bell,
  BarChart,
  Users,
  Settings,
} from "lucide-react";

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

const Home = () => {
  const features = [
    {
      title: "Task Management",
      description:
        "Streamline your invoicing process with task-based input for effortless organization and tracking of billable services.",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Collaboration Tools",
      description:
        "Enable seamless client interactions by sharing drafts and collaboratively refining invoices for accuracy.",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Real-time Notifications",
      description:
        "Receive instant updates on invoice generation and client engagement, ensuring you never miss a milestone.",
      icon: Bell,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Customizable Dashboard",
      description: "Tailor the interface to prioritize your most frequently used features, optimizing your workflow efficiency.",
      icon: BarChart,
      gradient: "from-green-500 to-teal-500",
    },
    {
      title: "Payment Processing",
      description: "Incorporate secure, integrated payment gateways to manage transactions directly from your invoices.",
      icon: CreditCard,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      title: "Advanced Settings",
      description: "Leverage detailed configuration options to align the invoice generation process with your unique business needs.",
      icon: Settings,
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <motion.div
      className="page-container min-h-screen"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <div className="text-center max-w-4xl mx-auto pt-16 px-4">
        <motion.div variants={fadeInUp}>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
            Swift & Simple Invoicing
          </h1>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
        >
          Professional invoicing made easy for freelancers and small businesses
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap gap-4 justify-center mb-20"
        ></motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1 },
                },
              }}
              className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-xl inline-block mb-4`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
