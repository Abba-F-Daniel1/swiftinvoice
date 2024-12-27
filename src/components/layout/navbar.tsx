import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

export function Navbar({ toggleDarkMode, isDarkMode }: NavbarProps) {
  const { user, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 dark:group-hover:from-purple-400 dark:group-hover:to-blue-400 transition-all duration-300">
                SwiftInvoice
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div 
              className="flex items-center space-x-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <motion.div variants={navItemVariants}>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  About
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants}>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  Contact
                </Link>
              </motion.div>

              {isSignedIn && (
                <>
                  <motion.div variants={navItemVariants}>
                    <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.div variants={navItemVariants}>
                    <Link to="/clients" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      Clients
                    </Link>
                  </motion.div>
                  <motion.div variants={navItemVariants}>
                    <Link to="/invoices" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      Invoices
                    </Link>
                  </motion.div>
                  <motion.div variants={navItemVariants}>
                    <Link to="/services" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      Services
                    </Link>
                  </motion.div>
                  <motion.div variants={navItemVariants}>
                    <Link to="/settings" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      Settings
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isDarkMode ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                  )}
                </motion.div>
              </Button>

              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-medium px-6 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl">
                    Sign In
                  </Button>
                </SignInButton>
              ) : (
                <SignOutButton>
                  <Button variant="destructive" className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 dark:from-red-500 dark:to-pink-500 dark:hover:from-red-600 dark:hover:to-pink-600 text-white font-medium px-6 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl">
                    Sign Out
                  </Button>
                </SignOutButton>
              )}
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                )}
              </motion.div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg"
          >
            <motion.div 
              className="px-4 py-3 space-y-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <motion.div variants={navItemVariants}>
                <Link
                  to="/about"
                  className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  About
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants}>
                <Link
                  to="/contact"
                  className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  Contact
                </Link>
              </motion.div>
              
              {isSignedIn && (
                <>
                  <motion.div variants={navItemVariants}>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.div variants={navItemVariants}>
                    <Link
                      to="/clients"
                      className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      Clients
                    </Link>
                  </motion.div>
                  <motion.div variants={navItemVariants}>
                    <Link
                      to="/invoices"
                      className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      Invoices
                    </Link>
                  </motion.div>
                  <motion.div variants={navItemVariants}>
                    <Link
                      to="/services"
                      className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      Services
                    </Link>
                  </motion.div>
                  <motion.div variants={navItemVariants}>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      Settings
                    </Link>
                  </motion.div>
                </>
              )}
              
              <motion.div variants={navItemVariants} className="pt-2">
                {!isSignedIn ? (
                  <SignInButton mode="modal">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-medium py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                      Sign In
                    </Button>
                  </SignInButton>
                ) : (
                  <SignOutButton>
                    <Button variant="destructive" className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 dark:from-red-500 dark:to-pink-500 dark:hover:from-red-600 dark:hover:to-pink-600 text-white font-medium py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                      Sign Out
                    </Button>
                  </SignOutButton>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}