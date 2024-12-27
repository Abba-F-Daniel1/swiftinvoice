import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Target, MessageCircle, Award, Heart } from "lucide-react";

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

const About = () => {
  const teamMembers = [
    {
      name: "Abba Daniel",
      role: "CEO & Founder",
      image: "https://res.cloudinary.com/doetven6z/image/upload/v1724310010/IMG_20231126_125533_424_eylfyi.jpg",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      name: "Sarah Johnson",
      role: "Head of Design",
      image: "https://res.cloudinary.com/doetven6z/image/upload/v1735289809/jen_okmybb.png",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Abba Daniel",
      role: "Lead Developer(Full Stack)",
      image: "https://res.cloudinary.com/doetven6z/image/upload/v1724310010/IMG_20231126_125533_424_eylfyi.jpg",
      gradient: "from-pink-500 to-red-500",
    },
  ];

  const values = [
    {
      title: "Customer First",
      description: "We put our customers at the heart of everything we do",
      icon: Heart,
      gradient: "from-pink-500 to-red-500",
    },
    {
      title: "Innovation",
      description: "Constantly improving and innovating our services",
      icon: Target,
      gradient: "from-blue-500 to-purple-500",
    },
    {
      title: "Quality",
      description: "Delivering excellence in every aspect of our service",
      icon: Award,
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <motion.div
      className="page-container"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <motion.div
        variants={fadeInUp}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6">
          About SwiftInvoice
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          We're on a mission to simplify invoicing and empower businesses
          worldwide
        </p>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-20 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
            Our Story
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Founded in 2024, SwiftInvoice emerged from a simple idea: make
            invoicing painless for small businesses and freelancers. What
            started as a simple tool has grown into a comprehensive platform
            trusted by thousands of users worldwide.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Our team combines years of experience in financial technology with a
            passion for supporting small businesses. We understand the
            challenges you face because we've been there ourselves.
          </p>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="mb-20">
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900 dark:text-white">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1 },
                },
              }}
              className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className={`bg-gradient-to-r ${value.gradient} p-4 rounded-xl inline-block mb-6`}
              >
                <value.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900 dark:text-white">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1 },
                },
              }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`bg-gradient-to-r ${member.gradient} p-1 rounded-full inline-block mb-6`}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {member.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="mt-20 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
          Want to Learn More?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          We'd love to hear from you and answer any questions you might have.
        </p>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          <MessageCircle className="mr-2 h-5 w-5" />
          Contact Us
        </Button>
      </motion.div>
    </motion.div>
  );
};
export default About;
